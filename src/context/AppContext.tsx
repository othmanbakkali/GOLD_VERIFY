import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Punch, Metal, Titre, Categorie, DocumentLegal, BureauGarantie, ActivityLog, UserRole } from '../types';
import { initialMetals, initialCategories, initialTitres, initialBureaux, initialDocumentsLegaux, initialPunches } from '../data/initialData';

interface AppContextProps {
  punches: Punch[];
  metals: Metal[];
  titres: Titre[];
  categories: Categorie[];
  documents: DocumentLegal[];
  bureaux: BureauGarantie[];
  logs: ActivityLog[];
  currentRole: UserRole;
  userEmail: string;
  setRole: (role: UserRole) => void;
  setUserEmail: (email: string) => void;
  
  // Punch CRUD
  addPunch: (punch: Omit<Punch, 'id' | 'actif'>) => void;
  updatePunch: (id: string, punch: Partial<Punch>) => void;
  deletePunch: (id: string) => void;
  
  // Document CRUD
  addDocument: (doc: Omit<DocumentLegal, 'id'>) => void;
  updateDocument: (id: string, doc: Partial<DocumentLegal>) => void;
  deleteDocument: (id: string) => void;
  
  // Activity logs
  clearLogs: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or seed files
  const [punches, setPunches] = useState<Punch[]>(() => {
    const local = localStorage.getItem('gp_punches');
    return local ? JSON.parse(local) : initialPunches;
  });

  const [documents, setDocuments] = useState<DocumentLegal[]>(() => {
    const local = localStorage.getItem('gp_documents');
    return local ? JSON.parse(local) : initialDocumentsLegaux;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const local = localStorage.getItem('gp_logs');
    return local ? JSON.parse(local) : [];
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const local = localStorage.getItem('gp_role');
    return (local as UserRole) || 'PUBLIC';
  });

  const [userEmail, setUserEmailState] = useState<string>(() => {
    const local = localStorage.getItem('gp_email');
    return local || 'visiteur@garantie.gov.ma';
  });

  // Keep static lists (read-only for simplicity in this version, but queryable)
  const [metals] = useState<Metal[]>(initialMetals);
  const [titres] = useState<Titre[]>(initialTitres);
  const [categories] = useState<Categorie[]>(initialCategories);
  const [bureaux] = useState<BureauGarantie[]>(initialBureaux);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('gp_punches', JSON.stringify(punches));
  }, [punches]);

  useEffect(() => {
    localStorage.setItem('gp_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('gp_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('gp_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('gp_email', userEmail);
  }, [userEmail]);

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
    // Set a default email according to role
    if (role === 'ADMIN') setUserEmailState('admin.garantie@douane.gov.ma');
    else if (role === 'EXPERT') setUserEmailState('expert.terrain@douane.gov.ma');
    else if (role === 'AGENT') setUserEmailState('agent.casablanca@douane.gov.ma');
    else setUserEmailState('visiteur@garantie.gov.ma');
  };

  const setUserEmail = (email: string) => {
    setUserEmailState(email);
  };

  // Log helper
  const createLog = (
    action: ActivityLog['action'],
    entityType: ActivityLog['entityType'],
    entityId: string,
    entityName: string,
    details: string
  ) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      action,
      entityType,
      entityId,
      entityName,
      timestamp: new Date().toISOString(),
      details,
      userEmail,
      userRole: currentRole
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Punch Operations
  const addPunch = (newPunchData: Omit<Punch, 'id' | 'actif'>) => {
    const newId = `p-${Date.now()}`;
    const newPunch: Punch = {
      ...newPunchData,
      id: newId,
      actif: true
    };
    setPunches(prev => [newPunch, ...prev]);
    createLog(
      'CREATE',
      'POINCON',
      newId,
      newPunch.nom,
      `Ajout du poinçon référencé ${newPunch.reference} (${newPunch.nom}).`
    );
  };

  const updatePunch = (id: string, updatedFields: Partial<Punch>) => {
    setPunches(prev =>
      prev.map(p => {
        if (p.id === id) {
          const merged = { ...p, ...updatedFields };
          createLog(
            'UPDATE',
            'POINCON',
            id,
            merged.nom,
            `Modification des champs: ${Object.keys(updatedFields).join(', ')}.`
          );
          return merged;
        }
        return p;
      })
    );
  };

  const deletePunch = (id: string) => {
    const punchToDelete = punches.find(p => p.id === id);
    if (!punchToDelete) return;
    
    // Hard delete or Soft delete (we do soft delete by setting actif=false)
    setPunches(prev =>
      prev.map(p => (p.id === id ? { ...p, actif: false } : p))
    );
    createLog(
      'DELETE',
      'POINCON',
      id,
      punchToDelete.nom,
      `Désactivation du poinçon ${punchToDelete.nom} de la galerie active.`
    );
  };

  // Document Operations
  const addDocument = (newDocData: Omit<DocumentLegal, 'id'>) => {
    const newId = `doc-${Date.now()}`;
    const newDoc: DocumentLegal = {
      ...newDocData,
      id: newId
    };
    setDocuments(prev => [...prev, newDoc]);
    createLog(
      'CREATE',
      'DOCUMENT',
      newId,
      newDoc.titre,
      `Ajout du document légal : ${newDoc.titre}.`
    );
  };

  const updateDocument = (id: string, updatedFields: Partial<DocumentLegal>) => {
    setDocuments(prev =>
      prev.map(d => {
        if (d.id === id) {
          const merged = { ...d, ...updatedFields };
          createLog(
            'UPDATE',
            'DOCUMENT',
            id,
            merged.titre,
            `Modification du document légal : ${merged.titre}.`
          );
          return merged;
        }
        return d;
      })
    );
  };

  const deleteDocument = (id: string) => {
    const docToDelete = documents.find(d => d.id === id);
    if (!docToDelete) return;

    setDocuments(prev => prev.filter(d => d.id !== id));
    createLog(
      'DELETE',
      'DOCUMENT',
      id,
      docToDelete.titre,
      `Suppression définitive du document légal : ${docToDelete.titre}.`
    );
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <AppContext.Provider
      value={{
        punches,
        metals,
        titres,
        categories,
        documents,
        bureaux,
        logs,
        currentRole,
        userEmail,
        setRole,
        setUserEmail,
        addPunch,
        updatePunch,
        deletePunch,
        addDocument,
        updateDocument,
        deleteDocument,
        clearLogs
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp doit être utilisé au sein d\'un AppProvider');
  }
  return context;
};
