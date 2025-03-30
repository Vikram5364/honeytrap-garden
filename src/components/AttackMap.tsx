
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AttackAttempt, formatTimestamp } from '@/utils/honeypotData';
import { Globe, Zap } from 'lucide-react';

interface AttackMapProps {
  attacks: AttackAttempt[];
}

export function AttackMap({ attacks }: AttackMapProps) {
  const [showAttacks, setShowAttacks] = useState<AttackAttempt[]>([]);
  const [liveAttack, setLiveAttack] = useState<AttackAttempt | null>(null);

  // Simulate live attacks coming in
  useEffect(() => {
    // Start with 10 random attacks
    setShowAttacks(attacks.slice(0, 10));
    
    // Simulate a new attack every 5-10 seconds
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * attacks.length);
      const newAttack = {...attacks[randomIndex], timestamp: new Date()};
      
      setLiveAttack(newAttack);
      setTimeout(() => setLiveAttack(null), 2000);
      
      setShowAttacks(prev => {
        const updated = [newAttack, ...prev.slice(0, 9)];
        return updated;
      });
    }, 5000 + Math.random() * 5000);
    
    return () => clearInterval(interval);
  }, [attacks]);

  return (
    <Card className="bg-honeypot-darker border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Globe className="h-5 w-5 text-honeypot-glow" />
          Live Attack Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* World map simulation with attack points */}
        <div className="relative h-[400px] bg-honeypot-darker grid-bg rounded-md border border-gray-800 overflow-hidden">
          {/* Simplified world map - in a real app you'd use a proper map library */}
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 1000 500" className="w-full h-full">
              {/* Very simplified world map paths */}
              <path d="M250,100 Q400,150 450,50 Q500,20 550,50 Q600,80 750,100 L750,200 Q700,250 650,200 Q600,180 550,200 Q500,220 450,200 Q400,180 350,200 Q300,220 250,200 Z" fill="#00ff9d" fillOpacity="0.1" stroke="#00ff9d" strokeWidth="1" />
              <path d="M200,250 Q300,280 400,250 Q500,230 600,250 Q700,280 800,250 L800,350 Q700,380 600,350 Q500,330 400,350 Q300,380 200,350 Z" fill="#00ff9d" fillOpacity="0.1" stroke="#00ff9d" strokeWidth="1" />
            </svg>
          </div>

          {/* Attack points */}
          {showAttacks.map((attack, index) => {
            // Convert geo coordinates to map coordinates (very simplified)
            const x = (attack.coordinates[1] + 180) * (1000 / 360);
            const y = (90 - attack.coordinates[0]) * (500 / 180);
            
            return (
              <div 
                key={`${attack.id}-${index}`}
                className={`absolute w-2 h-2 rounded-full ${attack.success ? 'bg-honeypot-alert' : 'bg-honeypot-success'}`}
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: `0 0 8px 2px ${attack.success ? 'rgba(255, 0, 77, 0.6)' : 'rgba(1, 192, 240, 0.6)'}`,
                }}
              />
            );
          })}
          
          {/* Live attack animation */}
          {liveAttack && (
            <>
              <div 
                className="absolute w-4 h-4 rounded-full bg-honeypot-alert animate-ping"
                style={{
                  left: `${(liveAttack.coordinates[1] + 180) * (1000 / 360)}px`,
                  top: `${(90 - liveAttack.coordinates[0]) * (500 / 180)}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
              <div className="absolute bottom-4 right-4 bg-honeypot-darker/80 backdrop-blur-sm p-3 rounded border border-honeypot-alert animate-pulse">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-honeypot-alert" />
                  <p className="text-honeypot-alert text-sm font-bold">LIVE ATTACK DETECTED</p>
                </div>
                <p className="text-xs text-gray-300 mt-1">
                  {liveAttack.ip} ({liveAttack.country}) - {liveAttack.attackType}
                </p>
              </div>
            </>
          )}

          {/* Grid overlay */}
          <div className="absolute inset-0 border border-honeypot-glow/10 rounded-md"></div>
          
          {/* Map legend */}
          <div className="absolute bottom-4 left-4 bg-honeypot-darker/80 backdrop-blur-sm p-3 rounded border border-gray-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-honeypot-success"></div>
                <p className="text-xs text-gray-300">Blocked Attack</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-honeypot-alert"></div>
                <p className="text-xs text-gray-300">Successful Attack</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick stats below the map */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="p-3 bg-gray-900/50 rounded-md border border-gray-800">
            <p className="text-xs text-gray-400">Active Attackers</p>
            <p className="text-xl font-bold text-honeypot-glow">{Math.floor(attacks.length * 0.1)}</p>
          </div>
          <div className="p-3 bg-gray-900/50 rounded-md border border-gray-800">
            <p className="text-xs text-gray-400">Top Country</p>
            <p className="text-xl font-bold text-honeypot-warning">{attacks[0]?.country || "Unknown"}</p>
          </div>
          <div className="p-3 bg-gray-900/50 rounded-md border border-gray-800">
            <p className="text-xs text-gray-400">Top Attack</p>
            <p className="text-xl font-bold text-honeypot-alert">{attacks[0]?.attackType || "None"}</p>
          </div>
          <div className="p-3 bg-gray-900/50 rounded-md border border-gray-800">
            <p className="text-xs text-gray-400">Success Rate</p>
            <p className="text-xl font-bold text-honeypot-success">
              {(attacks.filter(a => a.success).length / attacks.length * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
