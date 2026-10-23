import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import GroundwaterChart from '../components/GroundwaterChart'
import SiteLayout from '../components/SiteLayout'
import StationMap from '../components/StationMap'
import {
  checkHealth,
  formatDate,
  formatLevel,
  getHistoricalReadings,
  listLocations,
  listStations,
  makePrediction,
} from '../api'

const OBSERVED_WINDOW_DAYS = 90
const FORECAST_DAYS = 30

function StatTrend({ change }) {
  if (change === null || change === undefined) return null
  const deeper = change > 0.005
  const shallower = change < -0.005
  const tone = deeper
    ? 'text-red-600'
    : shallower
      ? 'text-emerald-600'
      : 'text-slate-500'
  const arrow = deeper
    ? 'M19 14l-7 7m0 0l-7-7m7 7V3'
    : 'M5 10l7-7m0 0l7 7m-7-7v18'
  return (
    <span className={`inline-flex items-center text-xs font-semibold ${tone}`}>
      <svg className="w-3.5 h-3.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d={arrow} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
      </svg>
      {Math.abs(change).toFixed(2)} m
    </span>
  )
}

/** Rule used for the trend indicator (no unsupported risk thresholds). */
function trendForChange(change) {
  if (change === null || change === undefined) {
    return { label: 'Unavailable', tone: 'bg-slate-100 text-slate-700', note: 'Not enough observations' }
  }
  if (change >= 0.15) {
    return {
      label: 'Deepening',
      tone: 'bg-red-100 text-red-800',
      note: `Level fell ${change.toFixed(2)} m over the last 30 observations`,
    }
  }
  if (change <= -0.15) {
    return {
      label: 'Recovering',
      tone: 'bg-emerald-100 text-emerald-800',
      note: `Level rose ${Math.abs(change).toFixed(2)} m over the last 30 observations`,
    }
  }
  return {
    label: 'Stable',
    tone: 'bg-emerald-100 text-emerald-800',
    note: 'Change under 0.15 m over the last 30 observations',
  }
}

export default function Dashboard() {
  const [locations, setLocations] = useState([])
  const [catalog, setCatalog] = useState([])
  const [health, setHealth] = useState(null)
  const [state, setState] = useState('')
  const [district, setDistrict] = useState('')
  const [stationId, setStationId] = useState('')
  const [readings, setReadings] = useState([])
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load filters + health once.
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [tree, status, stationList] = await Promise.all([
          listLocations(),
          checkHealth(),
          listStations(),
        ])
        if (cancelled) return
        setLocations(tree)
        setHealth(status)
        setCatalog(stationList || [])
        const firstState = tree[0]
        const firstDistrict = firstState?.districts?.[0]
        setState(firstState?.state || '')
        setDistrict(firstDistrict?.district || '')
        setStationId(firstDistrict?.stations?.[0]?.id || '')
      } catch (err) {
        if (!cancelled) setError(err.message)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Load readings + forecast whenever the station changes.
  useEffect(() => {
    if (!stationId) return undefined
    let cancelled = false
    async function loadStation() {
      setLoading(true)
      setError('')
      try {
        const [history, prediction] = await Promise.all([
          getHistoricalReadings({ stationId, limit: OBSERVED_WINDOW_DAYS }),
          makePrediction(stationId, FORECAST_DAYS).catch((err) => ({ error: err.message })),
        ])
        if (cancelled) return
        setReadings(history.readings)
        setForecast(prediction)
        if (prediction.error) setError(`Forecast unavailable: ${prediction.error}`)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadStation()
    return () => {
      cancelled = true
    }
  }, [stationId])

  const states = locations.map((node) => node.state)
  const districts = useMemo(
    () => locations.find((node) => node.state === state)?.districts || [],
    [locations, state],
  )
  const stations = useMemo(
    () => districts.find((node) => node.district === district)?.stations || [],
    [districts, district],
  )
  const station = useMemo(
    () => stations.find((node) => node.id === stationId) || null,
    [stations, stationId],
  )
  // Coordinates must follow the selected station, not the first catalogue entry.
  const stationMeta = useMemo(
    () => catalog.find((entry) => entry.id === stationId) || null,
    [catalog, stationId],
  )

  const latest = readings[readings.length - 1]
  const monthChange = useMemo(() => {
    if (readings.length < 2) return null
    const base = readings[Math.max(0, readings.length - 30)]
    if (base?.water_level_m == null || latest?.water_level_m == null) return null
    return Number((latest.water_level_m - base.water_level_m).toFixed(3))
  }, [readings, latest])

  const rainfall30 = useMemo(() => {
    const last = readings.slice(-30)
    if (!last.length || last.some((r) => r.rainfall_mm === null)) return null
    return last.reduce((sum, r) => sum + r.rainfall_mm, 0)
  }, [readings])

  const trend = trendForChange(monthChange)
  const predicted = forecast && !forecast.error ? forecast : null

  const observedSeries = readings
    .filter((r) => r.water_level_m !== null)
    .map((r) => ({ date: r.date, value: r.water_level_m }))
  const predictedSeries = (predicted?.predictions || []).map((p) => ({
    date: p.date,
    value: p.predicted_level_m,
  }))

  const locationLabel = [state, district].filter(Boolean).join(', ')

  return (
    <SiteLayout locationLabel={locationLabel || 'Select location'}>
      <div className="space-y-6">
        {/* Title + filters */}
        <section className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <p className="mt-1.5 text-sm text-slate-500">Overview of groundwater level and key insights.</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-3">
              <label className="mb-1.5 ml-1 block text-xs font-semibold uppercase tracking-wide text-slate-600" htmlFor="dashboard-state">State</label>
              <select
                id="dashboard-state"
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
                {states.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="mb-1.5 ml-1 block text-xs font-semibold uppercase tracking-wide text-slate-600" htmlFor="dashboard-district">District</label>
              <select
                id="dashboard-district"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                value={district}
                onChange={(event) => {
                  const next = districts.find((node) => node.district === event.target.value)
                  setDistrict(event.target.value)
                  setStationId(next?.stations?.[0]?.id || '')
                }}
              >
                {districts.map((node) => (
                  <option key={node.district} value={node.district}>{node.district}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-4">
              <label className="mb-1.5 ml-1 block text-xs font-semibold uppercase tracking-wide text-slate-600" htmlFor="dashboard-station">Station</label>
              <select
                id="dashboard-station"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                value={stationId}
                onChange={(event) => setStationId(event.target.value)}
              >
                {stations.map((node) => (
                  <option key={node.id} value={node.id}>{node.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <Link
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-brand-700"
                to="/historical-data"
              >
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm font-semibold">All data</span>
              </Link>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        {/* Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <article className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 21.5c4.142 0 7.5-3.358 7.5-7.5 0-5-7.5-12-7.5-12S4.5 9 4.5 14c0 4.142 3.358 7.5 7.5 7.5z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Current Level</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  {latest ? formatLevel(latest.water_level_m) : '—'}
                </span>
                <StatTrend change={monthChange} />
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Below Ground Level (BGL)</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Last observation: {latest ? formatDate(latest.date) : '—'}
              </p>
            </div>
          </article>

          <article className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Predicted Level <span className="text-slate-400 capitalize font-normal">(+{FORECAST_DAYS} days)</span>
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  {predicted ? formatLevel(predicted.predictions.at(-1)?.predicted_level_m) : '—'}
                </span>
                <StatTrend change={predicted?.change_m ?? null} />
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Model estimate, not a measurement</p>
              {predicted && (
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Forecast issued {formatDate(predicted.last_observed.date)}
                </p>
              )}
            </div>
          </article>

          <article className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 text-amber-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Observed Trend</p>
              <div className="mt-1">
                <span className={`inline-block font-bold px-3 py-1 rounded-lg text-base ${trend.tone}`}>{trend.label}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-2">{trend.note}</p>
            </div>
          </article>

          <article className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 text-blue-500">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 19v2m3-2v3m3-3v2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Recent Rainfall</p>
              <div className="mt-1">
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  {rainfall30 === null ? 'Unavailable' : `${rainfall30.toFixed(0)} mm`}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-1">Last 30 observations in the dataset</p>
            </div>
          </article>
        </section>

        {/* Chart + station card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex flex-wrap items-center justify-between pb-6 gap-3">
              <h2 className="text-lg font-bold text-slate-900">Groundwater Level Trend</h2>
              <span className="text-xs font-medium text-slate-500">
                Observed: last {OBSERVED_WINDOW_DAYS} days · Predicted: next {FORECAST_DAYS} days
              </span>
            </div>
            <div className="relative w-full h-[360px]">
              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">Loading readings…</div>
              ) : (
                <GroundwaterChart observed={observedSeries} predicted={predictedSeries} />
              )}
            </div>
          </section>

          <section className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-100" data-purpose="station-details">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <h2 className="text-lg font-bold text-slate-900">Station Details</h2>
            </div>

            <StationMap
              name={station?.name || stationMeta?.name || 'Monitoring station'}
              latitude={stationMeta?.latitude}
              longitude={stationMeta?.longitude}
              loading={!stationMeta && !error}
              className="h-[200px] w-full"
            />

            <div className="mt-3">
              <p className="text-sm font-semibold text-slate-900">{station?.name || '—'}</p>
              <p className="text-[11px] text-slate-600">
                {/* The /locations tree only carries id/name, so the district and
                    state come from the station catalogue. */}
                {[stationMeta?.district || district, stationMeta?.state || state]
                  .filter(Boolean)
                  .join(', ') || 'Location not published'}
                {stationMeta?.illustrative ? ' · illustrative location' : ''}
              </p>
            </div>

            <dl className="mt-5 space-y-2.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Latitude</dt>
                <dd className="font-medium text-slate-800">{stationMeta?.latitude ?? '—'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Longitude</dt>
                <dd className="font-medium text-slate-800">{stationMeta?.longitude ?? '—'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Dataset coverage</dt>
                <dd className="font-medium text-slate-800">
                  {health?.dataset_start ? `${health.dataset_start} → ${health.dataset_end}` : '—'}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Observations</dt>
                <dd className="font-medium text-slate-800">{health?.dataset_rows ?? '—'}</dd>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <dt className="text-xs text-slate-500">{health?.detail || station?.note || 'Station metadata comes from the API.'}</dt>
              </div>
            </dl>
          </section>
        </div>

        <p className="px-1 text-xs text-slate-500">
          Unit is reported as metres from the dataset column name; the depth datum is not documented in the source file
          {health?.unit_confirmed === false ? ' and is therefore unconfirmed' : ''}. Predictions are model estimates.
        </p>
      </div>
    </SiteLayout>
  )
}
