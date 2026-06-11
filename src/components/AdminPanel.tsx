import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Punch, DocumentLegal, UserRole } from '../types';
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
  UserCheck,
  ShieldCheck,
  Users,
  Key
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
    clearLogs,
    permissionsGrid,
    userAccounts,
    updateRolePermissions,
    addUserAccount,
    updateUserAccount,
    deleteUserAccount
  } = useApp();

  // Selected admin action tab: 'punches' | 'docs' | 'logs' | 'security'
  const [adminTab, setAdminTab] = useState<'punches' | 'docs' | 'logs' | 'security'>('punches');

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

  // Form states - User Account CRUD
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userNom, setUserNom] = useState('');
  const [userEmailInput, setUserEmailInput] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRoleInput, setUserRoleInput] = useState<UserRole>('AGENT');

  // Check role permissions dynamically
  const activePermissions = permissionsGrid.find(p => p.role === currentRole) || {
    admin: false,
    managePunches: false,
    manageDocuments: false,
    viewLogs: false,
    managePermissions: false
  };

  const isAuthorized = activePermissions.admin;

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
            Vous êtes connecté avec le profil <strong>{currentRole}</strong>. La console d'administration est réservée aux profils disposant de la permission d'accès administrative.
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
            <span>Veuillez vous connecter avec un compte autorisé pour déverrouiller.</span>
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
      <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', overflowX: 'auto', paddingBottom: '5px' }}>
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
        {activePermissions.viewLogs && (
          <button 
            className={`chip ${adminTab === 'logs' ? 'active' : ''}`}
            onClick={() => setAdminTab('logs')}
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
          >
            <History size={12} style={{ marginRight: '4px' }} />
            Logs d'Audit
          </button>
        )}
        {activePermissions.managePermissions && (
          <button 
            className={`chip ${adminTab === 'security' ? 'active' : ''}`}
            onClick={() => setAdminTab('security')}
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
          >
            <ShieldCheck size={12} style={{ marginRight: '4px' }} />
            Sécurité &amp; Accès
          </button>
        )}
      </div>

      {/* --- PANEL 1 : HALLMARKS CRUD --- */}
      {adminTab === 'punches' && (
        <>
          {!showPunchForm ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activePermissions.managePunches && (
                <button className="btn btn-emerald" onClick={handleOpenAddPunch} style={{ width: '100%' }}>
                  <Plus size={16} />
                  <span>Nouveau Poinçon</span>
                </button>
              )}

              <div className="glass-panel" style={{ padding: '0px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '12px' }}>Réf</th>
                      <th style={{ padding: '12px' }}>Nom</th>
                      <th style={{ padding: '12px' }}>Métal</th>
                      {activePermissions.managePunches && (
                        <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                      )}
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
                          {activePermissions.managePunches && (
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
                          )}
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
              {activePermissions.manageDocuments && (
                <button className="btn btn-emerald" onClick={handleOpenAddDoc} style={{ width: '100%' }}>
                  <Plus size={16} />
                  <span>Nouveau Texte Légal</span>
                </button>
              )}

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
                    {activePermissions.manageDocuments && (
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
                    )}
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
      {adminTab === 'logs' && activePermissions.viewLogs && (
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
                      color: log.action === 'CREATE' ? 'var(--emerald-light)' : 
                             log.action === 'UPDATE' ? 'var(--gold-primary)' : 
                             log.action === 'DELETE' ? '#EF4444' : 'var(--text-primary)'
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

      {/* --- PANEL 4 : SECURITY & ACCESS CONTROL --- */}
      {adminTab === 'security' && activePermissions.managePermissions && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Permissions Matrix */}
          <div className="glass-panel" style={{ padding: '15px', overflowX: 'auto' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--gold-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={16} />
              Configuration des Accès &amp; Rôles
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>
              Cochez les droits d'accès et d'action autorisés pour chaque profil utilisateur en temps réel.
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '8px' }}>Droit / Permission</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>ADMIN</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>EXPERT</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>AGENT</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>VENDEUR</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>PUBLIC</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { key: 'dashboard', label: 'Accès Accueil (Dashboard)' },
                  { key: 'catalog', label: 'Accès Catalogue' },
                  { key: 'scanner', label: 'Accès Scanner IA' },
                  { key: 'map', label: 'Accès Carte Bureaux' },
                  { key: 'admin', label: 'Accès Console Admin' },
                  { key: 'managePunches', label: 'Modifier Poinçons (CRUD)' },
                  { key: 'manageDocuments', label: 'Modifier Textes Lois (CRUD)' },
                  { key: 'viewLogs', label: 'Visualiser Logs d\'Audit' },
                  { key: 'managePermissions', label: 'Gérer Permissions (Sécurité)' }
                ].map((perm) => (
                  <tr key={perm.key} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '8px 4px', fontWeight: 600 }}>{perm.label}</td>
                    {['ADMIN', 'EXPERT', 'AGENT', 'VENDEUR', 'PUBLIC'].map((r) => {
                      const roleObj = permissionsGrid.find(p => p.role === r);
                      const isChecked = roleObj ? (roleObj as any)[perm.key] : false;
                      const isDisabled = r === 'ADMIN' && perm.key === 'managePermissions';
                      
                      return (
                        <td key={r} style={{ padding: '8px', textAlign: 'center' }}>
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            disabled={isDisabled}
                            onChange={(e) => {
                              updateRolePermissions(r as UserRole, { [perm.key]: e.target.checked });
                            }}
                            style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* User Accounts Management */}
          <div className="glass-panel" style={{ padding: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} />
                Comptes Utilisateurs
              </h4>
              {!showUserForm && (
                <button 
                  className="btn btn-emerald" 
                  style={{ padding: '6px 12px', fontSize: '0.7rem' }}
                  onClick={() => {
                    setEditingUserId(null);
                    setUserNom('');
                    setUserEmailInput('');
                    setUserPassword('');
                    setUserRoleInput('AGENT');
                    setShowUserForm(true);
                  }}
                >
                  <Plus size={12} />
                  Nouveau Compte
                </button>
              )}
            </div>

            {showUserForm ? (
              /* User Form */
              <div style={{ background: 'var(--bg-primary)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-glass)', marginBottom: '15px' }}>
                <h5 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px' }}>
                  {editingUserId ? 'Modifier l\'utilisateur' : 'Créer un utilisateur'}
                </h5>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!userNom || !userEmailInput || (!editingUserId && !userPassword)) return;
                  
                  const payload = {
                    nom: userNom,
                    email: userEmailInput,
                    role: userRoleInput,
                    ...(userPassword ? { password: userPassword } : {})
                  };

                  if (editingUserId) {
                    updateUserAccount(editingUserId, payload);
                  } else {
                    addUserAccount(payload);
                  }
                  setShowUserForm(false);
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.7rem' }}>Nom Complet</label>
                      <input type="text" value={userNom} onChange={e => setUserNom(e.target.value)} required className="input-field" style={{ padding: '8px 12px', fontSize: '0.75rem' }} />
                    </div>
                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.7rem' }}>Email</label>
                      <input type="email" value={userEmailInput} onChange={e => setUserEmailInput(e.target.value)} required className="input-field" style={{ padding: '8px 12px', fontSize: '0.75rem' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.7rem' }}>Mot de passe {editingUserId && '(optionnel)'}</label>
                      <input type="password" value={userPassword} onChange={e => setUserPassword(e.target.value)} required={!editingUserId} className="input-field" style={{ padding: '8px 12px', fontSize: '0.75rem' }} />
                    </div>
                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.7rem' }}>Rôle / Profil</label>
                      <select value={userRoleInput} onChange={e => setUserRoleInput(e.target.value as UserRole)} className="input-field select-field" style={{ padding: '8px 12px', fontSize: '0.75rem' }}>
                        <option value="ADMIN">Administrateur</option>
                        <option value="EXPERT">Expert</option>
                        <option value="AGENT">Agent</option>
                        <option value="VENDEUR">Vendeur</option>
                        <option value="PUBLIC">Public</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button type="submit" className="btn btn-emerald" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Enregistrer</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowUserForm(false)} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Annuler</button>
                  </div>
                </form>
              </div>
            ) : (
              /* Accounts List */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                {userAccounts.map((u) => (
                  <div key={u.id} style={{ 
                    padding: '10px', 
                    borderRadius: '12px', 
                    border: '1px solid var(--border-glass)',
                    background: 'var(--bg-primary)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.78rem'
                  }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{u.nom}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '2px' }}>
                        {u.email} • <strong style={{ color: 'var(--gold-primary)', fontSize: '0.68rem' }}>{u.role}</strong>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '5px', borderRadius: '8px' }}
                        onClick={() => {
                          setEditingUserId(u.id);
                          setUserNom(u.nom);
                          setUserEmailInput(u.email);
                          setUserPassword('');
                          setUserRoleInput(u.role);
                          setShowUserForm(true);
                        }}
                      >
                        <Edit size={12} />
                      </button>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '5px', borderRadius: '8px', color: '#EF4444' }}
                        onClick={() => {
                          if (userAccounts.length === 1) {
                            alert('Impossible de supprimer le dernier compte.');
                            return;
                          }
                          if (confirm(`Supprimer définitivement le compte de ${u.nom} ?`)) {
                            deleteUserAccount(u.id);
                          }
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
