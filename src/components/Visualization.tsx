
import { LogEntry } from '@/utils/logData';
import { extractIPs } from '@/utils/searchUtils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface VisualizationProps {
  logs: LogEntry[];
  selectedViz: 'severity' | 'type' | 'ips';
}

const Visualization = ({ logs, selectedViz }: VisualizationProps) => {
  // Prepare data for severity chart
  const prepareSeverityData = () => {
    const counts = {
      info: 0,
      warning: 0,
      error: 0,
      critical: 0
    };
    
    logs.forEach(log => {
      counts[log.severity as keyof typeof counts] += 1;
    });
    
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };
  
  // Prepare data for type chart
  const prepareTypeData = () => {
    const counts = {
      auth: 0,
      firewall: 0,
      network: 0,
      system: 0
    };
    
    logs.forEach(log => {
      counts[log.type as keyof typeof counts] += 1;
    });
    
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };
  
  // Prepare data for IPs chart
  const prepareIPData = () => {
    const ips = extractIPs(logs);
    const counts: {[key: string]: number} = {};
    
    logs.forEach(log => {
      Object.values(log.details).forEach(value => {
        if (typeof value === 'string' && ips.includes(value)) {
          if (!counts[value]) {
            counts[value] = 0;
          }
          counts[value] += 1;
        }
      });
    });
    
    // Only return top 5 IPs by count
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  };
  
  // Get chart color based on viz type
  const getChartColor = () => {
    switch (selectedViz) {
      case 'severity':
        return '#60a5fa';
      case 'type':
        return '#34d399';
      case 'ips':
        return '#f97316';
      default:
        return '#60a5fa';
    }
  };
  
  // Get chart data based on selected visualization
  const getData = () => {
    switch (selectedViz) {
      case 'severity':
        return prepareSeverityData();
      case 'type':
        return prepareTypeData();
      case 'ips':
        return prepareIPData();
      default:
        return [];
    }
  };
  
  const data = getData();
  const chartColor = getChartColor();
  
  return (
    <div className="h-full flex flex-col animate-fade-in">
      <h3 className="text-sm font-medium text-muted-foreground mb-4 capitalize">
        {selectedViz === 'ips' ? 'Top IPs' : `${selectedViz} Distribution`}
      </h3>
      
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No data to display</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type="number" stroke="#888" fontSize={12} />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100} 
              stroke="#888" 
              fontSize={12} 
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'hsl(var(--popover))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
              cursor={{ fill: 'hsl(var(--muted))' }}
            />
            <Bar 
              dataKey="value" 
              fill={chartColor} 
              radius={[0, 4, 4, 0]} 
              barSize={20}
              animationDuration={500}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Visualization;
