import { useLocation } from 'react-router-dom';
import MuiBox from '../mui/MuiBox';
import MuiTypography from '../mui/MuiTypography';
import MuiChip from '../mui/MuiChip';
import { useGetNotesWithFallback } from '../features/notes/notesApi';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';

const pageTitles = {
  '/': 'Dashboard',
  '/create': 'Create Note',
  '/live': 'Live Monitor',
  '/debug': 'Debug Panel',
  '/system': 'System Flow',
};

export default function Topbar({ pollInterval, onPollIntervalChange }) {
  const location = useLocation();
  const { data: notes = [] } = useGetNotesWithFallback({});
  const pendingCount = notes.filter((n) => n.status === 'pending').length;

  const pathKey = Object.keys(pageTitles).find((key) =>
    key === '/' ? location.pathname === '/' : location.pathname.startsWith(key)
  );
  const title = pageTitles[pathKey] || 'DropLater';

  return (
    <MuiBox
      sx={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: '#0d0f14',
      }}
    >
      <MuiTypography variant="h5" sx={{ color: '#e4e4e7', fontWeight: 700 }}>
        {title}
      </MuiTypography>

      <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MuiTypography variant="caption" sx={{ color: '#6b7280' }}>Poll:</MuiTypography>
          <Select
            value={pollInterval}
            onChange={(e) => onPollIntervalChange(e.target.value)}
            size="small"
            sx={{ fontSize: '0.75rem', height: 30, '& .MuiSelect-select': { py: 0.5 } }}
          >
            <MenuItem value={5000}>5s</MenuItem>
            <MenuItem value={10000}>10s</MenuItem>
            <MenuItem value={30000}>30s</MenuItem>
            <MenuItem value={0}>Off</MenuItem>
          </Select>
        </MuiBox>

        {pendingCount > 0 && (
          <MuiChip
            icon={<NotificationsIcon sx={{ fontSize: 16 }} />}
            label={`${pendingCount} pending`}
            size="small"
            sx={{ backgroundColor: 'rgba(239,159,39,0.12)', color: '#EF9F27', fontWeight: 600 }}
          />
        )}
      </MuiBox>
    </MuiBox>
  );
}
