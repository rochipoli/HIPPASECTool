import { useHipaaStore } from '../store/useHipaaStore';
import { getCategoryStats } from '../utils/stats';
import { HIPAA_DATA } from '../data/hipaa';

export default function AssessmentSidebar() {
  const { currentCategoryIndex, responses, setView } = useHipaaStore();

  return (
    <aside className="assessment-sidebar card">
      <div style={{ fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: 12 }}>
        Categories
      </div>
      <ul className="sidebar-nav" role="list">
        {HIPAA_DATA.categories.map((cat, i) => {
          const cs = getCategoryStats(responses, cat.id);
          const dotCls = cs.pct >= 80 ? 'done' : cs.pct >= 30 ? 'partial' : cs.assessed > 0 ? 'started' : '';
          return (
            <li key={cat.id}>
              <button
                className={`sidebar-nav-item ${i === currentCategoryIndex ? 'active' : ''}`}
                onClick={() => setView('assessment', i)}
                aria-current={i === currentCategoryIndex ? 'step' : undefined}
              >
                <span className={`sidebar-nav-dot ${dotCls}`} />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {cat.title}
                </span>
                <span className="sidebar-nav-pct">{cs.pct}%</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
