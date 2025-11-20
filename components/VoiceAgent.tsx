import React, { useState, useEffect, useRef } from 'react';
import { LiveServerMessage, Modality } from '@google/genai';
import { ai, VOICE_MODEL, SYSTEM_INSTRUCTION } from '../services/geminiService';
import { createPcmBlob, decodeAudioData, base64ToBytes } from '../utils/audioUtils';
import { Interaction } from '../types';
import Button from './Button';

interface VoiceAgentProps {
    onAddInteraction: (interaction: Interaction) => void;
}

interface TranscriptMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isFinal: boolean;
}

const VoiceAgent: React.FC<VoiceAgentProps> = ({ onAddInteraction }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);
  
  // Local Transcript State for Streaming display
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [textInput, setTextInput] = useState('');

  // Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Accumulators
  const currentInputTranscriptionRef = useRef('');
  const currentOutputTranscriptionRef = useRef('');

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    sourcesRef.current.forEach(source => {
      try { source.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => {
            try { session.close(); } catch(e) {}
        });
        sessionPromiseRef.current = null;
    }

    if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
    }

    setIsConnected(false);
    setIsConnecting(false);
    setVolume(0);
    currentInputTranscriptionRef.current = '';
    currentOutputTranscriptionRef.current = '';
  };

  const updateVolume = () => {
    if (!analyserRef.current || !isConnected) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    setVolume(average); 
    animationFrameRef.current = requestAnimationFrame(updateVolume);
  };

  useEffect(() => {
    if (isConnected) {
        updateVolume();
    } else {
        setVolume(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  const startSession = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputAudioContext;
      
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      inputAudioContextRef.current = inputAudioContext;

      const outputNode = outputAudioContext.createGain();
      outputNode.connect(outputAudioContext.destination);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const analyser = inputAudioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const sessionPromise = ai.live.connect({
        model: VOICE_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTION,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } },
          },
        },
        callbacks: {
          onopen: () => {
            console.log("Connection opened");
            setIsConnected(true);
            setIsConnecting(false);
            nextStartTimeRef.current = outputAudioContext.currentTime;
            setTranscript([]); // Clear local transcript on new session

            const source = inputAudioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              
              if (sessionPromiseRef.current) {
                  sessionPromiseRef.current.then(session => {
                    session.sendRealtimeInput({ media: pcmBlob });
                  });
              }
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            // Audio Output
            const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                const bytes = base64ToBytes(base64Audio);
                const audioBuffer = await decodeAudioData(bytes, outputAudioContext, 24000, 1);
                
                const source = outputAudioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputNode);
                
                const startTime = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
                source.start(startTime);
                nextStartTimeRef.current = startTime + audioBuffer.duration;
                
                source.addEventListener('ended', () => {
                    sourcesRef.current.delete(source);
                });
                sourcesRef.current.add(source);
            }

            // Interruption
            const interrupted = msg.serverContent?.interrupted;
            if (interrupted) {
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = outputAudioContext.currentTime;
                currentOutputTranscriptionRef.current = ''; 
            }

            // Transcription
            const outputTrans = msg.serverContent?.outputTranscription?.text;
            const inputTrans = msg.serverContent?.inputTranscription?.text;
            const turnComplete = msg.serverContent?.turnComplete;

            if (outputTrans) {
                currentOutputTranscriptionRef.current += outputTrans;
                setTranscript(prev => {
                    const filtered = prev.filter(m => m.id !== 'streaming-model');
                    return [...filtered, {
                        id: 'streaming-model',
                        role: 'model',
                        text: currentOutputTranscriptionRef.current,
                        isFinal: false
                    }];
                });
            }

            if (inputTrans) {
                currentInputTranscriptionRef.current += inputTrans;
                setTranscript(prev => {
                    const filtered = prev.filter(m => m.id !== 'streaming-user');
                    return [...filtered, {
                        id: 'streaming-user',
                        role: 'user',
                        text: currentInputTranscriptionRef.current,
                        isFinal: false
                    }];
                });
            }

            if (turnComplete) {
                const input = currentInputTranscriptionRef.current.trim();
                const output = currentOutputTranscriptionRef.current.trim();

                // Commit to Global State
                if (input) {
                     onAddInteraction({
                         id: Date.now() + '-voice-user',
                         role: 'user',
                         text: input,
                         timestamp: new Date(),
                         source: 'voice'
                     });
                }
                if (output) {
                    onAddInteraction({
                         id: Date.now() + '-voice-model',
                         role: 'model',
                         text: output,
                         timestamp: new Date(),
                         source: 'voice'
                     });
                }

                // Update Local View with finalized state
                setTranscript(prev => {
                    const next = prev.filter(m => !m.id.startsWith('streaming-'));
                    if (input) {
                        next.push({ id: Date.now() + '-user', role: 'user', text: input, isFinal: true });
                    }
                    if (output) {
                        next.push({ id: Date.now() + '-model', role: 'model', text: output, isFinal: true });
                    }
                    return next;
                });

                currentInputTranscriptionRef.current = '';
                currentOutputTranscriptionRef.current = '';
            }
          },
          onclose: () => {
            setIsConnected(false);
          },
          onerror: (e) => {
            console.error("Connection error", e);
            setError("Connection error. Please try again.");
            cleanup();
          }
        }
      });

      sessionPromiseRef.current = sessionPromise;

    } catch (err: any) {
      console.error("Failed to start session", err);
      setError(err.message || "Failed to access microphone or connect.");
      cleanup();
    }
  };

  const handleToggle = () => {
    if (isConnected || isConnecting) {
      cleanup();
    } else {
      startSession();
    }
  };

  const handleSendText = async () => {
    if (!textInput.trim()) return;
    
    if (!isConnected) {
        setError("Please start the voice session first.");
        return;
    }

    const text = textInput.trim();
    setTextInput('');

    // Optimistically add to local transcript
    setTranscript(prev => [...prev, {
        id: Date.now() + '-user-text',
        role: 'user',
        text: text,
        isFinal: true
    }]);
    
    // Commit to global state immediately
    onAddInteraction({
        id: Date.now() + '-voice-user-text',
        role: 'user',
        text: text,
        timestamp: new Date(),
        source: 'voice'
    });

    try {
        const session = await sessionPromiseRef.current;
        if (session) {
            session.send({
                clientContent: {
                    turns: [{ role: 'user', parts: [{ text: text }] }],
                    turnComplete: true
                }
            });
        }
    } catch (e) {
        console.error("Failed to send text", e);
        setError("Failed to send text message.");
    }
  };

  useEffect(() => {
    return () => cleanup();
  }, []);

  const scale = 1 + (volume / 255) * 0.5; 

  return (
    <div className="flex flex-col h-full bg-background md:rounded-lg border-0 md:border border-border overflow-hidden relative">
      {/* Visualizer */}
      <div className="h-[35%] md:h-[40%] min-h-[200px] md:min-h-[250px] bg-gradient-to-b from-muted/20 to-background flex flex-col items-center justify-center relative border-b border-border p-4 md:p-6 shrink-0 transition-all duration-500">
        <div className="absolute top-4 right-4 z-20">
             <Button 
                variant={isConnected ? "destructive" : "primary"}
                size="sm"
                onClick={handleToggle}
                disabled={isConnecting}
                className="shadow-md"
             >
                 {isConnecting ? "Connecting..." : isConnected ? "End Session" : "Start Session"}
             </Button>
        </div>

        <div className="relative flex items-center justify-center w-40 h-40 md:w-48 md:h-48">
            {isConnected && (
                <>
                    <div className="absolute w-full h-full rounded-full bg-primary/10 animate-ping opacity-40" style={{ animationDuration: '3s' }}></div>
                    <div className="absolute w-28 h-28 md:w-32 md:h-32 rounded-full bg-secondary/20 animate-pulse" style={{ transform: `scale(${scale})`, transition: 'transform 0.1s ease-out' }}></div>
                </>
            )}
            
            <div className={`relative z-10 w-20 h-20 md:w-24 md:h-24 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 ${isConnected ? 'bg-gradient-to-tr from-primary to-accent animate-pulse' : 'bg-muted-foreground/20'}`}>
                {isConnecting ? (
                    <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : isConnected ? (
                    <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                        <div className="w-full h-1 bg-white/50 absolute top-1/2 transform -translate-y-1/2" style={{ height: `${Math.max(2, volume/3)}px`, transition: 'height 0.05s' }}></div>
                    </div>
                ) : (
                   <svg className="text-muted-foreground" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                )}
            </div>
        </div>
        
        <p className="mt-6 text-sm font-medium text-muted-foreground animate-in fade-in text-center px-4">
          {isConnected 
             ? "Ervie is listening..." 
             : "Tap 'Start Session' to begin your safe space."}
        </p>
        
        {error && (
            <div className="absolute bottom-2 text-xs text-destructive font-medium bg-destructive/10 px-3 py-1 rounded-full max-w-[90%] truncate">
                {error}
            </div>
        )}
      </div>

      {/* Transcript */}
      <div className="flex-1 bg-background overflow-hidden relative flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" ref={scrollRef}>
              {transcript.length === 0 && isConnected && (
                  <div className="text-center text-muted-foreground text-sm mt-10 italic opacity-50">
                      Conversation transcript will appear here...
                  </div>
              )}
              {transcript.map((msg) => (
                  <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                          msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-tr-none' 
                          : 'bg-secondary/50 text-secondary-foreground rounded-tl-none'
                      } ${!msg.isFinal ? 'opacity-70 animate-pulse' : ''}`}>
                          {msg.text}
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* Input */}
      <div className="p-3 md:p-4 border-t border-border bg-card/50 backdrop-blur-sm">
          <div className="flex gap-2 items-center">
              <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                  placeholder={isConnected ? "Type a message..." : "Connect to chat..."}
                  disabled={!isConnected}
                  className="flex-1 bg-input/10 border border-input text-gray-500 dark:text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 text-sm"
              />
              <Button 
                  onClick={handleSendText}
                  disabled={!isConnected || !textInput.trim()}
                  variant="secondary"
                  size="icon"
                  className="rounded-full h-10 w-10"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </Button>
          </div>
      </div>
    </div>
  );
};

export default VoiceAgent;