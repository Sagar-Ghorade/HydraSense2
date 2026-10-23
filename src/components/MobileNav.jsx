import { NavLink } from 'react-router-dom'

/**
 * Bottom navigation for small screens.
 *
 * Every reference screen hides its horizontal nav below the `md` breakpoint
 * (`hidden md:flex`), which left phones and small tablets without any way to
 * move between pages. This bar is the single navigation control for those
 * widths; the pages keep their own desktop headers unchanged.
 */
const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/historical-data', label: 'History' },
  { to: '/predictions', label: 'Predict' },
  { to: '/about', label: 'About' },
]

export default function MobileNav() {
  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
    >
      <ul className="mx-auto flex max-w-lg items-stretch pb-[env(safe-area-inset-bottom)]">
        {LINKS.map((link) => (
          <li key={link.to} className="flex-1">
            <NavLink
              className={({ isActive }) =>
                [
                  'flex h-12 items-center justify-center rounded-lg text-[12.5px] font-semibold transition-colors',
                  isActive ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800',
                ].join(' ')
              }
              end={link.end}
              to={link.to}
            >
              <span className="py-3">{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
