import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CreatePatientRequest } from '../types';

interface AddPatientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (patient: CreatePatientRequest) => void;
  isLoading?: boolean;
}

export function AddPatientForm({ isOpen, onClose, onSubmit, isLoading = false }: AddPatientFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    telegramNick: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Убираем ошибку при начале ввода
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна для заполнения';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (formData.telegramNick && !formData.telegramNick.startsWith('@')) {
      newErrors.telegramNick = 'Telegram ник должен начинаться с @';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim() || undefined,
      telegramNick: formData.telegramNick.trim() || undefined
    });

    // Сброс формы
    setFormData({
      name: '',
      lastName: '',
      email: '',
      telegramNick: ''
    });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      lastName: '',
      email: '',
      telegramNick: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-800">Добавить пациента</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">
              Имя *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`bg-white/80 border-gray-200 ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Введите имя"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-gray-700">
              Фамилия *
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`bg-white/80 border-gray-200 ${errors.lastName ? 'border-red-500' : ''}`}
              placeholder="Введите фамилию"
            />
            {errors.lastName && (
              <p className="text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`bg-white/80 border-gray-200 ${errors.email ? 'border-red-500' : ''}`}
              placeholder="example@mail.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telegramNick" className="text-gray-700">
              Telegram
            </Label>
            <Input
              id="telegramNick"
              value={formData.telegramNick}
              onChange={(e) => handleInputChange('telegramNick', e.target.value)}
              className={`bg-white/80 border-gray-200 ${errors.telegramNick ? 'border-red-500' : ''}`}
              placeholder="@username"
            />
            {errors.telegramNick && (
              <p className="text-sm text-red-600">{errors.telegramNick}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 border-gray-300"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? 'Добавляем...' : 'Добавить'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}