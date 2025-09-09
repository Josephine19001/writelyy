'use client';

import { AppSidebarLayout } from '@shared/components/AppSidebarLayout';
import type { PropsWithChildren } from 'react';

export function SettingsLayoutWrapper({ children }: PropsWithChildren) {
  return (
    <AppSidebarLayout
      historyEntries={[]} // Settings don't have history entries
      currentPage="humanizer" // Default, not used in settings
      onNewAction={() => {}} // No-op for settings
    >
      <div className="h-full overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </AppSidebarLayout>
  );
}
