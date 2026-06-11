import React from 'react';
import type { Punch, Metal, Categorie, Titre } from '../types';
import { PunchVector } from './PunchVector';
import { X, Calendar, FileText, MapPin, Check } from 'lucide-react';

interface PunchDetailsProps {
  punch: Punch;
  metals: Metal[];
  categories: Categorie[];
  titres: Titre[];
  onClose: () => void;
}

export const PunchDetails: React.FC<PunchDetailsProps> = ({
  punch,
  metals,
  categories,
  titres,
  onClose
}) => {
  const metal = metals.find(m => m.id === punch.metalId);
  const category = categories.find(c => c.id === punch.categorieId);
  const titre = titres.find(t => t.id === punch.titreId);

  // Get metal color class
  const getBadgeClass = (metalId: string) => {
    if (metalId === 'm-or') return 'badge-gold';
    if (metalId === 'm-argent') return 'badge-silver';
    if (metalId === 'm-platine') return 'badge-emerald';
    return 'badge-other';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Large Vector Image Representation */}
        <div className="detail-img-wrapper">
          <PunchVector name={punch.image} className="detail-vector" />
        </div>

        {/* Header Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
          <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>{punch.reference}</span>
          <span className={`badge ${getBadgeClass(punch.metalId)}`}>
            {metal?.nom}
          </span>
          {titre && (
            <span className="badge badge-gold" style={{ background: 'transparent' }}>
              {titre.valeur.split(' ')[0]}
            </span>
          )}
          {category && (
            <span className="badge badge-other" style={{ fontSize: '0.65rem' }}>
              {category.nom}
            </span>
          )}
        </div>

        <h2 className="detail-title">{punch.nom}</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
          {punch.description}
        </p>

        {/* Punch properties grid */}
        <div className="glass-panel" style={{ padding: '15px', marginBottom: '15px', background: 'var(--bg-glass-input)' }}>
          <div className="detail-row">
            <div className="detail-label">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={14} style={{ color: 'var(--gold-primary)' }} />
                <span>Base légale</span>
              </div>
            </div>
            <div className="detail-value"><strong>{punch.legalRef}</strong></div>
          </div>

          <div className="detail-row">
            <div className="detail-label">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} style={{ color: 'var(--gold-primary)' }} />
                <span>Vigueur</span>
              </div>
            </div>
            <div className="detail-value">{new Date(punch.dateVigueur).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>

          <div className="detail-row">
            <div className="detail-label">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} style={{ color: 'var(--gold-primary)' }} />
                <span>Emplacement Diff.</span>
              </div>
            </div>
            <div className="detail-value" style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>{punch.placeDifferent || 'Non spécifié'}</div>
          </div>
        </div>

        {/* Regional Markings Explanations */}
        {punch.differentInfo && (
          <div className="glass-panel" style={{ padding: '15px', border: '1px solid rgba(212, 175, 55, 0.15)', background: 'rgba(212, 175, 55, 0.02)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} />
              Différents Régionaux
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '8px' }}>
              {punch.differentInfo}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '0.7rem', color: 'var(--text-primary)' }}>
              <span style={{ padding: '2px 6px', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>Casablanca : Sans marque</span>
              <span style={{ padding: '2px 6px', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>Fès : Lettre "F"</span>
              <span style={{ padding: '2px 6px', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>Marrakech : Lettre "M"</span>
              <span style={{ padding: '2px 6px', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>Agadir : Lettre "A"</span>
              <span style={{ padding: '2px 6px', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>Tanger : Lettre "T"</span>
            </div>
          </div>
        )}

        {/* Verification Checkmark Banner */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Check size={12} style={{ color: 'var(--emerald-light)' }} />
            Données certifiées de l'Administration des Douanes marocaines
          </span>
        </div>
      </div>
    </div>
  );
};
