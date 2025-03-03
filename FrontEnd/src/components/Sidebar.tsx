import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useTheme, useMediaQuery } from '@mui/material';
import { menuItems } from './MenuSidebar';

function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const handleToggle = (itemText: string) => {
    setOpenMenus(prev => {
      const newState = { ...prev };
      
      // Close all other menus except the current path
      Object.keys(newState).forEach(key => {
        if (key !== itemText && !location.pathname.includes(key.toLowerCase())) {
          newState[key] = false;
        }
      });
      
      // Toggle current menu if not active path
      if (!location.pathname.includes(itemText.toLowerCase())) {
        newState[itemText] = !prev[itemText];
      } else {
        newState[itemText] = true; // Keep open if active
      }
      
      return newState;
    });
  };

  const drawerContent = (
    <>
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      >
        <Typography variant="h6" sx={{ color: 'var(--bg-primary)' }}>
          VillageFund
        </Typography>
      </Box>

      <List>
        {menuItems.map((item) => (
          <React.Fragment key={item.nameTH}>
            <ListItem
              component="div"
              onClick={() =>
                item.children ? handleToggle(item.text) : navigate(item.path)
              }
              className={
                location.pathname === item.path ? 'nav-item active' : 'nav-item'
              }
              sx={{
                cursor: 'pointer',
                bgcolor: location.pathname === item.path ? 'var(--hover-overlay)' : 'inherit',
                color: location.pathname === item.path ? 'var(--accent-green)' : 'inherit',
                '&:hover': {
                  bgcolor: 'var(--hover-overlay)',
                  color: 'var(--accent-blue)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    location.pathname === item.path
                      ? 'var(--accent-green)'
                      : 'inherit',
                }}
              >
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.nameTH} />
              {item.children && (
                openMenus[item.text] ? <ExpandLess /> : <ExpandMore />
              )}
            </ListItem>

            {item.children && (
              <Collapse in={openMenus[item.text]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItem
                      key={child.nameTH}
                      onClick={() => navigate(child.path)}
                      sx={{
                        pl: 4,
                        cursor: 'pointer',
                        bgcolor: location.pathname === child.path ? 'var(--hover-overlay)' : 'inherit',
                        color: location.pathname === child.path ? 'var(--accent-green)' : 'inherit',
                        '&:hover': {
                          bgcolor: 'var(--hover-overlay)',
                          color: 'var(--accent-blue)',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color:
                            location.pathname === child.path
                              ? 'var(--accent-green)'
                              : 'inherit',
                        }}
                      >
                        <child.icon />
                      </ListItemIcon>
                      <ListItemText primary={child.nameTH} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? mobileOpen : true}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 240,
          bgcolor: 'var(--primary-dark)',
          color: 'var(--bg-primary)',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

export default Sidebar;
