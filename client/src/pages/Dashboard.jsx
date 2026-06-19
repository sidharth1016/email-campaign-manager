import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#6C63FF', '#43D9A2', '#FF6584', '#F59E0B'];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/analytics/summary').then(res => {
      setSummary(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" />Loading dashboard...</div>;

  const emailChartData = summary ? [
    { name: 'Sent', value: summary.emailStats.sent },
    { name: 'Opened', value: summary.emailStats.opened },
    { name: 'Clicked', value: summary.emailStats.clicked },
    { name: 'Bounced', value: summary.emailStats.bounced },
  ] : [];

  const statusData = summary ? [
    { name: 'Active', value: summary.activeCampaigns },
    { name: 'Draft', value: summary.draftCampaigns },
    { name: 'Others', value: Math.max(0, summary.totalCampaigns - summary.activeCampaigns - summary.draftCampaigns) },
  ].filter(d => d.value > 0) : [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p>Here's what's happening with your campaigns today.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/campaigns')}>
          + New Campaign
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon purple">📧</div>
            <span className="stat-card-badge">Total</span>
          </div>
          <div className="stat-value">{summary?.totalCampaigns || 0}</div>
          <div className="stat-label">Campaigns</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon green">✅</div>
            <span className="stat-card-badge">Live</span>
          </div>
          <div className="stat-value">{summary?.activeCampaigns || 0}</div>
          <div className="stat-label">Active Campaigns</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon pink">👥</div>
            <span className="stat-card-badge">Contacts</span>
          </div>
          <div className="stat-value">{summary?.totalLeads || 0}</div>
          <div className="stat-label">Total Leads</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon orange">📨</div>
          </div>
          <div className="stat-value">{summary?.emailStats?.openRate || 0}%</div>
          <div className="stat-label">Open Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-card-icon teal">🖱</div>
          </div>
          <div className="stat-value">{summary?.emailStats?.clickRate || 0}%</div>
          <div className="stat-label">Click Rate</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Email Performance</h3>
          {emailChartData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={emailChartData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#6C63FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: 40 }}>
              <p>Launch a campaign to see stats</p>
            </div>
          )}
        </div>

        <div className="chart-card">
          <h3>Campaign Status</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: 40 }}>
              <p>No campaigns yet</p>
            </div>
          )}
        </div>
      </div>

      {summary?.recentCampaigns?.length > 0 && (
        <div className="table-card">
          <div className="table-card-header">
            <h3>Recent Campaigns</h3>
            <button className="btn btn-secondary" onClick={() => navigate('/campaigns')}>View All</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Status</th>
                <th>Sent</th>
                <th>Opened</th>
                <th>Clicked</th>
              </tr>
            </thead>
            <tbody>
              {summary.recentCampaigns.map(c => (
                <tr key={c._id} onClick={() => navigate('/campaigns')} style={{ cursor: 'pointer' }}>
                  <td><strong>{c.name}</strong><br /><span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{c.subject}</span></td>
                  <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                  <td>{c.analytics.sent}</td>
                  <td>{c.analytics.opened}</td>
                  <td>{c.analytics.clicked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}