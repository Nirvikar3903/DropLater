import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useGetNotesQuery, useReplayNoteMutation } from '../notesApi';
import { useSnackbar } from 'notistack';
import MuiBox from '../../../mui/MuiBox';
import MuiButton from '../../../mui/MuiButton';
import MuiTypography from '../../../mui/MuiTypography';
import Table, { TableBody, TableCell, TableContainer, TableHead, TableRow } from '../../../mui/MuiTable';
import NoteRow from '../components/NoteRow';
import NoteExpandedPanel from '../components/NoteExpandedPanel';
import LoadingRow from '../../../common/LoadingRow';
import EmptyState from '../../../common/EmptyState';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const statuses = ['all', 'pending', 'delivered', 'failed', 'dead'];

export default function NotesTableContainer({ pollingInterval }) {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const params = useMemo(() => {
    const p = { limit: 20, page: page + 1 };
    if (filter !== 'all') p.status = filter;
    return p;
  }, [filter, page]);

  const { data: notes = [], isLoading } = useGetNotesQuery(params, {
    pollingInterval: pollingInterval || undefined,
  });

  const [replayNote] = useReplayNoteMutation();

  const handleReplay = async (id) => {
    try {
      await replayNote(id).unwrap();
      enqueueSnackbar('Note requeued successfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err?.data?.message || 'Replay failed', { variant: 'error' });
    }
  };

  return (
    <MuiBox>
      <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <ToggleButtonGroup value={filter} exclusive onChange={(_, v) => v && setFilter(v)} size="small">
          {statuses.map((s) => (
            <ToggleButton key={s} value={s} sx={{ textTransform: 'capitalize', px: 2, fontSize: '0.75rem', fontWeight: 600 }}>
              {s}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </MuiBox>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Release At</TableCell>
              <TableCell>Attempts</TableCell>
              <TableCell>Last</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody component="tbody">
            {isLoading && Array.from({ length: 5 }).map((_, i) => <LoadingRow key={i} />)}
            {!isLoading && notes.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyState message={filter === 'all' ? 'No notes found' : `No ${filter} notes`} />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && notes.map((note, i) => (
              <AnimatePresence key={note._id}>
                <NoteRow
                  note={note}
                  index={i}
                  isExpanded={expandedId === note._id}
                  isChanged={false}
                  onToggle={() => setExpandedId(expandedId === note._id ? null : note._id)}
                  onDebug={() => navigate(`/debug/${note._id}`)}
                  onReplay={() => handleReplay(note._id)}
                />
                {expandedId === note._id && (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ p: 0 }}>
                      <NoteExpandedPanel note={note} />
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {notes.length > 0 && (
        <MuiBox sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
          <MuiButton size="small" disabled={page === 0} onClick={() => setPage(page - 1)} variant="outlined">
            Previous
          </MuiButton>
          <MuiButton size="small" onClick={() => setPage(page + 1)} variant="outlined">
            Next
          </MuiButton>
        </MuiBox>
      )}
    </MuiBox>
  );
}
