import { ArrowRight, Check } from 'lucide-react';
import type { ScreenId, WorkspaceData } from '../shared/types';
import { ResilientImage } from './ResilientImage';
import { AssignmentStatusLabel, CalendarTypeLabel } from './StatusLabel';

interface OverviewScreenProps {
  workspace: WorkspaceData;
  onNavigate: (screen: ScreenId) => void;
  onToggleMilestone: (assignmentId: string, milestoneId: string, completed: boolean) => void;
}

export function OverviewScreen({
  workspace,
  onNavigate,
  onToggleMilestone,
}: OverviewScreenProps) {
  const { profile, courses, assignments, submissions, calendarEvents, departmentMetrics } = workspace;

  const completedAssignments = assignments.filter((a) => a.status === 'completed').length;
  const completionPct =
    assignments.length > 0 ? Math.round((completedAssignments / assignments.length) * 100) : 0;
  const overdueCount = assignments.filter((a) => a.status === 'overdue').length;
  const dueSoonCount = assignments.filter((a) => a.status === 'due_soon').length;

  const avgCourseScore =
    courses.length > 0
      ? (courses.reduce((acc, c) => acc + c.currentGrade, 0) / courses.length).toFixed(1)
      : '0.0';

  const pendingReviews = submissions.filter((s) => s.status === 'pending_review').length;
  const totalEnrolled = departmentMetrics.reduce((acc, d) => acc + d.enrolledStudents, 0);

  const kpis =
    profile.activeRole === 'student'
      ? [
          {
            label: 'Active Courses',
            value: String(courses.length),
            meta: `${courses.reduce((s, c) => s + c.credits, 0)} Credit Hours · ${profile.activeTerm}`,
          },
          {
            label: 'Due Soon & Overdue',
            value: String(dueSoonCount + overdueCount),
            meta: `${overdueCount} overdue · ${dueSoonCount} due within ${profile.dueSoonThresholdDays} days`,
          },
          {
            label: 'Weighted Course Avg',
            value: `${avgCourseScore}%`,
            meta: 'Equivalent 3.84 GPA standing',
          },
          {
            label: 'Coursework Completion',
            value: `${completionPct}%`,
            meta: `${completedAssignments} of ${assignments.length} deliverables submitted`,
          },
        ]
      : profile.activeRole === 'faculty'
        ? [
            {
              label: 'Assigned Courses',
              value: String(courses.length),
              meta: `${profile.activeTerm} active sections`,
            },
            {
              label: 'Review Queue',
              value: String(pendingReviews),
              meta: `${submissions.length} total student submissions`,
            },
            {
              label: 'Cohort Mean Score',
              value: '89.4%',
              meta: 'Across graded rubrics this term',
            },
            {
              label: 'On-Time Submission',
              value: '91.4%',
              meta: 'Up 2.1% from midterm baseline',
            },
          ]
        : [
            {
              label: 'Total Enrollment',
              value: totalEnrolled.toLocaleString(),
              meta: `${departmentMetrics.length} academic departments`,
            },
            {
              label: 'Institutional GPA',
              value: '3.66',
              meta: '+0.03 vs. Spring 2026 baseline',
            },
            {
              label: 'Term Completion Rate',
              value: '92.8%',
              meta: 'Weighted across all cohorts',
            },
            {
              label: 'At-Risk Interventions',
              value: String(workspace.atRiskStudents.length),
              meta: `${workspace.atRiskStudents.filter((s) => s.advisorStatus === 'Pending Action').length} awaiting advisor outreach`,
            },
          ];

  const trackedAssignments = assignments.filter((a) => a.status !== 'completed').slice(0, 4);
  const upcomingEvents = calendarEvents.slice(0, 5);

  const heroTitle =
    profile.activeRole === 'student'
      ? `Welcome back, ${profile.studentName}`
      : profile.activeRole === 'faculty'
        ? `Coursework Command — ${profile.facultyName}`
        : `${profile.institutionName} Overview`;

  const heroSub =
    profile.activeRole === 'student'
      ? `${profile.program} · ${dueSoonCount + overdueCount} priority deliverables require attention this week.`
      : profile.activeRole === 'faculty'
        ? `${pendingReviews} student submissions are ready for rubric evaluation.`
        : `Institution-wide academic pacing across ${departmentMetrics.length} departments for ${profile.activeTerm}.`;

  const primaryJumpScreen: ScreenId =
    profile.activeRole === 'student'
      ? 'assignments'
      : profile.activeRole === 'faculty'
        ? 'grading'
        : 'analytics';

  const primaryJumpLabel =
    profile.activeRole === 'student'
      ? 'Open Assignments'
      : profile.activeRole === 'faculty'
        ? 'Open Grading Queue'
        : 'View Institutional Metrics';

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#0F172A] shadow-[0_1px_2px_0_rgba(15,23,42,0.05)]">
        <div className="h-48 sm:h-52 w-full">
          <ResilientImage
            src="/src/assets/images/campus_architecture_hall_1795059575564.jpg"
            alt="Northbridge Institute modern academic atrium"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/70 to-[#0F172A]/35"
          aria-hidden="true"
        />
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
          <div className="text-xs font-medium text-[#CBD5E1] tracking-wide">
            {profile.institutionName} · {profile.activeTerm}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-white tracking-tight text-balance">
                {heroTitle}
              </h2>
              <p className="mt-1.5 text-sm text-[#E2E8F0] max-w-xl">{heroSub}</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate(primaryJumpScreen)}
              className="h-10 px-4 inline-flex items-center gap-2 rounded-lg bg-white text-[#0F172A] hover:bg-[#F8FAFC] text-sm font-medium transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
            >
              <span>{primaryJumpLabel}</span>
              <ArrowRight className="w-4 h-4 text-[#4F46E5]" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_2px_0_rgba(15,23,42,0.05)]"
          >
            <div className="text-xs font-medium text-[#64748B] tracking-[0.01em]">{kpi.label}</div>
            <div className="mt-2 font-display text-3xl font-bold text-[#0F172A] tabular-nums tracking-tight">
              {kpi.value}
            </div>
            <div className="mt-2 text-xs text-[#64748B]">{kpi.meta}</div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(15,23,42,0.05)]">
          <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-[#0F172A]">
                Assignment Milestone Tracker
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Interactive step completion synced directly to the backend store
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('assignments')}
              className="text-xs font-medium text-[#4F46E5] hover:text-[#4338CA] whitespace-nowrap shrink-0"
            >
              View all ({assignments.length})
            </button>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            {trackedAssignments.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#64748B]">
                All current assignments are completed. Create a new deliverable to track milestones.
              </div>
            ) : (
              trackedAssignments.map((asg) => {
                const doneCount = asg.milestones.filter((m) => m.completed).length;
                const total = asg.milestones.length;
                const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

                return (
                  <div key={asg.id} className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs text-[#64748B] font-mono tabular-nums">
                          {asg.courseCode} · Due {asg.dueDate} · Weight {asg.weightPercent}%
                        </div>
                        <h4 className="mt-1 text-sm font-semibold text-[#0F172A]">{asg.title}</h4>
                      </div>
                      <AssignmentStatusLabel status={asg.status} />
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                        <div
                          className="h-full bg-[#4F46E5] rounded-full transition-all duration-200"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono tabular-nums text-[#64748B] shrink-0">
                        {doneCount}/{total} ({pct}%)
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {asg.milestones.map((ms) => (
                        <label
                          key={ms.id}
                          className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                        >
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={ms.completed}
                            onClick={() => onToggleMilestone(asg.id, ms.id, !ms.completed)}
                            className={`w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                              ms.completed
                                ? 'bg-[#4F46E5] border-[#4F46E5] text-white'
                                : 'bg-white border-[#CBD5E1] hover:border-[#4F46E5]'
                            }`}
                          >
                            {ms.completed && <Check className="w-3 h-3" strokeWidth={2.5} />}
                          </button>
                          <span
                            onClick={() => onToggleMilestone(asg.id, ms.id, !ms.completed)}
                            className={`text-xs leading-snug ${
                              ms.completed ? 'line-through text-[#64748B]' : 'text-[#0F172A]'
                            }`}
                          >
                            {ms.title}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="xl:col-span-5 bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(15,23,42,0.05)] flex flex-col">
          <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-[#0F172A]">
                Upcoming Academic Schedule
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Next sessions, exams, and coursework cutoffs
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('calendar')}
              className="text-xs font-medium text-[#4F46E5] hover:text-[#4338CA] whitespace-nowrap shrink-0"
            >
              Calendar
            </button>
          </div>

          <div className="divide-y divide-[#F1F5F9] flex-1">
            {upcomingEvents.map((ev) => (
              <div
                key={ev.id}
                className="px-6 py-4 flex items-start justify-between gap-3 hover:bg-[#F8FAFC] transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-xs text-[#64748B] font-mono tabular-nums">
                    {ev.date} · {ev.time}
                  </div>
                  <div className="mt-1 text-sm font-medium text-[#0F172A] truncate">{ev.title}</div>
                  <div className="mt-0.5 text-xs text-[#64748B]">
                    {ev.courseCode} · {ev.location}
                  </div>
                </div>
                <CalendarTypeLabel type={ev.type} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
