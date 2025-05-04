import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

// Административный интерфейс с боковой панелью навигации
const AdminLayout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  // Элементы навигации
  const navItems = [
    { name: 'Панель управления', path: '/admin', icon: 'LayoutDashboard' },
    { name: 'Автомобили', path: '/admin/cars', icon: 'Car' },
    { name: 'Бронирования', path: '/admin/bookings', icon: 'CalendarCheck' },
    { name: 'Пользователи', path: '/admin/users', icon: 'Users' },
  ];

  // Функция выхода из аккаунта
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Верхняя панель навигации (мобильная) */}
      <div className="flex lg:hidden bg-white border-b p-4 justify-between items-center">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icon name="Menu" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Icon name="Car" size={24} />
                  <span className="text-lg font-bold">АвтоПрокат</span>
                  <div className="ml-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                    Админ
                  </div>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2 p-2 rounded-md transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`
                      }
                      end={item.path === '/admin'}
                    >
                      <Icon name={item.icon} size={18} />
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <span className="text-lg font-bold">Панель управления</span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <Icon name="LogOut" />
        </Button>
      </div>

      {/* Основной контейнер */}
      <div className="flex">
        {/* Боковая панель (десктоп) */}
        <div className="hidden lg:flex flex-col w-64 bg-white border-r h-screen fixed">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Icon name="Car" size={24} />
              <span className="text-lg font-bold">АвтоПрокат</span>
              <div className="ml-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                Админ
              </div>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 p-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  end={item.path === '/admin'}
                >
                  <Icon name={item.icon} size={18} />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={handleLogout}
            >
              <Icon name="LogOut" size={18} />
              <span>Выйти</span>
            </Button>
          </div>
        </div>

        {/* Основной контент */}
        <div className="lg:ml-64 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;