import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  AccountBalance,
  Person,
  CalendarToday,
  TrendingUp,
  TrendingDown,
  Payment,
} from '@mui/icons-material';

interface Account {
  account_id: number;
  account_name: string;
  account_number: string;
  balance: string;
  open_date: string;
  created_by: string;
  account_status: string;
}

interface Transaction {
    transaction_id: string;
    account_number: string;
    transaction_date: string;
    transaction_time: string;
    by_user: string;
    channel: string;
    deposit: number;
    withdrawal: number;
    t_balance: number;
    balance: number;
  }

const AccountDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number | string) => {
    return Number(amount).toLocaleString('th-TH', {
      style: 'currency',
      currency: 'THB'
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setLoading(true);
        // เรียกข้อมูลบัญชีก่อน
        const accountResponse = await axios.get(`http://localhost:3301/api/accounts/${id}`);
        setAccount(accountResponse.data);
        
        // เมื่อได้ข้อมูลบัญชีแล้วค่อยเรียกประวัติการทำรายการ
        if (accountResponse.data) {
          const transactionsResponse = await axios.get(
            `http://localhost:3301/api/transactions/accounts/${accountResponse.data.account_number}/transactions`
          );
          setTransactions(transactionsResponse.data);
        }
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลได้');
      } finally {
        setLoading(false);
      }
    };
  
    fetchAccountData();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !account) {
    return <Alert severity="error">{error || 'ไม่พบข้อมูลบัญชี'}</Alert>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Account Overview Card */}
      <Paper elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <AccountBalance sx={{ fontSize: 40 }} />
            </Grid>
            <Grid item>
              <Typography variant="h5" fontWeight="bold">
                {account.account_number}
              </Typography>
              <Typography variant="subtitle1">
                {account.account_name}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={{ bgcolor: 'success.light', height: '100%' }}>
                <CardContent>
                  <Typography color="success.dark" gutterBottom>
                    ยอดเงินคงเหลือ
                  </Typography>
                  <Typography variant="h4" component="div" color="success.dark" fontWeight="bold">
                    {formatCurrency(account.balance)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      วันที่เปิดบัญชี
                    </Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday fontSize="small" />
                      {formatDate(account.open_date)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      สถานะบัญชี
                    </Typography>
                    <Chip
                      label={account.account_status}
                      color={account.account_status === 'ปกติ' ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Transaction History */}
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            ประวัติการทำรายการ
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>วันที่</TableCell>
                  <TableCell>เวลา</TableCell>
                  <TableCell>รายการ</TableCell>
                  <TableCell align="right">จำนวนเงิน</TableCell>
                  <TableCell align="right">ยอดคงเหลือ</TableCell>
                  <TableCell>ผู้ทำรายการ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.transaction_id}
                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <TableCell>{formatDate(transaction.transaction_date)}</TableCell>
                    <TableCell>{transaction.transaction_time}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {transaction.deposit > 0 ? (
                          <TrendingUp color="success" />
                        ) : (
                          <TrendingDown color="error" />
                        )}
                        {transaction.deposit > 0 ? 'ฝากเงิน' : 'ถอนเงิน'}
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{
  color: transaction.deposit > 0 ? 'success.main' : 'error.main',
  fontWeight: 'bold'
}}>
  {transaction.deposit > 0 
    ? `+ ${formatCurrency(transaction.deposit)}`
    : `- ${formatCurrency(transaction.withdrawal)}`
  }
</TableCell>
                    <TableCell align="right">
                      {formatCurrency(transaction.t_balance)}
                    </TableCell>
                    <TableCell>{transaction.by_user}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Container>
  );
};

export default AccountDetail;
