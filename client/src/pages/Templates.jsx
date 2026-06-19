import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useToast } from '../context/ToastContext';

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [form, setForm] = useState({ name: '', subject: '', body: '', category: 'promotional' });
  const { showToast } = useToast();

  const fetchTemplates = () => {
    api.get('/templates').then(res => { setTemplates(res.data); setLoading(false); });
  };

  useEffect(() => { fetchTemplates(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/templates', form);
      showToast('Template created!');
      setShowModal(false);
      setForm({ name: '', subject: '', body: '', category: 'promotional' });
      fetchTemplates();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error creating template', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this template?')) return;
    try {
      await api.delete(`/templates/${id}`);
      showToast('Template deleted');
      fetchTemplates();
    } catch {
      showToast('Error deleting template', 'error');
    }
  };

  const starterTemplates = [
    { name: 'Welcome Email', subject: 'Welcome to {Company} — Let\'s get started!', category: 'welcome', body: 'Hi {First Name},\n\nWelcome aboard! We\'re so excited to have you.\n\nHere\'s what you can do next:\n- Complete your profile\n- Explore our features\n- Connect with our team\n\nBest,\nThe Team' },
    { name: 'Monthly Newsletter', subject: 'This month at {Company} — Updates & Highlights', category: 'newsletter', body: 'Hi {First Name},\n\nHere\'s what happened this month:\n\n📦 New Features\n- Feature 1 launched\n- Bug fixes and performance improvements\n\n📰 Industry News\n- Trend 1\n- Trend 2\n\nThanks for being part of our community!\n\nBest,\nThe Team' },
    { name: 'Promotional Offer', subject: '🎉 Exclusive offer just for you — 30% off!', category: 'promotional', body: 'Hi {First Name},\n\nWe have an exclusive offer just for you!\n\n🎁 Get 30% off on all plans this week.\n\nUse code: SAVE30\n\nOffer expires in 48 hours. Don\'t miss out!\n\nCheers,\nThe Team' },
  ];

  const loadStarter = (t) => {
    setForm({ name: t.name, subject: t.subject, body: t.body, category: t.category });
    setShowModal(true);
  };

  if (loading) return <div className="loading"><div className="spinner" />Loading templates...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Email Templates</h1>
          <p>{templates.length} templates saved</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm({ name: '', subject: '', body: '', category: 'promotional' }); setShowModal(true); }}>
          + New Template
        </button>
      </div>

      {templates.length === 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600 }}>⚡ Quick Start — Pick a starter template</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {starterTemplates.map((t, i) => (
              <div key={i} className="stat-card" style={{ cursor: 'pointer' }} onClick={() => loadStarter(t)}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{t.category === 'welcome' ? '👋' : t.category === 'newsletter' ? '📰' : '🎉'}</div>
                <h3 style={{ fontSize: 15, marginBottom: 4 }}>{t.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>{t.subject}</p>
                <span className={`badge badge-${t.category}`}>{t.category}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {templates.map(t => (
          <div key={t._id} className="stat-card" style={{ cursor: 'default' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <h3 style={{ fontSize: 16 }}>{t.name}</h3>
              <span className={`badge badge-${t.category}`}>{t.category}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}><strong>Subject:</strong> {t.subject}</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6, whiteSpace: 'pre-wrap', maxHeight: 80, overflow: 'hidden' }}>
              {t.body.substring(0, 120)}...
            </p>
            <div className="action-buttons">
              <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => setPreviewTemplate(t)}>Preview</button>
              <button className="btn btn-danger" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => handleDelete(t._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="table-card" style={{ marginTop: 24 }}>
          <div className="empty-state">
            <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
            <h3>No templates yet</h3>
            <p>Create reusable email templates to speed up your campaigns</p>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Template</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Template Name</label>
                <input required placeholder="e.g. Monthly Newsletter" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email Subject</label>
                <input required placeholder="e.g. Big news from our team!" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="promotional">Promotional</option>
                  <option value="newsletter">Newsletter</option>
                  <option value="transactional">Transactional</option>
                  <option value="welcome">Welcome</option>
                </select>
              </div>
              <div className="form-group">
                <label>Email Body</label>
                <textarea required placeholder="Write your email content here. Use {First Name}, {Company} as placeholders." value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} style={{ minHeight: 160 }} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Template</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewTemplate && (
        <div className="modal-overlay" onClick={() => setPreviewTemplate(null)}>
          <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📧 {previewTemplate.name}</h2>
              <button className="modal-close" onClick={() => setPreviewTemplate(null)}>✕</button>
            </div>
            <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 20 }}>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Subject</span>
                <p style={{ fontWeight: 600, marginTop: 4 }}>{previewTemplate.subject}</p>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Body</span>
                <p style={{ marginTop: 8, fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>{previewTemplate.body}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setPreviewTemplate(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}