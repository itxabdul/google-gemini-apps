
import React, { useState, useEffect } from 'react';
import type { Chat } from '@google/genai';
import { Message, Preferences as PreferencesType } from './types';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { Header } from './components/Header';
import { Preferences } from './components/Preferences';
import { sendMessageToAI } from './services/geminiService';

const parseAIResponse = (responseText: string): { summary: string; jsonData: any | null } => {
  const separator = '---JSON_SEPARATOR---';
  const parts = responseText.split(separator);
  const summary = parts[0]?.trim() ?? 'Sorry, I encountered an issue.';
  let jsonData = null;

  if (parts.length > 1 && parts[1]) {
    try {
      jsonData = JSON.parse(parts[1].trim());
    } catch (e) {
      console.error("Failed to parse JSON from AI response:", e);
    }
  }
  return { summary, jsonData };
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [preferences, setPreferences] = useState<PreferencesType>({
    travelStyle: 'Balanced',
    dietaryRestrictions: '',
    accessibilityNeeds: '',
    accommodationTypes: ['Boutique Hotel'],
  });

  useEffect(() => {
    const initChat = async () => {
      try {
        const chatSession = await sendMessageToAI(null, null);
        setChat(chatSession);
        setMessages([
          {
            id: 'initial-message',
            sender: 'ai',
            summary: "Good day. I am Luxe Concierge, your personal travel planner. How may I assist you in crafting an unforgettable journey today? Please provide me with your destination, dates, party size, and approximate budget to begin.",
            jsonData: null
          }
        ]);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during initialization.";
        setError(errorMessage);
        setMessages([{
          id: 'error-init',
          sender: 'ai',
          summary: `There was an error initializing the AI Concierge: ${errorMessage}`,
          jsonData: null,
          isError: true
        }]);
      }
    };
    initChat();
  }, []);

  const handlePreferencesChange = (newPreferences: Partial<PreferencesType>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  const handleSendMessage = async (inputText: string) => {
    if (!chat) {
      setError("Chat is not initialized. Please refresh the page.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    const userMessage: Message = { id: Date.now().toString(), sender: 'user', summary: inputText, jsonData: null };
    setMessages(prev => [...prev, userMessage]);

    const preferencesText = `Current Traveler Preferences:\n- Style: ${preferences.travelStyle}\n- Dietary: ${preferences.dietaryRestrictions || 'None'}\n- Accessibility: ${preferences.accessibilityNeeds || 'None'}\n- Accommodation: ${preferences.accommodationTypes.join(', ')}`;
    const fullPrompt = `${preferencesText}\n\n---\n\n${inputText}`;

    try {
      const responseText = await sendMessageToAI(chat, fullPrompt);
      const { summary, jsonData } = parseAIResponse(responseText);
      const aiMessage: Message = { id: Date.now().toString() + '-ai', sender: 'ai', summary, jsonData };
      setMessages(prev => [...prev, aiMessage]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
      const errorMsg: Message = { id: Date.now().toString() + '-err', sender: 'ai', isError: true, summary: `My apologies, I seem to have encountered an error: ${errorMessage}`, jsonData: null };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans p-4 bg-brand-bg">
      <div className="flex flex-col w-full max-w-4xl mx-auto h-full content-card rounded-2xl overflow-hidden">
        <Header />
        <Preferences preferences={preferences} onPreferencesChange={handlePreferencesChange} />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <ChatWindow messages={messages} isLoading={isLoading} />
          </div>
        </main>
        <footer className="p-4 border-t border-brand-border bg-brand-surface">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </footer>
      </div>
    </div>
  );
};

export default App;
