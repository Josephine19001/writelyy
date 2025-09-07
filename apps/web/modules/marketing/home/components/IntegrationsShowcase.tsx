'use client';

import { Badge } from '@ui/components/badge';
import { Button } from '@ui/components/button';
import {
  CheckCircleIcon,
  ArrowRightIcon,
  // ExternalLinkIcon,
  StarIcon
  // Globe,
  // FileText,
  // Mail,
  // MessageSquare
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import notionIcon from '../../../../public/integrations-icons/notion.png';

const integrations = [
  {
    name: 'Browser Extension',
    description:
      'Works everywhere you write - Google Docs, Gmail, Notion, and more',
    icon: notionIcon,
    status: 'available' as const,
    popular: true,
    features: [
      'One-click rewriting',
      'Works in any text field',
      'Instant transformation'
    ]
  }
];

export function IntegrationsShowcase() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <StarIcon className="h-4 w-4 fill-current" />
            <span>Works Everywhere You Write</span>
          </div>
          <h2 className="font-bold text-4xl lg:text-5xl mb-6">
            Seamless{' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Integration
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Writelyy works directly in your favorite writing tools. No more
            switching between apps or copy-pasting text.
          </p>
        </div>

        {/* Integration Card - Centered */}
        <div className="flex justify-center mb-16">
          <div className="max-w-md w-full">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary/30 hover:-translate-y-1"
              >
                {/* Popular badge */}
                {integration.popular && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-primary to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}

                {/* Icon and Status */}
                <div className="flex items-center justify-between mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Image
                        src={integration.icon}
                        alt={integration.name}
                        className="w-12 h-12 object-contain"
                        width={48}
                        height={48}
                      />
                    </div>
                  </div>

                  <Badge className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
                    <CheckCircleIcon className="w-3 h-3" />
                    Available
                  </Badge>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-xl mb-2">
                      {integration.name}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {integration.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {integration.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    asChild
                  >
                    <Link href="/auth/signup">
                      Get Started
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        {/* <div className="text-center">
          <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold mb-4">Want something else?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're constantly building new integrations. Got a specific tool
              that would make your life easier? Just ask!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">
                  Request Integration
                  <ExternalLinkIcon className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/signup">
                  Start with Notion
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
