import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import type { BureauGarantie } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Phone, Compass, ExternalLink, HelpCircle } from 'lucide-react';

export const MapBureaux: React.FC = () => {
  const { bureaux } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedBureau, setSelectedBureau] = useState<BureauGarantie>(bureaux[0]);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      // Clear any previous map instance to prevent double-initialization errors
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize Map centering on Morocco geography
      const map = L.map(mapContainerRef.current, {
        center: [32.0, -6.5],
        zoom: 6,
        zoomControl: false,
        attributionControl: false
      });
      
      mapInstanceRef.current = map;

      // Add Zoom Control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Load OpenStreetMap tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      // Add markers for all bureaus
      bureaux.forEach((bureau) => {
        // Custom marker icon displaying the city differentiator letter
        const markerLetter = bureau.lettreDifferent === 'Aucune' ? 'C' : bureau.lettreDifferent;
        const markerIcon = L.divIcon({
          html: `<div style="
            background-color: var(--bg-tertiary);
            border: 2px solid ${bureau.lettreDifferent === 'Aucune' ? 'var(--emerald-light)' : 'var(--gold-primary)'};
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          ">
            <span style="
              transform: rotate(45deg);
              color: var(--text-primary);
              font-size: 11px;
              font-weight: 800;
              font-family: monospace;
            ">${markerLetter}</span>
          </div>`,
          className: 'custom-bureau-marker',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30]
        });

        const marker = L.marker([bureau.lat, bureau.lng], { icon: markerIcon }).addTo(map);

        // Bind popup clicking
        marker.on('click', () => {
          setSelectedBureau(bureau);
          map.setView([bureau.lat, bureau.lng], 9, { animate: true });
        });
      });
    } catch (err) {
      console.error('Failed to load Leaflet Map:', err);
      setMapError('Impossible de charger la carte Leaflet (vérifiez votre connexion ou scripts).');
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [bureaux]);

  const selectBureauHandler = (bureau: BureauGarantie) => {
    setSelectedBureau(bureau);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([bureau.lat, bureau.lng], 10, { animate: true });
    }
  };

  // Open native mobile directions maps
  const getGpsLink = (bureau: BureauGarantie) => {
    return `geo:${bureau.lat},${bureau.lng}?q=${bureau.lat},${bureau.lng}(Bureau+Douane+${encodeURIComponent(bureau.nom)})`;
  };

  const getWebMapsLink = (bureau: BureauGarantie) => {
    return `https://www.google.com/maps/search/?api=1&query=${bureau.lat},${bureau.lng}`;
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="glass-panel" style={{ padding: '15px', marginBottom: '15px' }}>
        <h3 className="glass-panel-title">
          <MapPin size={16} style={{ color: 'var(--gold-primary)' }} />
          Bureaux de Garantie
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
          Sélectionnez un bureau régional de la Douane pour voir sa lettre distinctive (différent) apposée sur les poinçons.
        </p>

        {/* Office Picker List */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '10px' }}>
          {bureaux.map((b) => (
            <button
              key={b.id}
              className={`chip ${selectedBureau.id === b.id ? 'active' : ''}`}
              onClick={() => selectBureauHandler(b)}
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            >
              {b.nom.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Map view container */}
      <div className="map-container-wrapper" style={{ position: 'relative' }}>
        {mapError ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            padding: '20px', 
            textAlign: 'center',
            color: 'var(--text-secondary)'
          }}>
            <HelpCircle size={32} style={{ color: 'var(--gold-primary)', marginBottom: '10px' }} />
            <span style={{ fontSize: '0.85rem' }}>{mapError}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Le fonctionnement des marqueurs reste consultable ci-dessous hors ligne.
            </span>
          </div>
        ) : (
          <div ref={mapContainerRef} style={{ height: '100%', width: '100%', zIndex: 1 }} />
        )}
      </div>

      {/* Selected office details card */}
      <div className="office-info-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {selectedBureau.nom}
          </h4>
          <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
            Différent : {selectedBureau.lettreDifferent}
          </span>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', fontWeight: 500, fontStyle: 'italic', margin: '4px 0' }}>
          {selectedBureau.detailsDifferent}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--text-muted)' }} />
            <span>{selectedBureau.adresse}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Phone size={14} style={{ color: 'var(--text-muted)' }} />
            <span>{selectedBureau.contact}</span>
          </div>
        </div>

        {/* Route Actions */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
          <a
            href={getGpsLink(selectedBureau)}
            className="btn btn-emerald"
            style={{ flexGrow: 1, textDecoration: 'none', fontSize: '0.75rem', padding: '8px 12px' }}
          >
            <Compass size={14} />
            <span>Lancer GPS</span>
          </a>
          <a
            href={getWebMapsLink(selectedBureau)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ textDecoration: 'none', fontSize: '0.75rem', padding: '8px 12px' }}
          >
            <ExternalLink size={14} />
            <span>Google Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
};
