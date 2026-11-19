import { useEffect, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import type { FacultySubmission, RubricCriterion, SubmissionStatus, WorkspaceData } from '../shared/types';
import { SubmissionStatusLabel } from './StatusLabel';

interface FacultyGradingScreenProps {
  workspace: WorkspaceData;
  onGradeSubmission: (
    submissionId: string,
    payload: {
      status: SubmissionStatus;
      score: number | null;
      feedback: string;
      rubric: RubricCriterion[];
    }
  ) => Promise<void>;
}

const FILTERS: { id: 'all' | SubmissionStatus; label: string }[] = [
  { id: 'all', label: 'All Submissions' },
  { id: 'pending_review', label: 'Pending Review' },
  { id: 'graded', label: 'Graded' },
  { id: 'needs_revision', label: 'Needs Revision' },
];

export function FacultyGradingScreen({
  workspace,
  onGradeSubmission,
}: FacultyGradingScreenProps) {
  const [filter, setFilter] = useState<'all' | SubmissionStatus>('all');
  const [selectedId, setSelectedId] = useState<string>(workspace.submissions[0]?.id || '');
  const [rubric, setRubric] = useState<RubricCriterion[]>([]);
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const filtered = workspace.submissions.filter(
    (s) => filter === 'all' || s.status === filter
  );

  const selected: FacultySubmission | undefined =
    workspace.submissions.find((s) => s.id === selectedId) || filtered[0];

  useEffect(() => {
    if (selected) {
      setSelectedId(selected.id);
      setRubric(selected.rubric.map((r) => ({ ...r })));
      setFeedback(selected.feedback);
    }
  }, [selected?.id]);

  const computedTotal = rubric.reduce((acc, r) => acc + r.awardedPoints, 0);

  function updateCriterion(index: number, value: number) {
    setRubric((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              awardedPoints: Math.max(0, Math.min(item.maxPoints, Math.round(value) || 0)),
            }
          : item
      )
    );
  }

  async function handleSave(status: SubmissionStatus) {
    if (!selected) return;
    setSaving(true);
    try {
      await onGradeSubmission(selected.id, {
        status,
        score: computedTotal,
        feedback,
        rubric,
      });
    } finally {
      setSaving(false);
    }
  }

  function handleExportCsv() {
    const header = ['Student ID', 'Student Name', 'Course', 'Assignment', 'Status', 'Score'];
    const rows = workspace.submissions.map((s) => [
      s.studentId,
      `"${s.studentName.replace(/"/g, '""')}"`,
      s.courseCode,
      `"${s.assignmentTitle.replace(/"/g, '""')}"`,
      s.status,
      s.score !== null ? String(s.score) : '',
    ]);
    const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edutrack-grading-ledger.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-white border border-[#E2E8F0] rounded-lg w-fit">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`h-8 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filter === f.id
                  ? 'bg-[#EEF2FF] text-[#4F46E5]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="h-10 px-4 inline-flex items-center gap-2 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-sm font-medium text-[#0F172A] whitespace-nowrap self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#64748B]" strokeWidth={1.75} />
          <span>Export Grade Ledger CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-6 bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F1F5F9]">
            <h2 className="font-display text-lg font-semibold text-[#0F172A]">
              Student Submissions ({filtered.length})
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Select a submission to evaluate rubric criteria and publish grades
            </p>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#64748B]">
                No submissions in this queue filter.
              </div>
            ) : (
              filtered.map((sub) => {
                const isSelected = selected?.id === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedId(sub.id)}
                    className={`w-full text-left px-6 py-4 transition-colors flex items-start justify-between gap-4 ${
                      isSelected ? 'bg-[#EEF2FF]/60' : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-mono tabular-nums text-[#64748B]">
                        {sub.courseCode} · {sub.studentId} · {sub.submittedAt}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-[#0F172A]">
                        {sub.studentName}
                      </div>
                      <div className="mt-0.5 text-xs text-[#475569] truncate">
                        {sub.assignmentTitle}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <SubmissionStatusLabel status={sub.status} />
                      <span className="text-xs font-mono tabular-nums text-[#0F172A]">
                        {sub.score !== null ? `${sub.score}/100` : 'Unscored'}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="xl:col-span-6 bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(15,23,42,0.05)] p-6">
          {!selected ? (
            <div className="py-12 text-center text-sm text-[#64748B]">
              Select a submission from the queue to begin grading.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#F1F5F9] flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-[#64748B]">
                    {selected.courseCode} · {selected.studentId}
                  </div>
                  <h3 className="mt-1 font-display text-lg font-semibold text-[#0F172A]">
                    {selected.studentName} — {selected.assignmentTitle}
                  </h3>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#4F46E5] font-mono">
                    <FileText className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>{selected.artifactUrl}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#64748B]">Computed Total</div>
                  <div className="font-mono text-2xl font-bold text-[#0F172A] tabular-nums">
                    {computedTotal}
                    <span className="text-sm font-normal text-[#64748B]">/100</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-xs font-medium text-[#64748B]">Student Submission Note</div>
                <p className="mt-1 text-sm text-[#0F172A]">{selected.notes}</p>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-semibold text-[#0F172A]">Rubric Evaluation</div>
                {rubric.map((item, idx) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-4 py-2 border-b border-[#F1F5F9] last:border-b-0"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#0F172A]">{item.name}</div>
                      <div className="text-xs text-[#64748B] font-mono tabular-nums">
                        Max {item.maxPoints} pts
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="number"
                        min={0}
                        max={item.maxPoints}
                        value={item.awardedPoints}
                        onChange={(e) => updateCriterion(idx, Number(e.target.value))}
                        aria-label={`Score for ${item.name}`}
                        className="w-20 h-9 px-2.5 text-right font-mono tabular-nums bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                      />
                      <span className="text-xs font-mono tabular-nums text-[#64748B]">
                        / {item.maxPoints}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                  Faculty Feedback
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide specific academic feedback on methodology, correctness, and clarity..."
                  className="w-full p-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/15"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave('needs_revision')}
                  className="h-10 px-4 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] text-[#EF4444] hover:bg-[#EF4444] hover:text-white text-sm font-medium transition-colors disabled:opacity-60"
                >
                  Request Revision
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave('graded')}
                  className="h-10 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium transition-colors disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Publish Grade'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
