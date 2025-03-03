import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Grid,
  Alert,
  Snackbar,
} from '@mui/material';

// Interface สำหรับข้อมูลแบบฟอร์ม
interface FormData {
  title: string;
  first_name: string;
  last_name: string;
  address: string;
  birth_date: string;
  phone_number: string;
  id_card_number: string;
  guarantor_1_name: string;
  guarantor_2_name: string;
  committee_1_name: string;
  committee_2_name: string;
  bank_account_number: string;
  bank_name: string;
  loan_amount: string;
  interest_rate: string;
  installment_count: string;
}

// Props สำหรับคอมโพเนนต์ขั้นตอน
interface StepProps {
  formData: FormData;
  errors: { [key: string]: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// คอมโพเนนต์ขั้นตอนข้อมูลส่วนตัว
const PersonalInfoStep: React.FC<StepProps> = ({ formData, errors, handleChange }) => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <TextField
        label="คำนำหน้าชื่อ"
        name="title"
        value={formData.title}
        onChange={handleChange}
        fullWidth
        error={!!errors.title}
        helperText={errors.title}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        label="ชื่อ"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        fullWidth
        error={!!errors.first_name}
        helperText={errors.first_name}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        label="นามสกุล"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        fullWidth
        error={!!errors.last_name}
        helperText={errors.last_name}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        label="ที่อยู่"
        name="address"
        value={formData.address}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        error={!!errors.address}
        helperText={errors.address}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        label="วันเกิด"
        name="birth_date"
        type="date"
        value={formData.birth_date}
        onChange={handleChange}
        fullWidth
        InputLabelProps={{ shrink: true }}
        error={!!errors.birth_date}
        helperText={errors.birth_date}
      />
    </Grid>
  </Grid>
);

// คอมโพเนนต์ขั้นตอนข้อมูลการค้ำประกัน
const GuarantorInfoStep: React.FC<StepProps> = ({ formData, errors, handleChange }) => (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <TextField
        label="หมายเลขโทรศัพท์"
        name="phone_number"
        value={formData.phone_number}
        onChange={handleChange}
        fullWidth
        error={!!errors.phone_number}
        helperText={errors.phone_number}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        label="หมายเลขบัตรประชาชน"
        name="id_card_number"
        value={formData.id_card_number}
        onChange={handleChange}
        fullWidth
        error={!!errors.id_card_number}
        helperText={errors.id_card_number}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        label="ชื่อผู้ค้ำประกัน 1"
        name="guarantor_1_name"
        value={formData.guarantor_1_name}
        onChange={handleChange}
        fullWidth
        error={!!errors.guarantor_1_name}
        helperText={errors.guarantor_1_name}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        label="ชื่อผู้ค้ำประกัน 2"
        name="guarantor_2_name"
        value={formData.guarantor_2_name}
        onChange={handleChange}
        fullWidth
        error={!!errors.guarantor_2_name}
        helperText={errors.guarantor_2_name}
      />
    </Grid>
  </Grid>
);

// คอมโพเนนต์ขั้นตอนข้อมูลการเงิน
const FinancialInfoStep: React.FC<StepProps> = ({ formData, errors, handleChange }) => (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <TextField
        label="ชื่อกรรมการคนที่ 1"
        name="committee_1_name"
        value={formData.committee_1_name}
        onChange={handleChange}
        fullWidth
        error={!!errors.committee_1_name}
        helperText={errors.committee_1_name}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        label="ชื่อกรรมการคนที่ 2"
        name="committee_2_name"
        value={formData.committee_2_name}
        onChange={handleChange}
        fullWidth
        error={!!errors.committee_2_name}
        helperText={errors.committee_2_name}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        label="เลขบัญชีธนาคาร"
        name="bank_account_number"
        value={formData.bank_account_number}
        onChange={handleChange}
        fullWidth
        error={!!errors.bank_account_number}
        helperText={errors.bank_account_number}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        label="ชื่อธนาคาร"
        name="bank_name"
        value={formData.bank_name}
        onChange={handleChange}
        fullWidth
        error={!!errors.bank_name}
        helperText={errors.bank_name}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        label="จำนวนเงินกู้"
        name="loan_amount"
        type="number"
        value={formData.loan_amount}
        onChange={handleChange}
        fullWidth
        error={!!errors.loan_amount}
        helperText={errors.loan_amount}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        select
        label="จำนวนงวด"
        name="installment_count"
        value={formData.installment_count}
        onChange={handleChange}
        fullWidth
        SelectProps={{ native: true }}
        error={!!errors.installment_count}
        helperText={errors.installment_count}
      >
        <option value="">กรุณาเลือก</option>
        <option value="3">3 เดือน</option>
        <option value="6">6 เดือน</option>
        <option value="12">12 เดือน</option>
        <option value="24">24 เดือน</option>
        <option value="36">36 เดือน</option>
      </TextField>
    </Grid>
  </Grid>
);

// คอมโพเนนต์ขั้นตอนตรวจสอบข้อมูล
const ReviewStep: React.FC<{ formData: FormData }> = ({ formData }) => {
  const calculatePayment = () => {
    const principal = parseFloat(formData.loan_amount) || 0;
    const interest = principal * 0.05;
    const total = principal + interest;
    const installmentCount = parseInt(formData.installment_count) || 1;
    return (total / installmentCount).toFixed(2);
  };

  const generateDueDates = () => {
    const dates = [];
    const today = new Date();
    let currentMonth = today.getMonth() + (today.getDate() > 25 ? 1 : 0);
    let currentYear = today.getFullYear();

    for (let i = 0; i < parseInt(formData.installment_count); i++) {
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      
      const date = new Date(currentYear, currentMonth, 25);
      dates.push(
        date.toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      );
      
      currentMonth++;
    }
    return dates;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, color: 'primary.main' }}>
        ตรวจสอบข้อมูลสัญญากู้
      </Typography>

      <Grid container spacing={3}>
        {/* ข้อมูลส่วนตัว */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              ข้อมูลส่วนตัว
            </Typography>
            <Typography gutterBottom>
              {formData.title} {formData.first_name} {formData.last_name}
            </Typography>
            <Typography gutterBottom>{formData.address}</Typography>
            <Typography>วันเกิด: {formData.birth_date}</Typography>
          </Paper>
        </Grid>

        {/* ข้อมูลการติดต่อ */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              ข้อมูลการติดต่อ
            </Typography>
            <Typography gutterBottom>โทรศัพท์: {formData.phone_number}</Typography>
            <Typography>เลขบัตรประชาชน: {formData.id_card_number}</Typography>
          </Paper>
        </Grid>

        {/* ข้อมูลการชำระเงิน */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              รายละเอียดการชำระ
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="textSecondary">
                  จำนวนเงินกู้
                </Typography>
                <Typography variant="h5" color="primary">
                  ฿{parseFloat(formData.loan_amount).toLocaleString('th-TH')}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="textSecondary">
                  จำนวนงวด
                </Typography>
                <Typography variant="h5" color="primary">
                  {formData.installment_count} งวด
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="textSecondary">
                  จ่ายรายเดือน
                </Typography>
                <Typography variant="h5" color="secondary">
                  ฿{calculatePayment()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* ตารางการชำระเงิน */}
        <Grid item xs={12}>
          <Paper sx={{ overflow: 'hidden' }}>
            <Typography variant="subtitle1" sx={{ p: 2, fontWeight: 'bold' }}>
              ตารางการชำระเงิน
            </Typography>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '16px', textAlign: 'left' }}>งวดที่</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>วันที่ครบกำหนด</th>
                  <th style={{ padding: '16px', textAlign: 'right' }}>จำนวนเงิน</th>
                </tr>
              </thead>
              <tbody>
                {generateDueDates().map((date, index) => (
                  <tr 
                    key={index}
                    style={{ 
                      backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
                      borderBottom: '1px solid #e9ecef'
                    }}
                  >
                    <td style={{ padding: '16px' }}>{index + 1}</td>
                    <td style={{ padding: '16px' }}>{date}</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <Typography fontWeight={500}>
                        ฿{calculatePayment()}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

// คอมโพเนนต์หลัก
const LoancontForm: React.FC = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    first_name: '',
    last_name: '',
    address: '',
    birth_date: '',
    phone_number: '',
    id_card_number: '',
    guarantor_1_name: '',
    guarantor_2_name: '',
    committee_1_name: '',
    committee_2_name: '',
    bank_account_number: '',
    bank_name: '',
    loan_amount: '',
    interest_rate: '5.00',
    installment_count: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    const fields = {
      0: ['title', 'first_name', 'last_name', 'address', 'birth_date'],
      1: ['phone_number', 'id_card_number', 'guarantor_1_name', 'guarantor_2_name'],
      2: ['committee_1_name', 'committee_2_name', 'bank_account_number', 'bank_name', 'loan_amount', 'installment_count']
    }[step] || [];

    fields.forEach(field => {
      if (!formData[field as keyof FormData]) {
        newErrors[field] = 'กรุณากรอกข้อมูลนี้';
      }
    });

    if (step === 2) {
      if (parseFloat(formData.loan_amount) <= 0) {
        newErrors.loan_amount = 'จำนวนเงินต้องมากกว่า 0';
      }
      if (!['3', '6', '12', '24', '36'].includes(formData.installment_count)) {
        newErrors.installment_count = 'กรุณาเลือกจำนวนงวดที่ถูกต้อง';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => validateFields() && setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      const response = await fetch('http://localhost:3301/api/loan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'บันทึกข้อมูลสำเร็จ!',
          severity: 'success'
        });
        // รีเซ็ตฟอร์ม
        setFormData({
          title: '',
          first_name: '',
          last_name: '',
          address: '',
          birth_date: '',
          phone_number: '',
          id_card_number: '',
          guarantor_1_name: '',
          guarantor_2_name: '',
          committee_1_name: '',
          committee_2_name: '',
          bank_account_number: '',
          bank_name: '',
          loan_amount: '',
          interest_rate: '5.00',
          installment_count: '',
        });
        setStep(0);
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: `เกิดข้อผิดพลาด: ${errorData.message}`,
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์',
        severity: 'error'
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography 
          variant="h4" 
          align="center" 
          sx={{ 
            mb: 4,
            fontWeight: 'bold',
            color: 'primary.main',
            textTransform: 'uppercase'
          }}
        >
          แบบฟอร์มกู้ยืมเงิน
        </Typography>

        <Stepper activeStep={step} sx={{ mb: 4 }}>
          {['ข้อมูลส่วนตัว', 'ข้อมูลค้ำประกัน', 'ข้อมูลการเงิน', 'ตรวจสอบข้อมูล'].map((label) => (
            <Step key={label}>
              <StepLabel sx={{ '& .MuiStepLabel-label': { fontWeight: 500 } }}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit}>
          {step === 0 && <PersonalInfoStep formData={formData} errors={errors} handleChange={handleChange} />}
          {step === 1 && <GuarantorInfoStep formData={formData} errors={errors} handleChange={handleChange} />}
          {step === 2 && <FinancialInfoStep formData={formData} errors={errors} handleChange={handleChange} />}
          {step === 3 && <ReviewStep formData={formData} />}

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: 40,
            gap: 16
          }}>
            {step > 0 && (
              <Button 
                variant="outlined" 
                onClick={prevStep}
                sx={{ 
                  px: 4,
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                ย้อนกลับ
              </Button>
            )}
            <Button
              type={step === 4 ? 'submit' : 'button'}
              variant="contained"
              onClick={step === 4 ? undefined : nextStep}
              sx={{ 
                ml: 'auto',
                px: 4,
                borderRadius: 2,
                textTransform: 'none',
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              {step === 3 ? 'ยืนยันการกู้' : 'ขั้นตอนถัดไป'}
            </Button>
          </div>
        </form>
      </Paper>
    </Container>
  );
};

export default LoancontForm;