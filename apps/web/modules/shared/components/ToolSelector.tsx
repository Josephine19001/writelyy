'use client';

import { Button } from '@ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@ui/components/dropdown-menu';
import { cn } from '@ui/lib';
import {
  ChevronDownIcon,
  SparklesIcon,
  ShieldCheckIcon,
  PlusIcon,
  FileTextIcon,
  RepeatIcon
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface ToolSelectorProps {
  currentTool: 'humanizer' | 'detector' | 'summariser' | 'paraphraser';
  onNewAction?: () => void;
  className?: string;
}

export function ToolSelector({ currentTool, onNewAction, className }: ToolSelectorProps) {
  const t = useTranslations();
  
  const tools = [
    {
      id: 'humanizer' as const,
      name: t('tools.humanizer.name'),
      icon: SparklesIcon,
      href: '/app',
      description: t('tools.humanizer.description')
    },
    {
      id: 'detector' as const,
      name: t('tools.detector.name'),
      icon: ShieldCheckIcon,
      href: '/app/detector',
      description: t('tools.detector.description')
    },
    {
      id: 'summariser' as const,
      name: t('tools.summariser.name'),
      icon: FileTextIcon,
      href: '/app/summariser',
      description: t('tools.summariser.description')
    },
    {
      id: 'paraphraser' as const,
      name: t('tools.paraphraser.name'),
      icon: RepeatIcon,
      href: '/app/paraphraser',
      description: t('tools.paraphraser.description')
    }
  ];

  const currentToolData = tools.find(tool => tool.id === currentTool);
  const otherTools = tools.filter(tool => tool.id !== currentTool);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* New Button */}
      {onNewAction ? (
        <Button
          onClick={onNewAction}
          variant="outline"
          size="sm"
          className="gap-2 h-8 text-xs"
        >
          <PlusIcon className="h-3 w-3" />
          {t('tools.new')}
        </Button>
      ) : (
        <Button
          asChild
          variant="outline"
          size="sm"
          className="gap-2 h-8 text-xs"
        >
          <Link href={currentToolData?.href || '/app'}>
            <PlusIcon className="h-3 w-3" />
            {t('tools.new')}
          </Link>
        </Button>
      )}

      {/* Tool Selector Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 h-8 px-2 text-xs font-medium hover:bg-primary/10 hover:text-primary"
          >
            {currentToolData && (
              <>
                <currentToolData.icon className="h-3 w-3" />
                {currentToolData.name}
                <ChevronDownIcon className="h-3 w-3 opacity-60" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-48">
          {tools.map((tool) => (
            <DropdownMenuItem key={tool.id} asChild className="hover:!bg-primary/10 focus:!bg-primary/10 data-[highlighted]:!bg-primary/10">
              <Link
                href={tool.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 hover:!bg-primary/10 hover:!text-primary focus:!bg-primary/10 focus:!text-primary',
                  currentTool === tool.id && 'bg-primary/10 text-primary'
                )}
              >
                <tool.icon className="h-4 w-4" />
                <div className="flex-1">
                  <div className="font-medium">{tool.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {tool.description}
                  </div>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}