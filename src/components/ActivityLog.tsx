
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AttackAttempt, formatTimestamp } from '@/utils/honeypotData';
import { Terminal, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ActivityLogProps {
  attacks: AttackAttempt[];
}

export function ActivityLog({ attacks }: ActivityLogProps) {
  const [logEntries, setLogEntries] = useState<AttackAttempt[]>(attacks.slice(0, 20));
  const [autoScroll, setAutoScroll] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Add new "live" entries periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * attacks.length);
      const newAttack = {
        ...attacks[randomIndex],
        id: Math.random().toString(36).substring(2, 15),
        timestamp: new Date(),
      };
      
      setLogEntries(prev => [newAttack, ...prev.slice(0, 19)]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [attacks]);

  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logEntries, autoScroll]);

  return (
    <Card className="bg-honeypot-darker border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Terminal className="h-5 w-5 text-honeypot-glow" />
            Activity Log
          </CardTitle>
          <Badge 
            variant="outline" 
            className="cursor-pointer border-honeypot-glow/50 text-honeypot-glow"
            onClick={() => setAutoScroll(!autoScroll)}
          >
            {autoScroll ? 'Auto-scroll: ON' : 'Auto-scroll: OFF'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="terminal-window h-[400px] font-mono text-sm">
          {logEntries.map((entry, index) => (
            <div key={entry.id + index} className="mb-2 py-1 border-b border-gray-800">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center">
                  {entry.success ? (
                    <AlertTriangle className="h-4 w-4 text-honeypot-alert mr-2" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 text-honeypot-success mr-2" />
                  )}
                  <span className="text-gray-400">[{formatTimestamp(entry.timestamp)}]</span>
                </div>
                <Badge variant={entry.success ? "destructive" : "outline"} className="text-xs">
                  {entry.success ? 'SUCCESS' : 'BLOCKED'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-2">
                <div>
                  <span className="text-gray-500">IP:</span> <span className="text-honeypot-glow">{entry.ip}</span>
                </div>
                <div>
                  <span className="text-gray-500">Country:</span> <span className="text-honeypot-warning">{entry.country}</span>
                </div>
                <div>
                  <span className="text-gray-500">Port:</span> <span className="text-honeypot-success">{entry.port}</span>
                </div>
                <div>
                  <span className="text-gray-500">Protocol:</span> <span className="text-honeypot-success">{entry.protocol}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Attack Type:</span> <span className="text-honeypot-alert">{entry.attackType}</span>
                </div>
                {entry.payload && (
                  <div className="col-span-2 mt-1 p-1 bg-gray-900 rounded">
                    <span className="text-gray-500">Payload:</span> <span className="text-gray-300 font-mono">{entry.payload}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
