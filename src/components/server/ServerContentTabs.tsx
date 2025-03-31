
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogsTab } from './tabs/LogsTab';
import { AttacksTab } from './tabs/AttacksTab';
import { VulnerabilitiesTab } from './tabs/VulnerabilitiesTab';
import { Code, Bug, ShieldAlert } from 'lucide-react';
import { WebAppTemplate } from '@/models/WebAppTemplate';

interface ServerContentTabsProps {
  logs: string[];
  serverStatus: 'stopped' | 'running';
  selectedAppId: string;
  webAppTemplates: WebAppTemplate[];
  vulnerabilities: {
    name: string;
    active: boolean;
    description: string;
  }[];
  onToggleVulnerability: (name: string, checked: boolean) => void;
}

export function ServerContentTabs({ 
  logs, serverStatus, selectedAppId, webAppTemplates, 
  vulnerabilities, onToggleVulnerability 
}: ServerContentTabsProps) {
  return (
    <Tabs defaultValue="logs" className="w-full">
      <TabsList className="bg-gray-900 border border-gray-800">
        <TabsTrigger value="logs" className="data-[state=active]:bg-honeypot-terminal data-[state=active]:text-honeypot-glow">
          <Code className="h-4 w-4 mr-2" />
          Server Logs
        </TabsTrigger>
        <TabsTrigger value="attacks" className="data-[state=active]:bg-honeypot-terminal data-[state=active]:text-honeypot-glow">
          <Bug className="h-4 w-4 mr-2" />
          Attack Analysis
        </TabsTrigger>
        <TabsTrigger value="vulnerabilities" className="data-[state=active]:bg-honeypot-terminal data-[state=active]:text-honeypot-glow">
          <ShieldAlert className="h-4 w-4 mr-2" />
          Vulnerabilities
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="logs" className="mt-4">
        <LogsTab logs={logs} serverStatus={serverStatus} />
      </TabsContent>
      
      <TabsContent value="attacks" className="mt-4">
        <AttacksTab 
          serverStatus={serverStatus} 
          selectedAppId={selectedAppId} 
          webAppTemplates={webAppTemplates} 
        />
      </TabsContent>
      
      <TabsContent value="vulnerabilities" className="mt-4">
        <VulnerabilitiesTab 
          vulnerabilities={vulnerabilities} 
          onToggleVulnerability={onToggleVulnerability} 
        />
      </TabsContent>
    </Tabs>
  );
}
