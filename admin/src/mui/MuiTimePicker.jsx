import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { useTheme } from '@mui/material/styles';

/**
 * MuiTimePicker — A premium, mobile-style clock picker that matches the alarm clock interface.
 * It uses the MobileTimePicker to ensure the "Clock Dial" and "Digital readout" 
 * look exactly like a mobile phone's alarm setting.
 */
export default function MuiTimePicker({ label, value, onChange, ...props }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileTimePicker
        label={label}
        value={value}
        onChange={onChange}
        ampm={true}
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
          // Customize the picker layout/dialog
          dialog: {
            sx: {
              '& .MuiPaper-root': {
                borderRadius: 4,
                backgroundColor: isDark ? '#1a1d24' : '#ffffff',
                border: `1px solid ${theme.palette.divider}`,
                backgroundImage: 'none',
              },
              // Style the clock dial
              '& .MuiPickersLayout-root': {
                backgroundColor: 'transparent',
                '& .MuiPickersArrowSwitcher-root': { display: 'none' },
              },
              '& .MuiTimeClock-root': {
                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                borderRadius: '50%',
                margin: 2,
              },
              // Style the digital readout (the numbers at the top)
              '& .MuiMultiSectionDigitalClock-root': {
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
              '& .MuiPickersToolbar-root': {
                backgroundColor: isDark ? '#111318' : '#f8f9fa',
              },
              // Buttons at the bottom
              '& .MuiDialogActions-root': {
                padding: 2,
                '& .MuiButton-root': {
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }
              }
            },
          },
        }}
        {...props}
      />
    </LocalizationProvider>
  );
}
