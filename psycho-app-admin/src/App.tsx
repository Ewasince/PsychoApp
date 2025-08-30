import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Layout } from './components/Layout';
import { PatientsPage } from './components/PatientsPage';
import { DiaryPage } from './components/DiaryPage';
import { SettingsPage } from './components/SettingsPage';
import { User, Patient, DiaryEntry, MoodEntry } from './types';
import { postLogin } from './api/endpoints/apiAuth';
import { getMe } from './api/endpoints/apiUser';
import {
  getPatients,
  IPatient,
  getPatientStories,
  IStory,
  getPatientMoods,
  IMood,
} from './api/endpoints/apiPatients';
import { setTokenData, clearTokens } from './core/storage/tokens';

type AppPage = 'login' | 'patients' | 'diary' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('login');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);

  const mapPatient = (p: IPatient): Patient => ({
    id: p.id.toString(),
    name: p.firstName,
    lastName: p.lastName,
    email: '',
    createdAt: '',
  });

  const mapStory = (patientId: string) => (s: IStory): DiaryEntry => ({
    id: s.id.toString(),
    patientId,
    date: new Date(s.date * 1000).toISOString(),
    situation: s.situation,
    automaticThought: s.mind,
    emotion: s.emotion,
    emotionStrength: s.emotionPower,
    attentionLevel:
      s.mark === 3 ? 'high' : s.mark === 2 ? 'medium' : s.mark === 1 ? 'low' : undefined,
    createdAt: new Date(s.date * 1000).toISOString(),
  });

  const mapMood = (patientId: string) => (m: IMood): MoodEntry => ({
    id: m.id.toString(),
    patientId,
    date: new Date(m.date * 1000).toISOString(),
    mood: m.value,
  });

  const handleLogin = async (username: string, password: string) => {
    try {
      const res = await postLogin({ username, password });
      setTokenData(res.data);
      const meRes = await getMe();
      setUser({
        id: meRes.data.user.id.toString(),
        email: meRes.data.user.email,
        name: meRes.data.user.name,
        role: 'therapist',
        createdAt: '',
      });
      const patientsRes = await getPatients();
      setPatients(patientsRes.data.map(mapPatient));
      setCurrentPage('patients');
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    clearTokens();
    setUser(null);
    setPatients([]);
    setSelectedPatientId(null);
    setDiaryEntries([]);
    setMoodEntries([]);
    setCurrentPage('login');
  };

  const handleSelectPatient = async (patientId: string) => {
    setSelectedPatientId(patientId);
    try {
      const storiesRes = await getPatientStories(patientId);
      setDiaryEntries(storiesRes.data.stories.map(mapStory(patientId)));
      const moodsRes = await getPatientMoods(patientId);
      setMoodEntries(moodsRes.data.moods.map(mapMood(patientId)));
      setCurrentPage('diary');
    } catch (error) {
      console.error(error);
    }
  };

  const handleNavigate = (page: 'patients' | 'diary' | 'settings') => {
    if (page === 'patients') {
      setSelectedPatientId(null);
    }
    setCurrentPage(page);
  };

  const handleUpdateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const selectedPatient = selectedPatientId
    ? patients.find((p) => p.id === selectedPatientId)
    : null;

  const renderContent = () => {
    switch (currentPage) {
      case 'patients':
        return <PatientsPage patients={patients} onSelectPatient={handleSelectPatient} />;
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
          />
        );
      case 'settings':
        return <SettingsPage user={user} onUpdateUser={handleUpdateUser} />;
      default:
        return null;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      userName={user.name}
    >
      {renderContent()}
    </Layout>
  );
}
