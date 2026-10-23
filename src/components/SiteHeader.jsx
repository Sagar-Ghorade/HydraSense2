import { Link, NavLink } from 'react-router-dom'

/**
 * The single application header.
 *
 * Every page renders this component so the brand, navigation order, active
 * state, height and location control are identical across the five screens.
 */
const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/historical-data', label: 'Historical Data' },
  { to: '/predictions', label: 'Predictions' },
  { to: '/about', label: 'About' },
]

function BrandMark() {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7 text-brand-600"
      fill="none"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 2.5C16 2.5 6 14.5 6 21C6 26.5228 10.4772 31 16 31C21.5228 31 26 26.5228 26 21C26 14.5 16 2.5 16 2.5Z"
        fill="currentColor"
      />
      <path
        d="M16 7C16 7 10 16 10 21C10 24.3137 12.6863 27 16 27C19.3137 27 22 24.3137 22 21C22 16 16 7 16 7Z"
        fill="#FFFFFF"
        fillOpacity="0.3"
      />
    </svg>
  )
}

function MapPinIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

export default function SiteHeader({ locationLabel = 'Select location' }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link className="flex shrink-0 items-center gap-2.5" to="/" aria-label="HydraSense home">
          <BrandMark />
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Hydra<span className="text-brand-600">Sense</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden h-16 items-center md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              className={({ isActive }) =>
                [
                  'relative flex h-16 items-center px-4 text-[15px] transition-colors',
                  isActive
                    ? 'font-semibold text-brand-600'
                    : 'font-medium text-slate-600 hover:text-brand-600',
                ].join(' ')
              }
              end={item.end}
              key={item.to}
              to={item.to}
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive ? (
                    <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-brand-600" />
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <Link
          aria-label="Change location on the dashboard"
          className="flex min-w-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
          to="/dashboard"
        >
          <MapPinIcon className="h-4 w-4 shrink-0 text-slate-600" />
          <span className="max-w-[9rem] truncate sm:max-w-[12rem]">{locationLabel}</span>
        </Link>
      </div>
    </header>
  )
}
