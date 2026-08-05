import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore, useToastStore } from '../../store';
import { adminAPI } from '../../services/api';

export default function AdminLogin() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdminStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    try {
      const { data } = await adminAPI.login(code.trim());
      login(data.token);
      addToast('Erfolgreich angemeldet', 'success');
      navigate('/admin');
    } catch (err) {
      addToast(err.response?.data?.error || 'Falscher Code', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 20 }}>
      <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 40, maxWidth: 400, width: '100%', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 24, color: 'var(--text)' }}>Züchterbereich</h1>
          <p style={{ fontSize: 14, color: 'var(--text-3)', marginTop: 6 }}>Geben Sie den Zugangscode ein, um die Website zu verwalten.</p>
        </div>
        <div style={{ marginBottom: 20 }}>
          <input type="password" value={code} onChange={e => setCode(e.target.value)}
            placeholder="Zugangscode" className="input-luxury"
            style={{ fontSize: 18, textAlign: 'center', letterSpacing: '0.2em' }} />
        </div>
        <button type="submit" disabled={loading || !code.trim()} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 16, fontSize: 15 }}>
          {loading ? '⏳...' : '→ Anmelden'}
        </button>
      </form>
    </div>
  );
}
