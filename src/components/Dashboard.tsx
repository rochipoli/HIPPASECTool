import { Users, Lock, Code, Home, FileText, ChevronRight, Eye, RotateCcw, Play } from 'lucide-react';
import { useHipaaStore } from '../store/useHipaaStore';
import { getCategoryStats, getOverallStats, scoreToFillClass } from '../utils/stats';
import { HIPAA_DATA, type CategoryIcon } from '../data/hipaa';
import DonutChart from './DonutChart';

const CAT_ICONS: Record<CategoryIcon, React.ReactNode> = {
  admin:    <Users size={20} />,
  physical: <Lock size={20} />,
  technical:<Code size={20} />,
  org:      <Home size={20} />,
  policies: <FileText size={20} />,
};

export default function Dashboard() {
  const { orgInfo, responses, setOrgInfo, setView, reset } = useHipaaStore();
  const stats = getOverallStats(responses);
  const assessedPct = stats.total ? Math.round((stats.assessed / stats.total) * 100) : 0;

  const chartSegments = [
    { value: stats.counts.compliant,    color: '#16a34a' },
    { value: stats.counts.partial,      color: '#d97706' },
    { value: stats.counts.noncompliant, color: '#dc2626' },
    { value: stats.counts.na,           color: '#6b7280' },
    { value: stats.counts[''],          color: '#e2e8f0' },
  ];

  const handleReset = () => {
    if (window.confirm('Reset all responses? This cannot be undone.')) {
      reset();
    }
  };

  return (
    <>
      <div className="dashboard-top">
        {/* Org Info Form */}
        <div className="card">
          <div className="card-header">
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--navy)' }}>
              Organization Information
            </div>
            <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Enter your organization details for the compliance report.
            </div>
          </div>
          <div className="card-body">
            <div className="org-form">
              <div className="form-group">
                <label htmlFor="orgName">Organization Name</label>
                <input
                  id="orgName"
                  type="text"
                  placeholder="Acme Health System"
                  value={orgInfo.name}
                  maxLength={200}
                  onChange={e => setOrgInfo('name', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="assessDate">Assessment Date</label>
                <input
                  id="assessDate"
                  type="date"
                  value={orgInfo.date}
                  onChange={e => setOrgInfo('date', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="assessorName">Assessor Name</label>
                <input
                  id="assessorName"
                  type="text"
                  placeholder="Jane Smith"
                  value={orgInfo.assessor}
                  maxLength={200}
                  onChange={e => setOrgInfo('assessor', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="assessorTitle">Assessor Title</label>
                <input
                  id="assessorTitle"
                  type="text"
                  placeholder="CISO / IT Security Manager"
                  value={orgInfo.assessorTitle}
                  maxLength={200}
                  onChange={e => setOrgInfo('assessorTitle', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="card">
          <div className="card-header">
            <div style={{ fontWeight: 700, color: 'var(--navy)' }}>Overall Progress</div>
          </div>
          <div className="card-body">
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <DonutChart segments={chartSegments} size={140} />
              <div className="score-ring-label" style={{ marginTop: 6 }}>Assessment Completion</div>
              <div className="score-ring-value">{assessedPct}%</div>
            </div>
            <div className="summary-stats">
              <div className="stat-card" style={{ background: 'var(--compliant-bg)' }}>
                <div className="stat-card-value" style={{ color: 'var(--compliant)' }}>{stats.counts.compliant}</div>
                <div className="stat-card-label">Compliant</div>
              </div>
              <div className="stat-card" style={{ background: 'var(--partial-bg)' }}>
                <div className="stat-card-value" style={{ color: 'var(--partial)' }}>{stats.counts.partial}</div>
                <div className="stat-card-label">Partial</div>
              </div>
              <div className="stat-card" style={{ background: 'var(--noncompliant-bg)' }}>
                <div className="stat-card-value" style={{ color: 'var(--noncompliant)' }}>{stats.counts.noncompliant}</div>
                <div className="stat-card-label">Non-Compliant</div>
              </div>
              <div className="stat-card" style={{ background: 'var(--na-bg)' }}>
                <div className="stat-card-value" style={{ color: 'var(--na)' }}>{stats.counts.na}</div>
                <div className="stat-card-label">N/A</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div style={{ marginTop: 24 }}>
        <div className="section-title">Safeguard Categories</div>
        <div className="category-cards">
          {HIPAA_DATA.categories.map((cat, i) => {
            const cs = getCategoryStats(responses, cat.id);
            return (
              <div
                key={cat.id}
                className="category-card-item"
                onClick={() => setView('assessment', i)}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setView('assessment', i); } }}
                aria-label={`Go to ${cat.title}`}
              >
                <div className="cat-icon">{CAT_ICONS[cat.icon]}</div>
                <div className="cat-info">
                  <div className="cat-title">{cat.title}</div>
                  <div className="cat-meta">
                    <span className="cat-cfr">{cat.cfr} · {cs.total} controls</span>
                    <span className="cat-pct">{cs.pct}%</span>
                  </div>
                  <div className="cat-progress">
                    <div className="progress-bar-wrap" style={{ marginTop: 4 }}>
                      <div className={`progress-bar-fill ${scoreToFillClass(cs.pct)}`} style={{ width: `${cs.pct}%` }} />
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="dashboard-actions">
        <button className="btn btn-primary btn-lg" onClick={() => setView('assessment')}>
          <Play size={18} />
          {stats.assessed > 0 ? 'Continue Assessment' : 'Start Assessment'}
        </button>
        <button className="btn btn-secondary btn-lg" onClick={() => setView('report')}>
          <Eye size={18} /> View Report
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleReset}
          style={{ marginLeft: 'auto' }}
        >
          <RotateCcw size={16} /> Reset All
        </button>
      </div>
    </>
  );
}
