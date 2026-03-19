import { useState, useRef, useEffect } from 'react';
import { addLead, updateLead, saveInterview, loadData } from '../store';
import { useToast } from '../context/ToastContext';
import { INTERVIEW_STEPS, PERSONAS } from '../data/agentInterviewFlow';
import { parseLeadInfo } from '../utils/leadParser';

export default function AgentInterview({ data, onUpdate }) {
  const [mode, setMode] = useState(null); // null | 'live' | 'simulated'
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentInput, setCurrentInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [persona, setPersona] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const bottomRef = useRef(null);
  const { addToast } = useToast();

  const leads = data?.leads || [];
  const step = INTERVIEW_STEPS[stepIndex];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Simulated: auto-answer lead_info
  useEffect(() => {
    if (mode === 'simulated' && stepIndex === 0 && step?.field === 'lead_info') {
      const t = setTimeout(() => {
        const fakeLead = 'Sarah Chen, Practice Corp, Product Manager';
        setChatHistory((h) => [...h, { speaker: 'user', text: fakeLead }]);
        setAnswers({ lead_info: fakeLead, name: 'Sarah Chen', company: 'Practice Corp', role: 'Product Manager' });
        setStepIndex(1);
        setChatHistory((h) => [...h, { speaker: 'agent', text: INTERVIEW_STEPS[1].agent }]);
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [mode, stepIndex, step?.field]);

  // Simulated: auto-answer choice steps
  useEffect(() => {
    if (mode === 'simulated' && persona && step?.type === 'choice' && step?.field && stepIndex > 0) {
      const reply = getPersonaReply(step.field);
      const respVal = getPersonaResponse(step.field);
      if (reply && respVal) {
        const t = setTimeout(() => {
          setChatHistory((h) => [...h, { speaker: 'user', text: reply }]);
          setAnswers((a) => ({ ...a, [step.field]: respVal }));
          advanceSimulated(step, stepIndex, { ...answers, [step.field]: respVal });
        }, 1200);
        return () => clearTimeout(t);
      }
    }
  }, [mode, persona, stepIndex, step?.type, step?.field]);

  const addToHistory = (speaker, text, isAgent = true) => {
    setChatHistory((h) => [...h, { speaker: isAgent ? 'agent' : 'user', text }]);
  };

  const startInterview = (m, leadId = null) => {
    setMode(m);
    const lead = leadId ? leads.find((l) => l.id === leadId) : null;
    setSelectedLead(lead);
    setAnswers(lead ? { name: lead.name, company: lead.company, role: lead.role } : {});
    setChatHistory([]);
    if (m === 'simulated') setPersona(Object.keys(PERSONAS)[Math.floor(Math.random() * 3)]);
    else setPersona(null);

    if (lead) {
      setStepIndex(1);
      addToHistory('agent', `Interview with ${lead.name} (${lead.company || '—'}). Let's begin.`);
      addToHistory('agent', INTERVIEW_STEPS[1].agent);
    } else {
      setStepIndex(0);
      addToHistory('agent', INTERVIEW_STEPS[0].agent);
    }
  };

  const getPersonaReply = (field) => {
    if (!persona) return null;
    const p = PERSONAS[persona];
    const map = { se_very_disappointed: 'se', problem_exists: 'problem', problem_severity: 'severity', willing_to_pay: 'wtp', notes: 'notes' };
    return p.agentReplies[map[field]];
  };
  const getPersonaResponse = (field) => {
    if (!persona) return null;
    const p = PERSONAS[persona];
    const map = { se_very_disappointed: 'se', problem_exists: 'problem_exists', problem_severity: 'problem_severity', willing_to_pay: 'willing_to_pay', notes: 'notes' };
    return p.responses[map[field] || field];
  };

  const handleAnswer = (value, field) => {
    const newAnswers = { ...answers, [field]: value };
    setAnswers(newAnswers);

    if (step.type === 'choice') {
      addToHistory('user', step.options.find((o) => o.value === value)?.label || value, false);
    } else if (step.type === 'text' && field === 'lead_info') {
      addToHistory('user', value, false);
    }

    const nextIdx = stepIndex + 1;
    if (nextIdx >= INTERVIEW_STEPS.length) {
      finishInterview(newAnswers);
      return;
    }

    const nextStep = INTERVIEW_STEPS[nextIdx];
    setStepIndex(nextIdx);
    setCurrentInput('');

    if (nextStep.type === 'done') {
      addToHistory('agent', nextStep.agent);
      return;
    }

    if (mode === 'simulated' && persona && nextStep.field && nextStep.type === 'choice') {
      const reply = getPersonaReply(nextStep.field);
      const respVal = getPersonaResponse(nextStep.field);
      if (reply && respVal) {
        setTimeout(() => {
          addToHistory('user', reply, false);
          setAnswers((a) => ({ ...a, [nextStep.field]: respVal }));
          advanceSimulated(nextStep, nextIdx, { ...newAnswers, [nextStep.field]: respVal });
        }, 1000);
        return;
      }
    }

    addToHistory('agent', nextStep.agent);
  };

  const advanceSimulated = (currentStep, idx, ans) => {
    const nextIdx = idx + 1;
    if (nextIdx >= INTERVIEW_STEPS.length) {
      finishInterview(ans);
      return;
    }
    const nextStep = INTERVIEW_STEPS[nextIdx];
    addToHistory('agent', nextStep.agent);
    setStepIndex(nextIdx);

    if (nextStep.type === 'done') {
      finishInterview(ans);
      return;
    }

    if (nextStep.type === 'text' && nextStep.field === 'notes') {
      const reply = PERSONAS[persona]?.agentReplies?.notes || 'No additional comments.';
      setTimeout(() => {
        setChatHistory((h) => [...h, { speaker: 'user', text: reply }]);
        setAnswers((a) => ({ ...a, notes: reply }));
        finishInterview({ ...ans, notes: reply });
      }, 1000);
    }
  };

  const handleTextSubmit = () => {
    if (!currentInput.trim()) return;
    const field = step.field;

    if (field === 'lead_info') {
      const parsed = parseLeadInfo(currentInput);
      setAnswers((a) => ({ ...a, lead_info: currentInput, ...parsed }));
      addToHistory('user', currentInput, false);
    } else if (field === 'notes') {
      setAnswers((a) => ({ ...a, notes: currentInput }));
      addToHistory('user', currentInput, false);
    }

    const nextIdx = stepIndex + 1;
    if (nextIdx >= INTERVIEW_STEPS.length) {
      finishInterview({ ...answers, [field]: currentInput });
      return;
    }

    const nextStep = INTERVIEW_STEPS[nextIdx];
    setStepIndex(nextIdx);
    setCurrentInput('');
    addToHistory('agent', nextStep.agent);
  };

  const finishInterview = (finalAnswers) => {
    let lead = selectedLead;
    const leadInfo = finalAnswers.lead_info ? parseLeadInfo(finalAnswers.lead_info) : (lead ? null : { name: finalAnswers.name, company: finalAnswers.company, role: finalAnswers.role });

    if (!lead && leadInfo) {
      const leadData = addLead({
        name: leadInfo.name,
        company: leadInfo.company,
        role: leadInfo.role,
        country: '',
      });
      if (leadData) {
        lead = leadData.leads[leadData.leads.length - 1];
        updateLead(lead.id, { status: 'interviewed' });
      }
    } else if (lead) {
      updateLead(lead.id, { status: 'interviewed' });
    }

    if (lead) {
      const interviewData = {
        se_very_disappointed: finalAnswers.se_very_disappointed || '',
        problem_exists: finalAnswers.problem_exists || '',
        problem_severity: finalAnswers.problem_severity || '',
        willing_to_pay: finalAnswers.willing_to_pay || '',
        notes: finalAnswers.notes || '',
      };
      saveInterview(lead.id, interviewData);
      onUpdate(loadData());
      addToast('Interview saved. Check Results.');
    }

    setStepIndex(INTERVIEW_STEPS.length - 1);
    addToHistory('agent', "Done! Your responses are saved. Check the Results tab.");
  };

  if (mode === null) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Agent Interview</h2>
        <p className="text-gray-600">
          The agent conducts the interview. You just respond. Results auto-save.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <button
            onClick={() => startInterview('live')}
            className="p-6 border-2 border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 text-left"
          >
            <div className="font-semibold text-gray-900">Live interview</div>
            <div className="text-sm text-gray-600 mt-1">
              You're on a call. Agent asks. You select the customer's answer.
            </div>
          </button>
          <button
            onClick={() => startInterview('simulated')}
            className="p-6 border-2 border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="font-semibold text-gray-900">Simulated (practice)</div>
            <div className="text-sm text-gray-600 mt-1">
              Agent asks. Simulated customer answers. Practice the flow.
            </div>
          </button>
        </div>
        {leads.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Or start with existing lead:</div>
            <div className="flex flex-wrap gap-2">
              {leads.slice(0, 5).map((l) => (
                <button
                  key={l.id}
                  onClick={() => startInterview('live', l.id)}
                  className="px-3 py-1.5 border rounded text-sm hover:bg-gray-100"
                >
                  {l.name} @ {l.company || '?'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {mode === 'simulated' && persona && `Simulated: ${PERSONAS[persona].name}`}
          {mode === 'live' && 'Live interview'}
        </h2>
        <button
          onClick={() => { setMode(null); setStepIndex(0); setChatHistory([]); }}
          className="text-sm text-gray-500 hover:underline"
        >
          Exit
        </button>
      </div>

      <div className="border rounded-lg bg-white p-4 h-80 overflow-y-auto space-y-3">
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.speaker === 'agent' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                msg.speaker === 'agent'
                  ? 'bg-blue-100 text-gray-900'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.speaker === 'agent' && <span className="text-blue-600 font-medium">Agent: </span>}
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {step && step.type !== 'done' && (
        <div className="border rounded-lg p-4 bg-gray-50">
          {step.type === 'choice' && mode !== 'simulated' ? (
            <div className="flex flex-wrap gap-2">
              {step.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value, step.field)}
                  className="px-4 py-2 border rounded-md hover:bg-white hover:border-blue-300"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : step.type === 'text' ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                placeholder="Type your answer..."
                className="flex-1 border rounded-md px-3 py-2"
                disabled={mode === 'simulated'}
              />
              <button
                onClick={handleTextSubmit}
                disabled={mode === 'simulated'}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          ) : mode === 'simulated' ? (
            <div className="text-sm text-gray-500">Customer is typing...</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
