import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import MuiChip from '../mui/MuiChip';
import TimerIcon from '@mui/icons-material/Timer';

/**
 * CountdownChip — live countdown to releaseAt time.
 * @param {{ releaseAt: string }} props
 */
export default function CountdownChip({ releaseAt }) {
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(interval);
  }, []);

  const release = dayjs(releaseAt);
  const diff = release.diff(now, 'second');
  const isFuture = diff > 0;

  const absDiff = Math.abs(diff);
  const hours = Math.floor(absDiff / 3600);
  const minutes = Math.floor((absDiff % 3600) / 60);
  const seconds = absDiff % 60;

  let label;
  if (hours > 0) {
    label = `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    label = `${minutes}m ${seconds}s`;
  } else {
    label = `${seconds}s`;
  }

  if (isFuture) {
    return (
      <MuiChip
        icon={<TimerIcon sx={{ fontSize: 14 }} />}
        label={`fires in ${label}`}
        size="small"
        sx={{
          backgroundColor: 'rgba(239,159,39,0.15)',
          color: '#EF9F27',
          fontWeight: 600,
          fontSize: '0.7rem',
        }}
      />
    );
  }

  return (
    <MuiChip
      icon={<TimerIcon sx={{ fontSize: 14 }} />}
      label={`overdue ${label}`}
      size="small"
      sx={{
        backgroundColor: 'rgba(226,75,74,0.15)',
        color: '#E24B4A',
        fontWeight: 600,
        fontSize: '0.7rem',
        animation: 'pulse 2s ease-in-out infinite',
        '@keyframes pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      }}
    />
  );
}
