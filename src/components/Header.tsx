import { ShieldCheck } from 'lucide-react';
import { useHipaaStore, type ViewType } from '../store/useHipaaStore';

const VIEWS: { id: ViewType; label: string }[] = [
  { id: 'dashboard',  label: 'Dashboard' },
  { id: 'assessment', label: 'Assessment' },
  { id: 'report',     label: 'Report' },
];

export default function Header() {
  const currentView = useHipaaStore(s => s.currentView);
  const setView = useHipaaStore(s => s.setView);

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-brand">
          <ShieldCheck className="brand-icon" />
          <div>
            <div className="brand-title">HIPAA Security Rule</div>
            <div className="brand-subtitle">Interactive Compliance Checklist</div>
          </div>
        </div>
        <nav className="header-nav" aria-label="Main navigation">
          {VIEWS.map(v => (
            <button
              key={v.id}
              className={`nav-btn ${currentView === v.id ? 'active' : ''}`}
              onClick={() => setView(v.id)}
              aria-current={currentView === v.id ? 'page' : undefined}
            >
              {v.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
