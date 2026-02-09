export * from './Folder';
export * from './Task';

export type RootStackParamList = {
  AllTasks: undefined;
  Folders: undefined;
  Tasks: { folderId: number; folderName: string };
  NewTask: { folderId: number };
  EditTask: { task: Task };
  NewFolder: undefined;
};
