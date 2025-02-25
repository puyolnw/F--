import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Box, useMediaQuery, useTheme } from '@mui/material';

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false); // State to control sidebar visibility
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect screen size

  const handleSidebarToggle = () => {
    setMobileOpen(!mobileOpen); // Toggle the sidebar
  };

  return (
    <Box
      sx={{
        display: 'flex',
        bgcolor: 'var(--bg-secondary)',
        minHeight: '100vh',
      }}
    >
      {/* Pass mobileOpen and onClose to Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onClose={handleSidebarToggle} />

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          ml: isMobile ? 0 : '240px', // Add margin-left to account for the sidebar width in desktop mode
        }}
      >
        {/* Pass the toggle function to Navbar */}
        <Navbar onSidebarToggle={handleSidebarToggle} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            bgcolor: 'var(--bg-tertiary)',
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;