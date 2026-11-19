import { AlertCircle, CheckCircle2, Clock, CircleDot } from 'lucide-react';
import type { AssignmentStatus, CalendarEventType, PriorityLevel, SubmissionStatus } from '../shared/types';

export function AssignmentStatusLabel({ status }: { status: AssignmentStatus }) {
  switch (status) {
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1.5 h-6 px-2 rounded-md bg-[#ECFDF5] text-[#065F46] text-xs font-medium whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" strokeWidth={1.75} />
          Completed
        </span>
      );
    case 'due_soon':
      return (
        <span className="inline-flex items-center gap-1.5 h-6 px-2 rounded-md bg-[#FFFBEB] text-[#92400E] text-xs font-medium whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-[#F59E0B]" strokeWidth={1.75} />
          Due Soon
        </span>
      );
    case 'overdue':
      return (
        <span className="inline-flex items-center gap-1.5 h-6 px-2 rounded-md bg-[#FEF2F2] text-[#991B1B] text-xs font-medium whitespace-nowrap">
          <AlertCircle className="w-3.5 h-3.5 text-[#EF4444]" strokeWidth={1.75} />
          Overdue
        </span>
      );
    case 'in_progress':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 h-6 px-2 rounded-md bg-[#EEF2FF] text-[#3730A3] text-xs font-medium whitespace-nowrap">
          <CircleDot className="w-3.5 h-3.5 text-[#4F46E5]" strokeWidth={1.75} />
          In Progress
        </span>
      );
  }
}

export function SubmissionStatusLabel({ status }: { status: SubmissionStatus }) {
  switch (status) {
    case 'graded':
      return (
        <span className="inline-flex items-center gap-1.5 h-6 px-2 rounded-md bg-[#ECFDF5] text-[#065F46] text-xs font-medium whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" strokeWidth={1.75} />
          Graded
        </span>
      );
    case 'needs_revision':
      return (
        <span className="inline-flex items-center gap-1.5 h-6 px-2 rounded-md bg-[#FEF2F2] text-[#991B1B] text-xs font-medium whitespace-nowrap">
          <AlertCircle className="w-3.5 h-3.5 text-[#EF4444]" strokeWidth={1.75} />
          Needs Revision
        </span>
      );
    case 'pending_review':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 h-6 px-2 rounded-md bg-[#FFFBEB] text-[#92400E] text-xs font-medium whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-[#F59E0B]" strokeWidth={1.75} />
          Pending Review
        </span>
      );
  }
}

export function PriorityText({ priority }: { priority: PriorityLevel }) {
  const styles: Record<PriorityLevel, string> = {
    high: 'text-[#991B1B]',
    medium: 'text-[#92400E]',
    low: 'text-[#64748B]',
  };
  const labels: Record<PriorityLevel, string> = {
    high: 'High Priority',
    medium: 'Standard',
    low: 'Low',
  };
  return <span className={`text-xs font-medium ${styles[priority]}`}>{labels[priority]}</span>;
}

export function CalendarTypeLabel({ type }: { type: CalendarEventType }) {
  const config: Record<CalendarEventType, { bg: string; text: string; label: string }> = {
    deadline: { bg: 'bg-[#FEF2F2]', text: 'text-[#991B1B]', label: 'Deadline' },
    exam: { bg: 'bg-[#FFFBEB]', text: 'text-[#92400E]', label: 'Exam' },
    lecture: { bg: 'bg-[#EEF2FF]', text: 'text-[#3730A3]', label: 'Lecture' },
    lab: { bg: 'bg-[#ECFDF5]', text: 'text-[#065F46]', label: 'Lab' },
    office_hours: { bg: 'bg-[#F1F5F9]', text: 'text-[#334155]', label: 'Office Hours' },
  };
  const item = config[type];
  return (
    <span className={`inline-flex items-center h-6 px-2 rounded-md text-xs font-medium whitespace-nowrap ${item.bg} ${item.text}`}>
      {item.label}
    </span>
  );
}
