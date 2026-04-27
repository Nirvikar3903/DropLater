import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useTheme } from '@mui/material/styles';
import MuiBox from './MuiBox';

/**
 * MuiDateTimePicker — a themed wrapper for MUI X DateTimePicker.
 * It ensures the picker matches our dark/light theme tokens perfectly.
 */
export default function MuiDateTimePicker({ label, value, onChange, ...props }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={label}
        value={value}
        onChange={onChange}
        slotProps={{
          textField: {
            size: 'small',
            fullWidth: true,
            variant: 'outlined',
            sx: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 10,
                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
              },
            },
          },
          desktopPaper: {
            sx: {
              backgroundColor: theme.palette.background.paper,
              backgroundImage: 'none',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.1)',
              '& .MuiPickersDay-root': {
                borderRadius: 1.5,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                },
              },
            },
          },
        }}
        {...props}
      />
    </LocalizationProvider>
  );
}
