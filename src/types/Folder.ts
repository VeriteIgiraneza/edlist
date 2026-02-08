export interface Folder {
  id: number;
  name: string;
  color: string;
}

export interface CreateFolderInput {
  name: string;
  color: string;
}

export interface UpdateFolderInput {
  id: number;
  name: string;
  color: string;
}