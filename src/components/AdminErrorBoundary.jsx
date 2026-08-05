import { Component } from 'react';

export default class AdminErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() { return { hasError: true }; }

  componentDidCatch(error, info) { console.error('AdminErrorBoundary:', error, info); }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '48px 24px', minHeight: '50vh', background: 'var(--bg)' }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 24, color: 'var(--text)', marginBottom: 12 }}>
            Ein Fehler ist aufgetreten
          </h2>
          <p style={{ color: 'var(--text-3)', marginBottom: 24, lineHeight: 1.6 }}>
            Laden Sie die Seite neu oder kehren Sie zur Administration zurück.
          </p>
          <button type="button" className="btn-primary" onClick={() => { window.location.href = '/admin'; }}>
            Zurück zum Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
