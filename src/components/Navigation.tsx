import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  Scan, 
  MapPin, 
  ShieldAlert, 
  Wifi, 
  WifiOff, 
  ShieldCheck,
  User
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { currentRole, setRole, userEmail } = useApp();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as UserRole);
  };

  return (
    <>
      {/* Network Status Banner */}
      <div className={`status-banner ${isOnline ? 'status-online' : 'status-offline'}`}>
        {isOnline ? (
          <>
            <Wifi size={14} />
            <span>Connecté • Base de données synchronisée</span>
          </>
        ) : (
          <>
            <WifiOff size={14} />
            <span>Mode Hors ligne • Consultation locale active</span>
          </>
        )}
      </div>

      {/* Top Header */}
      <header className="header">
        <div className="header-logo">
          <ShieldCheck className="header-logo-img" />
          <div className="header-title">
            <span>Poinçons Maroc</span>
            <span className="header-subtitle">Garantie &amp; Douane</span>
          </div>
        </div>

        <div className="header-actions">
          {/* User profile / Role display */}
          <div style={{ position: 'relative' }}>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={() => setShowRoleSelector(!showRoleSelector)}
            >
              <User size={14} />
              <span>{currentRole}</span>
            </button>

            {showRoleSelector && (
              <div 
                className="glass-panel" 
                style={{ 
                  position: 'absolute', 
                  top: '40px', 
                  right: 0, 
                  width: '200px', 
                  zIndex: 1010, 
                  padding: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                }}
              >
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label" style={{ fontSize: '0.75rem' }}>Changer de rôle :</label>
                  <select 
                    value={currentRole} 
                    onChange={(e) => {
                      handleRoleChange(e);
                      setShowRoleSelector(false);
                    }}
                    className="input-field select-field"
                    style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                  >
                    <option value="PUBLIC">Public (Visiteur)</option>
                    <option value="AGENT">Agent de terrain</option>
                    <option value="EXPERT">Expert Douane</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '8px', wordBreak: 'break-all' }}>
                  Email: {userEmail}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Bottom Navigation Bar */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard className="nav-item-icon" />
          <span>Accueil</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          <BookOpen className="nav-item-icon" />
          <span>Catalogue</span>
        </button>

        {/* Center floating scan button */}
        <button 
          className={`nav-item-scan-btn ${activeTab === 'scanner' ? 'active' : ''}`}
          onClick={() => setActiveTab('scanner')}
        >
          <Scan className="nav-item-icon" />
        </button>

        <button 
          className={`nav-item ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          <MapPin className="nav-item-icon" />
          <span>Bureaux</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          <ShieldAlert className="nav-item-icon" />
          <span>Admin</span>
        </button>
      </nav>
    </>
  );
};
