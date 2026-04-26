import { motion } from 'framer-motion';
import { useReplayNoteMutation } from '../notesApi';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import MuiButton from '../../../mui/MuiButton';
import MuiBox from '../../../mui/MuiBox';
import MuiTypography from '../../../mui/MuiTypography';
import ReplayIcon from '@mui/icons-material/Replay';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

/**
 * ReplayButtonContainer — shows replay button for failed/dead notes with confirmation.
 */
export default function ReplayButtonContainer({ noteId, status }) {
  const [open, setOpen] = useState(false);
  const [replayNote, { isLoading }] = useReplayNoteMutation();
  const { enqueueSnackbar } = useSnackbar();

  if (status !== 'failed' && status !== 'dead') return null;

  const handleReplay = async () => {
    try {
      await replayNote(noteId).unwrap();
      enqueueSnackbar('Note requeued successfully', { variant: 'success' });
      setOpen(false);
    } catch (err) {
      enqueueSnackbar(err?.data?.message || 'Replay failed', { variant: 'error' });
    }
  };

  return (
    <>
      <motion.div whileTap={{ scale: 0.95 }}>
        <MuiButton
          variant="contained"
          color="warning"
          startIcon={<ReplayIcon />}
          onClick={() => setOpen(true)}
          disabled={isLoading}
          sx={{ fontWeight: 700 }}
        >
          Replay Note
        </MuiButton>
      </motion.div>

      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { backgroundColor: '#111318', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: '#e4e4e7' }}>Confirm Replay</DialogTitle>
        <DialogContent>
          <MuiTypography variant="body2" sx={{ color: '#9ca3af' }}>
            This will requeue the note for delivery. The status will be reset to "pending" and a new delivery attempt will be made.
          </MuiTypography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <MuiButton onClick={() => setOpen(false)} variant="outlined" size="small">Cancel</MuiButton>
          <MuiButton onClick={handleReplay} variant="contained" color="warning" size="small" disabled={isLoading}>
            {isLoading ? 'Replaying…' : 'Confirm Replay'}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
