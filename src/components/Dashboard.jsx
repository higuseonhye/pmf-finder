import { calcMetrics, exportData } from '../store';
import { getBenchmark, compareToBenchmark } from '../data/benchmarks';
import { extractKeywordFreq, extractProblemPhrases } from '../utils/insights';
import { generateReportHTML } from '../utils/reportGenerator';
import { useToast } from '../context/ToastContext';

export default function Dashboard({ data }) {
  const m = calcMetrics(data);
  const { addToast } = useToast();
  const benchmark = getBenchmark(data?.icp?.industry);
  const notesArray = (data?.leads || [])
    .filter((l) => l.status === 'interviewed' && data?.interviews?.[l.id]?.notes)
    .map((l) => data.interviews[l.id].notes);
  const keywords = extractKeywordFreq(notesArray);
  const problemPhrases = extractProblemPhrases(notesArray);

  const pmfColor = {
    weak: 'bg-red-100 text-red-800',
    medium: 'bg-amber-100 text-amber-800',
    strong: 'bg-green-100 text-green-800',
  }[m.pmfScore] || 'bg-gray-100 text-gray-800';

  const handleExport = () => {
    try {
      const json = exportData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pmf-finder-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('Data exported');
    } catch {
      addToast('Export failed', 'error');
    }
  };

  const handleReport = () => {
    try {
      const html = generateReportHTML(data);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pmf-report-${new Date().toISOString().slice(0, 10)}.html`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('Report downloaded');
    } catch {
      addToast('Report failed', 'error');
    }
  };

  const probCompare = compareToBenchmark(m.problemRate, benchmark, 'problemRate');
  const willCompare = compareToBenchmark(m.willingnessRate, benchmark, 'willingnessRate');
  const seCompare = m.seRate != null && compareToBenchmark(m.seRate, benchmark, 'seVeryDisappointed');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        <div className="flex gap-2">
          <button
            onClick={handleReport}
            className="text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md px-3 py-1.5 hover:bg-blue-50"
          >
            Download report
          </button>
          <button
            onClick={handleExport}
            className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50"
          >
            Export data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
          <div className="text-sm text-gray-500">Total Leads</div>
          <div className="text-2xl font-bold text-gray-900">{m.totalLeads}</div>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
          <div className="text-sm text-gray-500">Response Rate</div>
          <div className="text-2xl font-bold text-gray-900">{m.responseRate}%</div>
          <p className="text-xs text-gray-500">Industry avg: ~{benchmark.responseRate.avg}%</p>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
          <div className="text-sm text-gray-500">Interviews</div>
          <div className="text-2xl font-bold text-gray-900">{m.interviewCount}</div>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
          <div className="text-sm text-gray-500">PMF Score</div>
          <div className={`text-lg font-bold px-2 py-1 rounded inline-block capitalize ${pmfColor}`}>
            {m.pmfScore}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
          <div className="text-sm text-gray-500">Problem Rate</div>
          <div className="text-xl font-semibold text-gray-900">{m.problemRate}%</div>
          {probCompare && (
            <p className={`text-xs mt-1 ${probCompare.color === 'green' ? 'text-green-600' : probCompare.color === 'red' ? 'text-red-600' : 'text-amber-600'}`}>
              {probCompare.label} (avg {benchmark.problemRate.avg}%)
            </p>
          )}
        </div>
        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
          <div className="text-sm text-gray-500">Willingness to Pay</div>
          <div className="text-xl font-semibold text-gray-900">{m.willingnessRate}%</div>
          {willCompare && (
            <p className={`text-xs mt-1 ${willCompare.color === 'green' ? 'text-green-600' : willCompare.color === 'red' ? 'text-red-600' : 'text-amber-600'}`}>
              {willCompare.label} (avg {benchmark.willingnessRate.avg}%)
            </p>
          )}
        </div>
        {m.interviewCount > 0 && (
          <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="text-sm text-gray-500">Very Disappointed (Sean Ellis)</div>
            <div className="text-xl font-semibold text-gray-900">{m.seRate}%</div>
            {seCompare && (
              <p className={`text-xs mt-1 ${seCompare.color === 'green' ? 'text-green-600' : seCompare.color === 'red' ? 'text-red-600' : 'text-amber-600'}`}>
                {seCompare.label} (40% = PMF)
              </p>
            )}
          </div>
        )}
      </div>

      {keywords.length > 0 && (
        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
          <h3 className="font-medium text-gray-900 mb-2">Keywords from interviews</h3>
          <p className="text-xs text-gray-500 mb-2">Words mentioned 2+ times across notes</p>
          <div className="flex flex-wrap gap-2">
            {keywords.map(({ word, count }) => (
              <span
                key={word}
                className="px-2 py-1 bg-gray-100 rounded text-sm"
              >
                {word} ({count})
              </span>
            ))}
          </div>
        </div>
      )}

      {problemPhrases.length > 0 && (
        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
          <h3 className="font-medium text-gray-900 mb-2">Pain point snippets</h3>
          <p className="text-xs text-gray-500 mb-2">Excerpts mentioning problem/struggle/pain</p>
          <ul className="space-y-1 text-sm text-gray-700">
            {problemPhrases.map((p, i) => (
              <li key={i} className="italic">&quot;{p}&quot;</li>
            ))}
          </ul>
        </div>
      )}

      {m.totalLeads === 0 && (
        <div className="p-6 border border-gray-200 rounded-lg bg-white text-center text-gray-500" role="status">
          Add leads and conduct interviews to see your PMF metrics.
        </div>
      )}
    </div>
  );
}
