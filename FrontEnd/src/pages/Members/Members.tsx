import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  TablePagination,
  Button,
} from '@mui/material';

const MembersPage = () => {
  const [members, setMembers] = useState<any[]>([]); // เก็บข้อมูลสมาชิก
  const [loading, setLoading] = useState<boolean>(true); // สถานะโหลดข้อมูล
  const [error, setError] = useState<string | null>(null); // เก็บข้อความ error
  const [page, setPage] = useState<number>(0); // หน้าปัจจุบันของ pagination
  const [rowsPerPage, setRowsPerPage] = useState<number>(5); // จำนวนข้อมูลต่อหน้า

  // ดึงข้อมูลสมาชิกจาก API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:3301/api/members'); // เรียก API
        setMembers(response.data);
      } catch (err) {
        setError('Failed to fetch members');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // หากกำลังโหลดข้อมูล
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // หากเกิดข้อผิดพลาด
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  // ฟังก์ชันเปลี่ยนหน้า
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // ฟังก์ชันเปลี่ยนจำนวนแถวต่อหน้า
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // รีเซ็ตไปหน้าแรก
  };

  return (
    <Box sx={{ padding: '20px' }}>
      {/* หัวข้อ */}
      <Typography variant="h4" sx={{ marginBottom: '20px',textAlign:'center', color: 'var(--table-header)' }}>
        รายชื่อสมาชิก
      </Typography>

      {/* ตารางสมาชิก */}
      <TableContainer component={Paper} sx={{ backgroundColor: 'var(--table-background)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'var(--table-header)' }}>
              <TableCell sx={{ color: 'var(--table-header-text)', fontWeight: 'bold', textAlign: 'center' }}>ลำดับ</TableCell>
              <TableCell sx={{ color: 'var(--table-header-text)', fontWeight: 'bold', textAlign: 'center' }}>ชื่อ-นามสกุล</TableCell>
              <TableCell sx={{ color: 'var(--table-header-text)', fontWeight: 'bold', textAlign: 'center' }}>เบอร์โทร</TableCell>
              <TableCell sx={{ color: 'var(--table-header-text)', fontWeight: 'bold', textAlign: 'center' }}>ที่อยู่</TableCell>
              <TableCell sx={{ color: 'var(--table-header-text)', fontWeight: 'bold', textAlign: 'center' }}>จำนวนบัญชี</TableCell>
              <TableCell sx={{ color: 'var(--table-header-text)', fontWeight: 'bold', textAlign: 'center' }}>จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((member, index) => (
                <TableRow
                  key={member.member_id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? 'var(--table-row-odd)' : 'var(--table-background)',
                    '&:hover': { backgroundColor: 'var(--table-row-hover)' },
                  }}
                >
                  <TableCell sx={{ textAlign: 'center' }}>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{member.full_name}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{member.phone_number}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{member.address}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{member.has_account}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ marginRight: '5px' }}
                      onClick={() => alert(`ดูรายละเอียดของ ${member.full_name}`)}
                    >
                      ดู
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      sx={{ marginRight: '5px' }}
                      onClick={() => alert(`แก้ไขข้อมูลของ ${member.full_name}`)}
                    >
                      แก้ไข
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      onClick={() => alert(`ลบข้อมูลของ ${member.full_name}`)}
                    >
                      ลบ
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={members.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default MembersPage;