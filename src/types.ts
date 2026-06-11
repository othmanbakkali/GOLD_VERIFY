export interface Punch {
  id: string;
  reference: string;
  nom: string;
  description: string;
  image: string; // base64 or path
  metalId: string;
  titreId?: string;
  categorieId: string;
  dateVigueur: string;
  actif: boolean;
  legalRef: string;
  differentInfo?: string;
  placeDifferent?: string;
}

export interface Metal {
  id: string;
  nom: string;
}

export interface Titre {
  id: string;
  valeur: string;
  metalId: string;
}

export interface Categorie {
  id: string;
  nom: string;
}

export interface DocumentLegal {
  id: string;
  titre: string;
  description: string;
  datePublication: string;
  contenu: string;
}

export interface BureauGarantie {
  id: string;
  nom: string;
  lettreDifferent: string;
  detailsDifferent: string;
  lat: number;
  lng: number;
  adresse: string;
  contact: string;
}

export interface ActivityLog {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'POINCON' | 'DOCUMENT';
  entityId: string;
  entityName: string;
  timestamp: string;
  details: string;
  userEmail: string;
  userRole: 'ADMIN' | 'EXPERT' | 'AGENT' | 'PUBLIC';
}

export type UserRole = 'ADMIN' | 'EXPERT' | 'AGENT' | 'PUBLIC';

export interface User {
  id: string;
  nom: string;
  email: string;
  role: UserRole;
}
