import { createApiService } from "@/lib/api";
import { Car, CarFilters } from "@/lib/models";

// Создаем базовый CRUD сервис для автомобилей
const baseCarService = createApiService<Car>('cars');

// Расширяем базовый сервис дополнительными методами
const carService = {
  ...baseCarService,
  
  // Получение автомобилей с фильтрацией
  getFilteredCars: async (filters: CarFilters) => {
    // Преобразуем фильтры в query параметры для API
    const query: Record<string, string> = {};
    
    if (filters.brand) query.brand = filters.brand;
    if (filters.category) query.category = filters.category;
    if (filters.priceMin) query.priceMin = filters.priceMin.toString();
    if (filters.priceMax) query.priceMax = filters.priceMax.toString();
    if (filters.transmission) query.transmission = filters.transmission;
    if (filters.fuelType) query.fuelType = filters.fuelType;
    if (filters.seats) query.seats = filters.seats.toString();
    if (filters.available !== undefined) query.available = filters.available.toString();
    if (filters.search) query.search = filters.search;
    
    return baseCarService.getAll(query);
  },
  
  // Получение доступных категорий автомобилей
  getCategories: async () => {
    return await fetch(`${import.meta.env.VITE_API_URL || 'https://api.autoprokrat.ru/api'}/cars/categories`)
      .then(res => res.json())
      .catch(error => {
        console.error('Ошибка при получении категорий:', error);
        return []; // Возвращаем пустой массив в случае ошибки
      });
  },
  
  // Проверка доступности автомобиля на указанные даты
  checkAvailability: async (carId: number, startDate: string, endDate: string) => {
    const query = {
      startDate,
      endDate
    };
    
    return await fetch(
      `${import.meta.env.VITE_API_URL || 'https://api.autoprokrat.ru/api'}/cars/${carId}/availability?${new URLSearchParams(query)}`
    )
      .then(res => res.json())
      .catch(error => {
        console.error('Ошибка при проверке доступности:', error);
        return { available: false };
      });
  }
};

export default carService;