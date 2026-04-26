import { motion } from 'framer-motion';
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MuiBox from '../mui/MuiBox';

/**
 * ThemeToggle — a beautiful, animated toggle for switching between light and dark modes.
 * Uses Framer Motion for smooth icon transitions.
 */
export default function ThemeToggle({ mode, onToggle }) {
  const isDark = mode === 'dark';

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <IconButton
        onClick={onToggle}
        sx={{
          color: isDark ? '#EF9F27' : '#7c6ff7',
          backgroundColor: isDark ? 'rgba(239,159,39,0.08)' : 'rgba(124,111,247,0.08)',
          '&:hover': {
            backgroundColor: isDark ? 'rgba(239,159,39,0.15)' : 'rgba(124,111,247,0.15)',
          },
        }}
      >
        <motion.div
          key={mode}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {isDark ? <LightModeIcon sx={{ fontSize: 20 }} /> : <DarkModeIcon sx={{ fontSize: 20 }} />}
        </motion.div>
      </IconButton>
    </motion.div>
  );
}
