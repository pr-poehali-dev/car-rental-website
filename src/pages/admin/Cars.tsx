import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import Icon from '@/components/ui/icon';
import { Car } from '@/lib/models';
import carService from '@/services/carService';
import { useToast } from '@/hooks/use-toast';

const AdminCars = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Загружаем список автомобилей
  const { data: cars, isLoading, refetch } = useQuery({
    queryKey: ['cars'],
    queryFn: () => carService.getAll(),
  });
  
  // Загружаем список категорий
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => carService.getCategories(),
  });
  
  // Обработчик удаления автомобиля
  const handleDelete = async (car: Car) => {
    if (!confirm(`Вы уверены, что хотите удалить ${car.brand} ${car.model}?`)) {
      return;
    }
    
    try {
      await carService.delete(car.id);
      
      toast({
        title: "Автомобиль удален",
        description: `${car.brand} ${car.model} успешно удален из базы данных.`,
      });
      
      // Обновляем список автомобилей
      refetch();
    } catch (error) {
      console.error('Ошибка при удалении автомобиля:', error);
      
      toast({
        title: "Ошибка удаления",
        description: "Не удалось удалить автомобиль. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      });
    }
  };
  
  // Обработчик изменения статуса доступности
  const handleToggleAvailability = async (car: Car) => {
    try {
      await carService.update(car.id, { 
        available: !car.available 
      });
      
      toast({
        title: "Статус обновлен",
        description: `${car.brand} ${car.model} теперь ${!car.available ? 'доступен' : 'недоступен'} для бронирования.`,
      });
      
      // Обновляем список автомобилей
      refetch();
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
      
      toast({
        title: "Ошибка обновления",
        description: "Не удалось обновить статус автомобиля. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      });
    }
  };
  
  // Фильтрация автомобилей
  const filteredCars = cars?.filter(car => {
    const matchesSearch = search === '' ||
      car.brand.toLowerCase().includes(search.toLowerCase()) ||
      car.model.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || car.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Управление автомобилями</h1>
        <Button asChild>
          <Link to="/admin/cars/new">
            <Icon name="Plus" className="mr-2 h-4 w-4" />
            Добавить автомобиль
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
          <CardDescription>
            Используйте фильтры для поиска автомобилей
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Поиск по марке или модели"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-64">
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {categories?.map((category: string) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Список автомобилей</CardTitle>
          <CardDescription>
            Управление автомобилями в базе данных
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Icon name="Loader2" className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-gray-500">Загрузка списка автомобилей...</p>
            </div>
          ) : !filteredCars?.length ? (
            <div className="text-center py-12">
              <Icon name="Car" className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">Нет автомобилей</h3>
              <p className="mt-1 text-gray-500">
                {search || categoryFilter !== 'all' 
                  ? 'Нет автомобилей, соответствующих выбранным фильтрам' 
                  : 'В базе данных пока нет автомобилей'}
              </p>
              {(search || categoryFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearch('');
                    setCategoryFilter('all');
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
                    <TableHead>Автомобиль</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Цена за день</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCars.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-md bg-cover bg-center" 
                            style={{ backgroundImage: `url(${car.images[0] || 'https://via.placeholder.com/150'})` }}
                          />
                          <div>
                            <div className="font-medium">{car.brand} {car.model}</div>
                            <div className="text-sm text-gray-500">{car.year} г.</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{car.category}</TableCell>
                      <TableCell>{formatPrice(car.pricePerDay)}</TableCell>
                      <TableCell>
                        <div 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            car.available 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {car.available ? 'Доступен' : 'Недоступен'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleToggleAvailability(car)}
                            title={car.available ? 'Сделать недоступным' : 'Сделать доступным'}
                          >
                            <Icon name={car.available ? 'EyeOff' : 'Eye'} size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            asChild
                          >
                            <Link to={`/admin/cars/${car.id}`} title="Редактировать">
                              <Icon name="Pencil" size={16} />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(car)}
                            title="Удалить"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCars;