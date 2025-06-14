'use client'

import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { BACKEND_URL } from '@/config';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';

interface TLDRProps {
  slug: string;
}

const TLDRSummary = ({ slug }: TLDRProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const { getToken } = useAuth();



const handleTLDR = async () => {
  if (isOpen) {
    setIsOpen(false);
    setSummary('');
    setDisplayedText('');
    return;
  }

  setIsLoading(true); 
  setIsOpen(true);
  setSummary('');
  setDisplayedText('');
  

  try {
    const response = await axios.get(`${BACKEND_URL}/llm/summary`, {
      params: {
        slug: slug
      }
    }
    );

    const aiSummary = response.data?.text ?? "No summary available.";
    
    setSummary(response.data); 
  } catch (error) {
    console.error("Error fetching summary:", error);
    setSummary("Failed to generate summary. Please try again.");
  } finally {
    setIsLoading(false); 
  }
};


  useEffect(() => {
    if (summary && !isLoading) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < summary.length) {
          setDisplayedText(prev => prev + summary[index]);
          index++;
        } else {
          clearInterval(timer);
        }
      }, 30);

      return () => clearInterval(timer);
    }
  }, [summary, isLoading]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="relative">
        <button
          onClick={handleTLDR}
          className={`group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
            isOpen ? 'rounded-b-none' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5" />
            <span className="text-lg">TL;DR</span>
            <span className="text-sm opacity-80">AI Summary</span>
            {isOpen ? (
              <ChevronUp className="w-4 h-4 ml-2 transition-transform duration-300" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-2 transition-transform duration-300" />
            )}
          </div>
      
          <div className="absolute inset-0 -top-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-transform duration-1000 group-hover:translate-x-full"></div>
        </button>

        <div
          className={`overflow-auto transition-all duration-500 ease-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 border-t-0 rounded-b-xl p-6 shadow-lg">

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-600">Generated by Gemini AI</span>
              </div>
              <div className="flex-1"></div>
              <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                Real-time
              </div>
            </div>

            <div className="relative">
              {isLoading ? (
                <div className="flex items-center gap-3 py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                  <div className="space-y-2 flex-1">
                    <div className="text-gray-600">Analyzing content with AI...</div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {displayedText}
                    {displayedText.length < summary.length && (
                      <span className="inline-block w-2 h-5 bg-purple-600 ml-1 animate-pulse"></span>
                    )}
                  </p>
                  
                  {displayedText.length === summary.length && summary.length > 0 && (
                    <div className="flex items-center gap-2 mt-4 text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Summary complete</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!isLoading && displayedText.length === summary.length && summary.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <pre className="text-xs text-red-500">{JSON.stringify(summary)}</pre>

                  <span>Powered by Gemini AI</span>
                  <span>{summary.split(' ').length} words • {Math.ceil(summary.length / 200)} sec read</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TLDRSummary;