import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Assessment from './components/Assessment';
import Report from './components/Report';
import { useHipaaStore } from './store/useHipaaStore';

export default function App() {
  const currentView = useHipaaStore(s => s.currentView);

  return (
    <>
      <Header />
      <main className="app-content">
        {currentView === 'dashboard'  && <Dashboard />}
        {currentView === 'assessment' && <Assessment />}
        {currentView === 'report'     && <Report />}
      </main>
    </>
  );
}
