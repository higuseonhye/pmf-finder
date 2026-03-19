// Agent-led interview flow - questions the agent asks

export const INTERVIEW_STEPS = [
  {
    id: 'intro',
    agent: "Hi! I'm your PMF interview agent. I'll ask a few questions. You can answer by selecting or typing. Let's start—who are we talking to? (Name, company, role)",
    type: 'text',
    field: 'lead_info',
    next: 'se',
  },
  {
    id: 'se',
    agent: "How would you feel if you could no longer use this product?",
    type: 'choice',
    options: [
      { value: 'very_disappointed', label: 'Very disappointed' },
      { value: 'somewhat_disappointed', label: 'Somewhat disappointed' },
      { value: 'not_disappointed', label: 'Not disappointed' },
    ],
    field: 'se_very_disappointed',
    next: 'problem',
  },
  {
    id: 'problem',
    agent: "Do you experience the problem we're solving?",
    type: 'choice',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
    field: 'problem_exists',
    next: 'severity',
  },
  {
    id: 'severity',
    agent: "How painful is this problem for you? (1-10 or high/medium/low)",
    type: 'choice',
    options: [
      { value: 'high', label: 'High (7-10)' },
      { value: 'medium', label: 'Medium (4-6)' },
      { value: 'low', label: 'Low (1-3)' },
    ],
    field: 'problem_severity',
    next: 'wtp',
  },
  {
    id: 'wtp',
    agent: "Would you be willing to pay for a solution?",
    type: 'choice',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
    field: 'willing_to_pay',
    next: 'notes',
  },
  {
    id: 'notes',
    agent: "Anything else we should know? (Key quotes, pain points, feedback)",
    type: 'text',
    field: 'notes',
    next: 'done',
  },
  { id: 'done', agent: "Thanks! That's all. Your answers are saved.", type: 'done', next: null },
];

// Simulated customer personas (for practice mode)
export const PERSONAS = {
  enthusiastic: {
    name: 'Enthusiastic early adopter',
    responses: {
      se: 'very_disappointed',
      problem_exists: 'yes',
      problem_severity: 'high',
      willing_to_pay: 'yes',
      notes: 'We\'ve been looking for this for months. Would pay tomorrow.',
    },
    agentReplies: {
      se: "I'd be very disappointed. We use this every day.",
      problem: "Yes, it's a big pain point for us.",
      severity: "High—probably 8 or 9 out of 10.",
      wtp: "Absolutely. We already have budget for this.",
      notes: "We've been looking for something like this. Would sign up today.",
    },
  },
  neutral: {
    name: 'Neutral evaluator',
    responses: {
      se: 'somewhat_disappointed',
      problem_exists: 'yes',
      problem_severity: 'medium',
      willing_to_pay: 'yes',
      notes: 'Interesting. Need to think about it.',
    },
    agentReplies: {
      se: "Somewhat disappointed. It's useful but we have workarounds.",
      problem: "Yes, we do experience it sometimes.",
      severity: "Medium—maybe 5 or 6.",
      wtp: "Possibly. Would need to see the full product first.",
      notes: "Interesting. I'd need to discuss with my team.",
    },
  },
  skeptical: {
    name: 'Skeptical / not a fit',
    responses: {
      se: 'not_disappointed',
      problem_exists: 'no',
      problem_severity: 'low',
      willing_to_pay: 'no',
      notes: "Not really our priority right now.",
    },
    agentReplies: {
      se: "Not really. We don't use it much.",
      problem: "No, we don't really have that problem.",
      severity: "Low—not a big deal for us.",
      wtp: "No, we're not looking to spend on this.",
      notes: "Not a priority for us right now. Maybe later.",
    },
  },
};
