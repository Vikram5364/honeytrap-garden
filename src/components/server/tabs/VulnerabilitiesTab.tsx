
import React from 'react';
import { VulnerabilitiesPanel } from '../VulnerabilitiesPanel';

interface VulnerabilitiesTabProps {
  vulnerabilities: {
    name: string;
    active: boolean;
    description: string;
  }[];
  onToggleVulnerability: (name: string, checked: boolean) => void;
}

export function VulnerabilitiesTab({ vulnerabilities, onToggleVulnerability }: VulnerabilitiesTabProps) {
  return (
    <VulnerabilitiesPanel 
      vulnerabilities={vulnerabilities} 
      onToggleVulnerability={onToggleVulnerability} 
    />
  );
}
