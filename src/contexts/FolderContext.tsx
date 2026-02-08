import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import DatabaseService from '../database/DatabaseService';
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
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshFolders = async () => {
    try {
      setLoading(true);
      const allFolders = await DatabaseService.getAllFolders();
      
      // Create default folder if none exist
      if (allFolders.length === 0) {
        const defaultFolder: CreateFolderInput = {
          name: 'Edu Folder',
          color: COLORS.gray,
        };
        const id = await DatabaseService.createFolder(defaultFolder);
        allFolders.push({ id, ...defaultFolder });
      }
      
      setFolders(allFolders);
    } catch (error) {
      console.error('Error loading folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async (folder: CreateFolderInput): Promise<number> => {
    try {
      const id = await DatabaseService.createFolder(folder);
      await refreshFolders();
      return id;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  };

  const updateFolder = async (folder: UpdateFolderInput): Promise<void> => {
    try {
      await DatabaseService.updateFolder(folder);
      await refreshFolders();
    } catch (error) {
      console.error('Error updating folder:', error);
      throw error;
    }
  };

  const deleteFolder = async (id: number): Promise<void> => {
    try {
      await DatabaseService.deleteFolder(id);
      await refreshFolders();
    } catch (error) {
      console.error('Error deleting folder:', error);
      throw error;
    }
  };

  useEffect(() => {
    refreshFolders();
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