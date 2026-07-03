import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { Punch } from '../types';
import { simulateDetection, estimateSharpness } from '../utils/hallmarkDetector';
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
  const trackRef = useRef<MediaStreamTrack | null>(null);
  
  // Zoom state
  const [zoomSupported, setZoomSupported] = useState(false);
  const [zoomRange, setZoomRange] = useState<{ min: number; max: number }>({ min: 1, max: 4 });
  const [zoomValue, setZoomValue] = useState(1);
  
  // Scan state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [isBlurry, setIsBlurry] = useState(false);
  
  // Selected Detail Modal
  const [selectedPunch, setSelectedPunch] = useState<Punch | null>(null);

  // Correction Modal state
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionSearchQuery, setCorrectionSearchQuery] = useState('');

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Zoom change handler
  const handleZoomChange = async (value: number) => {
    let targetZoom = value;
    if (zoomSupported) {
      // Clamp to supported hardware range
      targetZoom = Math.max(zoomRange.min, Math.min(zoomRange.max, value));
      if (trackRef.current) {
        try {
          await trackRef.current.applyConstraints({
            advanced: [{ zoom: targetZoom } as any]
          });
        } catch (err) {
          console.error("Failed to apply hardware zoom:", err);
        }
      }
    }
    setZoomValue(targetZoom);
  };

  const handleCameraClick = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };


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
      
      let stream;
      try {
        // Try to get the back camera specifically
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      } catch (err) {
        console.warn("Back camera not found or overconstrained, falling back to any camera...");
        // Fallback to any available camera
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
        
        const track = stream.getVideoTracks()[0];
        if (track) {
          trackRef.current = track;
          try {
            const capabilities = track.getCapabilities() as any;
            if (capabilities && capabilities.zoom) {
              setZoomSupported(true);
              const min = capabilities.zoom.min || 1;
              const max = capabilities.zoom.max || 4;
              setZoomRange({ min, max });
              
              // Automatically zoom to maximum to see hallmarks clearly
              const defaultZoom = max;
              setZoomValue(defaultZoom);
              
              await track.applyConstraints({
                advanced: [{ zoom: defaultZoom } as any]
              });
              console.log(`Hardware zoom auto-configured to max (${defaultZoom}x)`);
            } else {
              setZoomSupported(false);
              // Fallback to digital zoom maximum
              setZoomValue(4);
            }
          } catch (capErr) {
            console.warn("Could not read capabilities or apply hardware zoom:", capErr);
            setZoomSupported(false);
            setZoomValue(4); // Fallback default max
          }
        }
      }
    } catch (err: any) {
      console.error('Camera access failed:', err);
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        alert("Erreur: L'appareil photo nécessite une connexion HTTPS sécurisée.");
        setCameraError("L'appareil photo nécessite une connexion HTTPS sécurisée (actuellement en HTTP). Veuillez tester sur la version publiée en ligne (GitHub Pages) ou utiliser le bouton 'Téléverser' pour prendre une photo.");
      } else {
        alert("Erreur: Impossible d'accéder à l'appareil photo. Vérifiez les permissions de votre navigateur.");
        setCameraError("Impossible d'accéder à l'appareil photo. Assurez-vous d'avoir autorisé l'accès dans les paramètres du navigateur ou utilisez le bouton 'Photo Système' pour prendre une photo directement.");
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    trackRef.current = null;
    setStreamActive(false);
    setZoomSupported(false);
    setZoomValue(1);
  };

  // Capture snapshot from video
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const videoWidth = videoRef.current.videoWidth || 640;
      const videoHeight = videoRef.current.videoHeight || 480;
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (zoomSupported) {
          // Hardware zoom is already active, so the video stream is already zoomed
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        } else {
          // Digital/CSS zoom fallback: crop the center of the video frame
          const z = zoomValue;
          const sWidth = videoWidth / z;
          const sHeight = videoHeight / z;
          const sx = (videoWidth - sWidth) / 2;
          const sy = (videoHeight - sHeight) / 2;
          ctx.drawImage(
            videoRef.current,
            sx,
            sy,
            sWidth,
            sHeight,
            0,
            0,
            canvas.width,
            canvas.height
          );
        }
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImageSrc(dataUrl);
        stopCamera();
        runAnalysis('photo_capture.jpg', dataUrl);
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
        const resultUrl = reader.result as string;
        setImageSrc(resultUrl);
        stopCamera();
        runAnalysis(file.name, resultUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI analysis
  const runAnalysis = async (fileName: string, imgSrc: string) => {
    setIsScanning(true);
    setDetectionResult(null);
    setIsBlurry(false);
    
    try {
      const sharpness = await estimateSharpness(imgSrc, fileName);
      console.log(`Image sharpness score: ${sharpness}`);
      
      if (sharpness < 25) {
        setIsBlurry(true);
        setIsScanning(false);
        return;
      }
      
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
    runAnalysis(demoName, 'demo');
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
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="scanner-video" 
              style={{
                transform: !zoomSupported && zoomValue > 1 ? `scale(${zoomValue})` : 'none'
              }}
            />
            <div className="scanner-laser" />
            <div className="scanner-overlay-grid">
              <div className="scanner-target-box">
                <div className="scanner-corner corner-tl" />
                <div className="scanner-corner corner-tr" />
                <div className="scanner-corner corner-bl" />
                <div className="scanner-corner corner-br" />
              </div>
            </div>
            
            {/* Zoom Controls Overlay */}
            <div className="zoom-controls">
              {[1, 2, 3, 4].map((z) => (
                <button
                  key={z}
                  type="button"
                  className={`zoom-btn ${zoomValue === z ? 'active' : ''}`}
                  onClick={() => handleZoomChange(z)}
                  title={`Zoom ${z}x`}
                >
                  {z}x
                </button>
              ))}
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
            <button className="btn btn-emerald" onClick={startCamera} style={{ flexGrow: 1 }} title="Ouvrir la caméra du téléphone directement dans l'application avec zoom automatique">
              <Camera size={16} />
              <span>Caméra</span>
            </button>
            <button className="btn btn-secondary" onClick={handleCameraClick} title="Prendre une photo avec l'appareil photo système du téléphone">
              <span>Photo Système</span>
            </button>
            <button className="btn btn-secondary" onClick={handleUploadClick}>
              <Upload size={16} />
              <span>Galerie</span>
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

      {/* Hidden camera input for direct native phone camera capture */}
      <input 
        type="file" 
        ref={cameraInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        capture="environment"
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
          <div className="scanner-demo-thumbnails" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            <div className="demo-thumb" onClick={() => selectDemo('poisson_platine_950.png')} title="Platine 950‰">
              <PunchVector name="poisson" style={{ color: '#4F46E5' }} />
            </div>
            <div className="demo-thumb" onClick={() => selectDemo('tete_mulet_or_750.jpg')} title="Or 750‰">
              <PunchVector name="mulet-3" style={{ color: 'var(--gold-primary)' }} />
            </div>
            <div className="demo-thumb" onClick={() => selectDemo('tete_vache_argent_950.jpeg')} title="Argent 950‰">
              <PunchVector name="vache-1" style={{ color: '#CCCCCC' }} />
            </div>
            <div className="demo-thumb" onClick={() => selectDemo('hibou_recence_hors_titre.png')} title="Hors Titre">
              <PunchVector name="hibou" style={{ color: '#6B7280' }} />
            </div>
            {/* Blurry Demo Simulation */}
            <div className="demo-thumb" onClick={() => selectDemo('poisson_flou_inutilisable.png')} title="Simuler image floue" style={{ position: 'relative' }}>
              <PunchVector name="poisson" style={{ color: '#4F46E5', filter: 'blur(3px)', opacity: 0.6 }} />
              <span style={{ 
                position: 'absolute', 
                fontSize: '0.55rem', 
                background: '#EF4444', 
                color: '#FFFFFF', 
                padding: '1px 4px', 
                borderRadius: '4px',
                fontWeight: 'bold',
                bottom: '2px'
              }}>FLOU</span>
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
                setCorrectionSearchQuery('');
                setShowCorrectionModal(true);
              }}
              title="Corriger manuellement le poinçon détecté"
            >
              <span>Corriger</span>
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '8px 12px', fontSize: '0.8rem' }}
              onClick={() => {
                setImageSrc(null);
                setDetectionResult(null);
                setIsBlurry(false);
              }}
            >
              <RefreshCw size={14} />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>
      )}

      {/* Blurry Image Alert Panel */}
      {isBlurry && !isScanning && !streamActive && (
        <div className="glass-panel" style={{ borderColor: '#EF4444', background: 'rgba(239, 68, 68, 0.03)', marginTop: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <AlertCircle size={20} style={{ color: '#EF4444', flexShrink: 0 }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FCA5A5' }}>Image Floue Détectée</h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            La photo capturée est trop floue ou de qualité insuffisante pour identifier le poinçon avec précision. 
            Veuillez reprendre l'image en veillant à stabiliser votre appareil et à faire la mise au point sur le marquage.
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button 
              className="btn btn-primary" 
              style={{ flexGrow: 1, background: 'linear-gradient(135deg, #EF4444, #B91C1C)', color: '#FFF', padding: '8px 12px', fontSize: '0.8rem', boxShadow: 'none' }}
              onClick={startCamera}
            >
              <Camera size={14} />
              <span>Reprendre la photo</span>
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '8px 12px', fontSize: '0.8rem' }}
              onClick={() => {
                setImageSrc(null);
                setIsBlurry(false);
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

      {/* Correction Selection Modal */}
      {showCorrectionModal && (
        <div className="modal-overlay" onClick={() => setShowCorrectionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <button className="modal-close-btn" onClick={() => setShowCorrectionModal(false)}>✕</button>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '10px', color: 'var(--text-primary)' }}>
              Corriger le Poinçon
            </h3>
            
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>
              Sélectionnez manuellement le bon poinçon dans le registre pour corriger le résultat de la simulation.
            </p>
            
            {/* Search Input */}
            <div className="search-wrapper" style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Rechercher par nom, référence ou métal..."
                value={correctionSearchQuery}
                onChange={(e) => setCorrectionSearchQuery(e.target.value)}
                className="input-field search-input"
                style={{ fontSize: '0.85rem', paddingLeft: '15px' }}
                autoFocus
              />
            </div>
            
            {/* Grid of Punches */}
            <div className="correction-grid" style={{ maxHeight: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
              {punches
                .filter(p => p.actif)
                .filter(p => {
                  const query = correctionSearchQuery.toLowerCase().trim();
                  if (!query) return true;
                  const metalName = metals.find(m => m.id === p.metalId)?.nom.toLowerCase() || '';
                  const catName = categories.find(c => c.id === p.categorieId)?.nom.toLowerCase() || '';
                  return p.nom.toLowerCase().includes(query) || 
                         p.reference.toLowerCase().includes(query) ||
                         metalName.includes(query) ||
                         catName.includes(query);
                })
                .map(p => {
                  const metal = metals.find(m => m.id === p.metalId);
                  const category = categories.find(c => c.id === p.categorieId);
                  return (
                    <div 
                      key={p.id} 
                      className="correction-item" 
                      onClick={() => {
                        setDetectionResult({
                          punch: p,
                          confidence: 100, // Manual corrections are 100% correct
                          bbox: detectionResult ? detectionResult.bbox : { x: 50, y: 50, width: 120, height: 120 }
                        });
                        setShowCorrectionModal(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-glass)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ width: '42px', height: '42px', background: '#0B0F19', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-glass)', flexShrink: 0 }}>
                        <PunchVector name={p.image} style={{ width: '28px', height: '28px', color: getMetalColor(p.metalId) }} />
                      </div>
                      
                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nom}</h4>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '2px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Ref: {p.reference} • {metal?.nom} • {category?.nom}
                        </p>
                      </div>
                      
                      <span className="badge" style={{ fontSize: '0.6rem', padding: '2px 6px', background: 'rgba(255, 255, 255, 0.03)', color: getMetalColor(p.metalId), borderColor: 'rgba(255, 255, 255, 0.1)', flexShrink: 0 }}>
                        {metal?.nom}
                      </span>
                    </div>
                  );
                })}
                
              {punches.filter(p => p.actif).filter(p => {
                const query = correctionSearchQuery.toLowerCase().trim();
                if (!query) return true;
                const metalName = metals.find(m => m.id === p.metalId)?.nom.toLowerCase() || '';
                const catName = categories.find(c => c.id === p.categorieId)?.nom.toLowerCase() || '';
                return p.nom.toLowerCase().includes(query) || 
                       p.reference.toLowerCase().includes(query) ||
                       metalName.includes(query) ||
                       catName.includes(query);
              }).length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '20px' }}>
                  Aucun poinçon trouvé pour cette recherche.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
