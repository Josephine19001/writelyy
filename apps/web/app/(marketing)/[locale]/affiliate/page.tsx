import { Button } from '@ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@ui/components/card';
import { Badge } from '@ui/components/badge';
import {
  CheckIcon,
  DollarSignIcon,
  UsersIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  ClockIcon
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function AffiliatePage() {
  const t = await getTranslations();

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
          🚀 Affiliate Program
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Join our affiliate program as a friend of DataFast
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          The analytics tool for entrepreneurs. Earn 50% commission on every
          payment for up to 12 months! ✨
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="text-lg px-8 py-3">
            Join Affiliate Program
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-3">
            Learn More
          </Button>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card className="text-center">
          <CardHeader>
            <DollarSignIcon className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <CardTitle>50% Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Earn 50% on every payment your referrals make for up to 12 months
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <TrendingUpIcon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <CardTitle>Recurring Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Get paid monthly as long as your referrals stay subscribed
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <UsersIcon className="w-12 h-12 mx-auto mb-4 text-purple-600" />
            <CardTitle>Growing Market</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Analytics tools are in high demand among entrepreneurs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Commission Structure */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Commission Structure
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">Mini Plan</CardTitle>
              <CardDescription className="text-center">
                $20/month
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                $10/month
              </div>
              <p className="text-sm text-muted-foreground">
                Your commission per customer
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary">
            <CardHeader>
              <Badge className="w-fit mx-auto mb-2">Most Popular</Badge>
              <CardTitle className="text-center">Pro Plan</CardTitle>
              <CardDescription className="text-center">
                $50/month
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                $25/month
              </div>
              <p className="text-sm text-muted-foreground">
                Your commission per customer
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">Growth Plan</CardTitle>
              <CardDescription className="text-center">
                $100/month
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                $50/month
              </div>
              <p className="text-sm text-muted-foreground">
                Your commission per customer
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Program Details */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h3 className="text-2xl font-bold mb-6">Program Benefits</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">50% recurring commission</p>
                <p className="text-sm text-muted-foreground">
                  For every payment up to 12 months
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Real-time tracking</p>
                <p className="text-sm text-muted-foreground">
                  Monitor your referrals and earnings
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Marketing materials</p>
                <p className="text-sm text-muted-foreground">
                  Banners, templates, and resources
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Dedicated support</p>
                <p className="text-sm text-muted-foreground">
                  Personal affiliate manager
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-6">Program Terms</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <DollarSignIcon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Minimum payout: $100</p>
                <p className="text-sm text-muted-foreground">
                  Paid 30 days after customer payment
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheckIcon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">No branded keyword ads</p>
                <p className="text-sm text-muted-foreground">
                  Cannot run ads using "DataFast" keywords
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ClockIcon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">7-day trial period</p>
                <p className="text-sm text-muted-foreground">
                  All customers get 7 days free
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-2xl p-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join hundreds of affiliates already earning with DataFast. Start
          promoting today and see your first commission within days.
        </p>
        <Button size="lg" className="text-lg px-8 py-3">
          Apply to Join Program
        </Button>
      </div>
    </div>
  );
}
