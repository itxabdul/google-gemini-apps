
import React from 'react';
import type { Message } from '../types';
import { UserIcon } from './icons';

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === 'user';

  // Render an empty paragraph for empty summaries to maintain layout consistency during streaming
  const summaryWithLineBreaks = (message.summary || " ").split('\n').map((line, index, array) => (
    <span key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </span>
  ));

  if (isUser) {
    return (
      <div className="flex justify-end items-start space-x-4 animate-fade-in">
        <div className="max-w-md lg:max-w-lg bg-brand-accent-light p-4 rounded-2xl rounded-tr-lg shadow-sm">
          <p className="text-brand-accent font-medium" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{message.summary}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-brand-accent-light flex items-center justify-center flex-shrink-0">
          <UserIcon className="text-brand-accent" />
        </div>
      </div>
    );
  }

  // AI Message
  return (
    <div className="flex justify-start items-start space-x-4 animate-fade-in">
      <div className="w-10 h-10 rounded-full bg-brand-text-primary flex items-center justify-center flex-shrink-0 font-serif text-white text-lg shadow-md">
        LC
      </div>
      <div className={`max-w-md lg:max-w-lg p-4 rounded-2xl rounded-bl-lg shadow-md ${message.isError ? 'bg-red-50 border border-red-200' : 'bg-brand-surface border border-brand-border'}`}>
        <div className={`text-brand-text-primary ${message.isError ? 'text-red-700' : ''} space-y-4`}>
          <p style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{summaryWithLineBreaks}</p>
        </div>
      </div>
    </div>
  );
};
