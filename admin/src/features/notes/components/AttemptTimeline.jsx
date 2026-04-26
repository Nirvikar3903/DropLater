import { motion } from 'framer-motion';
import MuiBox from '../../../mui/MuiBox';
import MuiTypography from '../../../mui/MuiTypography';
import MuiChip from '../../../mui/MuiChip';
import dayjs from 'dayjs';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SendIcon from '@mui/icons-material/Send';

/**
 * AttemptTimeline — vertical timeline of delivery attempts.
 * @param {{ attempts: Array, webhookUrl: string, status: string }} props
 */
export default function AttemptTimeline({ attempts = [], webhookUrl, status }) {
  return (
    <MuiBox sx={{ position: 'relative', pl: 4 }}>
      {/* Vertical line */}
      <MuiBox
        sx={{
          position: 'absolute',
          left: 12,
          top: 0,
          bottom: 0,
          width: 2,
          backgroundColor: 'rgba(255,255,255,0.08)',
        }}
      />

      {attempts.map((attempt, i) => {
        const isLast = i === attempts.length - 1;
        const isDeadEnd = isLast && status === 'dead';

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <MuiBox
              sx={{
                position: 'relative',
                mb: 3,
                p: 2,
                borderRadius: 2,
                border: `1px solid ${attempt.ok ? 'rgba(99,153,34,0.3)' : 'rgba(226,75,74,0.3)'}`,
                backgroundColor: attempt.ok ? 'rgba(99,153,34,0.06)' : 'rgba(226,75,74,0.06)',
              }}
            >
              {/* Timeline dot */}
              <MuiBox
                sx={{
                  position: 'absolute',
                  left: -28,
                  top: 20,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: attempt.ok ? '#639922' : '#E24B4A',
                  border: '2px solid #111318',
                }}
              />

              <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MuiTypography variant="h6" sx={{ color: '#e4e4e7' }}>
                    Attempt #{i + 1}
                  </MuiTypography>
                  <MuiChip
                    icon={attempt.ok ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <ErrorIcon sx={{ fontSize: 14 }} />}
                    label={attempt.ok ? 'OK' : 'FAIL'}
                    size="small"
                    color={attempt.ok ? 'success' : 'error'}
                    sx={{ fontWeight: 700 }}
                  />
                </MuiBox>
                <MuiTypography variant="caption" sx={{ color: '#6b7280' }}>
                  {dayjs(attempt.at).format('MMM D, h:mm:ss A')}
                </MuiTypography>
              </MuiBox>

              <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <SendIcon sx={{ fontSize: 14, color: '#7c6ff7' }} />
                <MuiTypography variant="body2" sx={{ fontFamily: 'monospace', color: '#9ca3af', fontSize: '0.75rem' }}>
                  POST → {webhookUrl}
                </MuiTypography>
              </MuiBox>

              <MuiBox sx={{ display: 'flex', gap: 3 }}>
                <MuiTypography variant="caption">
                  Response: <strong style={{ color: attempt.ok ? '#639922' : '#E24B4A' }}>{attempt.statusCode}</strong>
                </MuiTypography>
                <MuiTypography variant="caption">
                  Duration: <strong style={{ color: '#e4e4e7' }}>{attempt.durationMs}ms</strong>
                </MuiTypography>
              </MuiBox>

              {!attempt.ok && !isLast && (
                <MuiTypography variant="caption" sx={{ mt: 1, display: 'block', color: '#EF9F27' }}>
                  ⏳ Next retry with exponential backoff ({Math.pow(5, i)}s delay)
                </MuiTypography>
              )}

              {isDeadEnd && (
                <MuiTypography variant="caption" sx={{ mt: 1, display: 'block', color: '#E24B4A', fontWeight: 600 }}>
                  ☠ No more retries — use Replay to requeue
                </MuiTypography>
              )}
            </MuiBox>
          </motion.div>
        );
      })}

      {attempts.length === 0 && (
        <MuiTypography variant="body2" sx={{ color: '#6b7280', py: 4 }}>
          No delivery attempts yet.
        </MuiTypography>
      )}
    </MuiBox>
  );
}
