import { motion } from 'framer-motion';
import PageHeader from '../common/PageHeader';
import FlowDiagram from '../features/notes/components/FlowDiagram';
import { useGetNotesWithFallback } from '../features/notes/notesApi';
import { useMemo } from 'react';

export default function SystemFlowPage() {
  const { data: notes = [] } = useGetNotesWithFallback({});

  const counts = useMemo(() => ({
    pending: notes.filter((n) => n.status === 'pending').length,
    delivered: notes.filter((n) => n.status === 'delivered').length,
    failed: notes.filter((n) => n.status === 'failed').length,
    dead: notes.filter((n) => n.status === 'dead').length,
  }), [notes]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <PageHeader title="System Flow" subtitle="Visual overview of the DropLater architecture" />
      <FlowDiagram noteCounts={counts} />
    </motion.div>
  );
}
