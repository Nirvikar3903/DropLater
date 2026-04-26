import { motion } from 'framer-motion';
import { TableRow, TableCell } from '../../../mui/MuiTable';
import MuiBox from '../../../mui/MuiBox';
import MuiTypography from '../../../mui/MuiTypography';
import MuiButton from '../../../mui/MuiButton';
import StatusBadge from '../../../common/StatusBadge';
import AttemptPills from '../../../common/AttemptPills';
import CountdownChip from '../../../common/CountdownChip';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BugReportIcon from '@mui/icons-material/BugReport';
import ReplayIcon from '@mui/icons-material/Replay';

/**
 * NoteRow — single table row for a note.
 * @param {{ note: object, index: number, isExpanded: boolean, isChanged: boolean, onToggle: function, onDebug: function, onReplay: function }} props
 */
export default function NoteRow({ note, index, isExpanded, isChanged, onToggle, onDebug, onReplay }) {
  const handleCopyId = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(note._id);
  };

  return (
    <motion.tr
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      style={{ cursor: 'pointer' }}
      onClick={onToggle}
    >
      <TableCell component="td">
        <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <MuiTypography
            variant="body2"
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.7rem',
              color: '#9ca3af',
              maxWidth: 90,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {note.displayId}
          </MuiTypography>
          <IconButton size="small" onClick={handleCopyId} sx={{ opacity: 0.4, '&:hover': { opacity: 1 } }}>
            <ContentCopyIcon sx={{ fontSize: 13 }} />
          </IconButton>
        </MuiBox>
      </TableCell>

      <TableCell component="td">
        <MuiTypography variant="body2" sx={{ fontWeight: 600, color: '#e4e4e7' }}>
          {note.title}
        </MuiTypography>
        <MuiTypography variant="caption" sx={{ color: '#6b7280', display: 'block', mt: 0.25 }}>
          {note.body?.slice(0, 50)}…
        </MuiTypography>
      </TableCell>

      <TableCell component="td">
        <StatusBadge status={note.status} />
      </TableCell>

      <TableCell component="td">
        <MuiBox>
          <MuiTypography variant="caption" sx={{ color: '#9ca3af' }}>
            {note.formattedReleaseAt}
          </MuiTypography>
          {note.status === 'pending' && (
            <MuiBox sx={{ mt: 0.5 }}>
              <CountdownChip releaseAt={note.releaseAt} />
            </MuiBox>
          )}
        </MuiBox>
      </TableCell>

      <TableCell component="td">
        <AttemptPills attempts={note.attempts} />
      </TableCell>

      <TableCell component="td">
        {note.lastAttempt ? (
          <MuiBox>
            <MuiTypography
              variant="caption"
              sx={{
                color: note.lastAttempt.ok ? '#639922' : '#E24B4A',
                fontWeight: 700,
                fontFamily: 'monospace',
              }}
            >
              {note.lastAttempt.statusCode}
            </MuiTypography>
            <MuiTypography variant="caption" sx={{ ml: 0.5, color: '#6b7280' }}>
              {note.lastAttempt.durationMs}ms
            </MuiTypography>
          </MuiBox>
        ) : (
          <MuiTypography variant="caption" sx={{ color: '#6b7280' }}>—</MuiTypography>
        )}
      </TableCell>

      <TableCell component="td">
        <MuiBox sx={{ display: 'flex', gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
          <IconButton size="small" onClick={onDebug} sx={{ color: '#7c6ff7' }}>
            <BugReportIcon sx={{ fontSize: 18 }} />
          </IconButton>
          {(note.status === 'failed' || note.status === 'dead') && (
            <IconButton size="small" onClick={onReplay} sx={{ color: '#EF9F27' }}>
              <ReplayIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
        </MuiBox>
      </TableCell>
    </motion.tr>
  );
}
