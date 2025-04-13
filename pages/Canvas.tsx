import React, { useState, useCallback, useRef, DragEvent } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Plus, Trash2, Save, Download, ChevronDown, BarChart2, LineChart, CandlestickChart, BrainCircuit, Bitcoin, DollarSign, Activity } from 'lucide-react';

// Import ReactFlow components
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
  ReactFlowProvider,
  NodeTypes,
  NodeProps,
  Handle,
  Position,
  XYPosition,
  useReactFlow,
} from '@xyflow/react';

// Import ReactFlow styles
import '@xyflow/react/dist/style.css';
import '../styles/reactflow.css';

// Define custom node component
const CustomNode = ({ data }: NodeProps) => {
  return (
    <div className="react-flow__node-default custom-node">
      <div className="custom-node-header">
        <div>{data.label}</div>
      </div>
      <div className="custom-node-content">
        {data.content}
      </div>
      <Handle id="top" type="source" position={Position.Top} />
      <Handle id="right" type="source" position={Position.Right} />
      <Handle id="bottom" type="source" position={Position.Bottom} />
      <Handle id="left" type="source" position={Position.Left} />
      <Handle id="top-target" type="target" position={Position.Top} />
      <Handle id="right-target" type="target" position={Position.Right} />
      <Handle id="bottom-target" type="target" position={Position.Bottom} />
      <Handle id="left-target" type="target" position={Position.Left} />
    </div>
  );
};

// Define node types
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

// Initial nodes
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'Input', content: 'Market Data' },
    position: { x: 250, y: 50 },
  },
  {
    id: '2',
    type: 'custom',
    data: { label: 'Process', content: 'Technical Analysis' },
    position: { x: 250, y: 200 },
  },
  {
    id: '3',
    type: 'custom',
    data: { label: 'Output', content: 'Trading Signal' },
    position: { x: 250, y: 350 },
  },
];

// Initial edges
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-3', source: '2', target: '3', markerEnd: { type: MarkerType.ArrowClosed } },
];

// Flow component that uses ReactFlow
const FlowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlow = useReactFlow();

  // State for dropdown menus
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Node types for each category
  const nodeCategories = {
    technicals: [
      { type: 'custom', label: 'RSI', content: 'Relative Strength Index' },
      { type: 'custom', label: 'MACD', content: 'Moving Average Convergence Divergence' },
      { type: 'custom', label: 'Moving Average', content: 'Simple Moving Average' },
      { type: 'custom', label: 'Bollinger Bands', content: 'Volatility Indicator' },
    ],
    options: [
      { type: 'custom', label: 'Greeks', content: 'Option Greeks Calculator' },
      { type: 'custom', label: 'IV Rank', content: 'Implied Volatility Rank' },
      { type: 'custom', label: 'Option Chain', content: 'Option Chain Data' },
      { type: 'custom', label: 'Strategies', content: 'Option Strategies' },
    ],
    darkpool: [
      { type: 'custom', label: 'Volume', content: 'Dark Pool Volume' },
      { type: 'custom', label: 'Prints', content: 'Dark Pool Prints' },
      { type: 'custom', label: 'Levels', content: 'Dark Pool Levels' },
    ],
    fundamentals: [
      { type: 'custom', label: 'Earnings', content: 'Earnings Data' },
      { type: 'custom', label: 'P/E Ratio', content: 'Price to Earnings Ratio' },
      { type: 'custom', label: 'Market Cap', content: 'Market Capitalization' },
      { type: 'custom', label: 'Revenue', content: 'Company Revenue' },
    ],
    crypto: [
      { type: 'custom', label: 'Bitcoin', content: 'BTC Data' },
      { type: 'custom', label: 'Ethereum', content: 'ETH Data' },
      { type: 'custom', label: 'Altcoins', content: 'Altcoin Data' },
      { type: 'custom', label: 'DeFi', content: 'DeFi Metrics' },
    ],
    llms: [
      { type: 'custom', label: 'Gemini', content: 'Google Gemini API' },
      { type: 'custom', label: 'OpenAI', content: 'OpenAI GPT API' },
      { type: 'custom', label: 'Claude', content: 'Anthropic Claude API' },
      { type: 'custom', label: 'DeepSeek', content: 'DeepSeek AI API' },
      { type: 'custom', label: 'DeepCanvas', content: 'DeepCanvas AI API' },
    ],
    chart: [
      { type: 'custom', label: 'Candlestick', content: 'Candlestick Chart' },
      { type: 'custom', label: 'Line', content: 'Line Chart' },
      { type: 'custom', label: 'OHLC', content: 'OHLC Chart' },
      { type: 'custom', label: 'Heikin-Ashi', content: 'Heikin-Ashi Chart' },
    ],
  };

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection) => {
      // Create a new edge with the connection parameters
      const newEdge = {
        ...params,
        animated: true,
        style: { stroke: '#fff', strokeWidth: 2 },
        type: 'smoothstep',
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Handle node drag start
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeData: any) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  // Handle drop on canvas
  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const data = event.dataTransfer.getData('application/reactflow');

      if (!reactFlowBounds || !data) return;

      const nodeData = JSON.parse(data);
      const position = reactFlow.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: nodeData.type,
        position,
        data: { label: nodeData.label, content: nodeData.content },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlow, setNodes]
  );

  // Handle drag over
  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Clear the canvas
  const clearCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  // Save the flow
  const saveFlow = useCallback(() => {
    const flow = { nodes, edges };
    localStorage.setItem('savedFlow', JSON.stringify(flow));
    alert('Flow saved successfully!');
  }, [nodes, edges]);

  // Load the flow
  const loadFlow = useCallback(() => {
    const savedFlow = localStorage.getItem('savedFlow');
    if (savedFlow) {
      const flow = JSON.parse(savedFlow);
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
    }
  }, [setNodes, setEdges]);

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (openDropdown && !(event.target as Element).closest('.dropdown-container')) {
      setOpenDropdown(null);
    }
  }, [openDropdown]);

  // Add event listener for clicks outside dropdown
  React.useEffect(() => {
    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown, handleClickOutside]);

  return (
    <div className="flex flex-col h-full">
      {/* Header with controls */}
      <div className="flex justify-between items-center p-2 bg-card border-b border-white/10">
        {/* Category buttons with dropdowns */}
        <div className="flex space-x-2">
          {/* Technicals dropdown */}
          <div className="relative dropdown-container">
            <button
              className="flex items-center space-x-1 bg-primary/10 hover:bg-primary/20 text-white px-2 py-1 rounded-md text-sm"
              onClick={() => setOpenDropdown(openDropdown === 'technicals' ? null : 'technicals')}
            >
              <Activity className="h-4 w-4" />
              <span>Technicals</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {openDropdown === 'technicals' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-card rounded-md shadow-lg border border-white/10 z-10">
                <div className="p-1 flex flex-col">
                  {nodeCategories.technicals.map((node, index) => (
                    <div
                      key={index}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md text-white cursor-grab"
                      draggable
                      onDragStart={(event) => onDragStart(event, node)}
                    >
                      {node.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Options dropdown */}
          <div className="relative dropdown-container">
            <button
              className="flex items-center space-x-1 bg-primary/10 hover:bg-primary/20 text-white px-2 py-1 rounded-md text-sm"
              onClick={() => setOpenDropdown(openDropdown === 'options' ? null : 'options')}
            >
              <DollarSign className="h-4 w-4" />
              <span>Options</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {openDropdown === 'options' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-card rounded-md shadow-lg border border-white/10 z-10">
                <div className="p-1 flex flex-col">
                  {nodeCategories.options.map((node, index) => (
                    <div
                      key={index}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md text-white cursor-grab"
                      draggable
                      onDragStart={(event) => onDragStart(event, node)}
                    >
                      {node.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark Pool dropdown */}
          <div className="relative dropdown-container">
            <button
              className="flex items-center space-x-1 bg-primary/10 hover:bg-primary/20 text-white px-2 py-1 rounded-md text-sm"
              onClick={() => setOpenDropdown(openDropdown === 'darkpool' ? null : 'darkpool')}
            >
              <BarChart2 className="h-4 w-4" />
              <span>Dark Pool</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {openDropdown === 'darkpool' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-card rounded-md shadow-lg border border-white/10 z-10">
                <div className="p-1 flex flex-col">
                  {nodeCategories.darkpool.map((node, index) => (
                    <div
                      key={index}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md text-white cursor-grab"
                      draggable
                      onDragStart={(event) => onDragStart(event, node)}
                    >
                      {node.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fundamentals dropdown */}
          <div className="relative dropdown-container">
            <button
              className="flex items-center space-x-1 bg-primary/10 hover:bg-primary/20 text-white px-2 py-1 rounded-md text-sm"
              onClick={() => setOpenDropdown(openDropdown === 'fundamentals' ? null : 'fundamentals')}
            >
              <LineChart className="h-4 w-4" />
              <span>Fundamentals</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {openDropdown === 'fundamentals' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-card rounded-md shadow-lg border border-white/10 z-10">
                <div className="p-1 flex flex-col">
                  {nodeCategories.fundamentals.map((node, index) => (
                    <div
                      key={index}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md text-white cursor-grab"
                      draggable
                      onDragStart={(event) => onDragStart(event, node)}
                    >
                      {node.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Crypto dropdown */}
          <div className="relative dropdown-container">
            <button
              className="flex items-center space-x-1 bg-primary/10 hover:bg-primary/20 text-white px-2 py-1 rounded-md text-sm"
              onClick={() => setOpenDropdown(openDropdown === 'crypto' ? null : 'crypto')}
            >
              <Bitcoin className="h-4 w-4" />
              <span>Crypto</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {openDropdown === 'crypto' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-card rounded-md shadow-lg border border-white/10 z-10">
                <div className="p-1 flex flex-col">
                  {nodeCategories.crypto.map((node, index) => (
                    <div
                      key={index}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md text-white cursor-grab"
                      draggable
                      onDragStart={(event) => onDragStart(event, node)}
                    >
                      {node.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* LLMs dropdown */}
          <div className="relative dropdown-container">
            <button
              className="flex items-center space-x-1 bg-primary/10 hover:bg-primary/20 text-white px-2 py-1 rounded-md text-sm"
              onClick={() => setOpenDropdown(openDropdown === 'llms' ? null : 'llms')}
            >
              <BrainCircuit className="h-4 w-4" />
              <span>AI Models</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {openDropdown === 'llms' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-card rounded-md shadow-lg border border-white/10 z-10">
                <div className="p-1 flex flex-col">
                  {nodeCategories.llms.map((node, index) => (
                    <div
                      key={index}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md text-white cursor-grab"
                      draggable
                      onDragStart={(event) => onDragStart(event, node)}
                    >
                      {node.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chart dropdown */}
          <div className="relative dropdown-container">
            <button
              className="flex items-center space-x-1 bg-primary/10 hover:bg-primary/20 text-white px-2 py-1 rounded-md text-sm"
              onClick={() => setOpenDropdown(openDropdown === 'chart' ? null : 'chart')}
            >
              <CandlestickChart className="h-4 w-4" />
              <span>Chart</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {openDropdown === 'chart' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-card rounded-md shadow-lg border border-white/10 z-10">
                <div className="p-1 flex flex-col">
                  {nodeCategories.chart.map((node, index) => (
                    <div
                      key={index}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md text-white cursor-grab"
                      draggable
                      onDragStart={(event) => onDragStart(event, node)}
                    >
                      {node.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2">
          <button
            className="flex items-center space-x-1 bg-primary/10 hover:bg-primary/20 text-white px-2 py-1 rounded-md text-sm"
            onClick={() => {
              const newNode = {
                id: `node-${Date.now()}`,
                type: 'custom',
                data: { label: 'New Node', content: 'Node Content' },
                position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
              };
              setNodes((nds) => [...nds, newNode]);
            }}
          >
            <Plus className="h-4 w-4" />
            <span>Add Node</span>
          </button>
          <button
            className="flex items-center space-x-1 bg-primary/10 hover:bg-primary/20 text-white px-2 py-1 rounded-md text-sm"
            onClick={saveFlow}
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
          <button
            className="flex items-center space-x-1 bg-primary/10 hover:bg-primary/20 text-white px-2 py-1 rounded-md text-sm"
            onClick={loadFlow}
          >
            <Download className="h-4 w-4" />
            <span>Load</span>
          </button>
          <button
            className="flex items-center space-x-1 bg-primary/10 hover:bg-primary/20 text-white px-2 py-1 rounded-md text-sm"
            onClick={clearCanvas}
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* ReactFlow canvas */}
      <div className="flex-grow" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          style={{ width: '100%', height: 'calc(100vh - 60px)' }}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#fff', strokeWidth: 2 },
          }}
          connectionLineStyle={{ stroke: '#fff', strokeWidth: 2 }}
          connectionLineType="smoothstep"
          snapToGrid={true}
          snapGrid={[15, 15]}
        >
          <Background color="#aaa" gap={16} />
          <Controls />
          <MiniMap />
          <Panel position="top-right">
            <div className="bg-card p-2 rounded-md shadow-sm border border-white/10">
              <p className="text-xs text-white">Trading Strategy Builder</p>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

// Main Canvas component with ReactFlow provider
const Canvas: React.FC = () => {
  return (
    <DashboardLayout title="Canvas">
      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
    </DashboardLayout>
  );
};

export default Canvas;
