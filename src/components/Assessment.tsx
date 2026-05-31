import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useHipaaStore } from '../store/useHipaaStore';
import { getCategoryStats, scoreToFillClass } from '../utils/stats';
import { HIPAA_DATA } from '../data/hipaa';
import AssessmentSidebar from './AssessmentSidebar';
import StandardBlock from './StandardBlock';

export default function Assessment() {
  const { currentCategoryIndex, responses, setView } = useHipaaStore();
  const cat = HIPAA_DATA.categories[currentCategoryIndex];
  const cs = getCategoryStats(responses, cat.id);
  const isFirst = currentCategoryIndex === 0;
  const isLast  = currentCategoryIndex === HIPAA_DATA.categories.length - 1;

  return (
    <div className="assessment-layout">
      <AssessmentSidebar />

      <div>
        {/* Category header */}
        <div className="category-header">
          <div className="category-header-top">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1 className="category-title">{cat.title}</h1>
                <span className="badge badge-cfr">{cat.cfr}</span>
              </div>
              <p className="category-desc">{cat.description}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)' }}>{cs.pct}%</div>
              <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{cs.assessed}/{cs.total} assessed</div>
            </div>
          </div>
          <div className="progress-bar-wrap" style={{ marginTop: 12, height: 8 }}>
            <div className={`progress-bar-fill ${scoreToFillClass(cs.pct)}`} style={{ width: `${cs.pct}%` }} />
          </div>
        </div>

        {/* Standards */}
        {cat.standards.map(std => (
          <StandardBlock key={std.id} standard={std} />
        ))}

        {/* Navigation */}
        <div className="assessment-nav">
          <button
            className="btn btn-secondary"
            onClick={() => setView('assessment', currentCategoryIndex - 1)}
            disabled={isFirst}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <div className="assessment-nav-center">
            {currentCategoryIndex + 1} / {HIPAA_DATA.categories.length}
          </div>
          {isLast ? (
            <button className="btn btn-success" onClick={() => setView('report')}>
              <Eye size={16} /> View Report
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setView('assessment', currentCategoryIndex + 1)}
            >
              Next <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
