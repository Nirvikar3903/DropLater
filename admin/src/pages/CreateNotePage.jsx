import { motion } from 'framer-motion';
import MuiBox from '../mui/MuiBox';
import PageHeader from '../common/PageHeader';
import SectionCard from '../common/SectionCard';
import CreateNoteContainer from '../features/notes/containers/CreateNoteContainer';

export default function CreateNotePage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <PageHeader title="Create Note" subtitle="Schedule a new webhook delivery" />
      <MuiBox sx={{ maxWidth: 1000 }}>
        <SectionCard>
          <CreateNoteContainer />
        </SectionCard>
      </MuiBox>
    </motion.div>
  );
}
