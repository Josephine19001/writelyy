'use client';

import { useState, type ReactNode } from 'react';
import { AppSidebarLayout } from '@shared/components/AppSidebarLayout';
import { Button } from '@ui/components/button';
import { Textarea } from '@ui/components/textarea';
import { Progress } from '@ui/components/progress';
import { CopyIcon, RotateCcwIcon, TrashIcon, CameraIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useUsageLimits } from '@saas/payments/hooks/use-usage-limits';
import { countWords } from '@shared/utils/text-utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@ui/components/select';
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

interface SelectOption {
  value: string;
  label: string;
}

interface TextProcessorPageProps {
  // Page configuration
  currentPage: 'humanizer' | 'detector' | 'summariser' | 'paraphraser';

  // Header configuration
  showToneSelector?: boolean;
  showLanguageSelector?: boolean;
  toneOptions?: SelectOption[];
  languageOptions?: SelectOption[];

  // Processing configuration
  placeholder: string;
  actionLabel: string;
  processingLabel: string;
  ActionIcon: React.ComponentType<{ className?: string }>;
  maxLength?: number;

  // History
  historyEntries: TextHistoryEntry[];
  onHistoryItemClick?: (id: string) => void;
  onHistoryItemDelete?: (id: string) => void;
  onHistoryItemCopy?: (text: string) => void;

  // Processing logic
  onProcess: (
    text: string,
    options: { tone?: string; language?: string }
  ) => Promise<void>;

  // State management
  inputText: string;
  setInputText: (text: string) => void;
  isProcessing: boolean;

  // Results
  renderResults: () => ReactNode;
  hasResults: boolean;
  resultsText?: string;

  // Reset functionality
  onReset: () => void;
}

export function TextProcessorPage({
  currentPage,
  showToneSelector = false,
  showLanguageSelector = false,
  toneOptions = [],
  languageOptions = [],
  placeholder,
  actionLabel,
  processingLabel,
  ActionIcon,
  maxLength = 5000,
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
}: TextProcessorPageProps) {
  const t = useTranslations();
  const [selectedTone, setSelectedTone] = useState(toneOptions[0]?.value || '');
  const [selectedLanguage, setSelectedLanguage] = useState(
    languageOptions[0]?.value || ''
  );
  const { canProcessText, checkLimit, monthlyUsage } = useUsageLimits();


  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t('textProcessor.copySuccess'));
      onHistoryItemCopy?.(text);
    } catch (error) {
      console.error('Failed to copy text:', error);
      toast.error(t('textProcessor.copyError'));
    }
  };

  const handleProcess = () => {
    const wordCount = countWords(inputText);
    
    if (wordCount < 30) {
      toast.error(t('textProcessor.minWordsError'));
      return;
    }
    
    // Check if user can process this many words
    if (!canProcessText(wordCount)) {
      if (!checkLimit(wordCount)) {
        return; // This will trigger the pricing gate via checkLimit
      }
    }
    
    onProcess(inputText, { tone: selectedTone, language: selectedLanguage });
  };

  return (
    <AppSidebarLayout
      historyEntries={historyEntries}
      onHistoryItemClick={onHistoryItemClick}
      onHistoryItemDelete={onHistoryItemDelete}
      onHistoryItemCopy={onHistoryItemCopy}
      onNewAction={onReset}
      currentPage={currentPage}
    >
      <div className="h-full flex flex-col">
        {/* Header with Selectors */}
        <div className="border-b border-border/50 bg-background px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Tone Selection Dropdown */}
            {showToneSelector && toneOptions.length > 0 && (
              <Select value={selectedTone} onValueChange={setSelectedTone}>
                <SelectTrigger className="w-24 h-8 text-xs">
                  <SelectValue placeholder={t('textProcessor.tonePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-xs"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Language Dropdown */}
            {showLanguageSelector && languageOptions.length > 0 && (
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className="w-24 h-8 text-xs">
                  <SelectValue placeholder={t('textProcessor.languagePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-xs"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Character/Word Count */}
          <div className="text-xs text-muted-foreground space-y-1">
            <div>
              {countWords(inputText)} {t('textProcessor.words')} • {inputText.length}/{maxLength} {t('textProcessor.chars')}
            </div>
            {monthlyUsage && (
              <div className={`${monthlyUsage.remainingWords < countWords(inputText) ? 'text-red-500' : monthlyUsage.remainingWords < 1000 ? 'text-yellow-500' : ''}`}>
                {monthlyUsage.remainingWords.toLocaleString()} {t('textProcessor.wordsRemaining')}
              </div>
            )}
          </div>
        </div>

        {/* Two-Panel Layout - Responsive */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Input Panel */}
          <div className="flex-1 flex flex-col lg:border-r border-b lg:border-b-0 border-border/50">
            <div className="flex-1 p-3 min-h-[300px] lg:min-h-0">
              <Textarea
                placeholder={placeholder}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-full resize-none border border-background-text dark:border-background-text bg-white dark:bg-background-text text-slate-900 dark:text-slate-100 text-base leading-relaxed focus:ring-1 focus:ring-primary/20 focus:border-primary/30 rounded-xl p-4"
                maxLength={maxLength}
              />
            </div>

            {/* Input Footer */}
            <div className="border-t border-border/50 p-4 bg-card/20">
              <div className="flex gap-2">
                <Button
                  onClick={handleProcess}
                  disabled={!inputText.trim() || isProcessing}
                  variant="primary"
                  className="flex-1 h-10 rounded-lg"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <RotateCcwIcon className="mr-2 h-4 w-4 animate-spin" />
                      {processingLabel}
                    </>
                  ) : (
                    <>
                      <ActionIcon className="mr-2 h-4 w-4" />
                      {actionLabel}
                    </>
                  )}
                </Button>
                {inputText.trim() && (
                  <Button
                    variant="outline"
                    onClick={onReset}
                    size="lg"
                    className="h-10 w-10 p-0 rounded-lg"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {isProcessing && (
                <div className="mt-3">
                  <Progress value={33} className="h-1" />
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-3 min-h-[300px] lg:min-h-0">
              {renderResults()}
            </div>

            {/* Results Footer */}
            <div className="border-t border-border/50 p-4 bg-card/20">
              {currentPage === 'detector' ? (
                <Button
                  disabled={true}
                  variant="outline"
                  className="w-full h-10 rounded-lg opacity-50 cursor-not-allowed"
                >
                  <CameraIcon className="mr-2 h-4 w-4" />
                  Screenshot Results
                </Button>
              ) : (
                <Button
                  onClick={() => handleCopy(resultsText || inputText)}
                  disabled={!hasResults}
                  variant="outline"
                  className="w-full h-10 rounded-lg"
                >
                  <CopyIcon className="mr-2 h-4 w-4" />
                  {t('textProcessor.copyResult')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppSidebarLayout>
  );
}
