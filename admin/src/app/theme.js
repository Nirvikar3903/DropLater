import { createTheme } from '@mui/material/styles';

/**
 * getTheme — creates a customized MUI theme based on the mode (light/dark).
 * All global styles from index.css are now moved here into styleOverrides.
 */
export const getTheme = (mode) => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      background: {
        default: isDark ? '#0a0c10' : '#f8f9fa',
        paper: isDark ? '#111318' : '#ffffff',
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
      },
      warning: {
        main: '#EF9F27',
      },
      success: {
        main: '#639922',
      },
      text: {
        primary: isDark ? '#e4e4e7' : '#1a1d24',
        secondary: isDark ? '#9ca3af' : '#6b7280',
        disabled: isDark ? '#6b7280' : '#9ca3af',
      },
      divider: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.02em' },
      h2: { fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.01em' },
      h3: { fontWeight: 600, fontSize: '1.25rem' },
      h4: { fontWeight: 600, fontSize: '1.125rem' },
      h5: { fontWeight: 600, fontSize: '1rem' },
      h6: { fontWeight: 600, fontSize: '0.875rem' },
      subtitle1: { fontWeight: 500, fontSize: '0.875rem' },
      subtitle2: { fontWeight: 500, fontSize: '0.75rem' },
      body1: { fontSize: '0.875rem', lineHeight: 1.6 },
      body2: { fontSize: '0.8125rem', lineHeight: 1.5 },
      caption: { fontSize: '0.75rem' },
      button: { fontWeight: 600, textTransform: 'none', fontSize: '0.875rem' },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body, #root {
            height: 100%;
            width: 100%;
            font-family: 'Inter', sans-serif;
            -webkit-font-smoothing: antialiased;
            background-color: ${isDark ? '#0a0c10' : '#f8f9fa'};
            color: ${isDark ? '#e4e4e7' : '#1a1d24'};
            transition: background-color 0.3s ease, color 0.3s ease;
          }
          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
            border-radius: 3px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
          }
          ::selection {
            background: rgba(124, 111, 247, 0.3);
            color: #fff;
          }
          :focus-visible {
            outline: 2px solid rgba(124, 111, 247, 0.5);
            outline-offset: 2px;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `,
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.05)',
            borderRadius: 12,
            backgroundColor: isDark ? '#111318' : '#ffffff',
            boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
          },
        },
        defaultProps: { elevation: 0 },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
            padding: '10px 16px',
          },
          head: {
            fontWeight: 700,
            color: isDark ? '#9ca3af' : '#6b7280',
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
              borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
            },
          },
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
              boxShadow: isDark ? '0 4px 12px rgba(124,111,247,0.3)' : '0 4px 12px rgba(124,111,247,0.2)',
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isDark ? '#1a1d24' : '#ffffff',
            color: isDark ? '#e4e4e7' : '#1a1d24',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
          },
        },
      },
    },
  });
};

export default getTheme('dark');
