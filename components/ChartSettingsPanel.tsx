import React, { useState } from 'react';
import { useTickerStore } from '../utils/tickerStore';
import { X, Settings, Grid, Palette, BarChart2, RefreshCw } from 'lucide-react';
import ColorPicker from './ColorPicker';

interface ChartSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChartSettingsPanel: React.FC<ChartSettingsPanelProps> = ({ isOpen, onClose }) => {
  const {
    showGrid,
    setShowGrid,
    candleStyle,
    setCandleStyle,
    showVolume,
    setShowVolume,
    showUptickDowntick,
    setShowUptickDowntick,
    chartBackgroundColor,
    setChartBackgroundColor,
    upCandleColor,
    setUpCandleColor,
    downCandleColor,
    setDownCandleColor,
    resetColors
  } = useTickerStore();

  const [activeTab, setActiveTab] = useState('appearance');

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-4 w-80 bg-card border border-white/10 rounded-md shadow-lg z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Settings className="h-4 w-4 text-primary" />
          <h3 className="font-medium">Chart Settings</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-md transition-colors"
          aria-label="Close settings"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          className={`flex-1 py-2 px-3 text-sm font-medium ${
            activeTab === 'appearance' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('appearance')}
        >
          <div className="flex items-center justify-center space-x-1">
            <Palette className="h-3.5 w-3.5" />
            <span>Appearance</span>
          </div>
        </button>
        <button
          className={`flex-1 py-2 px-3 text-sm font-medium ${
            activeTab === 'colors' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('colors')}
        >
          <div className="flex items-center justify-center space-x-1">
            <Palette className="h-3.5 w-3.5" />
            <span>Colors</span>
          </div>
        </button>
        <button
          className={`flex-1 py-2 px-3 text-sm font-medium ${
            activeTab === 'indicators' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('indicators')}
        >
          <div className="flex items-center justify-center space-x-1">
            <BarChart2 className="h-3.5 w-3.5" />
            <span>Indicators</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Chart Display</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center space-x-2">
                    <Grid className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Show Grid Lines</span>
                  </label>
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      showGrid ? 'bg-primary' : 'bg-input'
                    }`}
                  >
                    <span
                      className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                        showGrid ? 'translate-x-4' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm flex items-center space-x-2">
                    <BarChart2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Show Volume</span>
                  </label>
                  <button
                    onClick={() => setShowVolume(!showVolume)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      showVolume ? 'bg-primary' : 'bg-input'
                    }`}
                  >
                    <span
                      className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                        showVolume ? 'translate-x-4' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Candlestick Style</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setCandleStyle('default')}
                  className={`p-2 rounded-md border text-xs flex flex-col items-center space-y-1 ${
                    candleStyle === 'default'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 hover:bg-card/70'
                  }`}
                >
                  <div className="w-4 h-8 flex flex-col justify-center">
                    <div className="w-4 h-4 bg-[#51a958]"></div>
                    <div className="w-4 h-4 bg-[#ea3d3d]"></div>
                  </div>
                  <span>Default</span>
                </button>
                <button
                  onClick={() => setCandleStyle('hollow')}
                  className={`p-2 rounded-md border text-xs flex flex-col items-center space-y-1 ${
                    candleStyle === 'hollow'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 hover:bg-card/70'
                  }`}
                >
                  <div className="w-4 h-8 flex flex-col justify-center">
                    <div className="w-4 h-4 border border-[#51a958]"></div>
                    <div className="w-4 h-4 bg-[#ea3d3d]"></div>
                  </div>
                  <span>Hollow</span>
                </button>
                <button
                  onClick={() => setCandleStyle('colored')}
                  className={`p-2 rounded-md border text-xs flex flex-col items-center space-y-1 ${
                    candleStyle === 'colored'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 hover:bg-card/70'
                  }`}
                >
                  <div className="w-4 h-8 flex flex-col justify-center">
                    <div className="w-4 h-4 bg-[#51a958] border-2 border-[#51a958]"></div>
                    <div className="w-4 h-4 bg-[#ea3d3d] border-2 border-[#ea3d3d]"></div>
                  </div>
                  <span>Colored</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'colors' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-medium">Chart Colors</h4>
              <button
                onClick={resetColors}
                className="flex items-center space-x-1 text-xs px-2 py-1 rounded-md border border-white/10 hover:bg-card/70"
                title="Reset to default colors"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <ColorPicker
                  label="Chart Background"
                  color={chartBackgroundColor}
                  onChange={setChartBackgroundColor}
                  presetColors={['#0a0a0a', '#121212', '#1a1a1a', '#242424', '#2d2d2d', '#ffffff', '#f5f5f5', '#e0e0e0']}
                />
              </div>

              <div className="pt-2 border-t border-white/10">
                <h5 className="text-sm font-medium mb-3">Candlestick Colors</h5>
                <div className="space-y-3">
                  <ColorPicker
                    label="Bullish (Up) Candles"
                    color={upCandleColor}
                    onChange={setUpCandleColor}
                    presetColors={['#51a958', '#00ff00', '#32cd32', '#008000', '#3cb371', '#00ced1', '#1e90ff', '#4169e1']}
                  />

                  <ColorPicker
                    label="Bearish (Down) Candles"
                    color={downCandleColor}
                    onChange={setDownCandleColor}
                    presetColors={['#ea3d3d', '#ff0000', '#dc143c', '#b22222', '#8b0000', '#ff4500', '#ff6347', '#ff7f50']}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <h5 className="text-sm font-medium mb-2">Color Schemes</h5>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setChartBackgroundColor('#0a0a0a');
                      setUpCandleColor('#51a958');
                      setDownCandleColor('#ea3d3d');
                    }}
                    className="p-2 rounded-md border border-white/10 hover:bg-card/70 text-xs"
                  >
                    <div className="flex justify-between mb-1">
                      <div className="w-4 h-4 bg-[#51a958]"></div>
                      <div className="w-4 h-4 bg-[#ea3d3d]"></div>
                    </div>
                    <div className="text-center">Classic</div>
                  </button>

                  <button
                    onClick={() => {
                      setChartBackgroundColor('#ffffff');
                      setUpCandleColor('#26a69a');
                      setDownCandleColor('#ef5350');
                    }}
                    className="p-2 rounded-md border border-white/10 hover:bg-card/70 text-xs"
                  >
                    <div className="flex justify-between mb-1">
                      <div className="w-4 h-4 bg-[#26a69a]"></div>
                      <div className="w-4 h-4 bg-[#ef5350]"></div>
                    </div>
                    <div className="text-center">Light</div>
                  </button>

                  <button
                    onClick={() => {
                      setChartBackgroundColor('#131722');
                      setUpCandleColor('#089981');
                      setDownCandleColor('#f23645');
                    }}
                    className="p-2 rounded-md border border-white/10 hover:bg-card/70 text-xs"
                  >
                    <div className="flex justify-between mb-1">
                      <div className="w-4 h-4 bg-[#089981]"></div>
                      <div className="w-4 h-4 bg-[#f23645]"></div>
                    </div>
                    <div className="text-center">TradingView</div>
                  </button>

                  <button
                    onClick={() => {
                      setChartBackgroundColor('#000000');
                      setUpCandleColor('#5dc7c2');
                      setDownCandleColor('#e06666');
                    }}
                    className="p-2 rounded-md border border-white/10 hover:bg-card/70 text-xs"
                  >
                    <div className="flex justify-between mb-1">
                      <div className="w-4 h-4 bg-[#5dc7c2]"></div>
                      <div className="w-4 h-4 bg-[#e06666]"></div>
                    </div>
                    <div className="text-center">High Contrast</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'indicators' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Technical Indicators</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Uptick-Downtick</label>
                  <button
                    onClick={() => setShowUptickDowntick(!showUptickDowntick)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      showUptickDowntick ? 'bg-primary' : 'bg-input'
                    }`}
                  >
                    <span
                      className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                        showUptickDowntick ? 'translate-x-4' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {/* More indicators can be added here */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartSettingsPanel;
