
import React from 'react';
import { ServerLogs } from '../ServerLogs';

interface LogsTabProps {
  logs: string[];
  serverStatus: 'stopped' | 'running';
}

export function LogsTab({ logs, serverStatus }: LogsTabProps) {
  return <ServerLogs logs={logs} serverStatus={serverStatus} />;
}
