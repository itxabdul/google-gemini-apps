import React, { useState } from 'react';
import { SendIcon } from './icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3 max-w-4xl mx-auto">
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Describe your desired journey..."
        disabled={isLoading}
        className="flex-1 w-full px-4 py-3 input-styled rounded-full focus:outline-none text-brand-text-primary placeholder-brand-text-secondary transition duration-300 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading || !inputText.trim()}
        className="p-3 bg-brand-accent hover:bg-teal-700 text-white rounded-full transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-brand-accent/70 focus:ring-offset-2 focus:ring-offset-brand-surface"
        aria-label="Send message"
      >
        <SendIcon />
      </button>
    </form>
  );
};