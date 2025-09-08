'use client';

import { TextProcessorPage } from '@shared/components/TextProcessorPage';
import { TrialDataManager } from '@shared/components/TrialDataManager';
import {
  useDetectTextMutation,
  useDetectorHistoryQuery,
  useDeleteDetectorHistoryMutation
} from '@shared/lib/tools-api';
import { ShieldCheckIcon } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

export function DetectorPage() {
  const t = useTranslations();
  const [inputText, setInputText] = useState('');
  const [detectionResult, setDetectionResult] = useState<{
    aiProbability: number;
    detectionResult: 'Human' | 'AI' | 'Mixed';
    confidence: string;
    analysis: {
      reasoning: string;
      indicators: {
        vocabulary: { score: number; issues: string[]; explanation: string };
        syntax: { score: number; issues: string[]; explanation: string };
        coherence: { score: number; issues: string[]; explanation: string };
        creativity: { score: number; issues: string[]; explanation: string };
      };
      suggestions: string[];
    };
  } | null>(null);

  // API hooks
  const detectMutation = useDetectTextMutation();
  const deleteHistoryMutation = useDeleteDetectorHistoryMutation();
  const { data: historyData, refetch: refetchHistory } =
    useDetectorHistoryQuery(10);

  const isProcessing = detectMutation.isPending;

  const handleProcess = async (text: string) => {
    setDetectionResult(null);

    try {
      const result = await detectMutation.mutateAsync({
        inputText: text
      });

      setDetectionResult({
        aiProbability: result.aiProbability,
        detectionResult: result.detectionResult,
        confidence: result.confidence,
        analysis: result.analysis
      });

      // Refetch history to get the new entry
      refetchHistory();
    } catch (error) {
      console.error('Detection failed:', error);
      // You could show a toast or error message here
    }
  };

  const handleReset = () => {
    setInputText('');
    setDetectionResult(null);
  };

  const handleHistoryItemClick = useCallback(
    (id: string) => {
      const entry = historyData?.history?.find((e) => e.id === id);
      if (entry) {
        setInputText(entry.inputText);
        if (entry.aiProbability !== undefined && entry.aiProbability !== null) {
          setDetectionResult({
            aiProbability: entry.aiProbability,
            detectionResult: entry.detectionResult as 'Human' | 'AI' | 'Mixed',
            confidence: 'Medium', // Default confidence from history
            analysis: {
              reasoning: '',
              indicators: {
                vocabulary: { score: 0, issues: [], explanation: '' },
                syntax: { score: 0, issues: [], explanation: '' },
                coherence: { score: 0, issues: [], explanation: '' },
                creativity: { score: 0, issues: [], explanation: '' }
              },
              suggestions: []
            }
          });
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

  const getScoreColor = (score: number) => {
    if (score >= 70) {
      return 'text-red-600';
    }
    if (score >= 30) {
      return 'text-yellow-600';
    }
    return 'text-green-600';
  };

  const renderResults = () => {
    if (detectionResult) {
      return (
        <div className="w-full h-full border border-background-text dark:border-background-text bg-white dark:bg-background-text text-slate-900 dark:text-slate-100 text-base leading-relaxed rounded-xl p-4">
          <div className="space-y-4 h-full overflow-y-auto">
            {/* Main Score - Enhanced with circular progress */}
            <div className="text-center p-4 border rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-sm flex-shrink-0">
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-3">
                {/* Circular Progress Background */}
                <svg
                  className="w-24 h-24 transform -rotate-90"
                  viewBox="0 0 100 100"
                  aria-label="AI Detection Score Progress"
                >
                  <title>AI Detection Score Progress</title>
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - detectionResult.aiProbability)}`}
                    className={`transition-all duration-1000 ease-out ${
                      detectionResult.aiProbability >= 0.7
                        ? 'text-red-500'
                        : detectionResult.aiProbability >= 0.3
                          ? 'text-yellow-500'
                          : 'text-green-500'
                    }`}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Score Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span
                      className={`text-xl font-bold ${getScoreColor(Math.round(detectionResult.aiProbability * 100))}`}
                    >
                      {Math.round(detectionResult.aiProbability * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  {detectionResult.detectionResult}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('detector.confidence', {
                    confidence: detectionResult.confidence
                  })}
                </p>
              </div>
            </div>

            {/* Analysis Summary - Only show if reasoning exists */}
            {detectionResult.analysis.reasoning && (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>{t('detector.analysis.analysisLabel')}</strong>{' '}
                  {detectionResult.analysis.reasoning}
                </p>
              </div>
            )}

            {/* Detailed Analysis - Only show if there's actual analysis data */}
            {Object.values(detectionResult.analysis.indicators).some(
              (indicator) =>
                indicator.explanation || indicator.issues.length > 0
            ) && (
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3 bg-primary rounded-full" />
                  <h4 className="font-medium text-sm">{t('detector.analysis.detailedAnalysis')}</h4>
                </div>

                {/* Analysis Categories */}
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(detectionResult.analysis.indicators)
                    .filter(
                      ([, data]) => data.explanation || data.issues.length > 0
                    )
                    .map(([key, data]) => (
                      <div
                        key={key}
                        className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-sm capitalize">
                            {t(`detector.analysis.${key}`)}
                          </h5>
                          {data.score > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="text-xs text-muted-foreground">
                                {data.score}/100
                              </div>
                              <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-500 ${
                                    data.score >= 70
                                      ? 'bg-green-500'
                                      : data.score >= 40
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                  }`}
                                  style={{ width: `${data.score}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        {data.explanation && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {data.explanation}
                          </p>
                        )}
                        {data.issues.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-orange-700 dark:text-orange-300">
{t('detector.analysis.issuesFound')}
                            </p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {data.issues.map((issue, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-1"
                                >
                                  <span className="text-orange-500 mt-0.5">
                                    •
                                  </span>
                                  <span>{issue}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Suggestions - Only show if there are suggestions */}
            {detectionResult.analysis.suggestions.length > 0 && (
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <h5 className="font-medium text-sm text-green-800 dark:text-green-200 mb-2">
💡 {t('detector.analysis.recommendations')}
                </h5>
                <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                  {detectionResult.analysis.suggestions.map(
                    (suggestion, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-green-500 mt-0.5">•</span>
                        <span>{suggestion}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full border border-background-text dark:border-background-text bg-white dark:bg-background-text text-slate-900 dark:text-slate-100 text-base leading-relaxed rounded-xl p-4">
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-muted-foreground h-full">
            <div className="relative inline-flex items-center justify-center w-16 h-16 mb-3">
              <div className="absolute inset-0 bg-primary/10 rounded-full" />
              <ShieldCheckIcon className="h-8 w-8 text-primary/60" />
            </div>
            <h3 className="font-medium text-base mb-2">{t('detector.analysis.readyToAnalyze')}</h3>
            <p className="text-sm max-w-sm mx-auto text-muted-foreground/80">
              {t('detector.resultsPlaceholder')}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <TrialDataManager
        currentPage="detector"
        onTrialDataFound={setInputText}
      />
      <TextProcessorPage
        currentPage="detector"
        placeholder={t('detector.placeholder')}
        actionLabel={t('detector.actionLabel')}
        processingLabel={t('detector.processingLabel')}
        ActionIcon={ShieldCheckIcon}
        maxLength={5000}
        historyEntries={
          historyData?.history?.map((entry) => ({
            id: entry.id,
            originalText: entry.inputText,
            processedText: '',
            type: 'detected' as const,
            status: 'completed' as const,
            timestamp: new Date(entry.createdAt),
            aiScore: Math.round((entry.aiProbability || 0) * 100)
          })) || []
        }
        onHistoryItemClick={handleHistoryItemClick}
        onHistoryItemDelete={handleHistoryItemDelete}
        onProcess={handleProcess}
        inputText={inputText}
        setInputText={setInputText}
        isProcessing={isProcessing}
        renderResults={renderResults}
        hasResults={!!detectionResult}
        resultsText={inputText}
        onReset={handleReset}
      />
    </>
  );
}
