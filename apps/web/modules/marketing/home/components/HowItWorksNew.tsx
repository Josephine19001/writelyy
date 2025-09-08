'use client';

import { useState } from 'react';
import { cn } from '@ui/lib';
import {
  Sparkles,
  Search,
  FileText,
  RefreshCw,
  Edit3,
  Download,
  Settings
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export function HowItWorks() {
  const t = useTranslations('marketing.howItWorks');
  const [activeTab, setActiveTab] = useState('humanizer');
  
  const steps = [
    {
      id: 'humanizer',
      title: t('products.humanizer.title'),
      icon: Sparkles,
      description: t('products.humanizer.description'),
      steps: [
        {
          icon: Edit3,
          title: t('products.humanizer.steps.pasteText.title'),
          description: t('products.humanizer.steps.pasteText.description')
        },
        {
          icon: Settings,
          title: t('products.humanizer.steps.selectTone.title'),
          description: t('products.humanizer.steps.selectTone.description')
        },
        {
          icon: Sparkles,
          title: t('products.humanizer.steps.getHumanized.title'),
          description: t('products.humanizer.steps.getHumanized.description')
        }
      ]
    },
    {
      id: 'detector',
      title: t('products.detector.title'),
      icon: Search,
      description: t('products.detector.description'),
      steps: [
        {
          icon: FileText,
          title: t('products.detector.steps.inputText.title'),
          description: t('products.detector.steps.inputText.description')
        },
        {
          icon: Search,
          title: t('products.detector.steps.analyzeContent.title'),
          description: t('products.detector.steps.analyzeContent.description')
        },
        {
          icon: Download,
          title: t('products.detector.steps.viewResults.title'),
          description: t('products.detector.steps.viewResults.description')
        }
      ]
    },
    {
      id: 'summariser',
      title: t('products.summariser.title'),
      icon: FileText,
      description: t('products.summariser.description'),
      steps: [
        {
          icon: FileText,
          title: t('products.summariser.steps.addContent.title'),
          description: t('products.summariser.steps.addContent.description')
        },
        {
          icon: RefreshCw,
          title: t('products.summariser.steps.processSummary.title'),
          description: t('products.summariser.steps.processSummary.description')
        },
        {
          icon: Download,
          title: t('products.summariser.steps.getResults.title'),
          description: t('products.summariser.steps.getResults.description')
        }
      ]
    },
    {
      id: 'paraphraser',
      title: t('products.paraphraser.title'),
      icon: RefreshCw,
      description: t('products.paraphraser.description'),
      steps: [
        {
          icon: Edit3,
          title: t('products.paraphraser.steps.enterText.title'),
          description: t('products.paraphraser.steps.enterText.description')
        },
        {
          icon: RefreshCw,
          title: t('products.paraphraser.steps.rephrase.title'),
          description: t('products.paraphraser.steps.rephrase.description')
        },
        {
          icon: Download,
          title: t('products.paraphraser.steps.copyResult.title'),
          description: t('products.paraphraser.steps.copyResult.description')
        }
      ]
    }
  ];
  
  const activeStep = steps.find((step) => step.id === activeTab) || steps[0];

  return (
    <section className="py-20 lg:py-24 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/50 dark:to-gray-900/50">
      <div className="container max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="font-bold text-4xl lg:text-5xl mb-6">
            {t('title')}
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border max-w-full overflow-x-auto">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <button
                  type="button"
                  key={step.id}
                  onClick={() => setActiveTab(step.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 font-medium whitespace-nowrap',
                    activeTab === step.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-foreground/70 hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-700'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border p-8 lg:p-12">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <activeStep.icon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{activeStep.title}</h3>
            <p className="text-foreground/60 text-lg">
              {activeStep.description}
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {activeStep.steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={index} className="text-center group relative">
                  {/* Step Number Badge */}
                  <div className="flex justify-center mb-4">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                      <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span>Step {index + 1}</span>
                    </div>
                  </div>

                  {/* Icon Container */}
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-105 transition-transform duration-200 shadow-sm">
                      <StepIcon className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  <h4 className="font-semibold text-lg mb-3">{step.title}</h4>
                  <p className="text-foreground/60 text-sm leading-relaxed">{step.description}</p>

                  {/* Connection Line (except for last step) */}
                  {index < activeStep.steps.length - 1 && (
                    <div className="hidden md:block absolute top-20 left-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent transform -translate-y-1/2 translate-x-8" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12 pt-8 border-t border-border">
            <div className="inline-flex items-center gap-2 text-sm text-foreground/60 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span>{t('processingTime')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
