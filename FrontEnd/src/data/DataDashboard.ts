import {
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  SwapHoriz as SwapIcon,
} from '@mui/icons-material';
import React from 'react';

export const fundOverviewData = {
  totalFunds: 1000000,
  totalLoans: 800000,
  availableFunds: 200000,
  totalMembers: 100,
  activeLoans: 50,
  defaultLoans: 5
};

export const recentTransactions = [
  {
    id: 1,
    type: 'ฝากเงิน',
    amount: 5000,
    member: 'นายสมชาย ใจดี',
    date: '2024-01-20',
    time: '14:30'
  },
  {
    id: 2,
    type: 'ชำระเงินกู้',
    amount: 3000,
    member: 'นางสาวสมหญิง รักดี',
    date: '2024-01-19',
    time: '11:45'
  },
  {
    id: 3,
    type: 'ถอนเงิน',
    amount: 2000,
    member: 'นายสมศักดิ์ มั่งมี',
    date: '2024-01-18',
    time: '09:15'
  },
];

export const upcomingPayments = [
  {
    id: 1,
    member: 'นายสมชาย ใจดี',
    amount: 5000,
    dueDate: '2024-02-01',
    status: 'กำลังจะถึงกำหนด',
    daysLeft: 3
  },
  {
    id: 2,
    member: 'นางสาวสมหญิง รักดี',
    amount: 3000,
    dueDate: '2024-02-05',
    status: 'ปกติ',
    daysLeft: 7
  },
];

export const alerts = [
  {
    id: 1,
    type: 'error',
    title: 'การชำระเงินค้างชำระ',
    message: 'มีสมาชิก 3 คนค้างชำระเกิน 30 วัน',
    timestamp: '2 ชั่วโมงที่แล้ว'
  },
  {
    id: 2,
    type: 'warning',
    title: 'เงินกองทุนใกล้ถึงขีดจำกัด',
    message: 'เงินกองทุนคงเหลือต่ำกว่า 20%',
    timestamp: '3 ชั่วโมงที่แล้ว'
  },
  {
    id: 3,
    type: 'info',
    title: 'การประชุมกองทุน',
    message: 'การประชุมกองทุนประจำเดือนวันที่ 1 ก.พ. 2567',
    timestamp: '5 ชั่วโมงที่แล้ว'
  },
];

export const graphData = [
  { name: 'ม.ค.', เงินกู้: 4000, การชำระ: 2400 },
  { name: 'ก.พ.', เงินกู้: 3000, การชำระ: 1398 },
  { name: 'มี.ค.', เงินกู้: 2000, การชำระ: 9800 },
  { name: 'เม.ย.', เงินกู้: 2780, การชำระ: 3908 },
  { name: 'พ.ค.', เงินกู้: 1890, การชำระ: 4800 },
  { name: 'มิ.ย.', เงินกู้: 2390, การชำระ: 3800 },
  { name: 'ก.ค.', เงินกู้: 3490, การชำระ: 4300 },
];

export const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'ฝากเงิน':
      return ArrowUpIcon;
    case 'ถอนเงิน':
      return ArrowDownIcon;
    case 'ชำระเงินกู้':
      return SwapIcon;
    default:
      return SwapIcon;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'กำลังจะถึงกำหนด':
      return 'warning';
    case 'เลยกำหนด':
      return 'error';
    default:
      return 'success';
  }
};
