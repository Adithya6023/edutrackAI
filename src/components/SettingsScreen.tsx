import { useEffect, useState } from 'react';
import { Check, Database, Download, RefreshCw, RotateCcw } from 'lucide-react';
import { api } from '../api/client';
import type { HealthStatus, UserProfile, WorkspaceData } from '../shared/types';

interface SettingsScreenProps {
  workspace: WorkspaceData;
  onSaveProfile: (patch: Partial<UserProfile>) => Promise<void>;
  onResetWorkspace: () => Promise<void>;
}

export function SettingsScreen({
  workspace,
  onSaveProfile,
  onResetWorkspace,
}: SettingsScreenProps) {
  const [profile, setProfile] = useState<UserProfile>(workspace.profile);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setProfile(workspace.profile);
  }, [workspace.profile]);

  async function refreshHealth() {
    setLoadingHealth(true);
    try {
      const status = await api.getHealth();
      setHealth(status);
    } finally {
      setLoadingHealth(false);
    }
  }

  useEffect(() => {
    refreshHealth();
  }, [workspace.lastUpdatedAt]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSavedNotice(false);
    try {
      await onSaveProfile(profile);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <form
        onSubmit={handleSubmit}
        className="xl:col-span-7 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_2px_0_rgba(15,23,42,0.05)] space-y-6"
      >
        <div className="pb-4 border-b border-[#F1F5F9]">
          <h2 className="font-display text-lg font-semibold text-[#0F172A]">
            Academic Identity & Alert Preferences
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Changes persist directly to the Express backend database
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
              Student Name
            </label>
            <input
              type="text"
              value={profile.studentName}
              onChange={(e) => setProfile({ ...profile, studentName: e.target.value })}
              className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
              Student Email
            </label>
            <input
              type="email"
              value={profile.studentEmail}
              onChange={(e) => setProfile({ ...profile, studentEmail: e.target.value })}
              className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
              Faculty Name
            </label>
            <input
              type="text"
              value={profile.facultyName}
              onChange={(e) => setProfile({ ...profile, facultyName: e.target.value })}
              className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
              Institution Name
            </label>
            <input
              type="text"
              value={profile.institutionName}
              onChange={(e) => setProfile({ ...profile, institutionName: e.target.value })}
              className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
              Active Academic Term
            </label>
            <select
              value={profile.activeTerm}
              onChange={(e) => setProfile({ ...profile, activeTerm: e.target.value })}
              className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="Fall 2026">Fall 2026</option>
              <option value="Spring 2027">Spring 2027</option>
              <option value="Summer 2027">Summer 2027</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
              Due Soon Window (Days)
            </label>
            <input
              type="number"
              min={1}
              max={14}
              value={profile.dueSoonThresholdDays}
              onChange={(e) =>
                setProfile({ ...profile, dueSoonThresholdDays: Number(e.target.value) })
              }
              className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm tabular-nums text-[#0F172A] focus:outline-none focus:border-[#4F46E5]"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <button
            type="button"
            role="checkbox"
            aria-checked={profile.weeklyDigestEnabled}
            onClick={() =>
              setProfile({ ...profile, weeklyDigestEnabled: !profile.weeklyDigestEnabled })
            }
            className={`w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center shrink-0 ${
              profile.weeklyDigestEnabled
                ? 'bg-[#4F46E5] border-[#4F46E5] text-white'
                : 'bg-white border-[#CBD5E1]'
            }`}
          >
            {profile.weeklyDigestEnabled && <Check className="w-3 h-3" strokeWidth={2.5} />}
          </button>
          <span className="text-sm text-[#0F172A]">
            Send weekly academic milestone digest every Monday morning
          </span>
        </label>

        <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between gap-4">
          <div className="text-xs text-[#065F46]">
            {savedNotice ? 'Profile and term preferences saved to backend.' : ''}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="h-10 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Preferences'}
          </button>
        </div>
      </form>

      <div className="xl:col-span-5 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-[0_1px_2px_0_rgba(15,23,42,0.05)] flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="pb-4 border-b border-[#F1F5F9] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-[#4F46E5]" strokeWidth={1.75} />
              <div>
                <h3 className="font-display text-lg font-semibold text-[#0F172A]">
                  Backend Connectivity
                </h3>
                <p className="text-xs text-[#64748B]">Live Express REST API & local store</p>
              </div>
            </div>
            <button
              type="button"
              onClick={refreshHealth}
              disabled={loadingHealth}
              className="h-9 px-3 inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-xs font-medium text-[#0F172A]"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-[#64748B] ${loadingHealth ? 'animate-spin' : ''}`}
                strokeWidth={1.75}
              />
              <span>Verify</span>
            </button>
          </div>

          {health ? (
            <div className="divide-y divide-[#F1F5F9] text-sm">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#64748B]">Connection</span>
                <span className="font-medium text-[#065F46]">Connected</span>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-[#64748B]">Storage Engine</span>
                <span className="text-[#0F172A] text-right">{health.engine}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-[#64748B]">Data File</span>
                <span className="font-mono text-xs text-[#0F172A] truncate">
                  {health.storagePath}
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-[#64748B]">Last Persisted</span>
                <span className="font-mono text-xs tabular-nums text-[#0F172A]">
                  {new Date(health.lastPersistedAt).toLocaleString()}
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-[#64748B]">Stored Records</span>
                <span className="font-mono text-xs tabular-nums text-[#0F172A]">
                  {health.counts.courses} courses · {health.counts.assignments} assignments ·{' '}
                  {health.counts.submissions} submissions
                </span>
              </div>
            </div>
          ) : (
            <div className="py-6 text-sm text-[#64748B]">Checking backend health endpoint…</div>
          )}
        </div>

        <div className="pt-4 border-t border-[#F1F5F9] space-y-3">
          <a
            href="/api/export"
            className="w-full h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-sm font-medium text-[#0F172A] transition-colors"
          >
            <Download className="w-4 h-4 text-[#64748B]" strokeWidth={1.75} />
            <span>Export Workspace JSON Snapshot</span>
          </a>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="w-full h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] text-[#EF4444] hover:bg-[#EF4444] hover:text-white text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
              <span>Reset Database to Baseline</span>
            </button>
          ) : (
            <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] space-y-2">
              <div className="text-xs font-medium text-[#991B1B]">
                Restore all courses, assignments, grades, and schedules to initial seed values?
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="h-8 px-3 rounded-lg bg-white border border-[#E2E8F0] text-xs font-medium text-[#0F172A]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await onResetWorkspace();
                    setConfirmReset(false);
                  }}
                  className="h-8 px-3 rounded-lg bg-[#EF4444] text-white text-xs font-medium hover:bg-[#DC2626]"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
