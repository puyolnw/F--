import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  Container,
  List,
  ListItem,
  Avatar,
  Chip,
  Button,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  CalendarToday,
  ArrowUpward,
  ArrowDownward,
  KeyboardArrowRight as ArrowRightIcon
} from '@mui/icons-material';
import { upcomingPayments, getStatusColor } from '../../data/DataDashboard';

interface FundAccount {
  fund_account_id: number;
  fund_account_balance: number;
}

interface Transaction {
  transaction_id: number;
  deposit: number;
  withdrawal: number;
  transaction_date: string;
  by_user: string;
}

interface Payment {
  id: number;
  member: string;
  amount: number;
  dueDate: string;
  status: string;
  daysLeft: number;
}

interface LoanStatsResponse {
  monthlyLoans: Array<{
    month: string;
    loans: number;
  }>;
  repaymentData: Array<{
    month: string;
    repayments: number;
  }>;
}

interface ChartData {
  month: string;
  loans: number;
  repayments: number;
}

const Dashboard: React.FC = () => {
  const [totalFunds, setTotalFunds] = useState<number>(0);
  const [loanFunds, setLoanFunds] = useState<number>(0);
  const [sajjaFunds, setSajjaFunds] = useState<number>(0);
  const [memberCount, setMemberCount] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch fund accounts
      const fundResponse = await fetch('http://localhost:3301/api/fundaccount');
      const fundData: FundAccount[] = await fundResponse.json();
      
      const fund1 = Number(fundData.find(f => f.fund_account_id === 1)?.fund_account_balance) || 0;
      const fund2 = Number(fundData.find(f => f.fund_account_id === 2)?.fund_account_balance) || 0;
      const fund4 = Number(fundData.find(f => f.fund_account_id === 4)?.fund_account_balance) || 0;

      setTotalFunds(fund1 + fund2 + fund4);
      setLoanFunds(fund4);
      setSajjaFunds(fund2);

      // Fetch member count
      const memberResponse = await fetch('http://localhost:3301/api/members');
      const memberData = await memberResponse.json();
      setMemberCount(memberData.length);

      // Fetch loan statistics
      const loanStatsResponse = await fetch('http://localhost:3301/api/fundaccount/5/report');
      const loanStatsData: LoanStatsResponse = await loanStatsResponse.json();

      // Get only last 6 months of data
      const last6MonthsLoans = [...loanStatsData.monthlyLoans]
  .reverse()
  .slice(0, 6)
  .reverse(); // Reverse again to show in chronological order

const combinedData = last6MonthsLoans.map(loan => {
  const matchingRepayment = loanStatsData.repaymentData.find(
    repay => repay.month === loan.month
  );

  return {
    month: new Date(loan.month + '-01').toLocaleDateString('th-TH', { month: 'short' }),
    loans: Number(loan.loans),
    repayments: matchingRepayment ? Number(matchingRepayment.repayments) : 0
  };
});

setChartData(combinedData);

      // Fetch recent transactions
      const transactionResponse = await fetch('http://localhost:3301/api/transactions');
      const transactionData: Transaction[] = await transactionResponse.json();
      setTransactions(transactionData.slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'none', minHeight: '100vh', pt: 3 }}>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center', color: 'var(--text-primary-dark)' }}>
          ภาพรวมกองทุนหมู่บ้าน
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ p: 3, bgcolor: '#1976d2', color: 'white', boxShadow: 3, borderRadius: 2 }}>
              <Typography variant="h6">ยอดเงินคงเหลือ</Typography>
              <Typography variant="h4">{formatCurrency(totalFunds)}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ p: 3, bgcolor: '#2e7d32', color: 'white', boxShadow: 3, borderRadius: 2 }}>
              <Typography variant="h6">เงินให้กู้ยืม</Typography>
              <Typography variant="h4">{formatCurrency(loanFunds)}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ p: 3, bgcolor: '#ed6c02', color: 'white', boxShadow: 3, borderRadius: 2 }}>
              <Typography variant="h6">กองทุนสัจจะ</Typography>
              <Typography variant="h4">{formatCurrency(sajjaFunds)}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ p: 3, bgcolor: '#9c27b0', color: 'white', boxShadow: 3, borderRadius: 2 }}>
              <Typography variant="h6">สมาชิกทั้งหมด</Typography>
              <Typography variant="h4">{memberCount} คน</Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sx={{ margin: '0 auto' }}>
            <Card sx={{ 
              p: 3, 
              boxShadow: 3, 
              borderRadius: 2, 
              minHeight: '450px',
              width: '100%',
              mx: 'auto'
            }}>
              <Typography variant="h6" gutterBottom align="center">
                สถิติการกู้ยืมและชำระเงิน
              </Typography>
              <ResponsiveContainer width="100%" height={375}>
                <LineChart data={chartData} margin={{ top: 15, right: 25, left: 15, bottom: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    height={45}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value)}
                    domain={[0, 250000]}
                    ticks={[0, 50000, 100000, 150000, 200000, 250000]}
                    width={75}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                    labelFormatter={(label) => `เดือน: ${label}`}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Legend 
                    height={27}
                    iconSize={12}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="loans" 
                    name="ยอดปล่อยกู้" 
                    stroke="#2196f3"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="repayments" 
                    name="ยอดชำระคืน" 
                    stroke="#4caf50"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  ธุรกรรมล่าสุด
                </Typography>
                <Button endIcon={<ArrowRightIcon />} size="small">
                  ดูทั้งหมด
                </Button>
              </Box>
              <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {transactions.map((transaction) => (
                  <ListItem
                    key={transaction.transaction_id}
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      p: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                      <Avatar sx={{
                        bgcolor: transaction.deposit > 0 ? 'success.light' : 'error.light'
                      }}>
                        {transaction.deposit > 0 ? <ArrowUpward /> : <ArrowDownward />}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {transaction.deposit > 0 ? 'ฝากเงิน' : 'ถอนเงิน'}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color={transaction.deposit > 0 ? 'success.main' : 'error.main'}
                            fontWeight="bold"
                          >
                            {transaction.deposit > 0
                              ? `+ ${formatCurrency(transaction.deposit)}`
                              : `- ${formatCurrency(transaction.withdrawal)}`}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(transaction.transaction_date).toLocaleDateString('th-TH')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {transaction.by_user}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  กำหนดชำระเงินที่ใกล้ถึง
                </Typography>
                <Button endIcon={<ArrowRightIcon />} size="small">
                  ดูทั้งหมด
                </Button>
              </Box>
              <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {upcomingPayments.map((payment: Payment) => (
                  <ListItem
                    key={payment.id}
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      p: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        <CalendarToday />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {payment.member}
                          </Typography>
                          <Typography variant="subtitle1" color="primary" fontWeight="bold">
                            {formatCurrency(payment.amount)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            กำหนดชำระ: {payment.dueDate}
                          </Typography>
                          <Chip
                            label={payment.status}
                            size="small"
                            color={getStatusColor(payment.status)}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
