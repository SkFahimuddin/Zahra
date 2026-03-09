import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { axios.get('/api/admin/users').then(r => setUsers(r.data)).finally(() => setLoading(false)); }, []);
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '5px', color: 'var(--gold)' }}>MANAGE</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '4px', marginTop: '4px' }}>CUSTOMERS <span style={{ color: 'var(--text3)', fontSize: '18px' }}>({users.length})</span></h1>
      </div>
      {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div> : (
        <div style={{ border: '1px solid var(--border)', background: 'var(--surface)', overflow: 'hidden' }}>
          <table className="table">
            <thead><tr><th>NAME</th><th>EMAIL</th><th>LOCATION</th><th>JOINED</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--cream)' }}>{u.name}</td>
                  <td style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text3)' }}>{u.email}</td>
                  <td style={{ fontSize: '13px', color: 'var(--text3)', fontStyle: 'italic' }}>{u.address ? `${u.address.city || ''}, ${u.address.country || ''}` : '—'}</td>
                  <td style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: 'var(--text3)' }}>{new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!users.length && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)', fontStyle: 'italic' }}>No customers yet.</div>}
        </div>
      )}
    </div>
  );
}
