
import { useEffect, useState } from 'react';
import { LogEntry } from '@/utils/logData';
import { format, parseISO } from 'date-fns';
import { AlertCircle, AlertTriangle, Info, ZapOff } from 'lucide-react';

interface TimelineProps {
  logs: LogEntry[];
  onLogSelect: (log: LogEntry) => void;
  selectedLog: LogEntry | null;
}

const Timeline = ({ logs, onLogSelect, selectedLog }: TimelineProps) => {
  const [timelineGroups, setTimelineGroups] = useState<{[key: string]: LogEntry[]}>({});
  
  useEffect(() => {
    // Group logs by hour for the timeline
    const groups: {[key: string]: LogEntry[]} = {};
    
    logs.forEach(log => {
      const date = parseISO(log.timestamp);
      const hourKey = format(date, 'yyyy-MM-dd HH:00');
      
      if (!groups[hourKey]) {
        groups[hourKey] = [];
      }
      
      groups[hourKey].push(log);
    });
    
    setTimelineGroups(groups);
  }, [logs]);

  // Get severity icon
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'critical':
        return <ZapOff className="h-4 w-4 text-purple-400" />;
      default:
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };
  
  // Get type color class
  const getTypeColorClass = (type: string) => {
    switch (type) {
      case 'auth':
        return 'border-blue-500/30 bg-blue-500/10';
      case 'firewall':
        return 'border-amber-500/30 bg-amber-500/10';
      case 'network':
        return 'border-green-500/30 bg-green-500/10';
      case 'system':
        return 'border-purple-500/30 bg-purple-500/10';
      default:
        return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  return (
    <div className="h-full overflow-y-auto p-2 animate-fade-in">
      {Object.keys(timelineGroups).length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No logs to display</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(timelineGroups)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([timeGroup, groupLogs]) => (
              <div key={timeGroup} className="space-y-2">
                <div className="sticky top-0 z-10 backdrop-blur-sm bg-background/70 py-1">
                  <h3 className="text-xs font-medium text-muted-foreground">
                    {format(new Date(timeGroup), 'MMM d, yyyy - h:00 a')}
                  </h3>
                </div>
                
                <div className="space-y-2 pl-2">
                  {groupLogs.map(log => (
                    <button
                      key={log.id}
                      onClick={() => onLogSelect(log)}
                      className={`w-full text-left p-2 rounded-md border ${
                        getTypeColorClass(log.type)
                      } transition-all hover:border-border ${
                        selectedLog?.id === log.id 
                          ? 'ring-1 ring-primary border-primary/50' 
                          : 'hover:bg-secondary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          {getSeverityIcon(log.severity)}
                          <span className="ml-1.5 text-xs font-medium capitalize">
                            {log.severity}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(log.timestamp), 'HH:mm:ss')}
                        </span>
                      </div>
                      <p className="text-sm line-clamp-2">{log.message}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {log.source}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Timeline;
