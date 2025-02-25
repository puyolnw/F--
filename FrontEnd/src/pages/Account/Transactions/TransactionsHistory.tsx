import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Button,
} from '@mui/material';
import axios from 'axios';

interface Transaction {
  transaction_id: number;
  account_number: string;
  transaction_date: string;
  transaction_time: string;
  by_user: string;
  deposit: number;
  withdrawal: number;
  t_balance: number;
}

// ฟังก์ชันสำหรับจัดรูปแบบวันที่
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const TransactionsHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:3301/api/transactions');
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleViewDetails = (transactionId: number) => {
    // ฟังก์ชันสำหรับดูรายละเอียด
    alert(`ดูรายละเอียดของ Transaction ID: ${transactionId}`);
  };

  const handleEditTransaction = (transactionId: number) => {
    // ฟังก์ชันสำหรับแก้ไข
    alert(`แก้ไข Transaction ID: ${transactionId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'var(--secondary-dark)' }}>
        ประวัติธุรกรรม
      </Typography>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{
            backgroundColor: 'var(--table-background)',
            border: '1px solid var(--border-light)',
            borderRadius: 4,
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: 'var(--table-header)' }}>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: 'var(--table-header-text)' }}>
                  เลขไอดี
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: 'var(--table-header-text)' }}>
                  เลขบัญชี
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: 'var(--table-header-text)' }}>
                  วันที่
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: 'var(--table-header-text)' }}>
                  เวลา
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: 'var(--table-header-text)' }}>
                  ผู้ทำรายการ
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: 'var(--table-header-text)' }}>
                  รายการ
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: 'var(--table-header-text)' }}>
                  ยอดเงิน
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: 'var(--table-header-text)' }}>
                  คงเหลือ
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: 'var(--table-header-text)' }}>
                  จัดการ
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow
                  key={transaction.transaction_id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? 'var(--table-row-odd)' : 'var(--table-background)',
                    '&:hover': { backgroundColor: 'var(--table-row-hover)' },
                  }}
                >
                  <TableCell align="center">{transaction.transaction_id}</TableCell>
                  <TableCell align="center">{transaction.account_number}</TableCell>
                  <TableCell align="center">{formatDate(transaction.transaction_date)}</TableCell>
                  <TableCell align="center">{transaction.transaction_time}</TableCell>
                  <TableCell align="center">{transaction.by_user}</TableCell>
                  <TableCell align="center" sx={{ color: transaction.deposit > 0 ? 'var(--success)' : 'var(--error)' }}>
                    {transaction.deposit > 0 ? 'ฝาก' : 'ถอน'}
                  </TableCell>
                  <TableCell align="center">
                    {transaction.deposit > 0 ? transaction.deposit : transaction.withdrawal}
                  </TableCell>
                  <TableCell align="center">{transaction.t_balance}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        onClick={() => handleViewDetails(transaction.transaction_id)}
                      >
                        ดูรายละเอียด
                      </Button>
                      <Button
                        variant="outlined"
                        color="warning"
                        size="small"
                        onClick={() => handleEditTransaction(transaction.transaction_id)}
                      >
                        แก้ไข
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default TransactionsHistory;