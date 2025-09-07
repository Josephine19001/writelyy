'use client';

import { SettingsMenu } from './SettingsMenu';
import type { ReactNode } from 'react';

interface ClientSettingsMenuProps {
  menuItems: {
    title: string;
    avatar: ReactNode;
    items: {
      title: string;
      href: string;
      icon?: ReactNode;
    }[];
  }[];
}

export function ClientSettingsMenu({ menuItems }: ClientSettingsMenuProps) {
  return <SettingsMenu menuItems={menuItems} />;
}
