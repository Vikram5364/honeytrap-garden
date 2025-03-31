
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ShieldAlert } from 'lucide-react';

interface Vulnerability {
  name: string;
  active: boolean;
  description: string;
}

interface VulnerabilitiesPanelProps {
  vulnerabilities: Vulnerability[];
  onToggleVulnerability: (name: string, checked: boolean) => void;
}

export function VulnerabilitiesPanel({ vulnerabilities, onToggleVulnerability }: VulnerabilitiesPanelProps) {
  return (
    <Card className="bg-honeypot-darker border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-honeypot-glow" />
          Emulated Vulnerabilities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vulnerabilities.map((vuln, index) => (
            <div 
              key={index} 
              className="p-3 bg-gray-900/50 rounded-md border border-gray-800 flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-300">{vuln.name}</p>
                <p className="text-xs text-gray-500">{vuln.description}</p>
              </div>
              <Switch 
                checked={vuln.active} 
                onCheckedChange={(checked) => onToggleVulnerability(vuln.name, checked)}
                className="data-[state=checked]:bg-honeypot-glow"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
