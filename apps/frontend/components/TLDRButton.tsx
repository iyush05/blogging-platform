'use client'
import React, { useState } from 'react';
import { Sparkles, FileText, Loader2 } from 'lucide-react';

interface TLDRButtonProps {
  content?: string;
  apiEndpoint?: string;
  onComplete?: (summary: string) => void;
  className?: string;
}

export default function TLDRButton({ 
  content = "Sample long content to summarize...", 
  apiEndpoint = "/api/summarize",
  onComplete,
  className = ""
}: TLDRButtonProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const streamSummary = async () => {
    if (isStreaming) return;
    
    setIsStreaming(true);
    setSummary('');
    setShowSummary(true);
    
    try {

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const mockSummary = "This is a concise summary of the content. The key points include important information that has been distilled from the original text to provide you with the essential details you need to know.";
      
      for (let i = 0; i <= mockSummary.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 30));
        setSummary(mockSummary.slice(0, i));
      }
      
      onComplete?.(mockSummary);
    } catch (error) {
      console.error('Error streaming summary:', error);
      setSummary('Sorry, there was an error generating the summary. Please try again.');
    } finally {
      setIsStreaming(false);
    }
  };

  const closeSummary = () => {
    setShowSummary(false);
    setSummary('');
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={streamSummary}
        disabled={isStreaming}
        className={`
          group relative overflow-hidden
          px-6 py-3 rounded-xl
          bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600
          hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700
          text-white font-semibold
          transform transition-all duration-300
          hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25
          active:scale-95
          disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
          border border-white/20
          backdrop-blur-sm
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
          <div className="absolute top-1 left-2 w-1 h-1 bg-cyan-300 rounded-full opacity-0 group-hover:opacity-100 animate-pulse delay-100" />
          <div className="absolute bottom-2 right-3 w-1.5 h-1.5 bg-purple-300 rounded-full opacity-0 group-hover:opacity-100 animate-pulse delay-200" />
        </div>

        <div className="relative flex items-center gap-2">
          {isStreaming ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          )}
          <span className="text-sm font-bold tracking-wide">
            {isStreaming ? 'Generating...' : 'TL;DR'}
          </span>
        </div>
      </button>
      {showSummary && (
        <div 
          className={`
            absolute top-full mt-4 left-0 right-0 min-w-96 max-w-2xl
            bg-white/95 backdrop-blur-md
            border border-gray-200/50
            rounded-2xl shadow-2xl shadow-black/20
            p-6 z-50
            transform transition-all duration-500 ease-out
            ${showSummary ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
          `}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-800">Summary</h3>
            </div>
            <button
              onClick={closeSummary}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative">
            {isStreaming && !summary && (
              <div className="flex items-center gap-3 text-gray-500 mb-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200" />
                </div>
                <span className="text-sm">Analyzing content...</span>
              </div>
            )}
            
            <p className="text-gray-700 leading-relaxed text-sm">
              {summary}
              {isStreaming && summary && (
                <span className="inline-block w-2 h-5 bg-purple-500 ml-1 animate-pulse" />
              )}
            </p>

            {!isStreaming && summary && (
              <div className="mt-4 flex justify-end">
                <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                  ✨ Powered by AI
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}