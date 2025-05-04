// Модель для автомобиля
export interface Car {
  id: number | string;
  brand: string;
  model: string;
  year: number;
  category: string;
  transmission: 'manual' | 'automatic';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  seats: number;
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  description: string;
  features: string[];
  images: string[];
  available: boolean;
}

// Фильтры для автомобилей
export interface CarFilters {
  brand?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  transmission?: string;
  fuelType?: string;
  seats?: number;
  available?: boolean;
  search?: string;
}

// Информация о клиенте
export interface ClientInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Статус бронирования
export type BookingStatus = 
  | 'pending' // Ожидает подтверждения
  | 'confirmed' // Подтверждено
  | 'active' // Активно (автомобиль выдан)
  | 'completed' // Завершено
  | 'cancelled' // Отменено
  | 'rejected'; // Отклонено

// Модель для бронирования
export interface Booking {
  id: number | string;
  carId: number | string;
  car?: Car; // Связанный автомобиль (может быть подгружен или нет)
  clientId?: number | string; // ID клиента, если он зарегистрирован
  clientInfo: ClientInfo; // Информация о клиенте
  startDate: string; // Дата начала аренды
  endDate: string; // Дата окончания аренды
  totalPrice: number; // Общая стоимость
  status: BookingStatus; // Статус бронирования
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed'; // Статус оплаты
  createdAt: string; // Дата создания
  updatedAt: string; // Дата обновления
  notes?: string; // Примечания
}

// Фильтры для бронирований
export interface BookingFilters {
  carId?: number | string;
  clientId?: number | string;
  startDate?: string;
  endDate?: string;
  status?: BookingStatus | BookingStatus[];
  search?: string;
}

// Модель для пользователя
export interface User {
  id: number | string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'manager' | 'client';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

// Данные для создания нового бронирования
export interface CreateBookingData {
  carId: number | string;
  startDate: string;
  endDate: string;
  clientInfo: ClientInfo;
  notes?: string;
}