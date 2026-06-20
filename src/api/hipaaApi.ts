// HIPAA checklist data is stored in the shared OpsAssist backend.
// In development, Vite proxies /api/* to http://localhost:3001 (see vite.config.ts).

const BASE = '/api/hipaa';

async function apiReq<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export interface AssessmentSummary {
  id: string;
  org_name: string;
  assessor: string;
  assessment_date: string;
  updated_at: string;
}

export interface AssessmentDetail extends AssessmentSummary {
  responses: Record<string, { status: string; notes: string }>;
  evidence: Array<{ id: string; spec_id: string; file_name: string; s3_key: string }>;
}

export interface CreateAssessmentInput {
  orgName: string;
  assessor: string;
  assessorTitle?: string;
  assessmentDate?: string;
}

export const listAssessments  = () => apiReq<AssessmentSummary[]>('GET', '/assessments');
export const getAssessment    = (id: string) => apiReq<AssessmentDetail>('GET', `/assessments/${id}`);
export const createAssessment = (input: CreateAssessmentInput) => apiReq<AssessmentDetail>('POST', '/assessments', input);
export const saveResponses    = (id: string, responses: Record<string, { status: string; notes: string }>) =>
  apiReq<{ updated: number }>('PUT', `/assessments/${id}/responses`, { responses });
