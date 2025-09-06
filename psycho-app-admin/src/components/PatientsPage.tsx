import { Patient, CreatePatientRequest } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Plus, Calendar } from 'lucide-react';
import { useState } from 'react';
import { AddPatientForm } from './AddPatientForm';
import { MiniLoader } from './MiniLoader';
import { useLoading } from '../hooks/useLoading';

interface PatientsPageProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onAddPatient: (patient: CreatePatientRequest) => void;
  isLoading?: boolean;
}

export function PatientsPage({ patients, onSelectPatient, onAddPatient, isLoading = false }: PatientsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const { isLoading: isAddingPatient, withLoading } = useLoading();

  const filteredPatients = patients.filter(patient =>
    `${patient.name} ${patient.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const handleAddPatient = async (patientData: CreatePatientRequest) => {
    await withLoading(
      Promise.resolve(onAddPatient(patientData)),
      'Добавляем пациента...'
    );
    setIsAddFormOpen(false);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl text-gray-800">Мои пациенты</h1>
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => setIsAddFormOpen(true)}
          >
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
        <div className="space-y-4 relative">
          {isLoading && (
            <MiniLoader 
              message="Загружаем пациентов..." 
              variant="overlay"
            />
          )}
          
          {filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              className={`backdrop-blur-sm border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer ${
                patient.isActive !== false 
                  ? 'bg-white/80 hover:bg-white/90' 
                  : 'bg-gray-50/80 hover:bg-gray-50/90 opacity-75'
              }`}
              onClick={() => onSelectPatient(patient.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-lg mb-1 ${
                      patient.isActive !== false 
                        ? 'text-gray-800' 
                        : 'text-gray-500'
                    }`}>
                      {patient.name} {patient.lastName}
                    </h3>
                    {patient.email && (
                      <p className={`text-sm mb-1 ${
                        patient.isActive !== false 
                          ? 'text-gray-600' 
                          : 'text-gray-400'
                      }`}>{patient.email}</p>
                    )}
                    {patient.telegramNick && (
                      <p className={`text-sm mb-2 ${
                        patient.isActive !== false 
                          ? 'text-gray-600' 
                          : 'text-gray-400'
                      }`}>{patient.telegramNick}</p>
                    )}
                    <div className={`flex items-center text-sm ${
                      patient.isActive !== false 
                        ? 'text-gray-500' 
                        : 'text-gray-400'
                    }`}>
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
                    <div 
                      className={`w-3 h-3 rounded-full ${
                        patient.isActive !== false 
                          ? 'bg-green-400' 
                          : 'bg-orange-400'
                      }`}
                    ></div>
                    <span className="text-sm text-gray-600">
                      {patient.isActive !== false ? 'Активный' : 'Деактивирован'}
                    </span>
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

        <AddPatientForm
          isOpen={isAddFormOpen}
          onClose={() => setIsAddFormOpen(false)}
          onSubmit={handleAddPatient}
          isLoading={isAddingPatient}
        />
      </div>
    </div>
  );
}