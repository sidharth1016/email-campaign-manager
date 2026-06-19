import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import api from '../api/api';

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/analytics/summary'), api.get('/campaigns')]).then(([s, c]) => {
      setSummary(s.data);
      setCampaigns(c.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading"><div className="spinner" />Loading analytics...</div>;

  const campaignChartData = campaigns
    .filter(c => c.analytics.sent > 0)
    .map(c => ({
      name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
      Sent: c.analytics.sent,
      Opened: c.analytics.opened,
      Clicked: c.analytics.clicked,
    }));

  const rateData = campaigns
    .filter(c => c.analytics.sent > 0)
    .map(c => ({
      name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
      'Open Rate': parseFloat(((c.analytics.opened / c.analytics.sent) * 100).toFixed(1)),
      'Click Rate': parseFloat(((c.analytics.clicked / c.analytics.sent) * 100).toFixed(1)),
    }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p>Track your campaign performance</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header"><div className="stat-card-icon purple">📨</div></div>
          <div className="stat-value">{summary?.emailStats?.sent?.toLocaleString() || 0}</div>
          <div className="stat-label">Total Emails Sent</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header"><div className="stat-card-icon green">👀</div></div>
          <div className="stat-value">{summary?.emailStats?.opened?.toLocaleString() || 0}</div>
          <div className="stat-label">Total Opens</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header"><div className="stat-card-icon orange">🖱</div></div>
          <div className="stat-value">{summary?.emailStats?.clicked?.toLocaleString() || 0}</div>
          <div className="stat-label">Total Clicks</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header"><div className="stat-card-icon pink">📊</div></div>
          <div className="stat-value">{summary?.emailStats?.openRate || 0}%</div>
          <div className="stat-label">Avg Open Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header"><div className="stat-card-icon teal">🎯</div></div>
          <div className="stat-value">{summary?.emailStats?.clickRate || 0}%</div>
          <div className="stat-label">Avg Click Rate</div>
        </div>
      </div>

      {campaignChartData.length > 0 ? (
        <>
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Emails by Campaign</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={campaignChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Sent" fill="#6C63FF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Opened" fill="#43D9A2" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Clicked" fill="#FF6584" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Open & Click Rates</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={rateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Legend />
                  <Line type="monotone" dataKey="Open Rate" stroke="#6C63FF" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Click Rate" stroke="#43D9A2" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="table-card">
            <div className="table-card-header"><h3>Campaign Breakdown</h3></div>
            <table>
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Status</th>
                  <th>Sent</th>
                  <th>Opened</th>
                  <th>Clicked</th>
                  <th>Bounced</th>
                  <th>Open Rate</th>
                  <th>Click Rate</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c._id}>
                    <td><strong>{c.name}</strong></td>
                    <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                    <td>{c.analytics.sent}</td>
                    <td>{c.analytics.opened}</td>
                    <td>{c.analytics.clicked}</td>
                    <td>{c.analytics.bounced}</td>
                    <td>{c.analytics.sent > 0 ? `${((c.analytics.opened / c.analytics.sent) * 100).toFixed(1)}%` : '—'}</td>
                    <td>{c.analytics.sent > 0 ? `${((c.analytics.clicked / c.analytics.sent) * 100).toFixed(1)}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="table-card">
          <div className="empty-state">
            <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
            <h3>No data yet</h3>
            <p>Create and launch campaigns to see your analytics here</p>
          </div>
        </div>
      )}
    </div>
  );
}