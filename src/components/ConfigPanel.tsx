
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Settings, Server, Network, Shield, Database, Cpu } from 'lucide-react';

export function ConfigPanel() {
  const [honeypotName, setHoneypotName] = useState('Honeypot-Server-1');
  const [logLevel, setLogLevel] = useState('info');
  const [portRange, setPortRange] = useState([1, 1024]);
  const [enabled, setEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [autoBlock, setAutoBlock] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState(10);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Configuration Saved",
      description: "Your honeypot configuration has been updated.",
    });
  };

  const handleRestart = () => {
    toast({
      title: "Honeypot Restarted",
      description: "The honeypot service is restarting with new configuration.",
    });
  };

  return (
    <Card className="bg-honeypot-darker border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-5 w-5 text-honeypot-glow" />
          Honeypot Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="general" className="data-[state=active]:bg-honeypot-terminal data-[state=active]:text-honeypot-glow">
              <Server className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-honeypot-terminal data-[state=active]:text-honeypot-glow">
              <Network className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-honeypot-terminal data-[state=active]:text-honeypot-glow">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="honeypot-name" className="text-sm text-gray-400">Honeypot Name</label>
                <Input
                  id="honeypot-name"
                  value={honeypotName}
                  onChange={(e) => setHoneypotName(e.target.value)}
                  className="bg-gray-900 border-gray-700 focus:border-honeypot-glow"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="log-level" className="text-sm text-gray-400">Log Level</label>
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
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Honeypot Status</label>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={enabled} 
                  onCheckedChange={setEnabled} 
                  className="data-[state=checked]:bg-honeypot-glow"
                />
                <span className="text-gray-300">{enabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Port Range</label>
              <div className="pt-2 px-2">
                <Slider
                  defaultValue={portRange}
                  min={1}
                  max={65535}
                  step={1}
                  onValueChange={setPortRange}
                  className="data-[state=active]:text-honeypot-glow"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Port {portRange[0]}</span>
                <span>Port {portRange[1]}</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'SSH Service', port: 22, enabled: true },
                { name: 'HTTP Service', port: 80, enabled: true },
                { name: 'HTTPS Service', port: 443, enabled: false },
                { name: 'FTP Service', port: 21, enabled: true },
                { name: 'SMTP Service', port: 25, enabled: false },
                { name: 'Telnet Service', port: 23, enabled: true },
                { name: 'MySQL Service', port: 3306, enabled: false },
                { name: 'RDP Service', port: 3389, enabled: true },
              ].map((service, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-gray-900/50 rounded-md border border-gray-800 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm text-gray-300">{service.name}</p>
                    <p className="text-xs text-gray-500">Port: {service.port}</p>
                  </div>
                  <Switch 
                    checked={service.enabled} 
                    className="data-[state=checked]:bg-honeypot-glow"
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-gray-900/50 rounded-md border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-honeypot-glow" />
                <h3 className="text-sm font-medium text-gray-300">Custom Service</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Input
                    placeholder="Service Name"
                    className="bg-gray-900 border-gray-700 text-sm"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Port Number"
                    type="number"
                    className="bg-gray-900 border-gray-700 text-sm"
                  />
                </div>
                <div>
                  <Button className="w-full bg-honeypot-glow text-black hover:bg-honeypot-glow/80">
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Email Alerts</label>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={emailAlerts} 
                  onCheckedChange={setEmailAlerts} 
                  className="data-[state=checked]:bg-honeypot-glow"
                />
                <span className="text-gray-300">{emailAlerts ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Auto-Block Attackers</label>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={autoBlock} 
                  onCheckedChange={setAutoBlock} 
                  className="data-[state=checked]:bg-honeypot-glow"
                />
                <span className="text-gray-300">{autoBlock ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Alert Threshold</label>
              <div className="grid grid-cols-5 gap-2 items-center">
                <div className="col-span-4">
                  <Slider
                    defaultValue={[alertThreshold]}
                    min={1}
                    max={50}
                    step={1}
                    onValueChange={(value) => setAlertThreshold(value[0])}
                  />
                </div>
                <Badge variant="outline" className="border-honeypot-glow text-honeypot-glow text-center">
                  {alertThreshold}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Alert when more than {alertThreshold} attacks are detected within 5 minutes
              </p>
            </div>
            
            <div className="bg-gray-900/50 p-3 rounded-md border border-gray-800">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-honeypot-warning" />
                <h3 className="text-sm font-medium text-gray-300">CPU Resource Limit</h3>
              </div>
              <div className="mt-2">
                <Slider
                  defaultValue={[50]}
                  min={10}
                  max={100}
                  step={5}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>10%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button 
            variant="outline" 
            className="border-honeypot-glow text-honeypot-glow hover:bg-honeypot-glow/10"
            onClick={handleRestart}
          >
            Restart
          </Button>
          <Button 
            className="bg-honeypot-glow text-black hover:bg-honeypot-glow/80"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
