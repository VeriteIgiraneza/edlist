export * from './Folder';
export * from './Task';

export type RootStackParamList = {
  AllTasks: undefined;
  Folders: undefined;
  Tasks: { folderId: number; folderName: string };
  NewFolder: undefined;
  NewTask: { folderId: number };
  EditTask: { task: Task };
  FocusSession: undefined;
};

export interface Task {
  id: number;
  name: string;
  folderId: number;
  dueDate: string | null;
  reminder: string | null;
  completed: boolean;
  estimatedMinutes?: number | null;
  actualMinutes?: number | null;
  timerActive?: boolean;
  timerStartedAt?: string | null;
}