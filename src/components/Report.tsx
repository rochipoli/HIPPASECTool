import { Download } from 'lucide-react';
import { useHipaaStore, STATUS_META, getSpecResponse } from '../store/useHipaaStore';
import { getCategoryStats, getOverallStats, scoreToFillClass } from '../utils/stats';
import { HIPAA_DATA } from '../data/hipaa';
import { exportPDF } from '../utils/pdf';
import DonutChart from './DonutChart';

export default function Report() {
  const { orgInfo, responses } = useHipaaStore();
  const stats = getOverallStats(responses);

  const chartSegments = [
    { value: stats.counts.compliant,    color: '#16a34a' },
    { value: stats.counts.partial,      color: '#d97706' },
    { value: stats.counts.noncompliant, color: '#dc2626' },
    { value: stats.counts.na,           color: '#6b7280' },
    { value: stats.counts[''],          color: '#e2e8f0' },
  ];

  const issues = HIPAA_DATA.allSpecs
    .filter(sp => ['noncompliant', 'partial'].includes(getSpecResponse(responses, sp.id).status))
    .sort((a, b) => {
      const order: Record<string, number> = { noncompliant: 0, partial: 1 };
      return order[getSpecResponse(responses, a.id).status] - order[getSpecResponse(responses, b.id).status];
    });

  const unassessedCount = HIPAA_DATA.allSpecs.filter(sp => getSpecResponse(responses, sp.id).status === '').length;

  return (
    <>
      {/* Report header */}
      <div className="report-header-bar">
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy)' }}>
            Compliance Assessment Report
          </h1>
          <div className="report-org">
            {orgInfo.name && <><strong>{orgInfo.name}</strong> · </>}
            {orgInfo.assessor && <>Assessed by: {orgInfo.assessor}{orgInfo.assessorTitle ? `, ${orgInfo.assessorTitle}` : ''} · </>}
            {orgInfo.date || 'Date not set'}
          </div>
        </div>
        <button className="btn btn-primary btn-lg" onClick={() => exportPDF(orgInfo, responses)}>
          <Download size={18} /> Export PDF
        </button>
      </div>

      {/* Stats row */}
      <div className="report-stats-row">
        {([
          { cls: 'compliant',    key: 'compliant',    label: 'Compliant' },
          { cls: 'partial',      key: 'partial',      label: 'Partial' },
          { cls: 'noncompliant', key: 'noncompliant', label: 'Non-Compliant' },
          { cls: 'na',           key: 'na',           label: 'N/A' },
          { cls: 'unassessed',   key: '',             label: 'Not Assessed' },
        ] as const).map(s => (
          <div key={s.cls} className={`report-stat ${s.cls}`}>
            <div className="report-stat-value">{stats.counts[s.key]}</div>
            <div className="report-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Compliance overview */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div style={{ fontWeight: 700, color: 'var(--navy)' }}>Compliance Overview</div>
        </div>
        <div className="card-body">
          <div className="report-chart-row">
            <div className="score-ring-container">
              <DonutChart segments={chartSegments} size={200} />
              <div className="score-ring-label">Compliance Score</div>
              <div className="score-ring-value">{stats.score}%</div>
            </div>
            <div className="report-legend">
              {(Object.entries(STATUS_META) as [string, { label: string; color: string }][]).map(([key, meta]) => {
                const count = stats.counts[key] ?? 0;
                const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={key} className="legend-item">
                    <div className="legend-dot" style={{ background: meta.color }} />
                    <span className="legend-label">{meta.label}</span>
                    <span className="legend-pct" style={{ color: meta.color }}>
                      {count}{' '}
                      <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({pct}%)</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {unassessedCount > 0 && (
            <div style={{ padding: '10px 14px', background: 'var(--partial-bg)', borderRadius: 'var(--radius)', fontSize: '.85rem', color: '#92400e', border: '1px solid var(--partial)' }}>
              <strong>⚠ {unassessedCount} control{unassessedCount !== 1 ? 's' : ''} not yet assessed.</strong>{' '}
              Complete the assessment for an accurate compliance picture.
            </div>
          )}
        </div>
      </div>

      {/* Category table */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div style={{ fontWeight: 700, color: 'var(--navy)' }}>Results by Category</div>
        </div>
        <div className="card-body" style={{ padding: 0, overflow: 'auto' }}>
          <table className="category-table">
            <thead>
              <tr>
                <th>Category</th>
                <th style={{ textAlign: 'center' }}>Compliant</th>
                <th style={{ textAlign: 'center' }}>Partial</th>
                <th style={{ textAlign: 'center' }}>Non-Compliant</th>
                <th style={{ textAlign: 'center' }}>N/A</th>
                <th style={{ textAlign: 'center' }}>Not Assessed</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {HIPAA_DATA.categories.map(cat => {
                const cs = getCategoryStats(responses, cat.id);
                return (
                  <tr key={cat.id}>
                    <td>
                      <strong>{cat.title}</strong>
                      <br />
                      <span style={{ color: 'var(--text-muted)', fontSize: '.75rem' }}>{cat.cfr}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>{cs.counts.compliant}</td>
                    <td style={{ textAlign: 'center' }}>{cs.counts.partial}</td>
                    <td style={{ textAlign: 'center' }}>{cs.counts.noncompliant}</td>
                    <td style={{ textAlign: 'center' }}>{cs.counts.na}</td>
                    <td style={{ textAlign: 'center' }}>{cs.counts['']}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar-wrap" style={{ width: 80 }}>
                          <div className={`progress-bar-fill ${scoreToFillClass(cs.pct)}`} style={{ width: `${cs.pct}%` }} />
                        </div>
                        <span style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{cs.pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issues requiring attention */}
      <div className="card">
        <div className="card-header">
          <div style={{ fontWeight: 700, color: 'var(--navy)' }}>Items Requiring Attention</div>
          <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Non-compliant and partially compliant controls sorted by priority.
          </div>
        </div>
        <div className="card-body">
          {issues.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✅</div>
              <div className="empty-state-text">No non-compliant or partial items found.</div>
            </div>
          ) : (
            <div className="issues-list">
              {issues.map(sp => {
                const r = getSpecResponse(responses, sp.id);
                const meta = STATUS_META[r.status];
                const cat = HIPAA_DATA.categories.find(c => c.id === sp.categoryId);
                return (
                  <div key={sp.id} className="issue-item">
                    <div className="issue-status-dot" style={{ background: meta.color }} />
                    <div className="issue-info">
                      <div className="issue-title">{sp.title}</div>
                      <div className="issue-meta">
                        {cat?.title} · {sp.type === 'R' ? 'Required' : 'Addressable'}
                      </div>
                      {r.notes && <div className="issue-notes">{r.notes}</div>}
                    </div>
                    <span className={`badge ${r.status === 'noncompliant' ? 'badge-required' : 'badge-addressable'}`}>
                      {meta.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
