import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import Icon from './ui/icon';

const Header = () => {
  return (
    <header className="bg-primary text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="flex items-center gap-2">
          <Icon name="Car" size={24} />
          <span className="text-2xl font-bold">АвтоПрокат</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/catalog" className="hover:text-zinc-200 transition-colors">
            Каталог
          </Link>
          <Link to="/about" className="hover:text-zinc-200 transition-colors">
            О нас
          </Link>
          <Link to="/contacts" className="hover:text-zinc-200 transition-colors">
            Контакты
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <Icon name="ShoppingCart" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Button>
          </Link>
          
          <Link to="/login">
            <Button variant="outline" className="bg-white text-primary hover:bg-zinc-100">
              Войти
            </Button>
          </Link>
          
          <Button className="md:hidden" variant="ghost" size="icon">
            <Icon name="Menu" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;