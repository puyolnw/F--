import React, { useState } from 'react';
import styles from '../Members/AddMembers.module.css'; // นำ CSS มาใช้

const LoancontForm: React.FC = () => {
  const [step, setStep] = useState(1); // ใช้ state เพื่อควบคุมขั้นตอนของฟอร์ม
  const [formData, setFormData] = useState({
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
    interest_rate: '5.00', // ค่าเริ่มต้น 5%
    installment_count: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // เก็บข้อผิดพลาดของแต่ละฟิลด์

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงในฟิลด์
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      // ลบข้อผิดพลาดเมื่อผู้ใช้เริ่มกรอกข้อมูล
      setErrors({ ...errors, [name]: '' });
    }
  };

  // ฟังก์ชันสำหรับตรวจสอบข้อมูล
  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

    // ตรวจสอบฟิลด์ตามขั้นตอนปัจจุบัน
    if (step === 1) {
      if (!formData.title) newErrors.title = 'กรุณากรอกคำนำหน้าชื่อ';
      if (!formData.first_name) newErrors.first_name = 'กรุณากรอกชื่อ';
      if (!formData.last_name) newErrors.last_name = 'กรุณากรอกนามสกุล';
      if (!formData.address) newErrors.address = 'กรุณากรอกที่อยู่';
      if (!formData.birth_date) newErrors.birth_date = 'กรุณากรอกวันเกิด';
    } else if (step === 2) {
      if (!formData.phone_number) newErrors.phone_number = 'กรุณากรอกหมายเลขโทรศัพท์';
      if (!formData.id_card_number) newErrors.id_card_number = 'กรุณากรอกหมายเลขบัตรประชาชน';
      if (!formData.guarantor_1_name) newErrors.guarantor_1_name = 'กรุณากรอกชื่อผู้ค้ำประกัน 1';
      if (!formData.guarantor_2_name) newErrors.guarantor_2_name = 'กรุณากรอกชื่อผู้ค้ำประกัน 2';
    } else if (step === 3) {
      if (!formData.committee_1_name) newErrors.committee_1_name = 'กรุณากรอกชื่อกรรมการคนที่ 1';
      if (!formData.committee_2_name) newErrors.committee_2_name = 'กรุณากรอกชื่อกรรมการคนที่ 2';
      if (!formData.bank_account_number) newErrors.bank_account_number = 'กรุณากรอกเลขบัญชีธนาคาร';
      if (!formData.bank_name) newErrors.bank_name = 'กรุณากรอกชื่อธนาคาร';
      if (!formData.loan_amount) newErrors.loan_amount = 'กรุณากรอกจำนวนเงินกู้';
      if (!formData.installment_count) newErrors.installment_count = 'กรุณากรอกจำนวนงวด';
    }

    console.log('Validation Errors:', newErrors); // ดูข้อผิดพลาดที่เกิดขึ้น
    console.log('Form Data:', formData); // ดูข้อมูลที่กรอกในฟอร์ม

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // คืนค่า true ถ้าไม่มีข้อผิดพลาด
  };

  // ฟังก์ชันสำหรับไปยังขั้นตอนถัดไป
  const nextStep = () => {
    if (validateFields()) {
      console.log('No validation errors, proceeding to the next step...');
      setStep((prevStep) => prevStep + 1);
    } else {
      console.log('Validation failed, staying on the current step.');
    }
  };

  // ฟังก์ชันสำหรับย้อนกลับไปขั้นตอนก่อนหน้า
  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  // ฟังก์ชันสำหรับส่งข้อมูล
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateFields()) {
      console.log('Form Data:', formData);

      try {
        const response = await fetch('http://localhost:3301/api/loan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert('บันทึกข้อมูลสำเร็จ');
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
          setStep(1); // รีเซ็ตขั้นตอน
        } else {
          const errorData = await response.json();
          alert(`เกิดข้อผิดพลาด: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
      }
    }
  };

  // ฟังก์ชันสำหรับแสดงฟอร์มในแต่ละขั้นตอน
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className={styles.mainTitle}>ข้อมูลส่วนตัว</h2>
            <div className={styles.inputGroup}>
              <label>คำนำหน้าชื่อ</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={styles.input}
                style={{ color: '#000' }}
              />
              {errors.title && <p className={styles.error}>{errors.title}</p>}
            </div>
            <div className={styles.inputGroup}>
              <label>ชื่อ</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={styles.input}
                style={{ color: '#000' }}
              />
              {errors.first_name && <p className={styles.error}>{errors.first_name}</p>}
            </div>
            <div className={styles.inputGroup}>
              <label>นามสกุล</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={styles.input}
                style={{ color: '#000' }}
              />
              {errors.last_name && <p className={styles.error}>{errors.last_name}</p>}
            </div>
            <div className={styles.inputGroup}>
              <label>ที่อยู่</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={styles.input}
                style={{ color: '#000' }}
              />
              {errors.address && <p className={styles.error}>{errors.address}</p>}
            </div>
            <div className={styles.inputGroup}>
              <label>วันเกิด</label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                className={styles.input}
                style={{ color: '#000' }}
              />
              {errors.birth_date && <p className={styles.error}>{errors.birth_date}</p>}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className={styles.mainTitle}>ข้อมูลการค้ำประกัน</h2>
            <div className={styles.inputGroup}>
              <label>หมายเลขโทรศัพท์</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className={styles.input}
                style={{ color: '#000' }}
              />
              {errors.phone_number && <p className={styles.error}>{errors.phone_number}</p>}
            </div>
            <div className={styles.inputGroup}>
              <label>หมายเลขบัตรประชาชน</label>
              <input
                type="text"
                name="id_card_number"
                value={formData.id_card_number}
                onChange={handleChange}
                className={styles.input}
                style={{ color: '#000' }}
              />
              {errors.id_card_number && <p className={styles.error}>{errors.id_card_number}</p>}
            </div>
            <div className={styles.inputGroup}>
              <label>ชื่อผู้ค้ำประกัน 1</label>
              <input
                type="text"
                name="guarantor_1_name"
                value={formData.guarantor_1_name}
                onChange={handleChange}
                className={styles.input}
                style={{ color: '#000' }}
              />
              {errors.guarantor_1_name && <p className={styles.error}>{errors.guarantor_1_name}</p>}
            </div>
            <div className={styles.inputGroup}>
              <label>ชื่อผู้ค้ำประกัน 2</label>
              <input
                type="text"
                name="guarantor_2_name"
                value={formData.guarantor_2_name}
                onChange={handleChange}
                className={styles.input}
                style={{ color: '#000' }}
              />
              {errors.guarantor_2_name && <p className={styles.error}>{errors.guarantor_2_name}</p>}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className={styles.mainTitle}>ข้อมูลการเงิน</h2>
            <div className={styles.inputGroup}>
              <label>ชื่อกรรมการคนที่ 1</label>
              <input
                type="text"
                name="committee_1_name"
                value={formData.committee_1_name}
                onChange={handleChange}
                className={styles.input}
                style={{ color: '#000' }}
              />
              {errors.committee_1_name && <p className={styles.error}>{errors.committee_1_name}</p>}
            </div>
            <div className={styles.inputGroup}>
              <label>ชื่อกรรมการคนที่ 2</label>
              <input
                type="text"
                name="committee_2_name"
                value={formData.committee_2_name}
                onChange={handleChange}
                className={styles.input}
                style={{ color: '#000' }}
              />
              {errors.committee_2_name && <p className={styles.error}>{errors.committee_2_name}</p>}
            </div>
            <div className={styles.inputGroup}>
              <label>เลขบัญชีธนาคาร</label>
              <input
                type="text"
                name="bank_account_number"
                value={formData.bank_account_number}
                onChange={handleChange}
                className={styles.input}
                style={{ color: '#000' }}
              />
              {errors.bank_account_number && <p className={styles.error}>{errors.bank_account_number}</p>}
            </div>
            <div className={styles.inputGroup}>
              <label>ชื่อธนาคาร</label>
              <input
                type="text"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
                className={styles.input}
                style={{ color: '#000' }}
              />
              {errors.bank_name && <p className={styles.error}>{errors.bank_name}</p>}
            </div>
            <div className={styles.inputGroup}>
              <label>จำนวนเงินกู้</label>
              <input
                type="number"
                name="loan_amount"
                value={formData.loan_amount}
                onChange={handleChange}
                className={styles.input}
                style={{ color: '#000' }}
              />
              {errors.loan_amount && <p className={styles.error}>{errors.loan_amount}</p>}
            </div>
            <div className={styles.inputGroup}>
              <label>จำนวนงวด</label>
              <input
                type="number"
                name="installment_count"
                value={formData.installment_count}
                onChange={handleChange}
                className={styles.input}
                style={{ color: '#000' }}
              />
              {errors.installment_count && <p className={styles.error}>{errors.installment_count}</p>}
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className={styles.mainTitle}>ตรวจสอบข้อมูล</h2>
            <div className={styles.inputGroup}>
              <p>คำนำหน้าชื่อ: {formData.title}</p>
              <p>ชื่อ: {formData.first_name}</p>
              <p>นามสกุล: {formData.last_name}</p>
              <p>ที่อยู่: {formData.address}</p>
              <p>วันเกิด: {formData.birth_date}</p>
              <p>หมายเลขโทรศัพท์: {formData.phone_number}</p>
              <p>หมายเลขบัตรประชาชน: {formData.id_card_number}</p>
              <p>ชื่อผู้ค้ำประกัน 1: {formData.guarantor_1_name}</p>
              <p>ชื่อผู้ค้ำประกัน 2: {formData.guarantor_2_name}</p>
              <p>ชื่อกรรมการคนที่ 1: {formData.committee_1_name}</p>
              <p>ชื่อกรรมการคนที่ 2: {formData.committee_2_name}</p>
              <p>เลขบัญชีธนาคาร: {formData.bank_account_number}</p>
              <p>ชื่อธนาคาร: {formData.bank_name}</p>
              <p>จำนวนเงินกู้: {formData.loan_amount}</p>
              <p>จำนวนงวด: {formData.installment_count}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        {renderStep()}
        <div className={styles.row} style={{ justifyContent: 'center', gap: '1em' }}>
          {step > 1 && (
            <button type="button" onClick={prevStep} className={styles.button} style={{ width: '150px' }}>
              ย้อนกลับ
            </button>
          )}
          {step < 4 ? (
            <button type="button" onClick={nextStep} className={styles.button} style={{ width: '150px' }}>
              ถัดไป
            </button>
          ) : (
            <button type="submit" className={styles.button} style={{ width: '150px' }}>
              ยืนยันข้อมูล
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoancontForm;