import { Button } from '@ui/components/button';
import {
  BrainIcon,
  AlertTriangleIcon,
  TrendingUpIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  LightbulbIcon,
  UsersIcon,
  ShieldIcon,
  BarChart3Icon,
  ZapIcon,
  BugIcon
} from 'lucide-react';
import Link from 'next/link';

export default function ProductTeamsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 mb-8">
            <BrainIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              For Product Teams
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Your users are screaming
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {' '}
              what to build next
            </span>
          </h1>

          <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            Stop building features nobody wants. Your customers are literally
            telling you their biggest problems in comments. Smart product teams
            already know this secret.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link href="/auth/signup">
                Find out what to build
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
            Why your product roadmap is basically a guessing game
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-red-200/50">
              <AlertTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">The Silent Exodus</h3>
              <p className="text-foreground/70">
                Your customers are rage-quitting and posting about it on social
                media. But you're too busy shipping features to notice until
                it's too late.
              </p>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-red-200/50">
              <BugIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Feature Roulette</h3>
              <p className="text-foreground/70">
                You're building what YOU think users want, not what they
                actually need. Meanwhile, their real problems are spelled out in
                every comment section.
              </p>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-red-200/50">
              <TrendingUpIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">
                Competitor Speed Run
              </h3>
              <p className="text-foreground/70">
                While you're stuck in endless product meetings, your competitors
                are reading user feedback and shipping exactly what people want.
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
              How smart product teams stop guessing and start winning
            </h2>
            <p className="text-xl text-foreground/70">
              Three steps to turn user chaos into your next product breakthrough
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
                      Spy on the conversations
                    </h3>
                    <p className="text-foreground/70">
                      Drop links to posts about your product, your competitors,
                      or your industry. We'll dig through all the comments so
                      you don't have to.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      AI reads the room
                    </h3>
                    <p className="text-foreground/70">
                      Our AI sorts through thousands of comments to find the
                      feature requests, bug reports, and churn signals that
                      actually matter.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xl">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Build what people actually want
                    </h3>
                    <p className="text-foreground/70">
                      Get a prioritized list of what to build next, backed by
                      real user pain points and direct quotes. Your roadmap just
                      got a lot smarter.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl p-8 border">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3Icon className="h-5 w-5 text-primary" />
                  <span className="font-medium">Product Insights</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangleIcon className="h-4 w-4 text-red-500 mt-1" />
                    <div>
                      <span className="text-sm font-medium">Critical Bug</span>
                      <p className="text-xs text-foreground/70">
                        "App crashes when uploading large files"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <LightbulbIcon className="h-4 w-4 text-yellow-500 mt-1" />
                    <div>
                      <span className="text-sm font-medium">
                        Feature Request
                      </span>
                      <p className="text-xs text-foreground/70">
                        "Need dark mode - my eyes hurt"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <TrendingUpIcon className="h-4 w-4 text-green-500 mt-1" />
                    <div>
                      <span className="text-sm font-medium">Opportunity</span>
                      <p className="text-xs text-foreground/70">
                        "Wish this integrated with Slack"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ShieldIcon className="h-4 w-4 text-blue-500 mt-1" />
                    <div>
                      <span className="text-sm font-medium">Churn Risk</span>
                      <p className="text-xs text-foreground/70">
                        "Considering switching to competitor"
                      </p>
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
              What happens when you actually listen to users
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border">
              <ShieldIcon className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Churn Blocker</h3>
              <p className="text-foreground/70 mb-4">
                Catch customers before they rage-quit. When someone's about to
                leave, they usually complain first. We help you spot these
                warning signs.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Save customers before they leave</span>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border">
              <LightbulbIcon className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Feature Oracle</h3>
              <p className="text-foreground/70 mb-4">
                Build features people actually want, not what sounds cool in
                meetings. Every feature request comes with proof that people
                need it.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Higher feature adoption</span>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border">
              <BugIcon className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Bug Radar</h3>
              <p className="text-foreground/70 mb-4">
                Find bugs before they become disasters. Users complain about
                problems on social media way before they file tickets.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Fix issues faster</span>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border">
              <TrendingUpIcon className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Competitor Intel</h3>
              <p className="text-foreground/70 mb-4">
                See what users hate about your competitors and build the
                solution they're begging for. It's like having a spy in their
                user base.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Steal market share</span>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border">
              <UsersIcon className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">User Whisperer</h3>
              <p className="text-foreground/70 mb-4">
                Understand what users actually do vs. what they say they do.
                Real behavior beats survey responses every time.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Build for reality, not fantasy</span>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border">
              <ZapIcon className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Speed Demon</h3>
              <p className="text-foreground/70 mb-4">
                Ship features that users love on the first try. No more endless
                iterations because you finally know what people want.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Faster product-market fit</span>
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
              Real scenarios where founders use Writelyy
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-8 border border-blue-200/50">
              <h3 className="font-semibold text-xl mb-4">
                SaaS Product Development
              </h3>
              <p className="text-foreground/70 mb-6">
                "I analyze comments on competitor product launches to understand
                what features users really want. This helps me prioritize our
                roadmap based on actual demand, not just internal assumptions."
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Build features customers actually want</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl p-8 border border-green-200/50">
              <h3 className="font-semibold text-xl mb-4">Customer Success</h3>
              <p className="text-foreground/70 mb-6">
                "When customers post about issues with our product, I use
                Writelyy to understand the root cause and identify similar
                complaints. This helps us fix problems before they cause churn."
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Prevent churn proactively</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-8 border border-purple-200/50">
              <h3 className="font-semibold text-xl mb-4">Market Research</h3>
              <p className="text-foreground/70 mb-6">
                "Before launching new features, I analyze discussions about
                similar products to understand user expectations and potential
                objections. This helps us position and price correctly."
              </p>
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Launch with confidence</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-8 border border-orange-200/50">
              <h3 className="font-semibold text-xl mb-4">
                Competitive Intelligence
              </h3>
              <p className="text-foreground/70 mb-6">
                "I monitor what customers say about our competitors to identify
                gaps in their offerings. This helps us find opportunities to
                differentiate and win market share."
              </p>
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Outmaneuver competition</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600">
        <div className="container max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Stop building features nobody wants
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the product teams who stopped guessing and started shipping
            features that users actually love.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="h-12 px-8 text-base bg-white text-primary hover:bg-gray-100"
              asChild
            >
              <Link href="/auth/signup">
                Show me what to build
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
