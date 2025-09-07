'use client';

import { Button } from '@ui/components/button';
import { restartTour } from './AppTour';

interface RestartTourButtonProps {
  tourKey: string;
  variant?:
    | 'primary'
    | 'error'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'light';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  className?: string;
}

export function RestartTourButton({
  tourKey,
  variant = 'outline',
  size = 'md',
  className = ''
}: RestartTourButtonProps) {
  const handleRestartTour = () => {
    restartTour(tourKey);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRestartTour}
      className={className}
    >
      🔄 Restart Tour
    </Button>
  );
}
