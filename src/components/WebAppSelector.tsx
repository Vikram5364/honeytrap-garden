
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { WebAppTemplate, webAppTemplates } from '@/models/WebAppTemplate';
import { Globe, Server, Code } from 'lucide-react';

interface WebAppSelectorProps {
  selectedAppId: string;
  onSelectApp: (appId: string) => void;
}

export function WebAppSelector({ selectedAppId, onSelectApp }: WebAppSelectorProps) {
  const selectedApp = webAppTemplates.find(app => app.id === selectedAppId);
  
  return (
    <Card className="bg-honeypot-darker border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Globe className="h-5 w-5 text-honeypot-glow" />
          Web Application Template
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="web-app-selector" className="text-sm text-gray-400">Select Application</Label>
          <Select value={selectedAppId} onValueChange={onSelectApp}>
            <SelectTrigger className="bg-gray-900 border-gray-700 focus:border-honeypot-glow" id="web-app-selector">
              <SelectValue placeholder="Select web application to emulate" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              {webAppTemplates.map(app => (
                <SelectItem key={app.id} value={app.id}>
                  {app.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedApp && (
          <div className="space-y-4 mt-4">
            <div className="bg-gray-900/50 rounded-md border border-gray-800 p-3">
              <h3 className="text-sm font-medium text-gray-300 mb-1">{selectedApp.description}</h3>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedApp.techStack.map((tech, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-800 text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
              
              <div className="mt-3">
                <Label className="text-xs text-gray-400">Supported Versions</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedApp.versions.map((version, index) => (
                    <Badge key={index} variant={version.hasKnownVulnerabilities ? "destructive" : "outline"} className="text-xs">
                      {version.version}
                      {version.hasKnownVulnerabilities && " ⚠️"}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="mt-3">
                <Label className="text-xs text-gray-400">Common URLs</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedApp.commonUrls.map((url, index) => (
                    <Badge key={index} variant="outline" className="text-xs text-honeypot-glow border-honeypot-glow/40">
                      {url}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 rounded-md border border-gray-800 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-4 w-4 text-honeypot-warning" />
                <h3 className="text-sm font-medium text-gray-300">Vulnerability Profile</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(selectedApp.vulnerabilityProfile).map(([key, enabled], index) => {
                  const formattedKey = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase());
                    
                  return (
                    <div key={index} className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-honeypot-glow' : 'bg-gray-600'}`}></div>
                      <span className={enabled ? 'text-gray-300' : 'text-gray-500'}>
                        {formattedKey}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
