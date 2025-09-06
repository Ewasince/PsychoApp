import { DiaryEntry, MoodEntry, Patient } from "../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  ArrowLeft,
  Settings,
  AlertTriangle,
  AlertCircle,
  Info,
  Trash2,
  User,
  UserX,
  UserCheck,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useMemo, useEffect } from "react";

interface DiaryPageProps {
  patient: Patient;
  diaryEntries: DiaryEntry[];
  moodEntries: MoodEntry[];
  onBack: () => void;
  onDeletePatient?: (patientId: string) => void;
  onUpdatePatient?: (patientId: string, updates: Partial<Patient>) => void;
}

export function DiaryPage({
  patient,
  diaryEntries,
  moodEntries,
  onBack,
  onDeletePatient,
  onUpdatePatient,
}: DiaryPageProps) {
  // Состояние для навигации по неделям
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0 = текущая неделя, -1 = неделя назад, +1 = неделя вперед
  
  // Автоматически переходим к последней неделе с данными при первом открытии
  useEffect(() => {
    console.log('DiaryPage: Проверяем данные для автоматического перехода');
    console.log('DiaryPage: Записи дневника:', diaryEntries.length);
    console.log('DiaryPage: Записи настроения:', moodEntries.length);
    
    if ((diaryEntries.length > 0 || moodEntries.length > 0) && currentWeekOffset === 0) {
      // Проверяем, есть ли записи на текущей неделе
      const hasCurrentWeekData = diaryEntries.some(entry => isDateInSelectedWeek(entry.date)) ||
                                 moodEntries.some(entry => isDateInSelectedWeek(entry.date));
      
      console.log('DiaryPage: Данные на текущей неделе:', hasCurrentWeekData);
      
      if (!hasCurrentWeekData) {
        // Ищем последнюю неделю с данными
        const allDates = [...diaryEntries.map(e => e.date), ...moodEntries.map(e => e.date)];
        if (allDates.length > 0) {
          const latestDate = new Date(Math.max(...allDates.map(d => new Date(d).getTime())));
          console.log('DiaryPage: Последняя дата с данными:', latestDate);
          
          // Вычисляем смещение недели для последней даты
          const now = new Date();
          const daysDiff = Math.floor((latestDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
          const weeksDiff = Math.floor(daysDiff / 7);
          
          console.log('DiaryPage: Автоматически переходим к неделе со смещением:', weeksDiff);
          setCurrentWeekOffset(weeksDiff);
        }
      }
    }
  }, [diaryEntries, moodEntries, currentWeekOffset]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    name: patient.name,
    lastName: patient.lastName || '',
    email: patient.email || '',
    telegramNick: patient.telegramNick || ''
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU");
  };

  // Функция для получения номера недели в году
  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
  };

  // Получаем текущую неделю
  const currentWeek = getWeekNumber(new Date());
  const targetWeek = currentWeek + currentWeekOffset;

  // Функция для получения даты начала недели
  const getWeekStartDate = (weekOffset: number) => {
    const now = new Date();
    const dayOfWeek = now.getDay() || 7; // Понедельник = 1, Воскресенье = 7
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek + 1 + (weekOffset * 7));
    return monday;
  };

  // Функция для получения даты окончания недели
  const getWeekEndDate = (weekOffset: number) => {
    const weekStart = getWeekStartDate(weekOffset);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return weekEnd;
  };

  // Функция для проверки, попадает ли дата в выбранную неделю
  const isDateInSelectedWeek = (dateString: string) => {
    const date = new Date(dateString);
    const weekStart = getWeekStartDate(currentWeekOffset);
    const weekEnd = getWeekEndDate(currentWeekOffset);
    
    return date >= weekStart && date <= weekEnd;
  };

  const getAttentionIcon = (level?: string) => {
    switch (level) {
      case "high":
        return (
          <AlertTriangle className="h-4 w-4 text-red-500" />
        );
      case "medium":
        return (
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        );
      case "low":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  // Фильтрация данных по выбранной неделе
  const filteredDiaryEntries = useMemo(() => {
    return diaryEntries.filter(entry => isDateInSelectedWeek(entry.date));
  }, [diaryEntries, currentWeekOffset]);

  const filteredMoodEntries = useMemo(() => {
    return moodEntries.filter(entry => isDateInSelectedWeek(entry.date));
  }, [moodEntries, currentWeekOffset]);

  const chartData = filteredMoodEntries
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString("ru-RU", {
        month: "short",
        day: "numeric",
      }),
      mood: entry.mood,
      fullDate: entry.date,
    }))
    .sort(
      (a, b) =>
        new Date(a.fullDate).getTime() -
        new Date(b.fullDate).getTime(),
    );

  // Функции навигации
  const goToPreviousMonth = () => {
    setCurrentWeekOffset(prev => prev - 4); // Примерно месяц назад
  };

  const goToPreviousWeek = () => {
    setCurrentWeekOffset(prev => prev - 1);
  };

  const goToNextWeek = () => {
    setCurrentWeekOffset(prev => prev + 1);
  };

  const selectWeek = (weekOffset: number) => {
    setCurrentWeekOffset(weekOffset);
  };

  // Получаем номера недель для отображения (текущая и соседние)
  const getWeekNumbers = () => {
    const weeks = [];
    for (let i = -2; i <= 1; i++) {
      const weekNum = currentWeek + currentWeekOffset + i;
      weeks.push({
        number: weekNum > 0 ? weekNum : weekNum + 52, // Обработка перехода года
        offset: currentWeekOffset + i,
        isActive: i === 0
      });
    }
    return weeks;
  };

  const weekNumbers = getWeekNumbers();

  // Форматирование диапазона дат для отображения
  const getWeekDateRange = () => {
    const startDate = getWeekStartDate(currentWeekOffset);
    const endDate = getWeekEndDate(currentWeekOffset);
    
    const formatDateRange = (date: Date) => {
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short"
      });
    };

    return `${formatDateRange(startDate)} - ${formatDateRange(endDate)}`;
  };

  // Функции для работы с пациентом
  const handleDeleteConfirm = () => {
    if (onDeletePatient) {
      onDeletePatient(patient.id);
      onBack(); // Возвращаемся к списку пациентов после удаления
    }
    setIsDeleteDialogOpen(false);
  };

  const handleDeactivateConfirm = () => {
    if (onUpdatePatient) {
      onUpdatePatient(patient.id, { isActive: false });
    }
    setIsDeactivateDialogOpen(false);
  };

  const handleActivatePatient = () => {
    if (onUpdatePatient) {
      onUpdatePatient(patient.id, { isActive: true });
    }
  };

  const handleProfileSave = () => {
    if (onUpdatePatient) {
      onUpdatePatient(patient.id, profileFormData);
    }
    setIsProfileDialogOpen(false);
  };

  const handleProfileInputChange = (field: string, value: string) => {
    setProfileFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl text-gray-800">
                Дневник {patient.name}
              </h1>
              {patient.isActive === false && (
                <span className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full">
                  Деактивирован
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 relative">
            <Button
              variant="outline"
              className="border-gray-300"
              onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
            >
              <Settings className="mr-2 h-4 w-4" />
              Настройки
            </Button>
            
            {isSettingsMenuOpen && (
              <>
                {/* Overlay для закрытия меню */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsSettingsMenuOpen(false)}
                />
                
                {/* Меню настроек */}
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                  <div className="p-3 border-b border-gray-200">
                    <div className="text-sm font-medium text-gray-900">
                      Пациент: {patient.name} {patient.lastName || ''}
                    </div>
                  </div>
                  <div className="p-1">
                    <button
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => {
                        setIsSettingsMenuOpen(false);
                        setIsProfileDialogOpen(true);
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Профиль пациента
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    
                    {patient.isActive !== false ? (
                      <button
                        className="flex items-center w-full px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                        onClick={() => {
                          setIsSettingsMenuOpen(false);
                          setIsDeactivateDialogOpen(true);
                        }}
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        Деактивировать пациента
                      </button>
                    ) : (
                      <button
                        className="flex items-center w-full px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        onClick={() => {
                          setIsSettingsMenuOpen(false);
                          handleActivatePatient();
                        }}
                      >
                        <UserCheck className="mr-2 h-4 w-4" />
                        Активировать пациента
                      </button>
                    )}
                    
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      onClick={() => {
                        setIsSettingsMenuOpen(false);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Удалить пациента
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Навигация по неделям */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">
                    Выбранная неделя:
                  </span>
                  <span className="text-sm text-gray-800 font-medium">
                    {getWeekDateRange()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {currentWeekOffset !== 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentWeekOffset(0)}
                      className="text-purple-600 border-purple-300 hover:bg-purple-50"
                    >
                      Текущая неделя
                    </Button>
                  )}
                  {(diaryEntries.length > 0 || moodEntries.length > 0) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Переход к последней неделе с данными
                        const allDates = [...diaryEntries.map(e => e.date), ...moodEntries.map(e => e.date)];
                        if (allDates.length > 0) {
                          const latestDate = new Date(Math.max(...allDates.map(d => new Date(d).getTime())));
                          const now = new Date();
                          const daysDiff = Math.floor((latestDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
                          const weeksDiff = Math.floor(daysDiff / 7);
                          setCurrentWeekOffset(weeksDiff);
                        }
                      }}
                      className="text-orange-600 border-orange-300 hover:bg-orange-50"
                      title="Перейти к последним записям"
                    >
                      Последние записи
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  onClick={goToPreviousMonth}
                  title="Месяц назад"
                >
                  {"<<"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  onClick={goToPreviousWeek}
                  title="Неделя назад"
                >
                  {"<"}
                </Button>
                <div className="flex space-x-1">
                  {weekNumbers.map((week) => (
                    <Button
                      key={week.offset}
                      variant={week.isActive ? "default" : "ghost"}
                      size="sm"
                      className={
                        week.isActive
                          ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                      }
                      onClick={() => selectWeek(week.offset)}
                      title={`Неделя ${week.number}`}
                    >
                      {week.number}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  onClick={goToNextWeek}
                  title="Неделя вперед"
                >
                  {">"}
                </Button>
              </div>
            </div>
            {filteredDiaryEntries.length === 0 && filteredMoodEntries.length === 0 && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-700">
                  На выбранной неделе нет записей
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Таблица дневника */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-800">
                КПТ Записи
              </CardTitle>
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {filteredDiaryEntries.length} {filteredDiaryEntries.length === 1 ? 'запись' : 
                 filteredDiaryEntries.length < 5 ? 'записи' : 'записей'}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="text-gray-700">
                      Время
                    </TableHead>
                    <TableHead className="text-gray-700">
                      Ситуация
                    </TableHead>
                    <TableHead className="text-gray-700">
                      Автоматическая мысль
                    </TableHead>
                    <TableHead className="text-gray-700">
                      Эмоция
                    </TableHead>
                    <TableHead className="text-gray-700 text-center">
                      Сила эмоции
                    </TableHead>
                    <TableHead className="text-gray-700 text-center">
                      Внимание
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDiaryEntries.length > 0 ? (
                    filteredDiaryEntries.map((entry) => (
                      <TableRow
                        key={entry.id}
                        className="border-gray-100 hover:bg-gray-50/50"
                      >
                        <TableCell className="text-gray-800">
                          {formatDate(entry.date)}
                        </TableCell>
                        <TableCell className="text-gray-700 max-w-xs">
                          <div
                            className="truncate"
                            title={entry.situation}
                          >
                            {entry.situation}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700 max-w-xs">
                          <div
                            className="truncate"
                            title={entry.automaticThought}
                          >
                            {entry.automaticThought}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {entry.emotion}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-800 rounded-full text-sm">
                            {entry.emotionStrength}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {getAttentionIcon(entry.attentionLevel)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell 
                        colSpan={6} 
                        className="text-center py-8 text-gray-500"
                      >
                        На выбранной неделе записей в дневнике нет
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* График настроения */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-800">
                График настроения
              </CardTitle>
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {filteredMoodEntries.length} {filteredMoodEntries.length === 1 ? 'отметка' : 
                 filteredMoodEntries.length < 5 ? 'отметки' : 'отметок'}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                    />
                    <XAxis
                      dataKey="date"
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis
                      domain={[0, 10]}
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={{
                        fill: "#f97316",
                        strokeWidth: 2,
                        r: 5,
                      }}
                      activeDot={{ r: 7, fill: "#ea580c" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p className="text-lg mb-2">Нет данных о настроении</p>
                  <p className="text-sm">На выбранной неделе отметок настроения нет</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Диалог профиля пациента */}
        <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Профиль пациента</DialogTitle>
              <DialogDescription>
                Редактирование информации о пациенте {patient.name} {patient.lastName || ''}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  value={profileFormData.name}
                  onChange={(e) => handleProfileInputChange('name', e.target.value)}
                  placeholder="Введите имя"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Фамилия</Label>
                <Input
                  id="lastName"
                  value={profileFormData.lastName}
                  onChange={(e) => handleProfileInputChange('lastName', e.target.value)}
                  placeholder="Введите фамилию"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileFormData.email}
                  onChange={(e) => handleProfileInputChange('email', e.target.value)}
                  placeholder="Введите email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telegramNick">Telegram</Label>
                <Input
                  id="telegramNick"
                  value={profileFormData.telegramNick}
                  onChange={(e) => handleProfileInputChange('telegramNick', e.target.value)}
                  placeholder="@username"
                />
              </div>
              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsProfileDialogOpen(false)}
                  className="flex-1"
                >
                  Отмена
                </Button>
                <Button onClick={handleProfileSave} className="flex-1">
                  Сохранить
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Диалог деактивации пациента */}
        <AlertDialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Деактивировать пациента?</AlertDialogTitle>
              <AlertDialogDescription>
                Вы действительно хотите деактивировать пациента{" "}
                <span className="font-medium">
                  {patient.name} {patient.lastName || ''}
                </span>?
                <br />
                <br />
                Деактивированный пациент не сможет добавлять новые записи в дневник, но все существующие данные сохранятся. Вы сможете активировать пациента в любой момент.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeactivateConfirm}
                className="bg-orange-600 hover:bg-orange-700 focus:ring-orange-600"
              >
                Деактивировать
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Диалог подтверждения удаления */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить пациента?</AlertDialogTitle>
              <AlertDialogDescription>
                Вы действительно хотите удалить пациента{" "}
                <span className="font-medium">
                  {patient.name} {patient.lastName || ''}
                </span>?
                <br />
                <br />
                Это действие нельзя будет отменить. Все записи дневника и данные о настроении этого пациента будут безвозвратно удалены.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                Удалить пациента
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}