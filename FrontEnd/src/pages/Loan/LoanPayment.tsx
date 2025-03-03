import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  InputAdornment,
  Typography,
  Autocomplete,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search,
  AccountBalance,
  Payment,
  CheckCircle,
  CloudUpload
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

interface LoanContract {
  id: number;
  first_name: string;
  last_name: string;
  loan_amount: number;
  remaining_balance: number;
  total_paid: number;
  installment_count: number;
  paid_installments: number;
}

interface UpcomingPayment {
  id: number;
  due_date: string;
  amount: number;
  status: string;
}

interface PaymentResult {
  success: boolean;
  message: string;
  amount: number;
  transactionTime: string;
  imageUrl?: string;
}

const LoanPayment = () => {
  const [loanContracts, setLoanContracts] = useState<LoanContract[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<LoanContract | null>(null);
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>([]);
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [searchName, setSearchName] = useState('');
  const [searchIdCard, setSearchIdCard] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [showResults, setShowResults] = useState(false);


  useEffect(() => {
    fetchLoanContracts();
  }, []);

  const fetchLoanContracts = async () => {
    try {
      const response = await fetch('http://localhost:3301/api/loan');
      const data = await response.json();
      // Filter out loans with zero remaining balance
      const activeLoans = data.filter((loan: LoanContract) => loan.remaining_balance > 0);
      setLoanContracts(activeLoans);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  const fetchUpcomingPayments = async (loanId: number) => {
    try {
      const response = await fetch(`http://localhost:3301/api/loan/${loanId}/upcoming-payments`);
      const data = await response.json();
      setUpcomingPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleLoanSelect = async (loan: LoanContract | null) => {
    setSelectedLoan(loan);
    if (loan) {
      await fetchUpcomingPayments(loan.id);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handlePayment = async () => {
    if (!selectedLoan || !amount || !paymentDate) return;
    const paymentAmount = parseFloat(amount);
    if (paymentAmount > selectedLoan.remaining_balance) {
      setError(`ไม่สามารถชำระเงินเกินยอดคงเหลือ ${formatCurrency(selectedLoan.remaining_balance)}`);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3301/api/loan/repayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          loan_contract_id: selectedLoan.id,
          amount_paid: parseFloat(amount),
          payment_date: paymentDate.format('YYYY-MM-DD'),
          payment_method: 'cash',
          payment_schedule_id: upcomingPayments[0]?.id
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setPaymentResult({
          success: true,
          message: 'ชำระเงินสำเร็จ',
          amount: parseFloat(amount),
          transactionTime: new Date().toISOString()
        });
        
        setAmount('');
        await fetchLoanContracts();
        if (selectedLoan) {
          await fetchUpcomingPayments(selectedLoan.id);
        }
      } else {
        setError(data.error || 'เกิดข้อผิดพลาดในการชำระเงิน');
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card elevation={3} sx={{ borderRadius: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
                  <Payment sx={{ mr: 1 }} />
                  ชำระเงินกู้
                </Typography>

                <Autocomplete
  options={loanContracts}
  getOptionLabel={(option) => 
    `${option.first_name} ${option.last_name} - ${formatCurrency(option.remaining_balance)} (งวด ${option.paid_installments}/${option.installment_count})`
  }
  onChange={(_, value) => handleLoanSelect(value)}
  filterOptions={(options, { inputValue }) => {
    // Only show options if input is at least 3 characters
    return inputValue.length >= 3 
      ? options.filter(option => 
          `${option.first_name} ${option.last_name}`.toLowerCase()
          .includes(inputValue.toLowerCase()))
      : [];
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="ค้นหาสัญญากู้ (พิมพ์อย่างน้อย 3 ตัวอักษร)"
      variant="outlined"
      fullWidth
    />
  )}
  sx={{ mb: 3 }}
/>

<TextField
  fullWidth
  label="จำนวนเงิน"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  onBlur={() => {
    if (selectedLoan && parseFloat(amount) > selectedLoan.remaining_balance) {
      setError(`ยอดชำระสูงสุดคือ ${formatCurrency(selectedLoan.remaining_balance)}`);
      setAmount(selectedLoan.remaining_balance.toString());
    }
  }}
  type="number"
  disabled={!selectedLoan}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <Payment />
      </InputAdornment>
    ),
    endAdornment: <InputAdornment position="end">บาท</InputAdornment>
  }}
  helperText={selectedLoan ? `ยอดชำระสูงสุด: ${formatCurrency(selectedLoan.remaining_balance)}` : 'กรุณาเลือกสัญญาก่อน'}
  sx={{ mb: 3 }}
/>

                <DatePicker
                  label="วันที่ชำระเงิน"
                  value={paymentDate}
                  onChange={(newValue) => setPaymentDate(newValue)}
                  sx={{ mb: 3, width: '100%' }}
                />

                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{ mb: 3, width: '100%' }}
                >
                  อัปโหลดสลิป
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
                {selectedImage && (
                  <Typography variant="body2" sx={{ mb: 3 }}>
                    ไฟล์ที่เลือก: {selectedImage.name}
                  </Typography>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handlePayment}
                  disabled={!selectedLoan || !amount || loading}
                  sx={{ height: 56 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'ชำระเงิน'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {selectedLoan && (
  <Grid item xs={12} md={4}>
    <Card sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        ข้อมูลการชำระ
      </Typography>

      <Stack spacing={2}>
        <Box>
          <Typography color="text.secondary">ยอดที่ต้องชำระทั้งหมด</Typography>
          <Typography variant="h5" color="primary">
            {formatCurrency(selectedLoan.remaining_balance)}
          </Typography>
          <Typography color="text.secondary">
            งวดปัจจุบัน: {selectedLoan.paid_installments + 1}/{selectedLoan.installment_count}
          </Typography>
        </Box>

        {upcomingPayments.map((payment, index) => (
          <Box key={payment.id}>
            <Typography color="text.secondary">
              งวดที่ {selectedLoan.paid_installments + index + 1} - {formatDate(payment.due_date)}
            </Typography>
            <Typography variant="h6">
              {formatCurrency(payment.amount)}
            </Typography>
            <Chip
              label={
                payment.status === 'paid' ? 'ชำระแล้ว' : 
                new Date(payment.due_date) < new Date() ? 'เกินกำหนด' : 
                'รอชำระ'
              }
              color={
                payment.status === 'paid' ? 'success' : 
                new Date(payment.due_date) < new Date() ? 'error' : 
                'warning'
              }
              size="small"
            />
          </Box>
        ))}
      </Stack>
    </Card>
  </Grid>
)}
        </Grid>

        <Dialog open={!!paymentResult} onClose={() => setPaymentResult(null)}>
          <DialogTitle>
            <Box sx={{ textAlign: 'center' }}>
              <CheckCircle color="success" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h5">ชำระเงินสำเร็จ</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <Typography variant="h4" align="center" color="primary">
                {paymentResult?.amount && formatCurrency(paymentResult.amount)}
              </Typography>
              <Typography align="center">
                เวลาทำรายการ: {paymentResult?.transactionTime && 
                  new Date(paymentResult.transactionTime).toLocaleString('th-TH')}
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPaymentResult(null)} variant="contained">
              ตกลง
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default LoanPayment;
