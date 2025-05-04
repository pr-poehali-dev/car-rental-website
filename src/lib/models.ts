/**
 * Модели данных для взаимодействия с API
 */

// Базовая модель с общими полями
export interface BaseModel {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// Модель автомобиля
export interface Car extends BaseModel {
  name: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  transmission: 'manual' | 'automatic';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  seats: number;
  description: string;
  features: string[];
  images: string[];
  available: boolean;
}

// Модель пользователя
export interface User extends BaseModel {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'manager' | 'client';
  avatar?: string;
}

// Модель бронирования
export interface Booking extends BaseModel {
  carId: number;
  userId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  car?: Car;
  user?: User;
}

// Типы для фильтрации и поиска
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

// Тип для создания бронирования
export interface CreateBookingData {
  carId: number;
  startDate: string;
  endDate: string;
  clientInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

// Типы для авторизации
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
