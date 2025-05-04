import { createApiService } from "@/lib/api";
import { Booking, CreateBookingData } from "@/lib/models";

// Создаем базовый CRUD сервис для бронирований
const baseBookingService = createApiService<Booking>('bookings');

// Расширяем базовый сервис дополнительными методами
const bookingService = {
  ...baseBookingService,
  
  // Создание нового бронирования
  createBooking: async (bookingData: CreateBookingData) => {
    return await fetch(
      `${import.meta.env.VITE_API_URL || 'https://api.autoprokrat.ru/api'}/bookings`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('auth_token') ? { 
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}` 
          } : {})
        },
        body: JSON.stringify(bookingData)
      }
    )
      .then(res => {
        if (!res.ok) {
          throw new Error('Ошибка при создании бронирования');
        }
        return res.json();
      });
  },
  
  // Отмена бронирования
  cancelBooking: async (bookingId: number) => {
    return await fetch(
      `${import.meta.env.VITE_API_URL || 'https://api.autoprokrat.ru/api'}/bookings/${bookingId}/cancel`,
      {
        method: 'POST',
        headers: {
          ...(localStorage.getItem('auth_token') ? { 
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}` 
          } : {})
        }
      }
    )
      .then(res => {
        if (!res.ok) {
          throw new Error('Ошибка при отмене бронирования');
        }
        return res.json();
      });
  },
  
  // Получение бронирований текущего пользователя
  getUserBookings: async () => {
    return await fetch(
      `${import.meta.env.VITE_API_URL || 'https://api.autoprokrat.ru/api'}/user/bookings`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      }
    )
      .then(res => {
        if (!res.ok) {
          throw new Error('Ошибка при получении бронирований');
        }
        return res.json();
      });
  }
};

export default bookingService;