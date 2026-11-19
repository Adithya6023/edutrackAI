import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckSquare,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  Settings,
  X,
} from 'lucide-react';
import type { ScreenId, UserProfile, UserRole } from '../shared/types';
import { ResilientImage } from './ResilientImage';

interface SidebarProps {
  activeScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  profile: UserProfile;
  onSwitchRole: (role: UserRole) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  pendingGradingCount: number;
  overdueCount: number;
}

const NAV_ITEMS: { id: ScreenId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'courses', label: 'Courses & Syllabi', icon: BookOpen },
  { id: 'assignments', label: 'Assignments', icon: CheckSquare },
  { id: 'calendar', label: 'Academic Calendar', icon: CalendarDays },
  { id: 'grading', label: 'Faculty Grading', icon: ClipboardCheck },
  { id: 'analytics', label: 'Institutional Metrics', icon: BarChart3 },
  { id: 'settings', label: 'Settings & Sync', icon: Settings },
];

export function Sidebar({
  activeScreen,
  onSelectScreen,
  profile,
  onSwitchRole,
  mobileOpen,
  onCloseMobile,
  pendingGradingCount,
  overdueCount,
}: SidebarProps) {
  const activeAvatar =
    profile.activeRole === 'student'
      ? '/src/assets/images/avatar_student_elena_1795059575881.jpg'
      : '/src/assets/images/avatar_faculty_marcus_1795059575418.jpg';

  const activeName =
    profile.activeRole === 'student'
      ? profile.studentName
      : profile.activeRole === 'faculty'
        ? profile.facultyName
        : profile.adminName;

  const activeSubtitle =
    profile.activeRole === 'student'
      ? `${profile.program} · ${profile.studentId}`
      : profile.activeRole === 'faculty'
        ? profile.facultyTitle
        : profile.institutionName;

  const content = (
    <div className="flex flex-col h-full w-[260px] bg-white border-r border-[#E2E8F0]">
      <div className="h-16 px-5 flex items-center justify-between border-b border-[#F1F5F9]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white shrink-0">
            <GraduationCap className="w-4 h-4" strokeWidth={2} />
          </div>
          <span className="font-display text-base font-bold tracking-tight text-[#0F172A] whitespace-nowrap">
            EduTrack AI
          </span>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
          aria-label="Close navigation"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-4 pt-4 pb-2">
        <div className="text-[11px] font-semibold text-[#64748B] tracking-[0.03em] mb-2 px-1">
          Workspace Role
        </div>
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
          {(['student', 'faculty', 'admin'] as UserRole[]).map((role) => {
            const active = profile.activeRole === role;
            const label = role === 'admin' ? 'Admin' : role === 'faculty' ? 'Faculty' : 'Student';
            return (
              <button
                key={role}
                type="button"
                onClick={() => onSwitchRole(role)}
                className={`h-7 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-white text-[#4F46E5] shadow-[0_1px_2px_0_rgba(15,23,42,0.06)] border border-[#E2E8F0]'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto" aria-label="Primary Navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          const count =
            item.id === 'assignments' && overdueCount > 0
              ? overdueCount
              : item.id === 'grading' && pendingGradingCount > 0
                ? pendingGradingCount
                : null;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectScreen(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between gap-2.5 h-10 px-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-[#EEF2FF] text-[#4F46E5]'
                  : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#4F46E5]' : 'text-[#64748B]'}`}
                  strokeWidth={1.75}
                />
                <span className="truncate">{item.label}</span>
              </span>
              {count !== null && (
                <span
                  className={`text-xs tabular-nums font-mono px-1.5 py-0.5 rounded-md ${
                    item.id === 'assignments'
                      ? 'bg-[#FEF2F2] text-[#991B1B]'
                      : 'bg-[#FFFBEB] text-[#92400E]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#F1F5F9]">
        <div className="flex items-center gap-3">
          <ResilientImage
            src={activeAvatar}
            alt={activeName}
            fallbackLabel={activeName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
            className="w-9 h-9 rounded-lg object-cover border border-[#E2E8F0] shrink-0"
          />
          <div className="min-w-0">
            <div className="text-sm font-medium text-[#0F172A] truncate">{activeName}</div>
            <div className="text-xs text-[#64748B] truncate">{activeSubtitle}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block shrink-0">{content}</aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#0F172A]/40"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 h-full">{content}</div>
        </div>
      )}
    </>
  );
}
