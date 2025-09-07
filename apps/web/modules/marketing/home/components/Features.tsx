'use client';

import { cn } from '@ui/lib';
import {
  BrainIcon,
  MessageSquareIcon,
  TrendingUpIcon,
  ZapIcon,
  // SearchIcon,
  SettingsIcon,
  ExternalLinkIcon,
  FileTextIcon,
  BarChart3Icon,
  UserIcon,
  HashIcon,
  FilterIcon
} from 'lucide-react';
import Image, { type StaticImageData } from 'next/image';
import {
  type JSXElementConstructor,
  type ReactNode,
  useState,
  useEffect
} from 'react';
import { useTheme } from 'next-themes';
import commentImage from '../../../../public/images/product-features/comment.png';
import commentDarkImage from '../../../../public/images/product-features/comment-dark.png';
import analysisImage from '../../../../public/images/product-features/analysis.png';
import analysisDarkImage from '../../../../public/images/product-features/analysis-dark.png';
import integrationsImage from '../../../../public/images/product-features/integrations.png';
import integrationsDarkImage from '../../../../public/images/product-features/integrations-dark.png';

const getFeatureImage = (
  theme: string | undefined,
  lightImage: StaticImageData,
  darkImage: StaticImageData
) => {
  // Always return light image during SSR and initial hydration to prevent mismatch
  if (theme === undefined) {
    return lightImage;
  }
  return theme === 'dark' ? darkImage : lightImage;
};

export const featureTabs: Array<{
  id: string;
  title: string;
  icon: JSXElementConstructor<any>;
  subtitle?: string;
  description?: ReactNode;
  lightImage: StaticImageData;
  darkImage: StaticImageData;
  imageBorder?: boolean;
  stack?: {
    title: string;
    href: string;
    icon: JSXElementConstructor<any>;
  }[];
  highlights?: {
    title: string;
    description: string;
    icon: JSXElementConstructor<any>;
    demoLink?: string;
    docsLink?: string;
  }[];
}> = [
  {
    id: 'human-like-rewriting',
    title: 'Human-Like Rewriting',
    icon: MessageSquareIcon,
    subtitle: 'Transform robotic AI text into natural, engaging writing',
    description:
      'Our advanced AI varies sentence length, style, and vocabulary to create authentic human-like content that flows naturally.',
    stack: [],
    lightImage: commentImage,
    darkImage: commentDarkImage,
    imageBorder: true,
    highlights: [
      {
        title: 'Natural Flow',
        description:
          'Varies sentence structure and length for authentic human writing patterns.',
        icon: ExternalLinkIcon
      },
      {
        title: 'Vocabulary Mixing',
        description:
          'Uses diverse word choices and expressions to avoid robotic repetition.',
        icon: ZapIcon
      },
      {
        title: 'Context Awareness',
        description:
          'Maintains meaning while transforming tone and style appropriately.',
        icon: FilterIcon
      }
    ]
  },
  {
    id: 'ai-detection-bypass',
    title: 'AI Detection Bypass',
    icon: BrainIcon,
    subtitle: 'Pass all major AI detectors with confidence',
    description:
      "Crafted to bypass the most common AI detection tools including Turnitin, GPTZero, ZeroGPT, and more. Your content won't be flagged.",
    stack: [],
    lightImage: analysisImage,
    darkImage: analysisDarkImage,
    imageBorder: true,
    highlights: [
      {
        title: 'Turnitin Safe',
        description:
          'Designed to pass academic AI detection with natural writing patterns.',
        icon: BarChart3Icon
      },
      {
        title: 'GPTZero Bypass',
        description:
          'Specifically tested against popular AI detection tools.',
        icon: HashIcon
      },
      {
        title: 'Multiple Detectors',
        description:
          'Works against Originality.ai, CopyLeaks, Winston AI, and more.',
        icon: UserIcon
      }
    ]
  },
  {
    id: 'tone-control',
    title: 'Tone Control',
    icon: SettingsIcon,
    subtitle: 'Choose the perfect tone for any situation',
    description:
      'Select from Default, Professional, Friendly, or Academic tones to match your specific needs and audience.',
    stack: [],
    lightImage: integrationsImage,
    darkImage: integrationsDarkImage,
    imageBorder: true,
    highlights: [
      {
        title: 'Professional Mode',
        description:
          'Perfect for business reports, emails, and formal communications.',
        icon: FileTextIcon
      },
      {
        title: 'Academic Style',
        description:
          'Ideal for essays, research papers, and scholarly writing.',
        icon: TrendingUpIcon
      },
      {
        title: 'Friendly Tone',
        description:
          'Great for social media, blogs, and casual content creation.',
        icon: UserIcon
      }
    ]
  }
];

export function Features() {
  const [selectedTab, setSelectedTab] = useState(featureTabs[0].id);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not switching images until mounted
  const currentTheme = mounted ? resolvedTheme : undefined;

  return (
    <section id="features" className="scroll-my-20 pt-12 lg:pt-16">
      <div className="container max-w-5xl">
        <div className="mx-auto mb-6 lg:mb-0 lg:max-w-5xl lg:text-center">
          <h2 className="font-bold text-4xl lg:text-5xl">✨ Key Features</h2>
          <p className="mt-6 text-balance text-lg opacity-50">
            Human-Like Writing. AI Detection Bypass. Tone Control.
          </p>
        </div>

        <div className="mt-8 mb-4 hidden justify-center lg:flex">
          {featureTabs.map((tab) => {
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={cn(
                  'flex w-32 flex-col items-center gap-2 rounded-lg px-4 py-2 md:w-40',
                  selectedTab === tab.id
                    ? 'bg-primary/5 font-bold text-primary dark:bg-primary/10'
                    : 'font-medium text-foreground/80'
                )}
              >
                <tab.icon
                  className={cn(
                    'size-6 md:size-8',
                    selectedTab === tab.id
                      ? 'text-primary'
                      : 'text-foreground opacity-30'
                  )}
                />
                <span className="text-xs md:text-sm text-center leading-tight">
                  {tab.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="container max-w-5xl">
          {featureTabs.map((tab) => {
            const filteredStack = tab.stack || [];
            const filteredHighlights = tab.highlights || [];
            const currentImage = getFeatureImage(
              currentTheme,
              tab.lightImage,
              tab.darkImage
            );

            return (
              <div
                key={tab.id}
                className={cn(
                  'border-t py-8 first:border-t-0 md:py-12 lg:border lg:first:border-t lg:rounded-3xl lg:p-6',
                  selectedTab === tab.id ? 'block' : 'block lg:hidden'
                )}
              >
                <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 lg:gap-12">
                  <div>
                    <h3 className="font-normal text-2xl text-foreground/60 leading-normal md:text-3xl">
                      <strong className="text-primary">{tab.title}. </strong>
                      {tab.subtitle}
                    </h3>

                    {tab.description && (
                      <p className="mt-4 text-foreground/60">
                        {tab.description}
                      </p>
                    )}

                    {filteredStack?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-6">
                        {filteredStack.map((tool, k) => (
                          <a
                            href={tool.href}
                            target="_blank"
                            key={`stack-tool-${k}`}
                            className="flex items-center gap-2"
                            rel="noreferrer"
                          >
                            <tool.icon className="size-6" />
                            <strong className="block text-sm">
                              {tool.title}
                            </strong>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <Image
                      src={currentImage}
                      alt={tab.title}
                      className={cn('h-auto w-full max-w-xl', {
                        'rounded-2xl border-4 border-primary/10':
                          tab.imageBorder
                      })}
                    />
                  </div>
                </div>

                {filteredHighlights.length > 0 && (
                  <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredHighlights.map((highlight, k) => (
                      <div
                        key={`highlight-${k}`}
                        className="flex flex-col items-stretch justify-between rounded-xl bg-card border p-4"
                      >
                        <div>
                          <highlight.icon
                            className="text-primary text-xl"
                            width="1em"
                            height="1em"
                          />
                          <strong className="mt-2 block">
                            {highlight.title}
                          </strong>
                          <p className="mt-1 text-sm opacity-50">
                            {highlight.description}
                          </p>
                        </div>
                      </div>
                    ))}
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
