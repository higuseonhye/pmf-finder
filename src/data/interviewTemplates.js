// PMF Interview Question Templates - Based on Sean Ellis, JTBD, Mom Test

export const FRAMEWORKS = {
  seanEllis: {
    id: 'seanEllis',
    name: 'Sean Ellis PMF Survey',
    description: 'The "40% rule" - if 40%+ would be "very disappointed" without your product, you have PMF.',
    questions: [
      {
        id: 'se_very_disappointed',
        question: 'How would you feel if you could no longer use this product?',
        options: ['Very disappointed', 'Somewhat disappointed', 'Not disappointed'],
        tip: '40%+ "Very disappointed" = strong PMF signal',
      },
    ],
  },
  momTest: {
    id: 'momTest',
    name: "The Mom Test",
    description: "Don't pitch—ask about their life. Talk about their past instead of your future.",
    questions: [
      { id: 'mt_problem', question: "What's the biggest challenge you face with [problem area]?", tip: 'Listen for specific stories, not vague answers' },
      { id: 'mt_current', question: 'How are you solving this today?', tip: 'Understand existing alternatives and workarounds' },
      { id: 'mt_effort', question: 'How much time/money does that cost you?', tip: 'Quantify the pain' },
      { id: 'mt_attempt', question: 'Have you tried to fix this before?', tip: 'If yes, what happened?' },
    ],
  },
  jtbd: {
    id: 'jtbd',
    name: 'Jobs-to-be-Done',
    description: "People 'hire' products to make progress in their lives.",
    questions: [
      { id: 'jtbd_job', question: 'When you [situation], what are you trying to accomplish?', tip: 'Replace [situation] with your use case' },
      { id: 'jtbd_struggle', question: 'What makes that difficult right now?', tip: 'Identify the struggle' },
      { id: 'jtbd_alternatives', question: 'What have you used or tried before?', tip: 'Understand the competition' },
      { id: 'jtbd_switch', question: 'What would make you switch from your current solution?', tip: 'Find the switching trigger' },
    ],
  },
  problemValidation: {
    id: 'problemValidation',
    name: 'Problem Validation',
    description: 'Confirm the problem exists and is worth solving.',
    questions: [
      { id: 'pv_exists', question: 'Do you experience this problem? How often?', tip: 'Frequency matters' },
      { id: 'pv_severity', question: 'On a scale of 1-10, how painful is this?', tip: '7+ = worth solving' },
      { id: 'pv_budget', question: 'Have you spent money on this before?', tip: 'Proves willingness to pay' },
      { id: 'pv_priority', question: "Is this a top-3 priority for you right now?", tip: "If not, they won't buy soon" },
    ],
  },
};

export const QUICK_QUESTIONS = [
  'What problem are you trying to solve?',
  'How are you solving it today?',
  'What would an ideal solution look like?',
  'How much would you pay for that?',
  'Who else is involved in this decision?',
];
