
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Square, Server } from 'lucide-react';

interface ServerControlPanelProps {
  serverStatus: 'stopped' | 'running';
  port: string;
  setPort: (port: string) => void;
  logLevel: string;
  setLogLevel: (level: string) => void;
  startServer: () => void;
  stopServer: () => void;
}

export function ServerControlPanel({ 
  serverStatus, port, setPort, logLevel, 
  setLogLevel, startServer, stopServer 
}: ServerControlPanelProps) {
  return (
    <Card className="bg-honeypot-darker border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Server className="h-5 w-5 text-honeypot-glow" />
          Server Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Port</label>
          <Input
            type="text"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            className="bg-gray-900 border-gray-700 focus:border-honeypot-glow"
            placeholder="80"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Log Level</label>
          <Select value={logLevel} onValueChange={setLogLevel}>
            <SelectTrigger className="bg-gray-900 border-gray-700 focus:border-honeypot-glow">
              <SelectValue placeholder="Select Log Level" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="debug">Debug</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-4 pt-4">
          {serverStatus === 'stopped' ? (
            <Button 
              className="w-full bg-honeypot-glow text-black hover:bg-honeypot-glow/80 font-bold"
              onClick={startServer}
            >
              <Play className="h-4 w-4 mr-2" />
              Start Honeypot Server
            </Button>
          ) : (
            <Button 
              variant="destructive" 
              className="w-full font-bold"
              onClick={stopServer}
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Honeypot Server
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
