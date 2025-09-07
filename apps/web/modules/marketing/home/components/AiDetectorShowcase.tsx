'use client';

import { Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const aiDetectors = [
  {
    name: 'Turnitin',
    logo: 'https://res.cloudinary.com/josephine19001/image/upload/v1757206258/Writelyy/turnitin_luvmql.webp',
    delay: 0
  },
  {
    name: 'GPTZero',
    logo: 'https://res.cloudinary.com/josephine19001/image/upload/v1757206258/Writelyy/gptzero_a9tdc7.webp',
    delay: 1000
  },
  {
    name: 'ZeroGPT',
    logo: 'https://res.cloudinary.com/josephine19001/image/upload/v1757206258/Writelyy/zerogpt_tzcoib.webp',
    delay: 2000
  },
  {
    name: 'CopyLeaks',
    logo: 'https://res.cloudinary.com/josephine19001/image/upload/v1757206258/Writelyy/copyleaks_a4ln5b.webp',
    delay: 3000
  },
  {
    name: 'Winston AI',
    logo: 'https://res.cloudinary.com/josephine19001/image/upload/v1757206258/Writelyy/winston-ai_cplvdl.png',
    delay: 4000
  },
  {
    name: 'Grammarly',
    logo: 'https://res.cloudinary.com/josephine19001/image/upload/v1757206258/Writelyy/grammarly_tsidgj.webp',
    delay: 5000
  },
  {
    name: 'QuillBot',
    logo: 'https://res.cloudinary.com/josephine19001/image/upload/v1757206259/Writelyy/quillbot_iofijs.webp',
    delay: 6000
  }
];

// Duplicate the array for seamless looping
const duplicatedDetectors = [...aiDetectors, ...aiDetectors];

export function AiDetectorShowcase() {
  const t = useTranslations('marketing.aiDetector');

  return (
    <section className="py-8 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
      <div className="container max-w-6xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            <span>{t('badge')}</span>
          </div>

          {/* <h2 className="font-bold text-3xl lg:text-4xl mb-4">{t('title')}</h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p> */}
        </div>

        {/* Horizontal scrolling detector showcase */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll-horizontal space-x-8 py-4">
            {duplicatedDetectors.map((detector, index) => (
              <div
                key={`${detector.name}-${index}`}
                className="flex-shrink-0 p-6 flex items-center justify-center"
              >
                <div className="h-20 flex items-center justify-center">
                  <Image
                    src={detector.logo}
                    alt={`${detector.name} logo`}
                    width={120}
                    height={80}
                    className="object-contain max-h-20 grayscale dark:grayscale-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center status indicator */}
        {/* <div className="flex justify-center mb-12">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-dashed border-green-500/30 flex items-center justify-center">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-green-600 dark:text-green-400">
                {t('centerStatus')}
              </div>
            </div>
          </div>
        </div> */}

        {/* Bottom stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {t('stats.successRate.number')}
            </div>
            <p className="text-sm text-foreground/60">
              {t('stats.successRate.label')}
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {t('stats.detectorsBypassed.number')}
            </div>
            <p className="text-sm text-foreground/60">
              {t('stats.detectorsBypassed.label')}
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {t('stats.processingTime.number')}
            </div>
            <p className="text-sm text-foreground/60">
              {t('stats.processingTime.label')}
            </p>
          </div>
        </div> */}
      </div>

      <style jsx>{`
        @keyframes scroll-horizontal {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-horizontal {
          animation: scroll-horizontal 40s linear infinite;
          width: 200%;
        }
      `}</style>
    </section>
  );
}
