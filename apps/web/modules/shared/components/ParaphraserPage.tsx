'use client';

import type { ReactNode } from 'react';
import { TextProcessorPage } from '@shared/components/TextProcessorPage';
import { RepeatIcon } from 'lucide-react';

interface TextHistoryEntry {
  id: string;
  originalText: string;
  processedText?: string;
  type: 'humanized' | 'detected' | 'summarised' | 'paraphrased';
  status?: 'processing' | 'completed' | 'failed';
  timestamp: Date;
  aiScore?: number;
}

interface ParaphraserPageProps {
  historyEntries: TextHistoryEntry[];
  onHistoryItemClick?: (id: string) => void;
  onHistoryItemDelete?: (id: string) => void;
  onHistoryItemCopy?: (text: string) => void;
  onProcess: (
    text: string,
    options: { tone?: string; level?: string }
  ) => Promise<void>;
  inputText: string;
  setInputText: (text: string) => void;
  isProcessing: boolean;
  renderResults: () => ReactNode;
  hasResults: boolean;
  resultsText?: string;
  onReset: () => void;
}

export function ParaphraserPage({
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
}: ParaphraserPageProps) {
  const toneOptions = [
    { value: 'formal', label: 'Formal' },
    { value: 'casual', label: 'Casual' },
    { value: 'academic', label: 'Academic' },
    { value: 'creative', label: 'Creative' }
  ];

  const levelOptions = [
    { value: 'light', label: 'Light' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'extensive', label: 'Extensive' }
  ];

  const handleProcess = (
    text: string,
    options: { tone?: string; language?: string }
  ) => {
    return onProcess(text, { tone: options.tone, level: options.language });
  };

  return (
    <TextProcessorPage
      currentPage="paraphraser"
      showToneSelector={true}
      showLanguageSelector={true}
      toneOptions={toneOptions}
      languageOptions={levelOptions}
      placeholder="Paste your text here to rephrase and rewrite it..."
      actionLabel="Paraphrase Text"
      processingLabel="Paraphrasing..."
      ActionIcon={RepeatIcon}
      maxLength={5000}
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
