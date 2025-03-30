
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

const HoneypotServer = () => {
  const [serverStatus, setServerStatus] = useState<'stopped' | 'running'>('stopped');
  const [port, setPort] = useState('80');
  const [logLevel, setLogLevel] = useState('info');
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate some initial logs
    setLogs([
      '[INFO] Honeypot server initialized',
      '[INFO] Available vulnerability modules: SQL Injection, XSS, RFI, LFI',
      '[INFO] Ready to start on port ' + port
    ]);
  }, [port]);

  const startServer = () => {
    setServerStatus('running');
    setLogs(prev => [
      `[${new Date().toISOString()}] [INFO] Starting honeypot server on port ${port}`,
      `[${new Date().toISOString()}] [INFO] Loading vulnerability emulation modules`,
      `[${new Date().toISOString()}] [INFO] Server started successfully`,
      ...prev
    ]);
    toast({
      title: "Honeypot Server Started",
      description: `Server is now running on port ${port}`,
    });
  };

  const stopServer = () => {
    setServerStatus('stopped');
    setLogs(prev => [
      `[${new Date().toISOString()}] [INFO] Stopping honeypot server`,
      `[${new Date().toISOString()}] [INFO] Saving collected data`,
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
      const attackTypes = ['SQL Injection', 'XSS', 'Path Traversal', 'Command Injection', 'File Inclusion'];
      const randomAttack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
      const randomIP = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
      
      setLogs(prev => [
        `[${new Date().toISOString()}] [ALERT] Detected ${randomAttack} attempt from ${randomIP}`,
        `[${new Date().toISOString()}] [INFO] Payload recorded and analyzed`,
        ...prev
      ]);
    }, 5000 + Math.random() * 10000); // Random interval between 5-15 seconds
    
    return () => clearInterval(interval);
  }, [serverStatus]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-honeypot-glow hover:text-honeypot-glow/80">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-honeypot-glow">Glastopf-like Honeypot</h1>
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
          Web Application Honeypot - Emulates vulnerable web services to capture attack patterns
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
                      <p>Collecting and analyzing attack data. Start the server to see results.</p>
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
                      { name: 'SQL Injection', active: true, description: 'Emulates vulnerable SQL queries' },
                      { name: 'Cross-Site Scripting (XSS)', active: true, description: 'Responds to XSS injection attempts' },
                      { name: 'Remote File Inclusion', active: true, description: 'Simulates RFI vulnerabilities' },
                      { name: 'Local File Inclusion', active: true, description: 'Emulates LFI vulnerabilities' },
                      { name: 'Command Injection', active: false, description: 'Handles OS command injection attempts' },
                      { name: 'CSRF Vulnerabilities', active: false, description: 'Exposes fake CSRF endpoints' },
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
        <p>Glastopf-like Honeypot - For educational and research purposes only.</p>
        <p className="mt-1">Not recommended for production environments.</p>
      </footer>
    </div>
  );
};

export default HoneypotServer;
