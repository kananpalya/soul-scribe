export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  passwordHash: string;
}

export interface AppState {
  theme: 'light' | 'dark';
  user: User | null;
  entries: JournalEntry[];
}