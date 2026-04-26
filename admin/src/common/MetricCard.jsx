import { motion } from 'framer-motion';
import MuiCard, { CardContent } from '../mui/MuiCard';
import MuiTypography from '../mui/MuiTypography';
import MuiBox from '../mui/MuiBox';

/**
 * MetricCard — displays a stat number with label and optional trend.
 * @param {{ label: string, value: string|number, trend?: string, trendUp?: boolean, color?: string, icon?: React.ReactNode }} props
 */
export default function MetricCard({ label, value, trend, trendUp, color = '#7c6ff7', icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <MuiCard
        sx={{
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${color}, transparent)`,
          },
        }}
      >
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <MuiBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <MuiBox>
              <MuiTypography
                variant="h2"
                sx={{ color, fontWeight: 800, fontSize: '1.75rem', lineHeight: 1.1 }}
              >
                {value}
              </MuiTypography>
              <MuiTypography variant="subtitle2" sx={{ mt: 0.75, fontSize: '0.8rem' }}>
                {label}
              </MuiTypography>
            </MuiBox>
            {icon && (
              <MuiBox
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${color}15`,
                  color,
                }}
              >
                {icon}
              </MuiBox>
            )}
          </MuiBox>
          {trend && (
            <MuiTypography
              variant="caption"
              sx={{
                mt: 1,
                display: 'inline-block',
                color: trendUp ? '#639922' : '#E24B4A',
                fontWeight: 600,
              }}
            >
              {trendUp ? '↑' : '↓'} {trend}
            </MuiTypography>
          )}
        </CardContent>
      </MuiCard>
    </motion.div>
  );
}
