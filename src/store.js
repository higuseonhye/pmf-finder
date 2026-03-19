const STORAGE_KEY = 'pmf-finder-data';
const STORAGE_VERSION = 1;

const defaultData = () => ({
  version: STORAGE_VERSION,
  icp: { industry: '', companySize: '', role: '', description: '' },
  leads: [],
  interviews: {},
});

function isLocalStorageAvailable() {
  try {
    const test = '__pmf_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

const memoryFallback = { data: null };

export function loadData() {
  if (!isLocalStorageAvailable()) {
    if (!memoryFallback.data) memoryFallback.data = defaultData();
    return memoryFallback.data;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw);
    const data = {
      version: parsed.version || 1,
      icp: { ...defaultData().icp, ...(parsed.icp || {}) },
      leads: Array.isArray(parsed.leads) ? parsed.leads : [],
      interviews: typeof parsed.interviews === 'object' && parsed.interviews ? parsed.interviews : {},
    };
    data.leads = data.leads.filter((l) => l && l.id && l.name);
    return data;
  } catch (e) {
    return defaultData();
  }
}

export function saveData(data) {
  if (!isLocalStorageAvailable()) {
    memoryFallback.data = data;
    return { success: true };
  }
  try {
    const toSave = {
      version: data.version || STORAGE_VERSION,
      icp: data.icp || {},
      leads: data.leads || [],
      interviews: data.interviews || {},
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    return { success: true };
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      return { success: false, error: 'Storage quota exceeded' };
    }
    return { success: false, error: e.message };
  }
}

export function updateICP(icp) {
  const data = loadData();
  data.icp = { ...data.icp, ...icp };
  const result = saveData(data);
  return result.success ? data : null;
}

export function addLead(lead) {
  const data = loadData();
  const id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  data.leads.push({ id, ...lead, status: lead.status || 'contacted' });
  const result = saveData(data);
  return result.success ? data : null;
}

export function updateLead(id, updates) {
  const data = loadData();
  const idx = data.leads.findIndex((l) => l.id === id);
  if (idx < 0) return null;
  data.leads[idx] = { ...data.leads[idx], ...updates };
  const result = saveData(data);
  return result.success ? data : null;
}

export function deleteLead(id) {
  const data = loadData();
  data.leads = data.leads.filter((l) => l.id !== id);
  if (data.interviews[id]) delete data.interviews[id];
  const result = saveData(data);
  return result.success ? data : null;
}

export function saveInterview(leadId, interview) {
  const data = loadData();
  data.interviews[leadId] = { ...interview };
  const result = saveData(data);
  return result.success ? data : null;
}

export function getInterview(leadId) {
  const data = loadData();
  return data.interviews[leadId] || null;
}

export function exportData() {
  const data = loadData();
  return JSON.stringify({ exportedAt: new Date().toISOString(), ...data }, null, 2);
}

export function importFromCustomerResult(result) {
  const data = loadData();
  const id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  data.leads.push({
    id,
    name: result.name || 'Unknown',
    company: result.company || '',
    role: result.role || '',
    country: '',
    status: 'interviewed',
  });
  data.interviews[id] = {
    se_very_disappointed: result.se_very_disappointed || '',
    problem_exists: result.problem_exists || '',
    problem_severity: result.problem_severity || '',
    willing_to_pay: result.willing_to_pay || '',
    notes: result.notes || '',
  };
  const res = saveData(data);
  return res.success ? data : null;
}

export function loadDemoData() {
  return {
    version: 1,
    icp: { industry: 'SaaS', companySize: '10-50', role: 'Product Manager', description: 'B2B SaaS PMs' },
    leads: [
      { id: 'd1', name: 'Sarah Chen', company: 'TechCorp', role: 'PM', country: 'US', status: 'interviewed' },
      { id: 'd2', name: 'Mike Park', company: 'StartupX', role: 'CTO', country: 'KR', status: 'interviewed' },
      { id: 'd3', name: 'Emma Wilson', company: 'ScaleUp', role: 'Head of Product', country: 'UK', status: 'replied' },
      { id: 'd4', name: 'James Lee', company: 'DataCo', role: 'PM', country: 'US', status: 'contacted' },
    ],
    interviews: {
      d1: { se_very_disappointed: 'very_disappointed', problem_exists: 'yes', problem_severity: 'high', willing_to_pay: 'yes', notes: 'We struggle with this daily. Would pay $500/mo.' },
      d2: { se_very_disappointed: 'somewhat_disappointed', problem_exists: 'yes', problem_severity: 'medium', willing_to_pay: 'yes', notes: 'Useful but we have workarounds.' },
    },
  };
}

export function setDemoData() {
  const data = loadDemoData();
  return saveData(data).success ? data : null;
}

export function calcMetrics(data) {
  const leads = data?.leads || [];
  const interviews = data?.interviews || {};
  const totalLeads = leads.length;
  const contacted = leads.filter((l) => l.status !== 'new').length;
  const replied = leads.filter((l) => l.status === 'replied' || l.status === 'interviewed').length;
  const interviewResults = leads
    .filter((l) => l.status === 'interviewed' && interviews[l.id])
    .map((l) => interviews[l.id]);
  const responseRate = contacted > 0 ? Math.round((replied / contacted) * 100) : 0;
  const withProblem = interviewResults.filter((r) => r.problem_exists === 'yes').length;
  const willingToPay = interviewResults.filter((r) => r.willing_to_pay === 'yes').length;
  const seVeryDisappointed = interviewResults.filter((r) => r.se_very_disappointed === 'very_disappointed').length;
  const interviewCount = interviewResults.length;
  const problemRate = interviewCount > 0 ? Math.round((withProblem / interviewCount) * 100) : 0;
  const willingnessRate = interviewCount > 0 ? Math.round((willingToPay / interviewCount) * 100) : 0;
  const seRate = interviewCount > 0 ? Math.round((seVeryDisappointed / interviewCount) * 100) : 0;

  let pmfScore = 'weak';
  if (interviewCount >= 5 && (problemRate >= 60 || seRate >= 40) && willingnessRate >= 40) pmfScore = 'strong';
  else if (interviewCount >= 3 && (problemRate >= 40 || seRate >= 30 || willingnessRate >= 30)) pmfScore = 'medium';

  return { totalLeads, responseRate, interviewCount, problemRate, willingnessRate, seRate, pmfScore };
}
