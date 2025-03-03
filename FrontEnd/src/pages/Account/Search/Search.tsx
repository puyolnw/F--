import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface Account {
  account_id: number;
  account_name: string;
  account_number: string;
  balance: string;
  open_date: string;
  created_by: string;
  account_status: string;
}

const SearchAccount: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await axios.get<{success: boolean; results: Account[]}>(
        `http://localhost:3301/api/accounts/search?term=${encodeURIComponent(query.trim())}`
      );
  
      if (response.data && Array.isArray(response.data.results)) {
        const accounts = response.data.results;
        if (accounts.length === 0) {
          setError('ไม่พบบัญชีที่ตรงกับการค้นหา');
        } else {
          navigate('/searchresults', {
            state: { results: accounts }
          });
        }
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('เกิดข้อผิดพลาดในการค้นหา กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  }, [query, navigate]);
  
  const handleOpenNewAccount = useCallback(() => {
    navigate('/members/addmember');
  }, [navigate]);

  return (
    <Container
      maxWidth={false}
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 2,
      }}
    >
      <Paper
        sx={{
          height: 'auto',
          minHeight: '80vh',
          width: '90%',
          maxWidth: '1200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--primary-light)',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          position: 'relative',
          padding: { xs: 2, sm: 4 },
          marginTop: 1,
          border: '1px solid var(--border-light)'
        }}
      >
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
            color: 'var(--secondary-main)',
            fontFamily: 'var(--font-primary)'
          }}
        >
          ค้นหาบัญชี
        </Typography>

        <TextField
          fullWidth
          label="ค้นหาด้วยชื่อหรือเลขบัญชี"
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          disabled={isLoading}
          sx={{
            mb: 3,
            maxWidth: '60%',
            width: '60%',
            '& .MuiOutlinedInput-root': {
              fontFamily: 'var(--font-primary)',
              '& fieldset': { borderColor: 'var(--border-light)' },
              '&:hover fieldset': { borderColor: 'var(--secondary-main)' },
              '&.Mui-focused fieldset': { borderColor: 'var(--accent-blue)' },
            },
            '& .MuiInputLabel-root': {
              fontFamily: 'var(--font-primary)',
            }
          }}
          InputProps={{
            style: { 
              fontSize: '1.2rem',
              color: 'var(--secondary-dark)',
              fontFamily: 'var(--font-primary)'
            }
          }}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
            disabled={isLoading}
            sx={{
              fontSize: '1.2rem',
              padding: '10px 30px',
              backgroundColor: 'var(--secondary-main)',
              fontFamily: 'var(--font-primary)',
              '&:hover': {
                backgroundColor: 'var(--secondary-dark)',
              },
            }}
          >
            {isLoading ? 'กำลังค้นหา...' : 'ค้นหา'}
          </Button>

          <Button
            variant="outlined"
            onClick={handleOpenNewAccount}
            disabled={isLoading}
            sx={{
              fontSize: '1.2rem',
              padding: '10px 30px',
              color: 'var(--secondary-main)',
              borderColor: 'var(--secondary-main)',
              fontFamily: 'var(--font-primary)',
              '&:hover': {
                backgroundColor: 'var(--hover-light)',
                borderColor: 'var(--secondary-dark)',
              },
            }}
          >
            เพิ่มบัญชีใหม่
          </Button>
        </Stack>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setError(null)} 
            severity="error" 
            elevation={6}
            variant="filled"
            sx={{ 
              width: '100%',
              fontFamily: 'var(--font-primary)'
            }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default SearchAccount;