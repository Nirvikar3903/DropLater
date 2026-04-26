import MuiBox from '../mui/MuiBox';
import MuiTypography from '../mui/MuiTypography';
import InboxIcon from '@mui/icons-material/Inbox';

/**
 * EmptyState — placeholder shown when a table or list has no results.
 * @param {{ message?: string, icon?: React.ReactNode }} props
 */
export default function EmptyState({ message = 'No notes found', icon }) {
  return (
    <MuiBox
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        opacity: 0.5,
      }}
    >
      {icon || <InboxIcon sx={{ fontSize: 56, color: '#6b7280', mb: 2 }} />}
      <MuiTypography variant="subtitle1" sx={{ color: '#6b7280' }}>
        {message}
      </MuiTypography>
    </MuiBox>
  );
}
