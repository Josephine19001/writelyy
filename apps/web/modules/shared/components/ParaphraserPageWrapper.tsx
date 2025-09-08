'use client';

import { ParaphraserPage } from '@shared/components/ParaphraserPage';
import { TrialDataManager } from '@shared/components/TrialDataManager';
import {
  useParaphraseTextMutation,
  useParaphraserHistoryQuery,
  useDeleteParaphraserHistoryMutation
} from '@shared/lib/tools-api';
import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

export function ParaphraserPageWrapper() {
  const t = useTranslations();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  // API hooks
  const paraphraseMutation = useParaphraseTextMutation();
  const deleteHistoryMutation = useDeleteParaphraserHistoryMutation();
  const { data: historyData, refetch: refetchHistory } =
    useParaphraserHistoryQuery(10);

  const isProcessing = paraphraseMutation.isPending;

  const handleProcess = async (
    text: string,
    options: { tone?: string; level?: string }
  ) => {
    setOutputText(''); // Clear previous results

    try {
      const result = await paraphraseMutation.mutateAsync({
        inputText: text,
        style: (options.tone as 'formal' | 'casual' | 'academic' | 'creative') || 'formal'
      });

      setOutputText(result.paraphrasedText);

      // Refetch history to get the new entry
      refetchHistory();
    } catch (error) {
      console.error('Paraphrasing failed:', error);
      // You could show a toast or error message here
    }
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
  };

  const handleHistoryItemClick = useCallback(
    (id: string) => {
      const entry = historyData?.history?.find((e) => e.id === id);
      if (entry) {
        setInputText(entry.inputText);
        if (entry.paraphrasedText) {
          setOutputText(entry.paraphrasedText);
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
        <div className="whitespace-pre-wrap">{outputText}</div>
      ) : (
        <div className="text-sm text-slate-400 dark:text-slate-500">
          {t('paraphraser.resultsPlaceholder')}
        </div>
      )}
    </div>
  );

  return (
    <>
      <TrialDataManager
        currentPage="paraphraser"
        onTrialDataFound={setInputText}
      />
      <ParaphraserPage
        historyEntries={
          historyData?.history?.map((entry) => ({
            id: entry.id,
            originalText: entry.inputText,
            processedText: entry.paraphrasedText || '',
            type: 'paraphrased' as const,
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
