import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ใช้ useNavigate สำหรับการเปลี่ยนเส้นทาง
import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ใช้ navigate เพื่อเปลี่ยนเส้นทาง

  // ตรวจสอบสถานะการเข้าสู่ระบบเมื่อโหลดหน้า
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // ถ้ามี token ให้ redirect ไปที่หน้า /
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      // ใช้ API URL จาก .env
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Login successful:', data);
      
        // บันทึก token และ user ลงใน localStorage
        localStorage.setItem('token', data.token); // เก็บ token
        localStorage.setItem('user', JSON.stringify(data.user)); // เก็บข้อมูลผู้ใช้
      
        // เปลี่ยนเส้นทางไปหน้า Dashboard
        navigate('/');
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)', // ใช้สีพื้นหลังจาก theme.css
        padding: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 3,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // เพิ่มเงาให้ดูเด่น
          backgroundColor: 'var(--primary-light)', // ใช้สีพื้นหลังของ Paper
        }}
      >
        {/* ชื่อเว็บไซต์ */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          textAlign="center"
          sx={{
            fontWeight: 'bold',
            color: 'var(--accent-blue)', // ใช้สีจาก theme.css
            marginBottom: 3,
          }}
        >
          กองทุนหมู่บ้าน
        </Typography>

        {/* แสดงข้อความ error */}
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        {/* แบบฟอร์มเข้าสู่ระบบ */}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: 'var(--font-primary)', // ใช้ฟอนต์จาก theme.css
              },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: 'var(--font-primary)', // ใช้ฟอนต์จาก theme.css
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading} // ปิดปุ่มขณะกำลังโหลด
            sx={{
              marginTop: 3,
              paddingY: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'bold',
              backgroundColor: 'var(--accent-blue)', // ใช้สีจาก theme.css
              '&:hover': {
                backgroundColor: 'var(--accent-green)', // ใช้สี hover จาก theme.css
              },
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;