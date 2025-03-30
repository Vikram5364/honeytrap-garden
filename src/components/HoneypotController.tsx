
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Database, HardDrive, Network, Lock } from 'lucide-react';

export function HoneypotController() {
  const [savePath, setSavePath] = useState('/var/log/honeypot');
  const [enableDorkDB, setEnableDorkDB] = useState(true);
  const [enableVirtualFS, setEnableVirtualFS] = useState(true);
  const [enableSQLDB, setEnableSQLDB] = useState(true);
  const { toast } = useToast();

  const handleApply = () => {
    toast({
      title: "Settings Applied",
      description: "Honeypot controller settings have been updated",
    });
  };

  return (
    <Card className="bg-honeypot-darker border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Network className="h-5 w-5 text-honeypot-glow" />
          Advanced Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Log Storage Path</label>
          <Input
            value={savePath}
            onChange={(e) => setSavePath(e.target.value)}
            className="bg-gray-900 border-gray-700 focus:border-honeypot-glow"
          />
          <p className="text-xs text-gray-500">Directory where logs and attack data will be stored</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="dorkdb" 
              checked={enableDorkDB} 
              onCheckedChange={() => setEnableDorkDB(!enableDorkDB)} 
              className="data-[state=checked]:bg-honeypot-glow border-gray-500 mt-1"
            />
            <div>
              <label htmlFor="dorkdb" className="text-sm text-gray-300 font-medium cursor-pointer">
                Google Dork Database
              </label>
              <p className="text-xs text-gray-500">
                Enable Google dork database to make honeypot more discoverable
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="vfs" 
              checked={enableVirtualFS} 
              onCheckedChange={() => setEnableVirtualFS(!enableVirtualFS)} 
              className="data-[state=checked]:bg-honeypot-glow border-gray-500 mt-1"
            />
            <div>
              <label htmlFor="vfs" className="text-sm text-gray-300 font-medium cursor-pointer">
                Virtual File System
              </label>
              <p className="text-xs text-gray-500">
                Emulate a file system for LFI/RFI attacks
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="sqldb" 
              checked={enableSQLDB} 
              onCheckedChange={() => setEnableSQLDB(!enableSQLDB)} 
              className="data-[state=checked]:bg-honeypot-glow border-gray-500 mt-1"
            />
            <div>
              <label htmlFor="sqldb" className="text-sm text-gray-300 font-medium cursor-pointer">
                SQL Database Emulation
              </label>
              <p className="text-xs text-gray-500">
                Fake SQL database to respond to SQL injection attacks
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <Button 
            className="w-full bg-honeypot-glow/20 hover:bg-honeypot-glow/30 text-honeypot-glow"
            onClick={handleApply}
          >
            <Lock className="h-4 w-4 mr-2" />
            Apply Settings
          </Button>
        </div>
        
        <div className="pt-2">
          <div className="p-2 bg-gray-900/50 rounded-md border border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-honeypot-warning" />
                <span className="text-xs text-gray-300">System Resources</span>
              </div>
              <Badge variant="outline" className="text-xs border-honeypot-warning/50 text-honeypot-warning">
                Low Impact
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Honeypot is designed to run with minimal system resources
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
