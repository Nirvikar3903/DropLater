import { Controller } from 'react-hook-form';
import MuiBox from '../../../mui/MuiBox';
import MuiTextField from '../../../mui/MuiTextField';
import MuiTypography from '../../../mui/MuiTypography';
import MuiDatePicker from '../../../mui/MuiDatePicker';
import MuiTimePicker from '../../../mui/MuiTimePicker';
import dayjs from 'dayjs';

/**
 * NoteFormFields — rendered with separate Date and Time pickers.
 * @param {{ control: object, register: function, errors: object, watch: function, setValue: function }} props
 */
export default function NoteFormFields({ control, register, errors, watch, setValue }) {
  const titleValue = watch('title') || '';
  const releaseAt = watch('releaseAt');

  // Helper to handle combined updates
  const handleDateChange = (newDate) => {
    if (!newDate) return;
    const current = dayjs(releaseAt || dayjs());
    const updated = current
      .year(newDate.year())
      .month(newDate.month())
      .date(newDate.date());
    setValue('releaseAt', updated.toISOString());
  };

  const handleTimeChange = (newTime) => {
    if (!newTime) return;
    const current = dayjs(releaseAt || dayjs());
    const updated = current
      .hour(newTime.hour())
      .minute(newTime.minute())
      .second(0);
    setValue('releaseAt', updated.toISOString());
  };

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
        <MuiTypography variant="caption" sx={{ mt: 0.5, display: 'block', textAlign: 'right', color: 'text.secondary' }}>
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

      <MuiBox sx={{ display: 'flex', gap: 2 }}>
        <MuiBox sx={{ flex: 1 }}>
          <MuiDatePicker
            label="Release Date"
            value={releaseAt ? dayjs(releaseAt) : null}
            onChange={handleDateChange}
            slotProps={{
              textField: {
                error: !!errors.releaseAt,
              },
            }}
          />
        </MuiBox>
        <MuiBox sx={{ flex: 1 }}>
          <MuiTimePicker
            label="Release Time"
            value={releaseAt ? dayjs(releaseAt) : null}
            onChange={handleTimeChange}
            slotProps={{
              textField: {
                error: !!errors.releaseAt,
                helperText: errors.releaseAt?.message,
              },
            }}
          />
        </MuiBox>
      </MuiBox>

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

      {/* Hidden input to handle validation via react-hook-form */}
      <input
        type="hidden"
        {...register('releaseAt', {
          required: 'Release date/time is required',
          validate: (v) => dayjs(v).isAfter(dayjs()) || 'Must be a future date',
        })}
      />
    </MuiBox>
  );
}
