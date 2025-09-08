'use client';

import { ParaphraserPage } from '@shared/components/ParaphraserPage';
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
      'The quick brown fox jumps over the lazy dog. This sentence is commonly used for testing purposes in typography and printing.',
    processedText:
      'A swift brown fox leaps across a sleepy canine. This phrase is frequently employed for testing in typography and print work.',
    type: 'paraphrased',
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  }
];

export function ParaphraserPageWrapper() {
  const t = useTranslations();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [historyEntries, setHistoryEntries] = useState(mockHistoryEntries);

  const handleProcess = async (text: string, options: { tone?: string; level?: string }) => {
    setIsProcessing(true);
    setOutputText(''); // Clear previous results

    // Mock API call - replace with actual API
    setTimeout(() => {
      const paraphrasedText = "Here's your content rewritten with different words and sentence structures while maintaining the original meaning and intent.";
      setOutputText(paraphrasedText);
      setIsProcessing(false);

      // Add to history
      const newEntry: TextHistoryEntry = {
        id: Date.now().toString(),
        originalText: text,
        processedText: paraphrasedText,
        type: 'paraphrased',
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
          {t('paraphraser.resultsPlaceholder')}
        </div>
      )}
    </div>
  );

  return (
    <ParaphraserPage
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