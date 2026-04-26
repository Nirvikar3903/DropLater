import { motion } from 'framer-motion';
import MuiBox from '../../../mui/MuiBox';
import MuiTypography from '../../../mui/MuiTypography';
import MuiCard, { CardContent } from '../../../mui/MuiCard';
import MuiDivider from '../../../mui/MuiDivider';
import PersonIcon from '@mui/icons-material/Person';
import DnsIcon from '@mui/icons-material/Dns';
import StorageIcon from '@mui/icons-material/Storage';
import WorkIcon from '@mui/icons-material/Work';
import WebhookIcon from '@mui/icons-material/Webhook';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SecurityIcon from '@mui/icons-material/Security';
import TimerIcon from '@mui/icons-material/Timer';
import ReplayIcon from '@mui/icons-material/Replay';
import { useTheme } from '@mui/material/styles';

const stages = [
  {
    icon: <PersonIcon />,
    name: 'Client / User',
    description: 'Creates and schedules a note for future delivery',
    tech: 'Browser / API Client',
    arrow: 'POST /api/notes',
    color: '#7c6ff7',
  },
  {
    icon: <DnsIcon />,
    name: 'API Service',
    description: 'Validates, stores in MongoDB, queues in BullMQ with delay',
    tech: 'Express + BullMQ',
    arrow: 'Save + Queue Job',
    color: '#1D9E75',
  },
  {
    icon: <StorageIcon />,
    name: 'Redis Queue',
    description: 'Holds delayed jobs until releaseAt time arrives',
    tech: 'Redis + BullMQ',
    arrow: 'Job fires at releaseAt',
    color: '#EF9F27',
  },
  {
    icon: <WorkIcon />,
    name: 'Worker Service',
    description: 'Picks up jobs and sends HTTP POST with idempotency key',
    tech: 'Node.js Worker',
    arrow: 'HTTP POST + idem. key',
    color: '#E24B4A',
  },
  {
    icon: <WebhookIcon />,
    name: 'Sink / Target',
    description: 'Receives webhook, checks idempotency, processes payload',
    tech: 'Express + Redis SET NX',
    color: '#639922',
  },
];

const featureCards = [
  {
    icon: <SecurityIcon sx={{ fontSize: 28 }} />,
    title: 'Idempotency Guard',
    description:
      'The Sink checks Redis using SET NX. If the key already exists, the request is a duplicate — acknowledged but not processed again.',
    color: '#7c6ff7',
    visual: ['1st delivery → key stored ✓', '2nd delivery → rejected (duplicate)'],
  },
  {
    icon: <TimerIcon sx={{ fontSize: 28 }} />,
    title: 'Exponential Backoff',
    description:
      'On failure, the Worker waits 1s, then 5s, then 25s before retrying.',
    color: '#EF9F27',
    visual: ['Attempt 1 ✕ → wait 1s', 'Attempt 2 ✕ → wait 5s', 'Attempt 3 ✕ → wait 25s'],
  },
  {
    icon: <ReplayIcon sx={{ fontSize: 28 }} />,
    title: 'Dead Letter + Replay',
    description:
      'After MAX_DELIVERY_ATTEMPTS, the note becomes dead. Engineers can replay it from the admin UI.',
    color: '#E24B4A',
    visual: ['dead → replay → pending → retry cycle'],
  },
];

export default function FlowDiagram({ noteCounts = {} }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <MuiBox>
      <MuiBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        {stages.map((stage, i) => (
          <motion.div
            key={stage.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.12 }}
            style={{ width: '100%', maxWidth: 480 }}
          >
            <MuiCard
              sx={{
                border: `1px solid ${stage.color}30`,
                position: 'relative',
                overflow: 'visible',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  borderRadius: '4px 0 0 4px',
                  backgroundColor: stage.color,
                },
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <MuiBox
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: `${stage.color}15`,
                      color: stage.color,
                    }}
                  >
                    {stage.icon}
                  </MuiBox>
                  <MuiBox sx={{ flex: 1 }}>
                    <MuiTypography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 700 }}>
                      {stage.name}
                    </MuiTypography>
                    <MuiTypography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      {stage.description}
                    </MuiTypography>
                  </MuiBox>
                  <MuiBox
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
                    }}
                  >
                    <MuiTypography variant="caption" sx={{ color: stage.color, fontWeight: 600, fontSize: '0.7rem' }}>
                      {stage.tech}
                    </MuiTypography>
                  </MuiBox>
                </MuiBox>
              </CardContent>
            </MuiCard>

            {stage.arrow && (
              <MuiBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1 }}>
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowDownwardIcon sx={{ color: stage.color, fontSize: 20, opacity: 0.7 }} />
                </motion.div>
                <MuiTypography variant="caption" sx={{ color: theme.palette.text.disabled, fontSize: '0.65rem', mt: 0.25 }}>
                  {stage.arrow}
                </MuiTypography>
              </MuiBox>
            )}
          </motion.div>
        ))}
      </MuiBox>

      <MuiDivider sx={{ my: 5 }} />
      <MuiTypography variant="h4" sx={{ textAlign: 'center', mb: 3, color: theme.palette.text.primary }}>
        Key Concepts
      </MuiTypography>

      <MuiBox
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 2.5,
        }}
      >
        {featureCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.12 }}
          >
            <MuiCard sx={{ height: '100%', border: `1px solid ${card.color}20` }}>
              <CardContent sx={{ p: 2.5 }}>
                <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <MuiBox sx={{ color: card.color }}>{card.icon}</MuiBox>
                  <MuiTypography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 700 }}>
                    {card.title}
                  </MuiTypography>
                </MuiBox>
                <MuiTypography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                  {card.description}
                </MuiTypography>
                <MuiBox
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                  }}
                >
                  {card.visual.map((line, j) => (
                    <MuiTypography
                      key={j}
                      variant="caption"
                      sx={{
                        fontFamily: 'monospace',
                        color: theme.palette.text.primary,
                        display: 'block',
                        py: 0.25,
                      }}
                    >
                      {line}
                    </MuiTypography>
                  ))}
                </MuiBox>
              </CardContent>
            </MuiCard>
          </motion.div>
        ))}
      </MuiBox>
    </MuiBox>
  );
}
