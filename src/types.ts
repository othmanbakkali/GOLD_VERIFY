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
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'CONFIG';
  entityType: 'POINCON' | 'DOCUMENT' | 'SECURITE';
  entityId: string;
  entityName: string;
  timestamp: string;
  details: string;
  userEmail: string;
  userRole: UserRole;
}

export type UserRole = 'ADMIN' | 'EXPERT' | 'AGENT' | 'VENDEUR' | 'PUBLIC';

export interface User {
  id: string;
  nom: string;
  email: string;
  role: UserRole;
}

export interface UserAccount {
  id: string;
  nom: string;
  email: string;
  role: UserRole;
  password?: string;
}

export interface RolePermissions {
  role: UserRole;
  dashboard: boolean;
  catalog: boolean;
  scanner: boolean;
  map: boolean;
  admin: boolean;
  managePunches: boolean;
  manageDocuments: boolean;
  viewLogs: boolean;
  managePermissions: boolean;
}
