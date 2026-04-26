import { motion } from 'framer-motion';
import MuiChip from '../mui/MuiChip';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BlockIcon from '@mui/icons-material/Block';

const statusConfig = {
  pending: {
    color: 'warning',
    icon: <AccessTimeIcon sx={{ fontSize: 14 }} />,
    label: 'Pending',
  },
  delivered: {
    color: 'success',
    icon: <CheckCircleIcon sx={{ fontSize: 14 }} />,
    label: 'Delivered',
  },
  failed: {
    color: 'error',
    icon: <WarningAmberIcon sx={{ fontSize: 14 }} />,
    label: 'Failed',
  },
  dead: {
    color: 'default',
    icon: <BlockIcon sx={{ fontSize: 14 }} />,
    label: 'Dead',
  },
};

/**
 * StatusBadge — colored chip for note status.
 * @param {{ status: 'pending'|'delivered'|'failed'|'dead' }} props
 */
import { useTheme } from '@mui/material/styles';

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending;
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <motion.div layoutId={`status-${status}`} style={{ display: 'inline-flex' }}>
      <MuiChip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
        variant="filled"
        sx={{
          fontWeight: 700,
          letterSpacing: '0.03em',
          ...(status === 'dead' && {
            backgroundColor: isDark ? 'rgba(107,114,128,0.25)' : 'rgba(107,114,128,0.15)',
            color: theme.palette.text.secondary,
          }),
        }}
      />
    </motion.div>
  );
}
