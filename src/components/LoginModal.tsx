import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, X, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const { login, userAccounts } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = login(email, password);
    if (success) {
      onClose();
    } else {
      setError('Identifiants incorrects. Veuillez réessayer.');
    }
  };

  // Pre-fill helper for reviews/testing
  const handleQuickLogin = (role: string) => {
    const account = userAccounts.find(u => u.role === role);
    if (account) {
      setEmail(account.email);
      setPassword(account.password || '');
      // Automatically log in
      const success = login(account.email, account.password || '');
      if (success) {
        onClose();
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px', padding: '30px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={16} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            background: 'rgba(212, 175, 55, 0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            border: '1px solid var(--gold-primary)'
          }}>
            <ShieldCheck size={30} style={{ color: 'var(--gold-primary)' }} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Espace Sécurisé
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Veuillez vous authentifier pour accéder à vos services officiels.
          </p>
        </div>

        {error && (
          <div className="glass-panel" style={{ 
            borderColor: 'rgba(239, 68, 68, 0.3)', 
            background: 'rgba(239, 68, 68, 0.05)', 
            display: 'flex', 
            gap: '8px', 
            alignItems: 'center', 
            padding: '10px 14px',
            marginBottom: '15px',
            borderRadius: '12px'
          }}>
            <AlertCircle size={14} style={{ color: '#EF4444', flexShrink: 0 }} />
            <span style={{ fontSize: '0.75rem', color: '#FCA5A5' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label" style={{ fontSize: '0.75rem' }}>Adresse Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ 
                position: 'absolute', 
                left: '14px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--text-muted)' 
              }} />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nom@douane.gov.ma"
                required 
                className="input-field" 
                style={{ paddingLeft: '42px' }}
              />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: '20px' }}>
            <label className="input-label" style={{ fontSize: '0.75rem' }}>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ 
                position: 'absolute', 
                left: '14px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--text-muted)' 
              }} />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required 
                className="input-field" 
                style={{ paddingLeft: '42px' }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
            Se connecter
          </button>
        </form>

        <div style={{ marginTop: '25px', borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '5px', 
            fontSize: '0.7rem', 
            color: 'var(--gold-primary)',
            fontWeight: 600,
            marginBottom: '10px'
          }}>
            <Sparkles size={12} />
            <span>ACCÈS RAPIDE DÉMO</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => handleQuickLogin('ADMIN')}
              style={{ fontSize: '0.7rem', padding: '8px 4px', borderRadius: '8px' }}
            >
              Admin
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => handleQuickLogin('EXPERT')}
              style={{ fontSize: '0.7rem', padding: '8px 4px', borderRadius: '8px' }}
            >
              Expert
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => handleQuickLogin('AGENT')}
              style={{ fontSize: '0.7rem', padding: '8px 4px', borderRadius: '8px' }}
            >
              Agent
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => handleQuickLogin('VENDEUR')}
              style={{ fontSize: '0.7rem', padding: '8px 4px', borderRadius: '8px', color: 'var(--gold-primary)' }}
            >
              Vendeur
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
