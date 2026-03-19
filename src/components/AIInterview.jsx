import { useState, useRef, useEffect } from 'react';

const INITIAL_AI = "Hi! I'm conducting a quick PMF interview. What's your name, company, and role?";

export default function AIInterview({ onComplete, baseUrl }) {
  const [messages, setMessages] = useState([{ role: 'assistant', content: INITIAL_AI }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const apiUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/chat` : '/api/chat';

  const send = async (userMsg) => {
    if (!userMsg?.trim()) return;
    const newMessages = [...messages, { role: 'user', content: userMsg.trim() }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API error');

      const reply = data.reply || '';
      const done = /thanks!?\s*that'?s all/i.test(reply);

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);

      if (done) {
        setLoading(true);
        const extractRes = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [...newMessages, { role: 'assistant', content: reply }], extract: true }),
        });
        const extractData = await extractRes.json();
        if (extractData.extracted) {
          const r = extractData.extracted;
          onComplete({
            name: r.name || 'Unknown',
            company: r.company || '',
            role: r.role || '',
            se_very_disappointed: r.se_very_disappointed || '',
            problem_exists: r.problem_exists || '',
            problem_severity: r.problem_severity || '',
            willing_to_pay: r.willing_to_pay || '',
            notes: r.notes || '',
          });
        } else {
          onComplete({ name: 'Unknown', company: '', role: '', se_very_disappointed: '', problem_exists: '', problem_severity: '', willing_to_pay: '', notes: '' });
        }
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-lg px-4 py-2 ${
                  m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border shadow-sm'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-lg px-4 py-2 text-gray-500">Thinking...</div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer..."
            className="flex-1 border rounded-lg px-4 py-3"
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
