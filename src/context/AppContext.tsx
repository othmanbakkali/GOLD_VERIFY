import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Punch, Metal, Titre, Categorie, DocumentLegal, BureauGarantie, ActivityLog, UserRole, UserAccount, RolePermissions } from '../types';
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

  // Authentication & Dynamic access control
  userAccounts: UserAccount[];
  permissionsGrid: RolePermissions[];
  currentUser: UserAccount | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateRolePermissions: (role: UserRole, permissions: Partial<RolePermissions>) => void;
  addUserAccount: (user: Omit<UserAccount, 'id'>) => void;
  updateUserAccount: (id: string, user: Partial<UserAccount>) => void;
  deleteUserAccount: (id: string) => void;
  
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

const defaultAccounts: UserAccount[] = [
  { id: 'u-admin', nom: 'Chérif Alami', email: 'admin@douane.gov.ma', password: 'admin123', role: 'ADMIN' },
  { id: 'u-expert', nom: 'Meryem Benjelloun', email: 'expert@douane.gov.ma', password: 'expert123', role: 'EXPERT' },
  { id: 'u-agent', nom: 'Youssef Naciri', email: 'agent@douane.gov.ma', password: 'agent123', role: 'AGENT' },
  { id: 'u-vendeur', nom: 'Bijouterie Royale', email: 'vendeur@bijouterie.ma', password: 'vendeur123', role: 'VENDEUR' }
];

const defaultPermissions: RolePermissions[] = [
  {
    role: 'ADMIN',
    dashboard: true,
    catalog: true,
    scanner: true,
    map: true,
    admin: true,
    managePunches: true,
    manageDocuments: true,
    viewLogs: true,
    managePermissions: true
  },
  {
    role: 'EXPERT',
    dashboard: true,
    catalog: true,
    scanner: true,
    map: true,
    admin: true,
    managePunches: true,
    manageDocuments: true,
    viewLogs: true,
    managePermissions: false
  },
  {
    role: 'AGENT',
    dashboard: true,
    catalog: true,
    scanner: true,
    map: true,
    admin: false,
    managePunches: false,
    manageDocuments: false,
    viewLogs: false,
    managePermissions: false
  },
  {
    role: 'VENDEUR',
    dashboard: true,
    catalog: true,
    scanner: true,
    map: true,
    admin: false,
    managePunches: false,
    manageDocuments: false,
    viewLogs: false,
    managePermissions: false
  },
  {
    role: 'PUBLIC',
    dashboard: true,
    catalog: true,
    scanner: true,
    map: true,
    admin: false,
    managePunches: false,
    manageDocuments: false,
    viewLogs: false,
    managePermissions: false
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const local = localStorage.getItem('gp_current_user');
    return local ? JSON.parse(local) : null;
  });

  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() => {
    const local = localStorage.getItem('gp_user_accounts');
    return local ? JSON.parse(local) : defaultAccounts;
  });

  const [permissionsGrid, setPermissionsGrid] = useState<RolePermissions[]>(() => {
    const local = localStorage.getItem('gp_permissions_grid');
    return local ? JSON.parse(local) : defaultPermissions;
  });

  // Derived states for compatibility
  const currentRole = currentUser?.role || 'PUBLIC';
  const userEmail = currentUser?.email || 'visiteur@garantie.gov.ma';

  // Keep static lists (read-only for simplicity in this version, but queryable)
  const [metals] = useState<Metal[]>(initialMetals);
  const [titres] = useState<Titre[]>(initialTitres);
  const [categories] = useState<Categorie[]>(initialCategories);
  const [bureaux] = useState<BureauGarantie[]>(initialBureaux);

  // Sync state from backend on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const resPunches = await fetch(`${API_URL}/punches`);
        if (resPunches.ok) {
          const data = await resPunches.json();
          setPunches(data);
          localStorage.setItem('gp_punches', JSON.stringify(data));
        }
      } catch (err) {
        console.warn("Failed to fetch punches, using local cache", err);
      }

      try {
        const resDocs = await fetch(`${API_URL}/documents`);
        if (resDocs.ok) {
          const data = await resDocs.json();
          setDocuments(data);
          localStorage.setItem('gp_documents', JSON.stringify(data));
        }
      } catch (err) {
        console.warn("Failed to fetch documents, using local cache", err);
      }

      try {
        const resUsers = await fetch(`${API_URL}/users`);
        if (resUsers.ok) {
          const data = await resUsers.json();
          setUserAccounts(data);
          localStorage.setItem('gp_user_accounts', JSON.stringify(data));
        }
      } catch (err) {
        console.warn("Failed to fetch user accounts, using local cache", err);
      }

      try {
        const resPerms = await fetch(`${API_URL}/permissions`);
        if (resPerms.ok) {
          const data = await resPerms.json();
          setPermissionsGrid(data);
          localStorage.setItem('gp_permissions_grid', JSON.stringify(data));
        }
      } catch (err) {
        console.warn("Failed to fetch permissions, using local cache", err);
      }

      try {
        const resLogs = await fetch(`${API_URL}/logs`);
        if (resLogs.ok) {
          const data = await resLogs.json();
          setLogs(data);
          localStorage.setItem('gp_logs', JSON.stringify(data));
        }
      } catch (err) {
        console.warn("Failed to fetch logs, using local cache", err);
      }
    };

    loadData();
  }, [API_URL]);

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
    if (currentUser) {
      localStorage.setItem('gp_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('gp_current_user');
    }
    localStorage.setItem('gp_role', currentRole);
    localStorage.setItem('gp_email', userEmail);
  }, [currentUser, currentRole, userEmail]);

  useEffect(() => {
    localStorage.setItem('gp_user_accounts', JSON.stringify(userAccounts));
  }, [userAccounts]);

  useEffect(() => {
    localStorage.setItem('gp_permissions_grid', JSON.stringify(permissionsGrid));
  }, [permissionsGrid]);

  const setRole = (role: UserRole) => {
    const account = userAccounts.find(u => u.role === role);
    if (account) {
      setCurrentUser(account);
      createLog('LOGIN', 'SECURITE', account.id, account.nom, `Simulation de connexion par changement de rôle.`);
    } else if (role === 'PUBLIC') {
      setCurrentUser(null);
      createLog('LOGOUT', 'SECURITE', 'public', 'Visiteur', `Déconnexion vers le mode public.`);
    }
  };

  const setUserEmail = (email: string) => {
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, email } : null);
    }
  };

  // Log helper
  const createLog = async (
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

    try {
      await fetch(`${API_URL}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
      });
    } catch (err) {
      console.warn("Failed to sync log to server", err);
    }
  };

  // Punch Operations
  const addPunch = async (newPunchData: Omit<Punch, 'id' | 'actif'>) => {
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

    try {
      await fetch(`${API_URL}/punches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPunch)
      });
    } catch (err) {
      console.warn("Failed to sync punch to server", err);
    }
  };

  const updatePunch = async (id: string, updatedFields: Partial<Punch>) => {
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

    try {
      await fetch(`${API_URL}/punches/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
    } catch (err) {
      console.warn("Failed to sync updated punch to server", err);
    }
  };

  const deletePunch = async (id: string) => {
    const punchToDelete = punches.find(p => p.id === id);
    if (!punchToDelete) return;
    
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

    try {
      await fetch(`${API_URL}/punches/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn("Failed to sync deleted punch to server", err);
    }
  };

  // Document Operations
  const addDocument = async (newDocData: Omit<DocumentLegal, 'id'>) => {
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

    try {
      await fetch(`${API_URL}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoc)
      });
    } catch (err) {
      console.warn("Failed to sync document to server", err);
    }
  };

  const updateDocument = async (id: string, updatedFields: Partial<DocumentLegal>) => {
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

    try {
      await fetch(`${API_URL}/documents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
    } catch (err) {
      console.warn("Failed to sync updated document to server", err);
    }
  };

  const deleteDocument = async (id: string) => {
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

    try {
      await fetch(`${API_URL}/documents/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn("Failed to sync deleted document to server", err);
    }
  };

  const clearLogs = async () => {
    setLogs([]);
    try {
      await fetch(`${API_URL}/logs`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn("Failed to sync cleared logs to server", err);
    }
  };

  const login = (email: string, password: string): boolean => {
    const account = userAccounts.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (account) {
      setCurrentUser(account);
      const logDetails = `Connexion de l'utilisateur ${account.nom} (${account.role}).`;
      createLog('LOGIN', 'SECURITE', account.id, account.nom, logDetails);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      const logDetails = `Déconnexion de l'utilisateur ${currentUser.nom}.`;
      createLog('LOGOUT', 'SECURITE', currentUser.id, currentUser.nom, logDetails);
    }
    setCurrentUser(null);
  };

  const updateRolePermissions = async (role: UserRole, updatedPerms: Partial<RolePermissions>) => {
    setPermissionsGrid(prev =>
      prev.map(p => {
        if (p.role === role) {
          const merged = { ...p, ...updatedPerms };
          createLog(
            'CONFIG',
            'SECURITE',
            role,
            `Rôle ${role}`,
            `Modification des permissions de sécurité pour le rôle ${role}.`
          );
          return merged;
        }
        return p;
      })
    );

    try {
      await fetch(`${API_URL}/permissions/${role}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPerms)
      });
    } catch (err) {
      console.warn("Failed to sync permissions to server", err);
    }
  };

  const addUserAccount = async (newUserData: Omit<UserAccount, 'id'>) => {
    const newId = `u-${Date.now()}`;
    const newUser: UserAccount = {
      ...newUserData,
      id: newId
    };
    setUserAccounts(prev => [...prev, newUser]);
    createLog(
      'CONFIG',
      'SECURITE',
      newId,
      newUser.nom,
      `Création du compte utilisateur ${newUser.nom} (${newUser.role}, ${newUser.email}).`
    );

    try {
      await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
    } catch (err) {
      console.warn("Failed to sync new user account to server", err);
    }
  };

  const updateUserAccount = async (id: string, updatedFields: Partial<UserAccount>) => {
    setUserAccounts(prev =>
      prev.map(u => {
        if (u.id === id) {
          const merged = { ...u, ...updatedFields };
          createLog(
            'CONFIG',
            'SECURITE',
            id,
            merged.nom,
            `Mise à jour du compte ${merged.nom} (${Object.keys(updatedFields).join(', ')}).`
          );
          if (currentUser && currentUser.id === id) {
            setCurrentUser(merged);
          }
          return merged;
        }
        return u;
      })
    );

    try {
      await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
    } catch (err) {
      console.warn("Failed to sync updated user account to server", err);
    }
  };

  const deleteUserAccount = async (id: string) => {
    const userToDelete = userAccounts.find(u => u.id === id);
    if (!userToDelete) return;
    setUserAccounts(prev => prev.filter(u => u.id !== id));
    createLog(
      'CONFIG',
      'SECURITE',
      id,
      userToDelete.nom,
      `Suppression définitive du compte utilisateur ${userToDelete.nom}.`
    );
    if (currentUser && currentUser.id === id) {
      setCurrentUser(null);
    }

    try {
      await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn("Failed to sync deleted user account to server", err);
    }
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
        userAccounts,
        permissionsGrid,
        currentUser,
        login,
        logout,
        updateRolePermissions,
        addUserAccount,
        updateUserAccount,
        deleteUserAccount,
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
