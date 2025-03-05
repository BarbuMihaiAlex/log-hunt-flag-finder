
import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import LogSource from './LogSource';
import Timeline from './Timeline';
import LogViewer from './LogViewer';
import Visualization from './Visualization';
import HintSystem from './HintSystem';
import { logs as initialLogs, LogEntry, LogType, getFlag } from '@/utils/logData';
import { searchLogs, SearchFilters } from '@/utils/searchUtils';
import { Shield, ChartBar, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(initialLogs);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [activeSource, setActiveSource] = useState<LogType | 'all'>('all');
  const [selectedViz, setSelectedViz] = useState<'severity' | 'type' | 'ips'>('severity');
  const [discoveredFlagParts, setDiscoveredFlagParts] = useState<Set<number>>(new Set());
  const [foundFlag, setFoundFlag] = useState<string | null>(null);
  const [showFlagMessage, setShowFlagMessage] = useState(false);
  
  const { toast } = useToast();
  
  // Effect to handle filtering logs based on source
  useEffect(() => {
    if (activeSource === 'all') {
      setFilteredLogs(logs);
    } else {
      const sourceFiltered = logs.filter(log => log.type === activeSource);
      setFilteredLogs(sourceFiltered);
    }
  }, [logs, activeSource]);
  
  // Function to handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const results = searchLogs(
      activeSource === 'all' ? logs : logs.filter(log => log.type === activeSource),
      query,
      filters
    );
    setFilteredLogs(results);
  };
  
  // Function to handle filter changes
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    
    const results = searchLogs(
      activeSource === 'all' ? logs : logs.filter(log => log.type === activeSource),
      searchQuery,
      newFilters
    );
    
    setFilteredLogs(results);
  };
  
  // Function to handle source changes
  const handleSourceChange = (source: LogType | 'all') => {
    setActiveSource(source);
    
    if (source === 'all') {
      const results = searchLogs(logs, searchQuery, filters);
      setFilteredLogs(results);
    } else {
      const sourceFiltered = logs.filter(log => log.type === source);
      const results = searchLogs(sourceFiltered, searchQuery, filters);
      setFilteredLogs(results);
    }
  };
  
  // Function to handle log selection
  const handleLogSelect = (log: LogEntry) => {
    setSelectedLog(log);
    
    // Check if this log contains a flag part
    if (log.containsFlag) {
      let partNumber = 0;
      
      // Determine which part of the flag was found
      if (log.type === 'auth' && log.details.note?.includes('CTF{l0g_h')) {
        partNumber = 1;
      } else if (log.type === 'firewall' && log.details.comment?.includes('unt1ng_')) {
        partNumber = 2;
      } else if (log.type === 'network' && log.details.alert?.includes('1s_fun}')) {
        partNumber = 3;
      }
      
      if (partNumber > 0 && !discoveredFlagParts.has(partNumber)) {
        // Add this part to discovered parts
        const newDiscoveredParts = new Set(discoveredFlagParts);
        newDiscoveredParts.add(partNumber);
        setDiscoveredFlagParts(newDiscoveredParts);
        
        // Show toast notification
        toast({
          title: "Flag Part Discovered!",
          description: `You've found part ${partNumber} of the flag.`,
          variant: "default",
        });
        
        // Check if all parts are found
        if (newDiscoveredParts.size === 3) {
          const flag = getFlag(logs);
          if (flag) {
            setFoundFlag(flag);
            setTimeout(() => {
              setShowFlagMessage(true);
            }, 1000);
          }
        }
      }
    }
  };
  
  // Function to handle hint requests
  const handleRequestHint = () => {
    // Determine which hint to give based on discovered parts
    if (!discoveredFlagParts.has(1)) {
      toast({
        title: "Hint",
        description: "Check the authentication logs for failed login attempts. Look for unusual notes in the details.",
        variant: "default",
      });
    } else if (!discoveredFlagParts.has(2)) {
      toast({
        title: "Hint",
        description: "Examine firewall logs related to unusual port access. Check for suspicious comments.",
        variant: "default",
      });
    } else if (!discoveredFlagParts.has(3)) {
      toast({
        title: "Hint",
        description: "Investigate network logs for outbound connections to suspicious IPs. Look at the alert fields.",
        variant: "default",
      });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-bold">SOC Analyst Training</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            Log Analysis Challenge
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 overflow-hidden container mx-auto px-4 py-4">
        <div className="grid grid-cols-12 gap-4 h-full">
          {/* Left Sidebar - Log Sources */}
          <div className="col-span-2 h-full flex flex-col gap-4">
            <LogSource
              activeSource={activeSource}
              onSourceChange={handleSourceChange}
            />
            
            <div className="flex-1 glass-panel rounded-lg flex flex-col">
              <div className="p-3 border-b border-border">
                <h3 className="text-sm font-medium">Visualizations</h3>
              </div>
              <div className="p-2 space-y-1">
                <button
                  onClick={() => setSelectedViz('severity')}
                  className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                    selectedViz === 'severity'
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ChartBar className="h-4 w-4 mr-2" />
                  Severity
                </button>
                <button
                  onClick={() => setSelectedViz('type')}
                  className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                    selectedViz === 'type'
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ChartBar className="h-4 w-4 mr-2" />
                  Log Types
                </button>
                <button
                  onClick={() => setSelectedViz('ips')}
                  className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                    selectedViz === 'ips'
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ChartBar className="h-4 w-4 mr-2" />
                  Top IPs
                </button>
              </div>
              <div className="flex-1 p-4">
                <Visualization logs={filteredLogs} selectedViz={selectedViz} />
              </div>
            </div>
          </div>
          
          {/* Middle - Timeline and Search */}
          <div className="col-span-4 h-full flex flex-col gap-4">
            <SearchBar
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              activeFilters={filters}
            />
            
            <div className="flex-1 glass-panel rounded-lg flex flex-col overflow-hidden">
              <div className="p-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-medium">Timeline</h3>
                <span className="text-xs text-muted-foreground">
                  {filteredLogs.length} logs
                </span>
              </div>
              <div className="flex-1 overflow-hidden">
                <Timeline
                  logs={filteredLogs}
                  onLogSelect={handleLogSelect}
                  selectedLog={selectedLog}
                />
              </div>
            </div>
          </div>
          
          {/* Right - Log Details */}
          <div className="col-span-6 h-full flex flex-col gap-4">
            <LogViewer
              log={selectedLog}
              searchQuery={searchQuery}
              onClose={() => setSelectedLog(null)}
            />
            
            <HintSystem
              discoveredParts={discoveredFlagParts.size}
              onRequestHint={handleRequestHint}
            />
          </div>
        </div>
      </main>
      
      {/* Flag success message */}
      {showFlagMessage && foundFlag && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50 animate-fade-in">
          <div className="glass-panel max-w-md p-6 rounded-lg border border-success/30 accent-glow animate-scale-in">
            <div className="flex items-center justify-center text-success mb-4">
              <Check className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">Congratulations!</h2>
            <p className="text-center mb-4">
              You have successfully identified the suspicious activity and uncovered the hidden flag:
            </p>
            <div className="bg-secondary/70 font-mono p-3 rounded-md text-center text-lg mb-4 border border-border">
              {foundFlag}
            </div>
            <p className="text-sm text-muted-foreground text-center mb-4">
              You've demonstrated the skills necessary for a SOC analyst to investigate and uncover security incidents through log analysis.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowFlagMessage(false)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2 rounded-md"
              >
                Continue Investigation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
