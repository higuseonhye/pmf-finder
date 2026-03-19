// Extract insights from interview notes - keyword frequency, common themes

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
  'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'our', 'their',
  'so', 'just', 'very', 'really', 'also', 'only', 'even', 'if', 'as', 'when', 'than',
]);

function tokenize(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));
}

export function extractKeywordFreq(notesArray) {
  const freq = {};
  notesArray.forEach((notes) => {
    if (!notes) return;
    tokenize(notes).forEach((word) => {
      freq[word] = (freq[word] || 0) + 1;
    });
  });
  return Object.entries(freq)
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word, count]) => ({ word, count }));
}

export function extractProblemPhrases(notesArray) {
  const problemIndicators = ['problem', 'issue', 'pain', 'struggle', 'difficult', 'frustrat', 'waste', 'slow', 'expensive', 'manual', 'broken', 'need', 'want', 'wish'];
  const phrases = [];
  notesArray.forEach((notes) => {
    if (!notes) return;
    const lower = notes.toLowerCase();
    problemIndicators.forEach((ind) => {
      if (lower.includes(ind)) {
        const idx = lower.indexOf(ind);
        const start = Math.max(0, idx - 20);
        const end = Math.min(notes.length, idx + 60);
        let snippet = notes.slice(start, end);
        if (start > 0) snippet = '...' + snippet;
        if (end < notes.length) snippet = snippet + '...';
        phrases.push(snippet.trim());
      }
    });
  });
  return [...new Set(phrases)].slice(0, 5);
}
