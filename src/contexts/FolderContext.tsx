import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import DatabaseService from '../database/DatabaseService'; // Commented out for UI development
import { mockFolders } from '../data/mockData';
import { Folder, CreateFolderInput, UpdateFolderInput } from '../types';
import { COLORS } from '../constants/colors';

interface FolderContextType {
  folders: Folder[];
  loading: boolean;
  refreshFolders: () => Promise<void>;
  createFolder: (folder: CreateFolderInput) => Promise<number>;
  updateFolder: (folder: UpdateFolderInput) => Promise<void>;
  deleteFolder: (id: number) => Promise<void>;
}

const FolderContext = createContext<FolderContextType | undefined>(undefined);

export const FolderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const [loading, setLoading] = useState(false);
  const [nextId, setNextId] = useState(mockFolders.length + 1);

  const refreshFolders = async () => {
    // Using mock data - no need to refresh from database
    // Just simulate async operation
    return Promise.resolve();
  };

  const createFolder = async (folder: CreateFolderInput): Promise<number> => {
    try {
      const newFolder: Folder = {
        id: nextId,
        name: folder.name,
        color: folder.color,
        createdAt: new Date().toISOString(),
      };
      
      setFolders(prevFolders => [...prevFolders, newFolder]);
      setNextId(prev => prev + 1);
      
      return newFolder.id;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  };

  const updateFolder = async (folder: UpdateFolderInput): Promise<void> => {
    try {
      setFolders(prevFolders => 
        prevFolders.map(f => 
          f.id === folder.id 
            ? { ...f, name: folder.name, color: folder.color }
            : f
        )
      );
    } catch (error) {
      console.error('Error updating folder:', error);
      throw error;
    }
  };

  const deleteFolder = async (id: number): Promise<void> => {
    try {
      setFolders(prevFolders => prevFolders.filter(f => f.id !== id));
    } catch (error) {
      console.error('Error deleting folder:', error);
      throw error;
    }
  };

  // Initialize with mock data on mount
  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <FolderContext.Provider
      value={{
        folders,
        loading,
        refreshFolders,
        createFolder,
        updateFolder,
        deleteFolder,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};

export const useFolders = (): FolderContextType => {
  const context = useContext(FolderContext);
  if (!context) {
    throw new Error('useFolders must be used within FolderProvider');
  }
  return context;
};