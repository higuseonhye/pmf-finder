import { useState } from 'react';

export default function InterviewComplete({ result, baseUrl }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(result);
  const encoded = btoa(unescape(encodeURIComponent(json)));
  const importUrl = `${baseUrl}#/import?d=${encoded}`;

  const copy = () => {
    navigator.clipboard.writeText(importUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-2">Thanks!</h2>
        <p className="text-gray-600 mb-6">Send this link to the founder:</p>
        <div className="p-3 bg-gray-100 rounded-lg text-sm text-left break-all mb-4">
          {importUrl}
        </div>
        <button
          onClick={copy}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>
    </div>
  );
}
