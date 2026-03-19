import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are conducting a PMF (product-market fit) customer interview. Ask these questions ONE AT A TIME, in order. Wait for the user's answer before asking the next.

1. "What's your name, company, and role?"
2. "How would you feel if you could no longer use this product?" (Very disappointed / Somewhat disappointed / Not disappointed)
3. "Do you experience the problem we're solving?" (Yes / No)
4. "How painful is this for you?" (High 7-10 / Medium 4-6 / Low 1-3)
5. "Would you pay for a solution?" (Yes / No)
6. "Anything else we should know?"

Keep responses brief. After question 6, say "Thanks! That's all." and nothing else.`;

const EXTRACT_PROMPT = `Extract from this PMF interview conversation. Return ONLY valid JSON, no other text:
{
  "name": "string",
  "company": "string",
  "role": "string",
  "se_very_disappointed": "very_disappointed" | "somewhat_disappointed" | "not_disappointed",
  "problem_exists": "yes" | "no",
  "problem_severity": "high" | "medium" | "low",
  "willing_to_pay": "yes" | "no",
  "notes": "string"
}
Use empty string "" for missing values.`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: 'OPENAI_API_KEY not set' });

  try {
    const { messages, extract } = req.body || {};
    const openai = new OpenAI({ apiKey: key });

    if (extract && Array.isArray(messages) && messages.length > 0) {
      const text = messages.map((m) => `${m.role}: ${m.content}`).join('\n');
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: EXTRACT_PROMPT },
          { role: 'user', content: text },
        ],
        temperature: 0,
      });
      const raw = completion.choices[0]?.message?.content || '{}';
      const json = JSON.parse(raw.replace(/```json?\s*|\s*```/g, '').trim());
      return res.json({ extracted: json });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...(messages || []),
      ],
      temperature: 0.7,
    });
    const reply = completion.choices[0]?.message?.content || '';

    return res.json({ reply });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'API error' });
  }
}
