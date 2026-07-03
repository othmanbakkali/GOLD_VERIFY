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
  imageSrc: string,
  punches: Punch[]
): Promise<DetectionResult> {
  return new Promise((resolve, reject) => {
    // Simple hash function for deterministic results
    const simpleHash = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };

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

      // If no match by filename, pick the first active one deterministically
      if (!matchedPunch) {
        const activePunches = punches.filter(p => p.actif);
        if (activePunches.length === 0) {
          reject(new Error('Aucun poinçon actif trouvé dans la base de données.'));
          return;
        }
        // Always return the first active punch for consistent testing behavior
        matchedPunch = activePunches[0];
      }

      // Generate realistic but fixed bounding box coordinates
      const x = 75;
      const y = 80;
      const width = 110;
      const height = 115;

      // Fixed high-confidence score
      const confidence = 94.55;

      resolve({
        punch: matchedPunch,
        confidence,
        bbox: { x, y, width, height }
      });
    }, 1500); // 1.5s simulation delay for visual feedback
  });
}

/**
 * Calculates a basic sharpness score of an image base64 or source URL using HTML Canvas.
 * Returns a value between 0 (very blurry) and 100 (extremely sharp).
 */
export function estimateSharpness(imageSrc: string, imageName: string = ''): Promise<number> {
  return new Promise((resolve) => {
    // If filename contains 'flou' or 'blur', force simulate a low sharpness score (blurry)
    if (imageName.toLowerCase().includes('flou') || imageName.toLowerCase().includes('blur')) {
      resolve(12);
      return;
    }

    if (imageSrc === 'demo' || imageSrc.startsWith('data:image/svg+xml')) {
      resolve(95);
      return;
    }

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const width = 100;
        const height = 100;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(85);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        let totalDiff = 0;
        let count = 0;

        for (let y = 1; y < height - 1; y += 2) {
          for (let x = 1; x < width - 1; x += 2) {
            const idx = (y * width + x) * 4;
            const val = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
            
            const rightIdx = (y * width + (x + 1)) * 4;
            const downIdx = ((y + 1) * width + x) * 4;

            const rightVal = 0.299 * data[rightIdx] + 0.587 * data[rightIdx + 1] + 0.114 * data[rightIdx + 2];
            const downVal = 0.299 * data[downIdx] + 0.587 * data[downIdx + 1] + 0.114 * data[downIdx + 2];

            totalDiff += Math.abs(val - rightVal) + Math.abs(val - downVal);
            count += 2;
          }
        }

        const avgDiff = totalDiff / count;
        // Map average diff to sharpness percentage (avgDiff below 6.5 is usually blurry)
        const sharpnessScore = Math.min(100, Math.max(5, Math.round(avgDiff * 7)));
        resolve(sharpnessScore);
      } catch (err) {
        console.error("Error analyzing sharpness, defaulting to sharp:", err);
        resolve(85);
      }
    };
    img.onerror = () => {
      resolve(85);
    };
  });
}

