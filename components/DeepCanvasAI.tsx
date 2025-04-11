import React from 'react';
import { Brain, Zap, Sparkles } from 'lucide-react';
import GeminiStudio from './GeminiStudio';

const DeepCanvasAI: React.FC = () => {
  return (
    <div className="bg-card/50 border border-white/10 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">DeepCanvas AI Assistant</h2>
          <div className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
            Powered by Gemini
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Pro Features</span>
          </button>
          <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
            <Zap className="h-3.5 w-3.5" />
            <span>Help</span>
          </button>
        </div>
      </div>

      <div className="h-[500px]">
        <GeminiStudio />
      </div>
    </div>
  );
};

export default DeepCanvasAI;
