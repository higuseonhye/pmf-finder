import { useState, useEffect } from 'react';
import { saveInterview } from '../store';
import { validateInterview } from '../utils/validation';
import { useToast } from '../context/ToastContext';
import { FRAMEWORKS } from '../data/interviewTemplates';
import { extractFromTranscript } from '../utils/transcriptExtractor';

export default function InterviewForm({ leadId, lead, interview, onSave }) {
  const [form, setForm] = useState({
    problem_exists: '',
    problem_severity: '',
    willing_to_pay: '',
    se_very_disappointed: '',
    notes: '',
  });
  const [showGuide, setShowGuide] = useState(false);
  const [transcriptPaste, setTranscriptPaste] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    if (interview) {
      setForm({
        problem_exists: interview.problem_exists || '',
        problem_severity: interview.problem_severity || '',
        willing_to_pay: interview.willing_to_pay || '',
        se_very_disappointed: interview.se_very_disappointed || '',
        notes: interview.notes || '',
      });
    } else {
      setForm({ problem_exists: '', problem_severity: '', willing_to_pay: '', se_very_disappointed: '', notes: '' });
    }
  }, [interview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validated = validateInterview(form);
    const result = saveInterview(leadId, validated);
    if (result) {
      onSave();
    } else {
      addToast('Failed to save interview', 'error');
    }
  };

  const seQuestion = FRAMEWORKS.seanEllis.questions[0];

  const handlePasteExtract = () => {
    if (!transcriptPaste.trim()) return;
    const extracted = extractFromTranscript(transcriptPaste);
    if (extracted) {
      setForm({
        problem_exists: extracted.problem_exists || form.problem_exists,
        problem_severity: extracted.problem_severity || form.problem_severity,
        willing_to_pay: extracted.willing_to_pay || form.willing_to_pay,
        se_very_disappointed: extracted.se_very_disappointed || form.se_very_disappointed,
        notes: extracted.notes || form.notes,
      });
      setTranscriptPaste('');
      addToast('Extracted from transcript');
    }
  };

  if (!lead) return null;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50" role="form" aria-labelledby="interview-heading">
      <h3 id="interview-heading" className="font-medium mb-3 text-gray-900">
        Interview: {lead.name} ({lead.company || '—'})
      </h3>

      <div className="mb-4 p-3 bg-white rounded border border-gray-200">
        <div className="text-sm font-medium text-gray-700 mb-1">Paste transcript → auto-fill</div>
        <textarea
          value={transcriptPaste}
          onChange={(e) => setTranscriptPaste(e.target.value)}
          placeholder="Paste interview text here..."
          className="w-full border rounded px-2 py-1 text-sm h-16 mb-2"
        />
        <button
          type="button"
          onClick={handlePasteExtract}
          disabled={!transcriptPaste.trim()}
          className="text-sm text-blue-600 hover:underline disabled:opacity-50"
        >
          Extract & fill form
        </button>
      </div>

      <button
        type="button"
        onClick={() => setShowGuide(!showGuide)}
        className="text-sm text-blue-600 hover:underline mb-3"
      >
        {showGuide ? 'Hide' : 'Show'} question guide
      </button>
      {showGuide && (
        <div className="mb-4 p-3 bg-white rounded border border-gray-200 text-sm">
          <p className="font-medium text-gray-700 mb-1">{seQuestion.question}</p>
          <p className="text-xs text-blue-600">{seQuestion.tip}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 max-w-md" noValidate>
        <div>
          <label htmlFor="se-very-disappointed" className="block text-sm font-medium text-gray-700 mb-1">
            {seQuestion.question} (Sean Ellis PMF)
          </label>
          <select
            id="se-very-disappointed"
            value={form.se_very_disappointed}
            onChange={(e) => setForm({ ...form, se_very_disappointed: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select</option>
            <option value="very_disappointed">Very disappointed</option>
            <option value="somewhat_disappointed">Somewhat disappointed</option>
            <option value="not_disappointed">Not disappointed</option>
          </select>
          <p className="text-xs text-gray-500 mt-0.5">40%+ &quot;Very disappointed&quot; = PMF signal</p>
        </div>
        <div>
          <label htmlFor="problem-exists" className="block text-sm font-medium text-gray-700 mb-1">
            Problem exists?
          </label>
          <select
            id="problem-exists"
            value={form.problem_exists}
            onChange={(e) => setForm({ ...form, problem_exists: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <label htmlFor="problem-severity" className="block text-sm font-medium text-gray-700 mb-1">
            Problem severity
          </label>
          <select
            id="problem-severity"
            value={form.problem_severity}
            onChange={(e) => setForm({ ...form, problem_severity: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div>
          <label htmlFor="willing-to-pay" className="block text-sm font-medium text-gray-700 mb-1">
            Willing to pay?
          </label>
          <select
            id="willing-to-pay"
            value={form.willing_to_pay}
            onChange={(e) => setForm({ ...form, willing_to_pay: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <label htmlFor="interview-notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (quotes, pain points, keywords)
          </label>
          <textarea
            id="interview-notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            maxLength={2000}
            placeholder="Write key quotes and pain points. Used for insights."
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Interview
        </button>
      </form>
    </div>
  );
}
