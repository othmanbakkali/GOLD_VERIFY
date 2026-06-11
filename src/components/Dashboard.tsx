import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  FileText, 
  Map, 
  Scan, 
  History, 
  Activity, 
  TrendingUp, 
  Flame,
  CheckCircle2
} from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { punches, logs, currentRole } = useApp();

  // Statistics calculation
  const activePunches = punches.filter(p => p.actif);
  const goldCount = activePunches.filter(p => p.metalId === 'm-or').length;
  const silverCount = activePunches.filter(p => p.metalId === 'm-argent').length;
  const platineCount = activePunches.filter(p => p.metalId === 'm-platine').length;
  const otherCount = activePunches.filter(p => p.metalId === 'm-autre').length;

  const total = activePunches.length || 1;
  const goldPct = Math.round((goldCount / total) * 100);
  const silverPct = Math.round((silverCount / total) * 100);
  const platinePct = Math.round((platineCount / total) * 100);
  const otherPct = 100 - goldPct - silverPct - platinePct;

  // Role descriptive banner
  const getGreeting = () => {
    switch (currentRole) {
      case 'ADMIN':
        return {
          title: 'Espace Administrateur',
          desc: 'Gestion complète du catalogue, des documents juridiques et audit de l\'historique d\'activité.',
          alert: 'Réseau opérationnel. Modifications répercutées localement.'
        };
      case 'EXPERT':
        return {
          title: 'Espace Expert',
          desc: 'Analyse approfondie des poinçons officiels, validation des expertises terrain et consultation.',
          alert: 'Vous pouvez valider l\'authenticité des marquages photo.'
        };
      case 'AGENT':
        return {
          title: 'Session Agent Douane',
          desc: 'Vérification terrain des ouvrages d\'or et d\'argent. Scan photo et consultation des bureaux.',
          alert: 'Utilisez le scanneur central pour identifier les poinçons.'
        };
      default:
        return {
          title: 'Portail Public Poinçons Maroc',
          desc: 'Consultez les poinçons officiels de l\'État marocain pour vérifier l\'authenticité de vos bijoux.',
          alert: 'Les poinçons garantissent le titre de pureté des métaux précieux.'
        };
    }
  };

  const greeting = getGreeting();

  return (
    <div style={{ padding: '20px' }}>
      {/* Welcome & Role Card */}
      <div className="glass-panel" style={{ 
        background: 'linear-gradient(135deg, rgba(25, 35, 58, 0.7), rgba(0, 98, 65, 0.2))',
        borderColor: 'var(--emerald-light)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          right: '-20px',
          bottom: '-20px',
          opacity: 0.1,
          color: 'var(--gold-primary)'
        }}>
          <Award size={140} />
        </div>
        
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold-primary)', marginBottom: '8px' }}>
          {greeting.title}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>
          {greeting.desc}
        </p>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          fontSize: '0.75rem', 
          color: 'var(--text-primary)', 
          background: 'rgba(255,255,255,0.05)',
          padding: '6px 12px',
          borderRadius: '8px'
        }}>
          <CheckCircle2 size={12} style={{ color: 'var(--emerald-light)' }} />
          <span>{greeting.alert}</span>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <span className="stat-label">Poinçons Actifs</span>
          <span className="stat-value">{activePunches.length}</span>
          <Award size={14} className="stat-icon" />
        </div>
        <div className="stat-card">
          <span className="stat-label">Ouvrages en Or</span>
          <span className="stat-value" style={{ color: 'var(--gold-primary)' }}>{goldCount}</span>
          <TrendingUp size={14} className="stat-icon" />
        </div>
        <div className="stat-card">
          <span className="stat-label">Ouvrages Argent</span>
          <span className="stat-value" style={{ color: '#E5E7EB' }}>{silverCount}</span>
          <Flame size={14} className="stat-icon" />
        </div>
        <div className="stat-card">
          <span className="stat-label">Bureaux Douane</span>
          <span className="stat-value" style={{ color: 'var(--emerald-light)' }}>5</span>
          <Map size={14} className="stat-icon" />
        </div>
      </div>

      {/* Premium Visual Metal Distribution Chart */}
      <div className="glass-panel">
        <h3 className="glass-panel-title">
          <TrendingUp size={16} style={{ color: 'var(--gold-primary)' }} />
          Répartition des Métaux
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>
          Proportions des empreintes officielles par nature de métal précieux.
        </p>

        {/* Visual progress bar */}
        <div style={{ 
          height: '14px', 
          borderRadius: '7px', 
          display: 'flex', 
          overflow: 'hidden', 
          background: 'var(--bg-primary)',
          marginBottom: '15px'
        }}>
          {goldPct > 0 && (
            <div style={{ width: `${goldPct}%`, backgroundColor: 'var(--gold-primary)', boxShadow: 'inset 0 0 4px rgba(0,0,0,0.5)' }} title={`Or: ${goldPct}%`} />
          )}
          {silverPct > 0 && (
            <div style={{ width: `${silverPct}%`, backgroundColor: '#CCCCCC', boxShadow: 'inset 0 0 4px rgba(0,0,0,0.5)' }} title={`Argent: ${silverPct}%`} />
          )}
          {platinePct > 0 && (
            <div style={{ width: `${platinePct}%`, backgroundColor: '#4F46E5', boxShadow: 'inset 0 0 4px rgba(0,0,0,0.5)' }} title={`Platine: ${platinePct}%`} />
          )}
          {otherPct > 0 && (
            <div style={{ width: `${otherPct}%`, backgroundColor: '#6B7280', boxShadow: 'inset 0 0 4px rgba(0,0,0,0.5)' }} title={`Autres: ${otherPct}%`} />
          )}
        </div>

        {/* Chart Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--gold-primary)' }} />
            <span>Or ({goldCount}) : <strong>{goldPct}%</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#CCCCCC' }} />
            <span>Argent ({silverCount}) : <strong>{silverPct}%</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#4F46E5' }} />
            <span>Platine ({platineCount}) : <strong>{platinePct}%</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#6B7280' }} />
            <span>Spécifique ({otherCount}) : <strong>{otherPct}%</strong></span>
          </div>
        </div>
      </div>

      {/* Quick Access Shortcuts */}
      <div className="glass-panel">
        <h3 className="glass-panel-title">
          <Scan size={16} style={{ color: 'var(--gold-primary)' }} />
          Accès Rapide
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            className="btn btn-emerald" 
            style={{ width: '100%', justifyContent: 'flex-start' }}
            onClick={() => setActiveTab('scanner')}
          >
            <Scan size={18} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Scanner un Poinçon</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: 400 }}>Identifier par photo ou caméra</div>
            </div>
          </button>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button 
              className="btn btn-secondary" 
              style={{ justifyContent: 'center', padding: '12px' }}
              onClick={() => setActiveTab('catalog')}
            >
              <FileText size={16} />
              <span style={{ fontSize: '0.8rem' }}>Catalogue</span>
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ justifyContent: 'center', padding: '12px' }}
              onClick={() => setActiveTab('map')}
            >
              <Map size={16} />
              <span style={{ fontSize: '0.8rem' }}>Bureaux</span>
            </button>
          </div>
        </div>
      </div>

      {/* Logs/Legislation Section */}
      {currentRole !== 'PUBLIC' ? (
        <div className="glass-panel">
          <h3 className="glass-panel-title">
            <Activity size={16} style={{ color: 'var(--gold-primary)' }} />
            Journal d'Activité local
          </h3>
          <div className="recent-logs">
            {logs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Aucune modification récente enregistrée dans la session.
              </div>
            ) : (
              logs.slice(0, 10).map((log) => (
                <div key={log.id} className="log-item">
                  <div className={`log-icon-wrapper ${
                    log.action === 'CREATE' ? 'log-icon-create' : 
                    log.action === 'UPDATE' ? 'log-icon-update' : 'log-icon-delete'
                  }`}>
                    <History size={12} />
                  </div>
                  <div className="log-details">
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {log.action} : {log.entityName}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{log.details}</span>
                    <span className="log-time">
                      Par {log.userEmail.split('@')[0]} • {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ fontSize: '0.8rem', lineHeight: '1.4', color: 'var(--text-secondary)' }}>
          <h3 className="glass-panel-title" style={{ fontSize: '1rem' }}>
            <CheckCircle2 size={16} style={{ color: 'var(--gold-primary)' }} />
            Cadre Réglementaire Marocain
          </h3>
          <p style={{ marginBottom: '8px' }}>
            Au Maroc, le contrôle et la garantie des titres des matières d'or, d'argent et de platine sont régis par le <strong>Dahir du 9 octobre 1977</strong>.
          </p>
          <p style={{ marginBottom: '12px' }}>
            Chaque ouvrage en métal précieux vendu sur le marché national doit comporter deux poinçons : 
            le <strong>poinçon du fabricant</strong> (ou de l'importateur) et le <strong>poinçon officiel de l'État</strong> (poinçon de garantie), garantissant le titre réel vérifié en laboratoire douanier.
          </p>
          <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'center' }}>
            <a 
              href="/poincons_table.jpeg" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary" 
              style={{ textDecoration: 'none', fontSize: '0.75rem', padding: '8px 12px' }}
            >
              <FileText size={14} style={{ color: 'var(--gold-primary)' }} />
              <span>Afficher le Tableau Officiel (Image)</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
