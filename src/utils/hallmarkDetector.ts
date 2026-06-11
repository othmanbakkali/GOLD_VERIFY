import type { Punch } from '../types';

export interface DetectionResult {
  punch: Punch;
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
}

/**
 * Simulates a machine learning hallmark detection model.
 * If the image filename contains keywords, it matches the specific hallmark.
 * Otherwise, it performs a simulated analysis and returns a realistic detection result.
 */
export function simulateDetection(
  imageName: string,
  punches: Punch[]
): Promise<DetectionResult> {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      const lowerName = imageName.toLowerCase();
      let matchedPunch: Punch | undefined;

      // Keywords mapping to initial database IDs
      if (lowerName.includes('poisson') || lowerName.includes('fish') || lowerName.includes('fig1')) {
        matchedPunch = punches.find(p => p.id === 'p-poisson');
      } else if (lowerName.includes('mulet 1') || lowerName.includes('mulet-1') || lowerName.includes('fig2')) {
        matchedPunch = punches.find(p => p.id === 'p-mulet-1');
      } else if (lowerName.includes('mulet 2') || lowerName.includes('mulet-2') || lowerName.includes('fig3')) {
        matchedPunch = punches.find(p => p.id === 'p-mulet-2');
      } else if (lowerName.includes('mulet 3') || lowerName.includes('mulet-3') || lowerName.includes('fig4')) {
        matchedPunch = punches.find(p => p.id === 'p-mulet-3');
      } else if (lowerName.includes('mulet') || lowerName.includes('mule')) {
        // Default to a random mulet
        matchedPunch = punches.find(p => p.id === 'p-mulet-3');
      } else if (lowerName.includes('gazelle') || lowerName.includes('fig5')) {
        matchedPunch = punches.find(p => p.id === 'p-gazelle');
      } else if (lowerName.includes('papillon') || lowerName.includes('butterfly') || lowerName.includes('fig6')) {
        matchedPunch = punches.find(p => p.id === 'p-papillon');
      } else if (lowerName.includes('vache 1') || lowerName.includes('vache-1') || lowerName.includes('fig7')) {
        matchedPunch = punches.find(p => p.id === 'p-vache-1');
      } else if (lowerName.includes('vache 2') || lowerName.includes('vache-2') || lowerName.includes('fig8')) {
        matchedPunch = punches.find(p => p.id === 'p-vache-2');
      } else if (lowerName.includes('vache') || lowerName.includes('cow')) {
        matchedPunch = punches.find(p => p.id === 'p-vache-1');
      } else if (lowerName.includes('belier') || lowerName.includes('bélier') || lowerName.includes('ram') || lowerName.includes('fig9')) {
        matchedPunch = punches.find(p => p.id === 'p-belier');
      } else if (lowerName.includes('vautour') || lowerName.includes('vulture') || lowerName.includes('fig10')) {
        matchedPunch = punches.find(p => p.id === 'p-vautour');
      } else if (lowerName.includes('palme') || lowerName.includes('palm') || lowerName.includes('fig11')) {
        matchedPunch = punches.find(p => p.id === 'p-palme');
      } else if (lowerName.includes('hibou') || lowerName.includes('owl') || lowerName.includes('fig12')) {
        matchedPunch = punches.find(p => p.id === 'p-hibou');
      } else if (lowerName.includes('vase') || lowerName.includes('fig13')) {
        matchedPunch = punches.find(p => p.id === 'p-vase');
      }

      // If no match by filename, pick a random active one to simulate a successful detection
      if (!matchedPunch) {
        const activePunches = punches.filter(p => p.actif);
        if (activePunches.length === 0) {
          reject(new Error('Aucun poinçon actif trouvé dans la base de données.'));
          return;
        }
        const randomIndex = Math.floor(Math.random() * activePunches.length);
        matchedPunch = activePunches[randomIndex];
      }

      // Generate realistic bounding box coordinates (centered on a standard 300x300 canvas coordinates)
      const x = 50 + Math.floor(Math.random() * 40);
      const y = 50 + Math.floor(Math.random() * 40);
      const width = 120 + Math.floor(Math.random() * 40);
      const height = 120 + Math.floor(Math.random() * 40);

      // Generate a realistic confidence score between 78% and 99%
      const confidence = parseFloat((78 + Math.random() * 21).toFixed(2));

      resolve({
        punch: matchedPunch,
        confidence,
        bbox: { x, y, width, height }
      });
    }, 2500); // 2.5s simulation delay for visual feedback
  });
}
