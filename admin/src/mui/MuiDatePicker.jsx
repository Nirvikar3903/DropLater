import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTheme } from '@mui/material/styles';

/**
 * MuiDatePicker — a themed wrapper for MUI X DatePicker.
 */
export default function MuiDatePicker({ label, value, onChange, ...props }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
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
              '& .MuiPickersArrowSwitcher-root': { display: 'none' },
            },
          },
        }}
        {...props}
      />
    </LocalizationProvider>
  );
}
