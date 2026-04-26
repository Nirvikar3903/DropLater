import MuiBox from '../../../mui/MuiBox';
import MuiTextField from '../../../mui/MuiTextField';
import MuiTypography from '../../../mui/MuiTypography';

/**
 * NoteFormFields — pure form field rendering (no logic).
 * @param {{ register: function, errors: object, watch: function }} props
 */
export default function NoteFormFields({ register, errors, watch }) {
  const titleValue = watch('title') || '';

  return (
    <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <MuiBox>
        <MuiTextField
          label="Title"
          fullWidth
          inputProps={{ maxLength: 100 }}
          error={!!errors.title}
          helperText={errors.title?.message}
          {...register('title', {
            required: 'Title is required',
            maxLength: { value: 100, message: 'Max 100 characters' },
          })}
        />
        <MuiTypography variant="caption" sx={{ mt: 0.5, display: 'block', textAlign: 'right' }}>
          {titleValue.length}/100
        </MuiTypography>
      </MuiBox>

      <MuiTextField
        label="Body"
        fullWidth
        multiline
        rows={4}
        error={!!errors.body}
        helperText={errors.body?.message}
        {...register('body', { required: 'Body is required' })}
      />

      <MuiTextField
        label="Release At"
        type="datetime-local"
        fullWidth
        error={!!errors.releaseAt}
        helperText={errors.releaseAt?.message}
        InputLabelProps={{ shrink: true }}
        {...register('releaseAt', {
          required: 'Release time is required',
          validate: (v) => new Date(v) > new Date() || 'Must be a future date',
        })}
      />

      <MuiTextField
        label="Webhook URL"
        fullWidth
        placeholder="http://localhost:4000/hook"
        error={!!errors.webhookUrl}
        helperText={errors.webhookUrl?.message}
        {...register('webhookUrl', {
          required: 'Webhook URL is required',
          pattern: {
            value: /^https?:\/\/.+/,
            message: 'Must be a valid URL starting with http:// or https://',
          },
        })}
      />
    </MuiBox>
  );
}
