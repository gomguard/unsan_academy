interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  icon,
  rightElement,
}: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Icon */}
            {icon && (
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                {icon}
              </div>
            )}

            {/* Title */}
            <div>
              <h1 className="font-bold text-lg text-white">{title}</h1>
              {subtitle && (
                <p className="text-sm text-slate-400">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Right Element */}
          {rightElement && <div>{rightElement}</div>}
        </div>
      </div>
    </header>
  );
}
