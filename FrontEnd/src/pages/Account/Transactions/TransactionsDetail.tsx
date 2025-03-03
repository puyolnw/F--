import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Paper,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
  Container,
  Grid,
  Box,
  Chip,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment 
} from '@mui/material';
import {
  AccountBalance,
  Person,
  Schedule,
  Receipt,
  ArrowUpward,
  ArrowDownward,
  Edit,
  Delete,
} from '@mui/icons-material';

interface Transaction {
    transaction_id: string;
    account_number: string;
    transaction_date: string;
    transaction_time: string;
    by_user: string;
    deposit: number;
    withdrawal: number;
    t_balance: number;
    balance: number;
  }

const TransactionDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editAmount, setEditAmount] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('th-TH', {
      style: 'currency',
      currency: 'THB'
    });
  };

  const formatThaiDateTime = (date: string, time: string) => {
    const d = new Date(date);
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    const thaiDate = `${d.getDate()} ${thaiMonths[d.getMonth()]} ${d.getFullYear() + 543}`;
    return `${thaiDate} เวลา ${time} น.`;
  };

  const handleEdit = async () => {
    try {
      if (!transaction) return;
      
      const payload = {
        deposit: transaction.deposit > 0 ? parseFloat(editAmount) : 0,
        withdrawal: transaction.deposit > 0 ? 0 : parseFloat(editAmount),
        transaction_date: editDate,
        transaction_time: editTime
      };
  
      await axios.put(`http://localhost:3301/api/transactions/${id}`, payload);
      setOpenEditDialog(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };
  const handleDelete = async () => {
    if (window.confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) {
      try {
        await axios.delete(`http://localhost:3301/api/transactions/${id}`);
        navigate('/transactions');
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  useEffect(() => {
    if (!id) {
      setError('ไม่พบรหัสธุรกรรม');
      setLoading(false);
      return;
    }

    const fetchTransactionDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<Transaction>(
          `http://localhost:3301/api/transactions/${id}`
        );
        setTransaction(response.data);
      } catch (err) {
        setError('ไม่พบข้อมูลธุรกรรมหรือเกิดข้อผิดพลาดในการดึงข้อมูล');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetail();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          <AlertTitle>ข้อผิดพลาด</AlertTitle>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!transaction) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">
          <AlertTitle>ไม่พบข้อมูล</AlertTitle>
          ไม่พบข้อมูลธุรกรรม
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ 
  p: 3, 
  bgcolor: transaction?.deposit > 0 ? 'success.lighter' : 'error.lighter',
  borderBottom: '1px solid',
  borderColor: transaction?.deposit > 0 ? 'success.light' : 'error.light',
}}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {transaction?.deposit > 0 ? (
              <ArrowUpward sx={{ fontSize: 40, color: 'success.main' }} />
            ) : (
              <ArrowDownward sx={{ fontSize: 40, color: 'error.main' }} />
            )}
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              {transaction?.deposit > 0 ? 'รายการฝากเงิน' : 'รายการถอนเงิน'}
            </Typography>
          </Box>
          
          <Typography variant="h3" sx={{ 
            fontWeight: 700,
            color: transaction?.deposit > 0 ? 'success.main' : 'error.main',
            textAlign: 'center',
            my: 3
          }}>
            {formatCurrency(transaction?.deposit || transaction?.withdrawal || 0)}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              label={`รหัสธุรกรรม: ${transaction?.transaction_id}`}
              sx={{ 
                bgcolor: 'white',
                fontWeight: 500,
                fontSize: '1rem'
              }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setOpenEditDialog(true)}
                sx={{ bgcolor: 'white', color: 'primary.main' }}
              >
                แก้ไข
              </Button>
              <Button
                variant="contained"
                startIcon={<Delete />}
                onClick={handleDelete}
                sx={{ bgcolor: 'white', color: 'error.main' }}
              >
                ลบ
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <AccountBalance color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">หมายเลขบัญชี</Typography>
                  <Typography variant="h6">{transaction?.account_number}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Person color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">ทำรายการโดย</Typography>
                  <Typography variant="h6">{transaction?.by_user}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Schedule color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">วันและเวลาทำรายการ</Typography>
                  <Typography variant="h6">
                    {formatThaiDateTime(transaction?.transaction_date, transaction?.transaction_time)}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>ข้อมูลยอดเงิน</Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography color="text.secondary">ยอดคงเหลือหลังทำรายการ</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                      {formatCurrency(transaction?.t_balance || 0)}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography color="text.secondary">ยอดคงเหลือในบัญชี</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                      {formatCurrency(transaction?.balance || 0)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            {transaction?.deposit > 0 && (
              <Grid item xs={12}>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ 
                  mt: 2,
                  p: 3,
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  textAlign: 'center',
                  minHeight: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Box>
                    <Receipt sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                    <Typography color="text.secondary">
                      พื้นที่แสดงสลิปการฝากเงิน
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>

      <Dialog 
  open={openEditDialog} 
  onClose={() => setOpenEditDialog(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle sx={{ 
    borderBottom: '1px solid #e0e0e0',
    pb: 2
  }}>
    แก้ไขรายการธุรกรรม
  </DialogTitle>
  <DialogContent sx={{ pt: 3 }}>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          label={transaction?.deposit > 0 ? "จำนวนเงินฝาก" : "จำนวนเงินถอน"}
          type="number"
          fullWidth
          value={editAmount}
          onChange={(e) => setEditAmount(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">฿</InputAdornment>
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="วันที่ทำรายการ"
          type="date"
          fullWidth
          value={editDate}
          onChange={(e) => setEditDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="เวลาทำรายการ"
          type="time"
          fullWidth
          value={editTime}
          onChange={(e) => setEditTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
    </Grid>
  </DialogContent>
  <DialogActions sx={{ 
    p: 3,
    borderTop: '1px solid #e0e0e0'
  }}>
    <Button 
      onClick={() => setOpenEditDialog(false)}
      variant="outlined"
    >
      ยกเลิก
    </Button>
    <Button 
      onClick={handleEdit} 
      variant="contained"
      color={transaction?.deposit > 0 ? "success" : "error"}
    >
      บันทึกการแก้ไข
    </Button>
  </DialogActions>
</Dialog>
    </Container>
  );
};

export default TransactionDetail;
