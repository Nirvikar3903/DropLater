import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MuiBox from '../mui/MuiBox';
import MuiTypography from '../mui/MuiTypography';
import MuiCard, { CardContent } from '../mui/MuiCard';
import MuiChip from '../mui/MuiChip';
import PageHeader from '../common/PageHeader';
import SectionCard from '../common/SectionCard';
import LivePollContainer from '../features/notes/containers/LivePollContainer';
import LiveActivityFeed from '../features/notes/components/LiveActivityFeed';
import StatusBadge from '../common/StatusBadge';
import AttemptPills from '../common/AttemptPills';
import CountdownChip from '../common/CountdownChip';
import DnsIcon from '@mui/icons-material/Dns';
import StorageIcon from '@mui/icons-material/Storage';
import WorkIcon from '@mui/icons-material/Work';
import WebhookIcon from '@mui/icons-material/Webhook';

const pipelineStages = [
  { icon: <DnsIcon sx={{ fontSize: 20 }} />, label: 'API', color: '#7c6ff7', key: 'pending' },
  { icon: <StorageIcon sx={{ fontSize: 20 }} />, label: 'Redis', color: '#EF9F27', key: 'pending' },
  { icon: <WorkIcon sx={{ fontSize: 20 }} />, label: 'Worker', color: '#1D9E75', key: 'failed' },
  { icon: <WebhookIcon sx={{ fontSize: 20 }} />, label: 'Sink', color: '#639922', key: 'delivered' },
];

export default function LiveMonitorPage() {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <PageHeader title="Live Monitor" subtitle="Real-time view of the delivery pipeline" />

      <LivePollContainer pollingInterval={5000}>
        {({ notes, isLoading, changedIds, events, counts }) => (
          <>
            {/* Queue status pipeline */}
            <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, mb: 3, flexWrap: 'wrap' }}>
              {pipelineStages.map((stage, i) => (
                <MuiBox key={stage.label} sx={{ display: 'flex', alignItems: 'center' }}>
                  <motion.div animate={{ boxShadow: counts[stage.key] > 0 ? `0 0 16px ${stage.color}40` : 'none' }}>
                    <MuiCard sx={{ minWidth: 120, textAlign: 'center', border: `1px solid ${stage.color}30`, backgroundColor: counts[stage.key] > 0 ? `${stage.color}08` : undefined }}>
                      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <MuiBox sx={{ color: stage.color, mb: 0.5 }}>{stage.icon}</MuiBox>
                        <MuiTypography variant="h6" sx={{ color: stage.color, fontWeight: 800, fontSize: '1.25rem' }}>
                          {counts[stage.key] || 0}
                        </MuiTypography>
                        <MuiTypography variant="caption" sx={{ color: '#6b7280' }}>{stage.label}</MuiTypography>
                      </CardContent>
                    </MuiCard>
                  </motion.div>
                  {i < pipelineStages.length - 1 && (
                    <MuiBox sx={{ px: 1 }}>
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
                        <MuiTypography sx={{ color: '#6b7280', fontSize: '1.2rem' }}>→</MuiTypography>
                      </motion.div>
                    </MuiBox>
                  )}
                </MuiBox>
              ))}
            </MuiBox>

            <MuiBox sx={{ display: 'flex', gap: 2.5, flexDirection: { xs: 'column', md: 'row' } }}>
              {/* Activity feed */}
              <MuiBox sx={{ width: { xs: '100%', md: '40%' } }}>
                <SectionCard title="Activity Feed">
                  <LiveActivityFeed events={events} />
                </SectionCard>
              </MuiBox>

              {/* Notes table */}
              <MuiBox sx={{ width: { xs: '100%', md: '60%' } }}>
                <SectionCard title="Notes">
                  <MuiBox sx={{ overflow: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          {['Title', 'Status', 'Release', 'Attempts'].map((h) => (
                            <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {notes.map((note) => (
                          <motion.tr
                            key={note._id}
                            animate={changedIds.has(note._id) ? { borderLeft: ['3px solid transparent', '3px solid #EF9F27', '3px solid transparent'] } : {}}
                            transition={{ duration: 1.2, times: [0, 0.3, 1] }}
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/debug/${note._id}`)}
                          >
                            <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                              <MuiTypography variant="body2" sx={{ fontWeight: 600, color: '#e4e4e7' }}>{note.title}</MuiTypography>
                              {changedIds.has(note._id) && (
                                <MuiChip label="LIVE" size="small" sx={{ ml: 1, height: 18, fontSize: '0.6rem', backgroundColor: '#E24B4A', color: '#fff', fontWeight: 800 }} />
                              )}
                            </td>
                            <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                              <StatusBadge status={note.status} />
                            </td>
                            <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                              {note.status === 'pending' ? <CountdownChip releaseAt={note.releaseAt} /> : (
                                <MuiTypography variant="caption" sx={{ color: '#6b7280' }}>{new Date(note.releaseAt).toLocaleTimeString()}</MuiTypography>
                              )}
                            </td>
                            <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                              <AttemptPills attempts={note.attempts} />
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </MuiBox>
                </SectionCard>
              </MuiBox>
            </MuiBox>
          </>
        )}
      </LivePollContainer>
    </motion.div>
  );
}
