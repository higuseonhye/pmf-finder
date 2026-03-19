import { useState } from 'react';

export default function ShareLink({ baseUrl }) {
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState('form'); // form | ai
  const formUrl = `${baseUrl}#/interview`;
  const aiUrl = `${baseUrl}#/interview/ai`;
  const interviewUrl = mode === 'ai' ? aiUrl : formUrl;

  const copy = () => {
    navigator.clipboard.writeText(interviewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="border rounded px-2 py-1 text-xs"
      >
        <option value="form">Form</option>
        <option value="ai">AI Interview</option>
      </select>
      <input
        readOnly
        value={interviewUrl}
        className="w-40 sm:w-56 border rounded px-2 py-1 text-xs bg-white"
      />
      <button
        onClick={copy}
        className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}
