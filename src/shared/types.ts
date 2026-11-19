export type UserRole = 'student' | 'faculty' | 'admin';

export type ScreenId =
  | 'overview'
  | 'courses'
  | 'assignments'
  | 'calendar'
  | 'grading'
  | 'analytics'
  | 'settings';

export type AssignmentStatus = 'in_progress' | 'due_soon' | 'completed' | 'overdue';

export type PriorityLevel = 'high' | 'medium' | 'low';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseCode: string;
  title: string;
  description: string;
  dueDate: string;
  status: AssignmentStatus;
  priority: PriorityLevel;
  weightPercent: number;
  grade: number | null;
  submittedAt: string | null;
  submissionNote: string | null;
  milestones: Milestone[];
}

export interface SyllabusModule {
  id: string;
  week: number;
  title: string;
  completed: boolean;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  department: string;
  instructor: string;
  credits: number;
  schedule: string;
  room: string;
  term: string;
  currentGrade: number;
  status: 'active' | 'completed';
  syllabusModules: SyllabusModule[];
}

export type SubmissionStatus = 'pending_review' | 'graded' | 'needs_revision';

export interface RubricCriterion {
  name: string;
  maxPoints: number;
  awardedPoints: number;
}

export interface FacultySubmission {
  id: string;
  studentName: string;
  studentId: string;
  courseCode: string;
  assignmentTitle: string;
  submittedAt: string;
  artifactUrl: string;
  notes: string;
  status: SubmissionStatus;
  score: number | null;
  feedback: string;
  rubric: RubricCriterion[];
}

export type CalendarEventType = 'lecture' | 'deadline' | 'exam' | 'lab' | 'office_hours';

export interface CalendarEvent {
  id: string;
  title: string;
  courseCode: string;
  date: string;
  time: string;
  location: string;
  type: CalendarEventType;
}

export interface DepartmentMetric {
  id: string;
  department: string;
  enrolledStudents: number;
  completionRate: number;
  averageGpa: number;
  onTimeSubmissionRate: number;
  atRiskCount: number;
}

export interface TermTrendPoint {
  term: string;
  averageGpa: number;
  completionRate: number;
}

export interface AtRiskStudent {
  id: string;
  studentName: string;
  studentId: string;
  department: string;
  courseCode: string;
  currentScore: number;
  missedDeadlines: number;
  advisorStatus: 'Scheduled' | 'Outreach Sent' | 'Pending Action';
}

export interface UserProfile {
  activeRole: UserRole;
  activeTerm: string;
  dueSoonThresholdDays: number;
  weeklyDigestEnabled: boolean;
  studentName: string;
  studentEmail: string;
  studentId: string;
  program: string;
  facultyName: string;
  facultyEmail: string;
  facultyTitle: string;
  adminName: string;
  adminEmail: string;
  institutionName: string;
}

export interface WorkspaceData {
  profile: UserProfile;
  courses: Course[];
  assignments: Assignment[];
  submissions: FacultySubmission[];
  calendarEvents: CalendarEvent[];
  departmentMetrics: DepartmentMetric[];
  termTrends: TermTrendPoint[];
  atRiskStudents: AtRiskStudent[];
  lastUpdatedAt: string;
}

export interface HealthStatus {
  status: 'connected';
  engine: string;
  storagePath: string;
  lastPersistedAt: string;
  counts: {
    courses: number;
    assignments: number;
    submissions: number;
    calendarEvents: number;
  };
}
