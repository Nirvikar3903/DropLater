import MuiCard, { CardContent } from '../mui/MuiCard';
import MuiTypography from '../mui/MuiTypography';
import MuiBox from '../mui/MuiBox';

/**
 * SectionCard — titled card wrapper with optional action.
 * @param {{ title: string, action?: React.ReactNode, children: React.ReactNode, sx?: object }} props
 */
export default function SectionCard({ title, action, children, sx = {} }) {
  return (
    <MuiCard sx={{ ...sx }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        {(title || action) && (
          <MuiBox
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            {title && (
              <MuiTypography variant="h5">
                {title}
              </MuiTypography>
            )}
            {action && <MuiBox>{action}</MuiBox>}
          </MuiBox>
        )}
        {children}
      </CardContent>
    </MuiCard>
  );
}
