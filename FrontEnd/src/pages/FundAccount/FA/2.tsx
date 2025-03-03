import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Chip,
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
  Pagination
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';

interface Account {
  account_id: number;
  account_name: string;
  account_number: string;
  balance: string;
}

interface Transaction {
  transaction_id: string;
  account_number: string;
  transaction_date: string;
  transaction_time: string;
  by_user: string;
  deposit: number;
  withdrawal: number;
  t_balance: number;
}

const SajjaFundAccount: React.FC = () => {
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const transactionsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all accounts to calculate total balance
        const accountsResponse = await fetch('http://localhost:3301/api/accounts');
        const accountsData = await accountsResponse.json();
        const total = accountsData.reduce((sum: number, account: Account) => 
          sum + parseFloat(account.balance), 0);
        setTotalBalance(total);

        // Fetch all transactions
        const transactionsResponse = await fetch('http://localhost:3301/api/transactions');
        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData.sort((a: Transaction, b: Transaction) => 
          new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()
        ));
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลได้');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  // Pagination calculation
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const currentTransactions = transactions.slice(
    (page - 1) * transactionsPerPage,
    page * transactionsPerPage
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <AccountBalance sx={{ fontSize: 40 }} />
            </Grid>
            <Grid item>
              <Typography variant="h4" fontWeight="bold">
                กองทุนสัจจะ
              </Typography>
              <Typography variant="subtitle1">
                ยอดรวมทั้งหมดจากทุกบัญชี
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ p: 3 }}>
          <Card elevation={0} sx={{ bgcolor: 'success.light', mb: 4 }}>
            <CardContent>
              <Typography color="success.dark" gutterBottom>
                ยอดเงินรวมทั้งหมด
              </Typography>
              <Typography variant="h3" color="success.dark" fontWeight="bold">
                {formatCurrency(totalBalance)}
              </Typography>
            </CardContent>
          </Card>

          <Typography variant="h6" gutterBottom>
            ประวัติการทำรายการล่าสุด
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>วันที่</TableCell>
                  <TableCell>เวลา</TableCell>
                  <TableCell>เลขที่บัญชี</TableCell>
                  <TableCell>รายการ</TableCell>
                  <TableCell align="right">จำนวนเงิน</TableCell>
                  <TableCell align="right">ยอดคงเหลือ</TableCell>
                  <TableCell>ผู้ทำรายการ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentTransactions.map((transaction) => (
                  <TableRow key={transaction.transaction_id}
                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <TableCell>{formatDate(transaction.transaction_date)}</TableCell>
                    <TableCell>{transaction.transaction_time}</TableCell>
                    <TableCell>{transaction.account_number}</TableCell>
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

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Pagination 
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SajjaFundAccount;
