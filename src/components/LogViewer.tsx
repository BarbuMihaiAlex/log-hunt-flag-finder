
import { useState } from 'react';
import { LogEntry } from '@/utils/logData';
import { format, parseISO } from 'date-fns';
import { AlertCircle, AlertTriangle, ChevronDown, ChevronRight, Copy, Info, ZapOff } from 'lucide-react';
import HighlightText from './HighlightText';

interface LogViewerProps {
  log: LogEntry | null;
  searchQuery: string;
  onClose: () => void;
}

const LogViewer = ({ log, searchQuery, onClose }: LogViewerProps) => {
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    details: true
  });
  
  if (!log) {
    return (
      <div className="h-full flex items-center justify-center bg-card rounded-lg border border-border animate-fade-in">
        <p className="text-muted-foreground">Select a log to view details</p>
      </div>
    );
  }
  
  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };
  
  // Get severity icon and color
  const getSeverityDetails = (severity: string) => {
    switch (severity) {
      case 'info':
        return { icon: <Info className="h-5 w-5" />, colorClass: 'text-blue-400' };
      case 'warning':
        return { icon: <AlertTriangle className="h-5 w-5" />, colorClass: 'text-amber-400' };
      case 'error':
        return { icon: <AlertCircle className="h-5 w-5" />, colorClass: 'text-red-400' };
      case 'critical':
        return { icon: <ZapOff className="h-5 w-5" />, colorClass: 'text-purple-400' };
      default:
        return { icon: <Info className="h-5 w-5" />, colorClass: 'text-blue-400' };
    }
  };
  
  const severityDetails = getSeverityDetails(log.severity);
  
  // Get type badge class
  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'auth':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'firewall':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'network':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'system':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-card rounded-lg border border-border text-foreground animate-fade-in p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className={`mr-2 ${severityDetails.colorClass}`}>
              {severityDetails.icon}
            </div>
            <div>
              <h3 className="text-lg font-medium">
                <HighlightText text={log.message} searchTerm={searchQuery} />
              </h3>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <span>{format(parseISO(log.timestamp), 'MMM d, yyyy HH:mm:ss')}</span>
                <span className="mx-2">•</span>
                <span>{log.source}</span>
              </div>
            </div>
          </div>
          
          <div className="flex">
            <button
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
              onClick={() => copyToClipboard(JSON.stringify(log, null, 2))}
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Type and Severity */}
        <div className="flex items-center space-x-2">
          <span className={`text-xs px-2 py-1 rounded-md border ${getTypeBadgeClass(log.type)}`}>
            {log.type}
          </span>
          <span className="text-xs px-2 py-1 rounded-md border border-border bg-muted capitalize">
            {log.severity}
          </span>
        </div>
        
        {/* Details Section */}
        <div className="border border-border rounded-md overflow-hidden">
          <div 
            className="flex items-center justify-between p-2 bg-muted/50 cursor-pointer"
            onClick={() => toggleSection('details')}
          >
            <h4 className="text-sm font-medium">Details</h4>
            <button>
              {expandedSections.details ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
          
          {expandedSections.details && (
            <div className="p-3 bg-secondary/30 font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre-wrap">
                {Object.entries(log.details).map(([key, value]) => (
                  <div key={key} className="mb-1">
                    <span className="text-muted-foreground">{key}:</span>{' '}
                    <span className="text-foreground">
                      {typeof value === 'string' 
                        ? <HighlightText text={value} searchTerm={searchQuery} />
                        : JSON.stringify(value)}
                    </span>
                  </div>
                ))}
              </pre>
            </div>
          )}
        </div>
        
        {/* Raw Section */}
        <div className="border border-border rounded-md overflow-hidden">
          <div 
            className="flex items-center justify-between p-2 bg-muted/50 cursor-pointer"
            onClick={() => toggleSection('raw')}
          >
            <h4 className="text-sm font-medium">Raw Log</h4>
            <button>
              {expandedSections.raw ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
          
          {expandedSections.raw && (
            <div className="p-3 bg-secondary/30 font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(log, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogViewer;
