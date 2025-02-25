import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  // ตรวจสอบสถานะการเข้าสู่ระบบ (ตัวอย่างใช้ localStorage)
  const isAuthenticated = !!localStorage.getItem('token'); // true ถ้ามี token

  // หากไม่ได้เข้าสู่ระบบ ให้เปลี่ยนเส้นทางไปหน้า Login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // หากเข้าสู่ระบบแล้ว แสดงหน้าเพจที่ร้องขอ
  return <Outlet />;
};

export default ProtectedRoute;