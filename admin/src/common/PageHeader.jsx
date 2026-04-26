import MuiBox from '../mui/MuiBox';
import MuiTypography from '../mui/MuiTypography';

/**
 * PageHeader — page title with subtitle and optional action.
 * @param {{ title: string, subtitle?: string, action?: React.ReactNode }} props
 */
export default function PageHeader({ title, subtitle, action }) {
  return (
    <MuiBox
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <MuiBox>
        <MuiTypography variant="h2">
          {title}
        </MuiTypography>
        {subtitle && (
          <MuiTypography variant="subtitle1" sx={{ mt: 0.5 }}>
            {subtitle}
          </MuiTypography>
        )}
      </MuiBox>
      {action && <MuiBox>{action}</MuiBox>}
    </MuiBox>
  );
}
