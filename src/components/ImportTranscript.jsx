import { useState } from 'react';
import { addLead, updateLead, saveInterview, loadData } from '../store';
import { extractFromTranscript, extractLeadFromTranscript } from '../utils/transcriptExtractor';
import { useToast } from '../context/ToastContext';

const SPLIT_PATTERNS = /---+|Interview\s+\d+|###\s+Interview/mi;

export default function ImportTranscript({ data, onUpdate }) {
  const [transcript, setTranscript] = useState('');
  const [extracted, setExtracted] = useState(null);
  const [extractedBulk, setExtractedBulk] = useState([]);
  const [processing, setProcessing] = useState(false);
  const { addToast } = useToast();

  const handleExtract = () => {
    if (!transcript.trim()) return;
    setProcessing(true);
    setTimeout(() => {
      const chunks = transcript.split(SPLIT_PATTERNS).map((c) => c.trim()).filter((c) => c.length > 50);
      if (chunks.length > 1) {
        const bulk = chunks.map((chunk) => ({
          interview: extractFromTranscript(chunk),
          lead: extractLeadFromTranscript(chunk),
        }));
        setExtractedBulk(bulk);
        setExtracted(null);
      } else {
        setExtracted({
          interview: extractFromTranscript(transcript),
          lead: extractLeadFromTranscript(transcript),
        });
        setExtractedBulk([]);
      }
      setProcessing(false);
    }, 100);
  };

  const saveOne = (interview, lead, index = 0) => {
    const name = lead.name === 'Unknown' && index > 0 ? `Interview ${index + 1}` : lead.name;
    const leadData = addLead({ ...lead, name, country: '' });
    if (!leadData) return false;
    const newLead = leadData.leads[leadData.leads.length - 1];
    updateLead(newLead.id, { status: 'interviewed' });
    saveInterview(newLead.id, {
      se_very_disappointed: interview.se_very_disappointed,
      problem_exists: interview.problem_exists,
      problem_severity: interview.problem_severity,
      willing_to_pay: interview.willing_to_pay,
      notes: interview.notes,
    });
    return true;
  };

  const handleSaveOneClick = () => {
    if (!extracted) return;
    const { interview, lead } = extracted;
    if (saveOne(interview, lead, 0)) {
      onUpdate(loadData());
      setTranscript('');
      setExtracted(null);
      addToast('Interview imported. Check Results.');
    } else {
      addToast('Failed to add lead', 'error');
    }
  };

  const handleSaveBulk = () => {
    let saved = 0;
    extractedBulk.forEach(({ interview, lead }, i) => {
      if (saveOne(interview, lead, i)) saved++;
    });
    onUpdate(loadData());
    setTranscript('');
    setExtractedBulk([]);
    addToast(`${saved} interview(s) imported. Check Results.`);
  };

  const handleClear = () => {
    setTranscript('');
    setExtracted(null);
    setExtractedBulk([]);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Import transcript</h2>
      <p className="text-sm text-gray-600">
        Paste transcript(s). Use &quot;---&quot; to separate multiple. Agent extracts everything. One click to save.
      </p>

      <div>
        <label htmlFor="transcript" className="block text-sm font-medium text-gray-700 mb-1">
          Paste transcript
        </label>
        <textarea
          id="transcript"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="e.g.&#10;Interview with Sarah from Acme Corp&#10;Q: How would you feel if you could no longer use this?&#10;A: I'd be very disappointed. We have a real problem with X and we'd definitely pay for a solution..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 h-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleExtract}
          disabled={!transcript.trim() || processing}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? 'Extracting...' : 'Extract & preview'}
        </button>
        {transcript && (
          <button onClick={handleClear} className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50">
            Clear
          </button>
        )}
      </div>

      {extracted && (
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <h3 className="font-medium text-gray-900 mb-3">Extracted (review & save)</h3>
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-gray-500">Lead:</span> {extracted.lead.name}
              {extracted.lead.company && ` @ ${extracted.lead.company}`}
              {extracted.lead.role && ` (${extracted.lead.role})`}
            </div>
            <div>
              <span className="text-gray-500">Confidence:</span>{' '}
              {extracted.interview._confidence}/3 fields detected
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-4">
            <div className="p-2 bg-gray-50 rounded">
              <div className="text-gray-500 text-xs">Sean Ellis</div>
              <div>{extracted.interview.se_very_disappointed || '—'}</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="text-gray-500 text-xs">Problem</div>
              <div>{extracted.interview.problem_exists || '—'}</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="text-gray-500 text-xs">Severity</div>
              <div>{extracted.interview.problem_severity || '—'}</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="text-gray-500 text-xs">Willing to pay</div>
              <div>{extracted.interview.willing_to_pay || '—'}</div>
            </div>
          </div>
          {extracted.interview.notes && (
            <div className="mb-4">
              <div className="text-gray-500 text-xs mb-1">Notes</div>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">{extracted.interview.notes}</div>
            </div>
          )}
          <button
            onClick={handleSaveOneClick}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Save & add to Results
          </button>
        </div>
      )}

      {extractedBulk.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <h3 className="font-medium text-gray-900 mb-3">
            {extractedBulk.length} interview(s) extracted
          </h3>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {extractedBulk.map((item, i) => (
              <div key={i} className="text-sm p-2 bg-gray-50 rounded">
                {item.lead.name} @ {item.lead.company || '?'} — P:{item.interview.problem_exists || '?'} WTP:{item.interview.willing_to_pay || '?'}
              </div>
            ))}
          </div>
          <button
            onClick={handleSaveBulk}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Save all to Results
          </button>
        </div>
      )}
    </div>
  );
}
