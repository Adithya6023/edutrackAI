import { Menu, Plus } from 'lucide-react';
import type { ScreenId } from '../shared/types';

interface TopBarProps {
  activeScreen: ScreenId;
  activeTerm: string;
  onOpenMobileMenu: () => void;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  saving?: boolean;
}

const SCREEN_TITLES: Record<ScreenId, string> = {
  overview: 'Academic Overview',
  courses: 'Courses & Syllabi',
  assignments: 'Assignments & Milestones',
  calendar: 'Academic Calendar',
  grading: 'Faculty Grading Queue',
  analytics: 'Institutional Analytics',
  settings: 'Profile & Backend Sync',
};

export function TopBar({
  activeScreen,
  activeTerm,
  onOpenMobileMenu,
  primaryActionLabel,
  onPrimaryAction,
  saving,
}: TopBarProps) {
  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 md:px-8 flex items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" strokeWidth={1.75} />
        </button>
        <div className="flex items-center gap-2 text-sm min-w-0">
          <span className="text-[#64748B] hidden sm:inline whitespace-nowrap">EduTrack AI</span>
          <span className="text-[#CBD5E1] hidden sm:inline" aria-hidden="true">
            /
          </span>
          <h1 className="font-display font-semibold text-[#0F172A] text-base md:text-lg truncate">
            {SCREEN_TITLES[activeScreen]}
          </h1>
          <span className="text-[#CBD5E1] hidden md:inline" aria-hidden="true">
            ·
          </span>
          <span className="text-xs text-[#64748B] hidden md:inline whitespace-nowrap">
            {activeTerm}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {saving && (
          <span className="text-xs text-[#64748B] hidden sm:inline whitespace-nowrap">
            Syncing…
          </span>
        )}
        {primaryActionLabel && onPrimaryAction && (
          <button
            type="button"
            onClick={onPrimaryAction}
            className="h-10 px-4 inline-flex items-center gap-2 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            <span>{primaryActionLabel}</span>
          </button>
        )}
      </div>
    </header>
  );
}
