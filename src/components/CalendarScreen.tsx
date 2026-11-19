import { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import type { CalendarEventType, WorkspaceData } from '../shared/types';
import { CalendarTypeLabel } from './StatusLabel';

interface CalendarScreenProps {
  workspace: WorkspaceData;
  onCreateEvent: (payload: {
    title: string;
    courseCode: string;
    date: string;
    time: string;
    location: string;
    type: CalendarEventType;
  }) => Promise<void>;
  onDeleteEvent: (eventId: string) => Promise<void>;
  modalOpen: boolean;
  onCloseModal: () => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const EVENT_TYPES: { id: 'all' | CalendarEventType; label: string }[] = [
  { id: 'all', label: 'All Events' },
  { id: 'deadline', label: 'Deadlines' },
  { id: 'exam', label: 'Exams' },
  { id: 'lecture', label: 'Lectures' },
  { id: 'lab', label: 'Labs' },
  { id: 'office_hours', label: 'Office Hours' },
];

export function CalendarScreen({
  workspace,
  onCreateEvent,
  onDeleteEvent,
  modalOpen,
  onCloseModal,
}: CalendarScreenProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | CalendarEventType>('all');
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState(workspace.courses[0]?.code || 'CS-410');
  const [date, setDate] = useState('2026-11-25');
  const [time, setTime] = useState('02:00 PM');
  const [location, setLocation] = useState('Turing Hall 304');
  const [type, setType] = useState<CalendarEventType>('lecture');

  // November 2026 starts on Sunday (day index 0), 30 days
  const days = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-11-${String(dayNum).padStart(2, '0')}`;
    return { dayNum, dateStr };
  });

  const filteredEvents = workspace.calendarEvents.filter((ev) => {
    const matchesType = typeFilter === 'all' || ev.type === typeFilter;
    const matchesDay = !selectedDay || ev.date === selectedDay;
    return matchesType && matchesDay;
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onCreateEvent({ title, courseCode, date, time, location, type });
      setTitle('');
      onCloseModal();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-white border border-[#E2E8F0] rounded-lg w-fit">
          {EVENT_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTypeFilter(t.id)}
              className={`h-8 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                typeFilter === t.id
                  ? 'bg-[#EEF2FF] text-[#4F46E5]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {selectedDay && (
          <button
            type="button"
            onClick={() => setSelectedDay(null)}
            className="h-8 px-3 rounded-lg bg-white border border-[#E2E8F0] text-xs font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
          >
            Showing {selectedDay} · Clear day filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-[#0F172A]">November 2026</h2>
            <span className="text-xs text-[#64748B]">Fall Semester · Weeks 10–13</span>
          </div>

          <div className="grid grid-cols-7 border-b border-[#F1F5F9] bg-[#F8FAFC]">
            {WEEKDAYS.map((wd) => (
              <div
                key={wd}
                className="py-2.5 text-center text-xs font-medium text-[#64748B]"
              >
                {wd}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 divide-x divide-y divide-[#F1F5F9]">
            {days.map(({ dayNum, dateStr }) => {
              const dayEvents = workspace.calendarEvents.filter(
                (ev) => ev.date === dateStr && (typeFilter === 'all' || ev.type === typeFilter)
              );
              const isSelected = selectedDay === dateStr;
              const isToday = dateStr === '2026-11-18';

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                  className={`min-h-[86px] p-2 text-left flex flex-col justify-between transition-colors ${
                    isSelected
                      ? 'bg-[#EEF2FF]'
                      : 'bg-white hover:bg-[#F8FAFC]'
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-mono tabular-nums ${
                      isToday
                        ? 'bg-[#4F46E5] text-white font-semibold'
                        : isSelected
                          ? 'text-[#4F46E5] font-semibold'
                          : 'text-[#0F172A]'
                    }`}
                  >
                    {dayNum}
                  </span>

                  <div className="space-y-1 mt-1">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className="text-[11px] leading-tight truncate px-1.5 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A]"
                      >
                        {ev.courseCode}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[11px] font-mono text-[#64748B] px-1">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="xl:col-span-5 bg-white rounded-xl border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(15,23,42,0.05)] flex flex-col">
          <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold text-[#0F172A]">
                {selectedDay ? `Schedule for ${selectedDay}` : 'Chronological Agenda'}
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                {filteredEvents.length} scheduled academic item{filteredEvents.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          <div className="divide-y divide-[#F1F5F9] flex-1">
            {filteredEvents.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#64748B]">
                No events match the selected date or filter.
              </div>
            ) : (
              filteredEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="px-6 py-4 flex items-start justify-between gap-3 hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <CalendarTypeLabel type={ev.type} />
                      <span className="text-xs font-mono tabular-nums text-[#64748B]">
                        {ev.date} · {ev.time}
                      </span>
                    </div>
                    <div className="mt-1.5 text-sm font-medium text-[#0F172A]">{ev.title}</div>
                    <div className="mt-0.5 text-xs text-[#64748B]">
                      {ev.courseCode} · {ev.location}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteEvent(ev.id)}
                    className="p-1.5 rounded-lg text-[#64748B] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-colors shrink-0"
                    aria-label={`Remove ${ev.title}`}
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40">
          <div className="w-full max-w-md bg-white rounded-xl border border-[#E2E8F0] shadow-[0_10px_15px_-3px_rgba(15,23,42,0.08)]">
            <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-[#0F172A]">
                Schedule Academic Event
              </h3>
              <button
                type="button"
                onClick={onCloseModal}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A]"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Midterm Review Session"
                  className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:ring-3 focus:ring-[#4F46E5]/15"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Course</label>
                  <select
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                  >
                    {workspace.courses.map((c) => (
                      <option key={c.id} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                    <option value="GENERAL">GENERAL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as CalendarEventType)}
                    className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                  >
                    <option value="lecture">Lecture</option>
                    <option value="deadline">Deadline</option>
                    <option value="exam">Exam</option>
                    <option value="lab">Lab</option>
                    <option value="office_hours">Office Hours</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
                />
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
                  {submitting ? 'Saving…' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
