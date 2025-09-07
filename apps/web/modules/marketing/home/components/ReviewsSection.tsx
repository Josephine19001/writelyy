'use client';

import { cn } from '@ui/lib';
import { Quote } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ReviewsSection({ className }: { className?: string }) {
  const t = useTranslations('marketing.reviews');
  
  const reviews = [
    {
      id: 1,
      name: t('testimonials.student.name'),
      role: t('testimonials.student.role'),
      text: t('testimonials.student.text'),
      category: t('testimonials.student.category')
    },
    {
      id: 2,
      name: t('testimonials.creator.name'),
      role: t('testimonials.creator.role'),
      text: t('testimonials.creator.text'),
      category: t('testimonials.creator.category')
    },
    {
      id: 3,
      name: t('testimonials.professional.name'),
      role: t('testimonials.professional.role'),
      text: t('testimonials.professional.text'),
      category: t('testimonials.professional.category')
    }
  ];
  
  return (
    <section className={cn('py-16 lg:py-20', className)}>
      <div className="container max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-bold text-4xl lg:text-5xl mb-6">
            {t('title')}
          </h2>
          <p className="text-foreground/60 text-lg max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={cn(
                'relative bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/60 transition-all duration-300 hover:shadow-lg hover:border-primary/30 group',
                index === 1 && 'md:scale-105 ring-2 ring-primary/20 shadow-lg'
              )}
            >
              {/* Category Badge */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={cn(
                    'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium',
                    review.category === t('testimonials.student.category')
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                      : review.category === t('testimonials.creator.category')
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300'
                        : 'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300'
                  )}
                >
                  {review.category}
                </div>
                <Quote className="w-5 h-5 text-primary/30 group-hover:text-primary/50 transition-colors" />
              </div>

              {/* Review Text */}
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-base font-medium mb-1">
                  "{review.text}"
                </p>
              </div>

              {/* Author */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  {review.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {review.role}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Stats Section */}
        <div className="bg-gradient-to-r from-primary/5 via-purple-600/5 to-primary/5 rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-3">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {t('stats.happyWriters.number')}
              </div>
              <div className="text-sm font-medium text-foreground/70">
                {t('stats.happyWriters.label')}
              </div>
              <div className="text-xs text-foreground/50">
                {t('stats.happyWriters.sublabel')}
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {t('stats.wordsHumanized.number')}
              </div>
              <div className="text-sm font-medium text-foreground/70">
                {t('stats.wordsHumanized.label')}
              </div>
              <div className="text-xs text-foreground/50">
                {t('stats.wordsHumanized.sublabel')}
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {t('stats.bypassSuccess.number')}
              </div>
              <div className="text-sm font-medium text-foreground/70">
                {t('stats.bypassSuccess.label')}
              </div>
              <div className="text-xs text-foreground/50">
                {t('stats.bypassSuccess.sublabel')}
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {t('stats.processingTime.number')}
              </div>
              <div className="text-sm font-medium text-foreground/70">
                {t('stats.processingTime.label')}
              </div>
              <div className="text-xs text-foreground/50">
                {t('stats.processingTime.sublabel')}
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 pt-8 border-t border-border/50">
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-foreground/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>{t('trustIndicators.universities')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span>{t('trustIndicators.creators')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span>{t('trustIndicators.security')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
