'use client';

import { Sparkles, Shield, Users, MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function FeaturesSection({ className }: { className?: string }) {
  const t = useTranslations('marketing.features');
  
  const features = [
    {
      icon: Sparkles,
      title: t('rewriteToHuman.title'),
      description: t('rewriteToHuman.description')
    },
    {
      icon: Shield,
      title: t('aiDetection.title'),
      description: t('aiDetection.description')
    },
    {
      icon: Users,
      title: t('addCollaborators.title'),
      description: t('addCollaborators.description')
    },
    {
      icon: MessageSquare,
      title: t('createContexts.title'),
      description: t('createContexts.description')
    }
  ];
  
  return (
    <section
      id="features"
      className="py-16 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20"
    >
      <div className="container max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl lg:text-4xl mb-3">
            {t('title')}
          </h2>
          <p className="text-foreground/60 text-base max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-border hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-foreground/70 text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
