'use client';

import {
  ChevronRightIcon,
  HomeIcon,
  FileTextIcon,
  ArchiveIcon
} from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  organizationSlug?: string;
}

const iconMap = {
  home: HomeIcon,
  fileText: FileTextIcon,
  archive: ArchiveIcon
} as const;

export function Breadcrumb({ items, organizationSlug }: BreadcrumbProps) {
  const allItems = organizationSlug ? [...items] : items;

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      {allItems.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <ChevronRightIcon className="h-4 w-4 text-muted-foreground/50" />
          )}
          <div className="flex items-center">
            {item.icon &&
              (() => {
                const IconComponent =
                  iconMap[item.icon as keyof typeof iconMap];
                return IconComponent ? (
                  <IconComponent className="h-4 w-4 mr-1.5 text-muted-foreground/70" />
                ) : null;
              })()}
            {item.href && index < allItems.length - 1 ? (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  index === allItems.length - 1
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground'
                }
              >
                {item.label}
              </span>
            )}
          </div>
        </Fragment>
      ))}
    </nav>
  );
}
