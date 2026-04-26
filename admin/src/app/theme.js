import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0a0c10',
      paper: '#111318',
    },
    primary: {
      main: '#7c6ff7',
      light: '#9d93f9',
      dark: '#5a4fd4',
    },
    secondary: {
      main: '#1D9E75',
      light: '#2bc48f',
      dark: '#167a5a',
    },
    error: {
      main: '#E24B4A',
      light: '#ef7070',
      dark: '#c73635',
    },
    warning: {
      main: '#EF9F27',
      light: '#f5b954',
      dark: '#c97d10',
    },
    success: {
      main: '#639922',
      light: '#7db83a',
      dark: '#4a7618',
    },
    text: {
      primary: '#e4e4e7',
      secondary: '#9ca3af',
      disabled: '#6b7280',
    },
    divider: 'rgba(255,255,255,0.07)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.01em' },
    h3: { fontWeight: 600, fontSize: '1.25rem' },
    h4: { fontWeight: 600, fontSize: '1.125rem' },
    h5: { fontWeight: 600, fontSize: '1rem' },
    h6: { fontWeight: 600, fontSize: '0.875rem' },
    subtitle1: { fontWeight: 500, fontSize: '0.875rem', color: '#9ca3af' },
    subtitle2: { fontWeight: 500, fontSize: '0.75rem', color: '#6b7280' },
    body1: { fontSize: '0.875rem', lineHeight: 1.6 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', color: '#6b7280' },
    button: { fontWeight: 600, textTransform: 'none', fontSize: '0.875rem' },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12,
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td, &:last-child th': {
            borderBottom: 0,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          padding: '10px 16px',
          fontSize: '0.8125rem',
        },
        head: {
          fontWeight: 600,
          color: '#9ca3af',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.12)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.25)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 20px',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(124,111,247,0.3)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.75rem',
          height: 26,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1a1d24',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '0.75rem',
          borderRadius: 8,
          padding: '6px 12px',
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255,255,255,0.06)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255,255,255,0.07)',
        },
      },
    },
  },
});

export default theme;
