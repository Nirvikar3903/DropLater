import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MuiBox from '../mui/MuiBox';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [pollInterval, setPollInterval] = useState(5000);

  const sidebarWidth = collapsed ? 64 : 240;

  return (
    <MuiBox sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a0c10' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <MuiBox sx={{ flex: 1, ml: `${sidebarWidth}px`, transition: 'margin-left 0.2s ease', display: 'flex', flexDirection: 'column' }}>
        <Topbar pollInterval={pollInterval} onPollIntervalChange={setPollInterval} />

        <MuiBox sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          <Outlet context={{ pollInterval }} />
        </MuiBox>
      </MuiBox>
    </MuiBox>
  );
}
