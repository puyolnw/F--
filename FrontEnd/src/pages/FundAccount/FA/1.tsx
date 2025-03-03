import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  AccountBalance,
  CalendarToday,
  Person
} from '@mui/icons-material';

interface FundAccount {
  fund_account_id: number;
  fund_account_name: string;
  fund_account_number: string;
  fund_account_balance: number;
  fund_account_open_date: string;
  fund_account_created_by: string;
  fund_account_status: string;
}

const MainFundAccount: React.FC = () => {
  const [account, setAccount] = useState<FundAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMainFundAccount = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3301/api/fundaccount/1');
        const data = await response.json();
        setAccount(data);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลได้');
      } finally {
        setLoading(false);
      }
    };

    fetchMainFundAccount();
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

  if (error || !account) {
    return <Alert severity="error">{error || 'ไม่พบข้อมูลบัญชี'}</Alert>;
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
                ยอดเงินคงเหลือ
              </Typography>
              <Typography variant="h3" color="primary" sx={{ mb: 2 }} fontWeight="bold">
                {formatCurrency(account.fund_account_balance)}
              </Typography>
              <Chip
                label={account.fund_account_status}
                color={account.fund_account_status === 'ปกติ' ? 'success' : 'error'}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ข้อมูลบัญชี
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography>
                        วันที่เปิดบัญชี: {new Date(account.fund_account_open_date).toLocaleDateString('th-TH')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography>
                        ผู้สร้างบัญชี: {account.fund_account_created_by}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MainFundAccount;
