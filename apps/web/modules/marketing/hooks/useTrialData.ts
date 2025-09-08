'use client';

import { useEffect, useState } from 'react';

export interface TrialData {
  content: string;
  product: 'humanizer' | 'detector' | 'summariser' | 'paraphraser';
  timestamp: number;
  wordCount: number;
}

export function useTrialData() {
  const [trialData, setTrialData] = useState<TrialData | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('writelyy_trial_data');
      if (savedData) {
        try {
          const data: TrialData = JSON.parse(savedData);
          // Check if data is not too old (24 hours)
          const isExpired = Date.now() - data.timestamp > 24 * 60 * 60 * 1000;
          
          if (!isExpired) {
            setTrialData(data);
          } else {
            // Remove expired data
            localStorage.removeItem('writelyy_trial_data');
          }
        } catch (error) {
          console.error('Error parsing trial data:', error);
          localStorage.removeItem('writelyy_trial_data');
        }
      }
    }
  }, []);

  const clearTrialData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('writelyy_trial_data');
      setTrialData(null);
    }
  };

  const hasTrialData = () => {
    return trialData !== null;
  };

  return {
    trialData,
    clearTrialData,
    hasTrialData
  };
}