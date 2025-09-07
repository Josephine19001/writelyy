import { Footer } from '@saas/shared/components/Footer';
import { UserMenu } from '@saas/shared/components/UserMenu';
import { Logo } from '@shared/components/Logo';
import { Sparkles, ShieldCheckIcon } from 'lucide-react';
import Link from 'next/link';
import type { PropsWithChildren } from 'react';

export default function UserLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="block">
              <Logo />
            </Link>

            <div className="flex items-center gap-6">
              <Link
                href="/app"
                className="group text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all"
              >
                <div className="flex items-center gap-2 relative">
                  <Sparkles className="h-4 w-4" />
                  Humanizer
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 ease-in-out group-hover:w-full -mb-2" />
                </div>
              </Link>
              <Link
                href="/app/detector"
                className="group text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all"
              >
                <div className="flex items-center gap-2 relative">
                  <ShieldCheckIcon className="h-4 w-4" />
                  Detector
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 ease-in-out group-hover:w-full -mb-2" />
                </div>
              </Link>
              <UserMenu showUserName={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-8">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
