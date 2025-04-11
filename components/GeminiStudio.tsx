import React, { useState, useEffect, useRef } from 'react';
import { Rocket, Trash2, Settings, Mic, Share, Code, Save, Copy } from 'lucide-react';

// Add type definition for window
declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
    speechRecognition?: any;
  }
}

interface GeminiStudioProps {
  className?: string;
}

interface GeminiSettings {
  model: string;
  temperature: number;
  maxOutputTokens: number;
  topK: number;
  topP: number;
  apiKey: string;
  systemInstruction: string;
  enableCodeExecution: boolean;
  enableTools: boolean;
  compareMode: boolean;
  voiceLanguage: string;
}

interface GeminiResponse {
  generatedText: string;
}

const GeminiStudio: React.FC<GeminiStudioProps> = ({ className = '' }) => {
  // State for settings
  const [settings, setSettings] = useState<GeminiSettings>({
    model: 'gemini-1.5-flash-latest',
    temperature: 0.9,
    maxOutputTokens: 1024,
    topK: 1,
    topP: 1.0,
    apiKey: 'AIzaSyDOnRHxuSmGIL7VygWXzWJsSrgEeQipGII', // Using the provided API key
    systemInstruction: 'You are an AI assistant that provides accurate and up-to-date information. When asked about the current date, day, or time, always check the current date from the user\'s request timestamp and provide the most accurate information possible. Today is ' + new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + '.',
    enableCodeExecution: true,
    enableTools: false,
    compareMode: false,
    voiceLanguage: 'en-US',
  });

  // State for streaming and voice
  const [isStreaming, setIsStreaming] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  // State for prompt and response
  const [prompt, setPrompt] = useState('');
  const [outputMessages, setOutputMessages] = useState<Array<{ type: 'user' | 'ai'; content: string }>>([]);
  const [status, setStatus] = useState<'ready' | 'loading' | 'streaming' | 'error'>('ready');
  const [errorMessage, setErrorMessage] = useState('');
  const [streamingContent, setStreamingContent] = useState('');

  // Refs
  const outputDisplayRef = useRef<HTMLDivElement>(null);
  const promptTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle settings changes
  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    settingName: keyof GeminiSettings
  ) => {
    const value = e.target.type === 'range' ? parseFloat(e.target.value) : e.target.value;
    setSettings((prev) => ({
      ...prev,
      [settingName]: value,
    }));
  };

  // Handle voice input with real Web Speech API
  const toggleVoiceInput = () => {
    if (isVoiceListening) {
      // Stop listening
      window.speechRecognition?.stop();
      setIsVoiceListening(false);
    } else {
      // Start listening
      setIsVoiceListening(true);

      // Check if browser supports speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        // Use the Web Speech API
        const SpeechRecognitionAPI = window.webkitSpeechRecognition || window.SpeechRecognition;
        const recognition = new SpeechRecognitionAPI();

        // Store in window for stopping later
        window.speechRecognition = recognition;

        // Configure recognition
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = settings.voiceLanguage; // Use selected language

        // Handle results
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

          setPrompt(prev => prev + (prev ? ' ' : '') + transcript);
        };

        // Handle end of speech
        recognition.onend = () => {
          setIsVoiceListening(false);
        };

        // Handle errors
        recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setErrorMessage(`Voice input error: ${event.error}`);
          setIsVoiceListening(false);
        };

        // Start recognition
        recognition.start();
      } else {
        setErrorMessage('Voice input is not supported in your browser.');
        setIsVoiceListening(false);
      }
    }
  };

  // Handle screen sharing for streaming
  const handleScreenShare = async () => {
    try {
      // Request screen sharing
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always'
        },
        audio: false
      });

      // Toggle streaming mode
      setIsStreaming(true);
      setErrorMessage('');

      // Add event listener for when the user stops sharing
      mediaStream.getVideoTracks()[0].onended = () => {
        setIsStreaming(false);
      };
    } catch (error) {
      console.error('Error starting screen share:', error);
      setErrorMessage('Failed to start screen sharing. Please try again.');
    }
  };

  // Handle key press in textarea (Ctrl+Enter to submit)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleRunPrompt();
    }
  };

  // Handle running the prompt
  const handleRunPrompt = async () => {
    if (!prompt.trim()) {
      return;
    }

    // Add user message to chat
    setOutputMessages((prev) => [...prev, { type: 'user', content: prompt }]);

    // Update status
    setStatus(isStreaming ? 'streaming' : 'loading');
    setErrorMessage('');
    setStreamingContent('');

    try {
      if (isStreaming) {
        // Handle streaming response
        await streamResponse(prompt.trim());
      } else {
        // Call the backend API for non-streaming response
        const response = await callBackendApi({
          ...settings,
          prompt: prompt.trim(),
        });

        // Add AI response to chat
        setOutputMessages((prev) => [...prev, { type: 'ai', content: response.generatedText }]);
      }

      // Clear prompt and update status
      setPrompt('');
      setStatus('ready');
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  // Stream response from Gemini API
  const streamResponse = async (userPrompt: string) => {
    try {
      // Prepare system instructions if provided
      const contents: any[] = [];

      // Add system instruction if provided
      if (settings.systemInstruction.trim()) {
        contents.push({
          role: 'user',
          parts: [{ text: settings.systemInstruction }]
        });
        contents.push({
          role: 'model',
          parts: [{ text: "I'll follow these instructions." }]
        });
      }

      // Add the user's prompt
      contents.push({
        role: 'user',
        parts: [{ text: userPrompt }]
      });

      // Create a ReadableStream for streaming
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${settings.model}:streamGenerateContent?key=${settings.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents.length > 0 ? contents : [{
            parts: [{
              text: userPrompt
            }]
          }],
          generationConfig: {
            temperature: settings.temperature,
            maxOutputTokens: settings.maxOutputTokens,
            topK: settings.topK,
            topP: settings.topP
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
        throw new Error(`API Error (${response.status}): ${errorData.error?.message || 'Unknown error'}`);
      }

      // Get the reader from the stream
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get stream reader');
      }

      let fullText = '';

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value);

        // Process the chunk (it may contain multiple JSON objects)
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

            if (text) {
              fullText += text;
              setStreamingContent(fullText);
            }
          } catch (e) {
            console.error('Error parsing JSON from stream:', e);
          }
        }
      }

      // Once streaming is complete, add the full message to the chat
      setOutputMessages((prev) => [...prev, { type: 'ai', content: fullText }]);
      setStreamingContent('');
    } catch (error) {
      throw error;
    }
  };

  // Real implementation of the Gemini API call
  const callBackendApi = async (settings: GeminiSettings & { prompt: string }): Promise<GeminiResponse> => {
    try {
      // Prepare system instructions if provided
      const contents: any[] = [];

      // Add system instruction if provided
      if (settings.systemInstruction.trim()) {
        contents.push({
          role: 'user',
          parts: [{ text: settings.systemInstruction }]
        });
        contents.push({
          role: 'model',
          parts: [{ text: "I'll follow these instructions." }]
        });
      }

      // Add the user's prompt
      contents.push({
        role: 'user',
        parts: [{ text: settings.prompt }]
      });

      // Direct call to Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${settings.model}:generateContent?key=${settings.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents.length > 0 ? contents : [{
            parts: [{
              text: settings.prompt
            }]
          }],
          generationConfig: {
            temperature: settings.temperature,
            maxOutputTokens: settings.maxOutputTokens,
            topK: settings.topK,
            topP: settings.topP
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
        throw new Error(`API Error (${response.status}): ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();

      // Extract the generated text from the Gemini API response
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

      return { generatedText };
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  };

  // Handle clearing the chat
  const handleClearChat = () => {
    setOutputMessages([]);
    setStatus('ready');
    setErrorMessage('');
    setStreamingContent('');
  };

  // Render markdown content safely
  const renderMarkdown = (content: string) => {
    return { __html: content };
  };

  // Render function
  return (
    <div className={`flex h-full w-full border border-white/10 rounded-lg overflow-hidden ${className}`}>
      <div className="flex-1 flex flex-col bg-background/30">
        <div className="chat-area flex-1 p-6 overflow-y-auto" ref={outputDisplayRef}>
          {/* Compare Mode UI */}
          {settings.compareMode && (
            <div className="mb-6 p-4 bg-card/50 border border-white/10 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Compare Mode</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-card border border-white/10 rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Model 1</p>
                  <p className="text-sm font-medium">DeepCanvas Flash</p>
                </div>
                <div className="p-3 bg-card border border-white/10 rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Model 2</p>
                  <p className="text-sm font-medium">DeepCanvas Pro</p>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {outputMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground mb-4">
                Your DeepCanvas results will appear here. Let's create something awesome!
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-4xl">
                <div className="p-4 bg-card border border-white/10 rounded-md hover:bg-card/80 cursor-pointer"
                     onClick={() => setPrompt("Explain quantum computing in simple terms")}>
                  <p className="font-medium mb-1">Explain quantum computing</p>
                  <p className="text-sm text-muted-foreground">Get a simple explanation of a complex topic</p>
                </div>
                <div className="p-4 bg-card border border-white/10 rounded-md hover:bg-card/80 cursor-pointer"
                     onClick={() => setPrompt("Write a Python function to find prime numbers")}>
                  <p className="font-medium mb-1">Code generation</p>
                  <p className="text-sm text-muted-foreground">Generate code samples in various languages</p>
                </div>
                <div className="p-4 bg-card border border-white/10 rounded-md hover:bg-card/80 cursor-pointer"
                     onClick={() => setPrompt("Analyze the current market trends for tech stocks")}>
                  <p className="font-medium mb-1">Market analysis</p>
                  <p className="text-sm text-muted-foreground">Get insights on market trends</p>
                </div>
                <div className="p-4 bg-card border border-white/10 rounded-md hover:bg-card/80 cursor-pointer"
                     onClick={() => setPrompt("Create a trading strategy for volatile markets")}>
                  <p className="font-medium mb-1">Trading strategies</p>
                  <p className="text-sm text-muted-foreground">Generate ideas for different market conditions</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Messages */}
              {outputMessages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-3xl rounded-lg p-4 ${
                      message.type === 'user'
                        ? 'bg-primary/10 border border-primary/20'
                        : 'bg-card border border-white/10'
                    }`}
                  >
                    {message.type === 'user' ? (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    ) : (
                      <>
                        <div
                          className="gemini-markdown prose prose-invert max-w-none"
                          dangerouslySetInnerHTML={renderMarkdown(message.content)}
                        />
                        {/* Action buttons for AI responses */}
                        <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                          <button
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                            onClick={() => {
                              navigator.clipboard.writeText(message.content);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                            Copy
                          </button>
                          <button
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                          >
                            <Save className="h-3 w-3" />
                            Save
                          </button>
                          <button
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                          >
                            <Share className="h-3 w-3" />
                            Share
                          </button>
                          {settings.enableCodeExecution && (
                            <button
                              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                            >
                              <Code className="h-3 w-3" />
                              Execute Code
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {status === 'loading' && (
                <div className="flex justify-start">
                  <div className="max-w-3xl rounded-lg p-4 bg-card border border-white/10">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300"></div>
                      <span className="ml-2 text-sm text-muted-foreground">Generating response...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Streaming Content */}
              {status === 'streaming' && streamingContent && (
                <div className="flex justify-start">
                  <div className="max-w-3xl rounded-lg p-4 bg-card border border-white/10">
                    <div
                      className="gemini-markdown prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={renderMarkdown(streamingContent)}
                    />
                    <div className="inline-block w-1.5 h-4 bg-primary/40 ml-0.5 animate-pulse"></div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {status === 'error' && (
                <div className="flex justify-start">
                  <div className="max-w-3xl rounded-lg p-4 bg-red-900/20 border border-red-500/30 text-red-400">
                    <p className="font-medium mb-1">Error</p>
                    <p>{errorMessage || 'An error occurred while generating a response.'}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="prompt-area p-4 border-t border-white/10 bg-card/80">
          <div className="flex items-start">
            <div className="relative flex-1 mr-3">
              <textarea
                ref={promptTextareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your prompt here... (Ctrl+Enter to submit)"
                className="w-full p-3 bg-gray-800 border border-white/10 rounded-md min-h-[50px] max-h-[150px] resize-y pr-10"
                disabled={status === 'loading' || status === 'streaming' || isVoiceListening}
              />
              <div className="absolute right-3 top-3 flex gap-2">
                <button
                  onClick={toggleVoiceInput}
                  disabled={status === 'loading' || status === 'streaming'}
                  className={`p-1 rounded-md transition-colors ${isVoiceListening ? 'text-red-400 animate-pulse bg-gray-700' : 'text-muted-foreground hover:text-foreground hover:bg-gray-700'}`}
                  title="Voice input"
                >
                  <Mic className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleScreenShare}
                disabled={status === 'loading' || status === 'streaming' || isVoiceListening}
                className={`p-3 border border-white/10 rounded-md transition-colors ${isStreaming ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-muted-foreground hover:text-foreground'} disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                title="Enable screen sharing"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-monitor">
                  <rect width="20" height="14" x="2" y="3" rx="2" />
                  <line x1="8" x2="16" y1="21" y2="21" />
                  <line x1="12" x2="12" y1="17" y2="21" />
                </svg>
                {isStreaming ? 'Streaming' : 'Stream'}
              </button>
              <button
                onClick={handleRunPrompt}
                disabled={!prompt.trim() || status === 'loading' || status === 'streaming' || isVoiceListening}
                className="p-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Rocket className="h-5 w-5" />
                Run
              </button>
            </div>
          </div>
          <div className="mt-2 text-xs flex justify-between items-center">
            <div className={`status ${status === 'streaming' ? 'text-yellow-400' : status === 'loading' ? 'text-yellow-400' : status === 'error' ? 'text-red-400' : 'text-muted-foreground'}`}>
              {status === 'ready' ? 'Ready' : status === 'loading' ? 'Generating...' : status === 'streaming' ? 'Streaming...' : 'Error'}
              {isVoiceListening && <span className="ml-2 text-red-400">Listening...</span>}
            </div>
            <div className="flex items-center gap-4">
              {settings.enableTools && (
                <span className="text-primary">Tools enabled</span>
              )}
              {settings.enableCodeExecution && (
                <span className="text-primary">Code execution enabled</span>
              )}
              <span className="text-muted-foreground">
                Press Ctrl+Enter to submit
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-72 p-6 bg-card/80 border-l border-white/10 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-6 flex items-center">
          <span role="img" aria-label="sparkles" className="mr-2">✨</span>
          Settings
        </h2>

        <div className="space-y-6">
          <div className="setting-item">
            <label htmlFor="model-select" className="block text-sm font-medium mb-2">
              Model
            </label>
            <select
              id="model-select"
              name="model"
              value={settings.model}
              onChange={(e) => handleSettingChange(e, 'model')}
              className="w-full p-2 bg-background border border-white/10 rounded-md"
            >
              <option value="gemini-1.5-flash-latest">DeepCanvas Flash</option>
              <option value="gemini-1.5-pro-latest">DeepCanvas Pro</option>
              <option value="gemini-1.0-pro">DeepCanvas Standard</option>
            </select>
          </div>

          <div className="setting-item">
            <label htmlFor="temperature-slider" className="block text-sm font-medium mb-2">
              Temperature: <span className="text-primary">{settings.temperature}</span>
            </label>
            <input
              type="range"
              id="temperature-slider"
              name="temperature"
              min="0"
              max="1"
              step="0.1"
              value={settings.temperature}
              onChange={(e) => handleSettingChange(e, 'temperature')}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>

          <div className="setting-item">
            <label htmlFor="system-instruction" className="block text-sm font-medium mb-2">
              System Instructions
            </label>
            <textarea
              id="system-instruction"
              name="systemInstruction"
              value={settings.systemInstruction}
              onChange={(e) => handleSettingChange(e, 'systemInstruction')}
              placeholder="Enter system instructions here..."
              className="w-full p-2 bg-gray-800 border border-white/10 rounded-md min-h-[80px] resize-y"
            />
          </div>

          <div className="setting-item">
            <label htmlFor="voice-language" className="block text-sm font-medium mb-2">
              Voice Language
            </label>
            <select
              id="voice-language"
              name="voiceLanguage"
              value={settings.voiceLanguage}
              onChange={(e) => handleSettingChange(e, 'voiceLanguage')}
              className="w-full p-2 bg-background border border-white/10 rounded-md"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
              <option value="it-IT">Italian</option>
              <option value="ja-JP">Japanese</option>
              <option value="ko-KR">Korean</option>
              <option value="pt-BR">Portuguese (Brazil)</option>
              <option value="ru-RU">Russian</option>
              <option value="zh-CN">Chinese (Simplified)</option>
            </select>
          </div>

          <div className="setting-item space-y-3">
            <h3 className="text-sm font-medium">Features</h3>

            <div className="flex items-center justify-between cursor-pointer" onClick={() => setSettings(prev => ({ ...prev, enableCodeExecution: !prev.enableCodeExecution }))}>
              <label htmlFor="enable-code-execution" className="text-sm cursor-pointer flex-1">
                Code Execution
              </label>
              <div className="relative inline-block w-10 h-5 rounded-full bg-background border border-white/10">
                <input
                  type="checkbox"
                  id="enable-code-execution"
                  checked={settings.enableCodeExecution}
                  onChange={(e) => setSettings(prev => ({ ...prev, enableCodeExecution: e.target.checked }))}
                  className="sr-only"
                />
                <div
                  className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full transition-transform ${settings.enableCodeExecution ? 'bg-primary transform translate-x-5' : 'bg-white/50'}`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between cursor-pointer" onClick={() => setSettings(prev => ({ ...prev, enableTools: !prev.enableTools }))}>
              <label htmlFor="enable-tools" className="text-sm cursor-pointer flex-1">
                Enable Tools
              </label>
              <div className="relative inline-block w-10 h-5 rounded-full bg-background border border-white/10">
                <input
                  type="checkbox"
                  id="enable-tools"
                  checked={settings.enableTools}
                  onChange={(e) => setSettings(prev => ({ ...prev, enableTools: e.target.checked }))}
                  className="sr-only"
                />
                <div
                  className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full transition-transform ${settings.enableTools ? 'bg-primary transform translate-x-5' : 'bg-white/50'}`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between cursor-pointer" onClick={() => setSettings(prev => ({ ...prev, compareMode: !prev.compareMode }))}>
              <label htmlFor="compare-mode" className="text-sm cursor-pointer flex-1">
                Compare Mode
              </label>
              <div className="relative inline-block w-10 h-5 rounded-full bg-background border border-white/10">
                <input
                  type="checkbox"
                  id="compare-mode"
                  checked={settings.compareMode}
                  onChange={(e) => setSettings(prev => ({ ...prev, compareMode: e.target.checked }))}
                  className="sr-only"
                />
                <div
                  className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full transition-transform ${settings.compareMode ? 'bg-primary transform translate-x-5' : 'bg-white/50'}`}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              id="clear-chat-button"
              onClick={handleClearChat}
              className="flex-1 p-2 bg-background border border-white/10 rounded-md hover:bg-card/80 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Chat
            </button>

            <button
              className="flex-1 p-2 bg-background border border-white/10 rounded-md hover:bg-card/80 transition-colors flex items-center justify-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiStudio;
