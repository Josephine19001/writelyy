'use client';

import { useState, useEffect } from 'react';
import { diffWords } from 'diff';

interface DiffHighlighterProps {
  originalText: string;
  newText: string;
  showTypewriter?: boolean;
  typewriterSpeed?: number;
  onTypewriterComplete?: () => void;
}

interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}

export function DiffHighlighter({
  originalText,
  newText,
  showTypewriter = false,
  typewriterSpeed = 30,
  onTypewriterComplete
}: DiffHighlighterProps) {
  const diffs = diffWords(originalText.trim(), newText.trim()) as DiffPart[];

  const renderDiff = () => (
    <div className="whitespace-pre-wrap leading-relaxed">
      {diffs.map((part, index) => {
        if (part.removed) {
          // Skip removed parts in the output
          return null;
        }

        if (part.added) {
          // Highlight added/changed text in primary color
          return (
            <span
              key={index}
              className="bg-primary/10 text-primary px-1 rounded"
            >
              {part.value}
            </span>
          );
        }

        // Unchanged text
        return <span key={index}>{part.value}</span>;
      })}
    </div>
  );

  if (showTypewriter) {
    return (
      <TypewriterDiffText
        diffs={diffs}
        speed={typewriterSpeed}
        onComplete={onTypewriterComplete}
      />
    );
  }

  return renderDiff();
}

// Typewriter effect for diff highlighting
function TypewriterDiffText({
  diffs,
  speed = 30,
  onComplete
}: {
  diffs: DiffPart[];
  speed: number;
  onComplete?: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Filter out removed parts and get text to show
  const textToShow = diffs.filter((part) => !part.removed);

  useEffect(() => {
    if (currentIndex >= textToShow.length) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    const currentPart = textToShow[currentIndex];

    if (currentCharIndex < currentPart.value.length) {
      const timer = setTimeout(() => {
        setCurrentCharIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
    // Move to next part
    setCurrentIndex((prev) => prev + 1);
    setCurrentCharIndex(0);
  }, [currentIndex, currentCharIndex, textToShow, speed, onComplete]);

  return (
    <div className="relative">
      <div className="whitespace-pre-wrap leading-relaxed">
        {textToShow.slice(0, currentIndex).map((part, index) => (
          <span
            key={index}
            className={
              part.added ? 'bg-primary/10 text-primary px-1 rounded' : ''
            }
          >
            {part.value}
          </span>
        ))}

        {currentIndex < textToShow.length && (
          <span
            className={
              textToShow[currentIndex].added
                ? 'bg-primary/10 text-primary px-1 rounded'
                : ''
            }
          >
            {textToShow[currentIndex].value.slice(0, currentCharIndex)}
          </span>
        )}
      </div>

      {!isComplete && (
        <span className="inline-block w-0.5 h-5 bg-primary animate-pulse ml-1" />
      )}
    </div>
  );
}
