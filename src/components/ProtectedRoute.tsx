import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// Типы ролей пользователей в системе
type UserRole = 'admin' | 'manager' | 'client';

interface ProtectedRouteProps {
  children?: ReactNode;
  roles?: UserRole[];
}

// Компонент для защиты маршрутов, требующих авторизации
const ProtectedRoute = ({ children, roles = [] }: ProtectedRouteProps) => {
  // Проверяем наличие токена авторизации
  const token = localStorage.getItem('auth_token');
  
  // Если токена нет, перенаправляем на страницу логина
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Проверка роли пользователя в системе
  // В реальном приложении здесь будет запрос к API
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      // Имитация запроса к API
      return new Promise<{ id: number; role: UserRole }>((resolve) => {
        setTimeout(() => {
          // В реальном приложении здесь будет запрос к API
          // Для демонстрации возвращаем фиктивного пользователя с ролью admin
          resolve({ id: 1, role: 'admin' });
        }, 100);
      });
    },
    // Не выполняем запрос, если нет токена
    enabled: !!token,
  });
  
  // Пока идет загрузка, можно показать индикатор загрузки
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  }
  
  // Проверяем, имеет ли пользователь необходимую роль
  if (roles.length > 0 && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  // Если пользователь авторизован и имеет необходимую роль, показываем защищенный контент
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;