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
  full_name?: string;
  prodi: string;
  username: string;
  position?: 'Mahasiswa' | 'Dosen' | 'Staff';
  isVerified: boolean;
  password?: string; // Optional for mock auth
}

export interface AppConfig {
  description: string;
  downloadLink: string;
  webhookUrl: string;
}

export interface ChatSession {
  id: number;
  user_id: number;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}