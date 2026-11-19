import { useEffect, useState } from 'react';
import { api } from './api/client';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { AssignmentsScreen } from './components/AssignmentsScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { CoursesScreen } from './components/CoursesScreen';
import { FacultyGradingScreen } from './components/FacultyGradingScreen';
import { OverviewScreen } from './components/OverviewScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import type { ScreenId, UserRole, WorkspaceData } from './shared/types';

export default function App() {
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [activeScreen, setActiveScreen] = useState<ScreenId>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);

  async function loadWorkspace() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getWorkspace();
      setWorkspace(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to connect to EduTrack backend.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWorkspace();
  }, []);

  async function runMutation(fn: () => Promise<WorkspaceData>) {
    setSaving(true);
    setError(null);
    try {
      const updated = await fn();
      setWorkspace(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes to backend.');
    } finally {
      setSaving(false);
    }
  }

  function handleRoleSwitch(role: UserRole) {
    runMutation(() => api.updateProfile({ activeRole: role }));
    if (role === 'faculty' && activeScreen === 'analytics') {
      setActiveScreen('grading');
    } else if (role === 'admin' && activeScreen === 'grading') {
      setActiveScreen('analytics');
    }
  }

  function getPrimaryTopAction(): { label?: string; onClick?: () => void } {
    switch (activeScreen) {
      case 'overview':
        return {
          label: 'New Assignment',
          onClick: () => {
            setActiveScreen('assignments');
            setAssignmentModalOpen(true);
          },
        };
      case 'courses':
        return {
          label: 'Add Course',
          onClick: () => setCourseModalOpen(true),
        };
      case 'assignments':
        return {
          label: 'New Assignment',
          onClick: () => setAssignmentModalOpen(true),
        };
      case 'calendar':
        return {
          label: 'Schedule Event',
          onClick: () => setCalendarModalOpen(true),
        };
      default:
        return {};
    }
  }

  if (loading && !workspace) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl border border-[#E2E8F0] p-8 space-y-4 shadow-[0_1px_2px_0_rgba(15,23,42,0.05)]">
          <div className="h-5 w-40 bg-[#E2E8F0] rounded animate-pulse" />
          <div className="h-4 w-full bg-[#F1F5F9] rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-[#F1F5F9] rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl border border-[#E2E8F0] p-8 text-center space-y-4">
          <h1 className="font-display text-lg font-semibold text-[#0F172A]">
            Backend Connection Unavailable
          </h1>
          <p className="text-sm text-[#64748B]">{error || 'Unable to load workspace data.'}</p>
          <button
            type="button"
            onClick={loadWorkspace}
            className="h-10 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const overdueCount = workspace.assignments.filter((a) => a.status === 'overdue').length;
  const pendingGradingCount = workspace.submissions.filter(
    (s) => s.status === 'pending_review'
  ).length;
  const primaryAction = getPrimaryTopAction();

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#0F172A]">
      <Sidebar
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        profile={workspace.profile}
        onSwitchRole={handleRoleSwitch}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        pendingGradingCount={pendingGradingCount}
        overdueCount={overdueCount}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar
          activeScreen={activeScreen}
          activeTerm={workspace.profile.activeTerm}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          primaryActionLabel={primaryAction.label}
          onPrimaryAction={primaryAction.onClick}
          saving={saving}
        />

        {error && (
          <div className="mx-4 md:mx-8 mt-4 p-3 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] text-sm text-[#991B1B] flex items-center justify-between gap-4">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-xs font-medium underline shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-8">
          {activeScreen === 'overview' && (
            <OverviewScreen
              workspace={workspace}
              onNavigate={setActiveScreen}
              onToggleMilestone={(assignmentId, milestoneId, completed) =>
                runMutation(() => api.toggleMilestone(assignmentId, milestoneId, completed))
              }
            />
          )}

          {activeScreen === 'courses' && (
            <CoursesScreen
              workspace={workspace}
              onToggleModule={(courseId, moduleId, completed) =>
                runMutation(() => api.toggleCourseModule(courseId, moduleId, completed))
              }
              onCreateCourse={(payload) => runMutation(() => api.createCourse(payload))}
              onDeleteCourse={(courseId) => runMutation(() => api.deleteCourse(courseId))}
              modalOpen={courseModalOpen}
              onCloseModal={() => setCourseModalOpen(false)}
              onOpenModal={() => setCourseModalOpen(true)}
            />
          )}

          {activeScreen === 'assignments' && (
            <AssignmentsScreen
              workspace={workspace}
              onToggleMilestone={(assignmentId, milestoneId, completed) =>
                runMutation(() => api.toggleMilestone(assignmentId, milestoneId, completed))
              }
              onCreateAssignment={(payload) => runMutation(() => api.createAssignment(payload))}
              onSubmitWork={(assignmentId, submissionNote) =>
                runMutation(() =>
                  api.updateAssignment(assignmentId, {
                    submitWork: true,
                    submissionNote,
                  })
                )
              }
              onDeleteAssignment={(assignmentId) =>
                runMutation(() => api.deleteAssignment(assignmentId))
              }
              createModalOpen={assignmentModalOpen}
              onCloseCreateModal={() => setAssignmentModalOpen(false)}
              onOpenCreateModal={() => setAssignmentModalOpen(true)}
            />
          )}

          {activeScreen === 'calendar' && (
            <CalendarScreen
              workspace={workspace}
              onCreateEvent={(payload) => runMutation(() => api.createCalendarEvent(payload))}
              onDeleteEvent={(eventId) => runMutation(() => api.deleteCalendarEvent(eventId))}
              modalOpen={calendarModalOpen}
              onCloseModal={() => setCalendarModalOpen(false)}
            />
          )}

          {activeScreen === 'grading' && (
            <FacultyGradingScreen
              workspace={workspace}
              onGradeSubmission={(submissionId, payload) =>
                runMutation(() => api.gradeSubmission(submissionId, payload))
              }
            />
          )}

          {activeScreen === 'analytics' && (
            <AnalyticsScreen
              workspace={workspace}
              onUpdateAdvisorStatus={(recordId, advisorStatus) =>
                runMutation(() => api.updateAtRiskStatus(recordId, advisorStatus))
              }
            />
          )}

          {activeScreen === 'settings' && (
            <SettingsScreen
              workspace={workspace}
              onSaveProfile={(patch) => runMutation(() => api.updateProfile(patch))}
              onResetWorkspace={() => runMutation(() => api.resetWorkspace())}
            />
          )}
        </main>
      </div>
    </div>
  );
}
