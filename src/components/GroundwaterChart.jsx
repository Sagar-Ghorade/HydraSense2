import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

/**
 * Groundwater level chart.
 *
 * Plots observed readings and, when supplied, model predictions as two
 * clearly separated series (SRS 2.3 / 9.6). The y-axis is reversed because
 * depth below ground increases downwards.
 *
 * @param {object[]} observed  [{ date: 'YYYY-MM-DD', value: number }]
 * @param {object[]} predicted [{ date: 'YYYY-MM-DD', value: number }]
 * @param {string} label       observed series label
 * @param {string} predictedLabel predicted series label
 */
export default function GroundwaterChart({
  observed = [],
  predicted = [],
  label = 'Observed Level',
  predictedLabel = 'Predicted Level',
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const dates = []
    const seen = new Set()
    const pushDate = (date) => {
      if (!seen.has(date)) {
        seen.add(date)
        dates.push(date)
      }
    }
    observed.forEach((point) => pushDate(point.date))
    predicted.forEach((point) => pushDate(point.date))

    const observedByDate = new Map(observed.map((p) => [p.date, p.value]))
    const predictedByDate = new Map(predicted.map((p) => [p.date, p.value]))

    const values = [...observed, ...predicted]
      .map((p) => Number(p.value))
      .filter((value) => Number.isFinite(value))

    // Pad the axis so lines never touch the card edges.
    const rawMin = values.length ? Math.min(...values) : 0
    const rawMax = values.length ? Math.max(...values) : 10
    const pad = Math.max((rawMax - rawMin) * 0.15, 0.25)
    const suggestedMin = Math.max(0, Math.floor((rawMin - pad) * 10) / 10)
    const suggestedMax = Math.ceil((rawMax + pad) * 10) / 10

    const gradient = ctx.createLinearGradient(0, 0, 0, 320)
    gradient.addColorStop(0, 'rgba(29, 114, 254, 0.18)')
    gradient.addColorStop(1, 'rgba(29, 114, 254, 0.01)')

    const shortDate = (value) => {
      const parsed = new Date(`${value}T00:00:00Z`)
      if (Number.isNaN(parsed.getTime())) return value
      return parsed.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        timeZone: 'UTC',
      })
    }

    const datasets = [
      {
        label,
        data: dates.map((date) => observedByDate.get(date) ?? null),
        borderColor: '#1d72fe',
        borderWidth: 2.2,
        backgroundColor: gradient,
        fill: true,
        spanGaps: false,
        tension: 0.3,
        pointBackgroundColor: '#1d72fe',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 1.5,
        pointRadius: 2.5,
        pointHoverRadius: 5,
      },
    ]

    if (predicted.length) {
      datasets.push({
        label: predictedLabel,
        data: dates.map((date) => predictedByDate.get(date) ?? null),
        borderColor: '#059669',
        borderWidth: 2.4,
        borderDash: [6, 4],
        backgroundColor: 'transparent',
        fill: false,
        spanGaps: false,
        tension: 0.3,
        pointBackgroundColor: '#059669',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 1.5,
        pointRadius: 2.5,
        pointHoverRadius: 5,
      })
    }

    const chart = new Chart(ctx, {
      type: 'line',
      data: { labels: dates, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: predicted.length > 0,
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              usePointStyle: true,
              pointStyle: 'circle',
              color: '#475569',
              font: { size: 11, family: 'Inter' },
            },
          },
          tooltip: {
            callbacks: {
              title: (items) => shortDate(items[0].label),
              label: (context) => {
                const value = context.parsed.y
                if (value === null || value === undefined) return ''
                return `${context.dataset.label}: ${Number(value).toFixed(2)} m`
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#64748B',
              maxTicksLimit: 9,
              maxRotation: 0,
              autoSkip: true,
              font: { size: 11, family: 'Inter' },
              callback(value) {
                return shortDate(this.getLabelForValue(value))
              },
            },
          },
          y: {
            reverse: true,
            suggestedMin,
            suggestedMax,
            ticks: {
              color: '#64748B',
              font: { size: 11, family: 'Inter' },
              callback: (value) => `${Number(value).toFixed(1)} m`,
            },
            grid: { color: 'rgba(226, 232, 240, 0.7)', drawBorder: false },
            title: {
              display: true,
              text: 'Water Level (m BGL)',
              color: '#64748B',
              font: { size: 11.5, weight: 'normal', family: 'Inter' },
            },
          },
        },
      },
    })

    return () => chart.destroy()
  }, [observed, predicted, label, predictedLabel])

  if (!observed.length && !predicted.length) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-500">
        No data available for this selection.
      </div>
    )
  }

  const firstDate = observed[0]?.date || predicted[0]?.date || ''
  const lastDate = predicted.at(-1)?.date || observed.at(-1)?.date || ''
  const summary = [
    `Groundwater level chart${firstDate ? ` from ${firstDate}` : ''}`,
    lastDate ? `to ${lastDate}` : '',
    observed.length ? `with ${observed.length} observed readings` : '',
    predicted.length ? `and ${predicted.length} model predictions` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`${summary}. Values in metres; the depth axis is inverted.`}
    />
  )
}
