import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LoginModal } from './LoginModal';
import { 
  LayoutDashboard, 
  BookOpen, 
  Scan, 
  MapPin, 
  ShieldAlert, 
  Wifi, 
  WifiOff, 
  ShieldCheck,
  User,
  ShoppingBag,
  LogOut
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { currentRole, currentUser, logout, permissionsGrid } = useApp();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

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

  // Retrieve permissions for the active role
  const activePermissions = permissionsGrid.find(p => p.role === currentRole) || {
    dashboard: true,
    catalog: true,
    scanner: true,
    map: true,
    admin: false
  };

  const handleLogoutClick = () => {
    logout();
    setShowProfileMenu(false);
    setActiveTab('dashboard');
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
          {currentUser ? (
            /* Logged In User Profile Dropdown */
            <div style={{ position: 'relative' }}>
              <button 
                className="btn btn-secondary" 
                style={{ 
                  padding: '6px 12px', 
                  fontSize: '0.8rem', 
                  borderRadius: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  borderColor: currentRole === 'VENDEUR' ? 'var(--gold-primary)' : 'var(--border-glass)'
                }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <User size={14} style={{ color: currentRole === 'VENDEUR' ? 'var(--gold-primary)' : 'inherit' }} />
                <span>{currentUser.nom.split(' ')[0]}</span>
              </button>

              {showProfileMenu && (
                <div 
                  className="glass-panel" 
                  style={{ 
                    position: 'absolute', 
                    top: '40px', 
                    right: 0, 
                    width: '220px', 
                    zIndex: 1010, 
                    padding: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {currentUser.nom}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--gold-primary)', marginTop: '2px', fontWeight: 600 }}>
                    Rôle : {currentUser.role}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '4px', wordBreak: 'break-all' }}>
                    Email: {currentUser.email}
                  </div>
                  
                  <div style={{ width: '100%', height: '1px', background: 'var(--border-glass)', margin: '8px 0' }} />

                  <button 
                    className="btn btn-secondary"
                    style={{ 
                      width: '100%', 
                      padding: '6px 12px', 
                      fontSize: '0.75rem', 
                      color: '#EF4444', 
                      borderColor: 'rgba(239,68,68,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                    onClick={handleLogoutClick}
                  >
                    <LogOut size={12} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Guest Connect button */
            <button 
              className="btn btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.78rem', borderRadius: '15px' }}
              onClick={() => setShowLoginModal(true)}
            >
              <span>Connexion</span>
            </button>
          )}
        </div>
      </header>

      {/* Bottom Navigation Bar */}
      <nav className="bottom-nav">
        {activePermissions.dashboard && (
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard className="nav-item-icon" />
            <span>Accueil</span>
          </button>
        )}

        {activePermissions.catalog && (
          <button 
            className={`nav-item ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            <BookOpen className="nav-item-icon" />
            <span>Catalogue</span>
          </button>
        )}

        {/* Center floating scan button */}
        {activePermissions.scanner && (
          <button 
            className={`nav-item-scan-btn ${activeTab === 'scanner' ? 'active' : ''}`}
            onClick={() => setActiveTab('scanner')}
          >
            <Scan className="nav-item-icon" />
          </button>
        )}

        {activePermissions.map && (
          <button 
            className={`nav-item ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => setActiveTab('map')}
          >
            <MapPin className="nav-item-icon" />
            <span>Bureaux</span>
          </button>
        )}

        {/* Seller tab for VENDEUR role */}
        {currentRole === 'VENDEUR' && (
          <button 
            className={`nav-item ${activeTab === 'seller' ? 'active' : ''}`}
            onClick={() => setActiveTab('seller')}
          >
            <ShoppingBag className="nav-item-icon" />
            <span>Vendeur</span>
          </button>
        )}

        {/* Admin panel for authorized roles */}
        {activePermissions.admin && (
          <button 
            className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            <ShieldAlert className="nav-item-icon" />
            <span>Admin</span>
          </button>
        )}
      </nav>

      {/* Login Modal Overlay */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
};
