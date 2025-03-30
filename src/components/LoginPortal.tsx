
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Fingerprint, UserX, Key, Shield, Eye } from 'lucide-react';

interface LoginAttempt {
  id: string;
  timestamp: Date;
  username: string;
  password: string;
  ip: string;
  userAgent: string;
  success: boolean;
}

// List of common usernames that attackers might try
const commonUsernames = [
  'admin', 'root', 'administrator', 'user', 'guest', 'support', 
  'oracle', 'test', 'demo', 'postgres', 'mysql', 'ubuntu',
  'ftpuser', 'www-data', 'apache', 'webmaster'
];

// List of common passwords that attackers might try
const commonPasswords = [
  'password', 'admin', 'root', '123456', 'qwerty', 'password123',
  'admin123', 'welcome', 'p@ssw0rd', 'letmein', 'default', 'secret',
  'changeme', '123456789', '12345678', '1234', 'test123'
];

// Generate a random login attempt
const generateLoginAttempt = (): LoginAttempt => {
  const username = commonUsernames[Math.floor(Math.random() * commonUsernames.length)];
  const password = commonPasswords[Math.floor(Math.random() * commonPasswords.length)];
  
  return {
    id: Math.random().toString(36).substring(2, 15),
    timestamp: new Date(),
    username,
    password,
    ip: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    success: false,
  };
};

export function LoginPortal() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  // Generate initial login attempts
  useEffect(() => {
    const initialAttempts: LoginAttempt[] = [];
    for (let i = 0; i < 10; i++) {
      initialAttempts.push(generateLoginAttempt());
    }
    setLoginAttempts(initialAttempts);
  }, []);

  // Add new "live" login attempts periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newAttempt = generateLoginAttempt();
      setLoginAttempts(prev => [newAttempt, ...prev.slice(0, 19)]);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle login form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Record the login attempt
    const attempt: LoginAttempt = {
      id: Math.random().toString(36).substring(2, 15),
      timestamp: new Date(),
      username,
      password,
      ip: '127.0.0.1',
      userAgent: navigator.userAgent,
      success: false,
    };
    
    setLoginAttempts(prev => [attempt, ...prev]);
    
    // Show toast notification
    toast({
      title: "Login Attempt Recorded",
      description: "This is a honeypot. No actual authentication is happening.",
      variant: "destructive",
    });
    
    // Reset form
    setUsername('');
    setPassword('');
  };

  // Format timestamp
  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-honeypot-darker border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-honeypot-glow" />
            Login Portal
          </CardTitle>
          <CardDescription>
            This is a honeypot login form. Any login attempts are logged and analyzed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm text-gray-400">Username</label>
              <div className="relative">
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-900 border-gray-700 focus:border-honeypot-glow"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-gray-400">Password</label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-900 border-gray-700 focus:border-honeypot-glow pr-10"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-honeypot-glow hover:bg-honeypot-glow/80 text-black">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-500">
          <Shield className="h-4 w-4 mr-2" />
          All activity is monitored and recorded
        </CardFooter>
      </Card>
      
      <Card className="bg-honeypot-darker border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserX className="h-5 w-5 text-honeypot-alert" />
            Failed Login Attempts
          </CardTitle>
          <CardDescription>
            Recent authentication attempts captured by the honeypot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {loginAttempts.map((attempt) => (
                <div key={attempt.id} className="p-3 bg-gray-900/50 rounded-md border border-gray-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-honeypot-glow font-medium">
                        {attempt.username}:<span className="text-gray-400 font-mono">{attempt.password}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        IP: {attempt.ip} • {formatTimestamp(attempt.timestamp)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs border-honeypot-alert/50 text-honeypot-alert">
                      Failed
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
