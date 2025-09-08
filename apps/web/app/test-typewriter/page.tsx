'use client';

import { useState } from 'react';
import { DiffHighlighter } from '@shared/components/DiffHighlighter';
import { Button } from '@ui/components/button';

export default function TestTypewriterPage() {
  const [showDemo, setShowDemo] = useState(false);

  const originalText = "This is some AI-generated text that needs to be humanized for better readability and natural flow.";
  const newText = "Here's the same content, but now it's been transformed to sound more natural and engaging for readers.";

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">Typewriter Effect Demo</h1>
          <p className="text-muted-foreground">
            Test the typewriter effect and diff highlighting
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Text */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Original Text:</h2>
            <div className="p-4 border rounded-lg bg-card text-base leading-relaxed">
              {originalText}
            </div>
          </div>

          {/* Result with Typewriter */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Humanized Result:</h2>
            <div className="p-4 border rounded-lg bg-card text-base leading-relaxed min-h-[120px]">
              {showDemo ? (
                <DiffHighlighter
                  originalText={originalText}
                  newText={newText}
                  showTypewriter={true}
                  typewriterSpeed={30}
                  onTypewriterComplete={() => {
                    console.log('Typewriter completed!');
                  }}
                />
              ) : (
                <div className="text-muted-foreground text-sm">
                  Click "Start Demo" to see the typewriter effect
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center space-x-4">
          <Button 
            onClick={() => setShowDemo(true)}
            variant="primary"
          >
            Start Demo
          </Button>
          <Button 
            onClick={() => setShowDemo(false)}
            variant="outline"
          >
            Reset
          </Button>
        </div>

        <div className="mt-8 p-4 border rounded-lg bg-muted/20">
          <h3 className="font-semibold mb-2">Features Demonstrated:</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Typewriter effect (30ms per character)</li>
            <li>• Diff highlighting in primary color ({`#00c8b3`})</li>
            <li>• Blinking cursor during animation</li>
            <li>• Highlights only changed text portions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}