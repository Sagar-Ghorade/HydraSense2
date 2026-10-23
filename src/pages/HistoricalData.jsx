import { useEffect, useMemo, useState } from 'react'
import GroundwaterChart from '../components/GroundwaterChart'
import SiteLayout from '../components/SiteLayout'
import {
  formatDate,
  formatLevel,
  getHistoricalReadings,
  listLocations,
} from '../api'

const RANGES = [
  { value: '30', label: 'Last 30 days', limit: 30 },
  { value: '90', label: 'Last 90 days', limit: 90 },
  { value: '365', label: 'Last 1 year', limit: 365 },
  { value: 'all', label: 'All records', limit: 3650 },
]

const TABLE_ROWS = 30

export default function HistoricalData() {
  const [locations, setLocations] = useState([])
  const [state, setState] = useState('')
  const [district, setDistrict] = useState('')
  const [stationId, setStationId] = useState('')
  const [range, setRange] = useState('365')
  const [reloadKey, setReloadKey] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function loadFilters() {
      try {
        const tree = await listLocations()
        if (cancelled) return
        setLocations(tree)
        const firstState = tree[0]
        const firstDistrict = firstState?.districts?.[0]
        setState(firstState?.state || '')
        setDistrict(firstDistrict?.district || '')
        setStationId(firstDistrict?.stations?.[0]?.id || '')
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      }
    }
    loadFilters()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!stationId) return undefined
    let cancelled = false
    async function loadReadings() {
      setLoading(true)
      setError('')
      try {
        const limit = RANGES.find((item) => item.value === range)?.limit ?? 365
        const response = await getHistoricalReadings({ stationId, limit })
        if (!cancelled) setData(response)
      } catch (err) {
        if (!cancelled) {
          setData(null)
          setError(err.message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadReadings()
    return () => {
      cancelled = true
    }
  }, [stationId, range, reloadKey])

  const states = locations.map((node) => node.state)
  const districts = useMemo(
    () => locations.find((node) => node.state === state)?.districts || [],
    [locations, state],
  )
  const stations = useMemo(
    () => districts.find((node) => node.district === district)?.stations || [],
    [districts, district],
  )

  const readings = data?.readings || []
  const observedSeries = readings
    .filter((reading) => reading.water_level_m !== null)
    .map((reading) => ({ date: reading.date, value: reading.water_level_m }))
  const tableRows = readings.slice(-TABLE_ROWS).reverse()
  const hasRainfall = readings.some((reading) => reading.rainfall_mm !== null)

  const locationLabel = [state, district].filter(Boolean).join(', ')

  return (
    <SiteLayout locationLabel={locationLabel || 'Select location'}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Historical Data</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          View past groundwater level records for the selected station.
        </p>
      </div>

        {/* Filters */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600" htmlFor="history-state">State</label>
                <select
                  id="history-state"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                  value={state}
                  onChange={(event) => {
                    const next = locations.find((node) => node.state === event.target.value)
                    const nextDistrict = next?.districts?.[0]
                    setState(event.target.value)
                    setDistrict(nextDistrict?.district || '')
                    setStationId(nextDistrict?.stations?.[0]?.id || '')
                  }}
                >
                  {states.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600" htmlFor="history-district">District</label>
                <select
                  id="history-district"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                  value={district}
                  onChange={(event) => {
                    const next = districts.find((node) => node.district === event.target.value)
                    setDistrict(event.target.value)
                    setStationId(next?.stations?.[0]?.id || '')
                  }}
                >
                  {districts.map((node) => <option key={node.district} value={node.district}>{node.district}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600" htmlFor="history-station">Station</label>
                <select
                  id="history-station"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                  value={stationId}
                  onChange={(event) => setStationId(event.target.value)}
                >
                  {stations.map((node) => <option key={node.id} value={node.id}>{node.name}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
                type="button"
                onClick={() => setReloadKey((key) => key + 1)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                </svg>
                <span>Search</span>
              </button>
              <div>
                <label className="sr-only" htmlFor="history-range">Date range</label>
                <select
                  id="history-range"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                  value={range}
                  onChange={(event) => setRange(event.target.value)}
                >
                  {RANGES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        {/* Chart */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3">
            <h2 className="text-lg font-bold text-slate-900">Historical Groundwater Levels</h2>
            <div className="text-xs font-semibold text-slate-600 bg-slate-50/70 border border-slate-100 rounded-md px-2.5 py-1">
              {loading ? 'Loading…' : `${data?.count ?? 0} observations · ${data?.unit ?? 'm'} (${data?.unit_confirmed ? 'confirmed' : 'datum unconfirmed'})`}
            </div>
          </div>
          <div className="relative w-full h-[320px] pt-2">
            {loading ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">Loading readings…</div>
            ) : (
              <GroundwaterChart observed={observedSeries} />
            )}
          </div>
        </section>

        {/* Table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="px-5 py-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">Data Records</h2>
            {tableRows.length > 0 && (
              <span className="text-xs font-medium text-slate-500">
                Showing the latest {tableRows.length} of {data?.count ?? 0} records
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-50/70 border-y border-blue-100/80">
                  <th className="py-3 px-6 text-xs font-bold text-slate-800 w-1/3" scope="col">Date</th>
                  <th className="py-3 px-6 text-xs font-bold text-slate-800 w-1/3" scope="col">Water Level (m)</th>
                  {hasRainfall && <th className="py-3 px-6 text-xs font-bold text-slate-800 w-1/3" scope="col">Rainfall (mm)</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {tableRows.map((reading) => (
                  <tr key={reading.date} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-6">{formatDate(reading.date)}</td>
                    <td className="py-3 px-6">
                      {reading.water_level_m !== null ? formatLevel(reading.water_level_m) : 'Missing'}
                    </td>
                    {hasRainfall && (
                      <td className="py-3 px-6">
                        {reading.rainfall_mm !== null ? `${reading.rainfall_mm.toFixed(1)} mm` : 'Unavailable'}
                      </td>
                    )}
                  </tr>
                ))}
                {!loading && tableRows.length === 0 && (
                  <tr>
                    <td className="py-8 px-6 text-center text-slate-500" colSpan={hasRainfall ? 3 : 2}>
                      No records returned for this selection.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
    </SiteLayout>
  )
}
