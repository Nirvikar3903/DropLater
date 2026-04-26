import { useState, useEffect, useRef, useMemo } from 'react';
import { useGetNotesQuery } from '../notesApi';
import MuiBox from '../../../mui/MuiBox';
import MuiTypography from '../../../mui/MuiTypography';
import MuiChip from '../../../mui/MuiChip';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import dayjs from 'dayjs';

/**
 * LivePollContainer — wraps children with live polling state and change detection.
 */
export default function LivePollContainer({ pollingInterval = 5000, children }) {
  const { data: notes = [], isLoading, isFetching } = useGetNotesQuery({}, { pollingInterval });
  const prevDataRef = useRef([]);
  const [changedIds, setChangedIds] = useState(new Set());
  const [lastUpdated, setLastUpdated] = useState(dayjs());
  const [secondsAgo, setSecondsAgo] = useState(0);

  // Detect changed rows
  useEffect(() => {
    if (notes.length > 0 && prevDataRef.current.length > 0) {
      const changed = new Set();
      notes.forEach((note) => {
        const prev = prevDataRef.current.find((n) => n._id === note._id);
        if (prev && (prev.status !== note.status || prev.attemptCount !== note.attemptCount)) {
          changed.add(note._id);
        }
      });
      if (changed.size > 0) {
        setChangedIds(changed);
        setTimeout(() => setChangedIds(new Set()), 3000);
      }
    }
    prevDataRef.current = notes;
    setLastUpdated(dayjs());
  }, [notes]);

  // Seconds ago ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsAgo(dayjs().diff(lastUpdated, 'second'));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Derive activity events from notes
  const events = useMemo(() => {
    const evts = [];
    notes.forEach((note) => {
      evts.push({ type: 'queued', message: `"${note.title}" queued`, time: note.createdAt });
      (note.attempts || []).forEach((a) => {
        if (a.ok) {
          evts.push({ type: 'delivered', message: `"${note.title}" delivered — ${a.statusCode} OK (${a.durationMs}ms)`, time: a.at });
        } else {
          evts.push({ type: 'failed', message: `"${note.title}" attempt failed — ${a.statusCode} (${a.durationMs}ms)`, time: a.at });
        }
      });
      if (note.status === 'dead') {
        evts.push({ type: 'dead', message: `"${note.title}" marked dead after ${note.attemptCount} failures`, time: note.updatedAt });
      }
    });
    return evts.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 30);
  }, [notes]);

  // Queue counts
  const counts = useMemo(() => ({
    pending: notes.filter((n) => n.status === 'pending').length,
    delivered: notes.filter((n) => n.status === 'delivered').length,
    failed: notes.filter((n) => n.status === 'failed').length,
    dead: notes.filter((n) => n.status === 'dead').length,
  }), [notes]);

  return (
    <MuiBox>
      {/* Poll status bar */}
      <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <MuiChip
          icon={
            <FiberManualRecordIcon
              sx={{
                fontSize: 10,
                color: '#639922',
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
              }}
            />
          }
          label="Polling active"
          size="small"
          sx={{ backgroundColor: 'rgba(99,153,34,0.1)', color: '#639922', fontWeight: 600 }}
        />
        <MuiTypography variant="caption" sx={{ color: '#6b7280' }}>
          Last updated: {secondsAgo}s ago
        </MuiTypography>
        {isFetching && (
          <MuiTypography variant="caption" sx={{ color: '#7c6ff7' }}>
            Fetching…
          </MuiTypography>
        )}
      </MuiBox>

      {children({ notes, isLoading, changedIds, events, counts })}
    </MuiBox>
  );
}
