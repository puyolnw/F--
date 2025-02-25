export function logout() {
  // Clear all user-related data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userPreferences'); // ตัวอย่างข้อมูลที่อาจเก็บไว้
  sessionStorage.clear(); // ล้างข้อมูลใน sessionStorage ทั้งหมด

  // Redirect user to the login page
  window.location.href = '/auth/login';
}