import type { WorkspaceData } from '../shared/types';

interface AnalyticsScreenProps {
  workspace: WorkspaceData;
  onUpdateAdvisorStatus: (
    recordId: string,
    advisorStatus: 'Scheduled' | 'Outreach Sent' | 'Pending Action'
  ) => void;
}

export function AnalyticsScreen({
  workspace,
  onUpdateAdvisorStatus,
}: AnalyticsScreenProps) {
  const { departmentMetrics, termTrends, atRiskStudents } = workspace;

  const totalEnrolled = departmentMetrics.reduce((acc, d) => acc + d.enrolledStudents, 0);
  const avgCompletion = (
    departmentMetrics.reduce((acc, d) => acc + d.completionRate, 0) / departmentMetrics.length
  ).toFixed(1);
  const avgGpa = (
    departmentMetrics.reduce((acc, d) => acc + d.averageGpa, 0) / departmentMetrics.length
  ).toFixed(2);
  const totalAtRisk = departmentMetrics.reduce((acc, d) => acc + d.atRiskCount, 0);

  // SVG chart dimensions for Term-over-Term GPA & Completion Trend
  const chartW = 640;
  const chartH = 220;
  const padX = 48;
  const padY = 24;
  const plotW = chartW - padX * 2;
  const plotH = chartH - padY * 2;

  const minGpa = 3.35;
  const maxGpa = 3.8;
  const points = termTrends.map((t, i) => {
    const x = padX + (i / Math.max(1, termTrends.length - 1)) * plotW;
    const y = padY + plotH - ((t.averageGpa - minGpa) / (maxGpa - minGpa)) * plotH;
    return { x, y, ...t };
  });
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_2px_0_rgba(15,23,42,0.05)]">
          <div className="text-xs font-medium text-[#64748B]">Institution Enrollment</div>
          <div className="mt-2 font-display text-3xl font-bold text-[#0F172A] tabular-nums">
            {totalEnrolled.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-[#64748B]">
            Across {departmentMetrics.length} active departments
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_2px_0_rgba(15,23,42,0.05)]">
          <div className="text-xs font-medium text-[#64748B]">Mean Institutional GPA</div>
          <div className="mt-2 font-display text-3xl font-bold text-[#0F172A] tabular-nums">
            {avgGpa}
          </div>
          <div className="mt-2 text-xs text-[#065F46]">+0.18 upward trajectory since Spring 2024</div>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_2px_0_rgba(15,23,42,0.05)]">
          <div className="text-xs font-medium text-[#64748B]">Mean Completion Rate</div>
          <div className="mt-2 font-display text-3xl font-bold text-[#0F172A] tabular-nums">
            {avgCompletion}%
          </div>
          <div className="mt-2 text-xs text-[#64748B]">Target institutional threshold: 90.0%</div>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_2px_0_rgba(15,23,42,0.05)]">
          <div className="text-xs font-medium text-[#64748B]">Flagged At-Risk Learners</div>
          <div className="mt-2 font-display text-3xl font-bold text-[#0F172A] tabular-nums">
            {totalAtRisk}
          </div>
          <div className="mt-2 text-xs text-[#92400E]">
            {atRiskStudents.filter((s) => s.advisorStatus === 'Pending Action').length} require
            immediate advisor outreach
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-6 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_2px_0_rgba(15,23,42,0.05)]">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-[#0F172A]">
                Term-over-Term GPA Trajectory
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Six-term cumulative grade point progression
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-[#4F46E5]">
              3.48 → 3.66
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full h-56"
              role="img"
              aria-label="Term-over-Term GPA Trajectory Line Chart"
            >
              {[3.4, 3.5, 3.6, 3.7, 3.8].map((tick) => {
                const y = padY + plotH - ((tick - minGpa) / (maxGpa - minGpa)) * plotH;
                return (
                  <g key={tick}>
                    <line
                      x1={padX}
                      x2={chartW - padX}
                      y1={y}
                      y2={y}
                      stroke="#F1F5F9"
                      strokeWidth="1"
                    />
                    <text
                      x={padX - 8}
                      y={y + 4}
                      textAnchor="end"
                      className="fill-[#64748B] text-[10px] font-mono"
                    >
                      {tick.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              <path
                d={linePath}
                fill="none"
                stroke="#4F46E5"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {points.map((p) => (
                <g key={p.term}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4.5"
                    fill="#FFFFFF"
                    stroke="#4F46E5"
                    strokeWidth="2.5"
                  />
                  <text
                    x={p.x}
                    y={p.y - 10}
                    textAnchor="middle"
                    className="fill-[#0F172A] text-[10px] font-mono font-semibold"
                  >
                    {p.averageGpa.toFixed(2)}
                  </text>
                  <text
                    x={p.x}
                    y={chartH - 4}
                    textAnchor="middle"
                    className="fill-[#64748B] text-[10px]"
                  >
                    {p.term}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        <div className="xl:col-span-6 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_2px_0_rgba(15,23,42,0.05)]">
          <div className="mb-4">
            <h3 className="font-display text-lg font-semibold text-[#0F172A]">
              Department Completion Benchmarks
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Coursework completion and on-time submission compliance by faculty division
            </p>
          </div>

          <div className="space-y-4">
            {departmentMetrics.map((dept) => (
              <div key={dept.id}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-[#0F172A]">{dept.department}</span>
                  <span className="font-mono text-xs tabular-nums text-[#64748B]">
                    {dept.completionRate.toFixed(1)}% complete · GPA {dept.averageGpa.toFixed(2)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#4F46E5]"
                    style={{ width: `${dept.completionRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F1F5F9]">
          <h3 className="font-display text-lg font-semibold text-[#0F172A]">
            At-Risk Cohort Intervention Queue
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Students falling below 72% threshold or logging multiple missed deadlines
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="h-11 bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs font-medium text-[#64748B]">
                <th className="px-6 font-medium">Student</th>
                <th className="px-4 font-medium">Department & Course</th>
                <th className="px-4 font-medium text-right">Current Score</th>
                <th className="px-4 font-medium text-right">Missed</th>
                <th className="px-6 font-medium text-right">Advisor Outreach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {atRiskStudents.map((rec) => (
                <tr key={rec.id} className="h-14 hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-6 py-3">
                    <div className="text-sm font-medium text-[#0F172A]">{rec.studentName}</div>
                    <div className="text-xs font-mono tabular-nums text-[#64748B]">
                      {rec.studentId}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#475569]">
                    {rec.department} · <span className="font-mono text-xs">{rec.courseCode}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm tabular-nums text-[#991B1B] font-semibold">
                    {rec.currentScore.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm tabular-nums text-[#0F172A]">
                    {rec.missedDeadlines}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <select
                      value={rec.advisorStatus}
                      onChange={(e) =>
                        onUpdateAdvisorStatus(
                          rec.id,
                          e.target.value as 'Scheduled' | 'Outreach Sent' | 'Pending Action'
                        )
                      }
                      aria-label={`Advisor status for ${rec.studentName}`}
                      className="h-8 px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                    >
                      <option value="Pending Action">Pending Action</option>
                      <option value="Outreach Sent">Outreach Sent</option>
                      <option value="Scheduled">Scheduled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
