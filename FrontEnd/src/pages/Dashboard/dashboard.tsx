import React from 'react';
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
  Alert,
  AlertTitle
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
  Warning as WarningIcon,
  Notifications as NotificationIcon,
  CalendarToday as CalendarIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  SwapHoriz as SwapIcon,
  AccessTime as TimeIcon,
  KeyboardArrowRight as ArrowRightIcon
} from '@mui/icons-material';
import {
  fundOverviewData,
  recentTransactions,
  upcomingPayments,
  alerts,
  graphData,
  getTransactionIcon,
  getStatusColor
} from '../../data/DataDashboard';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'none)', minHeight: '100vh', pt: 3 }}>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center', color: 'var(--text-primary-dark)' }}>
          ภาพรวมกองทุนหมู่บ้าน
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ p: 3, bgcolor: '#1976d2', color: 'white', boxShadow: 3, borderRadius: 2 }}>
              <Typography variant="h6">เงินกองทุนทั้งหมด</Typography>
              <Typography variant="h4">{fundOverviewData.totalFunds.toLocaleString()} บาท</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ p: 3, bgcolor: '#2e7d32', color: 'white', boxShadow: 3, borderRadius: 2 }}>
              <Typography variant="h6">เงินให้กู้ยืม</Typography>
              <Typography variant="h4">{fundOverviewData.totalLoans.toLocaleString()} บาท</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ p: 3, bgcolor: '#ed6c02', color: 'white', boxShadow: 3, borderRadius: 2 }}>
              <Typography variant="h6">เงินคงเหลือ</Typography>
              <Typography variant="h4">{fundOverviewData.availableFunds.toLocaleString()} บาท</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ p: 3, bgcolor: '#9c27b0', color: 'white', boxShadow: 3, borderRadius: 2 }}>
              <Typography variant="h6">สมาชิกทั้งหมด</Typography>
              <Typography variant="h4">{fundOverviewData.totalMembers} คน</Typography>
            </Card>
          </Grid>

          <Grid item xs={12} lg={8}>
            <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                สถิติการกู้ยืมและชำระเงิน
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="เงินกู้" stroke="var(--primary-main)" />
                  <Line type="monotone" dataKey="การชำระ" stroke="var(--success)" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NotificationIcon color="primary" />
                  การแจ้งเตือน
                </Typography>
                <Chip label={`${alerts.length} ใหม่`} color="error" size="small" />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {alerts.map((alert) => (
                  <Alert
                    key={alert.id}
                    severity={alert.type as 'error' | 'warning' | 'info' | 'success'}
                    sx={{
                      '& .MuiAlert-message': { width: '100%' },
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <AlertTitle sx={{ fontWeight: 600 }}>{alert.title}</AlertTitle>
                        {alert.message}
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap', ml: 2 }}>
                        {alert.timestamp}
                      </Typography>
                    </Box>
                  </Alert>
                ))}
              </Box>
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
                {recentTransactions.map((transaction) => (
                  <ListItem
                    key={transaction.id}
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      p: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                    <Avatar sx={{
  bgcolor: transaction.type === 'ฝากเงิน'
    ? 'success.light'
    : transaction.type === 'ถอนเงิน'
      ? 'error.light'
      : 'info.light'
}}>
  {React.createElement(getTransactionIcon(transaction.type), {
    sx: { color: 'inherit' }
  })}
</Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {transaction.type}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: transaction.type === 'ฝากเงิน'
                                ? 'success.main'
                                : transaction.type === 'ถอนเงิน'
                                  ? 'error.main'
                                  : 'info.main'
                            }}
                          >
                            {transaction.type === 'ถอนเงิน' ? '-' : '+'}{transaction.amount.toLocaleString()} บาท
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {transaction.member}
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TimeIcon fontSize="small" />
                            {transaction.time} น.
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
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                  <CalendarIcon color="primary" />
                  กำหนดชำระเงินที่ใกล้ถึง
                </Typography>
                <Button endIcon={<ArrowRightIcon />} size="small">
                  ดูทั้งหมด
                </Button>
              </Box>
              <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {upcomingPayments.map((payment) => (
                  <ListItem
                    key={payment.id}
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      p: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        <CalendarIcon />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {payment.member}
                          </Typography>
                          <Chip
                            label={payment.status}
                            color={getStatusColor(payment.status) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
                            size="small"
                          />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            กำหนดชำระ: {payment.dueDate}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {payment.amount.toLocaleString()} บาท
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TimeIcon fontSize="small" />
                            อีก {payment.daysLeft} วัน
                          </Typography>
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
