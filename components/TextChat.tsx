import React, { useState, useEffect, useRef } from 'react';
import { Chat, GenerateContentResponse } from "@google/genai";
import { ai, TEXT_MODEL, SYSTEM_INSTRUCTION } from '../services/geminiService';
import { Interaction, Sender } from '../types';
import Button from './Button';

interface TextChatProps {
    interactions: Interaction[];
    onAddInteraction: (interaction: Interaction) => void;
}

const TextChat: React.FC<TextChatProps> = ({ interactions, onAddInteraction }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter only text interactions for the chat history context + display
  const chatHistory = interactions.filter(i => i.source === 'text' || i.source === 'voice'); // Showing all for continuity

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Initialize chat session
  useEffect(() => {
    try {
      // Convert existing interactions to history format for Gemini
      const history = interactions
        .filter(i => i.id !== 'init-1') // Skip init message if redundant or let SDK handle
        .map(i => ({
            role: i.role === 'user' ? 'user' : 'model',
            parts: [{ text: i.text }]
        }));

      // Ensure init message is in history if empty
      if (history.length === 0) {
         history.push({
             role: 'model',
             parts: [{ text: "Hi, I'm Ervie. I'm here to listen and support you. How are you feeling right now?" }]
         });
      }

      chatSessionRef.current = ai.chats.create({
        model: TEXT_MODEL,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: history
      });
    } catch (error) {
      console.error("Failed to init chat", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatSessionRef.current || isLoading) return;

    const userText = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // 1. Add User Message
    onAddInteraction({
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date(),
      source: 'text'
    });

    try {
      const resultStream = await chatSessionRef.current.sendMessageStream({
        message: userText
      });

      let fullResponseText = '';
      const responseId = (Date.now() + 1).toString();
      
      for await (const chunk of resultStream) {
        const responseChunk = chunk as GenerateContentResponse;
        fullResponseText += responseChunk.text || '';
      }

      // 2. Add Model Response
      onAddInteraction({
        id: responseId,
        role: 'model',
        text: fullResponseText,
        timestamp: new Date(),
        source: 'text'
      });

    } catch (error) {
      console.error("Error sending message:", error);
      onAddInteraction({
        id: Date.now().toString(),
        role: 'model',
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        source: 'text'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background md:bg-card md:text-card-foreground md:rounded-lg md:shadow-sm md:overflow-hidden md:border md:border-border">
      {/* Desktop Header - Hidden on Mobile as App Header exists */}
      <div className="hidden md:flex p-4 bg-primary text-primary-foreground items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        <h2 className="font-semibold">Chat with Ervie</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background md:bg-background/50">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-none'
                  : 'bg-white dark:bg-muted border border-border rounded-tl-none'
              }`}
            >
              {msg.text}
              <div className="text-[10px] opacity-50 mt-1 text-right flex items-center justify-end gap-1">
                  {msg.source === 'voice' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                  )}
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex w-full justify-start">
                <div className="bg-white dark:bg-muted border border-border rounded-2xl rounded-tl-none px-4 py-3 text-sm shadow-sm">
                    <span className="animate-pulse">...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 md:p-4 bg-card border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your feelings here..."
            className="flex-1 bg-input/10 border border-input text-gray-500 dark:text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !inputValue.trim()}
            variant="primary"
            size="icon"
            className="rounded-full w-10 h-10 flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TextChat;