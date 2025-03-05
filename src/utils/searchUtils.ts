
import { LogEntry, LogType } from './logData';

export interface SearchFilters {
  severity?: string[];
  timeRange?: {
    from: string;
    to: string;
  };
  source?: string[];
  type?: LogType[];
}

// Search logs based on query string and filters
export const searchLogs = (
  logs: LogEntry[],
  query: string,
  filters: SearchFilters = {}
): LogEntry[] => {
  // Apply filters first
  let filtered = logs;

  // Filter by log type
  if (filters.type && filters.type.length > 0) {
    filtered = filtered.filter(log => filters.type?.includes(log.type));
  }

  // Filter by severity
  if (filters.severity && filters.severity.length > 0) {
    filtered = filtered.filter(log => filters.severity?.includes(log.severity));
  }

  // Filter by source
  if (filters.source && filters.source.length > 0) {
    filtered = filtered.filter(log => filters.source?.includes(log.source));
  }

  // Filter by time range
  if (filters.timeRange) {
    const { from, to } = filters.timeRange;
    filtered = filtered.filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime >= new Date(from).getTime() && logTime <= new Date(to).getTime();
    });
  }

  // If no query, return filtered results
  if (!query.trim()) {
    return filtered;
  }

  // Apply search query
  const normalizedQuery = query.toLowerCase().trim();

  return filtered.filter(log => {
    // Search in message
    if (log.message.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // Search in source
    if (log.source.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // Search in severity
    if (log.severity.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // Search in details
    const detailsString = JSON.stringify(log.details).toLowerCase();
    if (detailsString.includes(normalizedQuery)) {
      return true;
    }

    return false;
  });
};

// Extract unique sources from logs
export const extractSources = (logs: LogEntry[]): string[] => {
  const sources = logs.map(log => log.source);
  return [...new Set(sources)];
};

// Extract unique IP addresses from logs
export const extractIPs = (logs: LogEntry[]): string[] => {
  const ips: string[] = [];
  
  logs.forEach(log => {
    Object.entries(log.details).forEach(([key, value]) => {
      if (typeof value === 'string' && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(value)) {
        ips.push(value);
      }
      if (key === 'sourceIP' || key === 'destinationIP' || key === 'ipAddress') {
        if (typeof value === 'string') {
          ips.push(value);
        }
      }
      if (Array.isArray(value) && key === 'destinations') {
        value.forEach(item => {
          if (typeof item === 'string' && /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(item)) {
            ips.push(item);
          }
        });
      }
    });
  });
  
  return [...new Set(ips)];
};

// Check if a specific log entry contains part of the flag
export const checkLogForFlag = (log: LogEntry): boolean => {
  return !!log.containsFlag;
};

// Highlight search terms in text
export const highlightText = (text: string, searchTerm: string): JSX.Element => {
  if (!searchTerm.trim()) {
    return <>{text}</>;
  }

  const regex = new RegExp(`(${searchTerm.trim()})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => (
        regex.test(part) ? 
          <span key={i} className="bg-highlight/20 text-highlight font-medium px-1 rounded">
            {part}
          </span> : 
          <span key={i}>{part}</span>
      ))}
    </>
  );
};
