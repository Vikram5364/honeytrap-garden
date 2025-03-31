
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bug } from 'lucide-react';
import { WebAppTemplate } from '@/models/WebAppTemplate';

interface AttackAnalysisProps {
  serverStatus: 'stopped' | 'running';
  selectedAppId: string;
  webAppTemplates: WebAppTemplate[];
}

export function AttackAnalysis({ serverStatus, selectedAppId, webAppTemplates }: AttackAnalysisProps) {
  return (
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
  );
}
