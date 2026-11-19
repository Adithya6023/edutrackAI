import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  createSeedWorkspace,
  getStorageFilePath,
  readWorkspace,
  writeWorkspace,
} from './server/db.ts';
import type {
  Assignment,
  AssignmentStatus,
  CalendarEvent,
  Course,
  HealthStatus,
  SubmissionStatus,
  UserProfile,
} from './src/shared/types.ts';

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // Ensure initial database file exists on startup
  readWorkspace();

  app.get('/api/health', (_req, res) => {
    const data = readWorkspace();
    const health: HealthStatus = {
      status: 'connected',
      engine: 'Express REST + Persistent JSON Store',
      storagePath: path.relative(process.cwd(), getStorageFilePath()),
      lastPersistedAt: data.lastUpdatedAt,
      counts: {
        courses: data.courses.length,
        assignments: data.assignments.length,
        submissions: data.submissions.length,
        calendarEvents: data.calendarEvents.length,
      },
    };
    res.json(health);
  });

  app.get('/api/workspace', (_req, res) => {
    const data = readWorkspace();
    res.json(data);
  });

  app.patch('/api/profile', (req, res) => {
    const data = readWorkspace();
    const patch = req.body as Partial<UserProfile>;
    data.profile = {
      ...data.profile,
      ...patch,
    };
    const saved = writeWorkspace(data);
    res.json(saved);
  });

  app.post('/api/courses', (req, res) => {
    const data = readWorkspace();
    const body = req.body as {
      code?: string;
      title?: string;
      department?: string;
      instructor?: string;
      credits?: number;
      schedule?: string;
      room?: string;
    };

    if (!body.code?.trim() || !body.title?.trim()) {
      res.status(400).json({ error: 'Course code and title are required.' });
      return;
    }

    const newCourse: Course = {
      id: `crs-${Date.now()}`,
      code: body.code.trim().toUpperCase(),
      title: body.title.trim(),
      department: body.department?.trim() || 'Computer Science',
      instructor: body.instructor?.trim() || 'Dr. Marcus Thorne',
      credits: Number(body.credits) || 3,
      schedule: body.schedule?.trim() || 'Tue / Thu · 10:00–11:30',
      room: body.room?.trim() || 'Turing Hall 210',
      term: data.profile.activeTerm,
      currentGrade: 92.0,
      status: 'active',
      syllabusModules: [
        { id: `m-${Date.now()}-1`, week: 1, title: 'Foundational Principles & Syllabus Scope', completed: true },
        { id: `m-${Date.now()}-2`, week: 2, title: 'Core Analytical Frameworks', completed: false },
        { id: `m-${Date.now()}-3`, week: 3, title: 'Applied Seminar & Capstone Synthesis', completed: false },
      ],
    };

    data.courses.unshift(newCourse);
    const saved = writeWorkspace(data);
    res.status(201).json(saved);
  });

  app.patch('/api/courses/:courseId/modules/:moduleId', (req, res) => {
    const data = readWorkspace();
    const { courseId, moduleId } = req.params;
    const course = data.courses.find((c) => c.id === courseId);
    if (!course) {
      res.status(404).json({ error: 'Course not found.' });
      return;
    }
    const mod = course.syllabusModules.find((m) => m.id === moduleId);
    if (!mod) {
      res.status(404).json({ error: 'Syllabus module not found.' });
      return;
    }
    mod.completed = typeof req.body.completed === 'boolean' ? req.body.completed : !mod.completed;
    const saved = writeWorkspace(data);
    res.json(saved);
  });

  app.delete('/api/courses/:courseId', (req, res) => {
    const data = readWorkspace();
    const { courseId } = req.params;
    data.courses = data.courses.filter((c) => c.id !== courseId);
    const saved = writeWorkspace(data);
    res.json(saved);
  });

  app.post('/api/assignments', (req, res) => {
    const data = readWorkspace();
    const body = req.body as {
      courseId?: string;
      title?: string;
      description?: string;
      dueDate?: string;
      priority?: 'high' | 'medium' | 'low';
      weightPercent?: number;
      milestoneTitles?: string[];
    };

    if (!body.title?.trim() || !body.courseId || !body.dueDate) {
      res.status(400).json({ error: 'Title, course, and due date are required.' });
      return;
    }

    const course = data.courses.find((c) => c.id === body.courseId);
    if (!course) {
      res.status(404).json({ error: 'Selected course does not exist.' });
      return;
    }

    const milestonesRaw =
      Array.isArray(body.milestoneTitles) && body.milestoneTitles.length > 0
        ? body.milestoneTitles.filter((t) => t.trim().length > 0)
        : ['Initial outline & research', 'Core draft implementation', 'Final verification & submission'];

    const newAssignment: Assignment = {
      id: `asg-${Date.now()}`,
      courseId: course.id,
      courseCode: course.code,
      title: body.title.trim(),
      description: body.description?.trim() || 'Academic coursework deliverable tracked in EduTrack AI.',
      dueDate: body.dueDate,
      status: 'in_progress',
      priority: body.priority || 'medium',
      weightPercent: Number(body.weightPercent) || 15,
      grade: null,
      submittedAt: null,
      submissionNote: null,
      milestones: milestonesRaw.map((title, idx) => ({
        id: `ms-${Date.now()}-${idx}`,
        title: title.trim(),
        completed: false,
        dueDate: body.dueDate!,
      })),
    };

    data.assignments.unshift(newAssignment);
    const saved = writeWorkspace(data);
    res.status(201).json(saved);
  });

  app.patch('/api/assignments/:assignmentId', (req, res) => {
    const data = readWorkspace();
    const { assignmentId } = req.params;
    const assignment = data.assignments.find((a) => a.id === assignmentId);
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found.' });
      return;
    }

    const body = req.body as {
      status?: AssignmentStatus;
      priority?: 'high' | 'medium' | 'low';
      dueDate?: string;
      submissionNote?: string;
      submitWork?: boolean;
    };

    if (body.status) assignment.status = body.status;
    if (body.priority) assignment.priority = body.priority;
    if (body.dueDate) assignment.dueDate = body.dueDate;
    if (typeof body.submissionNote === 'string') assignment.submissionNote = body.submissionNote;

    if (body.submitWork) {
      assignment.status = 'completed';
      assignment.submittedAt = new Date().toISOString().slice(0, 10);
      assignment.milestones = assignment.milestones.map((m) => ({ ...m, completed: true }));
      data.submissions.unshift({
        id: `sub-${Date.now()}`,
        studentName: data.profile.studentName,
        studentId: data.profile.studentId,
        courseCode: assignment.courseCode,
        assignmentTitle: assignment.title,
        submittedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        artifactUrl: `${assignment.courseCode.toLowerCase()}-submission.pdf`,
        notes: body.submissionNote?.trim() || 'Submitted via EduTrack AI student workspace.',
        status: 'pending_review',
        score: null,
        feedback: '',
        rubric: [
          { name: 'Technical Correctness', maxPoints: 40, awardedPoints: 36 },
          { name: 'Methodology & Analysis', maxPoints: 35, awardedPoints: 32 },
          { name: 'Documentation & Clarity', maxPoints: 25, awardedPoints: 23 },
        ],
      });
    }

    const saved = writeWorkspace(data);
    res.json(saved);
  });

  app.patch('/api/assignments/:assignmentId/milestones/:milestoneId', (req, res) => {
    const data = readWorkspace();
    const { assignmentId, milestoneId } = req.params;
    const assignment = data.assignments.find((a) => a.id === assignmentId);
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found.' });
      return;
    }
    const milestone = assignment.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      res.status(404).json({ error: 'Milestone not found.' });
      return;
    }

    milestone.completed =
      typeof req.body.completed === 'boolean' ? req.body.completed : !milestone.completed;

    const allDone =
      assignment.milestones.length > 0 && assignment.milestones.every((m) => m.completed);
    if (allDone && assignment.status !== 'completed') {
      assignment.status = 'completed';
      assignment.submittedAt = new Date().toISOString().slice(0, 10);
    } else if (!allDone && assignment.status === 'completed') {
      assignment.status = 'in_progress';
      assignment.submittedAt = null;
    }

    const saved = writeWorkspace(data);
    res.json(saved);
  });

  app.delete('/api/assignments/:assignmentId', (req, res) => {
    const data = readWorkspace();
    const { assignmentId } = req.params;
    data.assignments = data.assignments.filter((a) => a.id !== assignmentId);
    const saved = writeWorkspace(data);
    res.json(saved);
  });

  app.patch('/api/submissions/:submissionId', (req, res) => {
    const data = readWorkspace();
    const { submissionId } = req.params;
    const sub = data.submissions.find((s) => s.id === submissionId);
    if (!sub) {
      res.status(404).json({ error: 'Submission not found.' });
      return;
    }

    const body = req.body as {
      status?: SubmissionStatus;
      score?: number | null;
      feedback?: string;
      rubric?: { name: string; maxPoints: number; awardedPoints: number }[];
    };

    if (body.rubric && Array.isArray(body.rubric)) {
      sub.rubric = body.rubric;
    }
    if (typeof body.score === 'number') {
      sub.score = Math.max(0, Math.min(100, Math.round(body.score)));
    }
    if (typeof body.feedback === 'string') {
      sub.feedback = body.feedback;
    }
    if (body.status) {
      sub.status = body.status;
    }

    // Sync grade back to matching student assignment if applicable
    if (sub.studentId === data.profile.studentId && sub.score !== null) {
      const matched = data.assignments.find(
        (a) => a.courseCode === sub.courseCode && a.title === sub.assignmentTitle
      );
      if (matched) {
        matched.grade = sub.score;
        if (sub.status === 'graded') {
          matched.status = 'completed';
        }
      }
    }

    const saved = writeWorkspace(data);
    res.json(saved);
  });

  app.post('/api/calendar', (req, res) => {
    const data = readWorkspace();
    const body = req.body as Partial<CalendarEvent>;
    if (!body.title?.trim() || !body.date) {
      res.status(400).json({ error: 'Event title and date are required.' });
      return;
    }
    const event: CalendarEvent = {
      id: `cal-${Date.now()}`,
      title: body.title.trim(),
      courseCode: body.courseCode?.trim() || 'GENERAL',
      date: body.date,
      time: body.time?.trim() || '10:00 AM',
      location: body.location?.trim() || 'Academic Center',
      type: body.type || 'lecture',
    };
    data.calendarEvents.push(event);
    data.calendarEvents.sort((a, b) => a.date.localeCompare(b.date));
    const saved = writeWorkspace(data);
    res.status(201).json(saved);
  });

  app.delete('/api/calendar/:eventId', (req, res) => {
    const data = readWorkspace();
    data.calendarEvents = data.calendarEvents.filter((e) => e.id !== req.params.eventId);
    const saved = writeWorkspace(data);
    res.json(saved);
  });

  app.patch('/api/analytics/at-risk/:studentRecordId', (req, res) => {
    const data = readWorkspace();
    const record = data.atRiskStudents.find((r) => r.id === req.params.studentRecordId);
    if (!record) {
      res.status(404).json({ error: 'Student intervention record not found.' });
      return;
    }
    const nextStatus = req.body.advisorStatus as 'Scheduled' | 'Outreach Sent' | 'Pending Action';
    if (nextStatus) {
      record.advisorStatus = nextStatus;
    }
    const saved = writeWorkspace(data);
    res.json(saved);
  });

  app.get('/api/export', (_req, res) => {
    const data = readWorkspace();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="edutrack-workspace.json"');
    res.send(JSON.stringify(data, null, 2));
  });

  app.post('/api/admin/reset', (_req, res) => {
    const seed = createSeedWorkspace();
    const saved = writeWorkspace(seed);
    res.json(saved);
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexHtml = path.join(distDir, 'index.html');
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduTrack AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start EduTrack AI server:', err);
  process.exit(1);
});
