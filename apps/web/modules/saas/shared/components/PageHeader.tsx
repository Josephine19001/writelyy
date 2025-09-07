'use client';

export function PageHeader({
  title,
  subtitle,
  actions
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <h2 className="font-bold text-2xl lg:text-3xl">{title}</h2>
        <p className="mt-1 opacity-60">{subtitle}</p>
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
