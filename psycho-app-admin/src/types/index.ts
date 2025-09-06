export interface Patient {
  id: string;
  name: string;
  lastName?: string;
  email?: string;
  telegramNick?: string;
  createdAt: string;
  lastEntry?: string;
  isActive?: boolean;
}

export interface DiaryEntry {
  id: string;
  patientId: string;
  date: string;
  situation: string;
  automaticThought: string;
  emotion: string;
  emotionStrength: number; // 1-10
  attentionLevel?: 'low' | 'medium' | 'high'; // может отсутствовать
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  patientId: string;
  date: string;
  mood: number; // 1-10
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'therapist' | 'admin';
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface CreatePatientRequest {
  name: string;
  lastName?: string;
  email?: string;
  telegramNick?: string;
}

export interface UpdatePatientRequest {
  name?: string;
  lastName?: string;
  email?: string;
  telegramNick?: string;
  isActive?: boolean;
}

export interface CreateDiaryEntryRequest {
  patientId: string;
  date: string;
  situation: string;
  automaticThought: string;
  emotion: string;
  emotionStrength: number;
  attentionLevel?: 'low' | 'medium' | 'high';
}

export interface CreateMoodEntryRequest {
  patientId: string;
  date: string;
  mood: number;
  notes?: string;
}