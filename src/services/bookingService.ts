import { createApiService, api } from "@/lib/api";
import { Booking, BookingFilters, CreateBookingData } from "@/lib/models";

// Создаем базовый CRUD сервис для бронирований
const baseBookingService = createApiService<Booking>('bookings');

// Расширяем базовый сервис дополнительными методами
const bookingService = {
  ...baseBookingService,
  
  // Получение бронирований с фильтрацией
  getFilteredBookings: async (filters: BookingFilters) => {
    // Преобразуем фильтры в query параметры для API
    const query: Record<string, string> = {};
    
    if (filters.carId) query.carId = filters.carId.toString();
    if (filters.clientId) query.clientId = filters.clientId.toString();
    if (filters.startDate) query.startDate = filters.startDate;
    if (filters.endDate) query.endDate = filters.endDate;
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        query.status = filters.status.join(',');
      } else {
        query.status = filters.status;
      }
    }
    if (filters.search) query.search = filters.search;
    
    return baseBookingService.getAll(query);
  },
  
  // Создание нового бронирования
  createBooking: async (data: CreateBookingData): Promise<Booking> => {
    return api.post<Booking>('bookings', data);
  },
  
  // Обновление статуса бронирования
  updateStatus: async (id: number | string, status: Booking['status'], notes?: string) => {
    return api.patch<Booking>(`bookings/${id}/status`, { 
      status,
      notes
    });
  },
  
  // Обновление статуса оплаты
  updatePaymentStatus: async (id: number | string, paymentStatus: Booking['paymentStatus']) => {
    return api.patch<Booking>(`bookings/${id}/payment`, { 
      paymentStatus 
    });
  },
  
  // Отмена бронирования
  cancelBooking: async (id: number | string, reason?: string) => {
    return api.post<Booking>(`bookings/${id}/cancel`, { 
      reason 
    });
  },
  
  // Получение статистики по бронированиям
  getStatistics: async (period?: 'day' | 'week' | 'month' | 'year') => {
    const query = period ? `?period=${period}` : '';
    return api.get<{
      total: number;
      pending: number;
      confirmed: number;
      active: number;
      completed: number;
      cancelled: number;
      revenue: number;
    }>(`bookings/statistics${query}`);
  },
  
  // Получение бронирований по клиенту
  getClientBookings: async (clientId: number | string) => {
    return api.get<Booking[]>(`clients/${clientId}/bookings`);
  }
};

export default bookingService;