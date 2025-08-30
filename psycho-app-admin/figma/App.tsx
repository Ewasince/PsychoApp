import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Layout } from './components/Layout';
import { PatientsPage } from './components/PatientsPage';
import { DiaryPage } from './components/DiaryPage';
import { SettingsPage } from './components/SettingsPage';
import { mockUser, mockPatients, mockDiaryEntries, mockMoodEntries } from './data/mockData';
import { User } from './types';

type AppPage = 'login' | 'patients' | 'diary' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [user, setUser] = useState<User>(mockUser);

  const handleLogin = (email: string, password: string) => {
    // Простая проверка для демо
    if (email && password) {
      setIsLoggedIn(true);
      setCurrentPage('patients');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
    setSelectedPatientId(null);
  };

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentPage('diary');
  };

  const handleNavigate = (page: 'patients' | 'diary' | 'settings') => {
    if (page === 'patients') {
      setSelectedPatientId(null);
    }
    setCurrentPage(page);
  };

  const handleUpdateUser = (userData: Partial<User>) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const selectedPatient = selectedPatientId 
    ? mockPatients.find(p => p.id === selectedPatientId)
    : null;

  const patientDiaryEntries = selectedPatientId
    ? mockDiaryEntries.filter(entry => entry.patientId === selectedPatientId)
    : [];

  const patientMoodEntries = selectedPatientId
    ? mockMoodEntries.filter(entry => entry.patientId === selectedPatientId)
    : [];

  const renderContent = () => {
    switch (currentPage) {
      case 'patients':
        return (
          <PatientsPage
            patients={mockPatients}
            onSelectPatient={handleSelectPatient}
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
            diaryEntries={patientDiaryEntries}
            moodEntries={patientMoodEntries}
            onBack={() => setCurrentPage('patients')}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            user={user}
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
      userName={user.name}
    >
      {renderContent()}
    </Layout>
  );
}