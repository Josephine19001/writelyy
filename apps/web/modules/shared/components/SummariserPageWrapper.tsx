'use client';

import { SummariserPage } from '@shared/components/SummariserPage';
import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface TextHistoryEntry {
  id: string;
  originalText: string;
  processedText?: string;
  type: 'humanized' | 'detected' | 'summarised' | 'paraphrased';
  status?: 'processing' | 'completed' | 'failed';
  timestamp: Date;
  aiScore?: number;
}

// Mock data - replace with actual API calls
const mockHistoryEntries: TextHistoryEntry[] = [
  {
    id: '1',
    originalText:
      'This is a long article that discusses various aspects of artificial intelligence and machine learning. It covers the fundamentals of neural networks, deep learning algorithms, and their applications in modern technology. The article also explores the ethical implications of AI development and deployment in various industries.',
    processedText:
      'This article covers AI and machine learning basics, including neural networks, deep learning, and tech applications, plus ethical considerations.',
    type: 'summarised',
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  }
];

export function SummariserPageWrapper() {
  const t = useTranslations();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [historyEntries, setHistoryEntries] = useState(mockHistoryEntries);

  const handleProcess = async (text: string) => {
    setIsProcessing(true);
    setOutputText(''); // Clear previous results

    // Mock API call - replace with actual API
    setTimeout(() => {
      const summarizedText = "This is a concise summary of your original text, highlighting the main points and key information in a shorter format.";
      setOutputText(summarizedText);
      setIsProcessing(false);

      // Add to history
      const newEntry: TextHistoryEntry = {
        id: Date.now().toString(),
        originalText: text,
        processedText: summarizedText,
        type: 'summarised',
        status: 'completed',
        timestamp: new Date()
      };

      setHistoryEntries((prev) => [newEntry, ...prev]);
    }, 2000);
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
  };

  const handleHistoryItemClick = useCallback(
    (id: string) => {
      const entry = historyEntries.find((e) => e.id === id);
      if (entry) {
        setInputText(entry.originalText);
        if (entry.processedText) {
          setOutputText(entry.processedText);
        }
      }
    },
    [historyEntries]
  );

  const handleHistoryItemDelete = useCallback((id: string) => {
    setHistoryEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const renderResults = () => (
    <div className="w-full h-full border border-background-text dark:border-background-text bg-white dark:bg-background-text rounded-lg p-4 text-sm text-slate-900 dark:text-slate-100">
      {outputText ? (
        <div className="whitespace-pre-wrap">{outputText}</div>
      ) : (
        <div className="text-sm text-slate-400 dark:text-slate-500">
          {t('summariser.resultsPlaceholder')}
        </div>
      )}
    </div>
  );

  return (
    <SummariserPage
      historyEntries={historyEntries}
      onHistoryItemClick={handleHistoryItemClick}
      onHistoryItemDelete={handleHistoryItemDelete}
      onProcess={handleProcess}
      inputText={inputText}
      setInputText={setInputText}
      isProcessing={isProcessing}
      renderResults={renderResults}
      hasResults={!!outputText}
      resultsText={outputText}
      onReset={handleReset}
    />
  );
}