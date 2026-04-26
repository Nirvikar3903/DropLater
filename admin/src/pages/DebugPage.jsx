import { motion } from 'framer-motion';
import PageHeader from '../common/PageHeader';
import DebugPanelContainer from '../features/notes/containers/DebugPanelContainer';

export default function DebugPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <PageHeader title="Debug Panel" subtitle="Inspect delivery attempts and note state" />
      <DebugPanelContainer />
    </motion.div>
  );
}
