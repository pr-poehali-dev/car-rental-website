import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import carService from '@/services/carService';

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Запрос данных об автомобиле
  const { data: car, isLoading, error } = useQuery({
    queryKey: ['car', id],
    queryFn: () => carService.getById(id || ''),
    enabled: !!id,
  });
  
  // Если идет загрузка, показываем индикатор
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Icon name="Loader2" className="mx-auto h-8 w-8 animate-spin" />
            <p className="mt-2">Загрузка информации об автомобиле...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Если произошла ошибка, показываем сообщение
  if (error || !car) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Icon name="AlertTriangle" className="mx-auto h-8 w-8 text-yellow-500" />
            <h2 className="mt-2 text-xl font-bold">Ошибка загрузки</h2>
            <p className="mt-1 text-gray-600">Не удалось загрузить информацию об автомобиле.</p>
            <Button asChild className="mt-4">
              <Link to="/">Вернуться на главную</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Форматирование цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Галерея изображений */}
          <div className="lg:w-3/5">
            <div className="relative rounded-lg overflow-hidden h-96 mb-4">
              <img 
                src={car.images[selectedImage] || 'https://via.placeholder.com/800x600?text=Нет+изображения'} 
                alt={`${car.brand} ${car.model}`} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {car.images.length > 1 && (
              <Carousel>
                <CarouselContent>
                  {car.images.map((image, index) => (
                    <CarouselItem key={index} className="basis-1/4">
                      <div 
                        className={`h-24 rounded-lg overflow-hidden cursor-pointer transition-all ${
                          selectedImage === index ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                        }`}
                        onClick={() => setSelectedImage(index)}
                      >
                        <img 
                          src={image} 
                          alt={`${car.brand} ${car.model} - изображение ${index + 1}`} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </div>
          
          {/* Информация об автомобиле */}
          <div className="lg:w-2/5">
            <h1 className="text-3xl font-bold mb-2">{car.brand} {car.model}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                {car.category}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                car.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {car.available ? 'Доступен' : 'Недоступен'}
              </span>
            </div>
            
            <p className="text-gray-700 mb-6">{car.description}</p>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Характеристики</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Icon name="Calendar" className="text-gray-500" size={16} />
                    <span className="text-sm">{car.year} год</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="GitFork" className="text-gray-500" size={16} />
                    <span className="text-sm">
                      {car.transmission === 'automatic' ? 'Автомат' : 'Механика'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Fuel" className="text-gray-500" size={16} />
                    <span className="text-sm">
                      {car.fuelType === 'petrol' ? 'Бензин' : 
                       car.fuelType === 'diesel' ? 'Дизель' : 
                       car.fuelType === 'electric' ? 'Электро' : 'Гибрид'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="UsersRound" className="text-gray-500" size={16} />
                    <span className="text-sm">{car.seats} мест</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Комплектация</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Icon name="Check" className="text-primary" size={16} />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Стоимость аренды</CardTitle>
                <CardDescription>Выберите подходящий тариф</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <div className="font-medium">Поденно</div>
                      <div className="text-sm text-gray-500">Минимум 1 день</div>
                    </div>
                    <div className="text-xl font-bold">{formatPrice(car.pricePerDay)}<span className="text-sm font-normal">/день</span></div>
                  </div>
                  
                  {car.pricePerWeek && (
                    <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                      <div>
                        <div className="font-medium">Неделя</div>
                        <div className="text-sm text-gray-500">7 дней</div>
                      </div>
                      <div className="text-xl font-bold">{formatPrice(car.pricePerWeek)}</div>
                    </div>
                  )}
                  
                  {car.pricePerMonth && (
                    <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                      <div>
                        <div className="font-medium">Месяц</div>
                        <div className="text-sm text-gray-500">30 дней</div>
                      </div>
                      <div className="text-xl font-bold">{formatPrice(car.pricePerMonth)}</div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={`/booking/${car.id}`}>
                    Забронировать
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CarDetails;