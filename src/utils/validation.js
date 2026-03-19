const MAX_STRING = 500;
const MAX_NOTES = 2000;

function sanitize(str, maxLen = MAX_STRING) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen);
}

export function validateLead({ name, company, role, country }) {
  const errors = [];
  const nameClean = sanitize(name);
  if (!nameClean) errors.push('Name is required');
  if (nameClean.length > 100) errors.push('Name is too long');
  if (sanitize(company).length > 150) errors.push('Company name is too long');
  if (sanitize(role).length > 100) errors.push('Role is too long');
  if (sanitize(country).length > 80) errors.push('Country is too long');
  return { valid: errors.length === 0, errors, data: { name: nameClean, company: sanitize(company), role: sanitize(role), country: sanitize(country) } };
}

export function validateICP(icp) {
  return {
    industry: sanitize(icp.industry),
    companySize: sanitize(icp.companySize),
    role: sanitize(icp.role),
    description: sanitize(icp.description, MAX_NOTES),
  };
}

const SE_VALID = ['very_disappointed', 'somewhat_disappointed', 'not_disappointed', ''];

export function validateInterview(interview) {
  const valid = ['yes', 'no', ''];
  const severityValid = ['high', 'medium', 'low', ''];
  return {
    problem_exists: valid.includes(interview.problem_exists) ? interview.problem_exists : '',
    problem_severity: severityValid.includes(interview.problem_severity) ? interview.problem_severity : '',
    willing_to_pay: valid.includes(interview.willing_to_pay) ? interview.willing_to_pay : '',
    se_very_disappointed: SE_VALID.includes(interview.se_very_disappointed) ? interview.se_very_disappointed : '',
    notes: sanitize(interview.notes || '', MAX_NOTES),
  };
}
