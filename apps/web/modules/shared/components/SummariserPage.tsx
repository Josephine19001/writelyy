'use client';

import type { ReactNode } from 'react';
import { TextProcessorPage } from '@shared/components/TextProcessorPage';
import { PlusIcon } from 'lucide-react';

interface TextHistoryEntry {
  id: string;
  originalText: string;
  processedText?: string;
  type: 'humanized' | 'detected' | 'summarised' | 'paraphrased';
  status?: 'processing' | 'completed' | 'failed';
  timestamp: Date;
  aiScore?: number;
}

interface SummariserPageProps {
  historyEntries: TextHistoryEntry[];
  onHistoryItemClick?: (id: string) => void;
  onHistoryItemDelete?: (id: string) => void;
  onHistoryItemCopy?: (text: string) => void;
  onProcess: (text: string) => Promise<void>;
  inputText: string;
  setInputText: (text: string) => void;
  isProcessing: boolean;
  renderResults: () => ReactNode;
  hasResults: boolean;
  resultsText?: string;
  onReset: () => void;
}

export function SummariserPage({
  historyEntries,
  onHistoryItemClick,
  onHistoryItemDelete,
  onHistoryItemCopy,
  onProcess,
  inputText,
  setInputText,
  isProcessing,
  renderResults,
  hasResults,
  resultsText,
  onReset
}: SummariserPageProps) {
  const handleProcess = (text: string) => {
    return onProcess(text);
  };

  return (
    <TextProcessorPage
      currentPage="summariser"
      placeholder="Paste your text here to generate a summary..."
      actionLabel="Summarise Text"
      processingLabel="Summarising..."
      ActionIcon={PlusIcon}
      maxLength={10000}
      historyEntries={historyEntries}
      onHistoryItemClick={onHistoryItemClick}
      onHistoryItemDelete={onHistoryItemDelete}
      onHistoryItemCopy={onHistoryItemCopy}
      onProcess={handleProcess}
      inputText={inputText}
      setInputText={setInputText}
      isProcessing={isProcessing}
      renderResults={renderResults}
      hasResults={hasResults}
      resultsText={resultsText}
      onReset={onReset}
    />
  );
}
