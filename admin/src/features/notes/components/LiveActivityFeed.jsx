import { motion } from 'framer-motion';
import MuiBox from '../../../mui/MuiBox';
import MuiTypography from '../../../mui/MuiTypography';
import dayjs from 'dayjs';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ReplayIcon from '@mui/icons-material/Replay';
import ScheduleIcon from '@mui/icons-material/Schedule';
import BlockIcon from '@mui/icons-material/Block';

const eventIcons = {
  queued: <ScheduleIcon sx={{ fontSize: 16, color: '#7c6ff7' }} />,
  delivered: <CheckCircleIcon sx={{ fontSize: 16, color: '#639922' }} />,
  failed: <ErrorIcon sx={{ fontSize: 16, color: '#E24B4A' }} />,
  retry: <ReplayIcon sx={{ fontSize: 16, color: '#EF9F27' }} />,
  dead: <BlockIcon sx={{ fontSize: 16, color: '#6b7280' }} />,
};

/**
 * LiveActivityFeed — scrolling list of recent system events.
 * @param {{ events: Array<{ type: string, message: string, time: string }> }} props
 */
export default function LiveActivityFeed({ events = [] }) {
  return (
    <MuiBox sx={{ maxHeight: 500, overflow: 'auto', pr: 1, '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 } }}>
      {events.map((event, i) => (
        <motion.div
          key={`${event.time}-${i}`}
          initial={{ opacity: 0, height: 0, y: -10 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.03 }}
        >
          <MuiBox sx={{ display: 'flex', gap: 1.5, py: 1, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <MuiBox sx={{ pt: 0.25 }}>{eventIcons[event.type] || eventIcons.queued}</MuiBox>
            <MuiBox sx={{ flex: 1, minWidth: 0 }}>
              <MuiTypography variant="body2" sx={{ color: '#e4e4e7', fontSize: '0.8rem' }}>
                {event.message}
              </MuiTypography>
              <MuiTypography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem' }}>
                {dayjs(event.time).format('h:mm:ss A')}
              </MuiTypography>
            </MuiBox>
          </MuiBox>
        </motion.div>
      ))}
      {events.length === 0 && (
        <MuiTypography variant="body2" sx={{ color: '#6b7280', py: 4, textAlign: 'center' }}>
          No activity yet
        </MuiTypography>
      )}
    </MuiBox>
  );
}
