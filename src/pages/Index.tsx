import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/icon';

const featuredCars = [
  {
    id: 1,
    name: 'BMW X5',
    category: 'SUV',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1566473965997-3de9c817e938?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    features: ['Автоматическая КПП', 'Кондиционер', 'Кожаный салон']
  },
  {
    id: 2,
    name: 'Mercedes E-Class',
    category: 'Бизнес',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    features: ['Панорамная крыша', 'Подогрев сидений', 'Навигация']
  },
  {
    id: 3,
    name: 'Toyota Camry',
    category: 'Седан',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    features: ['Экономичный расход', 'Круиз-контроль', 'Камера заднего вида']
  }
];

const services = [
  {
    icon: 'Clock',
    title: 'Быстрое оформление',
    description: 'Займет всего 15 минут при наличии необходимых документов'
  },
  {
    icon: 'Shield',
    title: 'Страховка КАСКО',
    description: 'Все автомобили застрахованы по полной программе'
  },
  {
    icon: 'Headphones',
    title: 'Поддержка 24/7',
    description: 'Наша команда готова помочь вам в любое время дня и ночи'
  }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[500px] bg-gray-900 flex items-center">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
              alt="Luxury car" 
              className="w-full h-full object-cover opacity-50"
            />
          </div>
          <div className="container mx-auto px-4 z-10 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Прокат премиальных автомобилей</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">Откройте для себя свободу передвижения с нашей коллекцией высококлассных автомобилей. Бронируйте онлайн и получите скидку 10%.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/catalog">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Выбрать автомобиль
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                Спецпредложения
              </Button>
            </div>
          </div>
        </section>
        
        {/* Featured Cars */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">Популярные автомобили</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Выберите из нашей коллекции премиальных автомобилей, доступных для проката</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCars.map((car) => (
                <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative h-48 overflow-hidden">
                    <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded">
                      {car.category}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{car.name}</h3>
                    <div className="flex flex-col gap-2 mb-4">
                      {car.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <Icon name="Check" size={16} className="text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-500 text-sm">от</span>
                        <span className="text-2xl font-bold ml-1">{car.price} ₽</span>
                        <span className="text-gray-500 text-sm">/день</span>
                      </div>
                      <Link to={`/car/${car.id}`}>
                        <Button>Забронировать</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link to="/catalog">
                <Button variant="outline" className="gap-2">
                  <span>Смотреть все автомобили</span>
                  <Icon name="ArrowRight" size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Services */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">Наши преимущества</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Мы делаем всё, чтобы ваша поездка была комфортной и безопасной</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-full mb-4">
                    <Icon name={service.icon} size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="bg-primary py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Готовы арендовать автомобиль?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">Бронируйте прямо сейчас и получите скидку 10% на первую аренду</p>
            <Link to="/catalog">
              <Button size="lg" className="bg-white text-primary hover:bg-zinc-100">
                Выбрать автомобиль
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;