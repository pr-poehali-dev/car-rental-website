import { Link } from 'react-router-dom';
import Icon from './ui/icon';

const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-zinc-300 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Icon name="Car" size={24} />
              <span className="text-xl font-bold text-white">АвтоПрокат</span>
            </Link>
            <p className="text-sm">
              Мы предлагаем широкий выбор автомобилей для проката по доступным ценам. Наша миссия - обеспечить вас комфортным и надежным транспортом.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition-colors">Главная</Link></li>
              <li><Link to="/catalog" className="hover:text-white transition-colors">Каталог</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">О нас</Link></li>
              <li><Link to="/contacts" className="hover:text-white transition-colors">Контакты</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Контакты</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Icon name="Phone" size={16} />
                <span>+7 (999) 123-45-67</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Mail" size={16} />
                <span>info@autoprokrat.ru</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="MapPin" size={16} />
                <span>г. Москва, ул. Примерная, 123</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Мы в соцсетях</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">
                <Icon name="Instagram" size={24} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Icon name="Facebook" size={24} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Icon name="Twitter" size={24} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Icon name="Youtube" size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 mt-8 pt-6 text-center">
          <p>&copy; 2025 АвтоПрокат. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;