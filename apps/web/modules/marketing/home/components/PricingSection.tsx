'use client';
import { LocaleLink } from '@i18n/routing';
import { Button } from '@ui/components/button';
import { CheckIcon, ArrowRightIcon } from 'lucide-react';

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-16 py-12 lg:py-16">
      <div className="container max-w-4xl">
        <div className="mb-12 lg:text-center">
          <h1 className="font-bold text-4xl lg:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-foreground/60">
            Get 1,000 words free on signup. Choose your plan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-8xl mx-auto">
          {/* Starter Plan */}
          <div className="relative rounded-2xl border border-primary bg-gradient-to-br from-primary/5 to-primary/10 p-12 flex flex-col h-full">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                Most Popular
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-3xl mb-3">Starter</h3>
              <p className="text-foreground/60">
                Perfect for getting started with Writelyy
              </p>
            </div>

            <div className="mb-8">
              <div className="text-5xl font-bold">$4.99</div>
              <div className="text-foreground/60 text-lg">per month</div>
              <div className="text-sm text-foreground/50 mt-2">
                15,000 words/month. Cancel anytime.
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3">
                <CheckIcon className="h-6 w-6 text-primary" />
                <span className="text-base">15,000 words/month</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon className="h-6 w-6 text-primary" />
                <span className="text-base">All 4 tone options</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon className="h-6 w-6 text-primary" />
                <span className="text-base">AI detection bypass</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon className="h-6 w-6 text-primary" />
                <span className="text-base">
                  Google Docs & Notion extension
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon className="h-6 w-6 text-primary" />
                <span className="text-base">Web text editor</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon className="h-6 w-6 text-primary" />
                <span className="text-base">Email support</span>
              </li>
            </ul>

            <Button className="w-full h-12 text-base" asChild>
              <LocaleLink href="/auth/signup">
                Get Started
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </LocaleLink>
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl border border-border bg-card p-12 flex flex-col h-full">
            <div className="mb-8">
              <h3 className="font-bold text-3xl mb-3">Pro</h3>
              <p className="text-foreground/60">
                For regular writers and professionals
              </p>
            </div>

            <div className="mb-8">
              <div className="text-5xl font-bold">$12.99</div>
              <div className="text-foreground/60 text-lg">per month</div>
              <div className="text-sm text-foreground/50 mt-2">
                75,000 words/month. Cancel anytime.
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3">
                <CheckIcon className="h-6 w-6 text-primary" />
                <span className="text-base">75,000 words/month</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon className="h-6 w-6 text-primary" />
                <span className="text-base">All tone options</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon className="h-6 w-6 text-primary" />
                <span className="text-base">Advanced AI detection bypass</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon className="h-6 w-6 text-primary" />
                <span className="text-base">
                  Google Docs & Notion extension
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon className="h-6 w-6 text-primary" />
                <span className="text-base">Priority support</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon className="h-6 w-6 text-primary" />
                <span className="text-base">Export functionality</span>
              </li>
            </ul>

            <Button className="w-full h-12 text-base" variant="outline" asChild>
              <LocaleLink href="/auth/signup">Get Pro</LocaleLink>
            </Button>
          </div>

          {/* Unlimited Plan */}
          <div className="relative rounded-2xl border border-border bg-card p-12 flex flex-col h-full">
            <div className="mb-8">
              <h3 className="font-bold text-3xl mb-3">Unlimited</h3>
              <p className="text-foreground/60">For power users and teams</p>
            </div>

            <div className="mb-8">
              <div className="text-5xl font-bold">$24.99</div>
              <div className="text-foreground/60 text-lg">per month</div>
              <div className="text-sm text-foreground/50 mt-2">
                Unlimited words. Cancel anytime.
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3">
                <CheckIcon className="h-6 w-6 text-primary" />
                <span className="text-base">Unlimited words</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon className="h-6 w-6 text-primary" />
                <span className="text-base">All features included</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon className="h-6 w-6 text-primary" />
                <span className="text-base">Priority support</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon className="h-6 w-6 text-primary" />
                <span className="text-base">API access</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon className="h-6 w-6 text-primary" />
                <span className="text-base">Team collaboration</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon className="h-6 w-6 text-primary" />
                <span className="text-base">White-label options</span>
              </li>
            </ul>

            <Button className="w-full h-12 text-base" variant="outline" asChild>
              <LocaleLink href="/auth/signup">Get Unlimited</LocaleLink>
            </Button>
          </div>
        </div>

        {/* Social proof */}
        <div className="mt-12 text-center">
          <p className="text-foreground/60 mb-6 flex items-center justify-center gap-2">
            <span className="text-lg">✨</span>
            <span className="italic">
              Trusted by 50,000+ writers to make their AI text undetectable
            </span>
          </p>
        </div>

        {/* Additional info */}
        <div className="mt-8 text-center">
          <p className="text-foreground/60 mb-4">
            Questions about pricing?{' '}
            <LocaleLink
              href="/contact"
              className="text-primary hover:underline"
            >
              Get in touch
            </LocaleLink>
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-foreground/60">
            <CheckIcon className="h-4 w-4 text-primary" />
            <span>No setup fees</span>
            <span>•</span>
            <CheckIcon className="h-4 w-4 text-primary" />
            <span>Cancel anytime</span>
            <span>•</span>
            <CheckIcon className="h-4 w-4 text-primary" />
            <span>30-day money back guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
}
