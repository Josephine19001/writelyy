'use client';

import { TextProcessorPage } from '@shared/components/TextProcessorPage';
import { Progress } from '@ui/components/progress';
import {
  ShieldCheckIcon
} from 'lucide-react';
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
        <div className="w-full h-full border border-background-text dark:border-background-text bg-white dark:bg-background-text rounded-lg p-4">
          <div className="space-y-4">
            {/* Main Score - Compact */}
            <div className="text-center p-4 border rounded-lg bg-card/30">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span
                  className={`text-xl font-bold ${getScoreColor(detectionResult.aiScore)}`}
                >
                  {detectionResult.aiScore}%
                </span>
              </div>
              <p className="text-sm font-medium mb-1">
                {getScoreLabel(detectionResult.aiScore)}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('detector.confidence', { confidence: detectionResult.confidence })}
              </p>
            </div>

            {/* Breakdown - Compact */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">{t('detector.analysis.title')}</h4>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>{t('detector.analysis.vocabulary')}</span>
                  <span>{detectionResult.breakdown.vocabulary}%</span>
                </div>
                <Progress
                  value={detectionResult.breakdown.vocabulary}
                  className="h-1"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>{t('detector.analysis.syntax')}</span>
                  <span>{detectionResult.breakdown.syntax}%</span>
                </div>
                <Progress
                  value={detectionResult.breakdown.syntax}
                  className="h-1"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>{t('detector.analysis.coherence')}</span>
                  <span>{detectionResult.breakdown.coherence}%</span>
                </div>
                <Progress
                  value={detectionResult.breakdown.coherence}
                  className="h-1"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>{t('detector.analysis.creativity')}</span>
                  <span>{detectionResult.breakdown.creativity}%</span>
                </div>
                <Progress
                  value={detectionResult.breakdown.creativity}
                  className="h-1"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <ShieldCheckIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">
            {t('detector.resultsPlaceholder')}
          </p>
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