import { Patient } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Plus, Calendar } from 'lucide-react';
import { useState } from 'react';

interface PatientsPageProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
}

export function PatientsPage({ patients, onSelectPatient }: PatientsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient =>
    `${patient.name} ${patient.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl text-gray-800">Мои пациенты</h1>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Добавить пациента
          </Button>
        </div>

        {/* Поиск */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Поиск пациентов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 border-gray-200"
          />
        </div>

        {/* Список пациентов */}
        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              className="bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer hover:bg-white/90"
              onClick={() => onSelectPatient(patient.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg text-gray-800 mb-1">
                      {patient.name} {patient.lastName}
                    </h3>
                    {patient.email && (
                      <p className="text-sm text-gray-600 mb-2">{patient.email}</p>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-4 w-4" />
                      Создан: {formatDate(patient.createdAt)}
                      {patient.lastEntry && (
                        <span className="ml-4">
                          Последняя запись: {formatDate(patient.lastEntry)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">Активный</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">Пациенты не найдены</div>
            <p className="text-gray-400">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
    </div>
  );
}