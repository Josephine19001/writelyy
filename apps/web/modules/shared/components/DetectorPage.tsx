'use client';

import { TextProcessorPage } from '@shared/components/TextProcessorPage';
import { ShieldCheckIcon } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

// Mock data - replace with actual API calls
const mockHistoryEntries = [
  {
    id: '1',
    originalText:
      'This text was written by a human author with natural language patterns and authentic voice.',
    type: 'detected' as const,
    status: 'completed' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    aiScore: 15 // 15% AI detected
  },
  {
    id: '2',
    originalText:
      'The implementation of artificial intelligence algorithms requires careful consideration of various parameters and optimization techniques.',
    type: 'detected' as const,
    status: 'completed' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    aiScore: 85 // 85% AI detected
  }
];

export function DetectorPage() {
  const t = useTranslations();
  const [inputText, setInputText] = useState('');
  const [detectionResult, setDetectionResult] = useState<{
    aiScore: number;
    confidence: number;
    breakdown: {
      vocabulary: number;
      syntax: number;
      coherence: number;
      creativity: number;
    };
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [historyEntries, setHistoryEntries] = useState(mockHistoryEntries);

  const handleProcess = async (text: string) => {
    setIsProcessing(true);

    // Mock API call - replace with actual API
    setTimeout(() => {
      const mockScore = Math.floor(Math.random() * 100);
      const result = {
        aiScore: mockScore,
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
        breakdown: {
          vocabulary: Math.floor(Math.random() * 100),
          syntax: Math.floor(Math.random() * 100),
          coherence: Math.floor(Math.random() * 100),
          creativity: Math.floor(Math.random() * 100)
        }
      };

      setDetectionResult(result);

      // Add to history
      const newEntry = {
        id: Date.now().toString(),
        originalText: text,
        type: 'detected' as const,
        status: 'completed' as const,
        timestamp: new Date(),
        aiScore: mockScore
      };

      setHistoryEntries((prev) => [newEntry, ...prev]);
      setIsProcessing(false);
    }, 2000);
  };

  const handleReset = () => {
    setInputText('');
    setDetectionResult(null);
  };

  const handleHistoryItemClick = useCallback(
    (id: string) => {
      const entry = historyEntries.find((e) => e.id === id);
      if (entry) {
        setInputText(entry.originalText);
        if (entry.aiScore !== undefined) {
          setDetectionResult({
            aiScore: entry.aiScore,
            confidence: 85, // Mock confidence
            breakdown: {
              vocabulary: Math.floor(Math.random() * 100),
              syntax: Math.floor(Math.random() * 100),
              coherence: Math.floor(Math.random() * 100),
              creativity: Math.floor(Math.random() * 100)
            }
          });
        }
      }
    },
    [historyEntries]
  );

  const handleHistoryItemDelete = useCallback((id: string) => {
    setHistoryEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 70) {
      return 'text-red-600';
    }
    if (score >= 30) {
      return 'text-yellow-600';
    }
    return 'text-green-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) {
      return t('detector.scoreLabels.likelyAi');
    }
    if (score >= 30) {
      return t('detector.scoreLabels.possiblyAi');
    }
    return t('detector.scoreLabels.likelyHuman');
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
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - detectionResult.aiScore / 100)}`}
                    className={`transition-all duration-1000 ease-out ${
                      detectionResult.aiScore >= 70
                        ? 'text-red-500'
                        : detectionResult.aiScore >= 30
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
                      className={`text-xl font-bold ${getScoreColor(detectionResult.aiScore)}`}
                    >
                      {detectionResult.aiScore}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  {getScoreLabel(detectionResult.aiScore)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('detector.confidence', {
                    confidence: detectionResult.confidence
                  })}
                </p>
              </div>
            </div>

            {/* Analysis Breakdown - Compact */}
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3 bg-primary rounded-full" />
                <h4 className="font-medium text-sm">
                  {t('detector.analysis.title')}
                </h4>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    key: 'vocabulary',
                    label: t('detector.analysis.vocabulary'),
                    value: detectionResult.breakdown.vocabulary
                  },
                  {
                    key: 'syntax',
                    label: t('detector.analysis.syntax'),
                    value: detectionResult.breakdown.syntax
                  },
                  {
                    key: 'coherence',
                    label: t('detector.analysis.coherence'),
                    value: detectionResult.breakdown.coherence
                  },
                  {
                    key: 'creativity',
                    label: t('detector.analysis.creativity'),
                    value: detectionResult.breakdown.creativity
                  }
                ].map((item) => (
                  <div
                    key={item.key}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium">{item.label}</span>
                      <span className="text-xs font-bold">{item.value}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${
                          item.value >= 70
                            ? 'bg-red-500'
                            : item.value >= 30
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                        }`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
            <h3 className="font-medium text-base mb-2">Ready to Analyze</h3>
            <p className="text-sm max-w-sm mx-auto text-muted-foreground/80">
              {t('detector.resultsPlaceholder')}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <TextProcessorPage
      currentPage="detector"
      placeholder={t('detector.placeholder')}
      actionLabel={t('detector.actionLabel')}
      processingLabel={t('detector.processingLabel')}
      ActionIcon={ShieldCheckIcon}
      maxLength={5000}
      historyEntries={historyEntries}
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
  );
}
