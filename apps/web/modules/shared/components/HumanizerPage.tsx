'use client';

import { useState, useCallback } from 'react';
import { SparklesIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TextProcessorPage } from '@shared/components/TextProcessorPage';
import { TrialDataManager } from '@shared/components/TrialDataManager';
import { DiffHighlighter } from '@shared/components/DiffHighlighter';
import {
  useHumanizeTextMutation,
  useHumanizerHistoryQuery,
  useDeleteHumanizerHistoryMutation
} from '@shared/lib/tools-api';

export function HumanizerPage() {
  const t = useTranslations();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [showTypewriter, setShowTypewriter] = useState(false);

  // API hooks
  const humanizeMutation = useHumanizeTextMutation();
  const deleteHistoryMutation = useDeleteHumanizerHistoryMutation();
  const { data: historyData, refetch: refetchHistory } =
    useHumanizerHistoryQuery(10);

  const isProcessing = humanizeMutation.isPending;

  const toneOptions = [
    { value: 'default', label: t('humanizer.toneOptions.default') },
    { value: 'professional', label: t('humanizer.toneOptions.professional') },
    { value: 'friendly', label: t('humanizer.toneOptions.friendly') },
    { value: 'academic', label: t('humanizer.toneOptions.academic') },
    { value: 'blog', label: t('humanizer.toneOptions.blog') },
    { value: 'social', label: t('humanizer.toneOptions.social') }
  ];

  const languageOptions = [
    { value: 'en', label: t('humanizer.languageOptions.en') },
    { value: 'es', label: t('humanizer.languageOptions.es') },
    { value: 'fr', label: t('humanizer.languageOptions.fr') },
    { value: 'de', label: t('humanizer.languageOptions.de') },
    { value: 'it', label: t('humanizer.languageOptions.it') },
    { value: 'pt', label: t('humanizer.languageOptions.pt') },
    { value: 'nl', label: t('humanizer.languageOptions.nl') },
    { value: 'pl', label: t('humanizer.languageOptions.pl') },
    { value: 'ru', label: t('humanizer.languageOptions.ru') },
    { value: 'ja', label: t('humanizer.languageOptions.ja') },
    { value: 'ko', label: t('humanizer.languageOptions.ko') },
    { value: 'zh', label: t('humanizer.languageOptions.zh') }
  ];

  const handleProcess = async (
    text: string,
    options: { tone?: string; language?: string }
  ) => {
    setOutputText(''); // Clear previous results
    setShowTypewriter(false);

    try {
      const result = await humanizeMutation.mutateAsync({
        inputText: text,
        tone: (options.tone as 'default' | 'professional' | 'friendly' | 'academic') || 'default'
      });

      setOutputText(result.outputText);
      setShowTypewriter(true); // Start typewriter effect

      // Refetch history to get the new entry
      refetchHistory();
    } catch (error) {
      console.error('Humanization failed:', error);
      // You could show a toast or error message here
    }
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
    setShowTypewriter(false);
  };

  const handleHistoryItemClick = useCallback(
    (id: string) => {
      const entry = historyData?.history?.find((e) => e.id === id);
      if (entry) {
        setInputText(entry.inputText);
        if (entry.outputText) {
          setOutputText(entry.outputText);
          setShowTypewriter(false); // Show immediate result for history items
        }
      }
    },
    [historyData?.history]
  );

  const handleHistoryItemDelete = useCallback(
    async (id: string) => {
      try {
        await deleteHistoryMutation.mutateAsync(id);
        refetchHistory();
      } catch (error) {
        console.error('Failed to delete history item:', error);
      }
    },
    [deleteHistoryMutation, refetchHistory]
  );

  const renderResults = () => (
    <div className="w-full h-full border border-background-text dark:border-background-text bg-white dark:bg-background-text rounded-lg p-4 text-sm text-slate-900 dark:text-slate-100">
      {outputText ? (
        <DiffHighlighter
          originalText={inputText}
          newText={outputText}
          showTypewriter={showTypewriter}
          typewriterSpeed={25}
          onTypewriterComplete={() => {
            // Typewriter animation completed
          }}
        />
      ) : (
        <div className="text-sm text-slate-400 dark:text-slate-500">
          {t('humanizer.resultsPlaceholder')}
        </div>
      )}
    </div>
  );

  return (
    <>
      <TrialDataManager
        currentPage="humanizer"
        onTrialDataFound={setInputText}
      />
      <TextProcessorPage
        currentPage="humanizer"
        showToneSelector={true}
        showLanguageSelector={true}
        toneOptions={toneOptions}
        languageOptions={languageOptions}
        placeholder={t('humanizer.placeholder')}
        actionLabel={t('humanizer.actionLabel')}
        processingLabel={t('humanizer.processingLabel')}
        ActionIcon={SparklesIcon}
        maxLength={5000}
        historyEntries={
          historyData?.history?.map((entry) => ({
            id: entry.id,
            originalText: entry.inputText,
            processedText: entry.outputText || '',
            type: 'humanized' as const,
            status: 'completed' as const,
            timestamp: new Date(entry.createdAt)
          })) || []
        }
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
    </>
  );
}
