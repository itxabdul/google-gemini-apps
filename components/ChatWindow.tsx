import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';
import { ChatMessage } from './ChatMessage';
import { LoadingSpinner } from './LoadingSpinner';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {isLoading && (
        <div className="flex justify-start items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-brand-text-primary flex items-center justify-center font-serif text-white text-lg">
                LC
            </div>
            <div className="flex items-center space-x-2 bg-brand-surface border border-brand-border p-3 rounded-lg shadow-md">
               <LoadingSpinner />
               <span className="text-brand-text-secondary italic">Crafting your itinerary...</span>
            </div>
        </div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};