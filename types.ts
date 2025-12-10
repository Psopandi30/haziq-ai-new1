export interface Message {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  feedback?: 'like' | 'dislike' | null;
}

export interface QuickAction {
  label: string;
  query: string;
}

export interface UserData {
  id: number;
  nim: string;
  name: string;
  prodi: string;
  username: string;
  isVerified: boolean;
  password?: string; // Optional for mock auth
}

export interface AppConfig {
  description: string;
  downloadLink: string;
}