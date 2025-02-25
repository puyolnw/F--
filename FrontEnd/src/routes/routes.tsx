import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/dashboard';
import Layout from '../components/Layout';
import AuthenLayout from '../components/Auth/AuthenLayout';
import LoginPage from '../pages/Auth/Login/login';
import MembersPage from '../pages/Members/Members';
import AddMembers from '../pages/Members/AddMembers';
import SearchAccount from '../pages/Account/Search/Search';
import SearchResults from '../pages/Account/Search/SearchResults';
import TransactionForm from '../pages/Account/Transactions/TransactionForm';
import TransactionsHistory from '../pages/Account/Transactions/TransactionsHistory';
import Loan from '../pages/Loan/LoancontForm';
import LoanHistory from '../pages/Loan/LoanHistory';

import ProtectedRoute from '../components/Auth/ProtectedRoute'; // นำเข้า ProtectedRoute





import {
  Dashboard as DashboardIcon,
  AccountBalance,
  Payment
} from '@mui/icons-material';



export const routes = [
  {
    path: '/',
    element: <ProtectedRoute />, // ใช้ ProtectedRoute เพื่อบังคับให้ต้อง login ก่อน
    children: [
      {
        path: '/',
        element: <Layout />, // Layout หลักสำหรับหน้า Dashboard และอื่นๆ
        children: [
          {
            path: '',
            name: 'Dashboard',
            nameTH: 'แดชบอร์ด',
            icon: DashboardIcon,
            element: <Dashboard />
          },
          {
            path: '/members/addmember',
            name: 'AddMember',
            nameTH: 'เพิ่มสมาชิก',
            element: <AddMembers />
          },
          {
            path: '/search',
            name: 'Search',
            nameTH: 'ค้นหาบัญชี',
            icon: Payment,
            element: <SearchAccount />
          },
          {
            path: '/searchresults',
            name: 'SearchResults',
            nameTH: 'ผลการค้นหา',
            icon: Payment,
            element: <SearchResults />
          },
          {
            path: '/members',
            name: 'Members',
            nameTH: 'สมาชิก',
            icon: Payment,
            element: <MembersPage />
          },
          {
            path: '/transactions',
            name: 'Transactions',
            nameTH: 'ธุรกรรม',
            icon: Payment,
            element: <TransactionForm />
          },
          {
            path: '/transactions/history',
            name: 'Transactions History',
            nameTH: 'ประวัติธุรกรรม',
            icon: Payment,
            element: <TransactionsHistory />
          },
          {
            path: '/loan',
            name: 'Loan',
            nameTH: 'การกู้ยืม',
            icon: Payment,
            element: <Loan/>
          },
          {
            path: '/loan/history',
            name: 'Loan History',
            nameTH: 'ประวัติการกู้ยืม',
            icon: Payment,
            element: <LoanHistory/>
          },
        ]
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthenLayout />, // Layout สำหรับ Authentication
    children: [
      {
        path: 'login',
        name: 'Login',
        nameTH: 'เข้าสู่ระบบ',
        element: <LoginPage />
      }
    ]
  }
];

const router = createBrowserRouter(routes);

export default router;