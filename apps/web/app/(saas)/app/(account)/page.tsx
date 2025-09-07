import { getSession } from '@saas/auth/lib/server';
import { redirect } from 'next/navigation';

export default async function AppStartPage() {
  const session = await getSession();

  if (!session) {
    return redirect('/auth/login');
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back!
        </h1>
        <p className="text-muted-foreground">
          Transform your AI text into natural human writing
        </p>
      </div>

      {/* Account Dashboard Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Dashboard cards or content can go here */}
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Quick Start</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Start humanizing your AI-generated text instantly
          </p>
        </div>
      </div>
    </div>
  );
}
