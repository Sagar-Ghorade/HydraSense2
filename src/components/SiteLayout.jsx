import SiteHeader from './SiteHeader'

/**
 * Shared page shell.
 *
 * Gives every screen the same background, header, content width and vertical
 * rhythm; pages only supply their own sections.
 *
 * @param {object} props
 * @param {string} [props.locationLabel] text shown in the header location control
 * @param {React.ReactNode} props.children page content
 */
export default function SiteLayout({ children, locationLabel }) {
  return (
    <div className="min-h-screen bg-[#f1f6fc] font-sans text-slate-800 antialiased">
      <SiteHeader locationLabel={locationLabel} />
      <main className="mx-auto w-full max-w-[1280px] px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        {children}
      </main>
    </div>
  )
}
