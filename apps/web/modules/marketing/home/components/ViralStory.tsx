import { LocaleLink } from '@i18n/routing';
import { Button } from '@ui/components/button';
import {
  ArrowRightIcon,
  ClockIcon,
  TrendingUpIcon,
  EyeIcon,
  MessageSquareIcon,
  ShieldCheckIcon
} from 'lucide-react';
import Link from 'next/link';

export function ViralStory() {
  return (
    <section className="py-24 bg-gradient-to-br from-card/50 to-background overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl opacity-30" />

      <div className="container relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 mb-8">
            <TrendingUpIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              The Problem
            </span>
          </div>

          {/* Story headline */}
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
            You're drowning in comments.
          </h2>

          {/* Problem statement */}
          <div className="text-lg text-foreground/70 leading-relaxed mb-12">
            <p>
              Every post gets hundreds of comments. Some are gold, most are
              noise. You're spending hours scrolling when you could be building.
            </p>

            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-6 my-8">
              <p className="text-red-600 font-semibold flex items-center justify-center gap-2">
                <ClockIcon className="h-5 w-5" />
                Stop wasting weekends reading comments.
              </p>
            </div>
          </div>

          {/* Three main use cases */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
              <MessageSquareIcon className="h-10 w-10 text-blue-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-3 text-foreground">
                Find What Users Want
              </h3>
              <p className="text-foreground/70 text-sm mb-4">
                Extract requests and pain points automatically.
              </p>
              <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-3">
                <p className="text-blue-600 font-medium text-xs">
                  💡 "Needs mobile app" → Priority identified
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6">
              <ShieldCheckIcon className="h-10 w-10 text-orange-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-3 text-foreground">
                Prevent Churn
              </h3>
              <p className="text-foreground/70 text-sm mb-4">
                Spot complaints before they become cancellations.
              </p>
              <div className="bg-orange-500/5 border border-orange-500/10 rounded-lg p-3">
                <p className="text-orange-600 font-medium text-xs">
                  ⚠️ "Too confusing" → Fix flagged
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-2xl p-6">
              <EyeIcon className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-3 text-foreground">
                Beat Competitors
              </h3>
              <p className="text-foreground/70 text-sm mb-4">
                See what's working for them and what's not.
              </p>
              <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-3">
                <p className="text-green-600 font-medium text-xs">
                  🎯 "Their support sucks" → Opportunity
                </p>
              </div>
            </div>
          </div>

          {/* Solution preview */}
          <div className="bg-card/80 border rounded-2xl p-8 mb-12">
            <h3 className="font-semibold text-xl mb-6 text-foreground">
              How it works:
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <span className="text-center font-medium text-sm">
                  Paste any post URL
                </span>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <span className="text-center font-medium text-sm">
                  AI reads all comments
                </span>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <span className="text-center font-medium text-sm">
                  Get insights instantly
                </span>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <span className="text-center font-medium text-sm">
                  Export to your tools
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link href="/auth/signup">
                Get your weekends back
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base"
              asChild
            >
              <LocaleLink href="/docs">See demo</LocaleLink>
            </Button>
          </div>

          {/* Social proof stats */}
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center p-6 rounded-xl bg-card/50 border">
              <div className="text-3xl font-bold text-primary mb-2">200+</div>
              <div className="text-foreground/60">Hours saved</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-card/50 border">
              <div className="text-3xl font-bold text-primary mb-2">40%</div>
              <div className="text-foreground/60">Less churn</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-card/50 border">
              <div className="text-3xl font-bold text-primary mb-2">100K+</div>
              <div className="text-foreground/60">Comments analyzed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
