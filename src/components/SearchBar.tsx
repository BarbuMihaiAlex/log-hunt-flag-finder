
import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { LogType } from '@/utils/logData';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
  activeFilters: any;
}

const SearchBar = ({ onSearch, onFilterChange, activeFilters }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const logTypes: LogType[] = ['auth', 'firewall', 'network', 'system'];
  const severities = ['info', 'warning', 'error', 'critical'];
  
  const handleSearch = () => {
    onSearch(query);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const toggleFilter = (type: 'severity' | 'type', value: string) => {
    const currentFilters = { ...activeFilters };
    
    if (!currentFilters[type]) {
      currentFilters[type] = [value];
    } else if (currentFilters[type].includes(value)) {
      currentFilters[type] = currentFilters[type].filter((v: string) => v !== value);
      if (currentFilters[type].length === 0) {
        delete currentFilters[type];
      }
    } else {
      currentFilters[type] = [...currentFilters[type], value];
    }
    
    onFilterChange(currentFilters);
  };
  
  const clearFilters = () => {
    onFilterChange({});
  };
  
  const hasActiveFilters = Object.keys(activeFilters).length > 0;
  
  return (
    <div className="w-full space-y-2 animate-slide-down">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          className="w-full bg-secondary/50 pl-10 pr-16 py-2 rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          placeholder="Search logs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 mr-1 rounded-md ${showFilters ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'}`}
            aria-label="Toggle filters"
          >
            <Filter className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleSearch}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2 rounded-md mr-1"
          >
            Search
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="p-3 bg-secondary/60 backdrop-blur-md rounded-md border border-border animate-scale-in">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Filters</h3>
            {hasActiveFilters && (
              <button 
                onClick={clearFilters}
                className="text-xs flex items-center text-muted-foreground hover:text-foreground"
              >
                Clear all <X className="ml-1 h-3 w-3" />
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-medium mb-1.5">Log Type</h4>
              <div className="flex flex-wrap gap-1.5">
                {logTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleFilter('type', type)}
                    className={`text-xs px-2 py-1 rounded-full transition-colors ${
                      activeFilters.type?.includes(type)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-medium mb-1.5">Severity</h4>
              <div className="flex flex-wrap gap-1.5">
                {severities.map((severity) => (
                  <button
                    key={severity}
                    onClick={() => toggleFilter('severity', severity)}
                    className={`text-xs px-2 py-1 rounded-full transition-colors ${
                      activeFilters.severity?.includes(severity)
                        ? getSeverityButtonClass(severity)
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {severity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get severity-specific button classes
const getSeverityButtonClass = (severity: string): string => {
  switch (severity) {
    case 'info':
      return 'bg-blue-500/90 text-white';
    case 'warning':
      return 'bg-amber-500/90 text-white';
    case 'error':
      return 'bg-red-500/90 text-white';
    case 'critical':
      return 'bg-purple-600/90 text-white';
    default:
      return 'bg-primary text-primary-foreground';
  }
};

export default SearchBar;
