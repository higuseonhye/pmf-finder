import { useState, useEffect, useCallback } from 'react';
import { loadData, importFromCustomerResult, setDemoData } from './store';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import ICP from './components/ICP';
import Leads from './components/Leads';
import InterviewGuide from './components/InterviewGuide';
import ImportTranscript from './components/ImportTranscript';
import AgentInterview from './components/AgentInterview';
import CustomerInterview from './components/CustomerInterview';
import AIInterview from './components/AIInterview';
import InterviewComplete from './components/InterviewComplete';
import ShareLink from './components/ShareLink';
import Pricing from './components/Pricing';

const SEEN_KEY = 'pmf-finder-seen';

function useHashRoute() {
  const [route, setRoute] = useState(() => {
    const h = window.location.hash.slice(1) || '/';
    const [path, search] = h.split('?');
    const params = new URLSearchParams(search);
    return { path: path || '/', params };
  });

  useEffect(() => {
    const handler = () => {
      const h = window.location.hash.slice(1) || '/';
      const [path, search] = h.split('?');
      setRoute({ path: path || '/', params: new URLSearchParams(search) });
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return route;
}

export default function App() {
  const [data, setData] = useState(() => loadData());
  const [showLanding, setShowLanding] = useState(() => !localStorage.getItem(SEEN_KEY));
  const [customerResult, setCustomerResult] = useState(null);
  const [tab, setTab] = useState('dashboard');
  const { path, params } = useHashRoute();

  const refreshData = useCallback(() => setData(loadData()), []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handle /import?d=base64 - import from customer interview result
  useEffect(() => {
    if (path === '/import' && params.get('d')) {
      try {
        const decoded = decodeURIComponent(escape(atob(params.get('d'))));
        const result = JSON.parse(decoded);
        if (result && (result.name || result.se_very_disappointed || result.problem_exists)) {
          importFromCustomerResult(result);
          refreshData();
          localStorage.setItem(SEEN_KEY, '1');
          setShowLanding(false);
          window.location.hash = '/app';
        }
      } catch (e) {
        console.error('Import failed', e);
      }
    }
  }, [path, params, refreshData]);

  const handleStart = () => {
    localStorage.setItem(SEEN_KEY, '1');
    setShowLanding(false);
    window.location.hash = '/app';
  };

  const handleDemo = () => {
    setDemoData();
    refreshData();
    localStorage.setItem(SEEN_KEY, '1');
    setShowLanding(false);
    window.location.hash = '/app';
  };

  const handleCustomerComplete = (result) => {
    setCustomerResult(result);
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';

  // Customer-facing interview (shared link)
  if (path === '/interview' || path === '/interview/ai') {
    if (customerResult) {
      return <InterviewComplete result={customerResult} baseUrl={baseUrl} />;
    }
    if (path === '/interview/ai') {
      return <AIInterview onComplete={handleCustomerComplete} baseUrl={baseUrl} />;
    }
    return <CustomerInterview onComplete={handleCustomerComplete} />;
  }

  // Landing (first visit)
  if (showLanding && path !== '/app') {
    return <Landing onStart={handleStart} onDemo={handleDemo} />;
  }

  // Main app
  const tabs = [
    { id: 'dashboard', label: 'Results' },
    { id: 'interview', label: 'Interview' },
    { id: 'import', label: 'Import' },
    { id: 'leads', label: 'Leads' },
    { id: 'icp', label: 'ICP' },
    { id: 'guide', label: 'Guide' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-xl font-bold text-gray-800">PMF Finder</h1>
          <div className="flex items-center gap-2">
            <ShareLink baseUrl={baseUrl} />
            <Pricing />
          </div>
        </div>
        <nav className="flex gap-2 mt-2 flex-wrap" role="navigation" aria-label="Main navigation">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-4" role="main">
        {tab === 'dashboard' && <Dashboard data={data} />}
        {tab === 'interview' && <AgentInterview data={data} onUpdate={refreshData} />}
        {tab === 'import' && <ImportTranscript data={data} onUpdate={refreshData} />}
        {tab === 'icp' && <ICP data={data} onUpdate={refreshData} />}
        {tab === 'leads' && <Leads data={data} onUpdate={refreshData} />}
        {tab === 'guide' && <InterviewGuide />}
      </main>
    </div>
  );
}
