import { useState } from 'react';

export default function ShareLink({ baseUrl }) {
  const [copied, setCopied] = useState(false);
  const interviewUrl = `${baseUrl}#/interview`;

  const copy = () => {
    navigator.clipboard.writeText(interviewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        readOnly
        value={interviewUrl}
        className="w-56 sm:w-72 border rounded px-2 py-1 text-xs bg-white"
      />
      <button
        onClick={copy}
        className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
      >
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  );
}
