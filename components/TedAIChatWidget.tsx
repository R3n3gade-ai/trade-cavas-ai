import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Brain, UploadCloud, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { useTedAIStore } from '../utils/tedAIStore';
import { Message } from '../utils/tedAITypes';
import { Button } from '@/components/ui/button';
import TedAISampleQueries from './TedAISampleQueries';
import ChartUploader from './ChartUploader';
import { toast } from 'sonner';

interface TedAIChatWidgetProps {
  expanded?: boolean;
  onToggleExpand?: () => void;
  className?: string;
}

export const TedAIChatWidget: React.FC<TedAIChatWidgetProps> = ({ 
  expanded = false, 
  onToggleExpand,
  className = ''
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [showChartUploader, setShowChartUploader] = useState(false);
  
  // Get TED AI store state
  const { 
    currentConversationId, 
    conversations, 
    isLoading, 
    isStreaming,
    streamingMessage,
    sendMessage,
    streamMessage,
    startNewConversation,
    fetchConversations,
  } = useTedAIStore();
  
  // Get current conversation messages
  const currentConversation = currentConversationId 
    ? conversations[currentConversationId] 
    : null;
  
  const messages = currentConversation?.messages || [];
  
  // Init: Fetch conversations and start new one if needed
  useEffect(() => {
    fetchConversations().then(() => {
      // If no current conversation, start a new one
      if (!currentConversationId) {
        startNewConversation();
      }
    });
  }, []);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage, expanded]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    
    // Check for chart analysis commands
    const chartAnalysisKeywords = [
      'analyze chart', 'chart analysis', 'analyze image', 
      'analyze trading chart', 'read this chart', 'what do you see in this chart', 
      'interpret chart', 'technical analysis'
    ];
    
    const isChartAnalysisRequest = chartAnalysisKeywords.some(keyword => 
      inputValue.toLowerCase().includes(keyword)
    );
    
    if (isChartAnalysisRequest) {
      // Store the query for when the chart is uploaded
      setShowChartUploader(true);
      // Don't clear input yet so user still sees their request
      return;
    }
    
    try {
      // Clear input immediately for better UX
      const messageText = inputValue;
      setInputValue('');
      
      // Use streaming for better UX
      await streamMessage(messageText);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };
  
  // Handle textarea resize and submit with Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };
  
  const handleQuerySelect = (query: string) => {
    setInputValue(query);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const handleChartAnalysisComplete = (analysis) => {
    // Close the uploader
    setShowChartUploader(false);
    
    try {
      // Create a user message based on input or default
      const userMessage = inputValue.trim() !== '' ? 
        inputValue : 
        `Analyze this chart${analysis.chart_symbol ? ` of ${analysis.chart_symbol}` : ''}`;
      
      // Clear the input field
      setInputValue('');
      
      // Format the analysis content with additional insights
      let enhancedAnalysisContent = analysis.analysis || 'Analysis not available';
      
      // Add the analysis to the conversation
      // This is a simplified version - in a real implementation, you would
      // properly integrate with the TedAIStore
      toast.success('Chart analysis complete!');
      
      // For now, we'll just send the user message and let the AI respond
      streamMessage(userMessage);
    } catch (error) {
      console.error('Error handling chart analysis:', error);
      toast.error('Failed to process chart analysis');
    }
  };
  
  // Format timestamp to readable time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Render message content with markdown-like formatting
  const renderMessageContent = (content: string) => {
    // Simple markdown-like rendering
    // In a real implementation, you would use a proper markdown renderer
    return content.split('\n').map((line, i) => (
      <div key={i} className={line.startsWith('- ') ? 'ml-4' : ''}>
        {line}
      </div>
    ));
  };
  
  return (
    <div className={`flex flex-col bg-card border border-white/10 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <h3 className="font-medium">TED AI Assistant</h3>
        </div>
        {onToggleExpand && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={onToggleExpand}
          >
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        )}
      </div>
      
      {/* Chart Uploader */}
      {showChartUploader && (
        <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <ChartUploader 
            onAnalysisComplete={handleChartAnalysisComplete} 
            onCancel={() => setShowChartUploader(false)} 
          />
        </div>
      )}
      
      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto p-3 ${expanded ? 'max-h-[400px]' : 'max-h-[200px]'}`}>
        {messages.length === 0 && !isStreaming ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <Brain className="h-8 w-8 text-primary mb-2" />
            <h3 className="text-lg font-medium mb-1">TED AI Assistant</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ask me about market analysis, trading strategies, or technical indicators
            </p>
            <TedAISampleQueries onQuerySelect={handleQuerySelect} />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message: Message) => (
              <div 
                key={message.id} 
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card border border-white/10'
                  }`}
                >
                  <div className="text-sm">{renderMessageContent(message.content)}</div>
                  <div className="text-xs mt-1 opacity-70 text-right">
                    {formatTime(message.timestamp)}
                  </div>
                  
                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, index) => (
                        <div key={index} className="border border-white/10 rounded-md overflow-hidden">
                          {attachment.type === 'chart' && (
                            <div>
                              <div className="p-2 text-xs font-medium">{attachment.title}</div>
                              <img 
                                src={attachment.preview} 
                                alt={attachment.title} 
                                className="w-full h-auto"
                              />
                            </div>
                          )}
                          {attachment.type === 'link' && (
                            <a 
                              href={attachment.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block p-2 text-xs text-primary hover:underline"
                            >
                              {attachment.title}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Streaming message */}
            {isStreaming && streamingMessage && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-card border border-white/10">
                  <div className="text-sm">{renderMessageContent(streamingMessage)}</div>
                  <div className="text-xs mt-1 opacity-70 text-right">
                    {formatTime(new Date().toISOString())}
                  </div>
                </div>
              </div>
            )}
            
            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-start gap-2">
          <div className="relative flex-grow">
            <textarea
              ref={inputRef}
              className="w-full bg-background border border-white/10 rounded-md px-4 py-2 min-h-[44px] max-h-[120px] focus:outline-none focus:border-primary resize-none"
              placeholder="Ask TED AI about markets, strategies, or analysis..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <div className="absolute top-2 right-2">
              <button 
                className="p-1 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                title="Voice input"
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <button 
            className="flex items-center justify-center p-2 rounded-md bg-background border border-white/10 hover:bg-card/80 text-primary transition-colors"
            title="Upload chart for analysis"
            onClick={() => setShowChartUploader(true)}
          >
            <UploadCloud className="h-5 w-5" />
          </button>
          
          <button 
            className="flex items-center justify-center p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            onClick={handleSendMessage}
            disabled={isLoading || inputValue.trim() === ''}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TedAIChatWidget;
