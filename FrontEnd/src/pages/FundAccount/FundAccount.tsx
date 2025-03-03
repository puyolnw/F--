import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Divider
} from '@mui/material';
import { AccountBalance, ArrowForward, TrendingUp, TrendingDown } from '@mui/icons-material';

interface FundAccount {
  fund_account_id: number;
  fund_account_name: string;
  fund_account_number: string;
  fund_account_balance: number;
  fund_account_status: string;
}

const FundAccount: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<FundAccount[]>([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('http://localhost:3301/api/fundaccount');
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: 2, 
        bgcolor: 'primary.main', 
        color: 'white' 
      }}>
        <Typography variant="h4" sx={{ 
          display: 'flex', 
          alignItems: 'center',
          fontWeight: 'bold' 
        }}>
          <AccountBalance sx={{ mr: 2, fontSize: 40 }} />
          ระบบบัญชีกองทุนหมู่บ้าน
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {accounts.map((account) => (
          <Grid item xs={12} md={4} key={account.fund_account_id}>
            <Card 
              elevation={3}
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                },
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/${account.fund_account_id === 1 ? 'MainFundAccount' : 
                                     account.fund_account_id === 2 ? 'SajjaFundAccount' : 
                                     'LoanFundAccount'}`)}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  {account.fund_account_name}
                </Typography>
                
                <Chip
                  label={account.fund_account_status}
                  color={account.fund_account_status === 'ปกติ' ? 'success' : 'error'}
                  size="small"
                  sx={{ mb: 2 }}
                />

                <Typography variant="h4" color="primary.main" sx={{ mb: 2 }}>
                  {formatCurrency(account.fund_account_balance)}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography color="text.secondary" gutterBottom>
                  เลขที่บัญชี: {account.fund_account_number}
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mt: 2
                }}>
                  <Button 
                    endIcon={<ArrowForward />}
                    color="primary"
                  >
                    ดูรายละเอียด
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FundAccount;
