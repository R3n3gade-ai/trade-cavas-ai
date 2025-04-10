import React from 'react';

interface ChartContainerProps {
  symbol: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ symbol }) => {
  return (
    <div className="bg-card/50 rounded-lg p-4 h-[300px] flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground mb-2">Chart for {symbol}</p>
        <p className="text-sm text-muted-foreground">
          Charts functionality will be implemented in the future
        </p>
      </div>
    </div>
  );
};

export default ChartContainer;
