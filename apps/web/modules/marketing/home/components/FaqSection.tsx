'use client';

import { cn } from '@ui/lib';
import { useTranslations } from 'next-intl';
import { Plus, Minus, Sparkles, Shield, DollarSign, Lock, Sliders, GraduationCap, Globe, Star } from 'lucide-react';
import { useState } from 'react';

export function FaqSection({ className }: { className?: string }) {
  const t = useTranslations();
  const faqT = useTranslations('marketing.faq');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const items = [
    {
      question: faqT('items.howItWorks.question'),
      icon: Sparkles,
      answer: faqT('items.howItWorks.answer')
    },
    {
      question: faqT('items.bypassDetectors.question'),
      icon: Shield,
      answer: faqT('items.bypassDetectors.answer')
    },
    {
      question: faqT('items.pricing.question'),
      icon: DollarSign,
      answer: faqT('items.pricing.answer')
    },
    {
      question: faqT('items.privacy.question'),
      icon: Lock,
      answer: faqT('items.privacy.answer')
    },
    {
      question: faqT('items.features.question'),
      icon: Sliders,
      answer: faqT('items.features.answer')
    },
    {
      question: faqT('items.academic.question'),
      icon: GraduationCap,
      answer: faqT('items.academic.answer')
    },
    {
      question: faqT('items.installation.question'),
      icon: Globe,
      answer: faqT('items.installation.answer')
    },
    {
      question: faqT('items.guarantee.question'),
      icon: Star,
      answer: faqT('items.guarantee.answer')
    }
  ];

  if (!items) {
    return null;
  }

  const handleValueChange = (value: string) => {
    setOpenItems(value ? [value] : []);
  };

  const isOpen = (value: string) => openItems.includes(value);

  return (
    <section
      className={cn('scroll-mt-20 border-t py-12 lg:py-16', className)}
      id="faq"
    >
      <div className="container max-w-4xl">
        <div className="mb-12 lg:text-center">
          <h1 className="mb-2 font-bold text-4xl lg:text-5xl">
            {faqT('title')}
          </h1>
          <p className="text-lg opacity-50">{faqT('description')}</p>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => {
            const value = `item-${i}`;
            const itemIsOpen = isOpen(value);
            const Icon = item.icon;

            return (
              <div
                key={`faq-item-${i}`}
                className="rounded-2xl bg-muted/50 border border-border/50 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => handleValueChange(itemIsOpen ? '' : value)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4 pr-4">
                    <Icon className="size-5 text-primary flex-shrink-0" />
                    <span className="font-medium text-lg">
                      {item.question}
                    </span>
                  </div>
                  {itemIsOpen ? (
                    <Minus className="size-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <Plus className="size-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {itemIsOpen && (
                  <div className="px-6 pb-6 pl-[4.5rem]">
                    <p className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
