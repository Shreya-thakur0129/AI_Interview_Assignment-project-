import React, { useRef, useEffect } from 'react';
import { Bot, User, AlertCircle } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  className?: string;
}

export function ChatInterface({ messages, className = '' }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'bot':
        return <Bot className="w-4 h-4" />;
      case 'user':
        return <User className="w-4 h-4" />;
      case 'system':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getMessageStyles = (type: string) => {
    switch (type) {
      case 'bot':
        return 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200';
      case 'user':
        return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200';
      case 'system':
        return 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (messages.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 text-gray-500 ${className}`}>
        <div className="text-center">
          <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No messages yet. Start your interview to begin the conversation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-4 rounded-xl border ${getMessageStyles(message.type)} transform transition-all duration-200 hover:scale-[1.01]`}
        >
          <div className="flex items-start space-x-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.type === 'bot' ? 'bg-blue-500 text-white' :
              message.type === 'user' ? 'bg-green-500 text-white' :
              'bg-yellow-500 text-white'
            }`}>
              {getMessageIcon(message.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {message.type === 'bot' ? 'AI Assistant' : 
                   message.type === 'user' ? 'You' : 'System'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}