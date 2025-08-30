export interface Patient {
  id: string;
  name: string;
  lastName?: string;
  email?: string;
  createdAt: string;
  lastEntry?: string;
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