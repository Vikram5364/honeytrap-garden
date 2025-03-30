
import React from 'react';
import { AttackStatistics } from './AttackStatistics';
import { AttackMap } from './AttackMap';
import { ActivityLog } from './ActivityLog';
import { ConfigPanel } from './ConfigPanel';
import { LoginPortal } from './LoginPortal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { initialAttacks, initialStatistics } from '@/utils/honeypotData';
import { AlertTriangle, Bug, Fingerprint, ShieldAlert, Terminal, Settings, Server } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-8 w-8 text-honeypot-glow" />
            <h1 className="text-3xl font-bold text-honeypot-glow">HoneyPot Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-honeypot-glow/50 text-honeypot-glow px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-honeypot-glow mr-2 animate-pulse"></div>
              Active
            </Badge>
            <Badge variant="outline" className="border-honeypot-alert/50 text-honeypot-alert px-3 py-1">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {initialStatistics.totalAttempts} Threats Detected
            </Badge>
            <Link to="/server">
              <Button className="bg-honeypot-glow text-black hover:bg-honeypot-glow/80">
                <Server className="h-4 w-4 mr-2" />
                Honeypot Server
              </Button>
            </Link>
          </div>
        </div>
        <p className="text-gray-400 mt-1">Monitoring and analyzing potential intrusion attempts</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <AttackStatistics statistics={initialStatistics} />
        <div className="col-span-1 lg:col-span-2">
          <AttackMap attacks={initialAttacks} />
        </div>
      </div>

      <Tabs defaultValue="activity" className="mb-6">
        <TabsList className="bg-honeypot-darker border border-gray-800">
          <TabsTrigger value="activity" className="data-[state=active]:bg-honeypot-terminal data-[state=active]:text-honeypot-glow">
            <Terminal className="h-4 w-4 mr-2" />
            Activity Log
          </TabsTrigger>
          <TabsTrigger value="login" className="data-[state=active]:bg-honeypot-terminal data-[state=active]:text-honeypot-glow">
            <Fingerprint className="h-4 w-4 mr-2" />
            Login Attempts
          </TabsTrigger>
          <TabsTrigger value="config" className="data-[state=active]:bg-honeypot-terminal data-[state=active]:text-honeypot-glow">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="mt-6">
          <ActivityLog attacks={initialAttacks} />
        </TabsContent>
        <TabsContent value="login" className="mt-6">
          <LoginPortal />
        </TabsContent>
        <TabsContent value="config" className="mt-6">
          <ConfigPanel />
        </TabsContent>
      </Tabs>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Honeypot Server Simulation - For educational purposes only.</p>
        <p className="mt-1">Not intended for production use.</p>
      </footer>
    </div>
  );
}

export default Dashboard;
