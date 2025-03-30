
// Web application template model for honeypot emulation

export type WebAppType = 
  | 'WordPress'
  | 'Joomla'
  | 'Drupal'
  | 'PHPMyAdmin'
  | 'Generic CMS'
  | 'E-commerce'
  | 'Custom Application'
  | 'Laravel'
  | 'Spring Boot'
  | 'Node.js Express';

export interface WebAppVersion {
  version: string;
  hasKnownVulnerabilities: boolean;
  vulnerabilityDescription?: string;
}

export interface WebAppTemplate {
  id: string;
  name: WebAppType;
  description: string;
  versions: WebAppVersion[];
  techStack: string[];
  commonUrls: string[];
  defaultPorts: number[];
  vulnerabilityProfile: {
    sql: boolean;
    xss: boolean;
    rfi: boolean;
    lfi: boolean;
    commandInjection: boolean;
    csrf: boolean;
    xxe: boolean;
    ssrf: boolean;
    deserialization: boolean;
    brokenAuth: boolean;
  };
}

// Predefined web application templates
export const webAppTemplates: WebAppTemplate[] = [
  {
    id: 'wordpress',
    name: 'WordPress',
    description: 'WordPress CMS with plugins',
    versions: [
      { version: '5.8.3', hasKnownVulnerabilities: true, vulnerabilityDescription: 'SQLi in comments' },
      { version: '5.7.0', hasKnownVulnerabilities: true, vulnerabilityDescription: 'XSS in media upload' },
      { version: '6.0.0', hasKnownVulnerabilities: false }
    ],
    techStack: ['PHP', 'MySQL', 'jQuery'],
    commonUrls: ['/wp-admin', '/wp-login.php', '/wp-content/uploads/', '/wp-json/'],
    defaultPorts: [80, 443],
    vulnerabilityProfile: {
      sql: true,
      xss: true,
      rfi: true,
      lfi: true,
      commandInjection: false,
      csrf: true,
      xxe: false,
      ssrf: true,
      deserialization: false,
      brokenAuth: true
    }
  },
  {
    id: 'phpmyadmin',
    name: 'PHPMyAdmin',
    description: 'MySQL database management interface',
    versions: [
      { version: '4.9.7', hasKnownVulnerabilities: true, vulnerabilityDescription: 'CSRF in settings' },
      { version: '5.1.0', hasKnownVulnerabilities: false }
    ],
    techStack: ['PHP', 'MySQL', 'JavaScript'],
    commonUrls: ['/phpmyadmin/', '/index.php', '/sql.php', '/db_structure.php'],
    defaultPorts: [80, 443],
    vulnerabilityProfile: {
      sql: true,
      xss: true,
      rfi: false,
      lfi: true,
      commandInjection: true,
      csrf: true,
      xxe: false,
      ssrf: false,
      deserialization: false,
      brokenAuth: true
    }
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Generic e-commerce application',
    versions: [
      { version: '2.3.5', hasKnownVulnerabilities: true, vulnerabilityDescription: 'SQL injection in product search' },
      { version: '3.0.1', hasKnownVulnerabilities: false }
    ],
    techStack: ['PHP', 'MySQL', 'jQuery', 'Bootstrap'],
    commonUrls: ['/admin/', '/products/', '/cart.php', '/checkout.php', '/account/'],
    defaultPorts: [80, 443],
    vulnerabilityProfile: {
      sql: true,
      xss: true,
      rfi: false,
      lfi: true,
      commandInjection: false,
      csrf: true,
      xxe: false,
      ssrf: true,
      deserialization: true,
      brokenAuth: true
    }
  },
  {
    id: 'custom',
    name: 'Custom Application',
    description: 'Custom web application template',
    versions: [
      { version: '1.0.0', hasKnownVulnerabilities: true, vulnerabilityDescription: 'Multiple vulnerabilities can be configured' }
    ],
    techStack: ['Configurable'],
    commonUrls: ['/login', '/admin', '/api/', '/dashboard'],
    defaultPorts: [80, 443, 8080],
    vulnerabilityProfile: {
      sql: true,
      xss: true,
      rfi: true,
      lfi: true,
      commandInjection: true,
      csrf: true,
      xxe: true,
      ssrf: true,
      deserialization: true,
      brokenAuth: true
    }
  }
];

export const getWebAppTemplate = (id: string): WebAppTemplate | undefined => {
  return webAppTemplates.find(template => template.id === id);
};
