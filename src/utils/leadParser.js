// Parse "Name, company, role" from free text
export function parseLeadInfo(text) {
  if (!text || typeof text !== 'string') return { name: 'Unknown', company: '', role: '' };
  const parts = text.split(/[,@\n]/).map((p) => p.trim()).filter(Boolean);
  let name = 'Unknown';
  let company = '';
  let role = '';

  if (parts.length >= 1) name = parts[0];
  if (parts.length >= 2) company = parts[1];
  if (parts.length >= 3) role = parts[2];

  // Try common patterns
  const atMatch = text.match(/(?:at|@)\s*([A-Za-z0-9\s&.-]+)/i);
  if (atMatch) company = atMatch[1].trim();

  const roleMatch = text.match(/(?:role|title|position)[:\s]+([A-Za-z\s]+)/i);
  if (roleMatch) role = roleMatch[1].trim();

  return { name: name || 'Unknown', company, role };
}
