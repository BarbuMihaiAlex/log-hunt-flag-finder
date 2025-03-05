
import { format, subHours, subMinutes } from 'date-fns';

export type LogType = 'auth' | 'firewall' | 'network' | 'system';
export type LogSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface LogEntry {
  id: string;
  timestamp: string;
  type: LogType;
  severity: LogSeverity;
  source: string;
  message: string;
  details: Record<string, any>;
  containsFlag?: boolean;
}

// Generate a timestamp within a specific time range
const generateTimestamp = (hoursAgo: number, minutesOffset: number = 0) => {
  const date = subMinutes(subHours(new Date(), hoursAgo), minutesOffset);
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
};

// Generate a random IP address
const generateIP = () => {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
};

// List of suspicious IPs that will be used in the scenario
export const suspiciousIPs = [
  '45.33.21.17',
  '185.176.43.94',
  '91.134.183.12',
  '23.106.215.28'
];

// List of legitimate user accounts
const users = [
  'alice.johnson',
  'bob.smith',
  'carol.davis',
  'dave.wilson',
  'eve.adams',
  'frank.miller',
  'grace.moore',
  'admin',
  'system',
  'root'
];

// Generate the logs data
export const generateLogs = (): LogEntry[] => {
  let logs: LogEntry[] = [];
  let idCounter = 1;
  
  // Flag components - will be scattered across multiple logs
  const flagParts = {
    part1: 'CTF{l0g_h',
    part2: 'unt1ng_',
    part3: '1s_fun}'
  };
  
  // Authentication logs
  logs = [
    ...logs,
    {
      id: `log-${idCounter++}`,
      timestamp: generateTimestamp(4, 15),
      type: 'auth',
      severity: 'info',
      source: 'auth-service',
      message: 'User login successful',
      details: {
        username: 'alice.johnson',
        ipAddress: '192.168.1.105',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        sessionId: 'sess_92iea72j38'
      }
    },
    {
      id: `log-${idCounter++}`,
      timestamp: generateTimestamp(4, 10),
      type: 'auth',
      severity: 'warning',
      source: 'auth-service',
      message: 'Failed login attempt',
      details: {
        username: 'admin',
        ipAddress: '192.168.1.110',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        reason: 'Invalid credentials'
      }
    },
    {
      id: `log-${idCounter++}`,
      timestamp: generateTimestamp(3, 55),
      type: 'auth',
      severity: 'error',
      source: 'auth-service',
      message: 'Multiple failed login attempts detected',
      details: {
        username: 'admin',
        ipAddress: suspiciousIPs[0],
        attempts: 5,
        timeframe: '10 minutes',
        note: `Potential brute force attempt, check ${flagParts.part1}`
      },
      containsFlag: true
    },
    {
      id: `log-${idCounter++}`,
      timestamp: generateTimestamp(3, 40),
      type: 'auth',
      severity: 'critical',
      source: 'auth-service',
      message: 'Account locked due to multiple failed attempts',
      details: {
        username: 'admin',
        ipAddress: suspiciousIPs[0],
        reason: 'Exceeded max failed login attempts'
      }
    },
    {
      id: `log-${idCounter++}`,
      timestamp: generateTimestamp(3, 20),
      type: 'auth',
      severity: 'info',
      source: 'auth-service',
      message: 'User login successful',
      details: {
        username: 'eve.adams',
        ipAddress: '192.168.1.112',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        sessionId: 'sess_51lda83n21'
      }
    },
    {
      id: `log-${idCounter++}`,
      timestamp: generateTimestamp(3, 10),
      type: 'auth',
      severity: 'info',
      source: 'auth-service',
      message: 'User login successful after password reset',
      details: {
        username: 'admin',
        ipAddress: suspiciousIPs[0],
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        sessionId: 'sess_72oea93h47'
      }
    }
  ];
  
  // Firewall logs
  logs = [
    ...logs,
    {
      id: `log-${idCounter++}`,
      timestamp: generateTimestamp(3, 5),
      type: 'firewall',
      severity: 'warning',
      source: 'perimeter-fw',
      message: 'Blocked connection attempt',
      details: {
        sourceIP: suspiciousIPs[0],
        destinationIP: '10.0.0.25',
        destinationPort: 22,
        protocol: 'TCP',
        reason: 'SSH brute force protection'
      }
    },
    {
      id: `log-${idCounter++}`,
      timestamp: generateTimestamp(3, 0),
      type: 'firewall',
      severity: 'info',
      source: 'perimeter-fw',
      message: 'Connection allowed',
      details: {
        sourceIP: '192.168.1.105',
        destinationIP: '10.0.0.15',
        destinationPort: 443,
        protocol: 'TCP',
        session: 'fw_sess_18372'
      }
    },
    {
      id: `log-${idCounter++}`,
      timestamp: generateTimestamp(2, 55),
      type: 'firewall',
      severity: 'warning',
      source: 'internal-fw',
      message: 'Unusual port access',
      details: {
        sourceIP: '10.0.0.15',
        username: 'admin',
        destinationIP: '10.0.0.5',
        destinationPort: 21,
        protocol: 'TCP',
        allowed: true,
        reason: 'Matched exception rule',
        comment: `Suspicious internal movement ${flagParts.part2}`
      },
      containsFlag: true
    },
    {
      id: `log-${idCounter++}`,
      timestamp: generateTimestamp(2, 45),
      type: 'firewall',
      severity: 'error',
      source: 'perimeter-fw',
      message: 'Connection to malicious host blocked',
      details: {
        sourceIP: '10.0.0.15',
        destinationIP: suspiciousIPs[1],
        destinationPort: 443,
        protocol: 'TCP',
        reason: 'Destination on blocklist'
      }
    }
  ];
  
  // Network traffic logs
  logs = [
    ...logs,
    {
      id: `log-${idCounter++}`,
      timestamp: generateTimestamp(2, 40),
      type: 'network',
      severity: 'info',
      source: 'network-monitor',
      message: 'DNS query detected',
      details: {
        sourceIP: '10.0.0.15',
        query: 'internal-files.company.local',
        recordType: 'A',
        resolved: true,
        resolvedIP: '10.0.0.5'
      }
    },
    {
      id: `log-${idCounter++}`,
      timestamp: generateTimestamp(2, 35),
      type: 'network',
      severity: 'warning',
      source: 'network-monitor',
      message: 'Large file transfer detected',
      details: {
        sourceIP: '10.0.0.15',
        destinationIP: '10.0.0.5',
        protocol: 'FTP',
        fileSize: '25MB',
        duration: '45 seconds',
        username: 'admin'
      }
    },
    {
      id: `log-${idCounter++}`,
      timestamp: generateTimestamp(2, 30),
      type: 'network',
      severity: 'error',
      source: 'network-monitor',
      message: 'Suspicious outbound connection detected',
      details: {
        sourceIP: '10.0.0.15',
        destinationIP: suspiciousIPs[2],
        destinationPort: 8080,
        protocol: 'TCP',
        dataTransferred: '1.2MB',
        tags: ['command-and-control', 'data-exfiltration'],
        alert: `Potential data exfiltration ${flagParts.part3}`
      },
      containsFlag: true
    },
    {
      id: `log-${idCounter++}`,
      timestamp: generateTimestamp(2, 20),
      type: 'network',
      severity: 'critical',
      source: 'network-monitor',
      message: 'Multiple connections to known C2 servers',
      details: {
        sourceIP: '10.0.0.15',
        destinations: [suspiciousIPs[2], suspiciousIPs[3]],
        protocols: ['TCP', 'UDP'],
        connections: 7,
        timeframe: '10 minutes'
      }
    }
  ];
  
  // System event logs
  logs = [
    ...logs,
    {
      id: `log-${idCounter++}`,
      timestamp: generateTimestamp(2, 15),
      type: 'system',
      severity: 'info',
      source: 'file-server',
      message: 'User accessed restricted directory',
      details: {
        username: 'admin',
        directory: '/data/financial/2023/',
        accessType: 'READ',
        clientIP: '10.0.0.15'
      }
    },
    {
      id: `log-${idCounter++}`,
      timestamp: generateTimestamp(2, 10),
      type: 'system',
      severity: 'warning',
      source: 'file-server',
      message: 'File permission changed',
      details: {
        username: 'admin',
        file: '/data/financial/2023/q2_earnings.xlsx',
        oldPermissions: '0640',
        newPermissions: '0644',
        clientIP: '10.0.0.15'
      }
    },
    {
      id: `log-${idCounter++}`,
      timestamp: generateTimestamp(2, 5),
      type: 'system',
      severity: 'info',
      source: 'linux-host',
      message: 'Cron job executed',
      details: {
        job: 'db-backup.sh',
        user: 'system',
        duration: '3m 25s',
        exitCode: 0
      }
    },
    {
      id: `log-${idCounter++}`,
      timestamp: generateTimestamp(2, 0),
      type: 'system',
      severity: 'error',
      source: 'linux-host',
      message: 'New user created with admin privileges',
      details: {
        username: 'maintenance',
        created_by: 'admin',
        groups: ['admin', 'sudo'],
        clientIP: '10.0.0.15'
      }
    },
    {
      id: `log-${idCounter++}`,
      timestamp: generateTimestamp(1, 55),
      type: 'system',
      severity: 'critical',
      source: 'windows-host',
      message: 'Antivirus alert: Malware detected',
      details: {
        user: 'admin',
        malware: 'Trojan.Downloader',
        file: 'C:\\temp\\update_package.zip',
        action: 'Quarantined',
        clientIP: '10.0.0.15'
      }
    }
  ];
  
  // Sort logs by timestamp
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Get logs by type
export const getLogsByType = (logs: LogEntry[], type: LogType): LogEntry[] => {
  return logs.filter(log => log.type === type);
};

// Get the flag by combining all parts from the logs
export const getFlag = (logs: LogEntry[]): string | null => {
  const flagLogs = logs.filter(log => log.containsFlag);
  if (flagLogs.length < 3) return null;
  
  let flag = '';
  
  // Find part 1
  const part1Log = flagLogs.find(log => 
    log.type === 'auth' && 
    log.details.note?.includes('CTF{l0g_h')
  );
  if (part1Log) flag += 'CTF{l0g_h';
  
  // Find part 2
  const part2Log = flagLogs.find(log => 
    log.type === 'firewall' && 
    log.details.comment?.includes('unt1ng_')
  );
  if (part2Log) flag += 'unt1ng_';
  
  // Find part 3
  const part3Log = flagLogs.find(log => 
    log.type === 'network' && 
    log.details.alert?.includes('1s_fun}')
  );
  if (part3Log) flag += '1s_fun}';
  
  return flag.length > 0 ? flag : null;
};

// Initialize logs
export const logs = generateLogs();
