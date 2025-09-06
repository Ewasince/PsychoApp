import { Patient, DiaryEntry, MoodEntry, User } from '../types';

export const mockUser: User = {
  id: '1',
  email: 'therapist@example.com',
  name: 'Доктор Иванов',
  role: 'therapist',
  createdAt: '2024-01-01'
};

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Илья',
    lastName: 'Столяров',
    email: 'ilya@example.com',
    telegramNick: '@ilya_stolyarov',
    createdAt: '2024-08-15',
    lastEntry: '2024-09-05',
    isActive: true
  },
  {
    id: '2',
    name: 'Anastasia',
    email: 'anastasia@example.com',
    telegramNick: '@nastya_k',
    createdAt: '2024-07-20',
    lastEntry: '2024-09-01',
    isActive: true
  },
  {
    id: '3',
    name: 'Владислав',
    email: 'vladislav@example.com',
    createdAt: '2024-06-10',
    lastEntry: '2024-08-30',
    isActive: true
  }
];

export const mockDiaryEntries: DiaryEntry[] = [
  {
    id: '1',
    patientId: '2',
    date: '2024-08-26',
    situation: 'Проснулась, почувствовала что болит горло и есть насморк',
    automaticThought: 'Буду плохо себя чувствовать, день впустую',
    emotion: 'Печаль',
    emotionStrength: 5,
    attentionLevel: 'medium',
    createdAt: '2024-08-26T10:24:00Z'
  },
  {
    id: '2',
    patientId: '2',
    date: '2024-08-27',
    situation: 'Встреча с коллегами по работе',
    automaticThought: 'Я недостаточно подготовлен',
    emotion: 'Тревога',
    emotionStrength: 7,
    attentionLevel: 'high',
    createdAt: '2024-08-27T14:30:00Z'
  },
  {
    id: '3',
    patientId: '2',
    date: '2024-08-28',
    situation: 'Просмотр социальных сетей',
    automaticThought: 'Все живут лучше меня',
    emotion: 'Зависть',
    emotionStrength: 4,
    attentionLevel: 'low',
    createdAt: '2024-08-28T20:15:00Z'
  },
  {
    id: '4',
    patientId: '2',
    date: '2024-08-29',
    situation: 'Опоздала на важную встречу из-за пробки',
    automaticThought: 'Я всегда все порчу, теперь меня точно уволят',
    emotion: 'Паника',
    emotionStrength: 8,
    attentionLevel: 'high',
    createdAt: '2024-08-29T09:15:00Z'
  },
  {
    id: '5',
    patientId: '2',
    date: '2024-08-30',
    situation: 'Получила положительный отзыв от клиента',
    automaticThought: 'Наверное, он просто вежливый, на самом деле работа была плохой',
    emotion: 'Сомнение',
    emotionStrength: 3,
    attentionLevel: 'medium',
    createdAt: '2024-08-30T16:45:00Z'
  },
  {
    id: '6',
    patientId: '2',
    date: '2024-08-31',
    situation: 'Звонок от мамы с вопросами о личной жизни',
    automaticThought: 'Я разочарование для семьи, все мои ровесники уже замужем',
    emotion: 'Стыд',
    emotionStrength: 6,
    attentionLevel: 'medium',
    createdAt: '2024-08-31T19:30:00Z'
  },
  {
    id: '7',
    patientId: '2',
    date: '2024-09-01',
    situation: 'Прогулка в парке в солнечную погоду',
    automaticThought: 'Хорошо, что решила выйти из дома',
    emotion: 'Спокойствие',
    emotionStrength: 2,
    createdAt: '2024-09-01T11:20:00Z'
  },
  {
    id: '8',
    patientId: '2',
    date: '2024-09-02',
    situation: 'Конфликт с соседом из-за шума',
    automaticThought: 'Я не умею отстаивать свои границы, все меня используют',
    emotion: 'Злость',
    emotionStrength: 7,
    attentionLevel: 'high',
    createdAt: '2024-09-02T22:10:00Z'
  },
  {
    id: '9',
    patientId: '2',
    date: '2024-09-03',
    situation: 'Просмотр фильма дома в выходной',
    automaticThought: 'Опять трачу время впустую, вместо того чтобы быть продуктивной',
    emotion: 'Вина',
    emotionStrength: 4,
    attentionLevel: 'low',
    createdAt: '2024-09-03T20:00:00Z'
  },
  {
    id: '10',
    patientId: '2',
    date: '2024-09-04',
    situation: 'Встреча с подругой в кафе',
    automaticThought: 'Она выглядит намного счастливее меня',
    emotion: 'Грусть',
    emotionStrength: 5,
    attentionLevel: 'medium',
    createdAt: '2024-09-04T15:30:00Z'
  },
  {
    id: '11',
    patientId: '2',
    date: '2024-09-05',
    situation: 'Успешно завершила сложный проект на работе',
    automaticThought: 'Может быть, у меня действительно что-то получается',
    emotion: 'Удовлетворение',
    emotionStrength: 3,
    createdAt: '2024-09-05T18:00:00Z'
  }
];

export const mockMoodEntries: MoodEntry[] = [
  { id: '1', patientId: '2', date: '2024-08-26', mood: 4, notes: 'Болею, но настроение нормальное' },
  { id: '2', patientId: '2', date: '2024-08-27', mood: 3, notes: 'Беспокойство перед встречей' },
  { id: '3', patientId: '2', date: '2024-08-28', mood: 4, notes: 'Обычный день' },
  { id: '4', patientId: '2', date: '2024-08-29', mood: 2, notes: 'Паника из-за опоздания' },
  { id: '5', patientId: '2', date: '2024-08-30', mood: 5, notes: 'Хвалили на работе' },
  { id: '6', patientId: '2', date: '2024-08-31', mood: 3, notes: 'Давление от семьи' },
  { id: '7', patientId: '2', date: '2024-09-01', mood: 6, notes: 'Прекрасная прогулка' },
  { id: '8', patientId: '2', date: '2024-09-02', mood: 2, notes: 'Конфликт с соседом' },
  { id: '9', patientId: '2', date: '2024-09-03', mood: 4, notes: 'Спокойный выходной' },
  { id: '10', patientId: '2', date: '2024-09-04', mood: 3, notes: 'Сравнения с подругой' },
  { id: '11', patientId: '2', date: '2024-09-05', mood: 7, notes: 'Успех на работе!' }
];