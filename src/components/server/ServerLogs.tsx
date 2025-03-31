
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code } from 'lucide-react';

interface ServerLogsProps {
  logs: string[];
  serverStatus: 'stopped' | 'running';
}

export function ServerLogs({ logs, serverStatus }: ServerLogsProps) {
  return (
    <Card className="bg-honeypot-darker border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Code className="h-5 w-5 text-honeypot-glow" />
          Live Server Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="terminal-window h-[400px]">
          {logs.map((log, index) => (
            <div key={index} className="terminal-line">
              <code 
                className={
                  log.includes('[ALERT]') 
                    ? 'text-honeypot-alert' 
                    : log.includes('[ERROR]') 
                      ? 'text-red-400' 
                      : log.includes('[WARNING]') 
                        ? 'text-honeypot-warning' 
                        : 'text-honeypot-glow/70'
                }
              >
                {log}
              </code>
            </div>
          ))}
          {serverStatus === 'running' && (
            <div className="terminal-line">
              <span className="text-honeypot-glow/70">$ _</span>
              <span className="terminal-cursor"></span>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
