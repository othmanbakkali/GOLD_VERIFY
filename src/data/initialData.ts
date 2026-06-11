import type { Metal, Categorie, Titre, Punch, DocumentLegal, BureauGarantie } from '../types';

export const initialMetals: Metal[] = [
  { id: 'm-platine', nom: 'Platine' },
  { id: 'm-or', nom: 'Or' },
  { id: 'm-argent', nom: 'Argent' },
  { id: 'm-autre', nom: 'Spécifique / Recence' }
];

export const initialTitres: Titre[] = [
  { id: 't-platine-950', valeur: '950‰ (Titre Unique)', metalId: 'm-platine' },
  { id: 't-or-920', valeur: '920‰ (1er Titre - 22K)', metalId: 'm-or' },
  { id: 't-or-840', valeur: '840‰ (2ème Titre - 20K)', metalId: 'm-or' },
  { id: 't-or-750', valeur: '750‰ (3ème Titre - 18K)', metalId: 'm-or' },
  { id: 't-argent-950', valeur: '950‰ (1er Titre)', metalId: 'm-argent' },
  { id: 't-argent-800', valeur: '800‰ (2ème Titre)', metalId: 'm-argent' }
];

export const initialCategories: Categorie[] = [
  { id: 'c-platine', nom: 'Platine' },
  { id: 'c-or-1er', nom: 'Or 1er titre' },
  { id: 'c-or-2e', nom: 'Or 2ème titre' },
  { id: 'c-or-3e', nom: 'Or 3ème titre' },
  { id: 'c-or-petite', nom: 'Or Petite Garantie' },
  { id: 'c-or-import', nom: 'Or Importation' },
  { id: 'c-argent-1er', nom: 'Argent 1er titre' },
  { id: 'c-argent-2e', nom: 'Argent 2ème titre' },
  { id: 'c-argent-petite', nom: 'Argent Petite Garantie' },
  { id: 'c-argent-import', nom: 'Argent Importation' },
  { id: 'c-recence', nom: 'Recence (Poinçon de contrôle)' },
  { id: 'c-hors-titre', nom: 'Hors Titre' },
  { id: 'c-objets-art', nom: 'Objets d\'Art' }
];

export const initialBureaux: BureauGarantie[] = [
  {
    id: 'b-casablanca',
    nom: 'Casablanca (Bureau Central)',
    lettreDifferent: 'Aucune',
    detailsDifferent: 'Les poinçons en usage à Casablanca ne portent aucune marque distinctive (pas de lettre).',
    lat: 33.5731104,
    lng: -7.5898434,
    adresse: 'Administration des Douanes et Impôts Indirects, Angle Boulevard de la Résistance et Rue Araar, Casablanca',
    contact: '+212 522-580100 | contact@douane.gov.ma'
  },
  {
    id: 'b-fes',
    nom: 'Fès',
    lettreDifferent: 'F',
    detailsDifferent: 'Marque distinctive revêtue de la lettre "F" pour les poinçons de Fès.',
    lat: 34.03313,
    lng: -5.00028,
    adresse: 'Direction Régionale des Douanes de Fès, Avenue Allal Ben Abdellah, Fès',
    contact: '+212 535-622807'
  },
  {
    id: 'b-marrakech',
    nom: 'Marrakech',
    lettreDifferent: 'M',
    detailsDifferent: 'Marque distinctive revêtue de la lettre "M" pour les poinçons de Marrakech.',
    lat: 31.6294723,
    lng: -7.9810845,
    adresse: 'Bureau de Garantie de la Douane, Avenue Mohammed V, Marrakech',
    contact: '+212 524-448102'
  },
  {
    id: 'b-agadir',
    nom: 'Agadir',
    lettreDifferent: 'A',
    detailsDifferent: 'Marque distinctive revêtue de la lettre "A" pour les poinçons d\'Agadir.',
    lat: 30.4277547,
    lng: -9.5981072,
    adresse: 'Direction Régionale des Douanes, Port d\'Agadir, Agadir',
    contact: '+212 528-842790'
  },
  {
    id: 'b-tanger',
    nom: 'Tanger',
    lettreDifferent: 'T',
    detailsDifferent: 'Marque distinctive revêtue de la lettre "T" pour les poinçons de Tanger.',
    lat: 35.759465,
    lng: -5.833954,
    adresse: 'Bureau de Garantie, Zone Portuaire de Tanger Ville, Tanger',
    contact: '+212 539-943340'
  }
];

export const initialDocumentsLegaux: DocumentLegal[] = [
  {
    id: 'doc-dahir-1977',
    titre: 'Dahir portant loi n° 1.77.340 du 25 Chaoual 1397 (9 octobre 1977)',
    description: 'Réglementation des titres et contrôle de garantie des métaux précieux en République du Maroc.',
    datePublication: '1977-10-09',
    contenu: `Le présent Dahir détermine les conditions de fabrication, de contrôle de titre et de poinçonnement de garantie pour tous les ouvrages d'or, d'argent et de platine fabriqués ou importés au Maroc.
    
Principaux points :
- Fixation des titres légaux : Platine (950‰), Or (920‰, 840‰, 750‰) et Argent (950‰, 800‰).
- Obligation du poinçonnement de titre par la coupelle ou le touchau par les agents de l'administration douanière.
- Définition des sanctions en cas de contrefaçon de poinçons de l'État.`
  },
  {
    id: 'doc-arrete-1977',
    titre: 'Arrêté du Ministre des Finances n° 1309-77 du 25 Chaoual 1397 (9 octobre 1977)',
    description: 'Définition des empreintes officielles des poinçons de titre et de garantie applicables.',
    datePublication: '1977-10-09',
    contenu: `Cet arrêté ministériel officialise les dessins et les caractéristiques géométriques des poinçons (Fig 1 à Fig 13), leurs représentations animales (Poisson, Mulet, Gazelle, Papillon, Vache, Bélier, Vautour, Palme, Hibou, Vase) ainsi que la position du différent (lettre spécifique à chaque bureau régional de douane).`
  }
];

export const initialPunches: Punch[] = [
  {
    id: 'p-poisson',
    reference: 'Fig. 1',
    nom: 'Poisson (Platine 950‰)',
    description: 'Poinçon officiel pour les ouvrages en platine. Représente un poisson de profil droit nageant.',
    image: 'poisson',
    metalId: 'm-platine',
    titreId: 't-platine-950',
    categorieId: 'c-platine',
    dateVigueur: '1977-10-09',
    actif: true,
    legalRef: 'Dahir N° 1.77.340',
    placeDifferent: 'Sous le corps du poisson.',
    differentInfo: 'Casablanca (sans lettre), Fès (lettre F sous le corps), Marrakech (lettre M), Agadir (lettre A), Tanger (lettre T).'
  },
  {
    id: 'p-mulet-1',
    reference: 'Fig. 2',
    nom: 'Tête de Mulet - 1er Titre (Or 920‰)',
    description: 'Ouvrages en or de premier titre (920/1000) essayés à la coupelle. Représente une tête de mulet tournée vers la gauche avec le chiffre "1" inscrit sur son cou.',
    image: 'mulet-1',
    metalId: 'm-or',
    titreId: 't-or-920',
    categorieId: 'c-or-1er',
    dateVigueur: '1977-10-09',
    actif: true,
    legalRef: 'Dahir N° 1.77.340',
    placeDifferent: 'Entre le cou et la tête, sur le fond.',
    differentInfo: 'Casablanca (sans lettre), Fès (lettre F), Marrakech (lettre M), Agadir (lettre A), Tanger (lettre T).'
  },
  {
    id: 'p-mulet-2',
    reference: 'Fig. 3',
    nom: 'Tête de Mulet - 2ème Titre (Or 840‰)',
    description: 'Ouvrages en or de deuxième titre (840/1000) essayés à la coupelle. Représente une tête de mulet tournée vers la gauche avec le chiffre "2" inscrit sur son cou.',
    image: 'mulet-2',
    metalId: 'm-or',
    titreId: 't-or-840',
    categorieId: 'c-or-2e',
    dateVigueur: '1977-10-09',
    actif: true,
    legalRef: 'Dahir N° 1.77.340',
    placeDifferent: 'Entre le cou et la tête, sur le fond.',
    differentInfo: 'Casablanca (sans lettre), Fès (lettre F), Marrakech (lettre M), Agadir (lettre A), Tanger (lettre T).'
  },
  {
    id: 'p-mulet-3',
    reference: 'Fig. 4',
    nom: 'Tête de Mulet - 3ème Titre (Or 750‰)',
    description: 'Ouvrages en or de troisième titre (750/1000) essayés à la coupelle. Représente une tête de mulet tournée vers la gauche avec le chiffre "3" inscrit sur son cou.',
    image: 'mulet-3',
    metalId: 'm-or',
    titreId: 't-or-750',
    categorieId: 'c-or-3e',
    dateVigueur: '1977-10-09',
    actif: true,
    legalRef: 'Dahir N° 1.77.340',
    placeDifferent: 'Entre le cou et la tête, sur le fond.',
    differentInfo: 'Casablanca (sans lettre), Fès (lettre F), Marrakech (lettre M), Agadir (lettre A), Tanger (lettre T).'
  },
  {
    id: 'p-gazelle',
    reference: 'Fig. 5',
    nom: 'Tête de Gazelle (Or Petite Garantie)',
    description: 'Ouvrages en or essayés au touchau (Petite Garantie). Représente une tête de gazelle gracile tournée vers la droite de profil.',
    image: 'gazelle',
    metalId: 'm-or',
    categorieId: 'c-or-petite',
    dateVigueur: '1977-10-09',
    actif: true,
    legalRef: 'Dahir N° 1.77.340',
    placeDifferent: 'Au-dessous de la tête.',
    differentInfo: 'Casablanca (sans lettre), Fès (lettre F), Marrakech (lettre M), Agadir (lettre A), Tanger (lettre T).'
  },
  {
    id: 'p-papillon',
    reference: 'Fig. 6',
    nom: 'Papillon (Or Importation)',
    description: 'Poinçon unique d\'importation pour les ouvrages en or importés de l\'étranger. Représente un papillon stylisé aux ailes déployées vu de dessus.',
    image: 'papillon',
    metalId: 'm-or',
    categorieId: 'c-or-import',
    dateVigueur: '1977-10-09',
    actif: true,
    legalRef: 'Dahir N° 1.77.340',
    placeDifferent: 'Au-dessous de l\'aile gauche.',
    differentInfo: 'La marque du différent régional est apposée à côté du poinçon principal lors du dédouanement.'
  },
  {
    id: 'p-vache-1',
    reference: 'Fig. 7',
    nom: 'Tête de Vache - 1er Titre (Argent 950‰)',
    description: 'Ouvrages en argent de premier titre (950/1000) essayés à la coupelle. Représente une tête de vache tournée vers la gauche avec le chiffre "1" gravé sur son cou.',
    image: 'vache-1',
    metalId: 'm-argent',
    titreId: 't-argent-950',
    categorieId: 'c-argent-1er',
    dateVigueur: '1977-10-09',
    actif: true,
    legalRef: 'Dahir N° 1.77.340',
    placeDifferent: 'Au-dessous de la tête.',
    differentInfo: 'Casablanca (sans lettre), Fès (lettre F), Marrakech (lettre M), Agadir (lettre A), Tanger (lettre T).'
  },
  {
    id: 'p-vache-2',
    reference: 'Fig. 8',
    nom: 'Tête de Vache - 2ème Titre (Argent 800‰)',
    description: 'Ouvrages en argent de deuxième titre (800/1000) essayés à la coupelle. Représente une tête de vache tournée vers la gauche avec le chiffre "2" gravé sur son cou.',
    image: 'vache-2',
    metalId: 'm-argent',
    titreId: 't-argent-800',
    categorieId: 'c-argent-2e',
    dateVigueur: '1977-10-09',
    actif: true,
    legalRef: 'Dahir N° 1.77.340',
    placeDifferent: 'Au-dessous de la tête.',
    differentInfo: 'Casablanca (sans lettre), Fès (lettre F), Marrakech (lettre M), Agadir (lettre A), Tanger (lettre T).'
  },
  {
    id: 'p-belier',
    reference: 'Fig. 9',
    nom: 'Tête de Bélier (Argent Petite Garantie)',
    description: 'Ouvrages en argent essayés au touchau (Petite Garantie). Représente de profil droit une tête de bélier avec ses cornes enroulées.',
    image: 'belier',
    metalId: 'm-argent',
    categorieId: 'c-argent-petite',
    dateVigueur: '1977-10-09',
    actif: true,
    legalRef: 'Dahir N° 1.77.340',
    placeDifferent: 'Dans l\'angle inférieur gauche de la cellule.',
    differentInfo: 'Casablanca (sans lettre), Fès (lettre F), Marrakech (lettre M), Agadir (lettre A), Tanger (lettre T).'
  },
  {
    id: 'p-vautour',
    reference: 'Fig. 10',
    nom: 'Vautour (Argent Importation)',
    description: 'Poinçon unique d\'importation pour les ouvrages en argent importés. Représente un vautour debout de face, tête tournée.',
    image: 'vautour',
    metalId: 'm-argent',
    categorieId: 'c-argent-import',
    dateVigueur: '1977-10-09',
    actif: true,
    legalRef: 'Dahir N° 1.77.340',
    placeDifferent: 'Derrière la tête, dans l\'angle supérieur droit.',
    differentInfo: 'Appliqué par les bureaux frontaliers de douane.'
  },
  {
    id: 'p-palme',
    reference: 'Fig. 11',
    nom: 'Palme (Poinçon de Recence)',
    description: 'Poinçon de recence pour les ouvrages se trouvant au Maroc dans le commerce et déjà revêtus de poinçons en usage avant le Dahir du 1er octobre 1925. Représente une palme (feuille de palmier).',
    image: 'palme',
    metalId: 'm-autre',
    categorieId: 'c-recence',
    dateVigueur: '1977-10-09',
    actif: true,
    legalRef: 'Dahir N° 1.77.340',
    placeDifferent: 'Dans la partie supérieure gauche.',
    differentInfo: 'Poinçon historique utilisé lors des recensements de stocks d\'orfèvrerie.'
  },
  {
    id: 'p-hibou',
    reference: 'Fig. 12',
    nom: 'Hibou Grand-Duc (Poinçon Hors Titre)',
    description: 'Poinçon pour les ouvrages déjà importés avant le Dahir du 1er octobre 1925 et qui étaient au-dessous du titre légal minimum. Représente un hibou grand-duc de face.',
    image: 'hibou',
    metalId: 'm-autre',
    categorieId: 'c-hors-titre',
    dateVigueur: '1977-10-09',
    actif: true,
    legalRef: 'Dahir N° 1.77.340',
    placeDifferent: 'Au-dessus de la tête.',
    differentInfo: 'Poinçon exceptionnel de tolérance historique.'
  },
  {
    id: 'p-vase',
    reference: 'Fig. 13',
    nom: 'Vase (Objets d\'Art)',
    description: 'Poinçon spécifique pour les objets d\'art ou de curiosité. Représente un vase classique ornemental muni de deux anses.',
    image: 'vase',
    metalId: 'm-autre',
    categorieId: 'c-objets-art',
    dateVigueur: '1977-10-09',
    actif: true,
    legalRef: 'Dahir N° 1.77.340',
    placeDifferent: 'Dans la partie supérieure entre les anses.',
    differentInfo: 'Utilisé pour les pièces uniques d\'orfèvrerie d\'art historique ou de grande valeur patrimoniale.'
  }
];
