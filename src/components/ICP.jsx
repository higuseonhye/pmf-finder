import { useState, useEffect } from 'react';
import { loadData, updateICP } from '../store';
import { validateICP } from '../utils/validation';
import { useToast } from '../context/ToastContext';

export default function ICP({ data, onUpdate }) {
  const [form, setForm] = useState(data?.icp || {});
  const { addToast } = useToast();

  useEffect(() => {
    setForm(data?.icp || {});
  }, [data?.icp]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validated = validateICP(form);
    const result = updateICP(validated);
    if (result) {
      onUpdate(loadData());
      addToast('ICP saved');
    } else {
      addToast('Failed to save ICP', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Target Customer Profile (ICP)</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md" noValidate>
        <div>
          <label htmlFor="icp-industry" className="block text-sm font-medium text-gray-700 mb-1">
            Industry
          </label>
          <input
            id="icp-industry"
            type="text"
            value={form.industry || ''}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. SaaS, Healthcare"
            maxLength={500}
          />
        </div>
        <div>
          <label htmlFor="icp-companySize" className="block text-sm font-medium text-gray-700 mb-1">
            Company Size
          </label>
          <input
            id="icp-companySize"
            type="text"
            value={form.companySize || ''}
            onChange={(e) => setForm({ ...form, companySize: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. 10-50, Enterprise"
            maxLength={500}
          />
        </div>
        <div>
          <label htmlFor="icp-role" className="block text-sm font-medium text-gray-700 mb-1">
            Target Role
          </label>
          <input
            id="icp-role"
            type="text"
            value={form.role || ''}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Product Manager, CTO"
            maxLength={500}
          />
        </div>
        <div>
          <label htmlFor="icp-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="icp-description"
            value={form.description || ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Additional ICP details..."
            maxLength={2000}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save ICP
        </button>
      </form>
    </div>
  );
}
