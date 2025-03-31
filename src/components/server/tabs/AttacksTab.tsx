
import React from 'react';
import { AttackAnalysis } from '../AttackAnalysis';
import { WebAppTemplate } from '@/models/WebAppTemplate';

interface AttacksTabProps {
  serverStatus: 'stopped' | 'running';
  selectedAppId: string;
  webAppTemplates: WebAppTemplate[];
}

export function AttacksTab({ serverStatus, selectedAppId, webAppTemplates }: AttacksTabProps) {
  return (
    <AttackAnalysis 
      serverStatus={serverStatus} 
      selectedAppId={selectedAppId} 
      webAppTemplates={webAppTemplates} 
    />
  );
}
