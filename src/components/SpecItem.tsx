import { useState } from 'react';
import { Info } from 'lucide-react';
import { useHipaaStore, STATUS_OPTIONS, type StatusValue, getSpecResponse } from '../store/useHipaaStore';
import type { HipaaSpec } from '../data/hipaa';

interface Props {
  spec: HipaaSpec;
}

export default function SpecItem({ spec }: Props) {
  const [guidanceOpen, setGuidanceOpen] = useState(false);
  const { responses, setResponse } = useHipaaStore();
  const response = getSpecResponse(responses, spec.id);

  const handleStatus = (status: Exclude<StatusValue, ''>) => {
    setResponse(spec.id, response.status === status ? '' : status, response.notes);
  };

  return (
    <div className="spec-item">
      <div className="spec-header">
        <span className="spec-title">{spec.title}</span>
        <span className={`badge ${spec.type === 'R' ? 'badge-required' : 'badge-addressable'}`}>
          {spec.type === 'R' ? 'Required' : 'Addressable'}
        </span>
      </div>
      <div className="spec-body">
        <p className="spec-desc">{spec.description}</p>

        <button
          className="guidance-toggle"
          onClick={() => setGuidanceOpen(v => !v)}
          aria-expanded={guidanceOpen}
        >
          <Info size={14} /> Implementation Guidance
        </button>

        {guidanceOpen && (
          <div className="guidance-box">{spec.guidance}</div>
        )}

        <div className="status-group" role="group" aria-label={`Compliance status for ${spec.title}`}>
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`status-chip ${response.status === opt.value ? `active-${opt.value}` : ''}`}
              onClick={() => handleStatus(opt.value)}
              aria-pressed={response.status === opt.value}
            >
              <span className="status-dot" />
              {opt.label}
            </button>
          ))}
        </div>

        <div className="spec-notes">
          <label htmlFor={`notes-${spec.id}`}>Notes / Evidence</label>
          <textarea
            id={`notes-${spec.id}`}
            value={response.notes}
            onChange={e => setResponse(spec.id, response.status, e.target.value)}
            placeholder="Document evidence, planned actions, or exceptions…"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}
