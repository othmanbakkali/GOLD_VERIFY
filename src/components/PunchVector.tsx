import React from 'react';

export const PunchVector: React.FC<{ 
  name: string; 
  className?: string; 
  style?: React.CSSProperties; 
}> = ({ name, className, style }) => {
  // Returns custom inline SVG graphics representing official hallmarks
  switch (name) {
    case 'poisson':
      return (
        <svg viewBox="0 0 100 65" className={className} xmlns="http://www.w3.org/2000/svg" style={{ strokeLinecap: 'round', strokeLinejoin: 'round', ...style }}>
          {/* Fish outline */}
          <path d="M12,32 C25,12 68,12 85,32 C72,48 42,50 25,46 L14,52 C18,46 17,37 12,32 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M74,32 C68,26 58,26 48,32" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="28" cy="27" r="2.5" fill="currentColor" />
          
          {/* Gills and scales */}
          <path d="M35,26 C37,30 37,34 35,38" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M44,35 C46,33 48,33 50,35 M52,31 C54,29 57,29 59,31 M60,37 C62,35 65,35 67,37" fill="none" stroke="currentColor" strokeWidth="1.2" />
          
          {/* Différent indicator under the body */}
          <circle cx="50" cy="45" r="4.5" stroke="var(--gold-primary)" strokeWidth="1.5" strokeDasharray="2" fill="none" />
          <text x="46" y="54" fontSize="6.5" fill="var(--gold-primary)" fontWeight="bold" fontFamily="monospace">Diff</text>
        </svg>
      );
    case 'mulet-1':
    case 'mulet-2':
    case 'mulet-3': {
      const num = name.split('-')[1];
      return (
        <svg viewBox="0 0 80 100" className={className} xmlns="http://www.w3.org/2000/svg" style={{ strokeLinecap: 'round', strokeLinejoin: 'round', ...style }}>
          {/* Mulet head profile facing left */}
          <path d="M55,80 C50,63 53,44 45,28 C42,22 34,8 30,3 C29,8 28,14 28,24 C24,27 18,29 13,34 C7,40 10,48 16,50 C20,51 26,48 28,46 C30,55 33,70 18,85 C28,87 45,87 55,80 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
          {/* Eye */}
          <circle cx="26" cy="37" r="2.5" fill="currentColor" />
          {/* Ear line */}
          <path d="M30,6 C31,14 30,20 28,24" stroke="currentColor" strokeWidth="1.5" />
          {/* Muzzle line */}
          <path d="M12,41 C15,44 19,43 21,41" stroke="currentColor" strokeWidth="1.2" />
          {/* Number on neck badge */}
          <rect x="36" y="55" width="13" height="15" rx="3" fill="var(--gold-primary)" />
          <text x="42.5" y="66" textAnchor="middle" fontSize="10.5" fill="#000000" fontWeight="bold" fontFamily="monospace">{num}</text>
          
          {/* Différent indicator behind neck */}
          <circle cx="62" cy="45" r="4.5" stroke="var(--gold-primary)" strokeWidth="1.5" strokeDasharray="2" fill="none" />
          <text x="58" y="54" fontSize="6.5" fill="var(--gold-primary)" fontWeight="bold" fontFamily="monospace">Diff</text>
        </svg>
      );
    }
    case 'gazelle':
      return (
        <svg viewBox="0 0 80 100" className={className} xmlns="http://www.w3.org/2000/svg" style={{ strokeLinecap: 'round', strokeLinejoin: 'round', ...style }}>
          {/* Gazelle profile facing right */}
          <path d="M25,80 C30,63 27,44 35,28 C38,22 46,8 50,3 C51,8 52,14 52,24 C56,27 62,29 67,34 C73,40 70,48 64,50 C60,51 54,48 52,46 C50,55 47,70 62,85 C52,87 35,87 25,80 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
          {/* Horns */}
          <path d="M42,21 Q38,10 34,2" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M47,23 Q43,12 39,4" stroke="currentColor" strokeWidth="2" fill="none" />
          {/* Eye */}
          <circle cx="54" cy="37" r="2.2" fill="currentColor" />
          
          {/* Différent indicator under chin */}
          <circle cx="32" cy="55" r="4.5" stroke="var(--gold-primary)" strokeWidth="1.5" strokeDasharray="2" fill="none" />
          <text x="28" y="64" fontSize="6.5" fill="var(--gold-primary)" fontWeight="bold" fontFamily="monospace">Diff</text>
        </svg>
      );
    case 'papillon':
      return (
        <svg viewBox="0 0 100 80" className={className} xmlns="http://www.w3.org/2000/svg" style={{ strokeLinecap: 'round', strokeLinejoin: 'round', ...style }}>
          {/* Butterfly wings */}
          <path d="M50,28 C45,16 23,4 12,20 C5,30 10,47 25,52 C37,56 45,45 50,34 C55,45 63,56 75,52 C90,47 95,30 88,20 C77,4 55,16 50,28 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
          {/* Body */}
          <path d="M50,14 L50,58" stroke="currentColor" strokeWidth="4.5" />
          {/* Antennae */}
          <path d="M48,15 Q42,6 36,9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M52,15 Q58,6 64,9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          
          {/* Différent indicator under left wing */}
          <circle cx="22" cy="60" r="4.5" stroke="var(--gold-primary)" strokeWidth="1.5" strokeDasharray="2" fill="none" />
          <text x="18" y="69" fontSize="6.5" fill="var(--gold-primary)" fontWeight="bold" fontFamily="monospace">Diff</text>
        </svg>
      );
    case 'vache-1':
    case 'vache-2': {
      const num = name.split('-')[1];
      return (
        <svg viewBox="0 0 90 90" className={className} xmlns="http://www.w3.org/2000/svg" style={{ strokeLinecap: 'round', strokeLinejoin: 'round', ...style }}>
          {/* Cow head facing left */}
          <path d="M72,70 C66,54 62,38 52,28 Q46,18 40,8 L36,20 Q30,22 24,26 C18,30 14,37 17,47 C20,52 28,51 32,49 C35,61 38,71 24,81 C35,83 60,82 72,70 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
          {/* Horn */}
          <path d="M43,21 Q47,12 51,4" stroke="currentColor" strokeWidth="2.2" fill="none" />
          {/* Ear */}
          <path d="M54,30 Q63,32 67,26" stroke="currentColor" strokeWidth="1.5" fill="none" />
          {/* Eye */}
          <circle cx="33" cy="37" r="2.8" fill="currentColor" />
          
          {/* Number badge on neck */}
          <rect x="42" y="54" width="13" height="15" rx="3" fill="var(--gold-primary)" />
          <text x="48.5" y="65" textAnchor="middle" fontSize="10.5" fill="#000000" fontWeight="bold" fontFamily="monospace">{num}</text>
          
          {/* Différent indicator under head */}
          <circle cx="24" cy="62" r="4.5" stroke="var(--gold-primary)" strokeWidth="1.5" strokeDasharray="2" fill="none" />
          <text x="20" y="71" fontSize="6.5" fill="var(--gold-primary)" fontWeight="bold" fontFamily="monospace">Diff</text>
        </svg>
      );
    }
    case 'belier':
      return (
        <svg viewBox="0 0 80 100" className={className} xmlns="http://www.w3.org/2000/svg" style={{ strokeLinecap: 'round', strokeLinejoin: 'round', ...style }}>
          {/* Ram head profile right */}
          <path d="M18,80 C23,63 22,44 30,30 C36,22 44,18 52,22 C60,26 64,33 61,43 C57,50 49,53 45,51 C42,60 39,70 54,83 C44,86 27,86 18,80 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
          {/* Large spiral horn */}
          <path d="M37,30 C27,27 16,33 14,43 C12,53 20,62 30,58 C36,56 38,48 36,42 Q32,36 26,42" fill="none" stroke="currentColor" strokeWidth="3" style={style} />
          {/* Eye */}
          <circle cx="47" cy="36" r="2.5" fill="currentColor" />
          
          {/* Différent indicator lower left */}
          <circle cx="16" cy="70" r="4.5" stroke="var(--gold-primary)" strokeWidth="1.5" strokeDasharray="2" fill="none" />
          <text x="12" y="79" fontSize="6.5" fill="var(--gold-primary)" fontWeight="bold" fontFamily="monospace">Diff</text>
        </svg>
      );
    case 'vautour':
      return (
        <svg viewBox="0 0 80 100" className={className} xmlns="http://www.w3.org/2000/svg" style={{ strokeLinecap: 'round', strokeLinejoin: 'round', ...style }}>
          {/* Vulture standing */}
          <path d="M40,12 C35,12 32,17 32,22 C32,27 35,30 38,32 C30,37 25,50 25,67 C25,77 30,87 40,90 C50,87 55,77 55,67 C55,50 50,37 42,32 C45,30 48,27 48,22 C48,17 45,12 40,12 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
          {/* Wing fold */}
          <path d="M28,52 C32,60 35,77 40,82 C45,77 48,60 52,52" fill="none" stroke="currentColor" strokeWidth="1.5" />
          {/* Beak */}
          <path d="M41,20 L47,22 L41,24 Z" fill="currentColor" />
          {/* Eye */}
          <circle cx="38.5" cy="19.5" r="1.8" fill="currentColor" />
          
          {/* Différent indicator behind head */}
          <circle cx="62" cy="22" r="4.5" stroke="var(--gold-primary)" strokeWidth="1.5" strokeDasharray="2" fill="none" />
          <text x="58" y="31" fontSize="6.5" fill="var(--gold-primary)" fontWeight="bold" fontFamily="monospace">Diff</text>
        </svg>
      );
    case 'palme':
      return (
        <svg viewBox="0 0 80 100" className={className} xmlns="http://www.w3.org/2000/svg" style={{ strokeLinecap: 'round', strokeLinejoin: 'round', ...style }}>
          {/* Palme stem */}
          <path d="M40,90 Q40,48 62,18" fill="none" stroke="currentColor" strokeWidth="3" />
          {/* Leaves */}
          <path d="M40,78 Q28,73 15,77 Q26,72 40,75 Z" fill="currentColor" />
          <path d="M40,68 Q22,60 7,67 Q21,60 40,63 Z" fill="currentColor" />
          <path d="M41,58 Q19,48 3,57 Q18,48 41,53 Z" fill="currentColor" />
          <path d="M42,47 Q24,35 7,45 Q23,36 42,42 Z" fill="currentColor" />
          
          <path d="M40,78 Q52,73 65,77 Q54,72 40,75 Z" fill="currentColor" />
          <path d="M40,68 Q58,60 73,67 Q59,60 40,63 Z" fill="currentColor" />
          <path d="M41,58 Q61,48 77,57 Q62,48 41,53 Z" fill="currentColor" />
          <path d="M42,47 Q60,35 77,45 Q61,36 42,42 Z" fill="currentColor" />
          
          {/* Différent indicator upper left */}
          <circle cx="16" cy="22" r="4.5" stroke="var(--gold-primary)" strokeWidth="1.5" strokeDasharray="2" fill="none" />
          <text x="12" y="31" fontSize="6.5" fill="var(--gold-primary)" fontWeight="bold" fontFamily="monospace">Diff</text>
        </svg>
      );
    case 'hibou':
      return (
        <svg viewBox="0 0 80 100" className={className} xmlns="http://www.w3.org/2000/svg" style={{ strokeLinecap: 'round', strokeLinejoin: 'round', ...style }}>
          {/* Owl body outline */}
          <path d="M20,38 C20,28 28,18 40,18 C52,18 60,28 60,38 C60,58 52,78 40,88 C28,78 20,58 20,38 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
          {/* Eyes */}
          <circle cx="32" cy="38" r="6.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="32" cy="38" r="2.8" fill="currentColor" />
          <circle cx="48" cy="38" r="6.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="48" cy="38" r="2.8" fill="currentColor" />
          {/* Beak */}
          <path d="M40,43 L37.5,49 L42.5,49 Z" fill="currentColor" />
          {/* Owl ear tufts */}
          <path d="M25,23 L18,13 L29,20" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M55,23 L62,13 L51,20" stroke="currentColor" strokeWidth="2" fill="none" />
          
          {/* Différent indicator above head */}
          <circle cx="40" cy="7" r="4.5" stroke="var(--gold-primary)" strokeWidth="1.5" strokeDasharray="2" fill="none" />
          <text x="36" y="16" fontSize="6.5" fill="var(--gold-primary)" fontWeight="bold" fontFamily="monospace">Diff</text>
        </svg>
      );
    case 'vase':
      return (
        <svg viewBox="0 0 80 100" className={className} xmlns="http://www.w3.org/2000/svg" style={{ strokeLinecap: 'round', strokeLinejoin: 'round', ...style }}>
          {/* Vase outline */}
          <path d="M28,27 L52,27 L52,32 C52,47 62,57 62,72 C62,82 52,87 40,87 C28,87 18,82 18,72 C18,57 28,47 28,32 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M23,87 L57,87 L52,92 L28,92 Z" fill="none" stroke="currentColor" strokeWidth="2" />
          {/* Handles */}
          <path d="M28,37 C18,37 13,47 18,57 C21,62 28,64 28,64" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M52,37 C62,37 67,47 62,57 C59,62 52,64 52,64" fill="none" stroke="currentColor" strokeWidth="2" />
          
          {/* Différent indicator between top handles */}
          <circle cx="40" cy="18" r="4.5" stroke="var(--gold-primary)" strokeWidth="1.5" strokeDasharray="2" fill="none" />
          <text x="36" y="27" fontSize="6.5" fill="var(--gold-primary)" fontWeight="bold" fontFamily="monospace">Diff</text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" style={style}>
          <rect x="20" y="20" width="60" height="60" rx="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
          <path d="M50,30 L50,70 M30,50 L70,50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
};
