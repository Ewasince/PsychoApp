import { LocalStorageService } from './storage';
import { isDemoMode } from '../utils/demoMode';
import { getApiUrl } from '../config/constants';
import { 
  ApiResponse, 
  Patient, 
  CreatePatientRequest, 
  UpdatePatientRequest 
} from '../types';

const API_BASE_URL = getApiUrl();

// Функции для работы с API
async function apiGetPatients(): Promise<ApiResponse<Patient[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to get patients'
      };
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
}

async function apiCreatePatient(patientData: CreatePatientRequest): Promise<ApiResponse<Patient>> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(patientData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to create patient'
      };
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
}

async function apiUpdatePatient(patientId: string, updates: UpdatePatientRequest): Promise<ApiResponse<Patient>> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to update patient'
      };
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
}

async function apiDeletePatient(patientId: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        error: data.error || 'Failed to delete patient'
      };
    }

    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
}

// Функции для работы с localStorage
function localStorageGetPatients(): Promise<ApiResponse<Patient[]>> {
  return new Promise((resolve) => {
    const patients = LocalStorageService.getPatients();
    resolve({
      success: true,
      data: patients
    });
  });
}

function localStorageCreatePatient(patientData: CreatePatientRequest): Promise<ApiResponse<Patient>> {
  return new Promise((resolve) => {
    const patients = LocalStorageService.getPatients();
    const newPatient: Patient = {
      ...patientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    const updatedPatients = [...patients, newPatient];
    LocalStorageService.setPatients(updatedPatients);
    
    resolve({
      success: true,
      data: newPatient
    });
  });
}

function localStorageUpdatePatient(patientId: string, updates: UpdatePatientRequest): Promise<ApiResponse<Patient>> {
  return new Promise((resolve) => {
    const patients = LocalStorageService.getPatients();
    const patientIndex = patients.findIndex(p => p.id === patientId);
    
    if (patientIndex === -1) {
      resolve({
        success: false,
        error: 'Patient not found'
      });
      return;
    }
    
    const updatedPatient = { ...patients[patientIndex], ...updates };
    patients[patientIndex] = updatedPatient;
    LocalStorageService.setPatients(patients);
    
    resolve({
      success: true,
      data: updatedPatient
    });
  });
}

function localStorageDeletePatient(patientId: string): Promise<ApiResponse<void>> {
  return new Promise((resolve) => {
    const patients = LocalStorageService.getPatients();
    const filteredPatients = patients.filter(p => p.id !== patientId);
    LocalStorageService.setPatients(filteredPatients);
    
    resolve({
      success: true
    });
  });
}

// API функция для получения пациента
async function apiGetPatient(patientId: string): Promise<ApiResponse<Patient>> {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to get patient'
      };
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error'
    };
  }
}

// localStorage функция для получения пациента
function localStorageGetPatient(patientId: string): Promise<ApiResponse<Patient>> {
  return new Promise((resolve) => {
    const patients = LocalStorageService.getPatients();
    const patient = patients.find(p => p.id === patientId);
    
    if (!patient) {
      resolve({
        success: false,
        error: 'Patient not found'
      });
    } else {
      resolve({
        success: true,
        data: patient
      });
    }
  });
}

// Упрощенные экспортируемые функции без декораторов
export async function getPatients(): Promise<ApiResponse<Patient[]>> {
  console.log('patients.getPatients: Вызов функции получения пациентов');
  try {
    // В демо-режиме всегда используем localStorage
    if (isDemoMode()) {
      console.log('patients.getPatients: Демо-режим, используем localStorage');
      const result = await localStorageGetPatients();
      console.log('patients.getPatients: Результат демо-режима:', result);
      return result;
    }
    
    // Пытаемся реальный API, потом fallback на localStorage
    try {
      console.log('patients.getPatients: Пытаемся реальный API');
      const apiResult = await apiGetPatients();
      if (apiResult.success) {
        console.log('patients.getPatients: API успешен');
        return apiResult;
      }
      console.log('patients.getPatients: API неуспешен, используем localStorage');
    } catch (apiError) {
      console.log('patients.getPatients: Ошибка API, используем localStorage:', apiError);
    }
    
    // Fallback на localStorage
    const result = await localStorageGetPatients();
    console.log('patients.getPatients: Результат localStorage:', result);
    return result;
  } catch (error) {
    console.error('patients.getPatients: Ошибка:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function createPatient(patientData: CreatePatientRequest): Promise<ApiResponse<Patient>> {
  console.log('patients.createPatient: Вызов функции создания пациента');
  try {
    // В демо-режиме всегда используем localStorage
    if (isDemoMode()) {
      console.log('patients.createPatient: Демо-режим, используем localStorage');
      const result = await localStorageCreatePatient(patientData);
      console.log('patients.createPatient: Результат демо-режима:', result);
      return result;
    }
    
    // Пытаемся реальный API, потом fallback на localStorage
    try {
      console.log('patients.createPatient: Пытаемся реальный API');
      const apiResult = await apiCreatePatient(patientData);
      if (apiResult.success) {
        console.log('patients.createPatient: API успешен');
        return apiResult;
      }
      console.log('patients.createPatient: API неуспешен, используем localStorage');
    } catch (apiError) {
      console.log('patients.createPatient: Ошибка API, используем localStorage:', apiError);
    }
    
    // Fallback на localStorage
    const result = await localStorageCreatePatient(patientData);
    console.log('patients.createPatient: Результат localStorage:', result);
    return result;
  } catch (error) {
    console.error('patients.createPatient: Ошибка:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function updatePatient(patientId: string, updates: UpdatePatientRequest): Promise<ApiResponse<Patient>> {
  console.log('patients.updatePatient: Вызов функции обновления пациента');
  try {
    // В демо-режиме всегда используем localStorage
    if (isDemoMode()) {
      console.log('patients.updatePatient: Демо-режим, используем localStorage');
      const result = await localStorageUpdatePatient(patientId, updates);
      console.log('patients.updatePatient: Результат демо-режима:', result);
      return result;
    }
    
    // Пытаемся реальный API, потом fallback на localStorage
    try {
      console.log('patients.updatePatient: Пытаемся реальный API');
      const apiResult = await apiUpdatePatient(patientId, updates);
      if (apiResult.success) {
        console.log('patients.updatePatient: API успешен');
        return apiResult;
      }
      console.log('patients.updatePatient: API неуспешен, используем localStorage');
    } catch (apiError) {
      console.log('patients.updatePatient: Ошибка API, используем localStorage:', apiError);
    }
    
    // Fallback на localStorage
    const result = await localStorageUpdatePatient(patientId, updates);
    console.log('patients.updatePatient: Результат localStorage:', result);
    return result;
  } catch (error) {
    console.error('patients.updatePatient: Ошибка:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function deletePatient(patientId: string): Promise<ApiResponse<void>> {
  console.log('patients.deletePatient: Вызов функции удаления пациента');
  try {
    // В демо-режиме всегда используем localStorage
    if (isDemoMode()) {
      console.log('patients.deletePatient: Демо-режим, используем localStorage');
      const result = await localStorageDeletePatient(patientId);
      console.log('patients.deletePatient: Результат демо-режима:', result);
      return result;
    }
    
    // Пытаемся реальный API, потом fallback на localStorage
    try {
      console.log('patients.deletePatient: Пытаемся реальный API');
      const apiResult = await apiDeletePatient(patientId);
      if (apiResult.success) {
        console.log('patients.deletePatient: API успешен');
        return apiResult;
      }
      console.log('patients.deletePatient: API неуспешен, используем localStorage');
    } catch (apiError) {
      console.log('patients.deletePatient: Ошибка API, используем localStorage:', apiError);
    }
    
    // Fallback на localStorage
    const result = await localStorageDeletePatient(patientId);
    console.log('patients.deletePatient: Результат localStorage:', result);
    return result;
  } catch (error) {
    console.error('patients.deletePatient: Ошибка:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function getPatient(patientId: string): Promise<ApiResponse<Patient>> {
  console.log('patients.getPatient: Вызов функции получения пациента');
  try {
    // В демо-режиме всегда используем localStorage
    if (isDemoMode()) {
      console.log('patients.getPatient: Демо-режим, используем localStorage');
      const result = await localStorageGetPatient(patientId);
      console.log('patients.getPatient: Результат демо-режима:', result);
      return result;
    }
    
    // Пытаемся реальный API, потом fallback на localStorage
    try {
      console.log('patients.getPatient: Пытаемся реальный API');
      const apiResult = await apiGetPatient(patientId);
      if (apiResult.success) {
        console.log('patients.getPatient: API успешен');
        return apiResult;
      }
      console.log('patients.getPatient: API неуспешен, используем localStorage');
    } catch (apiError) {
      console.log('patients.getPatient: Ошибка API, используем localStorage:', apiError);
    }
    
    // Fallback на localStorage
    const result = await localStorageGetPatient(patientId);
    console.log('patients.getPatient: Результат localStorage:', result);
    return result;
  } catch (error) {
    console.error('patients.getPatient: Ошибка:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}