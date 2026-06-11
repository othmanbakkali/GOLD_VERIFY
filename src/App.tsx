import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Catalog } from './components/Catalog';
import { Scanner } from './components/Scanner';
import { MapBureaux } from './components/MapBureaux';
import { AdminPanel } from './components/AdminPanel';
import { Download, X } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Listen to PWA installation offer from browser
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent standard browser bar popup
      e.preventDefault();
      // Store event to trigger later
      setDeferredPrompt(e);
      // Show custom glass installer banner
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app was already installed (or running in standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallBanner(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    
    // Show native installer prompt
    deferredPrompt.prompt();
    
    // Await user's decision
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA Installation outcome: ${outcome}`);
    
    // Prompt can only be used once, discard it
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'catalog':
        return <Catalog />;
      case 'scanner':
        return <Scanner />;
      case 'map':
        return <MapBureaux />;
      case 'admin':
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
