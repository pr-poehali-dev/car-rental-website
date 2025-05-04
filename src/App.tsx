
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLayout from "./components/layouts/AdminLayout";
import CarDetails from "./pages/CarDetails";
import BookingForm from "./pages/BookingForm";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminCars from "./pages/admin/Cars";
import AdminBookings from "./pages/admin/Bookings";
import UserProfile from "./pages/user/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/" element={<Index />} />
          <Route path="/car/:id" element={<CarDetails />} />
          <Route path="/booking/:carId" element={<BookingForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Маршруты пользователя (защищенные) */}
          <Route path="/user" element={<ProtectedRoute roles={['client', 'admin', 'manager']} />}>
            <Route path="profile" element={<UserProfile />} />
            <Route path="bookings" element={<div>Мои бронирования</div>} />
            <Route path="" element={<Navigate to="/user/profile" replace />} />
          </Route>
          
          {/* Маршруты администратора (защищенные) */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin', 'manager']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="" element={<AdminDashboard />} />
            <Route path="cars" element={<AdminCars />} />
            <Route path="cars/:id" element={<div>Редактирование автомобиля</div>} />
            <Route path="cars/new" element={<div>Новый автомобиль</div>} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="bookings/:id" element={<div>Детали бронирования</div>} />
            <Route path="users" element={<div>Пользователи</div>} />
          </Route>
          
          {/* Перенаправление при отсутствии страницы */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;