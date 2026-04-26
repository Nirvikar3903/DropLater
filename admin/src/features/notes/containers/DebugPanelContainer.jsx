import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetNoteByIdQuery } from '../notesApi';
import MuiBox from '../../../mui/MuiBox';
import MuiTypography from '../../../mui/MuiTypography';
import MuiButton from '../../../mui/MuiButton';
import MuiTextField from '../../../mui/MuiTextField';
import MuiCard, { CardContent } from '../../../mui/MuiCard';
import MuiSkeleton from '../../../mui/MuiSkeleton';
import StatusBadge from '../../../common/StatusBadge';
import AttemptTimeline from '../components/AttemptTimeline';
import ReplayButtonContainer from './ReplayButtonContainer';
import dayjs from 'dayjs';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function DebugPanelContainer() {
  const { id: routeId } = useParams();
  const [inputId, setInputId] = useState(routeId || '');
  const [activeId, setActiveId] = useState(routeId || '');
  const [showRaw, setShowRaw] = useState(false);

  const { data: note, isLoading, isError } = useGetNoteByIdQuery(activeId, { skip: !activeId });

  const handleSearch = () => setActiveId(inputId.trim());

  return (
    <MuiBox>
      {!routeId && (
        <MuiBox sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <MuiTextField
            label="Note ID"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            fullWidth
            sx={{ maxWidth: 400 }}
            placeholder="Enter note ID to debug..."
          />
          <MuiButton variant="contained" onClick={handleSearch}>Load</MuiButton>
        </MuiBox>
      )}

      {isLoading && (
        <MuiBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3].map((i) => <MuiSkeleton key={i} variant="rounded" height={80} />)}
        </MuiBox>
      )}

      {!isLoading && !note && activeId && (
        <MuiTypography variant="body2" sx={{ color: '#6b7280', py: 4, textAlign: 'center' }}>
          Note not found. Check the ID and try again.
        </MuiTypography>
      )}

      {note && (
        <>
          {/* Note details */}
          <MuiCard sx={{ mb: 3, border: '1px solid rgba(124,111,247,0.15)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <MuiTypography variant="h4" sx={{ color: '#e4e4e7' }}>{note.title}</MuiTypography>
                  <StatusBadge status={note.status} />
                </MuiBox>
                <ReplayButtonContainer noteId={note._id} status={note.status} />
              </MuiBox>
              <MuiTypography variant="body2" sx={{ color: '#9ca3af', mb: 2 }}>{note.body}</MuiTypography>
              <MuiBox sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <MuiBox>
                  <MuiTypography variant="caption" sx={{ color: '#6b7280' }}>ID</MuiTypography>
                  <MuiTypography variant="body2" sx={{ fontFamily: 'monospace', color: '#7c6ff7' }}>{note._id}</MuiTypography>
                </MuiBox>
                <MuiBox>
                  <MuiTypography variant="caption" sx={{ color: '#6b7280' }}>Webhook</MuiTypography>
                  <MuiTypography variant="body2" sx={{ fontFamily: 'monospace', color: '#9ca3af' }}>{note.webhookUrl}</MuiTypography>
                </MuiBox>
                <MuiBox>
                  <MuiTypography variant="caption" sx={{ color: '#6b7280' }}>Release At</MuiTypography>
                  <MuiTypography variant="body2">{note.formattedReleaseAt}</MuiTypography>
                </MuiBox>
                <MuiBox>
                  <MuiTypography variant="caption" sx={{ color: '#6b7280' }}>Attempts</MuiTypography>
                  <MuiTypography variant="body2">{note.attemptCount}</MuiTypography>
                </MuiBox>
              </MuiBox>
            </CardContent>
          </MuiCard>

          {/* Attempt timeline */}
          <MuiTypography variant="h5" sx={{ color: '#e4e4e7', mb: 2 }}>Delivery Timeline</MuiTypography>
          <AttemptTimeline attempts={note.attempts} webhookUrl={note.webhookUrl} status={note.status} />

          {/* Raw JSON */}
          <MuiBox sx={{ mt: 4 }}>
            <MuiButton
              variant="outlined"
              size="small"
              onClick={() => setShowRaw(!showRaw)}
              endIcon={showRaw ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ mb: 1 }}
            >
              {showRaw ? 'Hide' : 'Show'} Raw JSON
            </MuiButton>
            {showRaw && (
              <MuiBox sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', overflow: 'auto', maxHeight: 400 }}>
                <pre style={{ margin: 0, color: '#9ca3af', fontSize: '0.75rem', fontFamily: '"JetBrains Mono", monospace' }}>
                  {JSON.stringify(note, null, 2)}
                </pre>
              </MuiBox>
            )}
          </MuiBox>
        </>
      )}
    </MuiBox>
  );
}
