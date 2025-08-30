import { DiaryEntry, MoodEntry, Patient } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, Settings, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DiaryPageProps {
  patient: Patient;
  diaryEntries: DiaryEntry[];
  moodEntries: MoodEntry[];
  onBack: () => void;
}

export function DiaryPage({ patient, diaryEntries, moodEntries, onBack }: DiaryPageProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const getAttentionIcon = (level?: string) => {
    switch (level) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const chartData = moodEntries.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('ru-RU', { 
      month: 'short', 
      day: 'numeric' 
    }),
    mood: entry.mood,
    fullDate: entry.date
  })).sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());

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
            <h1 className="text-3xl text-gray-800">
              Дневник {patient.name}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="border-gray-300">
              <Settings className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Навигация по неделям */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Неделя назад:</span>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-gray-600">{'<<'}</Button>
                <Button variant="ghost" size="sm" className="text-gray-600">{'<'}</Button>
                <span className="text-sm text-gray-800 mx-4">эта</span>
                <div className="flex space-x-1">
                  {['44', '45', '46', '49'].map((week, index) => (
                    <Button
                      key={week}
                      variant={index === 0 ? "default" : "ghost"}
                      size="sm"
                      className={index === 0 ? "bg-purple-100 text-purple-800" : "text-gray-600"}
                    >
                      {week}
                    </Button>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="text-gray-600">{'>'}</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Таблица дневника */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 mb-8">
          <CardHeader>
            <CardTitle className="text-gray-800">КПТ Записи</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="text-gray-700">Время</TableHead>
                    <TableHead className="text-gray-700">Ситуация</TableHead>
                    <TableHead className="text-gray-700">Автоматическая мысль</TableHead>
                    <TableHead className="text-gray-700">Эмоция</TableHead>
                    <TableHead className="text-gray-700 text-center">Сила эмоции</TableHead>
                    <TableHead className="text-gray-700 text-center">Внимание</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {diaryEntries.map((entry) => (
                    <TableRow key={entry.id} className="border-gray-100 hover:bg-gray-50/50">
                      <TableCell className="text-gray-800">
                        {formatDate(entry.date)}
                      </TableCell>
                      <TableCell className="text-gray-700 max-w-xs">
                        <div className="truncate" title={entry.situation}>
                          {entry.situation}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 max-w-xs">
                        <div className="truncate" title={entry.automaticThought}>
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* График настроения */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">График настроения</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
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
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, fill: '#ea580c' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}