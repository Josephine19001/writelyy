'use client';

import { TextProcessorPage } from '@shared/components/TextProcessorPage';
import { DiffHighlighter } from '@shared/components/DiffHighlighter';
import { SparklesIcon } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

// Mock data - replace with actual API calls
const mockHistoryEntries = [
  {
    id: '1',
    originalText:
      'This is an AI-generated text that needs to be humanized for better readability and natural flow.',
    processedText:
      "This text was originally created by AI, but now it's been transformed to sound more natural and engaging for readers.",
    type: 'humanized' as const,
    status: 'completed' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: '2',
    originalText:
      'The quick brown fox jumps over the lazy dog. This sentence is commonly used for testing purposes.',
    processedText:
      'A nimble brown fox leaps gracefully over a sleepy dog. People often use this phrase when testing different things.',
    type: 'humanized' as const,
    status: 'completed' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  }
];



export function HumanizerPage() {
  const t = useTranslations();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [historyEntries, setHistoryEntries] = useState(mockHistoryEntries);
  const [showTypewriter, setShowTypewriter] = useState(false);

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

  const handleProcess = async (text: string, _options: { tone?: string; language?: string }) => {
    setIsProcessing(true);
    setOutputText(''); // Clear previous results
    setShowTypewriter(false);

    // Mock API call - replace with actual API
    setTimeout(() => {
      const humanizedText = "Here's your content rewritten to sound more natural and engaging. The AI has transformed your original text into something that flows better and feels more authentic to readers.";
      setOutputText(humanizedText);
      setShowTypewriter(true); // Start typewriter effect
      setIsProcessing(false);

      // Add to history
      const newEntry = {
        id: Date.now().toString(),
        originalText: text,
        processedText: humanizedText,
        type: 'humanized' as const,
        status: 'completed' as const,
        timestamp: new Date()
      };

      setHistoryEntries((prev) => [newEntry, ...prev]);
    }, 2000);
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
    setShowTypewriter(false);
  };

  const handleHistoryItemClick = useCallback(
    (id: string) => {
      const entry = historyEntries.find((e) => e.id === id);
      if (entry) {
        setInputText(entry.originalText);
        if (entry.processedText) {
          setOutputText(entry.processedText);
          setShowTypewriter(false); // Show immediate result for history items
        }
      }
    },
    [historyEntries]
  );

  const handleHistoryItemDelete = useCallback((id: string) => {
    setHistoryEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

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
      historyEntries={historyEntries}
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
  );
}
