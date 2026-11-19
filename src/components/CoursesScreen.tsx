import { useState } from 'react';
import { Check, Search, Trash2, X } from 'lucide-react';
import type { WorkspaceData } from '../shared/types';

interface CoursesScreenProps {
  workspace: WorkspaceData;
  onToggleModule: (courseId: string, moduleId: string, completed: boolean) => void;
  onCreateCourse: (payload: {
    code: string;
    title: string;
    department: string;
    instructor: string;
    credits: number;
    schedule: string;
    room: string;
  }) => Promise<void>;
  onDeleteCourse: (courseId: string) => void;
  modalOpen: boolean;
  onCloseModal: () => void;
  onOpenModal: () => void;
}

export function CoursesScreen({
  workspace,
  onToggleModule,
  onCreateCourse,
  onDeleteCourse,
  modalOpen,
  onCloseModal,
  onOpenModal,
}: CoursesScreenProps) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [submitting, setSubmitting] = useState(false);

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [instructor, setInstructor] = useState('');
  const [credits, setCredits] = useState(3);
  const [schedule, setSchedule] = useState('Tue / Thu · 10:00–11:30');
  const [room, setRoom] = useState('Turing Hall 210');

  const departments = ['All', ...Array.from(new Set(workspace.courses.map((c) => c.department)))];

  const filtered = workspace.courses.filter((c) => {
    const matchesDept = deptFilter === 'All' || c.department === deptFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.code.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q);
    return matchesDept && matchesSearch;
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;
    setSubmitting(true);
    try {
      await onCreateCourse({
        code,
        title,
        department,
        instructor: instructor || 'Faculty Instructor',
        credits,
        schedule,
        room,
      });
      setCode('');
      setTitle('');
      setInstructor('');
      onCloseModal();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-white border border-[#E2E8F0] rounded-lg w-fit">
          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setDeptFilter(dept)}
              className={`h-8 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                deptFilter === dept
                  ? 'bg-[#EEF2FF] text-[#4F46E5]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search
            className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            strokeWidth={1.75}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses or faculty..."
            className="w-full h-10 pl-9 pr-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/15"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center">
          <h3 className="font-display text-base font-semibold text-[#0F172A]">
            No matching courses found
          </h3>
          <p className="mt-1 text-sm text-[#64748B]">
            Adjust your department filter or add a new course to your {workspace.profile.activeTerm}{' '}
            curriculum.
          </p>
          <button
            type="button"
            onClick={onOpenModal}
            className="mt-4 h-10 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium transition-colors"
          >
            Add Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((course) => {
            const done = course.syllabusModules.filter((m) => m.completed).length;
            const total = course.syllabusModules.length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <article
                key={course.id}
                className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(15,23,42,0.05)] flex flex-col"
              >
                <div className="p-6 border-b border-[#F1F5F9]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-xs font-mono text-[#64748B] tabular-nums">
                        {course.code} · {course.credits} Credits · {course.department}
                      </div>
                      <h3 className="mt-1 font-display text-lg font-semibold text-[#0F172A]">
                        {course.title}
                      </h3>
                      <div className="mt-1 text-xs text-[#64748B]">
                        {course.instructor} · {course.schedule} · {course.room}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-[#64748B]">Grade</div>
                      <div className="font-mono text-lg font-semibold text-[#0F172A] tabular-nums">
                        {course.currentGrade.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                      <div
                        className="h-full bg-[#4F46E5] rounded-full transition-all duration-200"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono tabular-nums text-[#64748B]">
                      {done}/{total} units
                    </span>
                  </div>
                </div>

                <div className="p-6 pt-4 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="text-xs font-medium text-[#64748B] mb-2">Syllabus Modules</div>
                    {course.syllabusModules.map((mod) => (
                      <div
                        key={mod.id}
                        onClick={() => onToggleModule(course.id, mod.id, !mod.completed)}
                        className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                      >
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={mod.completed}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleModule(course.id, mod.id, !mod.completed);
                          }}
                          className={`w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                            mod.completed
                              ? 'bg-[#4F46E5] border-[#4F46E5] text-white'
                              : 'bg-white border-[#CBD5E1] hover:border-[#4F46E5]'
                          }`}
                        >
                          {mod.completed && <Check className="w-3 h-3" strokeWidth={2.5} />}
                        </button>
                        <span className="text-xs font-mono tabular-nums text-[#64748B] shrink-0">
                          W{mod.week}
                        </span>
                        <span
                          className={`text-sm ${
                            mod.completed ? 'line-through text-[#64748B]' : 'text-[#0F172A]'
                          }`}
                        >
                          {mod.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                    <span>Term: {course.term}</span>
                    <button
                      type="button"
                      onClick={() => onDeleteCourse(course.id)}
                      className="inline-flex items-center gap-1 text-[#64748B] hover:text-[#EF4444] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40">
          <div className="w-full max-w-lg bg-white rounded-xl border border-[#E2E8F0] shadow-[0_10px_15px_-3px_rgba(15,23,42,0.08)]">
            <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-[#0F172A]">
                Enroll or Add Course
              </h3>
              <button
                type="button"
                onClick={onCloseModal}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                    Course Code
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="CS-480"
                    className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/15"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                    Course Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Compilers & Runtime Architecture"
                    className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                    Instructor
                  </label>
                  <input
                    type="text"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    placeholder="Dr. Marcus Thorne"
                    className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Credits</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={credits}
                    onChange={(e) => setCredits(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm tabular-nums text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                    Schedule
                  </label>
                  <input
                    type="text"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Room</label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/15"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onCloseModal}
                  className="h-10 px-4 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-sm font-medium text-[#0F172A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-10 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium disabled:opacity-60"
                >
                  {submitting ? 'Saving…' : 'Save Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
