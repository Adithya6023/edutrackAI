import { useState } from 'react';
import { Check, Search, Send, Trash2, X } from 'lucide-react';
import type { Assignment, AssignmentStatus, PriorityLevel, WorkspaceData } from '../shared/types';
import { AssignmentStatusLabel, PriorityText } from './StatusLabel';

interface AssignmentsScreenProps {
  workspace: WorkspaceData;
  onToggleMilestone: (assignmentId: string, milestoneId: string, completed: boolean) => void;
  onCreateAssignment: (payload: {
    courseId: string;
    title: string;
    description: string;
    dueDate: string;
    priority: PriorityLevel;
    weightPercent: number;
    milestoneTitles: string[];
  }) => Promise<void>;
  onSubmitWork: (assignmentId: string, submissionNote: string) => Promise<void>;
  onDeleteAssignment: (assignmentId: string) => Promise<void>;
  createModalOpen: boolean;
  onCloseCreateModal: () => void;
  onOpenCreateModal: () => void;
}

const STATUS_TABS: { id: 'all' | AssignmentStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'due_soon', label: 'Due Soon' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'completed', label: 'Completed' },
];

export function AssignmentsScreen({
  workspace,
  onToggleMilestone,
  onCreateAssignment,
  onSubmitWork,
  onDeleteAssignment,
  createModalOpen,
  onCloseCreateModal,
  onOpenCreateModal,
}: AssignmentsScreenProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | AssignmentStatus>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submissionNote, setSubmissionNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Create form state
  const [courseId, setCourseId] = useState(workspace.courses[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-29');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [weightPercent, setWeightPercent] = useState(15);
  const [milestonesText, setMilestonesText] = useState(
    'Literature & spec review\nCore implementation\nVerification & final write-up'
  );

  const selectedAssignment: Assignment | undefined = workspace.assignments.find(
    (a) => a.id === selectedId
  );

  const filtered = workspace.assignments.filter((a) => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesCourse = courseFilter === 'all' || a.courseId === courseFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.courseCode.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q);
    return matchesStatus && matchesCourse && matchesSearch;
  });

  async function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    const targetCourseId = courseId || workspace.courses[0]?.id;
    if (!title.trim() || !targetCourseId) return;
    setSubmitting(true);
    try {
      await onCreateAssignment({
        courseId: targetCourseId,
        title,
        description,
        dueDate,
        priority,
        weightPercent,
        milestoneTitles: milestonesText
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean),
      });
      setTitle('');
      setDescription('');
      onCloseCreateModal();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmitDeliverable(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAssignment) return;
    setSubmitting(true);
    try {
      await onSubmitWork(selectedAssignment.id, submissionNote);
      setSubmissionNote('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-white border border-[#E2E8F0] rounded-lg w-fit">
          {STATUS_TABS.map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`h-8 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  active ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            aria-label="Filter by course"
            className="h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
          >
            <option value="all">All Courses</option>
            {workspace.courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} · {c.title}
              </option>
            ))}
          </select>

          <div className="relative w-full sm:w-64">
            <Search
              className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              strokeWidth={1.75}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assignments..."
              className="w-full h-10 pl-9 pr-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/15"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(15,23,42,0.05)] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="font-display text-base font-semibold text-[#0F172A]">
              No assignments match the active filters
            </h3>
            <p className="mt-1 text-sm text-[#64748B]">
              Clear your search or log a new assignment milestone.
            </p>
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="mt-4 h-10 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium transition-colors"
            >
              Create Assignment
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="h-11 bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs font-medium text-[#64748B]">
                  <th className="px-6 font-medium">Deliverable</th>
                  <th className="px-4 font-medium">Priority</th>
                  <th className="px-4 font-medium">Due Date</th>
                  <th className="px-4 font-medium">Milestones</th>
                  <th className="px-4 font-medium">Status</th>
                  <th className="px-6 font-medium text-right">Grade / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filtered.map((asg) => {
                  const done = asg.milestones.filter((m) => m.completed).length;
                  const total = asg.milestones.length;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

                  return (
                    <tr
                      key={asg.id}
                      onClick={() => setSelectedId(asg.id)}
                      className="h-14 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-3">
                        <div className="text-sm font-medium text-[#0F172A]">{asg.title}</div>
                        <div className="text-xs text-[#64748B] font-mono tabular-nums">
                          {asg.courseCode} · Weight {asg.weightPercent}%
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <PriorityText priority={asg.priority} />
                      </td>
                      <td className="px-4 py-3 text-xs font-mono tabular-nums text-[#0F172A] whitespace-nowrap">
                        {asg.dueDate}
                      </td>
                      <td className="px-4 py-3 min-w-[160px]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-24 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                            <div
                              className="h-full bg-[#4F46E5] rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono tabular-nums text-[#64748B]">
                            {done}/{total}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <AssignmentStatusLabel status={asg.status} />
                      </td>
                      <td className="px-6 py-3 text-right whitespace-nowrap">
                        {asg.grade !== null ? (
                          <span className="font-mono text-sm font-semibold text-[#065F46] tabular-nums">
                            {asg.grade}/100
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(asg.id);
                            }}
                            className="text-xs font-medium text-[#4F46E5] hover:text-[#4338CA]"
                          >
                            Manage
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#0F172A]/40">
          <div className="w-full max-w-md bg-white h-full border-l border-[#E2E8F0] shadow-[0_10px_15px_-3px_rgba(15,23,42,0.08)] flex flex-col">
            <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs font-mono text-[#64748B]">
                  {selectedAssignment.courseCode} · Due {selectedAssignment.dueDate}
                </div>
                <h3 className="font-display text-base font-semibold text-[#0F172A] truncate">
                  {selectedAssignment.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <AssignmentStatusLabel status={selectedAssignment.status} />
                  <PriorityText priority={selectedAssignment.priority} />
                </div>
                <p className="mt-3 text-sm text-[#475569] leading-relaxed">
                  {selectedAssignment.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F1F5F9]">
                <h4 className="text-sm font-semibold text-[#0F172A] mb-3">
                  Milestone Checklist
                </h4>
                <div className="space-y-2">
                  {selectedAssignment.milestones.map((ms) => (
                    <div
                      key={ms.id}
                      onClick={() =>
                        onToggleMilestone(selectedAssignment.id, ms.id, !ms.completed)
                      }
                      className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={ms.completed}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleMilestone(selectedAssignment.id, ms.id, !ms.completed);
                          }}
                          className={`w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center shrink-0 ${
                            ms.completed
                              ? 'bg-[#4F46E5] border-[#4F46E5] text-white'
                              : 'bg-white border-[#CBD5E1]'
                          }`}
                        >
                          {ms.completed && <Check className="w-3 h-3" strokeWidth={2.5} />}
                        </button>
                        <span
                          className={`text-sm ${
                            ms.completed ? 'line-through text-[#64748B]' : 'text-[#0F172A]'
                          }`}
                        >
                          {ms.title}
                        </span>
                      </div>
                      <span className="text-xs font-mono tabular-nums text-[#64748B] shrink-0">
                        {ms.dueDate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#F1F5F9]">
                {selectedAssignment.status === 'completed' ? (
                  <div className="p-4 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-sm text-[#065F46]">
                    <div className="font-medium">
                      Submitted {selectedAssignment.submittedAt || 'on time'}
                    </div>
                    {selectedAssignment.submissionNote && (
                      <p className="mt-1 text-xs">{selectedAssignment.submissionNote}</p>
                    )}
                    {selectedAssignment.grade !== null && (
                      <div className="mt-2 font-mono font-semibold tabular-nums">
                        Final Score: {selectedAssignment.grade}/100
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmitDeliverable} className="space-y-3">
                    <label className="block text-sm font-medium text-[#0F172A]">
                      Submit Deliverable Notes
                    </label>
                    <textarea
                      rows={3}
                      value={submissionNote}
                      onChange={(e) => setSubmissionNote(e.target.value)}
                      placeholder="Summarize implementation details, repository commit, or notes for faculty review..."
                      className="w-full p-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/15"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium disabled:opacity-60"
                    >
                      <Send className="w-4 h-4" strokeWidth={1.75} />
                      <span>{submitting ? 'Submitting…' : 'Submit to Faculty Queue'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#F1F5F9] flex items-center justify-between">
              <button
                type="button"
                onClick={async () => {
                  const id = selectedAssignment.id;
                  setSelectedId(null);
                  await onDeleteAssignment(id);
                }}
                className="h-9 px-3 inline-flex items-center gap-1.5 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] text-[#EF4444] hover:bg-[#EF4444] hover:text-white text-xs font-medium transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Delete Assignment</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="h-9 px-4 rounded-lg bg-white border border-[#E2E8F0] text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40">
          <div className="w-full max-w-lg bg-white rounded-xl border border-[#E2E8F0] shadow-[0_10px_15px_-3px_rgba(15,23,42,0.08)]">
            <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-[#0F172A]">
                Create Assignment
              </h3>
              <button
                type="button"
                onClick={onCloseCreateModal}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Course</label>
                  <select
                    value={courseId || workspace.courses[0]?.id || ''}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                  >
                    {workspace.courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} — {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Distributed Snapshot Verification Lab"
                  className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/15"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                    className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Standard</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                    Weight (%)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={weightPercent}
                    onChange={(e) => setWeightPercent(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm tabular-nums text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deliverable scope and rubric expectations..."
                  className="w-full p-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                  Milestones (one per line)
                </label>
                <textarea
                  rows={3}
                  value={milestonesText}
                  onChange={(e) => setMilestonesText(e.target.value)}
                  className="w-full p-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onCloseCreateModal}
                  className="h-10 px-4 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-sm font-medium text-[#0F172A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-10 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium disabled:opacity-60"
                >
                  {submitting ? 'Creating…' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
