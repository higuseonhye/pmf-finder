// Extract structured interview data from transcript text (no AI required)
// Pattern-based extraction for common phrases

function extractField(text, patterns, defaultValue = '') {
  if (!text || typeof text !== 'string') return defaultValue;
  const lower = text.toLowerCase();
  for (const { match, value } of patterns) {
    if (typeof match === 'string' && lower.includes(match)) return value;
    if (match instanceof RegExp && match.test(lower)) return value;
  }
  return defaultValue;
}

export function extractFromTranscript(text) {
  if (!text || typeof text !== 'string') return null;

  const lower = text.toLowerCase();

  const se_very_disappointed = extractField(text, [
    { match: /very\s+disappointed|extremely\s+disappointed|would\s+be\s+devastated/i, value: 'very_disappointed' },
    { match: /somewhat\s+disappointed|kind\s+of\s+disappointed|a\s+bit\s+disappointed/i, value: 'somewhat_disappointed' },
    { match: /not\s+disappointed|wouldn't\s+care|don't\s+really\s+use/i, value: 'not_disappointed' },
  ]);

  const problem_exists = extractField(text, [
    { match: /yes[,.]?\s+(we|i)\s+(have|do|experience)|definitely\s+(have|do)|we\s+struggle|we\s+have\s+this\s+problem|big\s+pain\s+point|real\s+problem|major\s+issue/i, value: 'yes' },
    { match: /no[,.]?\s+(we|i)\s+don't|not\s+really|we\s+don't\s+have|doesn't\s+affect|not\s+a\s+problem/i, value: 'no' },
    { match: /\b(struggle|pain|frustrat|difficult|problem|issue|challenge)\b.*\b(always|often|every\s+day)\b/i, value: 'yes' },
    { match: /\b(critical|severe|major|huge)\b.*\b(problem|issue|pain)\b/i, value: 'yes' },
  ]);

  const problem_severity = extractField(text, [
    { match: /\b(high|critical|severe|extreme|10\/10|very\s+painful)\b/i, value: 'high' },
    { match: /\b(medium|moderate|7\/10|8\/10|somewhat\s+painful)\b/i, value: 'medium' },
    { match: /\b(low|minor|3\/10|4\/10|5\/10|slight)\b/i, value: 'low' },
  ]);

  const willing_to_pay = extractField(text, [
    { match: /yes[,.]?\s+(we|i)\s+(would|will)|definitely\s+pay|willing\s+to\s+pay|we\s+have\s+budget|already\s+paying|pay\s+for\s+that|worth\s+paying/i, value: 'yes' },
    { match: /no[,.]?\s+(we|i)\s+wouldn't|not\s+willing|no\s+budget|can't\s+pay|free\s+only|wouldn't\s+pay/i, value: 'no' },
    { match: /\b(budget|paying|spend)\b.*\b(\d+|\$|usd)\b/i, value: 'yes' },
  ]);

  // Extract key quotes (sentences with problem/pain/want/need)
  const quotePatterns = [
    /[^.!?]*(?:problem|pain|struggle|frustrat|difficult|need|want|wish|would\s+pay)[^.!?]*[.!?]/gi,
    /[^.!?]*(?:very|somewhat|not)\s+disappointed[^.!?]*[.!?]/gi,
  ];
  const quotes = [];
  quotePatterns.forEach((re) => {
    const matches = text.match(re);
    if (matches) quotes.push(...matches.map((m) => m.trim()).slice(0, 3));
  });
  const notes = [...new Set(quotes)].slice(0, 5).join('\n\n') || text.slice(0, 500);

  return {
    se_very_disappointed: se_very_disappointed || '',
    problem_exists: problem_exists || '',
    problem_severity: problem_severity || '',
    willing_to_pay: willing_to_pay || '',
    notes: notes.trim(),
    _confidence: [se_very_disappointed, problem_exists, willing_to_pay].filter(Boolean).length,
  };
}

// Extract lead info from transcript (name, company from common patterns)
export function extractLeadFromTranscript(text) {
  if (!text || typeof text !== 'string') return null;
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
  let name = '';
  let company = '';
  let role = '';

  for (const line of lines.slice(0, 10)) {
    const m = line.match(/(?:i'm|i am|name is|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (m) name = m[1].trim();
    const cm = line.match(/(?:at|from|works? at)\s+([A-Za-z0-9\s&.-]+?)(?:\s*[,.]|$)/i);
    if (cm) company = cm[1].trim();
    const rm = line.match(/(?:role|title|position|i'm a|i am a)\s*[:=]?\s*([A-Za-z\s]+?)(?:\s*[,.]|$)/i);
    if (rm) role = rm[1].trim();
    if (name && company) break;
  }
  if (!name && lines[0]) name = lines[0].replace(/^[-–—:\s]+/, '').split(/\s+/).slice(0, 2).join(' ');

  return { name: name || 'Unknown', company: company || '', role: role || '' };
}
