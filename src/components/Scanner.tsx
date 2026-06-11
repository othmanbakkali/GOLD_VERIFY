import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { Punch } from '../types';
import { simulateDetection } from '../utils/hallmarkDetector';
import type { DetectionResult } from '../utils/hallmarkDetector';
import { PunchVector } from './PunchVector';
import { PunchDetails } from './PunchDetails';
import { 
  Camera, 
  Upload, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Eye,
  Info
} from 'lucide-react';

export const Scanner: React.FC = () => {
  const { punches, metals, categories, titres } = useApp();
  
  // Camera state
  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Scan state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  
  // Selected Detail Modal
  const [selectedPunch, setSelectedPunch] = useState<Punch | null>(null);

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop camera feed when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    setImageSrc(null);
    setDetectionResult(null);
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("L'API de la caméra n'est pas disponible (requiert HTTPS).");
      }
      const constraints = {
        video: { facingMode: 'environment' } // Prefer back camera on mobiles
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
      }
    } catch (err: any) {
      console.error('Camera access failed:', err);
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        setCameraError("L'appareil photo nécessite une connexion HTTPS sécurisée (actuellement en HTTP). Veuillez tester sur la version publiée en ligne (GitHub Pages) ou utiliser le bouton 'Téléverser' pour prendre une photo.");
      } else {
        setCameraError("Impossible d'accéder à l'appareil photo. Assurez-vous d'avoir autorisé l'accès dans les paramètres du navigateur ou utilisez le bouton 'Téléverser' pour prendre une photo directement.");
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
  };

  // Capture snapshot from video
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImageSrc(dataUrl);
        stopCamera();
        runAnalysis('photo_capture.jpg');
      }
    }
  };

  // Trigger file upload dialog
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        stopCamera();
        runAnalysis(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI analysis
  const runAnalysis = async (fileName: string) => {
    setIsScanning(true);
    setDetectionResult(null);
    
    try {
      const result = await simulateDetection(fileName, punches);
      setDetectionResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  // Handle quick demo selection
  const selectDemo = (demoName: string) => {
    stopCamera();
    setImageSrc('demo'); // Mock status indicator
    runAnalysis(demoName);
  };

  const getMetalColor = (metalId: string) => {
    if (metalId === 'm-or') return 'var(--gold-primary)';
    if (metalId === 'm-argent') return '#CCCCCC';
    if (metalId === 'm-platine') return 'var(--emerald-light)';
    return 'var(--text-secondary)';
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="glass-panel" style={{ padding: '15px', marginBottom: '15px' }}>
        <h3 className="glass-panel-title">
          <Camera size={16} style={{ color: 'var(--gold-primary)' }} />
          Identification IA du Poinçon
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Prenez une photo rapprochée d'un poinçon de garantie pour l'identifier automatiquement grâce au moteur de vision.
        </p>
      </div>

      {/* Main Viewport Container */}
      <div className="scanner-viewport">
        {/* Live Video Feed */}
        {streamActive && (
          <>
            <video ref={videoRef} autoPlay playsInline className="scanner-video" />
            <div className="scanner-laser" />
            <div className="scanner-overlay-grid">
              <div className="scanner-target-box">
                <div className="scanner-corner corner-tl" />
                <div className="scanner-corner corner-tr" />
                <div className="scanner-corner corner-bl" />
                <div className="scanner-corner corner-br" />
              </div>
            </div>
          </>
        )}

        {/* Loading Scanning State */}
        {isScanning && (
          <div className="scanner-loader-container">
            <div className="spinner" />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Analyse d'image...</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Comparaison avec le registre douanier</p>
            </div>
            <div className="scanner-laser" />
          </div>
        )}

        {/* Placeholder / Upload Static Display */}
        {!streamActive && !isScanning && (
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '20px', 
            textAlign: 'center',
            background: 'radial-gradient(circle, rgba(23,32,54,0.8) 0%, rgba(8,11,17,1) 100%)'
          }}>
            {imageSrc ? (
              // Display captured or uploaded picture (or mock vector representation)
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {imageSrc === 'demo' && detectionResult ? (
                  <PunchVector name={detectionResult.punch.image} className="pulsate" style={{ width: '150px', height: '150px', strokeWidth: '1.5px', color: getMetalColor(detectionResult.punch.metalId) }} />
                ) : (
                  <img src={imageSrc} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '12px', objectFit: 'contain' }} />
                )}

                {/* Overlaid bounding box on success */}
                {detectionResult && (
                  <div style={{
                    position: 'absolute',
                    border: '2px solid var(--emerald-light)',
                    boxShadow: '0 0 15px var(--emerald-glow)',
                    borderRadius: '8px',
                    left: `${detectionResult.bbox.x}px`,
                    top: `${detectionResult.bbox.y}px`,
                    width: `${detectionResult.bbox.width}px`,
                    height: `${detectionResult.bbox.height}px`,
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start'
                  }}>
                    <span style={{ 
                      background: 'var(--emerald-primary)', 
                      color: '#FFFFFF', 
                      fontSize: '0.6rem', 
                      fontWeight: 700, 
                      padding: '2px 6px', 
                      borderRadius: '4px',
                      transform: 'translateY(-20px)'
                    }}>
                      {detectionResult.confidence}%
                    </span>
                  </div>
                )}
              </div>
            ) : (
              // Empty initial display
              <>
                <Camera size={44} style={{ color: 'var(--gold-primary)', marginBottom: '12px', opacity: 0.8 }} />
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Aucun média capturé</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '250px' }}>
                  Utilisez l'appareil photo du smartphone ou téléversez une image de poinçon.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="scanner-actions">
        {streamActive ? (
          <>
            <button className="btn btn-primary" onClick={capturePhoto} style={{ flexGrow: 1 }}>
              <Camera size={16} />
              <span>Prendre la photo</span>
            </button>
            <button className="btn btn-secondary" onClick={stopCamera}>
              <span>Annuler</span>
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-emerald" onClick={startCamera} style={{ flexGrow: 1 }}>
              <Camera size={16} />
              <span>Caméra</span>
            </button>
            <button className="btn btn-secondary" onClick={handleUploadClick}>
              <Upload size={16} />
              <span>Téléverser</span>
            </button>
          </>
        )}
      </div>

      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />

      {cameraError && (
        <div className="glass-panel" style={{ marginTop: '15px', borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)', display: 'flex', gap: '8px', alignItems: 'center', padding: '12px' }}>
          <AlertCircle size={16} style={{ color: '#EF4444', flexShrink: 0 }} />
          <p style={{ fontSize: '0.75rem', color: '#FCA5A5' }}>{cameraError}</p>
        </div>
      )}

      {/* Demo Selector Panel */}
      {!streamActive && !isScanning && (
        <div className="scanner-demo-picker glass-panel" style={{ padding: '12px' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold-primary)', marginBottom: '8px' }}>
            Simuler un scan (Démo hors ligne)
          </h4>
          <div className="scanner-demo-thumbnails">
            <div className="demo-thumb" onClick={() => selectDemo('poisson_platine_950.png')}>
              <PunchVector name="poisson" style={{ color: '#4F46E5' }} />
            </div>
            <div className="demo-thumb" onClick={() => selectDemo('tete_mulet_or_750.jpg')}>
              <PunchVector name="mulet-3" style={{ color: 'var(--gold-primary)' }} />
            </div>
            <div className="demo-thumb" onClick={() => selectDemo('tete_vache_argent_950.jpeg')}>
              <PunchVector name="vache-1" style={{ color: '#CCCCCC' }} />
            </div>
            <div className="demo-thumb" onClick={() => selectDemo('hibou_recence_hors_titre.png')}>
              <PunchVector name="hibou" style={{ color: '#6B7280' }} />
            </div>
          </div>
        </div>
      )}

      {/* Detection Result Details Panel */}
      {detectionResult && !isScanning && !streamActive && (
        <div className="detection-result-panel glass-panel" style={{ borderColor: 'var(--emerald-light)', marginTop: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <CheckCircle size={18} style={{ color: 'var(--emerald-light)' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Poinçon Identifié</h3>
            <span className="badge badge-emerald" style={{ marginLeft: 'auto', fontSize: '0.65rem' }}>
              Confiance : {detectionResult.confidence}%
            </span>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ width: '70px', height: '70px', background: 'var(--bg-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-glass)' }}>
              <PunchVector name={detectionResult.punch.image} style={{ width: '50px', height: '50px', color: getMetalColor(detectionResult.punch.metalId) }} />
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>{detectionResult.punch.nom}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Référence : <strong>{detectionResult.punch.reference}</strong> • Loi : <strong>{detectionResult.punch.legalRef}</strong>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--gold-primary)', marginTop: '4px', fontWeight: 500 }}>
                <Info size={12} />
                <span>Différent : {detectionResult.punch.placeDifferent}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button 
              className="btn btn-emerald" 
              style={{ flexGrow: 1, padding: '8px 12px', fontSize: '0.8rem' }}
              onClick={() => setSelectedPunch(detectionResult.punch)}
            >
              <Eye size={14} />
              <span>Consulter la fiche</span>
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '8px 12px', fontSize: '0.8rem' }}
              onClick={() => {
                setImageSrc(null);
                setDetectionResult(null);
              }}
            >
              <RefreshCw size={14} />
              <span>Réinitialiser</span>
            </button>
          </div>
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
