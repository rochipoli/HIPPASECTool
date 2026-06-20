import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { saveResponses } from '../api/hipaaApi';

export type StatusValue = '' | 'compliant' | 'partial' | 'noncompliant' | 'na';
export type ViewType = 'dashboard' | 'assessment' | 'report';

export interface SpecResponse {
  status: StatusValue;
  notes: string;
}

export interface OrgInfo {
  name: string;
  assessor: string;
  assessorTitle: string;
  date: string;
}

export const STATUS_META: Record<StatusValue, { label: string; color: string; cls: string }> = {
  compliant:    { label: 'Compliant',           color: '#16a34a', cls: 'compliant' },
  partial:      { label: 'Partially Compliant', color: '#d97706', cls: 'partial' },
  noncompliant: { label: 'Non-Compliant',        color: '#dc2626', cls: 'noncompliant' },
  na:           { label: 'Not Applicable',       color: '#6b7280', cls: 'na' },
  '':           { label: 'Not Assessed',         color: '#94a3b8', cls: 'unassessed' },
};

export const STATUS_OPTIONS: { value: Exclude<StatusValue, ''>; label: string }[] = [
  { value: 'compliant',    label: 'Compliant' },
  { value: 'partial',      label: 'Partial' },
  { value: 'noncompliant', label: 'Non-Compliant' },
  { value: 'na',           label: 'N/A' },
];

interface HipaaState {
  orgInfo: OrgInfo;
  responses: Record<string, SpecResponse>;
  currentView: ViewType;
  currentCategoryIndex: number;
  // Backend sync state
  assessmentId: string | null;
  syncStatus: 'idle' | 'syncing' | 'error';
}

interface HipaaActions {
  setOrgInfo: (field: keyof OrgInfo, value: string) => void;
  setResponse: (specId: string, status: StatusValue, notes?: string) => void;
  setView: (view: ViewType, catIndex?: number) => void;
  reset: () => void;
  setAssessmentId: (id: string) => void;
  syncToBackend: () => Promise<void>;
}

const initialState: HipaaState = {
  orgInfo: {
    name: '',
    assessor: '',
    assessorTitle: '',
    date: new Date().toISOString().slice(0, 10),
  },
  responses: {},
  currentView: 'dashboard',
  currentCategoryIndex: 0,
  assessmentId: null,
  syncStatus: 'idle',
};

// Debounce timer for auto-sync
let syncTimer: ReturnType<typeof setTimeout> | null = null;

export const useHipaaStore = create<HipaaState & HipaaActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setOrgInfo: (field, value) =>
        set(state => ({ orgInfo: { ...state.orgInfo, [field]: value } })),

      setResponse: (specId, status, notes) => {
        set(state => ({
          responses: {
            ...state.responses,
            [specId]: {
              status,
              notes: notes !== undefined ? notes : (state.responses[specId]?.notes ?? ''),
            },
          },
        }));

        // Debounced auto-sync: wait 2s after last change before saving
        if (syncTimer) clearTimeout(syncTimer);
        syncTimer = setTimeout(() => get().syncToBackend(), 2000);
      },

      setView: (view, catIndex) =>
        set(state => ({
          currentView: view,
          currentCategoryIndex: catIndex !== undefined ? catIndex : state.currentCategoryIndex,
        })),

      reset: () => set({ responses: {}, currentView: 'dashboard', currentCategoryIndex: 0 }),

      setAssessmentId: (id) => set({ assessmentId: id }),

      syncToBackend: async () => {
        const { assessmentId, responses } = get();
        if (!assessmentId || !Object.keys(responses).length) return;

        set({ syncStatus: 'syncing' });
        try {
          await saveResponses(assessmentId, responses);
          set({ syncStatus: 'idle' });
        } catch {
          set({ syncStatus: 'error' });
        }
      },
    }),
    {
      name: 'hipaa_checklist_v1',
      // Persist locally as fallback — backend is source of truth when assessmentId is set
      partialize: state => ({ orgInfo: state.orgInfo, responses: state.responses, assessmentId: state.assessmentId }),
    }
  )
);

export function getSpecResponse(
  responses: Record<string, SpecResponse>,
  specId: string
): SpecResponse {
  return responses[specId] ?? { status: '', notes: '' };
}
