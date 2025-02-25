import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthenLayout: React.FC = () => {
  return (
    <Outlet /> // แสดงเฉพาะ children ที่ส่งผ่าน Route
  );
};

export default AuthenLayout;