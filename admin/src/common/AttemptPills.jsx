import MuiBox from '../mui/MuiBox';
import MuiTooltip from '../mui/MuiTooltip';
import MuiTypography from '../mui/MuiTypography';

/**
 * AttemptPills — row of colored circles representing delivery attempts.
 * @param {{ attempts: Array<{ at: string, statusCode: number, ok: boolean, durationMs: number }> }} props
 */
export default function AttemptPills({ attempts = [] }) {
  const maxDisplay = 5;
  const displayed = attempts.slice(0, maxDisplay);
  const overflow = attempts.length - maxDisplay;

  return (
    <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {displayed.map((attempt, i) => (
        <MuiTooltip
          key={i}
          title={`Attempt ${i + 1}: ${attempt.statusCode} — ${attempt.durationMs}ms`}
          arrow
        >
          <MuiBox
            sx={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: attempt.ok ? '#639922' : '#E24B4A',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
              '&:hover': { transform: 'scale(1.3)' },
            }}
          />
        </MuiTooltip>
      ))}
      {overflow > 0 && (
        <MuiTypography variant="caption" sx={{ ml: 0.5, color: '#9ca3af', fontWeight: 600 }}>
          +{overflow}
        </MuiTypography>
      )}
      {attempts.length === 0 && (
        <MuiTypography variant="caption" sx={{ color: '#6b7280' }}>
          —
        </MuiTypography>
      )}
    </MuiBox>
  );
}
