import * as SQLite from 'expo-sqlite';
import { DATABASE_NAME } from '../constants/config';
import { Folder, CreateFolderInput, UpdateFolderInput } from '../types/Folder';
import { Task, CreateTaskInput, UpdateTaskInput } from '../types/Task';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async openDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (this.db) return this.db;
    
    this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await this.createTables();
    return this.db;
  }

  private async createTables() {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS folders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        color TEXT NOT NULL
      );
    `);

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        folder_id INTEGER NOT NULL,
        due_date TEXT,
        reminder TEXT,
        completed INTEGER DEFAULT 0,
        FOREIGN KEY(folder_id) REFERENCES folders(id)
      );
    `);
  }

  // FOLDER OPERATIONS
  async getAllFolders(): Promise<Folder[]> {
    const db = await this.openDatabase();
    const result = await db.getAllAsync<Folder>('SELECT * FROM folders');
    return result;
  }

  async getFolder(id: number): Promise<Folder | null> {
    const db = await this.openDatabase();
    const result = await db.getFirstAsync<Folder>(
      'SELECT * FROM folders WHERE id = ?',
      [id]
    );
    return result || null;
  }

  async createFolder(folder: CreateFolderInput): Promise<number> {
    const db = await this.openDatabase();
    const result = await db.runAsync(
      'INSERT INTO folders (name, color) VALUES (?, ?)',
      [folder.name, folder.color]
    );
    return result.lastInsertRowId;
  }

  async updateFolder(folder: UpdateFolderInput): Promise<void> {
    const db = await this.openDatabase();
    await db.runAsync(
      'UPDATE folders SET name = ?, color = ? WHERE id = ?',
      [folder.name, folder.color, folder.id]
    );
  }

  async deleteFolder(id: number): Promise<void> {
    const db = await this.openDatabase();
    await db.runAsync('DELETE FROM folders WHERE id = ?', [id]);
  }

  async getFoldersCount(): Promise<number> {
    const db = await this.openDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM folders'
    );
    return result?.count || 0;
  }

  // TASK OPERATIONS
  async getAllTasks(): Promise<Task[]> {
    const db = await this.openDatabase();
    const result = await db.getAllAsync<Task>(`
      SELECT 
        tasks.id,
        tasks.name,
        tasks.folder_id as folderId,
        tasks.due_date as dueDate,
        tasks.reminder,
        tasks.completed,
        folders.name as folderName
      FROM tasks
      LEFT JOIN folders ON tasks.folder_id = folders.id
      ORDER BY 
        tasks.completed ASC,
        CASE WHEN tasks.due_date IS NULL OR tasks.due_date = '' THEN 1 ELSE 0 END,
        tasks.due_date ASC
    `);
    return result.map(task => ({ ...task, completed: task.completed === 1 }));
  }

  async getTasksByFolder(folderId: number): Promise<Task[]> {
    const db = await this.openDatabase();
    const result = await db.getAllAsync<Task>(`
      SELECT 
        id,
        name,
        folder_id as folderId,
        due_date as dueDate,
        reminder,
        completed
      FROM tasks
      WHERE folder_id = ?
      ORDER BY 
        completed ASC,
        CASE WHEN due_date IS NULL OR due_date = '' THEN 1 ELSE 0 END,
        due_date ASC
    `, [folderId]);
    return result.map(task => ({ ...task, completed: task.completed === 1 }));
  }

  async getTask(id: number): Promise<Task | null> {
    const db = await this.openDatabase();
    const result = await db.getFirstAsync<Task>(`
      SELECT 
        id,
        name,
        folder_id as folderId,
        due_date as dueDate,
        reminder,
        completed
      FROM tasks
      WHERE id = ?
    `, [id]);
    if (!result) return null;
    return { ...result, completed: result.completed === 1 };
  }

  async createTask(task: CreateTaskInput): Promise<number> {
    const db = await this.openDatabase();
    const result = await db.runAsync(
      'INSERT INTO tasks (name, folder_id, due_date, reminder, completed) VALUES (?, ?, ?, ?, 0)',
      [task.name, task.folderId, task.dueDate || null, task.reminder || null]
    );
    return result.lastInsertRowId;
  }

  async updateTask(task: UpdateTaskInput): Promise<void> {
    const db = await this.openDatabase();
    await db.runAsync(
      'UPDATE tasks SET name = ?, folder_id = ?, due_date = ?, reminder = ?, completed = ? WHERE id = ?',
      [task.name, task.folderId, task.dueDate || null, task.reminder || null, task.completed ? 1 : 0, task.id]
    );
  }

  async deleteTask(id: number): Promise<void> {
    const db = await this.openDatabase();
    await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
  }

  async getTasksWithReminders(): Promise<Task[]> {
    const db = await this.openDatabase();
    const result = await db.getAllAsync<Task>(`
      SELECT 
        id,
        name,
        folder_id as folderId,
        due_date as dueDate,
        reminder,
        completed
      FROM tasks
      WHERE reminder IS NOT NULL AND reminder != ''
    `);
    return result.map(task => ({ ...task, completed: task.completed === 1 }));
  }
}

export default new DatabaseService();