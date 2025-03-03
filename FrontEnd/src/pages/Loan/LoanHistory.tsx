import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/LoanHistory.css';

interface LoanContract {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  loan_amount: number;
  installment_count: number;
  paid_installments: number;
  created_at: string;
}

const LoanHistory: React.FC = () => {
  const [loanContracts, setLoanContracts] = useState<LoanContract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoanContracts = async () => {
      try {
        const response = await fetch('http://localhost:3301/api/loan');
        if (!response.ok) throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูล');
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

  const handleViewDetails = (id: number) => {
    navigate(`/loan/history/${id}`);
  };

  const getThaiDate = (dateString: string) => {
    const date = new Date(dateString);
    const thaiYear = date.getFullYear() + 543; // ปรับปีให้ถูกต้องสำหรับภาษาไทย
    const thaiDate = `${date.getDate()} ${getThaiMonth(date.getMonth())} ${thaiYear}`;

    return thaiDate;
  };

  const getThaiMonth = (month: number) => {
    const thaiMonths: string[] = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    return thaiMonths[month];
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
              <th>จำนวนงวดทั้งหมด</th>
              <th>จ่ายแล้ว</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loanContracts.map((loan, index) => (
              <tr key={loan.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                <td>{loan.id}</td>
                <td>{loan.title} {loan.first_name} {loan.last_name}</td>
                <td>{loan.loan_amount.toLocaleString()} บาท</td>
                <td>{loan.installment_count} งวด</td>
                <td>{loan.paid_installments} งวด</td>
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
