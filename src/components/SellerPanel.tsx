import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PunchVector } from './PunchVector';
import { 
  Calculator, 
  FileCheck, 
  Printer, 
  Coins, 
  Sparkles, 
  User, 
  Calendar,
  FileText
} from 'lucide-react';

export const SellerPanel: React.FC = () => {
  const { punches, bureaux } = useApp();


  // Metal pricing database defaults (DH per gram)
  const defaultRates: Record<string, number> = {
    't-or-750': 640,  // 18K
    't-or-840': 710,  // 20K
    't-or-920': 780,  // 22K
    't-argent-800': 12,
    't-argent-950': 15,
    't-platine-950': 380,
  };

  // State for Calculator
  const [calcMetal, setCalcMetal] = useState('t-or-750');
  const [calcWeight, setCalcWeight] = useState<number>(10);
  const [calcRate, setCalcRate] = useState<number>(640);
  const [calcLabor, setCalcLabor] = useState<number>(30); // DH per gram labor fee
  const [calcResult, setCalcResult] = useState({
    metalValue: 0,
    laborValue: 0,
    guaranteeFee: 0,
    total: 0
  });

  // State for Certificate Generator
  const [certClient, setCertClient] = useState('');
  const [certJewelType, setCertJewelType] = useState('Bague');
  const [certMetal, setCertMetal] = useState('t-or-750');
  const [certWeight, setCertWeight] = useState<number>(10);
  const [certPunch, setCertPunch] = useState<string>('');
  const [certBureau, setCertBureau] = useState('b-casablanca');
  const [certId, setCertId] = useState('');
  const [certDate, setCertDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCertificate, setShowCertificate] = useState(false);

  // Sync Rate when calculator metal changes
  useEffect(() => {
    if (defaultRates[calcMetal]) {
      setCalcRate(defaultRates[calcMetal]);
    }
  }, [calcMetal]);

  // Perform Pricing Calculation
  useEffect(() => {
    const metalValue = calcWeight * calcRate;
    const laborValue = calcWeight * calcLabor;
    
    // Official guarantee fees (mocked logic based on Moroccan tax: gold is ~10DH/g, silver ~2DH/g, plat ~15DH/g)
    let feePerGram = 2;
    if (calcMetal.includes('or')) feePerGram = 10;
    else if (calcMetal.includes('platine')) feePerGram = 15;
    
    const guaranteeFee = calcWeight * feePerGram;
    const total = metalValue + laborValue + guaranteeFee;

    setCalcResult({
      metalValue,
      laborValue,
      guaranteeFee,
      total
    });
  }, [calcMetal, calcWeight, calcRate, calcLabor]);

  // Handle Certificate ID auto-generation
  useEffect(() => {
    // Generate unique serial number (e.g. CERT-20260611-XYZ7)
    const dateStr = certDate.replace(/-/g, '');
    const randStr = Math.random().toString(36).substr(2, 4).toUpperCase();
    setCertId(`MA-${dateStr}-${randStr}`);
  }, [certDate, showCertificate]);

  // Set default punch based on metal selection in certificate
  useEffect(() => {
    let metalId = 'm-or';
    if (certMetal.includes('argent')) metalId = 'm-argent';
    else if (certMetal.includes('platine')) metalId = 'm-platine';

    const matchingPunches = punches.filter(p => p.metalId === metalId && p.actif);
    if (matchingPunches.length > 0) {
      setCertPunch(matchingPunches[0].id);
    }
  }, [certMetal, punches]);

  const activePunches = punches.filter(p => p.actif);
  const selectedPunchObj = punches.find(p => p.id === certPunch);
  const selectedBureauObj = bureaux.find(b => b.id === certBureau);

  // Helper to determine metal badge color
  const getMetalColor = (titleId: string) => {
    if (titleId.includes('or')) return 'var(--gold-primary)';
    if (titleId.includes('argent')) return '#CCCCCC';
    return 'var(--emerald-light)';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ 
        background: 'linear-gradient(135deg, rgba(25, 35, 58, 0.7), rgba(212, 175, 55, 0.15))',
        borderColor: 'var(--gold-primary)',
        marginBottom: '15px'
      }}>
        <h3 className="glass-panel-title">
          <Sparkles size={16} style={{ color: 'var(--gold-primary)' }} />
          Espace Vendeur &amp; Joaillier
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Accédez à vos outils de facturation certifiés et générez des attestations d'authenticité pour vos clients.
        </p>
      </div>

      {/* Pricing Calculator Card */}
      <div className="glass-panel">
        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calculator size={16} style={{ color: 'var(--gold-primary)' }} />
          Calculateur de Titre &amp; Prix d'Or / Argent
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="input-group">
            <label className="input-label">Métal &amp; Titre Légal</label>
            <select 
              value={calcMetal} 
              onChange={e => setCalcMetal(e.target.value)} 
              className="input-field select-field"
              style={{ fontSize: '0.8rem' }}
            >
              <option value="t-or-920">Or 22 Carats (920‰)</option>
              <option value="t-or-840">Or 20 Carats (840‰)</option>
              <option value="t-or-750">Or 18 Carats (750‰)</option>
              <option value="t-argent-950">Argent 1er Titre (950‰)</option>
              <option value="t-argent-800">Argent 2ème Titre (800‰)</option>
              <option value="t-platine-950">Platine (950‰)</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Poids (en grammes)</label>
            <input 
              type="number" 
              value={calcWeight} 
              onChange={e => setCalcWeight(Math.max(0, parseFloat(e.target.value) || 0))}
              className="input-field" 
              style={{ fontSize: '0.8rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="input-group">
            <label className="input-label">Cours du Métal (DH/g)</label>
            <input 
              type="number" 
              value={calcRate} 
              onChange={e => setCalcRate(Math.max(0, parseFloat(e.target.value) || 0))}
              className="input-field" 
              style={{ fontSize: '0.8rem' }}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Façon &amp; Façonnage (DH/g)</label>
            <input 
              type="number" 
              value={calcLabor} 
              onChange={e => setCalcLabor(Math.max(0, parseFloat(e.target.value) || 0))}
              className="input-field" 
              style={{ fontSize: '0.8rem' }}
            />
          </div>
        </div>

        {/* Calculation Result Display */}
        <div style={{ 
          background: 'var(--bg-primary)', 
          borderRadius: '12px', 
          padding: '12px 15px', 
          marginTop: '10px',
          border: '1px solid var(--border-glass)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', paddingBottom: '6px', borderBottom: '1px dashed var(--border-glass)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Valeur pure du métal :</span>
            <span style={{ fontWeight: 600 }}>{calcResult.metalValue.toLocaleString()} DH</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', padding: '6px 0', borderBottom: '1px dashed var(--border-glass)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Frais de façon (main d'œuvre) :</span>
            <span style={{ fontWeight: 600 }}>{calcResult.laborValue.toLocaleString()} DH</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', padding: '6px 0', borderBottom: '1px solid var(--border-glass)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Droits d'essais &amp; garantie (État) :</span>
            <span style={{ fontWeight: 600 }}>{calcResult.guaranteeFee.toLocaleString()} DH</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', paddingTop: '8px', fontWeight: 800 }}>
            <span style={{ color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Coins size={14} /> Total Estimé TTC :
            </span>
            <span style={{ color: 'var(--gold-primary)' }}>{calcResult.total.toLocaleString()} DH</span>
          </div>
        </div>
      </div>

      {/* Certificate Generator Card */}
      <div className="glass-panel">
        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={16} style={{ color: 'var(--gold-primary)' }} />
          Générateur d'Attestation de Garantie Officielle
        </h4>

        <div className="input-group">
          <label className="input-label">Nom du Client</label>
          <div style={{ position: 'relative' }}>
            <User size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              value={certClient}
              onChange={e => setCertClient(e.target.value)}
              placeholder="ex: M. Rachid IDRISSI"
              className="input-field" 
              style={{ paddingLeft: '36px', fontSize: '0.8rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="input-group">
            <label className="input-label">Type d'Ouvrage</label>
            <select 
              value={certJewelType} 
              onChange={e => setCertJewelType(e.target.value)} 
              className="input-field select-field"
              style={{ fontSize: '0.8rem' }}
            >
              <option value="Bague">Bague</option>
              <option value="Collier">Collier</option>
              <option value="Bracelet">Bracelet</option>
              <option value="Pendentif">Pendentif</option>
              <option value="Alliances">Alliances</option>
              <option value="Boucles d'oreilles">Boucles d'oreilles</option>
              <option value="Parure">Parure Complète</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Métal &amp; Titre Légal</label>
            <select 
              value={certMetal} 
              onChange={e => setCertMetal(e.target.value)} 
              className="input-field select-field"
              style={{ fontSize: '0.8rem' }}
            >
              <option value="t-or-920">Or 22K (920‰)</option>
              <option value="t-or-840">Or 20K (840‰)</option>
              <option value="t-or-750">Or 18K (750‰)</option>
              <option value="t-argent-950">Argent 1er Titre (950‰)</option>
              <option value="t-argent-800">Argent 2e Titre (800‰)</option>
              <option value="t-platine-950">Platine (950‰)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="input-group">
            <label className="input-label">Poids Certifié (g)</label>
            <input 
              type="number" 
              value={certWeight} 
              onChange={e => setCertWeight(Math.max(0, parseFloat(e.target.value) || 0))}
              className="input-field" 
              style={{ fontSize: '0.8rem' }}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Date d'Émission</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 5 }} />
              <input 
                type="date" 
                value={certDate}
                onChange={e => setCertDate(e.target.value)}
                className="input-field" 
                style={{ paddingLeft: '36px', fontSize: '0.8rem' }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="input-group">
            <label className="input-label">Poinçon d'État Apposé</label>
            <select 
              value={certPunch} 
              onChange={e => setCertPunch(e.target.value)} 
              className="input-field select-field"
              style={{ fontSize: '0.8rem' }}
            >
              {activePunches
                .filter(p => {
                  let reqMetalId = 'm-or';
                  if (certMetal.includes('argent')) reqMetalId = 'm-argent';
                  else if (certMetal.includes('platine')) reqMetalId = 'm-platine';
                  return p.metalId === reqMetalId;
                })
                .map(p => (
                  <option key={p.id} value={p.id}>{p.nom} ({p.reference})</option>
                ))
              }
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Bureau de Garantie</label>
            <select 
              value={certBureau} 
              onChange={e => setCertBureau(e.target.value)} 
              className="input-field select-field"
              style={{ fontSize: '0.8rem' }}
            >
              {bureaux.map(b => (
                <option key={b.id} value={b.id}>{b.nom}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          className="btn btn-emerald" 
          style={{ width: '100%', marginTop: '10px' }}
          onClick={() => {
            if (!certClient.trim()) {
              alert('Veuillez renseigner le nom du client.');
              return;
            }
            setShowCertificate(true);
          }}
        >
          <FileCheck size={16} />
          <span>Générer l'Attestation d'Authenticité</span>
        </button>
      </div>

      {/* GORGEOUS PRINTABLE CERTIFICATE MODAL */}
      {showCertificate && selectedPunchObj && selectedBureauObj && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.9)' }}>
          <div className="modal-content" style={{ 
            maxWidth: '480px', 
            padding: '30px', 
            background: '#0B0F19',
            borderColor: 'var(--gold-primary)',
            boxShadow: '0 0 35px var(--gold-glow)'
          }}>
            {/* Close modal */}
            <button 
              className="modal-close-btn no-print" 
              onClick={() => setShowCertificate(false)}
              style={{ top: '20px', right: '20px' }}
            >
              X
            </button>

            {/* Certificate Header Design */}
            <div className="certificate-body" style={{
              border: '3px double var(--gold-primary)',
              padding: '20px 15px',
              borderRadius: '12px',
              textAlign: 'center',
              backgroundColor: 'rgba(15, 21, 36, 0.95)',
              position: 'relative'
            }}>
              
              {/* Corner Ornaments */}
              <div style={{ position: 'absolute', top: '5px', left: '5px', color: 'var(--gold-primary)', fontSize: '0.9rem', opacity: 0.8 }}>♦</div>
              <div style={{ position: 'absolute', top: '5px', right: '5px', color: 'var(--gold-primary)', fontSize: '0.9rem', opacity: 0.8 }}>♦</div>
              <div style={{ position: 'absolute', bottom: '5px', left: '5px', color: 'var(--gold-primary)', fontSize: '0.9rem', opacity: 0.8 }}>♦</div>
              <div style={{ position: 'absolute', bottom: '5px', right: '5px', color: 'var(--gold-primary)', fontSize: '0.9rem', opacity: 0.8 }}>♦</div>

              <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600 }}>
                Royaume du Maroc
              </div>
              <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>
                Administration des Douanes et Impôts Indirects
              </div>
              
              <h3 style={{ 
                fontFamily: 'Georgia, serif',
                color: 'var(--gold-primary)', 
                fontSize: '1.1rem', 
                fontWeight: 800, 
                margin: '12px 0 3px 0',
                letterSpacing: '1px'
              }}>
                ATTESTATION DE GARANTIE D'ÉTAT
              </h3>
              <div style={{ width: '40%', height: '1px', background: 'var(--gold-primary)', margin: '0 auto 15px auto', opacity: 0.5 }} />

              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: '0 auto 15px auto', maxWidth: '340px' }}>
                Nous certifions que l'ouvrage de joaillerie décrit ci-dessous a été vérifié et revêtu du poinçon de garantie officiel de l'État marocain, certifiant le titre légal correspondant.
              </p>

              {/* Certificate Details */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '8px',
                textAlign: 'left', 
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                marginBottom: '15px'
              }}>
                <div style={{ display: 'flex' }}>
                  <span style={{ width: '130px', color: 'var(--text-secondary)' }}>N° Certificat :</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{certId}</span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span style={{ width: '130px', color: 'var(--text-secondary)' }}>Nom du Client :</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{certClient}</span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span style={{ width: '130px', color: 'var(--text-secondary)' }}>Ouvrage :</span>
                  <span style={{ color: 'var(--text-primary)' }}>{certJewelType}</span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span style={{ width: '130px', color: 'var(--text-secondary)' }}>Métal &amp; Titre :</span>
                  <span style={{ fontWeight: 600, color: getMetalColor(certMetal) }}>
                    {certMetal === 't-or-920' ? 'Or 22K (920‰)' : 
                     certMetal === 't-or-840' ? 'Or 20K (840‰)' : 
                     certMetal === 't-or-750' ? 'Or 18K (750‰)' : 
                     certMetal === 't-argent-950' ? 'Argent 1er Titre (950‰)' : 
                     certMetal === 't-argent-800' ? 'Argent 2e Titre (800‰)' : 'Platine (950‰)'}
                  </span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span style={{ width: '130px', color: 'var(--text-secondary)' }}>Poids Certifié :</span>
                  <span style={{ color: 'var(--text-primary)' }}>{certWeight} g</span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span style={{ width: '130px', color: 'var(--text-secondary)' }}>Bureau de Garantie :</span>
                  <span style={{ color: 'var(--text-primary)' }}>{selectedBureauObj.nom}</span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span style={{ width: '130px', color: 'var(--text-secondary)' }}>Date d'émission :</span>
                  <span style={{ color: 'var(--text-primary)' }}>{new Date(certDate).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* Graphic Display of Hallmark applied */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center', margin: '20px 0' }}>
                <div style={{ 
                  width: '74px', 
                  height: '74px', 
                  background: 'linear-gradient(135deg, rgba(8,11,17,0.9), rgba(212,175,55,0.05))',
                  borderRadius: '12px',
                  border: '1.5px solid var(--gold-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(212,175,55,0.15)'
                }}>
                  <PunchVector name={selectedPunchObj.image} style={{ width: '54px', height: '54px', color: getMetalColor(certMetal) }} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Poinçon de Garantie :</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gold-primary)' }}>{selectedPunchObj.nom}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '200px' }}>
                    Différent régional : <strong>{selectedBureauObj.lettreDifferent === 'Aucune' ? 'Aucune lettre' : `Lettre "${selectedBureauObj.lettreDifferent}"`}</strong> ({selectedPunchObj.placeDifferent})
                  </div>
                </div>
              </div>

              {/* Official Seal / Signature Simulation */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-end', 
                marginTop: '25px', 
                fontSize: '0.65rem',
                padding: '0 15px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Le Joaillier Vendeur</div>
                  <div style={{ fontStyle: 'italic', fontFamily: 'Cursive, serif', color: 'var(--text-primary)', marginTop: '10px' }}>Signé</div>
                </div>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '50%', 
                  border: '2px dashed var(--gold-primary)', 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--gold-primary)',
                  fontSize: '0.42rem',
                  fontWeight: 'bold',
                  lineHeight: '1.2',
                  transform: 'rotate(-10deg)',
                  opacity: 0.8
                }}>
                  <span>GARANTIE</span>
                  <span>DOUANE</span>
                  <span>MAROC</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Contrôleur de la Douane</div>
                  <div style={{ fontStyle: 'italic', fontFamily: 'Cursive, serif', color: 'var(--emerald-light)', marginTop: '10px' }}>Certifié Conforme</div>
                </div>
              </div>

            </div>

            {/* Print and Close controls */}
            <div className="no-print" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="btn btn-emerald" style={{ flexGrow: 1 }} onClick={handlePrint}>
                <Printer size={16} />
                <span>Imprimer l'Attestation</span>
              </button>
              <button className="btn btn-secondary" onClick={() => setShowCertificate(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
