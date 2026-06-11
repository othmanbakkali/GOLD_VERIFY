import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Punch, DocumentLegal } from '../types';
import { 
  ShieldAlert, 
  Plus, 
  Edit, 
  Trash2, 
  History, 
  FileText, 
  Award,
  CheckCircle,
  X,
  UserCheck
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { 
    punches, 
    metals, 
    categories, 
    titres, 
    documents, 
    logs, 
    currentRole,
    userEmail,
    addPunch,
    updatePunch,
    deletePunch,
    addDocument,
    updateDocument,
    deleteDocument,
    clearLogs
  } = useApp();

  // Selected admin action tab: 'punches' | 'docs' | 'logs'
  const [adminTab, setAdminTab] = useState<'punches' | 'docs' | 'logs'>('punches');

  // Form states - Punch
  const [showPunchForm, setShowPunchForm] = useState(false);
  const [editingPunchId, setEditingPunchId] = useState<string | null>(null);
  const [punchRef, setPunchRef] = useState('');
  const [punchNom, setPunchNom] = useState('');
  const [punchDesc, setPunchDesc] = useState('');
  const [punchMetal, setPunchMetal] = useState('');
  const [punchTitre, setPunchTitre] = useState('');
  const [punchCat, setPunchCat] = useState('');
  const [punchDate, setPunchDate] = useState(new Date().toISOString().split('T')[0]);
  const [punchImage, setPunchImage] = useState('poisson');
  const [punchPlaceDiff, setPunchPlaceDiff] = useState('');
  const [punchDiffInfo, setPunchDiffInfo] = useState('');

  // Form states - Document
  const [showDocForm, setShowDocForm] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [docTitre, setDocTitre] = useState('');
  const [docDesc, setDocDesc] = useState('');
  const [docContenu, setDocContenu] = useState('');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);

  // Check role permission
  const isAuthorized = currentRole === 'ADMIN' || currentRole === 'EXPERT';

  if (!isAuthorized) {
    return (
      <div style={{ padding: '20px' }}>
        <div className="glass-panel" style={{ 
          textAlign: 'center', 
          padding: '40px 20px', 
          borderColor: 'rgba(239, 68, 68, 0.3)', 
          background: 'rgba(239, 68, 68, 0.03)' 
        }}>
          <ShieldAlert size={40} style={{ color: '#EF4444', marginBottom: '15px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FCA5A5' }}>Accès Administrateur Restreint</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: '1.4' }}>
            Vous êtes connecté en tant que <strong>{currentRole}</strong>. La modification du catalogue douanier est réservée aux Administrateurs et aux Experts.
          </p>
          <div style={{ 
            marginTop: '20px', 
            padding: '12px', 
            background: 'var(--bg-tertiary)', 
            borderRadius: '12px',
            fontSize: '0.75rem',
            color: 'var(--gold-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'center'
          }}>
            <UserCheck size={14} />
            <span>Activez le rôle "Administrateur" ou "Expert" dans l'en-tête pour déverrouiller.</span>
          </div>
        </div>
      </div>
    );
  }

  // --- CRUD PUNCH METHODS ---
  const handleOpenAddPunch = () => {
    setEditingPunchId(null);
    setPunchRef('');
    setPunchNom('');
    setPunchDesc('');
    setPunchMetal(metals[0]?.id || '');
    setPunchTitre(titres[0]?.id || '');
    setPunchCat(categories[0]?.id || '');
    setPunchDate(new Date().toISOString().split('T')[0]);
    setPunchImage('poisson');
    setPunchPlaceDiff('');
    setPunchDiffInfo('Casablanca (sans lettre), Fès (lettre F), Marrakech (lettre M), Agadir (lettre A), Tanger (lettre T).');
    setShowPunchForm(true);
  };

  const handleOpenEditPunch = (punch: Punch) => {
    setEditingPunchId(punch.id);
    setPunchRef(punch.reference);
    setPunchNom(punch.nom);
    setPunchDesc(punch.description);
    setPunchMetal(punch.metalId);
    setPunchTitre(punch.titreId || '');
    setPunchCat(punch.categorieId);
    setPunchDate(punch.dateVigueur);
    setPunchImage(punch.image);
    setPunchPlaceDiff(punch.placeDifferent || '');
    setPunchDiffInfo(punch.differentInfo || '');
    setShowPunchForm(true);
  };

  const handleSavePunchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!punchRef || !punchNom || !punchMetal || !punchCat) return;

    const punchPayload = {
      reference: punchRef,
      nom: punchNom,
      description: punchDesc,
      metalId: punchMetal,
      titreId: punchTitre || undefined,
      categorieId: punchCat,
      dateVigueur: punchDate,
      image: punchImage,
      placeDifferent: punchPlaceDiff || undefined,
      differentInfo: punchDiffInfo || undefined,
      legalRef: 'Dahir N° 1.77.340'
    };

    if (editingPunchId) {
      updatePunch(editingPunchId, punchPayload);
    } else {
      addPunch(punchPayload);
    }
    setShowPunchForm(false);
  };

  // --- CRUD DOCUMENT METHODS ---
  const handleOpenAddDoc = () => {
    setEditingDocId(null);
    setDocTitre('');
    setDocDesc('');
    setDocContenu('');
    setDocDate(new Date().toISOString().split('T')[0]);
    setShowDocForm(true);
  };

  const handleOpenEditDoc = (doc: DocumentLegal) => {
    setEditingDocId(doc.id);
    setDocTitre(doc.titre);
    setDocDesc(doc.description);
    setDocContenu(doc.contenu);
    setDocDate(doc.datePublication);
    setShowDocForm(true);
  };

  const handleSaveDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitre || !docContenu) return;

    const docPayload = {
      titre: docTitre,
      description: docDesc,
      contenu: docContenu,
      datePublication: docDate
    };

    if (editingDocId) {
      updateDocument(editingDocId, docPayload);
    } else {
      addDocument(docPayload);
    }
    setShowDocForm(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Admin Panel Subtitle Header */}
      <div className="glass-panel" style={{ padding: '15px', marginBottom: '15px' }}>
        <h3 className="glass-panel-title">
          <ShieldAlert size={16} style={{ color: 'var(--gold-primary)' }} />
          Console d'Administration
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Authentifié en tant que : <strong>{userEmail} ({currentRole})</strong>
        </span>
      </div>

      {/* Admin Subtabs Switcher */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
        <button 
          className={`chip ${adminTab === 'punches' ? 'active' : ''}`}
          onClick={() => setAdminTab('punches')}
          style={{ fontSize: '0.75rem', padding: '6px 12px' }}
        >
          <Award size={12} style={{ marginRight: '4px' }} />
          Poinçons
        </button>
        <button 
          className={`chip ${adminTab === 'docs' ? 'active' : ''}`}
          onClick={() => setAdminTab('docs')}
          style={{ fontSize: '0.75rem', padding: '6px 12px' }}
        >
          <FileText size={12} style={{ marginRight: '4px' }} />
          Lois
        </button>
        <button 
          className={`chip ${adminTab === 'logs' ? 'active' : ''}`}
          onClick={() => setAdminTab('logs')}
          style={{ fontSize: '0.75rem', padding: '6px 12px' }}
        >
          <History size={12} style={{ marginRight: '4px' }} />
          Logs d'Audit
        </button>
      </div>

      {/* --- PANEL 1 : HALLMARKS CRUD --- */}
      {adminTab === 'punches' && (
        <>
          {!showPunchForm ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn btn-emerald" onClick={handleOpenAddPunch} style={{ width: '100%' }}>
                <Plus size={16} />
                <span>Nouveau Poinçon</span>
              </button>

              <div className="glass-panel" style={{ padding: '0px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '12px' }}>Réf</th>
                      <th style={{ padding: '12px' }}>Nom</th>
                      <th style={{ padding: '12px' }}>Métal</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {punches.map((p) => {
                      const metalObj = metals.find(m => m.id === p.metalId);
                      return (
                        <tr key={p.id} style={{ 
                          borderBottom: '1px solid var(--border-glass)',
                          opacity: p.actif ? 1 : 0.4
                        }}>
                          <td style={{ padding: '12px', fontWeight: 600 }}>{p.reference}</td>
                          <td style={{ padding: '12px' }}>
                            <div>{p.nom}</div>
                            {!p.actif && <span style={{ fontSize: '0.65rem', color: '#EF4444' }}>(Désactivé)</span>}
                          </td>
                          <td style={{ padding: '12px' }}>{metalObj?.nom}</td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <button 
                                className="btn btn-secondary" 
                                style={{ padding: '5px', borderRadius: '8px' }}
                                onClick={() => handleOpenEditPunch(p)}
                              >
                                <Edit size={12} />
                              </button>
                              {p.actif && (
                                <button 
                                  className="btn btn-secondary" 
                                  style={{ padding: '5px', borderRadius: '8px', color: '#EF4444' }}
                                  onClick={() => {
                                    if (confirm(`Désactiver le poinçon ${p.nom} ?`)) {
                                      deletePunch(p.id);
                                    }
                                  }}
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // Add/Edit Form Punch
            <div className="glass-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>
                  {editingPunchId ? 'Modifier le Poinçon' : 'Ajouter un Poinçon'}
                </h4>
                <button className="modal-close-btn" style={{ position: 'static' }} onClick={() => setShowPunchForm(false)}>
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSavePunchSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="input-group">
                    <label className="input-label">Référence (ex: Fig. 14)</label>
                    <input type="text" value={punchRef} onChange={e => setPunchRef(e.target.value)} required className="input-field" />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Nom du poinçon</label>
                    <input type="text" value={punchNom} onChange={e => setPunchNom(e.target.value)} required className="input-field" />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Description visuelle et technique</label>
                  <textarea value={punchDesc} onChange={e => setPunchDesc(e.target.value)} rows={3} className="input-field" style={{ resize: 'vertical' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="input-group">
                    <label className="input-label">Métal précieux</label>
                    <select value={punchMetal} onChange={e => setPunchMetal(e.target.value)} required className="input-field select-field">
                      {metals.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Catégorie</label>
                    <select value={punchCat} onChange={e => setPunchCat(e.target.value)} required className="input-field select-field">
                      {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="input-group">
                    <label className="input-label">Titre légal (Optionnel)</label>
                    <select value={punchTitre} onChange={e => setPunchTitre(e.target.value)} className="input-field select-field">
                      <option value="">Aucun titre numérique</option>
                      {titres.map(t => <option key={t.id} value={t.id}>{t.valeur}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Emplacement du différent</label>
                    <input type="text" value={punchPlaceDiff} onChange={e => setPunchPlaceDiff(e.target.value)} placeholder="ex: Sous le corps" className="input-field" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="input-group">
                    <label className="input-label">Date de vigueur</label>
                    <input type="date" value={punchDate} onChange={e => setPunchDate(e.target.value)} required className="input-field" />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Illustration vectorielle</label>
                    <select value={punchImage} onChange={e => setPunchImage(e.target.value)} className="input-field select-field">
                      <option value="poisson">Poisson (Platine)</option>
                      <option value="mulet-1">Mulet 1er Titre (Or)</option>
                      <option value="mulet-2">Mulet 2ème Titre (Or)</option>
                      <option value="mulet-3">Mulet 3ème Titre (Or)</option>
                      <option value="gazelle">Gazelle (Or)</option>
                      <option value="papillon">Papillon (Or)</option>
                      <option value="vache-1">Vache 1er Titre (Argent)</option>
                      <option value="vache-2">Vache 2ème Titre (Argent)</option>
                      <option value="belier">Bélier (Argent)</option>
                      <option value="vautour">Vautour (Argent)</option>
                      <option value="palme">Palme (Recence)</option>
                      <option value="hibou">Hibou (Hors Titre)</option>
                      <option value="vase">Vase (Objets d'Art)</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Détails des différents régionaux</label>
                  <textarea value={punchDiffInfo} onChange={e => setPunchDiffInfo(e.target.value)} rows={2} className="input-field" />
                </div>

                <button type="submit" className="btn btn-emerald" style={{ width: '100%', marginTop: '10px' }}>
                  <CheckCircle size={16} />
                  <span>Enregistrer le Poinçon</span>
                </button>
              </form>
            </div>
          )}
        </>
      )}

      {/* --- PANEL 2 : LEGAL DOCUMENTS CRUD --- */}
      {adminTab === 'docs' && (
        <>
          {!showDocForm ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn btn-emerald" onClick={handleOpenAddDoc} style={{ width: '100%' }}>
                <Plus size={16} />
                <span>Nouveau Texte Légal</span>
              </button>

              {documents.map((doc) => (
                <div key={doc.id} className="glass-panel" style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <FileText size={18} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                      <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700 }}>{doc.titre}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{doc.description}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-secondary" style={{ padding: '6px' }} onClick={() => handleOpenEditDoc(doc)}>
                        <Edit size={12} />
                      </button>
                      <button className="btn btn-secondary" style={{ padding: '6px', color: '#EF4444' }} onClick={() => {
                        if (confirm(`Supprimer définitivement le document : ${doc.titre} ?`)) {
                          deleteDocument(doc.id);
                        }
                      }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Add/Edit Form Document
            <div className="glass-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>
                  {editingDocId ? 'Modifier la Loi' : 'Ajouter un Document Juridique'}
                </h4>
                <button className="modal-close-btn" style={{ position: 'static' }} onClick={() => setShowDocForm(false)}>
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveDocSubmit}>
                <div className="input-group">
                  <label className="input-label">Titre du document légal</label>
                  <input type="text" value={docTitre} onChange={e => setDocTitre(e.target.value)} required className="input-field" />
                </div>

                <div className="input-group">
                  <label className="input-label">Description synthétique</label>
                  <input type="text" value={docDesc} onChange={e => setDocDesc(e.target.value)} className="input-field" />
                </div>

                <div className="input-group">
                  <label className="input-label">Date de publication</label>
                  <input type="date" value={docDate} onChange={e => setDocDate(e.target.value)} className="input-field" />
                </div>

                <div className="input-group">
                  <label className="input-label">Contenu réglementaire intégral</label>
                  <textarea value={docContenu} onChange={e => setDocContenu(e.target.value)} rows={6} required className="input-field" style={{ resize: 'vertical' }} />
                </div>

                <button type="submit" className="btn btn-emerald" style={{ width: '100%', marginTop: '10px' }}>
                  <CheckCircle size={16} />
                  <span>Enregistrer le Document</span>
                </button>
              </form>
            </div>
          )}
        </>
      )}

      {/* --- PANEL 3 : AUDIT LOGS VIEW --- */}
      {adminTab === 'logs' && (
        <div className="glass-panel" style={{ padding: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <History size={16} style={{ color: 'var(--gold-primary)' }} />
              Journal des Opérations Douanières
            </h4>
            {logs.length > 0 && (
              <button 
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.7rem', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                onClick={() => {
                  if (confirm('Vider l\'historique d\'audit ?')) {
                    clearLogs();
                  }
                }}
              >
                Vider
              </button>
            )}
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {logs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Aucune entrée de journal disponible.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} style={{ 
                  padding: '10px 0', 
                  borderBottom: '1px solid var(--border-glass)',
                  fontSize: '0.78rem',
                  lineHeight: '1.4'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ 
                      fontWeight: 700, 
                      color: log.action === 'CREATE' ? 'var(--emerald-light)' : log.action === 'UPDATE' ? 'var(--gold-primary)' : '#EF4444'
                    }}>
                      {log.action} • {log.entityType} ({log.entityName})
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                      {new Date(log.timestamp).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-primary)' }}>{log.details}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '2px', display: 'flex', gap: '8px' }}>
                    <span>Utilisateur : {log.userEmail}</span>
                    <span>Role : {log.userRole}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
