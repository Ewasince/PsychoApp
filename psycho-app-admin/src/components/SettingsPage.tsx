import { User } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Mail, User as UserIcon, Shield, Calendar, Database, Cloud } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DataSourceManager } from '../utils/dataSource';

interface SettingsPageProps {
  user: User;
  onUpdateUser: (userData: Partial<User>) => void;
}

export function SettingsPage({ user, onUpdateUser }: SettingsPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email
  });
  const [currentDataSource, setCurrentDataSource] = useState(DataSourceManager.getCurrentSource());
  const [isApiAvailable, setIsApiAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    // Проверяем доступность API при загрузке
    DataSourceManager.isApiAvailable().then(setIsApiAvailable);

    // Слушаем изменения источника данных
    const handleDataSourceChange = (event: CustomEvent) => {
      setCurrentDataSource(event.detail);
    };

    window.addEventListener('dataSourceChanged', handleDataSourceChange as EventListener);
    return () => {
      window.removeEventListener('dataSourceChanged', handleDataSourceChange as EventListener);
    };
  }, []);

  const handleSave = () => {
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleDataSourceChange = (newSource: 'api' | 'localStorage') => {
    DataSourceManager.setDataSource(newSource);
    setCurrentDataSource(newSource);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'therapist':
        return 'Терапевт';
      case 'admin':
        return 'Администратор';
      default:
        return role;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl text-gray-800 mb-8">Настройки профиля</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основная информация */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center justify-between">
                  Личная информация
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="border-gray-300"
                    >
                      Редактировать
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Имя</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border-gray-200 bg-white"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 py-2">
                      <UserIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-800">{user.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="border-gray-200 bg-white"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 py-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-800">{user.email}</span>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex space-x-3 pt-4">
                    <Button
                      onClick={handleSave}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Сохранить
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="border-gray-300"
                    >
                      Отмена
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Источник данных */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 mt-6">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Источник данных
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Текущий источник</Label>
                  <Select value={currentDataSource} onValueChange={handleDataSourceChange}>
                    <SelectTrigger className="border-gray-200 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="localStorage">
                        <div className="flex items-center">
                          <Database className="mr-2 h-4 w-4" />
                          Локальное хранилище
                        </div>
                      </SelectItem>
                      <SelectItem value="api" disabled={isApiAvailable === false}>
                        <div className="flex items-center">
                          <Cloud className="mr-2 h-4 w-4" />
                          API сервер
                          {isApiAvailable === false && (
                            <span className="ml-2 text-xs text-red-500">(недоступен)</span>
                          )}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-md">
                  {currentDataSource === 'localStorage' ? (
                    <>
                      <strong>Локальное хранилище:</strong> Данные сохраняются в браузере. 
                      Подходит для демонстрации и локального использования.
                    </>
                  ) : (
                    <>
                      <strong>API сервер:</strong> Данные синхронизируются с сервером. 
                      Обеспечивает надежность и доступность с разных устройств.
                    </>
                  )}
                </div>

                {isApiAvailable !== null && (
                  <div className={`text-sm p-2 rounded-md ${
                    isApiAvailable 
                      ? 'text-green-700 bg-green-50' 
                      : 'text-orange-700 bg-orange-50'
                  }`}>
                    Статус API: {isApiAvailable ? 'Доступен' : 'Недоступен'}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Безопасность */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200 mt-6">
              <CardHeader>
                <CardTitle className="text-gray-800">Безопасность</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-300"
                >
                  Изменить пароль
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-300"
                >
                  Двухфакторная аутентификация
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Боковая панель с аватаром и информацией */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardContent className="p-6 text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4 bg-purple-100">
                  <AvatarFallback className="text-xl text-purple-800">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg text-gray-800 mb-2">{user.name}</h3>
                <Badge 
                  variant="secondary" 
                  className="bg-purple-100 text-purple-800 mb-4"
                >
                  <Shield className="mr-1 h-3 w-3" />
                  {getRoleLabel(user.role)}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300"
                >
                  Изменить фото
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-800">Информация аккаунта</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Создан:</span>
                  <span className="text-gray-800">{formatDate(user.createdAt)}</span>
                </div>
                <Separator />
                <div className="text-xs text-gray-500">
                  ID: {user.id}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}