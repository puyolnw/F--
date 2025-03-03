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
import LoanDetail from '../pages/Loan/LoanDetail';
import TransactionDetail from '../pages/Account/Transactions/TransactionsDetail';
import ProtectedRoute from '../components/Auth/ProtectedRoute'; // นำเข้า ProtectedRoute
import AccountDetail from '../pages/Account/AccountDetail';
import LoanPayment from '../pages/Loan/LoanPayment';

import MainFundAccount from '../pages/FundAccount/FA/1';
import LoanFundAccount from '../pages/FundAccount/FA/3';
import SajjaFundAccount from '../pages/FundAccount/FA/2';



import {
  Dashboard as DashboardIcon,
  AccountBalance,
  Payment
} from '@mui/icons-material';
import FundAccount from '../pages/FundAccount/FundAccount';



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
            path: '/',
            name: 'Dashboard',
            nameTH: 'หน้าหลัก',
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
            path: '/searchresults',  // Remove the :id parameter
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
          {
            path: '/loan/history/:id', // เปลี่ยนเป็น dynamic route
            name: 'Loan Detail',
            nameTH: 'รายละเอียดการกู้',
            icon: Payment,
            element: <LoanDetail/>,
            hideInMenu: true // ซ่อนจากเมนูหลัก
          },
          {
            path: '/transactions/detail/:id', // เปลี่ยนเป็น dynamic route
            name: 'transactions detail',
            nameTH: 'รายละเอียดธุรกรรม',
            icon: Payment,
            element: <TransactionDetail/>,
            hideInMenu: true // ซ่อนจากเมนูหลัก
          },
          {
            path: '/account-details/:id', // เปลี่ยนเป็น dynamic route
            name: 'account detail',
            nameTH: 'หน้าบัญชี',
            icon: Payment,
            element: <AccountDetail/>,
            hideInMenu: true // ซ่อนจากเมนูหลัก
          },
          {
            path: '/payment', // เปลี่ยนเป็น dynamic route
            name: 'payment',
            nameTH: 'ชำระเงิน',
            icon: Payment,
            element: <LoanPayment/>,
          },
          {
            path: '/fundaccounts', // เปลี่ยนเป็น dynamic route
            name: 'Fund Accounts',
            nameTH: 'บัญชีกองทุน',
            icon: Payment,
            element: <FundAccount/>,
          },
          {
            path: '/MainFundAccount', // เปลี่ยนเป็น dynamic route
            name: 'Main Account',
            nameTH: 'บัญชีกองทุน 1',
            icon: Payment,
            element: <MainFundAccount/>,
          },
          {
            path: '/SajjaFundAccount', // เปลี่ยนเป็น dynamic route
            name: 'Sajja Accounts',
            nameTH: 'บัญชีกองทุนสัจจะ',
            icon: Payment,
            element: <SajjaFundAccount/>,
          },
          {
            path: '/LoanFundAccount', // เปลี่ยนเป็น dynamic route
            name: 'Loan Accounts',
            nameTH: 'บัญชีกองทุนกู้ยืม',
            icon: Payment,
            element: <LoanFundAccount/>,
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