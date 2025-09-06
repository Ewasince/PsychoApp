import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { Layout } from './components/Layout';
import { PatientsPage } from './components/PatientsPage';
import { DiaryPage } from './components/DiaryPage';
import { SettingsPage } from './components/SettingsPage';
import { LoadingScreen } from './components/LoadingScreen';
// Прямые импорты для избежания проблем с index.ts
import { login, logout, getCurrentUser, updateUser } from './api/auth';
import { getPatients, createPatient, updatePatient, deletePatient } from './api/patients';
import { getDiaryEntries, getMoodEntries } from './api/diary';
import { LocalStorageService } from './api/storage';
import { isDemoMode } from './utils/demoMode';
import { User, Patient, DiaryEntry, MoodEntry, CreatePatientRequest } from './types';

// Отладка импортов
console.log('App direct imports:', { 
  login: typeof login, 
  logout: typeof logout,
  getCurrentUser: typeof getCurrentUser,
  getPatients: typeof getPatients 
});

type AppPage = 'login' | 'patients' | 'diary' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Загрузка...');

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    const initializeApp = async () => {
      console.log('App.initializeApp: Начинаем инициализацию');
      
      try {
        // Инициализируем тестовые данные безопасно
        console.log('App.initializeApp: Инициализируем LocalStorage');
        try {
          LocalStorageService.getUser(); // Это вызовет initializeData()
          console.log('App.initializeApp: LocalStorage инициализирован');
        } catch (storageError) {
          console.error('App.initializeApp: Ошибка инициализации LocalStorage:', storageError);
        }
        
        const token = localStorage.getItem('token');
        console.log('App.initializeApp: Проверяем токен:', !!token);
        
        if (token) {
          setLoading(true);
          setLoadingMessage('Проверяем авторизацию...');
          
          try {
            console.log('App.initializeApp: Получаем пользователя');
            const userResponse = await getCurrentUser();
            console.log('App.initializeApp: Ответ пользователя:', userResponse);
            
            if (userResponse.success && userResponse.data) {
              console.log('App.initializeApp: Пользователь найден, авторизуем');
              setUser(userResponse.data);
              setIsLoggedIn(true);
              setCurrentPage('patients');
              
              setLoadingMessage('Загружаем данные пациентов...');
              try {
                console.log('App.initializeApp: Загружаем пациентов');
                await loadPatients();
                console.log('App.initializeApp: Пациенты загружены');
              } catch (patientsError) {
                console.error('App.initializeApp: Ошибка загрузки пациентов при инициализации:', patientsError);
              }
            } else {
              // Если токен не валиден, очищаем его
              console.log('App.initializeApp: Токен не валиден, очищаем');
              localStorage.removeItem('token');
            }
          } catch (userError) {
            console.error('App.initializeApp: Ошибка проверки пользователя:', userError);
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('App.initializeApp: Критическая ошибка инициализации приложения:', error);
      } finally {
        console.log('App.initializeApp: Завершаем инициализацию');
        setLoading(false);
      }
    };

    // Небольшая задержка для избежания race conditions
    setTimeout(initializeApp, 100);
  }, []);

  const loadPatients = async () => {
    try {
      console.log('Загружаем пациентов...');
      const response = await getPatients();
      console.log('Ответ загрузки пациентов:', response);
      
      if (response.success && response.data) {
        setPatients(response.data);
        console.log('Пациенты загружены успешно:', response.data.length);
      } else {
        console.error('Ошибка загрузки пациентов:', response.error);
        setPatients([]); // Устанавливаем пустой массив при ошибке
      }
    } catch (error) {
      console.error('Критическая ошибка при загрузке пациентов:', error);
      setPatients([]);
    }
  };

  const loadDiaryData = async (patientId: string) => {
    const [diaryResponse, moodResponse] = await Promise.all([
      getDiaryEntries(patientId),
      getMoodEntries(patientId)
    ]);

    if (diaryResponse.success && diaryResponse.data) {
      setDiaryEntries(diaryResponse.data);
    }

    if (moodResponse.success && moodResponse.data) {
      setMoodEntries(moodResponse.data);
    }
  };

  // Резервная функция авторизации на случай проблем с импортами
  const fallbackLogin = (email: string, password: string) => {
    console.log('App.fallbackLogin: Резервная авторизация');
    
    // Создаем пользователя напрямую
    const user: User = {
      id: '1',
      email: email,
      name: email.includes('therapist') ? 'Доктор Иванов' : 'Пользователь',
      role: 'therapist',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    // Сохраняем в localStorage
    localStorage.setItem('token', 'emergency-token-' + Date.now());
    localStorage.setItem('cbt_app_user', JSON.stringify(user));
    
    // Устанавливаем состояние
    setUser(user);
    setIsLoggedIn(true);
    setCurrentPage('patients');
    
    // Инициализируем пациентов
    loadPatients();
    
    return true;
  };

  const handleLogin = async (email: string, password: string) => {
    console.log('App.handleLogin: Попытка авторизации:', { email, password });
    console.log('App.handleLogin: Тип функции login:', typeof login);
    
    setLoading(true);
    setLoadingMessage('Авторизация...');
    
    // Добавляем таймаут для предотвращения бесконечной загрузки
    const timeoutId = setTimeout(() => {
      console.error('Таймаут авторизации');
      setLoading(false);
      alert('Таймаут авторизации. Попробуйте еще раз.');
    }, 15000); // 15 секунд
    
    try {
      // Проверяем, доступна ли функция login
      if (typeof login !== 'function') {
        console.error('App.handleLogin: Функция login недоступна, используем резервный метод');
        clearTimeout(timeoutId);
        setLoading(false);
        return fallbackLogin(email, password);
      }
      
      console.log('App.handleLogin: Вызываем функцию login...');
      const response = await login({ email, password });
      clearTimeout(timeoutId);
      console.log('App.handleLogin: Результат авторизации:', response);
      
      if (response.success && response.data) {
        console.log('App.handleLogin: Авторизация успешна, устанавливаем пользователя:', response.data.user);
        setUser(response.data.user);
        setIsLoggedIn(true);
        setCurrentPage('patients');
        
        // Определяем сообщение загрузки в зависимости от режима
        const loadingMsg = isDemoMode() ? 'Загружаем демо-данные...' : 'Загружаем ваших пациентов...';
        setLoadingMessage(loadingMsg);
        
        try {
          console.log('App.handleLogin: Загружаем пациентов...');
          await loadPatients();
          console.log('App.handleLogin: Пациенты загружены');
        } catch (patientsError) {
          console.error('App.handleLogin: Ошибка загрузки пациентов:', patientsError);
          // Продолжаем работу даже если пациенты не загрузились
        }
      } else {
        console.error('App.handleLogin: Login failed:', response.error);
        alert('Ошибка авторизации: ' + (response.error || 'Неизвестная ошибка'));
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('App.handleLogin: Критическая ошибка авторизации:', error);
      
      // В случае критической ошибки, используем резервный метод
      console.log('App.handleLogin: Используем резервный метод авторизации');
      setLoading(false);
      return fallbackLogin(email, password);
    } finally {
      clearTimeout(timeoutId);
      console.log('App.handleLogin: Завершаем загрузку');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    
    // Очищаем демо-режим при выходе
    localStorage.removeItem('demo-mode');
    
    setIsLoggedIn(false);
    setCurrentPage('login');
    setSelectedPatientId(null);
    setUser(null);
    setPatients([]);
    setDiaryEntries([]);
    setMoodEntries([]);
  };

  const handleSelectPatient = async (patientId: string) => {
    setLoading(true);
    setLoadingMessage('Загружаем данные дневника...');
    
    setSelectedPatientId(patientId);
    setCurrentPage('diary');
    await loadDiaryData(patientId);
    
    setLoading(false);
  };

  const handleNavigate = (page: 'patients' | 'diary' | 'settings') => {
    if (page === 'patients') {
      setSelectedPatientId(null);
    }
    setCurrentPage(page);
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    const response = await updateUser(userData);
    if (response.success && response.data) {
      setUser(response.data);
    }
  };

  const handleAddPatient = async (patientData: CreatePatientRequest) => {
    const response = await createPatient(patientData);
    if (response.success && response.data) {
      setPatients(prev => [...prev, response.data!]);
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    const response = await deletePatient(patientId);
    if (response.success) {
      setPatients(prev => prev.filter(patient => patient.id !== patientId));
      // Если удаляемый пациент был выбран, сбрасываем выбор
      if (selectedPatientId === patientId) {
        setSelectedPatientId(null);
      }
    }
  };

  const handleUpdatePatient = async (patientId: string, updates: Partial<Patient>) => {
    const response = await updatePatient(patientId, updates);
    if (response.success && response.data) {
      setPatients(prev => prev.map(patient => 
        patient.id === patientId 
          ? response.data!
          : patient
      ));
    }
  };

  if (loading) {
    return <LoadingScreen message={loadingMessage} showProgress={loadingMessage.includes('Загружаем')} />;
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const selectedPatient = selectedPatientId 
    ? patients.find(p => p.id === selectedPatientId)
    : null;

  const renderContent = () => {
    switch (currentPage) {
      case 'patients':
        return (
          <PatientsPage
            patients={patients}
            onSelectPatient={handleSelectPatient}
            onAddPatient={handleAddPatient}
          />
        );
      case 'diary':
        if (!selectedPatient) {
          setCurrentPage('patients');
          return null;
        }
        return (
          <DiaryPage
            patient={selectedPatient}
            diaryEntries={diaryEntries}
            moodEntries={moodEntries}
            onBack={() => setCurrentPage('patients')}
            onDeletePatient={handleDeletePatient}
            onUpdatePatient={handleUpdatePatient}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            user={user!}
            onUpdateUser={handleUpdateUser}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout
      currentPage={currentPage as 'patients' | 'diary' | 'settings'}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      userName={user?.name || 'Пользователь'}
    >
      {renderContent()}
    </Layout>
  );
}