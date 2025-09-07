import {
  Container,
  Font,
  Head,
  Html,
  Section,
  Tailwind
} from '@react-email/components';
import React, { type PropsWithChildren } from 'react';
import { Logo } from './Logo';

export default function Wrapper({ children }: PropsWithChildren) {
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                border: '#e3ebf6',
                background: '#fafafe',
                foreground: '#292b35',
                primary: {
                  DEFAULT: '#E129BC',
                  foreground: '#ffffff'
                },
                secondary: {
                  DEFAULT: '#8b5cf6',
                  foreground: '#ffffff'
                },
                card: {
                  DEFAULT: '#ffffff',
                  foreground: '#292b35'
                },
                accent: {
                  pink: '#E129BC',
                  purple: '#8b5cf6',
                  blue: '#3b82f6',
                  green: '#10b981',
                  orange: '#f59e0b'
                }
              }
            }
          }
        }}
      >
        <Section className="bg-gradient-to-br from-primary/10 to-secondary/10 min-h-screen p-4">
          <Container className="mx-auto max-w-lg">
            {/* Header with gradient */}
            <div className="rounded-t-2xl bg-gradient-to-r from-primary to-secondary p-6 text-center">
              <Logo />
            </div>

            {/* Main content */}
            <div className="rounded-b-2xl bg-card p-8 text-card-foreground shadow-xl">
              {children}
            </div>
          </Container>
        </Section>
      </Tailwind>
    </Html>
  );
}
