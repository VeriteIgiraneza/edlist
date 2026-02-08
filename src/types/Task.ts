export interface Task {
  id: number;
  name: string;
  folderId: number;
  dueDate: string | null;
  reminder: string | null;
  completed: boolean;
  folderName?: string;
}

export interface CreateTaskInput {
  name: string;
  folderId: number;
  dueDate: string | null;
  reminder: string | null;
}

export interface UpdateTaskInput {
  id: number;
  name: string;
  folderId: number;
  dueDate: string | null;
  reminder: string | null;
  completed: boolean;
}