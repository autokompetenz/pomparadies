import { useState, useEffect } from 'react';

const texts = {
  title: '🚚 Lieferung in ganz Deutschland möglich',
  body: 'Wir liefern unsere Welpen in ganz Deutschland. Sicherer und komfortabler Transport mit Live-Tracking.',
  note: 'Kontaktieren Sie uns für ein individuelles Angebot.',
  btn: 'Verstanden!',
};

export default function DeliveryModal() {
  const [open, setOpen] = useState(false);
  const t = texts;

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(timer);
  }, []);

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      padding: 20,
    }} onClick={() => setOpen(false)}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        maxWidth: 440, width: '100%',
        padding: '36px 32px 28px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
        position: 'relative',
      }} onClick={e => e.stopPropagation()}>
        <button onClick={() => setOpen(false)} style={{
          position: 'absolute', top: 14, right: 16,
          background: 'none', border: 'none',
          fontSize: 22, cursor: 'pointer',
          color: 'var(--text-3)', lineHeight: 1,
          padding: '4px 8px', borderRadius: 6,
        }}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(201,118,46,0.12)',
            border: '2px solid rgba(201,118,46,0.25)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, marginBottom: 16,
          }}>🚚</div>
          <h2 style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: 20, fontWeight: 900,
            color: 'var(--text)',
            margin: 0, lineHeight: 1.3,
          }}>{t.title}</h2>
        </div>

        <p style={{
          fontSize: 15, lineHeight: 1.7,
          color: 'var(--text-2)',
          margin: '0 0 12px', textAlign: 'center',
        }}>{t.body}</p>

        <p style={{
          fontSize: 13, lineHeight: 1.6,
          color: 'var(--text-3)',
          margin: '0 0 24px', textAlign: 'center',
        }}>{t.note}</p>

        <button onClick={() => setOpen(false)} style={{
          display: 'block', width: '100%',
          padding: '14px 20px', borderRadius: 10,
          background: 'var(--primary)', color: '#fff',
          border: 'none', fontSize: 15, fontWeight: 800,
          cursor: 'pointer', fontFamily: "'Outfit',sans-serif",
          letterSpacing: '0.04em',
        }}>{t.btn}</button>
      </div>
    </div>
  );
}
