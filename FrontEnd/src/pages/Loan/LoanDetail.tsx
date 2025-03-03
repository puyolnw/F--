import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Paper, 
  Typography, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Chip,
  CircularProgress,
  Alert,
  styled 
} from '@mui/material';
import { 
  Person as PersonIcon,
  Home as HomeIcon,
  Phone as PhoneIcon,
  Paid as PaidIcon,
  CalendarMonth as CalendarIcon,
  ListAlt as ListAltIcon
} from '@mui/icons-material';

const DetailPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(3),
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
  '&.paid': {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  '&.pending': {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
}));

interface LoanDetail {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  address: string;
  phone_number: string;
  loan_amount: number;
  installment_count: number;
  paid_installments?: number; // แก้ให้เป็น optional
  created_at: string;
  total_paid: number;
  remaining_balance: number;
  payment_schedules: {
    due_date: string;
    amount: number;
    status: 'paid' | 'pending';
  }[];
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? 'N/A' 
      : date.toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
  } catch {
    return 'N/A';
  }
};

const LoanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loanDetail, setLoanDetail] = useState<LoanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoanDetail = async () => {
      try {
        // ดึงข้อมูลสัญญากู้
        const loanResponse = await fetch(`http://localhost:3301/api/loan/${id}`);
        if (!loanResponse.ok) throw new Error('ไม่พบข้อมูลสัญญากู้ยืม');
        const loanData = await loanResponse.json();

        // ดึงข้อมูลการชำระเงิน
        const paymentResponse = await fetch(`http://localhost:3301/api/loan/${id}/payments`);
        const paymentData = await paymentResponse.json();

        // คำนวณจำนวนงวดที่ชำระแล้ว
        const paidCount = paymentData.filter(
          (p: { status: string }) => p.status === 'paid'
        ).length;

        setLoanDetail({
          ...loanData,
          paid_installments: loanData.paid_installments ?? paidCount, // ใช้ค่าจาก API หรือคำนวณใหม่
          payment_schedules: paymentData,
          created_at: loanData.created_at || new Date().toISOString() // ใส่ค่าเริ่มต้นหากไม่มี
        });
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanDetail();
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
      <CircularProgress size={60} />
    </div>
  );

  if (error) return (
    <Alert severity="error" sx={{ m: 3 }}>
      {error}
    </Alert>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        mb: 4, 
        fontWeight: 600,
        color: 'primary.main',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <ListAltIcon fontSize="large" />
        รายละเอียดสัญญากู้ยืม #{id}
      </Typography>

      {loanDetail && (
        <>
          <Grid container spacing={3}>
            {/* ข้อมูลผู้กู้ */}
            <Grid item xs={12} md={6}>
  <DetailPaper>
    <Typography variant="h5" gutterBottom sx={{ 
      mb: 3,
      display: 'flex',
      alignItems: 'center',
      gap: 1
    }}>
      <PaidIcon color="primary" />
      สถานะการชำระเงิน
    </Typography>
    
    <Grid container spacing={2}>
      <DetailItem 
        icon={<PaidIcon />}
        label="ยอดเงินกู้ทั้งหมด"
        value={`${loanDetail.loan_amount?.toLocaleString('th-TH')} บาท`}
      />
      <DetailItem 
  icon={<PaidIcon />}
  label="ชำระแล้ว"
  value={`${(loanDetail.total_paid || 0).toLocaleString('th-TH')} บาท`}
/>
<DetailItem 
  icon={<PaidIcon />}
  label="ยอดคงเหลือที่ต้องชำระ"
  value={`${(loanDetail.remaining_balance || 0).toLocaleString('th-TH')} บาท`}
/>
<DetailItem 
  icon={<CalendarIcon />}
  label="ความคืบหน้า"
  value={`${((loanDetail.total_paid || 0) / (loanDetail.loan_amount || 1) * 100).toFixed(2)}%`}
/>
      
    </Grid>
  </DetailPaper>
</Grid>
            {/* ข้อมูลการกู้ */}
            <Grid item xs={12} md={6}>
              <DetailPaper>
                <Typography variant="h5" gutterBottom sx={{ 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <PaidIcon color="primary" />
                  ข้อมูลการกู้
                </Typography>
                
                <Grid container spacing={2}>
                  <DetailItem 
                    icon={<PaidIcon />}
                    label="จำนวนเงินกู้"
                    value={`${loanDetail.loan_amount?.toLocaleString('th-TH') || 0} บาท`}
                  />
                  <DetailItem 
                    icon={<CalendarIcon />}
                    label="จำนวนงวดทั้งหมด"
                    value={`${loanDetail.installment_count} งวด`}
                  />
                  <DetailItem 
                    icon={<CalendarIcon />}
                    label="จ่ายแล้ว"
                    value={`${loanDetail.paid_installments || 0} งวด`}
                  />
                  <DetailItem 
                    icon={<CalendarIcon />}
                    label="วันที่เริ่มสัญญา"
                    value={formatDate(loanDetail.created_at)}
                  />
                </Grid>
              </DetailPaper>
            </Grid>

            {/* ตารางการชำระเงิน */}
            <Grid item xs={12}>
              <DetailPaper>
                <Typography variant="h5" gutterBottom sx={{ 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <ListAltIcon color="primary" />
                  ตารางการชำระเงิน
                </Typography>

                <Table sx={{ 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}>
                  <TableHead sx={{ bgcolor: 'primary.main' }}>
                    <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>งวดที่</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>วันที่ครบกำหนด</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>จำนวนเงิน</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>สถานะ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loanDetail.payment_schedules.map((payment, index) => (
                      <TableRow 
                        key={index}
                        hover
                        sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {formatDate(payment.due_date)}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {payment.amount?.toLocaleString('th-TH')} บาท
                        </TableCell>
                        <TableCell>
                          <StatusChip
                            label={payment.status === 'paid' ? 'ชำระแล้ว' : 'รอดำเนินการ'}
                            className={payment.status}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DetailPaper>
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
};

const DetailItem = ({ icon, label, value }: { 
  icon: React.ReactNode, 
  label: string, 
  value: string 
}) => (
  <Grid item xs={12} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
    <span style={{ color: 'primary.main' }}>{icon}</span>
    <div>
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={500}>
        {value}
      </Typography>
    </div>
  </Grid>
);

export default LoanDetail;