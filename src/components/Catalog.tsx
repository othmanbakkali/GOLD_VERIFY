import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Punch } from '../types';
import { PunchVector } from './PunchVector';
import { PunchDetails } from './PunchDetails';
import { 
  Search, 
  BookOpen, 
  Scale, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';

export const Catalog: React.FC = () => {
  const { punches, metals, categories, titres, documents } = useApp();
  
  // Tab states: 'punches' | 'legal'
  const [activeSubTab, setActiveSubTab] = useState<'punches' | 'legal'>('punches');
  
  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  
  // Modal states
  const [selectedPunch, setSelectedPunch] = useState<Punch | null>(null);
  
  // Legislation expand states
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  // Filter punches
  const activePunches = punches.filter(p => p.actif);
  const filteredPunches = activePunches.filter(punch => {
    // Metal filter
    if (selectedMetal !== 'all') {
      if (selectedMetal === 'or' && punch.metalId !== 'm-or') return false;
      if (selectedMetal === 'argent' && punch.metalId !== 'm-argent') return false;
      if (selectedMetal === 'platine' && punch.metalId !== 'm-platine') return false;
      if (selectedMetal === 'autre' && punch.metalId !== 'm-autre') return false;
    }

    // Text query search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const metalObj = metals.find(m => m.id === punch.metalId);
      const titleObj = titres.find(t => t.id === punch.titreId);
      
      const matchName = punch.nom.toLowerCase().includes(q);
      const matchRef = punch.reference.toLowerCase().includes(q);
      const matchDesc = punch.description.toLowerCase().includes(q);
      const matchMetal = metalObj ? metalObj.nom.toLowerCase().includes(q) : false;
      const matchTitre = titleObj ? titleObj.valeur.toLowerCase().includes(q) : false;
      const matchPlace = punch.placeDifferent ? punch.placeDifferent.toLowerCase().includes(q) : false;

      return matchName || matchRef || matchDesc || matchMetal || matchTitre || matchPlace;
    }

    return true;
  });

  const toggleDocExpand = (id: string) => {
    setExpandedDoc(prev => (prev === id ? null : id));
  };

  const getMetalBadgeClass = (metalId: string) => {
    if (metalId === 'm-or') return 'badge-gold';
    if (metalId === 'm-argent') return 'badge-silver';
    if (metalId === 'm-platine') return 'badge-emerald';
    return 'badge-other';
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Tab Switcher */}
      <div className="role-pill-selector" style={{ marginBottom: '15px' }}>
        <div 
          className={`role-pill ${activeSubTab === 'punches' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('punches')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <BookOpen size={14} />
            <span>Poinçons</span>
          </div>
        </div>
        <div 
          className={`role-pill ${activeSubTab === 'legal' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('legal')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Scale size={14} />
            <span>Législation</span>
          </div>
        </div>
      </div>

      {activeSubTab === 'punches' ? (
        <>
          {/* Search Input */}
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Rechercher (ex: mulet, 750, coupelle...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field search-input"
            />
          </div>

          {/* Metal Filter Chips */}
          <div className="filter-chips">
            <button 
              className={`chip ${selectedMetal === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedMetal('all')}
            >
              Tous
            </button>
            <button 
              className={`chip ${selectedMetal === 'or' ? 'active' : ''}`}
              onClick={() => setSelectedMetal('or')}
            >
              Or
            </button>
            <button 
              className={`chip ${selectedMetal === 'argent' ? 'active' : ''}`}
              onClick={() => setSelectedMetal('argent')}
            >
              Argent
            </button>
            <button 
              className={`chip ${selectedMetal === 'platine' ? 'active' : ''}`}
              onClick={() => setSelectedMetal('platine')}
            >
              Platine
            </button>
            <button 
              className={`chip ${selectedMetal === 'autre' ? 'active' : ''}`}
              onClick={() => setSelectedMetal('autre')}
            >
              Spécifiques
            </button>
          </div>

          {/* Results Count */}
          <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>
            <span>{filteredPunches.length} poinçon{filteredPunches.length > 1 ? 's' : ''} trouvé{filteredPunches.length > 1 ? 's' : ''}</span>
          </div>

          {/* Punches Grid */}
          {filteredPunches.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <HelpCircle size={32} style={{ marginBottom: '10px' }} />
              <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Aucun poinçon correspondant</p>
              <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>Modifiez vos filtres ou termes de recherche.</p>
            </div>
          ) : (
            <div className="punches-grid">
              {filteredPunches.map((punch) => {
                const metal = metals.find(m => m.id === punch.metalId);
                const titre = titres.find(t => t.id === punch.titreId);
                
                return (
                  <div 
                    key={punch.id} 
                    className="punch-card"
                    onClick={() => setSelectedPunch(punch)}
                  >
                    <div className="punch-card-img-wrapper">
                      <span className="punch-card-ref">{punch.reference}</span>
                      <PunchVector name={punch.image} className="punch-card-vector" />
                    </div>
                    <div className="punch-card-info">
                      <span className="punch-card-title">{punch.nom}</span>
                      <div className="punch-card-meta">
                        <span className={`badge ${getMetalBadgeClass(punch.metalId)}`} style={{ fontSize: '0.6rem', padding: '2px 6px' }}>
                          {metal?.nom}
                        </span>
                        {titre && (
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                            {titre.valeur.split(' ')[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* Legislation Tab */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '5px', lineHeight: '1.4' }}>
            Textes juridiques officiels régissant le contrôle de garantie des métaux précieux au Maroc.
          </div>
          
          {documents.map((doc) => {
            const isExpanded = expandedDoc === doc.id;
            return (
              <div 
                key={doc.id} 
                className="glass-panel" 
                style={{ 
                  padding: '16px', 
                  cursor: 'pointer',
                  borderLeft: isExpanded ? '3px solid var(--gold-primary)' : '1px solid var(--border-glass)',
                  transition: 'var(--transition-smooth)'
                }}
                onClick={() => toggleDocExpand(doc.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <FileText size={18} style={{ color: 'var(--gold-primary)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: '1.3' }}>
                        {doc.titre}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {doc.description}
                      </p>
                    </div>
                  </div>
                  <div style={{ color: 'var(--text-muted)' }}>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {isExpanded && (
                  <div 
                    style={{ 
                      marginTop: '15px', 
                      paddingTop: '15px', 
                      borderTop: '1px solid var(--border-glass)',
                      fontSize: '0.8rem',
                      lineHeight: '1.5',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'pre-line'
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent collapse when clicking text
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      <span>Date de publication : <strong>{new Date(doc.datePublication).toLocaleDateString()}</strong></span>
                      <span>Douane Maroc</span>
                    </div>
                    {doc.contenu}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Punch Details Modal */}
      {selectedPunch && (
        <PunchDetails 
          punch={selectedPunch}
          metals={metals}
          categories={categories}
          titres={titres}
          onClose={() => setSelectedPunch(null)}
        />
      )}
    </div>
  );
};
