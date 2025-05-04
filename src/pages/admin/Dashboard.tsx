import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import carService from '@/services/carService';
import bookingService from '@/services/bookingService';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Компонент панели мониторинга для администратора
const AdminDashboard = () => {
  // Запрос на получение данных об автомобилях
  const { data: cars, isLoading: carsLoading } = useQuery({
    queryKey: ['cars'],
    queryFn: () => carService.getAll(),
  });

  // Запрос на получение данных о бронированиях
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingService.getAll(),
  });

  // Вычисляем статистические данные
  const stats = {
    totalCars: cars?.length || 0,
    availableCars: cars?.filter(car => car.available).length || 0,
    totalBookings: bookings?.length || 0,
    activeBookings: bookings?.filter(booking => booking.status === 'confirmed').length || 0,
    pendingBookings: bookings?.filter(booking => booking.status === 'pending').length || 0,
    revenue: bookings
      ?.filter(booking => booking.status !== 'cancelled')
      .reduce((sum, booking) => sum + booking.totalPrice, 0) || 0,
  };

  // Функция для форматирования денежных значений
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/admin/cars/new">
              <Icon name="Plus" className="mr-2 h-4 w-4" />
              Добавить автомобиль
            </Link>
          </Button>
        </div>
      </div>

      {/* Карточки с ключевыми показателями */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Автомобили</CardTitle>
            <Icon name="Car" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCars}</div>
            <p className="text-xs text-muted-foreground">
              Доступно: {stats.availableCars}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Бронирования</CardTitle>
            <Icon name="CalendarCheck" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              Активных: {stats.activeBookings}, Ожидающих: {stats.pendingBookings}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Выручка</CardTitle>
            <Icon name="CreditCard" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.revenue)}</div>
            <p className="text-xs text-muted-foreground">
              За все время
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Вкладки с разными секциями */}
      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bookings">Бронирования</TabsTrigger>
          <TabsTrigger value="cars">Автомобили</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Последние бронирования</CardTitle>
              <CardDescription>
                Управление последними бронированиями в системе
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="flex justify-center p-4">
                  <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                  Загрузка...
                </div>
              ) : !bookings || bookings.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Нет бронирований
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div 
                      key={booking.id}
                      className="flex justify-between items-center p-4 border rounded-lg"
                    >
                      <div>
                        <div className="font-semibold">
                          {booking.car?.brand} {booking.car?.model}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.status === 'confirmed' ? 'Подтверждено' :
                           booking.status === 'pending' ? 'Ожидание' :
                           booking.status === 'cancelled' ? 'Отменено' :
                           'Завершено'}
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/admin/bookings/${booking.id}`}>
                            <Icon name="ExternalLink" className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" asChild>
                      <Link to="/admin/bookings">
                        Просмотреть все бронирования
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cars" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Управление автомобилями</CardTitle>
              <CardDescription>
                Просмотр и редактирование доступных автомобилей
              </CardDescription>
            </CardHeader>
            <CardContent>
              {carsLoading ? (
                <div className="flex justify-center p-4">
                  <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                  Загрузка...
                </div>
              ) : !cars || cars.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  Нет автомобилей в базе
                </div>
              ) : (
                <div className="space-y-4">
                  {cars.slice(0, 5).map((car) => (
                    <div 
                      key={car.id}
                      className="flex justify-between items-center p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-md bg-cover bg-center" 
                          style={{ backgroundImage: `url(${car.images[0] || 'https://via.placeholder.com/150'})` }}
                        />
                        <div>
                          <div className="font-semibold">{car.brand} {car.model}</div>
                          <div className="text-sm text-muted-foreground">{car.category}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          car.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {car.available ? 'Доступен' : 'Недоступен'}
                        </div>
                        <div className="font-semibold">{car.pricePerDay} ₽/день</div>
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/admin/cars/${car.id}`}>
                            <Icon name="ExternalLink" className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" asChild>
                      <Link to="/admin/cars">
                        Просмотреть все автомобили
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;