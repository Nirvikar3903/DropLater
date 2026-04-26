import { motion } from 'framer-motion';
import MuiBox from '../../../mui/MuiBox';
import MuiTypography from '../../../mui/MuiTypography';
import MuiDivider from '../../../mui/MuiDivider';
import MuiChip from '../../../mui/MuiChip';


/**
 * NoteExpandedPanel — inline expanded details for a note row.
 * @param {{ note: object }} props
 */
export default function NoteExpandedPanel({ note }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
    >
      <MuiBox
        sx={{
          p: 2.5,
          backgroundColor: 'rgba(124,111,247,0.04)',
          borderLeft: '3px solid #7c6ff7',
          borderRadius: '0 0 8px 8px',
        }}
      >
        <MuiBox sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <MuiBox sx={{ flex: 1, minWidth: 200 }}>
            <MuiTypography variant="subtitle2" sx={{ mb: 0.5 }}>
              Full Body
            </MuiTypography>
            <MuiTypography variant="body2" sx={{ color: '#e4e4e7', whiteSpace: 'pre-wrap' }}>
              {note.body}
            </MuiTypography>
          </MuiBox>
          <MuiBox sx={{ minWidth: 200 }}>
            <MuiTypography variant="subtitle2" sx={{ mb: 0.5 }}>
              Webhook URL
            </MuiTypography>
            <MuiTypography
              variant="body2"
              sx={{ fontFamily: 'monospace', color: '#7c6ff7', wordBreak: 'break-all' }}
            >
              {note.webhookUrl}
            </MuiTypography>

            <MuiDivider sx={{ my: 1.5 }} />

            <MuiTypography variant="subtitle2" sx={{ mb: 0.5 }}>
              Details
            </MuiTypography>
            <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <MuiTypography variant="caption">
                <strong>ID:</strong>{' '}
                <span style={{ fontFamily: 'monospace', color: '#9ca3af' }}>{note._id}</span>
              </MuiTypography>
              <MuiTypography variant="caption">
                <strong>Created:</strong> {note.formattedCreatedAt}
              </MuiTypography>
              <MuiTypography variant="caption">
                <strong>Release:</strong> {note.formattedReleaseAt}
              </MuiTypography>
              <MuiTypography variant="caption">
                <strong>Attempts:</strong> {note.attemptCount || 0}
              </MuiTypography>
              {note.nextRetryAt && (
                <MuiTypography variant="caption">
                  <strong>Next retry:</strong> {note.nextRetryAt}
                </MuiTypography>
              )}
            </MuiBox>
          </MuiBox>
        </MuiBox>
      </MuiBox>
    </motion.div>
  );
}
