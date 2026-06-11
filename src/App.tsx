import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Catalog } from './components/Catalog';
import { Scanner } from './components/Scanner';
import { MapBureaux } from './components/MapBureaux';
import { AdminPanel } from './components/AdminPanel';
import { SellerPanel } from './components/SellerPanel';
import { Download, X, ShieldAlert } from 'lucide-react';

const AccessDenied: React.FC<{ role: string; permissionName: string }> = ({ role, permissionName }) => {
  return (
    <div style={{ padding: '20px' }}>
      <div className="glass-panel" style={{ 
        textAlign: 'center', 
        padding: '50px 20px', 
        borderColor: 'rgba(239, 68, 68, 0.3)', 
        background: 'rgba(239, 68, 68, 0.03)' 
      }}>
        <ShieldAlert size={44} style={{ color: '#EF4444', marginBottom: '15px', marginLeft: 'auto', marginRight: 'auto' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FCA5A5' }}>Accès Restreint</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: '1.4', maxWidth: '300px', margin: '10px auto' }}>
          Votre profil actuel (<strong>{role}</strong>) ne possède pas la permission d'accès pour <strong>{permissionName}</strong>.
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '5px' }}>
          Veuillez configurer les accès de votre profil ou vous connecter avec un compte habilité.
        </p>
      </div>
    </div>
  );
};

const MainAppContent: React.FC = () => {
  const { currentRole, permissionsGrid } = useApp();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Retrieve permissions for active role
  const activePermissions = permissionsGrid.find(p => p.role === currentRole) || {
    dashboard: true,
    catalog: true,
    scanner: true,
    map: true,
    admin: false
  };

  // Listen to PWA installation offer from browser
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallBanner(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA Installation outcome: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        if (!activePermissions.dashboard) return <AccessDenied role={currentRole} permissionName="Accueil" />;
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'catalog':
        if (!activePermissions.catalog) return <AccessDenied role={currentRole} permissionName="Catalogue" />;
        return <Catalog />;
      case 'scanner':
        if (!activePermissions.scanner) return <AccessDenied role={currentRole} permissionName="Scanner IA" />;
        return <Scanner />;
      case 'map':
        if (!activePermissions.map) return <AccessDenied role={currentRole} permissionName="Bureaux" />;
        return <MapBureaux />;
      case 'seller':
        if (currentRole !== 'VENDEUR' && currentRole !== 'ADMIN') return <AccessDenied role={currentRole} permissionName="Services Vendeur" />;
        return <SellerPanel />;
      case 'admin':
        if (!activePermissions.admin) return <AccessDenied role={currentRole} permissionName="Console d'Administration" />;
        return <AdminPanel />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };


  return (
    <div className="app-container">
      {/* Navigation Top Header & Bottom Bar */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main style={{ flexGrow: 1, paddingBottom: '20px' }}>
        
        {/* PWA Promoted Install Banner */}
        {showInstallBanner && activeTab === 'dashboard' && (
          <div style={{ padding: '20px 20px 0 20px' }}>
            <div className="install-banner">
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Download size={18} style={{ color: 'var(--gold-primary)' }} />
                <div className="install-banner-text">
                  <strong>Installer l'application</strong>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Accès rapide sur l'écran d'accueil &amp; mode hors ligne.
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  className="btn btn-emerald" 
                  onClick={handleInstallApp}
                  style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}
                >
                  Installer
                </button>
                <button 
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  onClick={() => setShowInstallBanner(false)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Inner Tab View */}
        {renderActiveView()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
