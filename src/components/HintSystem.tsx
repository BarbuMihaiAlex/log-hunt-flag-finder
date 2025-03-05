
import { useState } from 'react';
import { HelpCircle, ChevronRight, ChevronDown, CheckCircle } from 'lucide-react';

interface HintSystemProps {
  discoveredParts: number;
  onRequestHint: () => void;
}

const HintSystem = ({ discoveredParts, onRequestHint }: HintSystemProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const hints = [
    "Look for unusual login patterns in the authentication logs",
    "Check for suspicious IP addresses in the firewall logs",
    "Analyze network traffic for data exfiltration attempts",
    "Each log containing part of the flag will have a special note, comment, or alert field",
    "Connect the dots between different log types to uncover the full attack path"
  ];
  
  return (
    <div className="glass-panel rounded-lg py-2 animate-slide-up">
      {/* Header - always visible */}
      <div 
        className="px-4 py-2 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <HelpCircle className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium">Investigation Help</h3>
        </div>
        <div className="flex items-center">
          <span className="text-sm mr-2">
            {discoveredParts}/3 parts found
          </span>
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>
      
      {/* Expanded content */}
      {expanded && (
        <div className="px-4 py-2 border-t border-border animate-slide-down">
          <p className="text-sm text-muted-foreground mb-3">
            The flag is hidden across multiple logs. Search for suspicious patterns to uncover all parts.
          </p>
          
          <h4 className="text-sm font-medium mb-2">Hints:</h4>
          <ul className="space-y-2 mb-4">
            {hints.map((hint, index) => (
              <li key={index} className="flex text-sm">
                <span className="text-muted-foreground mr-2">{index + 1}.</span>
                <span>{hint}</span>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-1">Progress:</span>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 w-8 rounded-full ${
                      i < discoveredParts 
                        ? 'bg-success' 
                        : 'bg-muted'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRequestHint();
              }}
              className="text-sm px-3 py-1 bg-secondary hover:bg-secondary/80 rounded-md"
            >
              Get Hint
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HintSystem;
