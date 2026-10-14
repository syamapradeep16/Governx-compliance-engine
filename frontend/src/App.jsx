import React, { useState, useEffect } from 'react';

function App() {
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Findings from Django REST API
  const fetchData = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/findings/');
      const data = await res.json();
      setFindings(data);
    } catch (err) {
      console.error("Error fetching findings:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Scan Trigger
  const handleRunScan = async () => {
    try {
      setLoading(true);
      await fetch('http://127.0.0.1:8000/api/scan/', { method: 'POST' });
      await fetchData();
    } catch (err) {
      console.error("Scan error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle PDF Export
  const handleExportPDF = () => {
    window.open('http://127.0.0.1:8000/api/report.pdf', '_blank');
  };

  // Derived Metrics
  const totalFindings = findings.length;
  const openVulnerabilities = findings.filter(f => !f.status || f.status.toUpperCase() === 'OPEN').length;
  
  // Calculate total financial impact (ALE estimation mock)
  const totalFinancialLoss = "$125,306.02";

  // Helper for Severity Badges
  const getSeverityStyle = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return { backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' };
      case 'HIGH':
        return { backgroundColor: '#ffedd5', color: '#ea580c', border: '1px solid #fdba74' };
      case 'MEDIUM':
        return { backgroundColor: '#fef3c7', color: '#d97706', border: '1px solid #fcd34d' };
      default:
        return { backgroundColor: '#e0f2fe', color: '#0284c7', border: '1px solid #7dd3fc' };
    }
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>GovernX - Automated NIST CSF 2.0 Compliance Engine</h1>
          <p style={styles.subtitle}>Continuous Multi-Cloud Security Posture & Financial Risk Governance</p>
        </div>

        {/* Action Buttons (Flexbox prevents overlap) */}
        <div style={styles.buttonGroup}>
          <button 
            onClick={handleRunScan} 
            disabled={loading}
            style={{ ...styles.btn, ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Scanning Cloud...' : '⚡ Run Mock Cloud Scan'}
          </button>
          <button 
            onClick={handleExportPDF} 
            style={{ ...styles.btn, ...styles.btnSuccess }}
          >
            📄 Export PDF Report
          </button>
        </div>
      </header>

      {/* Top Metrics Cards Row */}
      <div style={styles.metricsRow}>
        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>Total Findings</span>
          <span style={styles.metricValue}>{totalFindings}</span>
        </div>
        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>Open Vulnerabilities</span>
          <span style={{ ...styles.metricValue, color: '#dc2626' }}>{openVulnerabilities}</span>
        </div>
        <div style={styles.metricCard}>
          <span style={styles.metricLabel}>Expected Financial Loss (ALE)</span>
          <span style={{ ...styles.metricValue, color: '#ea580c' }}>{totalFinancialLoss}</span>
        </div>
      </div>

      {/* Main Table Card */}
      <main style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>Detected Security Findings</h2>
          <span style={styles.badgeCount}>{totalFindings} Active Items</span>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Severity</th>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Resource</th>
                <th style={styles.th}>NIST Category</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {findings.length > 0 ? (
                findings.map((item, index) => (
                  <tr key={index} style={styles.tr}>
                    <td style={styles.td}>
                      <span style={{ ...styles.severityBadge, ...getSeverityStyle(item.severity) }}>
                        {item.severity}
                      </span>
                    </td>
                    <td style={{ ...styles.td, fontWeight: '600', color: '#0f172a' }}>{item.title}</td>
                    <td style={styles.td}><code style={styles.code}>{item.resource}</code></td>
                    <td style={styles.td}>
                      <span style={styles.nistTag}>{item.nist_category}</span>
                    </td>
                    <td style={styles.td}>
                      <select defaultValue={item.status || "Open"} style={styles.statusSelect}>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={styles.emptyTd}>
                    No findings recorded. Click <b>"Run Mock Cloud Scan"</b> to trigger a scan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

// Clean Styles Architecture
const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    padding: '32px 48px',
    color: '#0f172a'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e2e8f0'
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#0f172a',
    margin: '0 0 6px 0',
    letterSpacing: '-0.02em'
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  btn: {
    padding: '10px 18px',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  },
  btnPrimary: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
  },
  btnSuccess: {
    backgroundColor: '#16a34a',
    color: '#ffffff',
    boxShadow: '0 2px 4px rgba(22, 163, 74, 0.2)'
  },
  metricsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '28px'
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px 24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  metricLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  metricValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden'
  },
  cardHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    margin: 0
  },
  badgeCount: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 12px',
    borderRadius: '20px'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  thRow: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0'
  },
  th: {
    padding: '14px 24px',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#64748b',
    letterSpacing: '0.05em'
  },
  tr: {
    borderBottom: '1px solid #f1f5f9'
  },
  td: {
    padding: '16px 24px',
    fontSize: '14px',
    color: '#334155'
  },
  severityBadge: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.04em',
    display: 'inline-block'
  },
  code: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: '13px',
    backgroundColor: '#f1f5f9',
    padding: '2px 6px',
    borderRadius: '4px',
    color: '#475569'
  },
  nistTag: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    fontFamily: 'monospace'
  },
  statusSelect: {
    padding: '6px 10px',
    fontSize: '13px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#334155',
    cursor: 'pointer'
  },
  emptyTd: {
    padding: '40px',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '14px'
  }
};

export default App;