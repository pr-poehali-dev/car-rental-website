import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';
import { Booking, BookingStatus } from '@/lib/models';
import bookingService from '@/services/bookingService';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

// Компонент управления бронированиями
const AdminBookings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<BookingStatus>('confirmed');
  const [statusNote, setStatusNote] = useState('');
  
  // Загружаем список бронирований
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingService.getAll(),
  });
  
  // Мутация для обновления статуса бронирования
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: number | string; status: BookingStatus; notes?: string }) => {
      return bookingService.updateStatus(id, status, notes);
    },
    onSuccess: () => {
      // При успешном обновлении статуса, обновляем список бронирований
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Статус обновлен",
        description: "Статус бронирования успешно обновлен.",
      });
      
      // Закрываем диалог
      setShowStatusDialog(false);
      setStatusNote('');
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось обновить статус: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
        variant: "destructive",
      });
    }
  });
  
  // Функция для открытия диалога изменения статуса
  const handleOpenStatusDialog = (booking: Booking, initialStatus: BookingStatus) => {
    setSelectedBooking(booking);
    setNewStatus(initialStatus);
    setShowStatusDialog(true);
  };
  
  // Функция для обновления статуса
  const handleUpdateStatus = () => {
    if (!selectedBooking) return;
    
    updateStatusMutation.mutate({
      id: selectedBooking.id,
      status: newStatus,
      notes: statusNote || undefined
    });
  };
  
  // Фильтрация бронирований
  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = search === '' ||
      booking.clientInfo.firstName.toLowerCase().includes(search.toLowerCase()) ||
      booking.clientInfo.lastName.toLowerCase().includes(search.toLowerCase()) ||
      booking.clientInfo.email.toLowerCase().includes(search.toLowerCase()) ||
      booking.clientInfo.phone.includes(search);
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Функция для получения цвет бейджа статуса
  const getStatusBadgeVariant = (status: BookingStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'pending': return 'outline';
      case 'confirmed': return 'default';
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };
  
  // Функция для получения названия статуса на русском
  const getStatusName = (status: BookingStatus): string => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'confirmed': return 'Подтверждено';
      case 'active': return 'Активно';
      case 'completed': return 'Завершено';
      case 'cancelled': return 'Отменено';
      case 'rejected': return 'Отклонено';
      default: return 'Неизвестно';
    }
  };
  
  // Форматирование даты
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: ru });
  };
  
  // Форматирование цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Управление бронированиями</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
          <CardDescription>
            Используйте фильтры для поиска бронирований
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Поиск по имени, email или телефону"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-64">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Статус бронирования" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="pending">Ожидающие</SelectItem>
                  <SelectItem value="confirmed">Подтвержденные</SelectItem>
                  <SelectItem value="active">Активные</SelectItem>
                  <SelectItem value="completed">Завершенные</SelectItem>
                  <SelectItem value="cancelled">Отмененные</SelectItem>
                  <SelectItem value="rejected">Отклоненные</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Список бронирований</CardTitle>
          <CardDescription>
            Управление бронированиями клиентов
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Icon name="Loader2" className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-gray-500">Загрузка бронирований...</p>
            </div>
          ) : !filteredBookings?.length ? (
            <div className="text-center py-12">
              <Icon name="Calendar" className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">Нет бронирований</h3>
              <p className="mt-1 text-gray-500">
                {search || statusFilter !== 'all' 
                  ? 'Нет бронирований, соответствующих выбранным фильтрам' 
                  : 'В системе пока нет бронирований'}
              </p>
              {(search || statusFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('all');
                  }}
                >
                  Сбросить фильтры
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Автомобиль</TableHead>
                    <TableHead>Даты аренды</TableHead>
                    <TableHead>Стоимость</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">#{booking.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {booking.clientInfo.firstName} {booking.clientInfo.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.clientInfo.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.clientInfo.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {booking.car ? (
                          <div>
                            <div className="font-medium">
                              {booking.car.brand} {booking.car.model}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.car.year} г., {booking.car.category}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">ID: {booking.carId}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="whitespace-nowrap">
                          <div>С: {formatDate(booking.startDate)}</div>
                          <div>По: {formatDate(booking.endDate)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatPrice(booking.totalPrice)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(booking.status)}>
                          {getStatusName(booking.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Icon name="MoreVertical" size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => handleOpenStatusDialog(booking, 'confirmed')}>
                              <Icon name="CheckCircle" className="mr-2 h-4 w-4" />
                              <span>Подтвердить</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleOpenStatusDialog(booking, 'active')}>
                              <Icon name="Car" className="mr-2 h-4 w-4" />
                              <span>Активировать</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleOpenStatusDialog(booking, 'completed')}>
                              <Icon name="CircleCheck" className="mr-2 h-4 w-4" />
                              <span>Завершить</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleOpenStatusDialog(booking, 'rejected')}>
                              <Icon name="XCircle" className="mr-2 h-4 w-4 text-red-500" />
                              <span className="text-red-500">Отклонить</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleOpenStatusDialog(booking, 'cancelled')}>
                              <Icon name="X" className="mr-2 h-4 w-4 text-red-500" />
                              <span className="text-red-500">Отменить</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Диалог изменения статуса бронирования */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить статус бронирования</DialogTitle>
            <DialogDescription>
              Обновите статус бронирования и добавьте примечание (опционально).
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Новый статус</h4>
              <Select
                value={newStatus}
                onValueChange={(value) => setNewStatus(value as BookingStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Ожидает</SelectItem>
                  <SelectItem value="confirmed">Подтверждено</SelectItem>
                  <SelectItem value="active">Активно</SelectItem>
                  <SelectItem value="completed">Завершено</SelectItem>
                  <SelectItem value="cancelled">Отменено</SelectItem>
                  <SelectItem value="rejected">Отклонено</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Примечание</h4>
              <Textarea
                placeholder="Добавьте примечание (опционально)"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowStatusDialog(false)}
            >
              Отмена
            </Button>
            <Button 
              onClick={handleUpdateStatus}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                  Обновление...
                </>
              ) : (
                'Обновить статус'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookings;