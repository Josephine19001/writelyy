import { Button } from '@ui/components/button';
import {
  TrendingUpIcon,
  MessageSquareIcon,
  HashIcon,
  UsersIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  EyeIcon,
  BarChart3Icon,
  LightbulbIcon
} from 'lucide-react';
import Link from 'next/link';

export default function CreatorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 mb-8">
            <TrendingUpIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              For Creators
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Your next viral hit is hiding
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {' '}
              in plain sight
            </span>
          </h1>

          <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            While you're stressing about your next video idea, the answers are
            literally sitting in your comments. Smart creators already know this
            hack.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link href="/auth/signup">
                Find my next viral idea
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base"
              asChild
            >
              <Link href="#how-it-works">Show me how</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-y border-red-500/20">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-red-600">
            Why you're stuck making the same boring content
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-red-200/50">
              <MessageSquareIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Comment Chaos</h3>
              <p className="text-foreground/70">
                Your last TikTok got 1K comments. Cool, right? Wrong. You can't
                possibly read them all, but that's where the gold is hiding.
              </p>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-red-200/50">
              <EyeIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Trend Blindness</h3>
              <p className="text-foreground/70">
                While you're overthinking your next post, your audience is
                literally telling you what they want. But you're not listening.
              </p>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-red-200/50">
              <UsersIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Guesswork Game</h3>
              <p className="text-foreground/70">
                You're playing content roulette, hoping something sticks.
                Meanwhile, your competitors are using actual data to win.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="how-it-works" className="py-20">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              How smart creators hack their way to viral content
            </h2>
            <p className="text-xl text-foreground/70">
              Three steps to turn comment chaos into your next million-view
              video
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Paste & chill
                    </h3>
                    <p className="text-foreground/70">
                      Drop any viral TikTok, YouTube, Instagram, X, or Reddit
                      URL. Could be yours, could be your competitor's. We don't
                      judge.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      AI does the heavy lifting
                    </h3>
                    <p className="text-foreground/70">
                      While you grab a coffee, our AI reads every single comment
                      and finds the patterns humans miss. It's like having a
                      really smart intern.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xl">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Get your viral blueprint
                    </h3>
                    <p className="text-foreground/70">
                      Boom. Trending topics, viral hashtags, and content ideas
                      served on a silver platter. Time to create something that
                      actually hits.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl p-8 border">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3Icon className="h-5 w-5 text-primary" />
                  <span className="font-medium">Content Insights</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <TrendingUpIcon className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      Trending: "How to get clear skin naturally"
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <HashIcon className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">
                      Top hashtags: #skincare #natural #routine
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <MessageSquareIcon className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">
                      Most asked: "What products do you use?"
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <LightbulbIcon className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">
                      Content idea: "My morning skincare routine"
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              What happens when you stop guessing
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border">
              <TrendingUpIcon className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Trend Spotting</h3>
              <p className="text-foreground/70 mb-4">
                Catch trends before they blow up. While everyone else is late to
                the party, you're already there with the viral content.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Beat the algorithm</span>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border">
              <MessageSquareIcon className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Mind Reading</h3>
              <p className="text-foreground/70 mb-4">
                Know exactly what your audience wants before they even ask. It's
                like having superpowers, but for content creation.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Higher engagement guaranteed</span>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border">
              <HashIcon className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Idea Factory</h3>
              <p className="text-foreground/70 mb-4">
                Never stare at a blank screen again. Get fresh content ideas
                that actually work, not random stuff you pulled from thin air.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Content calendar = solved</span>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border">
              <UsersIcon className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">
                Competitor Stalking
              </h3>
              <p className="text-foreground/70 mb-4">
                See what's working for others without spending hours scrolling.
                Legally steal their best ideas and make them better.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Always one step ahead</span>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border">
              <EyeIcon className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Viral Radar</h3>
              <p className="text-foreground/70 mb-4">
                Spot viral opportunities before they're obvious. Create content
                that's destined to blow up, not just hoping it will.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Million-view potential</span>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border">
              <BarChart3Icon className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Data-Driven Wins</h3>
              <p className="text-foreground/70 mb-4">
                Make decisions based on actual data, not gut feelings. Stop
                wasting time on content that flops.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Higher success rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600">
        <div className="container max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Stop scrolling. Start creating.
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the smart creators who found their competitive edge. Your next
            viral moment is waiting in those comments.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="h-12 px-8 text-base bg-white text-primary hover:bg-gray-100"
              asChild
            >
              <Link href="/auth/signup">
                Find my viral idea now
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base border-white text-white hover:bg-white/10"
              asChild
            >
              <Link href="/#pricing">See pricing</Link>
            </Button>
          </div>

          <p className="text-sm mt-6 opacity-70">
            100 free comments • No credit card • Takes 30 seconds
          </p>
        </div>
      </section>
    </div>
  );
}
