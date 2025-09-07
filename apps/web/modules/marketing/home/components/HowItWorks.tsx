export function HowItWorks() {
  return (
    <>
      {/* The old painful way */}
      <section className="py-16 bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl lg:text-4xl mb-4">
              The old way was... painful
            </h2>
            <p className="text-foreground/60 text-lg">
              Manual rewriting takes forever and rarely fools AI detectors
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xl mx-auto mb-4">
                🤖
              </div>
              <h3 className="font-semibold text-sm mb-2">AI Detection</h3>
              <p className="text-foreground/60 text-xs">
                Your content gets flagged by AI detectors instantly
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xl mx-auto mb-4">
                ✏️
              </div>
              <h3 className="font-semibold text-sm mb-2">Manual Rewriting</h3>
              <p className="text-foreground/60 text-xs">
                Spend hours manually changing words and sentence structure
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-xl mx-auto mb-4">
                🔄
              </div>
              <h3 className="font-semibold text-sm mb-2">Endless Iterations</h3>
              <p className="text-foreground/60 text-xs">
                Keep testing and failing against AI detection tools
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-xl mx-auto mb-4">
                😤
              </div>
              <h3 className="font-semibold text-sm mb-2">Frustration</h3>
              <p className="text-foreground/60 text-xs">
                Still sounds robotic and unnatural after all that work
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm">
              <span className="text-red-600 font-medium">
                ⏰ Result: Hours wasted, still sounds like AI
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The new HumanWrite way */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl lg:text-4xl mb-4">
              How Writelyy Works
            </h2>
            <p className="text-foreground/60 text-lg">
              Two ways to transform your AI text instantly
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Browser Extension */}
            <div className="text-center">
              <h3 className="font-bold text-xl mb-6">🔮 One-Click Extension</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    1
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Highlight Text</h4>
                  <p className="text-foreground/60 text-xs">
                    Select any text in Google Docs, Gmail, Notion, etc.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    2
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Click ✨ Humanize</h4>
                  <p className="text-foreground/60 text-xs">
                    Hit the magic button that appears
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    3
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Done!</h4>
                  <p className="text-foreground/60 text-xs">
                    Text is instantly rewritten in place
                  </p>
                </div>
              </div>
            </div>

            {/* Web Editor */}
            <div className="text-center">
              <h3 className="font-bold text-xl mb-6">📝 Web Text Editor</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    1
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Paste Content</h4>
                  <p className="text-foreground/60 text-xs">
                    Drop your AI-generated text into our editor
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    2
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Choose Tone</h4>
                  <p className="text-foreground/60 text-xs">
                    Pick Default, Professional, Friendly, or Academic
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    3
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Copy & Use</h4>
                  <p className="text-foreground/60 text-xs">
                    Get human-like text ready to publish
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-4 py-2 text-sm">
              <span className="text-green-600 font-medium">
                ⚡ Under 2 seconds per rewrite
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
