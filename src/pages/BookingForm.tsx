import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import carService from '@/services/carService';
import bookingService from '@/services/bookingService';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

// Схема валидации формы бронирования
const bookingFormSchema = z.object({
  startDate: z.date({
    required_error: "Укажите дату начала аренды",
  }),
  endDate: z.date({
    required_error: "Укажите дату окончания аренды",
  }),
  firstName: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  lastName: z.string().min(2, "Фамилия должна содержать минимум 2 символа"),
  email: z.string().email("Укажите корректный email адрес"),
  phone: z.string().min(10, "Телефон должен содержать минимум 10 цифр"),
}).refine(data => {
  return data.endDate > data.startDate;
}, {
  message: "Дата окончания должна быть позже даты начала",
  path: ["endDate"],
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const BookingForm = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Получаем данные об автомобиле
  const { data: car, isLoading: isCarLoading } = useQuery({
    queryKey: ['car', carId],
    queryFn: () => carService.getById(carId || ''),
    enabled: !!carId,
  });
  
  // Инициализация формы
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000), // +1 день
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  });
  
  // Вычисляем количество дней аренды и стоимость
  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');
  
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const rentalCost = car ? car.pricePerDay * (daysDiff || 1) : 0;
  
  // Обработка отправки формы
  const onSubmit = async (data: BookingFormValues) => {
    if (!car) return;
    
    setIsSubmitting(true);
    
    try {
      // Проверяем доступность автомобиля
      const availabilityCheck = await carService.checkAvailability(
        parseInt(carId || '0'), 
        format(data.startDate, 'yyyy-MM-dd'),
        format(data.endDate, 'yyyy-MM-dd')
      );
      
      if (!availabilityCheck.available) {
        toast({
          title: "Автомобиль недоступен",
          description: "Выбранный автомобиль недоступен в указанные даты. Пожалуйста, выберите другие даты.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Создаем бронирование
      await bookingService.createBooking({
        carId: parseInt(carId || '0'),
        startDate: format(data.startDate, 'yyyy-MM-dd'),
        endDate: format(data.endDate, 'yyyy-MM-dd'),
        clientInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
        },
      });
      
      toast({
        title: "Бронирование создано",
        description: "Ваше бронирование успешно создано. Мы отправим подтверждение на указанный email.",
      });
      
      // Перенаправляем на страницу подтверждения
      navigate('/booking/success');
    } catch (error) {
      console.error('Ошибка при создании бронирования:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при создании бронирования. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Форматирование цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  if (isCarLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Icon name="Loader2" className="mx-auto h-8 w-8 animate-spin" />
            <p className="mt-2">Загрузка информации...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!car) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Icon name="AlertTriangle" className="mx-auto h-8 w-8 text-yellow-500" />
            <h2 className="mt-2 text-xl font-bold">Автомобиль не найден</h2>
            <p className="mt-1 text-gray-600">Не удалось найти запрашиваемый автомобиль.</p>
            <Button asChild className="mt-4">
              <a href="/">Вернуться на главную</a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Бронирование автомобиля</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Форма бронирования */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Период аренды</h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Дата начала</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-start text-left font-normal"
                                    >
                                      <Icon name="Calendar" className="mr-2 h-4 w-4" />
                                      {field.value ? (
                                        format(field.value, 'PPP', { locale: ru })
                                      ) : (
                                        <span>Выберите дату</span>
                                      )}
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Дата окончания</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-start text-left font-normal"
                                    >
                                      <Icon name="Calendar" className="mr-2 h-4 w-4" />
                                      {field.value ? (
                                        format(field.value, 'PPP', { locale: ru })
                                      ) : (
                                        <span>Выберите дату</span>
                                      )}
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => 
                                      date < new Date() || 
                                      date < startDate
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Персональные данные</h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Имя</FormLabel>
                              <FormControl>
                                <Input placeholder="Иван" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Фамилия</FormLabel>
                              <FormControl>
                                <Input placeholder="Иванов" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="example@mail.ru" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Телефон</FormLabel>
                              <FormControl>
                                <Input placeholder="+7 (999) 123-45-67" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                            Оформление...
                          </>
                        ) : (
                          'Оформить бронирование'
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
            
            {/* Информация о бронировании */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Ваше бронирование</h2>
                
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-16 h-16 rounded-md bg-cover bg-center" 
                    style={{ backgroundImage: `url(${car.images[0] || 'https://via.placeholder.com/150'})` }}
                  />
                  <div>
                    <div className="font-semibold">{car.brand} {car.model}</div>
                    <div className="text-sm text-gray-500">{car.category}</div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Период аренды:</span>
                    <span className="font-medium">{daysDiff} дней</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Стоимость в день:</span>
                    <span className="font-medium">{formatPrice(car.pricePerDay)}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Итого:</span>
                  <span>{formatPrice(rentalCost)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingForm;