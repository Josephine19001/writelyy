import { Button } from '@ui/components/button';
import {
  UserIcon,
  BarChart3Icon,
  TrendingUpIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ShieldIcon,
  AlertTriangleIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  ZapIcon
} from 'lucide-react';
import Link from 'next/link';

export default function SocialMediaStrategistsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 mb-8">
            <UserIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              For Social Media Strategists
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Stop drowning in mentions.
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {' '}
              Start winning.
            </span>
          </h1>

          <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            While you're manually tracking every mention, smart strategists are
            using AI to monitor sentiment and spot opportunities 24/7. Your
            weekend is about to get a lot better.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link href="/auth/signup">
                Monitor everything, work less
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
            Why your social media strategy is basically playing whack-a-mole
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-red-200/50">
              <AlertTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Scroll Syndrome</h3>
              <p className="text-foreground/70">
                You're spending your entire weekend manually scrolling through
                mentions across 5 platforms. Your family thinks you've
                disappeared.
              </p>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-red-200/50">
              <EyeIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Crisis Blindness</h3>
              <p className="text-foreground/70">
                By the time you notice negative sentiment, it's already
                trending. You're always one step behind the outrage cycle.
              </p>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-red-200/50">
              <BarChart3Icon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Report Limbo</h3>
              <p className="text-foreground/70">
                Your reports are full of pretty charts that don't tell anyone
                what to actually do. Your boss wants answers, not analytics.
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
              How smart strategists automate their way to the top
            </h2>
            <p className="text-xl text-foreground/70">
              Three steps to turn social chaos into strategic gold
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
                      Set your AI watchdog
                    </h3>
                    <p className="text-foreground/70">
                      Point us to posts about your context, competitors, or
                      industry. We'll make it easier to monitor so you can
                      actually sleep.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      AI reads the mood
                    </h3>
                    <p className="text-foreground/70">
                      Our AI analyzes thousands of comments to track sentiment,
                      spot trends, and flag potential crises before they
                      explode.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xl">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Get insights that actually matter
                    </h3>
                    <p className="text-foreground/70">
                      Receive reports that tell you exactly what to do next, not
                      just what happened. Your strategy just got a brain
                      upgrade.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl p-8 border">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3Icon className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    Context Sentiment Dashboard
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HeartIcon className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Positive sentiment</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      78%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Neutral sentiment</span>
                    </div>
                    <span className="text-sm font-medium text-yellow-600">
                      15%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShareIcon className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Negative sentiment</span>
                    </div>
                    <span className="text-sm font-medium text-red-600">7%</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUpIcon className="h-4 w-4 text-blue-500" />
                      <span>Trending topic: "Customer service excellence"</span>
                    </div>
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
              What happens when you stop manually scrolling
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border">
              <HeartIcon className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Mood Ring</h3>
              <p className="text-foreground/70 mb-4">
                Know exactly how people feel about your context in real-time.
                Catch positive waves and negative storms before they hit.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Never miss a sentiment shift</span>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border">
              <BarChart3Icon className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Engagement Decoder</h3>
              <p className="text-foreground/70 mb-4">
                Figure out what actually makes people engage vs. just scroll
                past. Stop creating content that gets ignored.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Higher engagement rates</span>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border">
              <ShieldIcon className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Crisis Detector</h3>
              <p className="text-foreground/70 mb-4">
                Spot potential PR disasters before they blow up. Be the hero who
                prevented the crisis, not the one who cleaned up the mess.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Prevent context disasters</span>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border">
              <TrendingUpIcon className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Trend Surfer</h3>
              <p className="text-foreground/70 mb-4">
                Ride the wave of emerging trends before they become mainstream.
                While others are catching up, you're already ahead.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>First to market advantage</span>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border">
              <EyeIcon className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Spy Mode</h3>
              <p className="text-foreground/70 mb-4">
                See what people really think about your competitors. Find their
                weak spots and make them your strong points.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Competitive intelligence</span>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border">
              <ZapIcon className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Report Robot</h3>
              <p className="text-foreground/70 mb-4">
                Get comprehensive reports that actually tell you what to do
                next. No more spending hours making charts nobody understands.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Get your weekends back</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Real scenarios where strategists use Writelyy
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-8 border border-blue-200/50">
              <h3 className="font-semibold text-xl mb-4">
                Campaign Performance Analysis
              </h3>
              <p className="text-foreground/70 mb-6">
                "After launching a new campaign, I analyze comments to
                understand audience reception. This helps me optimize future
                campaigns and identify what messaging resonates best with our
                target demographic."
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Optimize campaign performance</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl p-8 border border-green-200/50">
              <h3 className="font-semibold text-xl mb-4">
                Context Health Monitoring
              </h3>
              <p className="text-foreground/70 mb-6">
                "I track context mentions across platforms to monitor our
                reputation. When negative sentiment spikes, I can quickly
                identify the cause and coordinate with our PR team to address
                issues before they escalate."
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Maintain context reputation</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-8 border border-purple-200/50">
              <h3 className="font-semibold text-xl mb-4">
                Content Strategy Optimization
              </h3>
              <p className="text-foreground/70 mb-6">
                "I analyze which types of content generate the most positive
                engagement and meaningful conversations. This data drives our
                content calendar and helps us create more of what our audience
                loves."
              </p>
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Create engaging content</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-8 border border-orange-200/50">
              <h3 className="font-semibold text-xl mb-4">
                Influencer Partnership Evaluation
              </h3>
              <p className="text-foreground/70 mb-6">
                "Before partnering with influencers, I analyze their audience's
                comments to understand sentiment and engagement quality. This
                helps us choose partners whose audiences align with our context
                values."
              </p>
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Choose better partnerships</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600">
        <div className="container max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Stop scrolling. Start strategizing.
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the strategists who automated their monitoring and actually
            have time to think big picture. Your context deserves better than
            reactive damage control.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="h-12 px-8 text-base bg-white text-primary hover:bg-gray-100"
              asChild
            >
              <Link href="/auth/signup">
                Automate my monitoring
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
