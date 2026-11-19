import type {
  AssignmentStatus,
  CalendarEventType,
  HealthStatus,
  PriorityLevel,
  SubmissionStatus,
  UserProfile,
  WorkspaceData,
} from '../shared/types';

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const errBody = (await res.json()) as { error?: string };
      if (errBody.error) message = errBody.error;
    } catch {
      // ignore non-json error bodies
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getHealth: () => requestJson<HealthStatus>('/api/health'),
  getWorkspace: () => requestJson<WorkspaceData>('/api/workspace'),
  updateProfile: (patch: Partial<UserProfile>) =>
    requestJson<WorkspaceData>('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),
  createCourse: (payload: {
    code: string;
    title: string;
    department: string;
    instructor: string;
    credits: number;
    schedule: string;
    room: string;
  }) =>
    requestJson<WorkspaceData>('/api/courses', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  toggleCourseModule: (courseId: string, moduleId: string, completed: boolean) =>
    requestJson<WorkspaceData>(`/api/courses/${courseId}/modules/${moduleId}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    }),
  deleteCourse: (courseId: string) =>
    requestJson<WorkspaceData>(`/api/courses/${courseId}`, {
      method: 'DELETE',
    }),
  createAssignment: (payload: {
    courseId: string;
    title: string;
    description: string;
    dueDate: string;
    priority: PriorityLevel;
    weightPercent: number;
    milestoneTitles: string[];
  }) =>
    requestJson<WorkspaceData>('/api/assignments', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateAssignment: (
    assignmentId: string,
    payload: {
      status?: AssignmentStatus;
      priority?: PriorityLevel;
      dueDate?: string;
      submissionNote?: string;
      submitWork?: boolean;
    }
  ) =>
    requestJson<WorkspaceData>(`/api/assignments/${assignmentId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  toggleMilestone: (assignmentId: string, milestoneId: string, completed: boolean) =>
    requestJson<WorkspaceData>(`/api/assignments/${assignmentId}/milestones/${milestoneId}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    }),
  deleteAssignment: (assignmentId: string) =>
    requestJson<WorkspaceData>(`/api/assignments/${assignmentId}`, {
      method: 'DELETE',
    }),
  gradeSubmission: (
    submissionId: string,
    payload: {
      status: SubmissionStatus;
      score: number | null;
      feedback: string;
      rubric: { name: string; maxPoints: number; awardedPoints: number }[];
    }
  ) =>
    requestJson<WorkspaceData>(`/api/submissions/${submissionId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  createCalendarEvent: (payload: {
    title: string;
    courseCode: string;
    date: string;
    time: string;
    location: string;
    type: CalendarEventType;
  }) =>
    requestJson<WorkspaceData>('/api/calendar', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  deleteCalendarEvent: (eventId: string) =>
    requestJson<WorkspaceData>(`/api/calendar/${eventId}`, {
      method: 'DELETE',
    }),
  updateAtRiskStatus: (
    recordId: string,
    advisorStatus: 'Scheduled' | 'Outreach Sent' | 'Pending Action'
  ) =>
    requestJson<WorkspaceData>(`/api/analytics/at-risk/${recordId}`, {
      method: 'PATCH',
      body: JSON.stringify({ advisorStatus }),
    }),
  resetWorkspace: () =>
    requestJson<WorkspaceData>('/api/admin/reset', {
      method: 'POST',
    }),
};
