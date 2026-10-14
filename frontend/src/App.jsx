import React, { useEffect, useState } from 'react';

export default function App() {
  const [dashboard, setDashboard] = useState(null);
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Django REST API
  const fetchData = async () => {
    try {
      setLoading(true);
      const dashRes = await fetch('http://127.0.0.1:8000/api/dashboard/');
      const dashData = await dashRes.json();
      setDashboard(dashData);

      const findRes = await fetch('http://127.0.0.1:8000/api/findings/');
      const findData = await findRes.json();
      setFindings(findData);
    } catch (error) {
      console.error("Error connecting to backend API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Trigger mock cloud scan
  const handleRunScan = async () => {
    await fetch('http://127.0.0.1:8000/api/scan/', { method: 'POST' });
    fetchData();
  };

  // Update vulnerability status from dropdown
  const handleStatusChange = async (id, newStatus) => {
    await fetch(`http://127.0.0.1:8000/api/findings/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchData();
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>GovernX - Automated NIST CSF 2.0 Compliance Engine</h1>
        <div>
          <button onClick={handleRunScan} style={{ padding: '10px 18px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
            Run Mock Cloud Scan
          </button>
          <a href="http://127.0.0.1:8000/api/report.pdf" target="_blank" rel="noreferrer" style={{ padding: '10px 18px', backgroundColor: '#28a745', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
            Export PDF Report
          </a>
        </div>
      </header>

      {loading ? (
        <p>Loading dashboard data...</p>
      ) : (
        <>
          {/* Executive Risk Cards */}
          {dashboard && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h4 style={{ margin: 0, color: '#6c757d' }}>Total Findings</h4>
                <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0 0 0' }}>{dashboard.total_findings}</p>
              </div>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h4 style={{ margin: 0, color: '#6c757d' }}>Open Vulnerabilities</h4>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc3545', margin: '10px 0 0 0' }}>{dashboard.open_findings}</p>
              </div>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h4 style={{ margin: 0, color: '#6c757d' }}>Expected Financial Loss (ALE)</h4>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#fd7e14', margin: '10px 0 0 0' }}>
                  ${dashboard.risk_metrics?.expected_loss?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          )}

          {/* Findings Inventory Table */}
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>Detected Security Findings</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #dee2e6', backgroundColor: '#e9ecef' }}>
                  <th style={{ padding: '12px' }}>Severity</th>
                  <th style={{ padding: '12px' }}>Title</th>
                  <th style={{ padding: '12px' }}>Resource</th>
                  <th style={{ padding: '12px' }}>NIST Category</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {findings.map((f) => (
                  <tr key={f.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: f.severity === 'CRITICAL' ? '#dc3545' : '#ffc107' }}>
                      {f.severity}
                    </td>
                    <td style={{ padding: '12px' }}>{f.title}</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>{f.resource}</td>
                    <td style={{ padding: '12px' }}>{f.nist_category}</td>
                    <td style={{ padding: '12px' }}>
                      <select value={f.status} onChange={(e) => handleStatusChange(f.id, e.target.value)} style={{ padding: '6px', borderRadius: '4px' }}>
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}