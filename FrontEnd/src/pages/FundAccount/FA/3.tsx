import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  AccountBalance,
  Warning,
  Assessment,
  MonetizationOn
} from '@mui/icons-material';

interface FundAccount {
  fund_account_id: number;
  fund_account_name: string;
  fund_account_number: string;
  fund_account_balance: number;
  fund_account_status: string;
}

interface LoanReport {
  totalLoans: number;
  totalAmount: number;
  overdueLoans: number;
}

const LoanFundAccount: React.FC = () => {
  const [account, setAccount] = useState<FundAccount | null>(null);
  const [loanReport, setLoanReport] = useState<LoanReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch fund account data
        const accountResponse = await fetch('http://localhost:3301/api/fundaccount/4');
        const accountData = await accountResponse.json();
        setAccount(accountData);

        // Fetch loan report data
        const reportResponse = await fetch('http://localhost:3301/api/fundaccount/4/report');
        const reportData = await reportResponse.json();
        setLoanReport(reportData);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลได้');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !account || !loanReport) {
    return <Alert severity="error">{error || 'ไม่พบข้อมูล'}</Alert>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 2, 
        backgroundColor: 'primary.main',
        color: 'white' 
      }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <AccountBalance sx={{ fontSize: 40 }} />
          </Grid>
          <Grid item>
            <Typography variant="h4" fontWeight="bold">
              {account.fund_account_name}
            </Typography>
            <Typography variant="subtitle1">
              เลขที่บัญชี: {account.fund_account_number}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                ยอดเงินกองทุน
              </Typography>
              <Typography variant="h3" color="primary" fontWeight="bold">
                {formatCurrency(account.fund_account_balance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ 
            height: '100%', 
            borderRadius: 2,
            backgroundColor: loanReport.overdueLoans > 0 ? 'error.light' : 'success.light'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Warning color="error" sx={{ mr: 1 }} />
                <Typography variant="h6" color="error.main">
                  รายการค้างชำระ: {loanReport.overdueLoans} รายการ
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  จำนวนสัญญากู้ทั้งหมด
                </Typography>
              </Box>
              <Typography variant="h4" color="primary.main">
                {loanReport.totalLoans} รายการ
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MonetizationOn sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  ยอดเงินปล่อยกู้ทั้งหมด
                </Typography>
              </Box>
              <Typography variant="h4" color="primary.main">
                {formatCurrency(loanReport.totalAmount)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoanFundAccount;
