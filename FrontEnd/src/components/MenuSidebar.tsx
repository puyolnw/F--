import {
  Dashboard as DashboardIcon,
  AccountBalance,
  Payment,
  People,
  Settings,
  PersonAdd,
  List as ListIcon,
  History,
  Search,
  AccountBalanceWallet,
  Receipt,
  MonetizationOn,
  AssignmentReturn,
  CreditScore,
  AccountTree
} from '@mui/icons-material';

export const menuItems = [
  {
    text: 'หน้าหลัก',
    icon: DashboardIcon,
    path: '/',
    nameTH: 'หน้าหลัก',
  },
  {
    text: 'สมาชิก',
    icon: People,
    path: '/members',
    nameTH: 'สมาชิก',
    children: [
      {
        text: 'รายชื่อสมาชิก',
        icon: ListIcon,
        path: '/members',
        nameTH: 'รายชื่อสมาชิก',
      },
      {
        text: 'เพิ่มสมาชิก',
        icon: PersonAdd,
        path: '/members/addmember',
        nameTH: 'เพิ่มสมาชิก',
      },
    ],
  },
  {
    text: 'บัญชี',
    icon: AccountBalance,
    path: '/search',
    nameTH: 'กองทุนสัจจะ',
    children: [
      {
        text: 'ค้นหาบัญชี',
        icon: Search,
        path: '/search',
        nameTH: 'ค้นหาบัญชี'
      },
      {
        text: 'ฝาก-ถอน',
        icon: AccountBalanceWallet,
        path: '/transactions',
        nameTH: 'ธุรกรรม'
      },
      {
        text: 'ประวัติธุรกรรม',
        icon: History,
        path: '/transactions/history',
        nameTH: 'ประวัติธุรกรรม'
      },
    ]
  },
  {
    text: 'เงินกู้',
    icon: MonetizationOn,
    path: '/loan',
    nameTH: 'การกู้ยืม',
    children: [
      {
        text: 'สัญญาเงินกู้',
        icon: Receipt,
        path: '/loan',
        nameTH: 'การกู้ยืม',
      },
      {
        text: 'ประวัติการกู้ยืม',
        icon: AssignmentReturn,
        path: '/loan/history',
        nameTH: 'ประวัติการกู้ยืม',
      },
      {
        text: 'ชำระเงินกู้',
        icon: CreditScore,
        path: '/payment',
        nameTH: 'การชำระเงิน',
      },
    ],
  },
  {
    text: 'บัญชีกองทุน',
    icon: AccountTree,
    path: '/FundAccounts',
    nameTH: 'บัญชีกองทุน',
  },
  {
    text: 'ตั้งค่า',
    icon: Settings,
    path: '/settings',
    nameTH: 'ตั้งค่า',
  },
];
