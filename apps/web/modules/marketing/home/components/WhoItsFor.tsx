import { TrendingUpIcon, BrainIcon, UserIcon } from 'lucide-react';

export function WhoItsFor() {
  return (
    <section className="py-20 lg:py-24 bg-gradient-to-br from-card/30 to-background">
      <div className="container max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-bold text-3xl lg:text-4xl mb-6">
            🎯 Who It's For
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Anyone who needs their AI-generated content to sound authentically human
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
          <div className="group cursor-pointer">
            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 h-full">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <UserIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">
                  🎓 Students
                </h3>
              </div>
              <p className="text-foreground/70 text-sm leading-relaxed">
                Make essays and assignments undetectable while sounding natural. 
                Perfect for academic writing that needs to pass AI detection.
              </p>
            </div>
          </div>

          <div className="group cursor-pointer">
            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/20 hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 h-full">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BrainIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">
                  💼 Professionals
                </h3>
              </div>
              <p className="text-foreground/70 text-sm leading-relaxed">
                Rewrite reports, emails, and proposals with confidence. 
                Transform AI-generated drafts into authentic business communication.
              </p>
            </div>
          </div>

          <div className="group cursor-pointer">
            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 h-full">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUpIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">
                  📝 Creators & Writers
                </h3>
              </div>
              <p className="text-foreground/70 text-sm leading-relaxed">
                Humanize captions, blogs, and scripts for TikTok, LinkedIn, or YouTube. 
                Make your content sound naturally engaging.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
