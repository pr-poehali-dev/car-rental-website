import { toast } from "@/hooks/use-toast";

// Базовый URL API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.autoprokrat.ru/api';

// Типизация для базовой сущности с id
interface Entity {
  id: string | number;
}

// Опции для запросов
interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

// Функция для выполнения HTTP-запросов с обработкой ошибок и авторизацией
async function fetchWithAuth<T>(
  endpoint: string,
  options: FetchOptions = { requireAuth: true }
): Promise<T> {
  const { requireAuth = true, ...fetchOptions } = options;
  
  // Формируем URL
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}/${endpoint}`;
  
  // Добавляем заголовки
  const headers = new Headers(fetchOptions.headers);
  
  if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  // Добавляем токен авторизации, если нужно
  if (requireAuth) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      // Если токена нет, но он требуется, перенаправляем на страницу логина
      window.location.href = '/login';
      throw new Error('Требуется авторизация');
    }
  }
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers
    });
    
    // Обрабатываем ошибки HTTP
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Ошибка ${response.status}: ${response.statusText}`;
      
      if (response.status === 401) {
        // При ошибке авторизации очищаем токен и перенаправляем
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
      }
      
      throw new Error(errorMessage);
    }
    
    // Проверяем, пустой ли ответ
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return {} as T;
  } catch (error) {
    // Обрабатываем ошибки сети и другие исключения
    const errorMessage = error instanceof Error ? error.message : 'Произошла неизвестная ошибка';
    
    toast({
      title: 'Ошибка',
      description: errorMessage,
      variant: 'destructive',
    });
    
    throw error;
  }
}

// Фабрика для создания CRUD-сервисов для сущностей
export function createApiService<T extends Entity>(resourcePath: string) {
  return {
    // Получение всех записей с возможностью фильтрации
    getAll: async (queryParams?: Record<string, string>) => {
      const query = queryParams 
        ? `?${new URLSearchParams(queryParams)}` 
        : '';
      return fetchWithAuth<T[]>(`${resourcePath}${query}`);
    },
    
    // Получение записи по ID
    getById: async (id: string | number) => {
      return fetchWithAuth<T>(`${resourcePath}/${id}`);
    },
    
    // Создание новой записи
    create: async (data: Partial<T>) => {
      return fetchWithAuth<T>(resourcePath, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    
    // Обновление записи
    update: async (id: string | number, data: Partial<T>) => {
      return fetchWithAuth<T>(`${resourcePath}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },
    
    // Частичное обновление записи
    patch: async (id: string | number, data: Partial<T>) => {
      return fetchWithAuth<T>(`${resourcePath}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      });
    },
    
    // Удаление записи
    delete: async (id: string | number) => {
      return fetchWithAuth<void>(`${resourcePath}/${id}`, {
        method: 'DELETE'
      });
    }
  };
}

// Экспортируем методы для прямого использования
export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) => fetchWithAuth<T>(endpoint, { method: 'GET', ...options }),
  post: <T>(endpoint: string, data: any, options?: FetchOptions) => fetchWithAuth<T>(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data),
    ...options 
  }),
  put: <T>(endpoint: string, data: any, options?: FetchOptions) => fetchWithAuth<T>(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data),
    ...options 
  }),
  patch: <T>(endpoint: string, data: any, options?: FetchOptions) => fetchWithAuth<T>(endpoint, { 
    method: 'PATCH', 
    body: JSON.stringify(data),
    ...options 
  }),
  delete: <T>(endpoint: string, options?: FetchOptions) => fetchWithAuth<T>(endpoint, { 
    method: 'DELETE',
    ...options 
  }),
  upload: <T>(endpoint: string, formData: FormData, options?: FetchOptions) => fetchWithAuth<T>(endpoint, {
    method: 'POST',
    body: formData,
    ...options
  })
};