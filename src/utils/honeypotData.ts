
// Simulated honeypot data utilities

// Types for our honeypot data
export interface AttackAttempt {
  id: string;
  timestamp: Date;
  ip: string;
  country: string;
  coordinates: [number, number]; // [latitude, longitude]
  port: number;
  protocol: string;
  attackType: string;
  payload?: string;
  success: boolean;
}

export interface Statistics {
  totalAttempts: number;
  uniqueIPs: number;
  topCountries: {country: string, count: number}[];
  topAttackTypes: {type: string, count: number}[];
  topPorts: {port: number, count: number}[];
  recentActivity: AttackAttempt[];
}

// Generate a random IP address
const generateRandomIP = (): string => {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
};

// List of countries for random selection
const countries = [
  { name: 'United States', code: 'US', coords: [37.0902, -95.7129] },
  { name: 'Russia', code: 'RU', coords: [61.5240, 105.3188] },
  { name: 'China', code: 'CN', coords: [35.8617, 104.1954] },
  { name: 'Brazil', code: 'BR', coords: [-14.2350, -51.9253] },
  { name: 'Germany', code: 'DE', coords: [51.1657, 10.4515] },
  { name: 'India', code: 'IN', coords: [20.5937, 78.9629] },
  { name: 'United Kingdom', code: 'GB', coords: [55.3781, -3.4360] },
  { name: 'Canada', code: 'CA', coords: [56.1304, -106.3468] },
  { name: 'Australia', code: 'AU', coords: [-25.2744, 133.7751] },
  { name: 'South Korea', code: 'KR', coords: [35.9078, 127.7669] },
];

// List of attack types
const attackTypes = [
  'SQL Injection',
  'XSS',
  'Brute Force',
  'Port Scan',
  'DDoS',
  'Command Injection',
  'Directory Traversal',
  'File Upload',
  'CSRF',
  'SSRF',
];

// List of common ports
const commonPorts = [
  21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 3306, 3389, 5432, 8080, 8443
];

// List of common protocols
const protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'FTP', 'SSH', 'SMTP', 'DNS'];

// Generate a random attack with slight variation to coordinates
const generateRandomAttack = (): AttackAttempt => {
  const country = countries[Math.floor(Math.random() * countries.length)];
  // Add some randomness to coordinates for visual variety
  const latVariation = (Math.random() - 0.5) * 10;
  const lngVariation = (Math.random() - 0.5) * 10;
  
  return {
    id: Math.random().toString(36).substring(2, 15),
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)), // Random time in last 24h
    ip: generateRandomIP(),
    country: country.name,
    coordinates: [
      country.coords[0] + latVariation,
      country.coords[1] + lngVariation
    ],
    port: commonPorts[Math.floor(Math.random() * commonPorts.length)],
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    attackType: attackTypes[Math.floor(Math.random() * attackTypes.length)],
    payload: Math.random() > 0.7 ? `PAYLOAD:${Math.random().toString(36).substring(2, 15)}` : undefined,
    success: Math.random() > 0.8, // 20% success rate
  };
};

// Generate an array of random attacks
export const generateAttacks = (count: number): AttackAttempt[] => {
  const attacks: AttackAttempt[] = [];
  for (let i = 0; i < count; i++) {
    attacks.push(generateRandomAttack());
  }
  // Sort by timestamp, newest first
  return attacks.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Generate statistics based on attacks
export const generateStatistics = (attacks: AttackAttempt[]): Statistics => {
  // Count unique IPs
  const uniqueIPs = new Set(attacks.map(a => a.ip)).size;
  
  // Count attacks by country
  const countryCount = attacks.reduce((acc, attack) => {
    acc[attack.country] = (acc[attack.country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topCountries = Object.entries(countryCount)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Count attacks by type
  const attackTypeCount = attacks.reduce((acc, attack) => {
    acc[attack.attackType] = (acc[attack.attackType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topAttackTypes = Object.entries(attackTypeCount)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Count attacks by port
  const portCount = attacks.reduce((acc, attack) => {
    acc[attack.port] = (acc[attack.port] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topPorts = Object.entries(portCount)
    .map(([port, count]) => ({ port: parseInt(port), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  return {
    totalAttempts: attacks.length,
    uniqueIPs,
    topCountries,
    topAttackTypes,
    topPorts,
    recentActivity: attacks.slice(0, 10), // Last 10 attacks
  };
};

// Initial data generation for the app
export const initialAttacks = generateAttacks(100);
export const initialStatistics = generateStatistics(initialAttacks);

// Function to format timestamp for display
export const formatTimestamp = (date: Date): string => {
  return date.toISOString().replace('T', ' ').substring(0, 19);
};
