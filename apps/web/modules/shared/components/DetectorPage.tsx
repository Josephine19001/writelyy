'use client';

import { TextProcessorPage } from '@shared/components/TextProcessorPage';
import { TrialDataManager } from '@shared/components/TrialDataManager';
import { useUsageLimits } from '@saas/payments/hooks/use-usage-limits';
import { countWords } from '@shared/utils/text-utils';
import {
  useDetectTextMutation,
  useDetectorHistoryQuery,
  useDeleteDetectorHistoryMutation
} from '@shared/lib/tools-api';
import { ShieldCheckIcon } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@ui/components/accordion';

export function DetectorPage() {
  const t = useTranslations();
  const [inputText, setInputText] = useState('');
  const { canProcessText, checkLimit } = useUsageLimits();
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
    const wordCount = countWords(text);

    // Check if user can process this many words
    if (!canProcessText(wordCount)) {
      if (!checkLimit(wordCount)) {
        return; // This will trigger the pricing gate via checkLimit
      }
    }

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
      // Check if it's a word limit error
      if (error instanceof Error && error.message.includes('word limit')) {
        toast.error(error.message);
      } else {
        toast.error(t('detector.analysisError'));
      }
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
              indicators: entry.indicators || {
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
        toast.success(t('history.deleteSuccess'));
        refetchHistory();
      } catch (error) {
        console.error('Failed to delete history item:', error);
        toast.error(t('history.deleteError'));
      }
    },
    [deleteHistoryMutation, refetchHistory, t]
  );

  const handleHistoryItemCopy = useCallback(
    (text: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success(t('history.copySuccess'));
        })
        .catch(() => {
          toast.error(t('history.copyError'));
        });
    },
    [t]
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
        <div className="w-full h-full border border-background-text dark:border-background-text bg-white dark:bg-background-text text-slate-900 dark:text-slate-100 text-base leading-relaxed rounded-xl p-4 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto space-y-4">
            {/* Main Score - Segmented circular progress */}
            <div className="text-center p-4 border rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-sm flex-shrink-0">
              <div className="relative inline-flex items-center justify-center w-32 h-32 mb-3">
                {/* Segmented Progress Ring */}
                <svg
                  className="w-32 h-32 transform -rotate-90"
                  viewBox="0 0 120 120"
                  aria-label="AI Detection Score Progress"
                >
                  <title>AI Detection Score Progress</title>
                  {(() => {
                    const segments = 40; // Number of segments around the circle
                    const radius = 50;
                    const centerX = 60;
                    const centerY = 60;
                    const segmentAngle = (2 * Math.PI) / segments;
                    const filledSegments = Math.round(
                      detectionResult.aiProbability * segments
                    );

                    const progressColor =
                      detectionResult.aiProbability >= 0.7
                        ? '#ef4444' // red-500
                        : detectionResult.aiProbability >= 0.3
                          ? '#f97316' // orange-500
                          : '#22c55e'; // green-500

                    return Array.from({ length: segments }, (_, i) => {
                      const angle = i * segmentAngle;
                      const x1 = centerX + (radius - 8) * Math.cos(angle);
                      const y1 = centerY + (radius - 8) * Math.sin(angle);
                      const x2 = centerX + (radius + 2) * Math.cos(angle);
                      const y2 = centerY + (radius + 2) * Math.sin(angle);

                      const isFilled = i < filledSegments;

                      return (
                        <line
                          key={i}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={isFilled ? progressColor : '#e2e8f0'}
                          strokeWidth="3"
                          strokeLinecap="round"
                          className="transition-all duration-75 ease-out"
                          style={{
                            transitionDelay: `${i * 20}ms`,
                            opacity: isFilled ? 1 : 0.3
                          }}
                        />
                      );
                    });
                  })()}
                </svg>
                {/* Score Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span
                      className={`text-2xl font-bold ${getScoreColor(Math.round(detectionResult.aiProbability * 100))}`}
                    >
                      {Math.round(detectionResult.aiProbability * 100)}%
                    </span>
                    <div className="text-xs text-muted-foreground mt-1">
                      {detectionResult.detectionResult}
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="space-y-1"> */}
              {/* <p className="text-sm font-semibold">
                  {detectionResult.detectionResult}
                </p> */}
              {/* <p className="text-xs text-muted-foreground">
                  {t('detector.confidence', {
                    confidence: detectionResult.confidence
                  })}
                </p> */}
              {/* </div> */}
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

            {/* Detailed Analysis - Accordion format */}
            {Object.values(detectionResult.analysis.indicators).some(
              (indicator) =>
                indicator.explanation || indicator.issues.length > 0
            ) && (
              <div className="flex-shrink min-h-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-3 bg-primary rounded-full" />
                  <h4 className="font-medium text-sm">
                    {t('detector.analysis.detailedAnalysis')}
                  </h4>
                </div>

                <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                  <Accordion type="multiple" className="space-y-3 pr-2">
                    {Object.entries(detectionResult.analysis.indicators)
                      .filter(
                        ([, data]) => data.explanation || data.issues.length > 0
                      )
                      .map(([key, data]) => (
                        <AccordionItem
                          key={key}
                          value={key}
                          className="border-0 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-sm overflow-hidden"
                        >
                          <AccordionTrigger className="px-4 py-3 hover:no-underline border-0 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors flex-shrink-0">
                            <div className="flex items-center justify-between w-full mr-2">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary/60" />
                                <h5 className="font-semibold text-sm capitalize text-foreground">
                                  {t(`detector.analysis.${key}`)}
                                </h5>
                              </div>
                              {data.score > 0 && (
                                <div className="flex items-center gap-3">
                                  <div className="text-xs font-medium text-muted-foreground">
                                    {data.score}/100
                                  </div>
                                  <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full transition-all duration-700 ease-out rounded-full ${
                                        data.score >= 70
                                          ? 'bg-gradient-to-r from-green-400 to-green-500'
                                          : data.score >= 40
                                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                                            : 'bg-gradient-to-r from-red-400 to-red-500'
                                      }`}
                                      style={{ width: `${data.score}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4 pt-0">
                            <div className="space-y-3">
                              {data.explanation && (
                                <div className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                                  <p className="text-sm text-foreground/80 leading-relaxed">
                                    {data.explanation}
                                  </p>
                                </div>
                              )}
                              {data.issues.length > 0 && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1 h-3 bg-orange-400 rounded-full" />
                                    <p className="text-xs font-semibold text-orange-700 dark:text-orange-300">
                                      {t('detector.analysis.issuesFound')}
                                    </p>
                                  </div>
                                  <ul className="space-y-2 ml-3">
                                    {data.issues.map((issue, index) => (
                                      <li
                                        key={index}
                                        className="flex items-start gap-2 text-sm text-muted-foreground"
                                      >
                                        <span className="text-orange-500 mt-1 text-xs">
                                          ▪
                                        </span>
                                        <span className="leading-relaxed">
                                          {issue}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </div>
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
            <h3 className="font-medium text-base mb-2">
              {t('detector.analysis.readyToAnalyze')}
            </h3>
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
        onHistoryItemCopy={handleHistoryItemCopy}
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
