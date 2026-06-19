import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useToast } from '../context/ToastContext';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', tags: '' });
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const fetchLeads = () => {
    api.get('/leads').then(res => { setLeads(res.data); setLoading(false); });
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const tags = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      await api.post('/leads', { ...form, tags });
      showToast('Lead added!');
      setShowModal(false);
      setForm({ name: '', email: '', company: '', phone: '', tags: '' });
      fetchLeads();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error adding lead', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      showToast('Lead removed');
      fetchLeads();
    } catch {
      showToast('Error removing lead', 'error');
    }
  };

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    (l.company || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading"><div className="spinner" />Loading leads...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Leads</h1>
          <p>{leads.length} contacts in your list</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="search-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Lead</button>
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Status</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="6">
                <div className="empty-state">
                  <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
                  <h3>No leads yet</h3>
                  <p>Add your first contact to start building your list</p>
                  <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Lead</button>
                </div>
              </td></tr>
            ) : filtered.map(l => (
              <tr key={l._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: 12, flexShrink: 0
                    }}>
                      {l.name[0].toUpperCase()}
                    </div>
                    <strong>{l.name}</strong>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{l.email}</td>
                <td>{l.company || '—'}</td>
                <td><span className={`badge badge-${l.status}`}>{l.status}</span></td>
                <td>
                  {l.tags?.length > 0
                    ? l.tags.map((t, i) => <span key={i} className="badge badge-draft" style={{ marginRight: 4 }}>{t}</span>)
                    : '—'}
                </td>
                <td>
                  <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => handleDelete(l._id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Lead</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Full Name</label>
                <input required placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input required type="email" placeholder="john@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input placeholder="Acme Corp" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input placeholder="enterprise, india, saas" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}