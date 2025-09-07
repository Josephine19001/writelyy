import { Button } from '@react-email/components';
import React, { type PropsWithChildren } from 'react';

export default function PrimaryButton({
  href,
  children
}: PropsWithChildren<{
  href: string;
}>) {
  return (
    <div className="text-center my-8">
      <Button
        href={href}
        className="inline-block bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 text-lg"
      >
        {children}
      </Button>
    </div>
  );
}
