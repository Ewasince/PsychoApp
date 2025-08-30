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
    createdAt: '2024-08-15',
    lastEntry: '2024-08-29'
  },
  {
    id: '2',
    name: 'Anastasia',
    email: 'anastasia@example.com',
    createdAt: '2024-07-20',
    lastEntry: '2024-08-28'
  },
  {
    id: '3',
    name: 'Владислав',
    email: 'vladislav@example.com',
    createdAt: '2024-06-10',
    lastEntry: '2024-08-25'
  }
];

export const mockDiaryEntries: DiaryEntry[] = [
  {
    id: '1',
    patientId: '2',
    date: '2024-08-14',
    situation: 'Проснулась, почувствовала что болит горло и есть насморк',
    automaticThought: 'Буду плохо себя чувствовать, день впустую',
    emotion: 'Печаль',
    emotionStrength: 5,
    attentionLevel: 'medium',
    createdAt: '2024-08-14T10:24:00Z'
  },
  {
    id: '2',
    patientId: '2',
    date: '2024-08-15',
    situation: 'Встреча с коллегами по работе',
    automaticThought: 'Я недостаточно подготовлен',
    emotion: 'Тревога',
    emotionStrength: 7,
    attentionLevel: 'high',
    createdAt: '2024-08-15T14:30:00Z'
  },
  {
    id: '3',
    patientId: '2',
    date: '2024-08-16',
    situation: 'Просмотр социальных сетей',
    automaticThought: 'Все живут лучше меня',
    emotion: 'Зависть',
    emotionStrength: 4,
    attentionLevel: 'low',
    createdAt: '2024-08-16T20:15:00Z'
  },
  {
    id: '4',
    patientId: '2',
    date: '2024-08-17',
    situation: 'Опоздала на важную встречу из-за пробки',
    automaticThought: 'Я всегда все порчу, теперь меня точно уволят',
    emotion: 'Паника',
    emotionStrength: 8,
    attentionLevel: 'high',
    createdAt: '2024-08-17T09:15:00Z'
  },
  {
    id: '5',
    patientId: '2',
    date: '2024-08-18',
    situation: 'Получила положительный отзыв от клиента',
    automaticThought: 'Наверное, он просто вежливый, на самом деле работа была плохой',
    emotion: 'Сомнение',
    emotionStrength: 3,
    attentionLevel: 'medium',
    createdAt: '2024-08-18T16:45:00Z'
  },
  {
    id: '6',
    patientId: '2',
    date: '2024-08-19',
    situation: 'Звонок от мамы с вопросами о личной жизни',
    automaticThought: 'Я разочарование для семьи, все мои ровесники уже замужем',
    emotion: 'Стыд',
    emotionStrength: 6,
    attentionLevel: 'medium',
    createdAt: '2024-08-19T19:30:00Z'
  },
  {
    id: '7',
    patientId: '2',
    date: '2024-08-20',
    situation: 'Прогулка в парке в солнечную погоду',
    automaticThought: 'Хорошо, что решила выйти из дома',
    emotion: 'Спокойствие',
    emotionStrength: 2,
    createdAt: '2024-08-20T11:20:00Z'
  },
  {
    id: '8',
    patientId: '2',
    date: '2024-08-21',
    situation: 'Конфликт с соседом из-за шума',
    automaticThought: 'Я не умею отстаивать свои границы, все меня используют',
    emotion: 'Злость',
    emotionStrength: 7,
    attentionLevel: 'high',
    createdAt: '2024-08-21T22:10:00Z'
  },
  {
    id: '9',
    patientId: '2',
    date: '2024-08-22',
    situation: 'Просмотр фильма дома в выходной',
    automaticThought: 'Опять трачу время впустую, вместо того чтобы быть продуктивной',
    emotion: 'Вина',
    emotionStrength: 4,
    attentionLevel: 'low',
    createdAt: '2024-08-22T20:00:00Z'
  },
  {
    id: '10',
    patientId: '2',
    date: '2024-08-23',
    situation: 'Встреча с подругой в кафе',
    automaticThought: 'Она выглядит намного счастливее меня',
    emotion: 'Грусть',
    emotionStrength: 5,
    attentionLevel: 'medium',
    createdAt: '2024-08-23T15:30:00Z'
  },
  {
    id: '11',
    patientId: '2',
    date: '2024-08-24',
    situation: 'Успешно завершила сложный проект на работе',
    automaticThought: 'Может быть, у меня действительно что-то получается',
    emotion: 'Удовлетворение',
    emotionStrength: 3,
    createdAt: '2024-08-24T18:00:00Z'
  },
  {
    id: '12',
    patientId: '2',
    date: '2024-08-25',
    situation: 'Читала негативные новости перед сном',
    automaticThought: 'Мир становится все хуже, нет смысла строить планы',
    emotion: 'Безнадежность',
    emotionStrength: 8,
    attentionLevel: 'high',
    createdAt: '2024-08-25T23:45:00Z'
  },
  {
    id: '13',
    patientId: '2',
    date: '2024-08-26',
    situation: 'Занятие йогой утром',
    automaticThought: 'Хорошо, что нашла время позаботиться о себе',
    emotion: 'Умиротворение',
    emotionStrength: 2,
    createdAt: '2024-08-26T08:30:00Z'
  },
  {
    id: '14',
    patientId: '2',
    date: '2024-08-27',
    situation: 'Ошибка в важном документе, которую заметил руководитель',
    automaticThought: 'Я некомпетентная, все видят мои недостатки',
    emotion: 'Стыд',
    emotionStrength: 9,
    attentionLevel: 'high',
    createdAt: '2024-08-27T14:20:00Z'
  },
  {
    id: '15',
    patientId: '2',
    date: '2024-08-28',
    situation: 'Приготовила ужин для себя',
    automaticThought: 'Приятно делать что-то хорошее для себя',
    emotion: 'Забота',
    emotionStrength: 2,
    createdAt: '2024-08-28T19:15:00Z'
  },
  {
    id: '16',
    patientId: '2',
    date: '2024-08-29',
    situation: 'Предстоящая презентация завтра',
    automaticThought: 'Я обязательно провалюсь, все поймут что я не знаю о чем говорю',
    emotion: 'Страх',
    emotionStrength: 7,
    attentionLevel: 'high',
    createdAt: '2024-08-29T21:00:00Z'
  }
];

export const mockMoodEntries: MoodEntry[] = [
  { id: '1', patientId: '2', date: '2024-08-14', mood: 4, notes: 'Болею, но настроение нормальное' },
  { id: '2', patientId: '2', date: '2024-08-15', mood: 3, notes: 'Беспокойство перед встречей' },
  { id: '3', patientId: '2', date: '2024-08-16', mood: 4, notes: 'Обычный день' },
  { id: '4', patientId: '2', date: '2024-08-17', mood: 2, notes: 'Паника из-за опоздания' },
  { id: '5', patientId: '2', date: '2024-08-18', mood: 5, notes: 'Хвалили на работе' },
  { id: '6', patientId: '2', date: '2024-08-19', mood: 3, notes: 'Давление от семьи' },
  { id: '7', patientId: '2', date: '2024-08-20', mood: 6, notes: 'Прекрасная прогулка' },
  { id: '8', patientId: '2', date: '2024-08-21', mood: 2, notes: 'Конфликт с соседом' },
  { id: '9', patientId: '2', date: '2024-08-22', mood: 4, notes: 'Спокойный выходной' },
  { id: '10', patientId: '2', date: '2024-08-23', mood: 3, notes: 'Сравнения с подругой' },
  { id: '11', patientId: '2', date: '2024-08-24', mood: 7, notes: 'Успех на работе!' },
  { id: '12', patientId: '2', date: '2024-08-25', mood: 1, notes: 'Негативные новости' },
  { id: '13', patientId: '2', date: '2024-08-26', mood: 6, notes: 'Йога помогла' },
  { id: '14', patientId: '2', date: '2024-08-27', mood: 2, notes: 'Ошибка на работе' },
  { id: '15', patientId: '2', date: '2024-08-28', mood: 5, notes: 'Забота о себе' },
  { id: '16', patientId: '2', date: '2024-08-29', mood: 3, notes: 'Волнение перед презентацией' },
  { id: '17', patientId: '2', date: '2024-08-30', mood: 4, notes: 'Обычное утро' }
];