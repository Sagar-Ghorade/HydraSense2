/**
 * Google Map for a monitoring station.
 *
 * Uses the keyless Google Maps embed endpoint (`output=embed`), so no API key
 * or billing account is required. The map is centred on the station's
 * coordinates from the backend `/api/stations` catalogue; when a station has
 * no coordinates the component renders an explicit placeholder instead of a
 * fabricated location (SRS 1.5).
 *
 * @param {object} props
 * @param {string} props.name       station name, used for the iframe title
 * @param {number} props.latitude   station latitude in decimal degrees
 * @param {number} props.longitude  station longitude in decimal degrees
 * @param {number} [props.zoom]     Google Maps zoom level
 * @param {boolean} [props.loading] show a skeleton while station metadata loads
 * @param {string} [props.className] extra classes for the wrapper
 */
export default function StationMap({
  name = '',
  latitude,
  longitude,
  zoom = 12,
  loading = false,
  className = '',
}) {
  const lat = Number(latitude)
  const lng = Number(longitude)
  const hasCoordinates =
    latitude !== null &&
    latitude !== undefined &&
    longitude !== null &&
    longitude !== undefined &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 ${className}`}
        aria-busy="true"
      >
        <span className="text-xs font-medium text-slate-500">Loading map…</span>
      </div>
    )
  }

  if (!hasCoordinates) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center ${className}`}
        role="img"
        aria-label="Station map unavailable"
      >
        <svg
          className="h-7 w-7 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
        <p className="text-xs font-medium text-slate-600">Map unavailable</p>
        <p className="text-[11px] text-slate-500">
          No coordinates are published for this station.
        </p>
      </div>
    )
  }

  const query = `${lat},${lng}`
  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    query,
  )}&z=${zoom}&hl=en&output=embed`
  const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query,
  )}`

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 ${className}`}
    >
      <iframe
        title={`Google Map of ${name || 'monitoring station'}`}
        src={embedSrc}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allow="fullscreen"
      />
      <a
        className="absolute bottom-2 right-2 rounded-lg bg-white/95 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-white hover:text-blue-800"
        href={directionsHref}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Open ${name || 'station'} location in Google Maps`}
      >
        Open in Google Maps
      </a>
    </div>
  )
}
