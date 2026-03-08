import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/users').then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>REGISTERED USERS</h1>
        <span style={styles.count}>{users.length} USERS</span>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div>
      ) : (
        <div style={styles.tableWrap}>
          <table className="table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>LOCATION</th>
                <th>REGISTERED</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td style={{ fontWeight: '500' }}>{u.name}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text2)' }}>{u.email}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-gold' : 'badge-blue'}`}>{u.role.toUpperCase()}</span></td>
                  <td style={{ fontSize: '12px', color: 'var(--text3)' }}>
                    {u.address ? `${u.address.city || ''}, ${u.address.country || ''}` : '—'}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text3)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>No users registered yet.</div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' },
  title: { fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '3px' },
  count: { fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text3)', letterSpacing: '2px', background: 'var(--surface)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: '4px' },
  tableWrap: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' },
};
