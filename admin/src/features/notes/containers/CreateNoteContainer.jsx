import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateNoteMutation } from '../notesApi';
import { useSnackbar } from 'notistack';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import MuiBox from '../../../mui/MuiBox';
import MuiButton from '../../../mui/MuiButton';
import MuiTypography from '../../../mui/MuiTypography';
import MuiCard, { CardContent } from '../../../mui/MuiCard';
import NoteFormFields from '../components/NoteFormFields';
import StatusBadge from '../../../common/StatusBadge';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from '@mui/material/styles';

export default function CreateNoteContainer() {
  const theme = useTheme();
  const [showSuccess, setShowSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch, reset, control, setValue } = useForm({
    defaultValues: { title: '', body: '', releaseAt: '', webhookUrl: 'http://localhost:4000/hook' },
  });
  const [createNote, { isLoading, error }] = useCreateNoteMutation();
  const { enqueueSnackbar } = useSnackbar();

  const watched = { 
    title: watch('title'), 
    body: watch('body'), 
    releaseAt: watch('releaseAt'), 
    webhookUrl: watch('webhookUrl') 
  };

  const onSubmit = async (data) => {
    try {
      await createNote(data).unwrap();
      enqueueSnackbar(`Note scheduled for ${dayjs(data.releaseAt).format('MMM D, h:mm A')}`, { variant: 'success' });
      setShowSuccess(true);
    } catch (err) {
      enqueueSnackbar(err?.data?.message || 'Failed to create note', { variant: 'error' });
    }
  };

  const handleCreateAnother = () => { reset(); setShowSuccess(false); };

  if (showSuccess) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <MuiBox sx={{ textAlign: 'center', py: 6 }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <MuiTypography variant="h3" sx={{ color: 'text.primary', mb: 1 }}>Note Scheduled!</MuiTypography>
          <MuiTypography variant="subtitle1" sx={{ mb: 3 }}>Your note has been queued for delivery.</MuiTypography>
          <MuiButton variant="contained" onClick={handleCreateAnother}>Create Another</MuiButton>
        </MuiBox>
      </motion.div>
    );
  }

  return (
    <MuiBox sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
      <MuiBox sx={{ flex: 1, maxWidth: 600 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <NoteFormFields 
            control={control} 
            register={register} 
            errors={errors} 
            watch={watch} 
            setValue={setValue} 
          />
          {error && (
            <MuiTypography variant="body2" sx={{ color: 'error.main', mt: 2 }}>
              {error?.data?.message || 'An error occurred'}
            </MuiTypography>
          )}
          <MuiButton type="submit" variant="contained" fullWidth disabled={isLoading} sx={{ mt: 3, py: 1.25 }}>
            {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Schedule Note'}
          </MuiButton>
        </form>
      </MuiBox>

      {/* Live preview */}
      <MuiBox sx={{ flex: 1, maxWidth: 400 }}>
        <MuiTypography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Live Preview</MuiTypography>
        <MuiCard sx={{ border: `1px solid ${theme.palette.primary.main}33` }}>
          <CardContent>
            <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <MuiTypography variant="h6" sx={{ color: 'text.primary' }}>{watched.title || 'Untitled Note'}</MuiTypography>
              <StatusBadge status="pending" />
            </MuiBox>
            <MuiTypography variant="body2" sx={{ color: 'text.secondary', mb: 1.5, whiteSpace: 'pre-wrap' }}>
              {watched.body || 'Note body will appear here...'}
            </MuiTypography>
            <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <MuiTypography variant="caption" sx={{ color: 'text.secondary' }}>
                Release: {watched.releaseAt ? dayjs(watched.releaseAt).format('MMM D, YYYY h:mm A') : '—'}
              </MuiTypography>
              <MuiTypography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main', wordBreak: 'break-all' }}>
                {watched.webhookUrl || '—'}
              </MuiTypography>
            </MuiBox>
          </CardContent>
        </MuiCard>
      </MuiBox>
    </MuiBox>
  );
}
