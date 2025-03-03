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
  Divider,
  CircularProgress,
  Stack
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import {
  Search,
  AccountBalance,
  AccountBalanceWallet,
  MoneyOff,
  Event,
  AttachMoney,
  SaveAlt,
  Payment,
  CloudUpload,
} from '@mui/icons-material';
import axios from 'axios'; // เพิ่ม axios สำหรับการเรียก API
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';



interface Account {
  account_number: string;
  account_name: string;
  balance: string;
  account_status: string;
}

import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



const TransactionForm: React.FC = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false); // สำหรับแจ้งเตือน
  const [transactionResult, setTransactionResult] = useState<{
    success: boolean;
    message: string;
    transactionType: 'deposit' | 'withdraw';
    amount: number;
    accountNumber: string;
    transactionTime: string;
  } | null>(null); // สำหรับเก็บผลลัพธ์การทำรายการ
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [transactionTime, setTransactionTime] = useState('');
  const [amount, setAmount] = useState('');
  const [slip, setSlip] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [amountError, setAmountError] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16);
    setTransactionTime(formattedDate);
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      // ตรวจสอบว่าผู้ใช้พิมพ์ข้อมูลอย่างน้อย 3 ตัวอักษรก่อนเรียก API
      if (inputValue.trim().length < 3) {
        setOptions([]); // ล้างผลลัพธ์ถ้ายังพิมพ์ไม่ถึง 3 ตัว
        return;
      }
  
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:3301/api/accounts/search', {
          params: { term: inputValue.trim() },
        });
  
        console.log("API Response:", response.data);
  
        if (response.data.success && Array.isArray(response.data.results)) {
          setOptions(response.data.results);
        } else {
          setOptions([]);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchAccounts();
  }, [inputValue]);
  
  <Autocomplete
  options={options} // ใช้ข้อมูลทั้งหมดที่ดึงมาจาก API
  getOptionLabel={(option: Account) =>
    `${option.account_number} - ${option.account_name}`
  }
  filterOptions={(options) => options} // ใช้ผลลัพธ์จาก API โดยตรง ไม่ต้องกรองเพิ่มเติม
  renderOption={(props, option) => (
    <li {...props}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountBalance sx={{ color: 'primary.main' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {option.account_number}
          </Typography>
        </Box>
        <Box sx={{ pl: 4 }}>
          <Typography variant="body2">{option.account_name}</Typography>
          <Typography variant="caption" color="text.secondary">
            สถานะบัญชี: {option.account_status}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'primary.main', fontWeight: 500, mt: 0.5 }}
          >
            ยอดเงินคงเหลือ: {formatBalance(option.balance)}
          </Typography>
        </Box>
      </Box>
    </li>
  )}
  renderInput={(params) => (
    <TextField
      {...params}
      label="ค้นหาด้วยเลขบัญชีหรือชื่อบัญชี (พิมพ์อย่างน้อย 3 ตัวอักษร)"
      variant="outlined"
      fullWidth
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <InputAdornment position="start">
            <Search color="action" />
          </InputAdornment>
        ),
        endAdornment: (
          <>
            {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
            {params.InputProps.endAdornment}
          </>
        ),
      }}
    />
  )}
  onChange={(event, newValue) => setSelectedAccount(newValue)}
  onInputChange={(event, newValue) => setInputValue(newValue)}
  loading={isLoading}
  noOptionsText={
    inputValue.length === 0
      ? "กรุณาพิมพ์เพื่อค้นหา"
      : inputValue.length < 3
        ? "กรุณาพิมพ์อย่างน้อย 3 ตัวอักษร"
        : "ไม่พบบัญชีที่ตรงกับการค้นหา"
  }
  sx={{ mb: 3 }}
/>
  const handleTransactionTypeChange = (type: 'deposit' | 'withdraw') => {
    setTransactionType(type);
    setAmount('');
    setAmountError('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSlip(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateAmount = (value: string) => {
    if (!value) {
      setAmountError('');
      return;
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setAmountError('กรุณากรอกตัวเลขที่ถูกต้อง');
      return;
    }
    if (numValue <= 0) {
      setAmountError('จำนวนเงินต้องมากกว่า 0');
      return;
    }
    setAmountError('');
  };

  const formatBalance = (balance: string) => {
    return Number(parseFloat(balance)).toLocaleString('th-TH', {
      style: 'currency',
      currency: 'THB',
    });
  };

  const handleTransactionSubmit = async () => {
    if (!selectedAccount || !amount) {
      return;
    }
  
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        alert('ไม่พบข้อมูลผู้ใช้งาน กรุณาเข้าสู่ระบบอีกครั้ง');
        return;
      }
  
      const user = JSON.parse(userString);
      const username = user.username;
  
      if (!username) {
        alert('ไม่พบข้อมูล username กรุณาเข้าสู่ระบบอีกครั้ง');
        return;
      }
  
      const payload = {
        account_number: selectedAccount.account_number,
        transaction_type: transactionType === 'deposit' ? 'deposit' : 'withdrawal',
        amount: parseFloat(amount),
        by_user: username,
        channel: 'web',
      };
  
      const response = await axios.post('http://localhost:3301/api/transactions', payload);
  
      if (response.status === 201) {
        setTransactionResult({
          success: true,
          message: 'ทำรายการสำเร็จ!',
          transactionType: transactionType,
          amount: parseFloat(amount),
          accountNumber: selectedAccount.account_number,
          transactionTime: new Date().toLocaleString(),
        });
        setOpenSnackbar(true); // แสดง Snackbar
        setAmount('');
        setSlip(null);
        setPreviewUrl(null);
        setSelectedAccount(null);
      } else {
        setTransactionResult({
          success: false,
          message: 'เกิดข้อผิดพลาดในการทำรายการ',
          transactionType: transactionType,
          amount: parseFloat(amount),
          accountNumber: selectedAccount.account_number,
          transactionTime: new Date().toLocaleString(),
        });
        setOpenSnackbar(true); // แสดง Snackbar
      }
    } catch (error: any) {
      console.error('Error during transaction:', error);
      setTransactionResult({
        success: false,
        message: error.response?.data?.message || 'เกิดข้อผิดพลาดในการทำรายการ',
        transactionType: transactionType,
        amount: parseFloat(amount),
        accountNumber: selectedAccount.account_number,
        transactionTime: new Date().toLocaleString(),
      });
      setOpenSnackbar(true); // แสดง Snackbar
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'var(--neutral-dark)' }}>
                ทำรายการ{transactionType === 'deposit' ? 'ฝาก' : 'ถอน'}เงิน
              </Typography>
              <Box sx={{ display: 'flex', mb: 4, borderRadius: 3, overflow: 'hidden' }}>
                <Button
                  onClick={() => handleTransactionTypeChange('deposit')}
                  sx={{
                    flex: 1,
                    py: 2,
                    bgcolor: transactionType === 'deposit' ? 'var(--success)' : 'var(--bg-secondary)',
                    color: transactionType === 'deposit' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    '&:hover': {
                      bgcolor: transactionType === 'deposit' ? '#218838' : 'var(--hover-light)',
                    },
                    fontSize: '1rem',
                    fontWeight: 600,
                    transition: 'all 0.3s',
                  }}
                >
                  <AccountBalanceWallet sx={{ mr: 1 }} />
                  ฝากเงิน
                </Button>
                <Button
                  onClick={() => handleTransactionTypeChange('withdraw')}
                  sx={{
                    flex: 1,
                    py: 2,
                    bgcolor: transactionType === 'withdraw' ? 'var(--error)' : 'var(--bg-secondary)',
                    color: transactionType === 'withdraw' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    '&:hover': {
                      bgcolor: transactionType === 'withdraw' ? '#c82333' : 'var(--hover-light)',
                    },
                    fontSize: '1rem',
                    fontWeight: 600,
                    transition: 'all 0.3s',
                  }}
                >
                  <MoneyOff sx={{ mr: 1 }} />
                  ถอนเงิน
                </Button>
              </Box>
              <Autocomplete
  options={options} // ใช้ข้อมูลทั้งหมดที่ดึงมาจาก API
  getOptionLabel={(option: Account) =>
    `${option.account_number} - ${option.account_name}`
  }
  filterOptions={(options) => options} // ใช้ผลลัพธ์จาก API โดยตรง ไม่ต้องกรองเพิ่มเติม
  renderOption={(props, option) => {
    const { key, ...rest } = props; // แยก key ออกจาก props
    return (
      <li key={key} {...rest}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountBalance sx={{ color: 'primary.main' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              {option.account_number}
            </Typography>
          </Box>
          <Box sx={{ pl: 4 }}>
            <Typography variant="body2">{option.account_name}</Typography>
            <Typography variant="caption" color="text.secondary">
              สถานะบัญชี: {option.account_status}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'primary.main', fontWeight: 500, mt: 0.5 }}
            >
              ยอดเงินคงเหลือ: {formatBalance(option.balance)}
            </Typography>
          </Box>
        </Box>
      </li>
    );
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="ค้นหาด้วยเลขบัญชีหรือชื่อบัญชี (พิมพ์อย่างน้อย 3 ตัวอักษร)"
      variant="outlined"
      fullWidth
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <InputAdornment position="start">
            <Search color="action" />
          </InputAdornment>
        ),
        endAdornment: (
          <>
            {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
            {params.InputProps.endAdornment}
          </>
        ),
      }}
    />
  )}
  onChange={(event, newValue) => setSelectedAccount(newValue)}
  onInputChange={(event, newValue) => setInputValue(newValue)}
  loading={isLoading}
  noOptionsText={
    inputValue.trim().length === 0
      ? "กรุณาพิมพ์เพื่อค้นหา"
      : inputValue.trim().length < 3
        ? "กรุณาพิมพ์อย่างน้อย 3 ตัวอักษร"
        : "ไม่พบบัญชีที่ตรงกับการค้นหา"
  }
  sx={{ mb: 3 }}
/>
              <TextField
                fullWidth
                label="วันและเวลาทำรายการ"
                type="datetime-local"
                variant="outlined"
                value={transactionTime}
                required
                InputProps={{
                  sx: { bgcolor: 'var(--bg-secondary)', borderRadius: 2 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Event color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                label="จำนวนเงิน"
                variant="outlined"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d*$/.test(value)) {
                    setAmount(value);
                    validateAmount(value);
                  }
                }}
                error={!!amountError}
                helperText={amountError}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney color={amountError ? 'error' : 'action'} />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">บาท</InputAdornment>,
                  sx: { bgcolor: 'var(--bg-secondary)', borderRadius: 2 },
                }}
                sx={{ mb: 3 }}
              />
              {transactionType === 'deposit' && (
                <Box sx={{ mt: 3, mb: 3 }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="slip-upload"
                    type="file"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="slip-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                      fullWidth
                      sx={{
                        height: 56,
                        bgcolor: 'var(--bg-secondary)',
                        borderStyle: 'dashed',
                        borderColor: 'var(--secondary-main)',
                        color: 'var(--secondary-main)',
                        borderRadius: 2,
                        '&:hover': {
                          bgcolor: 'var(--hover-light)',
                        },
                      }}
                    >
                      อัปโหลดสลิปฝากเงิน
                    </Button>
                  </label>
                  {previewUrl && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <img
                        src={previewUrl}
                        alt="สลิปฝากเงิน"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-light)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                      />
                    </Box>
                  )}
                </Box>
              )}
              <Button
                type="button"
                onClick={handleTransactionSubmit}
                variant="contained"
                color={transactionType === 'deposit' ? 'success' : 'error'}
                fullWidth
                size="large"
                disabled={!!amountError || !selectedAccount || !amount}
                startIcon={transactionType === 'deposit' ? <SaveAlt /> : <Payment />}
                sx={{
                  mt: 2,
                  height: 56,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                  '&:hover': {
                    boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                  },
                }}
              >
                {transactionType === 'deposit' ? 'ยืนยันการฝากเงิน' : 'ยืนยันการถอนเงิน'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
        {selectedAccount && (
          <Card
            elevation={3}
            sx={{
              borderRadius: 4,
              position: 'sticky',
              top: 24,
              p: 3,
              backgroundColor: 'var(--bg-secondary)',
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontWeight: 600,
                  mb: 2,
                  color: 'primary.main',
                }}
              >
                <AccountBalance />
                ข้อมูลบัญชี
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography color="text.secondary" variant="body2">
                  เลขที่บัญชี
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {selectedAccount.account_number}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography color="text.secondary" variant="body2">
                  ชื่อบัญชี
                </Typography>
                <Typography variant="body1">{selectedAccount.account_name}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography color="text.secondary" variant="body2">
                  ยอดเงินคงเหลือ
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {formatBalance(selectedAccount.balance)}
                </Typography>
              </Box>

              <Box>
                <Typography color="text.secondary" variant="body2">
                  สถานะบัญชี
                </Typography>
                <Chip
                  label={selectedAccount.account_status}
                  size="small"
                  sx={{
                    bgcolor:
                      selectedAccount.account_status === 'ปกติ'
                        ? 'success.light'
                        : 'error.light',
                    color:
                      selectedAccount.account_status === 'ปกติ'
                        ? 'success.dark'
                        : 'error.dark',
                    fontWeight: 500,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
    <Snackbar
open={openSnackbar}
autoHideDuration={6000}
onClose={() => setOpenSnackbar(false)}
anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
<Alert
  onClose={() => setOpenSnackbar(false)}
  severity={transactionResult?.success ? 'success' : 'error'}
  sx={{ width: '100%' }}
>
  {transactionResult?.message}
</Alert>
</Snackbar>

<Dialog 
open={!!transactionResult} 
onClose={() => setTransactionResult(null)} 
maxWidth="sm" 
fullWidth
PaperProps={{
  sx: {
    borderRadius: 2,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    p: 2
  }
}}
>
<DialogTitle sx={{ 
  textAlign: 'center', 
  borderBottom: '2px dashed #e0e0e0',
  pb: 2
}}>
  <Box sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    mb: 2
  }}>
    {transactionResult?.success && (
      <CheckCircle 
        sx={{ 
          fontSize: 48, 
          color: transactionResult?.transactionType === 'deposit' ? 'success.main' : 'error.main',
          mr: 1 
        }} 
      />
    )}
    <Typography variant="h5" sx={{ fontWeight: 700 }}>
      ทำรายการสำเร็จ
    </Typography>
  </Box>
  <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
    เลขที่รายการ: TXN-{new Date().getTime()}
  </Typography>
</DialogTitle>

<DialogContent sx={{ mt: 2 }}>
  <Box sx={{ 
    textAlign: 'center', 
    mb: 3,
    p: 3,
    bgcolor: transactionResult?.transactionType === 'deposit' ? 'success.lighter' : 'error.lighter',
    borderRadius: 2,
    border: `2px solid ${transactionResult?.transactionType === 'deposit' ? '#2e7d32' : '#d32f2f'}`
  }}>
    <Typography variant="h6" sx={{ 
      color: transactionResult?.transactionType === 'deposit' ? 'success.dark' : 'error.dark',
      fontWeight: 600
    }}>
      {transactionResult?.transactionType === 'deposit' ? 'ฝากเงิน' : 'ถอนเงิน'}
    </Typography>
    <Typography variant="h3" sx={{ 
      fontWeight: 700, 
      color: transactionResult?.transactionType === 'deposit' ? 'success.dark' : 'error.dark',
      my: 2 
    }}>
      {formatBalance(transactionResult?.amount.toString() || '0')}
    </Typography>
  </Box>

  <Grid container spacing={3} sx={{ px: 2 }}>
    <Grid item xs={12}>
      <Typography variant="subtitle2" color="text.secondary">เลขที่บัญชี</Typography>
      <Box sx={{ 
        p: 2, 
        bgcolor: 'grey.50', 
        borderRadius: 1,
        mt: 1 
      }}>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {transactionResult?.accountNumber}
        </Typography>
      </Box>
    </Grid>

    <Grid item xs={6}>
      <Typography variant="subtitle2" color="text.secondary">วันที่</Typography>
      <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mt: 1 }}>
        <Typography variant="body2">
          {new Date(transactionResult?.transactionTime || '').toLocaleDateString('th-TH')}
        </Typography>
      </Box>
    </Grid>

    <Grid item xs={6}>
      <Typography variant="subtitle2" color="text.secondary">เวลา</Typography>
      <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mt: 1 }}>
        <Typography variant="body2">
          {new Date(transactionResult?.transactionTime || '').toLocaleTimeString('th-TH')}
        </Typography>
      </Box>
    </Grid>

    {transactionType === 'deposit' && (
      <Grid item xs={12}>
        <Typography variant="subtitle2" color="text.secondary">สลิปการโอนเงิน</Typography>
        <Box sx={{ 
          mt: 1,
          p: 3,
          border: '2px dashed #e0e0e0',
          borderRadius: 2,
          textAlign: 'center',
          minHeight: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="สลิปการโอนเงิน"
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                borderRadius: '8px'
              }}
            />
          ) : (
            <Typography color="text.secondary">
              ไม่มีรูปสลิป
            </Typography>
          )}
        </Box>
      </Grid>
    )}
  </Grid>
</DialogContent>

<DialogActions sx={{ 
  justifyContent: 'center', 
  pb: 3,
  pt: 2,
  borderTop: '2px dashed #e0e0e0',
  mt: 2
}}>
  <Button
    variant="contained"
    onClick={() => setTransactionResult(null)}
    sx={{
      px: 6,
      py: 1.5,
      borderRadius: 2,
      fontWeight: 600,
      bgcolor: transactionResult?.transactionType === 'deposit' ? 'success.main' : 'error.main',
      '&:hover': {
        bgcolor: transactionResult?.transactionType === 'deposit' ? 'success.dark' : 'error.dark',
      }
    }}
  >
    ตกลง
  </Button>
</DialogActions>
</Dialog>

  </Container>
);
};

export default TransactionForm;