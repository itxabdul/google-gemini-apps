
import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const examplePrompt = "Draft a 4-day luxury family getaway to Salalah, Oman, for a group of 6 (2 adults, 4 children aged 8-15) traveling from Dubai. We'd like to go next month, from Friday to Monday. Our budget is around $15,000 USD. We're looking for a mix of beach relaxation at a family-friendly luxury resort, and some adventure. Please include exploring the natural beauty of the wadis, like Wadi Darbat, visiting the Al-Mughsail blowholes, and a trip to the Museum of the Land of Frankincense. Ensure the activities are engaging for the children.";

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = () => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scroll height
    }
  }

  useEffect(() => {
    resizeTextarea();
  }, [inputText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleUseExample = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setInputText(examplePrompt);
    // Focus the textarea after setting the text
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-3">
        <button
            onClick={handleUseExample}
            disabled={isLoading}
            className="text-xs px-3 py-1 bg-brand-accent-light text-brand-accent rounded-full hover:bg-teal-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            ✨ Try a Detailed Example
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex items-start space-x-3">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your desired journey..."
          disabled={isLoading}
          rows={1}
          className="flex-1 w-full px-4 py-3 input-styled rounded-2xl focus:outline-none text-brand-text-primary placeholder-brand-text-secondary transition duration-300 disabled:opacity-50 resize-none"
          style={{ minHeight: '50px', maxHeight: '250px' }}
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="p-3 bg-brand-accent hover:bg-teal-700 text-white rounded-full transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-brand-accent/70 focus:ring-offset-2 focus:ring-offset-brand-surface flex-shrink-0"
          style={{ height: '50px', width: '50px' }}
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
};
