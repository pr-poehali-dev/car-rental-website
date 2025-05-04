/**
 * Базовые функции для работы с API
 */

// Базовый URL API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.autoprokrat.ru/api';

// Типы запросов
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Интерфейс опций запроса
interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  query?: Record<string, string>;
}

/**
 * Выполняет HTTP запрос к API
 */
export async function apiRequest<T>(
  endpoint: string, 
  options: RequestOptions = {}
): Promise<T> {
  const { 
    method = 'GET', 
    headers = {}, 
    body = null,
    query = {} 
  } = options;

  // Формируем URL с query параметрами
  const queryParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    queryParams.append(key, value);
  });
  
  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/${endpoint}${queryString ? `?${queryString}` : ''}`;

  // Настройка запроса
  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  // Добавляем токен авторизации, если пользователь авторизован
  const token = localStorage.getItem('auth_token');
  if (token) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  // Добавляем тело запроса для методов POST, PUT
  if (body && (method === 'POST' || method === 'PUT')) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    
    // Проверяем статус ответа
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Ошибка API: ${response.status} ${response.statusText}`
      );
    }
    
    // Для некоторых запросов (например, DELETE) ответ может быть пустым
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return {} as T;
  } catch (error) {
    console.error('Ошибка API запроса:', error);
    throw error;
  }
}

/**
 * Создает функции для CRUD операций с конкретным ресурсом API
 */
export function createApiService<T>(resourcePath: string) {
  return {
    getAll: async (query?: Record<string, string>) => 
      apiRequest<T[]>(resourcePath, { query }),
    
    getById: async (id: string | number) => 
      apiRequest<T>(`${resourcePath}/${id}`),
    
    create: async (data: Partial<T>) => 
      apiRequest<T>(resourcePath, { method: 'POST', body: data }),
    
    update: async (id: string | number, data: Partial<T>) => 
      apiRequest<T>(`${resourcePath}/${id}`, { method: 'PUT', body: data }),
    
    delete: async (id: string | number) => 
      apiRequest<void>(`${resourcePath}/${id}`, { method: 'DELETE' }),
  };
}
