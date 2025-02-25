import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './AddMembers.module.css';

// Import MUI Icons
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WcIcon from '@mui/icons-material/Wc';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';

const AddMembers = () => {
  const navigate = useNavigate();

  // ดึง username จาก localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.username;
      } catch (e) {
        console.error('Error parsing user data:', e);
        return '';
      }
    }
    return '';
  });

  // ตรวจสอบการ login
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const [formData, setFormData] = useState<{
    id_card_number: string;
    full_name: string;
    birth_date: string;
    gender: string;
    house_code: string;
    address: string;
    phone_number: string;
    marital_status: string;
  }>({
    id_card_number: '',
    full_name: '',
    birth_date: '',
    gender: '',
    house_code: '',
    address: '',
    phone_number: '',
    marital_status: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('กรุณาเข้าสู่ระบบก่อนทำรายการ');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formDataToSend = {
      ...formData,
      has_account: '0',
      created_by: currentUser
    };

    try {
      await axios.post('http://localhost:3301/api/members', formDataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSuccessMessage('สมาชิกและบัญชีถูกสร้างเรียบร้อยแล้ว');
      setFormData({
        id_card_number: '',
        full_name: '',
        birth_date: '',
        gender: '',
        house_code: '',
        address: '',
        phone_number: '',
        marital_status: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <h2 className={styles.mainTitle}>เพิ่มข้อมูลสมาชิก</h2>

        {/* Row 1: ID Card and Full Name */}
        <div className={styles.row}>
          <div className={styles.colHalf}>
            <div className={styles.title}>เลขบัตรประชาชน</div>
            <div className={`${styles.inputGroup} ${styles.inputGroupIcon}`}>
              <input
                type="text"
                name="id_card_number"
                placeholder="กรุณากรอกเลขบัตรประชาชน"
                value={formData.id_card_number}
                onChange={handleChange}
                required
                maxLength={13}
                className={styles.input}
              />
              <div className={styles.inputIcon}>
                <BadgeIcon />
              </div>
            </div>
          </div>
          <div className={styles.colHalf}>
            <div className={styles.title}>ชื่อ-นามสกุล</div>
            <div className={`${styles.inputGroup} ${styles.inputGroupIcon}`}>
              <input
                type="text"
                name="full_name"
                placeholder="กรุณากรอกชื่อ-นามสกุล"
                value={formData.full_name}
                onChange={handleChange}
                required
                className={styles.input}
              />
              <div className={styles.inputIcon}>
                <PersonIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Birth Date, Gender, and Phone */}
        <div className={styles.row}>
          <div className={styles.colThird}>
            <div className={styles.title}>วันเกิด</div>
            <div className={`${styles.inputGroup} ${styles.inputGroupIcon}`}>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                required
                className={styles.input}
              />
              <div className={styles.inputIcon}>
                <CalendarTodayIcon />
              </div>
            </div>
          </div>
          <div className={styles.colThird}>
            <div className={styles.title}>เพศ</div>
            <div className={`${styles.inputGroup} ${styles.radioGroup}`}>
              <input
                type="radio"
                id="gender-male"
                name="gender"
                value="ชาย"
                checked={formData.gender === 'ชาย'}
                onChange={handleChange}
              />
              <label htmlFor="gender-male">ชาย</label>
              <input
                type="radio"
                id="gender-female"
                name="gender"
                value="หญิง"
                checked={formData.gender === 'หญิง'}
                onChange={handleChange}
              />
              <label htmlFor="gender-female">หญิง</label>
            </div>
          </div>
          <div className={styles.colThird}>
            <div className={styles.title}>เบอร์โทรศัพท์</div>
            <div className={`${styles.inputGroup} ${styles.inputGroupIcon}`}>
              <input
                type="tel"
                name="phone_number"
                placeholder="กรุณากรอกเบอร์โทรศัพท์"
                value={formData.phone_number}
                onChange={handleChange}
                required
                maxLength={10}
                className={styles.input}
              />
              <div className={styles.inputIcon}>
                <PhoneIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: House Code and Address */}
        <div className={styles.row}>
          <div className={styles.colHalf}>
            <div className={styles.title}>รหัสบ้าน</div>
            <div className={`${styles.inputGroup} ${styles.inputGroupIcon}`}>
              <input
                type="text"
                name="house_code"
                placeholder="กรุณากรอกรหัสบ้าน"
                value={formData.house_code}
                onChange={handleChange}
                className={styles.input}
              />
              <div className={styles.inputIcon}>
                <HomeIcon />
              </div>
            </div>
          </div>
          <div className={styles.colHalf}>
            <div className={styles.title}>ที่อยู่</div>
            <div className={`${styles.inputGroup} ${styles.inputGroupIcon}`}>
              <input
                type="text"
                name="address"
                placeholder="กรุณากรอกที่อยู่"
                value={formData.address}
                onChange={handleChange}
                className={styles.input}
              />
              <div className={styles.inputIcon}>
                <LocationOnIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Marital Status */}
        <div className={styles.row}>
          <div className={styles.colFull}>
            <div className={styles.title}>สถานะการแต่งงาน</div>
            <div className={`${styles.inputGroup} ${styles.radioGroup}`}>
              <input
                type="radio"
                id="status-single"
                name="marital_status"
                value="โสด"
                checked={formData.marital_status === 'โสด'}
                onChange={handleChange}
              />
              <label htmlFor="status-single">โสด</label>
              <input
                type="radio"
                id="status-married"
                name="marital_status"
                value="แต่งงาน"
                checked={formData.marital_status === 'แต่งงาน'}
                onChange={handleChange}
              />
              <label htmlFor="status-married">แต่งงาน</label>
            </div>
          </div>
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
        </button>
      </form>
    </div>
  );
};

export default AddMembers;