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
  PlusIcon
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface ToolSelectorProps {
  currentTool: 'humanizer' | 'detector';
  className?: string;
}

export function ToolSelector({ currentTool, className }: ToolSelectorProps) {
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
    }
  ];

  const currentToolData = tools.find(tool => tool.id === currentTool);
  const otherTools = tools.filter(tool => tool.id !== currentTool);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* New Button */}
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

      {/* Tool Selector Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 h-8 px-2 text-xs font-medium hover:bg-muted/50"
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
            <DropdownMenuItem key={tool.id} asChild>
              <Link
                href={tool.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2',
                  currentTool === tool.id && 'bg-muted'
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