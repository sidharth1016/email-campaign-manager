import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useToast } from '../context/ToastContext';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', subject: '', template: '', status: 'draft' });
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const fetchAll = async () => {
    const [c, t, l] = await Promise.all([
      api.get('/campaigns'),
      api.get('/templates'),
      api.get('/leads'),
    ]);
    setCampaigns(c.data);
    setTemplates(t.data);
    setLeads(l.data);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/campaigns', { ...form, leads: leads.map(l => l._id) });
      showToast('Campaign created!');
      setShowModal(false);
      setForm({ name: '', subject: '', template: '', status: 'draft' });
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error creating campaign', 'error');
    }
  };

  const handleLaunch = async (id) => {
    try {
      await api.post(`/campaigns/${id}/launch`);
      showToast('Campaign launched successfully! 🚀');
      fetchAll();
    } catch (err) {
      showToast('Error launching campaign', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this campaign?')) return;
    try {
      await api.delete(`/campaigns/${id}`);
      showToast('Campaign deleted');
      fetchAll();
    } catch {
      showToast('Error deleting campaign', 'error');
    }
  };

  const filtered = campaigns.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading"><div className="spinner" />Loading campaigns...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Campaigns</h1>
          <p>{campaigns.length} total campaigns</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="search-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input placeholder="Search campaigns..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Campaign</button>
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Status</th>
              <th>Sent</th>
              <th>Opened</th>
              <th>Clicked</th>
              <th>Open Rate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="7">
                <div className="empty-state">
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📧</div>
                  <h3>No campaigns yet</h3>
                  <p>Create your first email campaign to get started</p>
                  <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create Campaign</button>
                </div>
              </td></tr>
            ) : filtered.map(c => (
              <tr key={c._id}>
                <td>
                  <strong>{c.name}</strong>
                  <br />
                  <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{c.subject}</span>
                </td>
                <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                <td>{c.analytics.sent}</td>
                <td>{c.analytics.opened}</td>
                <td>{c.analytics.clicked}</td>
                <td>
                  {c.analytics.sent > 0
                    ? `${((c.analytics.opened / c.analytics.sent) * 100).toFixed(1)}%`
                    : '—'}
                </td>
                <td>
                  <div className="action-buttons">
                    {c.status === 'draft' && (
                      <button className="btn btn-success" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => handleLaunch(c._id)}>
                        Launch
                      </button>
                    )}
                    <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => handleDelete(c._id)}>
                      Delete
                    </button>
                  </div>
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
              <h2>Create Campaign</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Campaign Name</label>
                <input required placeholder="e.g. Summer Promo 2025" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email Subject</label>
                <input required placeholder="e.g. Don't miss our biggest sale" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Template (optional)</label>
                <select value={form.template} onChange={e => setForm({ ...form, template: e.target.value })}>
                  <option value="">Select a template</option>
                  {templates.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                </select>
              </div>
              <div style={{ background: 'var(--bg)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
                📋 This campaign will target <strong>{leads.length} leads</strong> in your list.
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Campaign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}