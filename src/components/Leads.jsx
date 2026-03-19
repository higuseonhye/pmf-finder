import { useState } from 'react';
import { addLead, updateLead, deleteLead, loadData, getInterview } from '../store';
import { validateLead } from '../utils/validation';
import { useToast } from '../context/ToastContext';
import InterviewForm from './InterviewForm';

export default function Leads({ data, onUpdate }) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [country, setCountry] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [errors, setErrors] = useState([]);
  const { addToast } = useToast();

  const handleAdd = (e) => {
    e.preventDefault();
    setErrors([]);
    const validation = validateLead({ name, company, role, country });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    const result = addLead(validation.data);
    if (result) {
      onUpdate(loadData());
      addToast('Lead added');
      setName('');
      setCompany('');
      setRole('');
      setCountry('');
    } else {
      addToast('Failed to add lead', 'error');
    }
  };

  const handleStatusChange = (id, status) => {
    const result = updateLead(id, { status });
    if (result) {
      onUpdate(loadData());
    } else {
      addToast('Failed to update status', 'error');
    }
  };

  const handleDelete = (id) => {
    const result = deleteLead(id);
    if (result) {
      onUpdate(loadData());
      setDeleteConfirmId(null);
      setEditingId((prev) => (prev === id ? null : prev));
      addToast('Lead deleted');
    } else {
      addToast('Failed to delete lead', 'error');
    }
  };

  const leads = data?.leads || [];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Leads</h2>

      <form onSubmit={handleAdd} className="flex flex-wrap gap-2 items-end" noValidate>
        <div>
          <label htmlFor="lead-name" className="sr-only">Name</label>
          <input
            id="lead-name"
            type="text"
            placeholder="Name *"
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors([]); }}
            className="border border-gray-300 rounded-md px-3 py-2 w-32 focus:ring-2 focus:ring-blue-500"
            aria-invalid={errors.length > 0}
            aria-describedby={errors.length ? 'lead-errors' : undefined}
          />
        </div>
        <div>
          <label htmlFor="lead-company" className="sr-only">Company</label>
          <input
            id="lead-company"
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-36 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="lead-role" className="sr-only">Role</label>
          <input
            id="lead-role"
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-32 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="lead-country" className="sr-only">Country</label>
          <input
            id="lead-country"
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-24 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Lead
        </button>
        {errors.length > 0 && (
          <div id="lead-errors" className="w-full text-sm text-red-600" role="alert">
            {errors.join('. ')}
          </div>
        )}
      </form>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {leads.length === 0 ? (
          <div className="p-8 text-center text-gray-500" role="status">
            No leads yet. Add your first lead above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-700">Name</th>
                  <th className="text-left p-3 font-medium text-gray-700">Company</th>
                  <th className="text-left p-3 font-medium text-gray-700">Role</th>
                  <th className="text-left p-3 font-medium text-gray-700">Country</th>
                  <th className="text-left p-3 font-medium text-gray-700">Status</th>
                  <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-3">{lead.name}</td>
                    <td className="p-3">{lead.company || '—'}</td>
                    <td className="p-3">{lead.role || '—'}</td>
                    <td className="p-3">{lead.country || '—'}</td>
                    <td className="p-3">
                      <select
                        value={lead.status || 'contacted'}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500"
                        aria-label={`Status for ${lead.name}`}
                      >
                        <option value="contacted">Contacted</option>
                        <option value="replied">Replied</option>
                        <option value="interviewed">Interviewed</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {lead.status === 'interviewed' && (
                          <button
                            onClick={() => setEditingId(editingId === lead.id ? null : lead.id)}
                            className="text-blue-600 hover:underline text-xs font-medium"
                          >
                            {editingId === lead.id ? 'Hide' : 'Log Interview'}
                          </button>
                        )}
                        {deleteConfirmId === lead.id ? (
                          <>
                            <button
                              onClick={() => handleDelete(lead.id)}
                              className="text-red-600 hover:underline text-xs font-medium"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-gray-600 hover:underline text-xs"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(lead.id)}
                            className="text-red-600 hover:underline text-xs"
                            aria-label={`Delete ${lead.name}`}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingId && (
        <InterviewForm
          leadId={editingId}
          lead={leads.find((l) => l.id === editingId)}
          interview={getInterview(editingId)}
          onSave={() => {
            onUpdate(loadData());
            setEditingId(null);
            addToast('Interview saved');
          }}
        />
      )}
    </div>
  );
}
