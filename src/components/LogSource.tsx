
import { LogType } from '@/utils/logData';
import { ShieldAlert, Globe, Server, Lock } from 'lucide-react';

interface LogSourceProps {
  activeSource: LogType | 'all';
  onSourceChange: (source: LogType | 'all') => void;
}

const LogSource = ({ activeSource, onSourceChange }: LogSourceProps) => {
  const sources: Array<{ id: LogType | 'all', name: string, icon: JSX.Element }> = [
    { id: 'all', name: 'All Logs', icon: <Server className="h-4 w-4" /> },
    { id: 'auth', name: 'Authentication', icon: <Lock className="h-4 w-4" /> },
    { id: 'firewall', name: 'Firewall', icon: <ShieldAlert className="h-4 w-4" /> },
    { id: 'network', name: 'Network', icon: <Globe className="h-4 w-4" /> },
    { id: 'system', name: 'System', icon: <Server className="h-4 w-4" /> }
  ];

  return (
    <div className="flex flex-col space-y-1 bg-card rounded-lg p-1 border border-border animate-slide-down">
      {sources.map((source) => (
        <button
          key={source.id}
          onClick={() => onSourceChange(source.id)}
          className={`flex items-center px-3 py-2 rounded-md transition-all ${
            activeSource === source.id
              ? 'bg-accent text-accent-foreground'
              : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="mr-2">{source.icon}</span>
          <span className="text-sm font-medium">{source.name}</span>
        </button>
      ))}
    </div>
  );
};

export default LogSource;
