import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Pencil, Image, Layers, Share2, Download, Save } from 'lucide-react';

const Canvas: React.FC = () => {
  return (
    <DashboardLayout title="Canvas">
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Canvas</h1>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-1 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-md text-sm">
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button className="flex items-center space-x-1 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-md text-sm">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
            <button className="flex items-center space-x-1 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-md text-sm">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tools Panel */}
          <div className="lg:col-span-1">
            <div className="bg-card p-4 rounded-lg shadow-sm border border-white/10">
              <h3 className="text-lg font-medium mb-4">Tools</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex flex-col items-center justify-center p-3 bg-background hover:bg-accent rounded-md transition-colors">
                    <Pencil className="h-6 w-6 mb-1" />
                    <span className="text-xs">Draw</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 bg-background hover:bg-accent rounded-md transition-colors">
                    <Image className="h-6 w-6 mb-1" />
                    <span className="text-xs">Image</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-3 bg-background hover:bg-accent rounded-md transition-colors">
                    <Layers className="h-6 w-6 mb-1" />
                    <span className="text-xs">Layers</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Recent Canvases</h3>
                  <div className="space-y-1">
                    <div className="p-2 hover:bg-accent rounded-md cursor-pointer">
                      <p className="text-sm font-medium">SPY Analysis</p>
                      <p className="text-xs text-muted-foreground">Last edited: 2 days ago</p>
                    </div>
                    <div className="p-2 hover:bg-accent rounded-md cursor-pointer">
                      <p className="text-sm font-medium">AAPL Earnings</p>
                      <p className="text-xs text-muted-foreground">Last edited: 1 week ago</p>
                    </div>
                    <div className="p-2 hover:bg-accent rounded-md cursor-pointer">
                      <p className="text-sm font-medium">Market Overview</p>
                      <p className="text-xs text-muted-foreground">Last edited: 2 weeks ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <div className="bg-card p-4 rounded-lg shadow-sm border border-white/10 h-[600px] flex items-center justify-center">
              <div className="text-center p-6">
                <h3 className="text-xl font-medium mb-2">Canvas Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  The canvas feature is currently under development. Check back soon for updates!
                </p>
                <div className="inline-block p-4 rounded-full bg-primary/10">
                  <Pencil className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Canvas;
