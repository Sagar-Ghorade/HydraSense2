import { useEffect, useMemo, useState } from 'react'
import GroundwaterChart from '../components/GroundwaterChart'
import SiteLayout from '../components/SiteLayout'
import {
  formatDate,
  formatLevel,
  getHistoricalReadings,
  listLocations,
  makePrediction,
} from '../api'

const HORIZONS = [
  { value: 7, label: 'Next 7 days' },
  { value: 14, label: 'Next 14 days' },
  { value: 30, label: 'Next 30 days' },
]

const methodLabel = (kind) =>
  kind === 'persistence' ? 'Persistence baseline' : 'Learned model (Δ from origin)'

export default function Predictions() {
  const [locations, setLocations] = useState([])
  const [state, setState] = useState('')
  const [district, setDistrict] = useState('')
  const [stationId, setStationId] = useState('')
  const [horizon, setHorizon] = useState(30)
  const [reloadKey, setReloadKey] = useState(0)
  const [forecast, setForecast] = useState(null)
  const [observed, setObserved] = useState([])
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
    async function loadForecast() {
      setLoading(true)
      setError('')
      try {
        const [prediction, history] = await Promise.all([
          makePrediction(stationId, horizon),
          getHistoricalReadings({ stationId, limit: 30 }),
        ])
        if (cancelled) return
        setForecast(prediction)
        setObserved(history.readings)
      } catch (err) {
        if (!cancelled) {
          setForecast(null)
          setError(err.message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadForecast()
    return () => {
      cancelled = true
    }
  }, [stationId, horizon, reloadKey])

  const states = locations.map((node) => node.state)
  const districts = useMemo(
    () => locations.find((node) => node.state === state)?.districts || [],
    [locations, state],
  )
  const stations = useMemo(
    () => districts.find((node) => node.district === district)?.stations || [],
    [districts, district],
  )

  const observedSeries = observed
    .filter((reading) => reading.water_level_m !== null)
    .map((reading) => ({ date: reading.date, value: reading.water_level_m }))
  const predictedSeries = (forecast?.predictions || []).map((point) => ({
    date: point.date,
    value: point.predicted_level_m,
  }))

  const overall = forecast?.metrics?.overall || null
  const holdoutServed = overall?.selected_holdout_mae_mean
  const holdoutBaseline = overall?.persistence_holdout_mae_mean
  const beatsBaseline =
    holdoutServed !== undefined && holdoutBaseline !== undefined
      ? holdoutServed < holdoutBaseline
      : null

  const locationLabel = [state, district].filter(Boolean).join(', ')

  return (
    <SiteLayout locationLabel={locationLabel || 'Select location'}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Predictions</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Model-estimated groundwater levels for the selected station. Predictions are not official measurements.
        </p>
      </div>

        {/* Filters */}
        <section className="mb-8">
          <form
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end"
            onSubmit={(event) => {
              event.preventDefault()
              setReloadKey((key) => key + 1)
            }}
          >
            <div className="lg:col-span-3">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600" htmlFor="predict-state">State</label>
              <select
                id="predict-state"
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
            <div className="lg:col-span-3">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600" htmlFor="predict-district">District</label>
              <select
                id="predict-district"
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
            <div className="lg:col-span-3">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600" htmlFor="predict-station">Station</label>
              <select
                id="predict-station"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                value={stationId}
                onChange={(event) => setStationId(event.target.value)}
              >
                {stations.map((node) => <option key={node.id} value={node.id}>{node.name}</option>)}
              </select>
            </div>
            <div className="lg:col-span-3">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600" htmlFor="predict-horizon">Forecast horizon</label>
              <select
                id="predict-horizon"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                value={horizon}
                onChange={(event) => setHorizon(Number(event.target.value))}
              >
                {HORIZONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
            <div className="lg:col-span-12 flex justify-end">
              <button
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
                type="submit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                </svg>
                <span>Run forecast</span>
              </button>
            </div>
          </form>
        </section>

        {error && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">
            <p className="font-semibold">Prediction unavailable</p>
            <p className="mt-0.5">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center text-sm text-slate-500">
            Running forecast…
          </div>
        ) : forecast ? (
          <>
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    Predicted Groundwater Level (next {forecast.horizon_days} days)
                  </h2>
                  <span className="text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1">
                    Predicted
                  </span>
                </div>
                <div className="relative w-full h-[300px]">
                  <GroundwaterChart
                    observed={observedSeries}
                    predicted={predictedSeries}
                    label="Observed (last 30 days)"
                    predictedLabel="Predicted"
                  />
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Forecast issued from the last observation on {formatDate(forecast.last_observed.date)} at{' '}
                  {formatLevel(forecast.last_observed.level_m)}. Dashed line = model prediction.
                </p>
              </div>

              <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Prediction Values</h2>
                  <span className="text-[11px] font-medium text-slate-500">{forecast.predictions.length} days</span>
                </div>
                <div className="w-full flex-1 overflow-y-auto max-h-[320px]">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-slate-50">
                      <tr>
                        <th className="py-2.5 px-3 text-xs font-bold text-slate-800" scope="col">Date</th>
                        <th className="py-2.5 px-3 text-xs font-bold text-slate-800" scope="col">Predicted Level (m)</th>
                        <th className="py-2.5 px-3 text-xs font-bold text-slate-800" scope="col">Method</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {forecast.predictions.map((point) => (
                        <tr key={point.date}>
                          <td className="py-2.5 px-3 text-slate-700 font-medium">{formatDate(point.date)}</td>
                          <td className="py-2.5 px-3 text-slate-800 font-semibold">{formatLevel(point.predicted_level_m)}</td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-500">{methodLabel(point.model_kind)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="mt-6">
              <div className="bg-[#eaf8f1] rounded-2xl p-5 md:p-6 flex items-start gap-4 border border-emerald-100/60">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#d2f3e2] flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                  </svg>
                </div>
                <div className="flex-1 pt-0.5">
                  <h3 className="text-lg font-bold text-slate-900">Trend Insight</h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{forecast.insight}</p>
                </div>
              </div>
            </section>

            <section className="mt-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-1">Model Information</h2>
              <p className="text-xs text-slate-500 mb-4">
                Metrics are read from the saved evaluation artifact, not recomputed for this page.
              </p>
              <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="rounded-xl bg-slate-50 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Forecast method</dt>
                  <dd className="mt-1 font-semibold text-slate-900 capitalize">{forecast.model_kind.replace(/_/g, ' ')}</dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Horizon</dt>
                  <dd className="mt-1 font-semibold text-slate-900">{forecast.horizon_days} days (max {forecast.horizon_available})</dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Held-out MAE (served)</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {holdoutServed !== undefined ? `${Number(holdoutServed).toFixed(3)} m` : 'Not recorded'}
                  </dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Held-out MAE (persistence)</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {holdoutBaseline !== undefined ? `${Number(holdoutBaseline).toFixed(3)} m` : 'Not recorded'}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-xs text-slate-500">
                {forecast.unit_note || 'The depth datum is not documented in the source file.'}
              </p>
              {beatsBaseline === false && (
                <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  On the held-out window the served models did not beat the persistence baseline overall.
                  Treat these forecasts as exploratory, not as validated accuracy.
                </p>
              )}
            </section>
          </>
        ) : null}
    </SiteLayout>
  )
}
