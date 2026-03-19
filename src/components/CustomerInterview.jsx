import { useState } from 'react';

const STEPS = [
  { id: 'intro', q: 'Your name, company, and role?', type: 'text', field: 'lead' },
  { id: 'se', q: 'How would you feel if you could no longer use this product?', type: 'choice', field: 'se_very_disappointed', opts: ['Very disappointed', 'Somewhat disappointed', 'Not disappointed'] },
  { id: 'problem', q: 'Do you experience the problem they\'re solving?', type: 'choice', field: 'problem_exists', opts: ['Yes', 'No'] },
  { id: 'severity', q: 'How painful is this for you?', type: 'choice', field: 'problem_severity', opts: ['High (7-10)', 'Medium (4-6)', 'Low (1-3)'] },
  { id: 'wtp', q: 'Would you pay for a solution?', type: 'choice', field: 'willing_to_pay', opts: ['Yes', 'No'] },
  { id: 'notes', q: 'Anything else?', type: 'text', field: 'notes' },
];

const FIELD_MAP = {
  'Very disappointed': 'very_disappointed',
  'Somewhat disappointed': 'somewhat_disappointed',
  'Not disappointed': 'not_disappointed',
  'High (7-10)': 'high',
  'Medium (4-6)': 'medium',
  'Low (1-3)': 'low',
  'Yes': 'yes',
  'No': 'no',
};

export default function CustomerInterview({ onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [input, setInput] = useState('');

  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = (value) => {
    const val = typeof value === 'string' && FIELD_MAP[value] ? FIELD_MAP[value] : value;
    const next = { ...data, [s.field]: val };
    setData(next);
    if (isLast) {
      onComplete(buildResult(next));
    } else {
      setStep(step + 1);
      setInput('');
    }
  };

  const buildResult = (d) => {
    const parsed = (d.lead || '').split(/[,@]/).map((x) => x.trim());
    return {
      name: parsed[0] || 'Unknown',
      company: parsed[1] || '',
      role: parsed[2] || '',
      se_very_disappointed: d.se_very_disappointed || '',
      problem_exists: d.problem_exists || '',
      problem_severity: d.problem_severity || '',
      willing_to_pay: d.willing_to_pay || '',
      notes: d.notes || '',
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-sm text-gray-500 mb-2">Question {step + 1} of {STEPS.length}</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{s.q}</h2>
        {s.type === 'choice' ? (
          <div className="space-y-2">
            {s.opts.map((opt) => (
              <button
                key={opt}
                onClick={() => handleNext(opt)}
                className="w-full p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-300 text-left"
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && input.trim() && handleNext(input.trim())}
              placeholder="Type your answer..."
              className="w-full border rounded-lg px-4 py-3"
            />
            <button
              onClick={() => input.trim() && handleNext(input.trim())}
              className="mt-3 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
