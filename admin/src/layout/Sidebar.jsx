import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MuiBox from '../mui/MuiBox';
import MuiTypography from '../mui/MuiTypography';
import MuiDivider from '../mui/MuiDivider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import BugReportIcon from '@mui/icons-material/BugReport';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';

const navItems = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Create Note', path: '/create', icon: <AddCircleIcon /> },
  {
    label: 'Live Monitor',
    path: '/live',
    icon: (
      <FiberManualRecordIcon
        sx={{
          fontSize: 16,
          color: '#639922',
          animation: 'pulse 1.5s ease-in-out infinite',
          '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
        }}
      />
    ),
  },
  { label: 'Debug Panel', path: '/debug', icon: <BugReportIcon /> },
  { label: 'System Flow', path: '/system', icon: <AccountTreeIcon /> },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [apiOnline, setApiOnline] = useState(false);
  const [sinkOnline, setSinkOnline] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/health');
        setApiOnline(res.ok);
      } catch { setApiOnline(false); }
      try {
        const res = await fetch('/sink-health');
        setSinkOnline(res.ok);
      } catch { setSinkOnline(false); }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const width = collapsed ? 64 : 240;

  return (
    <MuiBox
      sx={{
        width,
        minHeight: '100vh',
        backgroundColor: isDark ? '#0d0f14' : '#ffffff',
        borderRight: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease, background-color 0.3s ease',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1200,
      }}
    >
      {/* Logo */}
      <MuiBox sx={{ px: collapsed ? 1 : 2.5, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {!collapsed && (
          <MuiTypography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            <span style={{ color: theme.palette.text.primary }}>Drop</span>
            <span style={{ color: '#7c6ff7' }}>Later</span>
            {!collapsed && <span style={{ color: theme.palette.text.disabled, fontSize: '0.6rem', marginLeft: 6, fontWeight: 400 }}>admin</span>}
          </MuiTypography>
        )}
        <IconButton size="small" onClick={onToggle} sx={{ color: theme.palette.text.disabled }}>
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </MuiBox>

      <MuiDivider />

      {/* Nav items */}
      <List sx={{ flex: 1, px: 1, pt: 1 }}>
        {navItems.map((item) => {
          const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                px: collapsed ? 1.5 : 2,
                minHeight: 44,
                justifyContent: collapsed ? 'center' : 'flex-start',
                backgroundColor: isActive ? 'rgba(124,111,247,0.1)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(124,111,247,0.08)' },
              }}
            >
              <ListItemIcon sx={{ color: isActive ? '#7c6ff7' : theme.palette.text.disabled, minWidth: collapsed ? 0 : 36 }}>
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? theme.palette.text.primary : theme.palette.text.secondary,
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      <MuiDivider />

      {/* Status indicators */}
      {!collapsed && (
        <MuiBox sx={{ px: 2.5, py: 2 }}>
          <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <MuiBox sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: apiOnline ? '#639922' : '#E24B4A' }} />
            <MuiTypography variant="caption" sx={{ color: theme.palette.text.disabled }}>
              API {apiOnline ? 'online' : 'offline'}
            </MuiTypography>
          </MuiBox>
          <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MuiBox sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: sinkOnline ? '#639922' : '#E24B4A' }} />
            <MuiTypography variant="caption" sx={{ color: theme.palette.text.disabled }}>
              Sink {sinkOnline ? 'online' : 'offline'}
            </MuiTypography>
          </MuiBox>
        </MuiBox>
      )}
    </MuiBox>
  );
}
