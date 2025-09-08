'use client';

import { SummariserPage } from '@shared/components/SummariserPage';
import { TrialDataManager } from '@shared/components/TrialDataManager';
import {
  useSummarizeTextMutation,
  useSummariserHistoryQuery,
  useDeleteSummariserHistoryMutation
} from '@shared/lib/tools-api';
import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export function SummariserPageWrapper() {
  const t = useTranslations();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  // API hooks
  const summarizeMutation = useSummarizeTextMutation();
  const deleteHistoryMutation = useDeleteSummariserHistoryMutation();
  const { data: historyData, refetch: refetchHistory } =
    useSummariserHistoryQuery(10);

  const isProcessing = summarizeMutation.isPending;

  const handleProcess = async (text: string) => {
    setOutputText(''); // Clear previous results

    try {
      const result = await summarizeMutation.mutateAsync({
        inputText: text,
        summaryType: 'brief'
      });

      setOutputText(result.summaryText);

      // Refetch history to get the new entry
      refetchHistory();
    } catch (error) {
      console.error('Summarization failed:', error);
      // Check if it's a word limit error
      if (error instanceof Error && error.message.includes('word limit')) {
        toast.error(error.message);
      } else {
        toast.error(t('summariser.summarizationError'));
      }
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
        if (entry.summaryText) {
          setOutputText(entry.summaryText);
        }
      }
    },
    [historyData?.history]
  );

  const handleHistoryItemDelete = useCallback(
    async (id: string) => {
      try {
        await deleteHistoryMutation.mutateAsync(id);
        toast.success(t('history.deleteSuccess'));
        refetchHistory();
      } catch (error) {
        console.error('Failed to delete history item:', error);
        toast.error(t('history.deleteError'));
      }
    },
    [deleteHistoryMutation, refetchHistory, t]
  );

  const handleHistoryItemCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(t('history.copySuccess'));
    }).catch(() => {
      toast.error(t('history.copyError'));
    });
  }, [t]);

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
    <>
      <TrialDataManager
        currentPage="summariser"
        onTrialDataFound={setInputText}
      />
      <SummariserPage
        historyEntries={
          historyData?.history?.map((entry) => ({
            id: entry.id,
            originalText: entry.inputText,
            processedText: entry.summaryText || '',
            type: 'summarised' as const,
            status: 'completed' as const,
            timestamp: new Date(entry.createdAt)
          })) || []
        }
        onHistoryItemClick={handleHistoryItemClick}
        onHistoryItemDelete={handleHistoryItemDelete}
        onHistoryItemCopy={handleHistoryItemCopy}
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
