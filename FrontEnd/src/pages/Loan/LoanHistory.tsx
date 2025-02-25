import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // สำหรับการนำทางไปยังหน้ารายละเอียด
import './LoanHistory.css'; // ใช้ CSS เฉพาะหน้า LoanHistory

interface LoanContract {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  loan_amount: number;
  interest_rate: number | string | null; // อนุญาตให้เป็น number, string หรือ null
  installment_count: number;
  created_at: string | null; // วันที่สร้างสัญญา อนุญาตให้เป็น null
}

const LoanHistory: React.FC = () => {
  const [loanContracts, setLoanContracts] = useState<LoanContract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // ดึงข้อมูลสัญญากู้ยืมทั้งหมดจาก API
  useEffect(() => {
    const fetchLoanContracts = async () => {
      try {
        const response = await fetch('http://localhost:3301/api/loan');
        if (!response.ok) {
          throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูล');
        }
        const data = await response.json();
        setLoanContracts(data);
      } catch (error: any) {
        setError(error.message || 'เกิดข้อผิดพลาด');
      } finally {
        setLoading(false);
      }
    };

    fetchLoanContracts();
  }, []);

  // ฟังก์ชันสำหรับดูรายละเอียด
  const handleViewDetails = (id: number) => {
    navigate(`/loan/${id}`); // นำทางไปยังหน้ารายละเอียดของสัญญากู้ยืม
  };

  return (
    <div className="loan-history-container">
      <h1 className="loan-history-title">ประวัติการกู้ยืม</h1>
      {loading ? (
        <p className="loan-history-loading">กำลังโหลดข้อมูล...</p>
      ) : error ? (
        <p className="loan-history-error">{error}</p>
      ) : (
        <table className="loan-history-table">
          <thead>
            <tr>
              <th>รหัส</th>
              <th>ชื่อ</th>
              <th>จำนวนเงินกู้</th>
              <th>อัตราดอกเบี้ย (%)</th>
              <th>จำนวนงวด</th>
              <th>วันที่สร้าง</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loanContracts.map((loan, index) => (
              <tr key={loan.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                <td>{loan.id}</td>
                <td>
                  {loan.title} {loan.first_name} {loan.last_name}
                </td>
                <td>{loan.loan_amount.toLocaleString()} บาท</td>
                <td>
                  {loan.interest_rate !== null && !isNaN(Number(loan.interest_rate))
                    ? Number(loan.interest_rate).toFixed(2)
                    : 'N/A'}
                </td>
                <td>{loan.installment_count} งวด</td>
                <td>
                  {loan.created_at
                    ? new Date(loan.created_at).toString() !== 'Invalid Date'
                      ? new Date(loan.created_at).toLocaleDateString()
                      : 'N/A'
                    : 'N/A'}
                </td>
                <td>
                  <button
                    className="loan-history-details-button"
                    onClick={() => handleViewDetails(loan.id)}
                  >
                    ดูรายละเอียด
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LoanHistory;