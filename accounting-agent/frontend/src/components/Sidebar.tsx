import React from 'react';
import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, Tooltip, useTheme } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Assessment as ReportIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useTheme as useAppTheme } from '../contexts/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  drawerWidth: number;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, handleDrawerToggle, drawerWidth }) => {
  const theme = useTheme();
  const { mode, toggleTheme } = useAppTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    { text: t('dashboard', 'לוח בקרה'), icon: <DashboardIcon />, path: '/' },
    { text: t('clients', 'לקוחות'), icon: <PeopleIcon />, path: '/clients' },
    { text: t('invoices', 'חשבוניות'), icon: <ReceiptIcon />, path: '/invoices' },
    { text: t('reports', 'דוחות'), icon: <ReportIcon />, path: '/reports' },
  ];

  const drawer = (
    <div>
      <DrawerHeader>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={t('settings', 'הגדרות')}>
            <IconButton color="inherit" onClick={() => alert(t('settingsComingSoon', 'הגדרות יתווספו בגרסה הבאה'))}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={mode === 'light' ? t('darkMode', 'מצב כהה') : t('lightMode', 'מצב בהיר')}>
            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
          <LanguageSwitcher />
        </Box>
        <IconButton onClick={handleDrawerToggle}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              // סגירת התפריט רק במצב נייד (מסך קטן)
              if (window.innerWidth < 600) {
                handleDrawerToggle();
              }
            }}
            selected={location.pathname === item.path}
          >
            <ListItemIcon sx={{ minWidth: '40px' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <>
      {/* תפריט למובייל - נפתח ונסגר בלחיצה */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* תפריט קבוע למסך מחשב - תמיד פתוח */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            position: 'fixed'
          },
          width: drawerWidth, // רוחב קבוע לאלמנט עצמו
          flexShrink: 0,
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;
