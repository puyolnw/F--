import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Typography,
  Container,
  Box,
  Grid,
  CircularProgress,
  Chip,
  Pagination,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  ArrowBack,
  AccountBalance,
  Person,
  CalendarToday,
  AdminPanelSettings,
  AccountBalanceWallet
} from '@mui/icons-material';

// Define interfaces
interface Account {
  account_id: number;
  account_name: string;
  account_number: string;
  balance: string;
  open_date: string;
  created_by: string;
  account_status: string;
}

interface LocationState {
  results: Account[];
}

interface StatusColor {
  bg: string;
  color: string;
}

// Utility functions
const getStatusColor = (status: string): StatusColor => {
  switch (status) {
    case 'ปกติ':
      return {
        bg: 'var(--success)',
        color: 'var(--text-primary)'
      };
    case 'ถูกอายัด':
      return {
        bg: 'var(--warning)',
        color: 'var(--text-primary)'
      };
    case 'ปิดการใช้งาน':
      return {
        bg: 'var(--error)',
        color: 'var(--text-primary)'
      };
    default:
      return {
        bg: 'var(--neutral-main)',
        color: 'var(--text-primary)'
      };
  }
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatBalance = (balance: string): string => {
  const numBalance = parseFloat(balance);
  return isNaN(numBalance) ? '0.00 ฿' : numBalance.toLocaleString('th-TH', {
    style: 'currency',
    currency: 'THB'
  });
};

const SearchResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const searchResults = (location.state as LocationState)?.results || [];
  
  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = searchResults.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (account: Account) => {
    navigate('/account-details', {
      state: { accountInfo: account }
    });
  };

  // Type validation
  const isValidAccount = (account: unknown): account is Account => {
    if (!account || typeof account !== 'object') {
      return false;
    }
    const requiredProperties: (keyof Account)[] = [
      'account_id',
      'account_name',
      'account_number',
      'balance',
      'open_date',
      'created_by',
      'account_status'
    ];
    return requiredProperties.every(prop => {
      const value = (account as Record<string, unknown>)[prop];
      return typeof value === 'string' || typeof value === 'number';
    });
  };

  React.useEffect(() => {
    setIsLoading(true);
    if (!location.state || !Array.isArray((location.state as LocationState)?.results)) {
      navigate('/search');
      return;
    }
    const invalidResults = (location.state as LocationState).results.some(
      (result: unknown) => !isValidAccount(result)
    );
    if (invalidResults) {
      navigate('/search');
    }
    setIsLoading(false);
  }, [location.state, navigate]);

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

        }}
      >
        <CircularProgress sx={{ color: 'var(--secondary-main)' }} />
      </Box>
    );
  }

  // ... Rest of the component remains the same ...

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: 3
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 4,
            backgroundColor: 'var(--primary-light)',
            padding: 2,
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/search')}
            variant="outlined"
            sx={{
              mr: 2,
              color: 'var(--secondary-main)',
              borderColor: 'var(--secondary-main)',
              '&:hover': {
                borderColor: 'var(--secondary-dark)',
                backgroundColor: 'var(--hover-light)'
              }
            }}
          >
            กลับ
          </Button>
          <Typography 
            variant="h5" 
            sx={{ 
              flexGrow: 1,
              color: 'var(--secondary-dark)',
              fontFamily: 'var(--font-primary)'
            }}
          >
            ผลการค้นหา
          </Typography>
          <Typography 
            variant="subtitle1"
            sx={{ 
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-primary)'
            }}
          >
            พบ {searchResults.length} รายการ
          </Typography>
        </Box>
  
        {searchResults.length === 0 ? (
          <Box 
            sx={{ 
              textAlign: 'center',
              py: 8,
              backgroundColor: 'var(--primary-light)',
              borderRadius: 2
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-primary)'
              }}
            >
              ไม่พบบัญชีที่ตรงกับการค้นหา
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {currentItems.map((account: Account) => (
                <Grid item xs={12} sm={6} md={4} key={account.account_id}>
                  <Card 
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: 'var(--primary-light)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      {/* Account Status Badge */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Chip
                          label={account.account_status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(account.account_status).bg,
                            color: getStatusColor(account.account_status).color,
                            fontFamily: 'var(--font-primary)'
                          }}
                        />
                      </Box>
  
                      {/* Account Number */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 3,
                        borderBottom: '2px solid var(--secondary-light)',
                        pb: 2
                      }}>
                        <AccountBalance sx={{ 
                          color: 'var(--secondary-main)',
                          fontSize: '2rem',
                          mr: 1 
                        }} />
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: 'var(--secondary-main)',
                            fontFamily: 'var(--font-primary)',
                            fontWeight: 'bold'
                          }}
                        >
                          {account.account_number}
                        </Typography>
                      </Box>
  
                      {/* Account Details */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Person sx={{ color: 'var(--secondary-main)', mr: 1 }} />
                          <Typography sx={{ fontFamily: 'var(--font-primary)' }}>
                            {account.account_name}
                          </Typography>
                        </Box>
  
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarToday sx={{ color: 'var(--secondary-main)', mr: 1 }} />
                          <Typography 
                            variant="body2"
                            sx={{ 
                              color: 'var(--text-secondary)',
                              fontFamily: 'var(--font-primary)'
                            }}
                          >
                            {formatDate(account.open_date)}
                          </Typography>
                        </Box>
  
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AdminPanelSettings sx={{ color: 'var(--secondary-main)', mr: 1 }} />
                          <Typography 
                            variant="body2"
                            sx={{ 
                              color: 'var(--text-secondary)',
                              fontFamily: 'var(--font-primary)'
                            }}
                          >
                            {account.created_by}
                          </Typography>
                        </Box>
                      </Box>
  
                      {/* Balance */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 2,
                        borderRadius: 1,
                        mb: 2
                      }}>
                        <AccountBalanceWallet sx={{ 
                          color: 'var(--secondary-main)',
                          mr: 1
                        }} />
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: 'var(--secondary-dark)',
                            fontFamily: 'var(--font-primary)',
                            fontWeight: 'bold'
                          }}
                        >
                          {formatBalance(account.balance)}
                        </Typography>
                      </Box>
                    </CardContent>
  
                    <CardActions sx={{ justifyContent: 'center', p: 2 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleViewDetails(account)}
                        sx={{
                          backgroundColor: 'var(--secondary-main)',
                          color: 'var(--text-primary)',
                          '&:hover': {
                            backgroundColor: 'var(--secondary-dark)'
                          },
                          fontFamily: 'var(--font-primary)'
                        }}
                      >
                        ดูรายละเอียด
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
  
            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                mt: 4,
                pb: 3
              }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontFamily: 'var(--font-primary)',
                      color: 'var(--secondary-main)',
                      '&.Mui-selected': {
                        backgroundColor: 'var(--secondary-main)',
                        color: 'var(--text-primary)',
                        '&:hover': {
                          backgroundColor: 'var(--secondary-dark)'
                        }
                      }
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default SearchResults;