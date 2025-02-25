import {
  Dashboard as DashboardIcon,
  AccountBalance,
  Payment,
  Assessment,
  People,
  Settings,
  List,
  PersonAdd,
} from '@mui/icons-material';

export const menuItems = [
  {
    text: 'Dashboard',
    icon: DashboardIcon,
    path: '/',
    nameTH: 'แดชบอร์ด',
  },
  {
    text: 'Members',
    icon: People,
    path: '/members',
    nameTH: 'สมาชิก',
    children: [
      {
        text: 'List Members',
        icon: List,
        path: '/members',
        nameTH: 'รายชื่อสมาชิก',
      },
      {
        text: 'Add Member',
        icon: PersonAdd,
        path: '/members/addmember',
        nameTH: 'เพิ่มสมาชิก',
      },
    ],
  },
  {
    text: 'Accounts',
    icon: AccountBalance,
    path: '/search',
    nameTH: 'ค้นหาบัญชี',
  children: [
      {
        text: 'Search',
        icon: List,
        path: '/search',
        nameTH: 'ค้นหาบัญชี'},
        {
          text: 'Deposit&Withdraw',
          icon: List,
          path: '/transactions',
          nameTH: 'ธุรกรรม'},
          {
            text: 'Traansactions',
            icon: List,
            path: '/transactions/history',
            nameTH: 'ประวัติธุรกรรม'},
      ]
  },
  {
    text: 'Loan',
    icon: Payment,
    path: '/loan',
    nameTH: 'การกู้ยืม',
    children: [
      {
        text: 'Loan',
        icon: List,
        path: '/loan',
        nameTH: 'การกู้ยืม',
      },
      {
        text: 'Loan History',
        icon: List,
        path: '/loan/history',
        nameTH: 'ประวัติการกู้ยืม',
      },
    ],
  },
  {
    text: 'Reports',
    icon: Assessment,
    path: '/reports',
    nameTH: 'รายงาน',
  },
  {
    text: 'Settings',
    icon: Settings,
    path: '/settings',
    nameTH: 'ตั้งค่า',
  },
];