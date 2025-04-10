import React from 'react';

const LoadingFallback: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingFallback;
