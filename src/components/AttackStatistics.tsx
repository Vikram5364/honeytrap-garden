
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Statistics } from '@/utils/honeypotData';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Shield, Globe, Database, Network } from 'lucide-react';

interface AttackStatisticsProps {
  statistics: Statistics;
}

const COLORS = ['#00ff9d', '#01c0f0', '#ffae00', '#ff004d', '#9b5de5'];

export function AttackStatistics({ statistics }: AttackStatisticsProps) {
  // Format data for pie chart
  const attackTypeData = statistics.topAttackTypes.map(item => ({
    name: item.type,
    value: item.count
  }));

  // Format data for bar chart
  const countryData = statistics.topCountries.map(item => ({
    name: item.country,
    value: item.count
  }));

  return (
    <div className="space-y-6">
      <Card className="bg-honeypot-darker border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-honeypot-glow" />
            Attack Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-900/50 p-3 rounded-md border border-gray-800">
              <p className="text-xs text-gray-400">Total Attempts</p>
              <p className="text-2xl font-bold text-honeypot-glow">{statistics.totalAttempts}</p>
            </div>
            <div className="bg-gray-900/50 p-3 rounded-md border border-gray-800">
              <p className="text-xs text-gray-400">Unique IPs</p>
              <p className="text-2xl font-bold text-honeypot-glow">{statistics.uniqueIPs}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-honeypot-success" />
              <h3 className="text-sm font-medium text-gray-300">Attack Types</h3>
            </div>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attackTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => 
                      percent > 0.1 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''
                    }
                  >
                    {attackTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} attempts`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-honeypot-warning" />
              <h3 className="text-sm font-medium text-gray-300">Top Countries</h3>
            </div>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={100}
                    tick={{fill: '#f0f0f0', fontSize: 12}}
                  />
                  <Tooltip formatter={(value) => [`${value} attempts`, 'Count']} />
                  <Bar dataKey="value" fill="#00ff9d" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
