import { motion } from 'framer-motion';
import { useMemo } from 'react';
import MuiBox from '../mui/MuiBox';
import PageHeader from '../common/PageHeader';
import MetricCard from '../common/MetricCard';
import SectionCard from '../common/SectionCard';
import NotesTableContainer from '../features/notes/containers/NotesTableContainer';
import { useGetNotesQuery } from '../features/notes/notesApi';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

export default function DashboardPage() {
  const { data: notes = [] } = useGetNotesQuery({});

  const metrics = useMemo(() => ({
    total: notes.length,
    pending: notes.filter((n) => n.status === 'pending').length,
    delivered: notes.filter((n) => n.status === 'delivered').length,
    deadFailed: notes.filter((n) => n.status === 'dead' || n.status === 'failed').length,
  }), [notes]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <PageHeader title="Dashboard" subtitle="Overview of all scheduled webhook deliveries" />

      <MuiBox sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <MetricCard label="Total Notes" value={metrics.total} color="#7c6ff7" icon={<NotificationsActiveIcon />} />
        <MetricCard label="Pending in Queue" value={metrics.pending} color="#EF9F27" icon={<ScheduleIcon />} />
        <MetricCard label="Delivered (24h)" value={metrics.delivered} color="#639922" icon={<CheckCircleIcon />} />
        <MetricCard label="Dead / Failed" value={metrics.deadFailed} color="#E24B4A" icon={<ReportProblemIcon />} />
      </MuiBox>

      <SectionCard title="Notes">
        <NotesTableContainer />
      </SectionCard>
    </motion.div>
  );
}
