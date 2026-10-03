import { NavLink, Outlet } from 'react-router-dom';

const NAV = [
  { to: '/', label: 'Home', icon: '🏠', end: true },
  { to: '/review', label: 'Review', icon: '🔁', end: false },
  { to: '/practice', label: 'Practice', icon: '🎯', end: false },
  { to: '/saved', label: 'Saved', icon: '★', end: false },
];

export function AppShell() {
  return (
    <div className="min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2 text-lg font-bold text-indigo-700">
            <img src="/favicon.svg" alt="" className="size-8" />
            Numora
          </NavLink>
          <nav aria-label="Main">
            <ul className="flex gap-1">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`
                    }
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                    <span className="sr-only sm:hidden">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
}

export function PageHeader({ title, subtitle, back }: { title: string; subtitle?: React.ReactNode; back?: { href: string; label: string } }) {
  return (
    <div className="mb-6">
      {back && (
        <NavLink to={back.href} className="mb-2 inline-block text-sm text-slate-500 hover:text-slate-800">
          <span aria-hidden="true">← </span>
          {back.label}
        </NavLink>
      )}
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {subtitle && <div className="mt-1 text-lg text-slate-600">{subtitle}</div>}
    </div>
  );
}
