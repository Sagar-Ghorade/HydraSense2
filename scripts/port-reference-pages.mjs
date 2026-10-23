/**
 * Ports the five reference screens
 * (stitch_pixel_perfect_ui_clone/<screen>/code.html) to React components.
 *
 * The conversion is mechanical and content preserving:
 *   - HTML attribute names  -> JSX attribute names (class -> className, SVG camelCase)
 *   - SVG element names     -> JSX camelCase (lineargradient -> linearGradient, ...)
 *   - <!-- comment -->      -> {/* comment *\/}
 *   - <body class="...">    -> page root <div className="... page-xxx">
 *   - in-body <script>      -> dropped (the chart is a React component)
 *   - nav anchors           -> react-router <Link to="...">
 * No text, class, structure or styling value is altered.
 *
 * Usage: node scripts/port-reference-pages.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = resolve(HERE, '..')
const REFERENCE_ROOT =
  process.env.HYDRASENSE_REFERENCE_ROOT ||
  'C:/Users/HP/OneDrive/Desktop/Hydrasence/stitch_pixel_perfect_ui_clone'

const PAGES = [
  { screen: 'hydrasense_home', component: 'Home', rootClass: 'page-home' },
  { screen: 'hydrasense_dashboard', component: 'Dashboard', rootClass: 'page-dashboard' },
  { screen: 'hydrasense_historical_data', component: 'HistoricalData', rootClass: 'page-historical' },
  { screen: 'hydrasense_predictions', component: 'Predictions', rootClass: 'page-predictions' },
  { screen: 'hydrasense_about', component: 'About', rootClass: 'page-about' },
]

/** Attribute names that must change for JSX / React. */
const ATTRIBUTE_RENAMES = {
  class: 'className',
  crossorigin: 'crossOrigin',
  viewbox: 'viewBox',
  preserveaspectratio: 'preserveAspectRatio',
  'fill-opacity': 'fillOpacity',
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  'flood-color': 'floodColor',
  'flood-opacity': 'floodOpacity',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-opacity': 'strokeOpacity',
  'stroke-width': 'strokeWidth',
  'text-anchor': 'textAnchor',
  stddeviation: 'stdDeviation',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
}

/** SVG element names are case sensitive, so they must be camelCased. */
const ELEMENT_RENAMES = {
  lineargradient: 'linearGradient',
  radialgradient: 'radialGradient',
  fedropshadow: 'feDropShadow',
}

/**
 * Navigation targets. Every screen spells its own nav links differently
 * (`#dashboard`, `#`, `#home`, ...), so links are matched on their visible
 * label instead of on the href they carry.
 */
const ROUTES_BY_LABEL = {
  Home: '/',
  HydraSense: '/',
  Dashboard: '/dashboard',
  'Historical Data': '/historical-data',
  Predictions: '/predictions',
  About: '/about',
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const labelOf = (html) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()

function toJsx(html) {
  let out = html

  // In-body scripts are handled by React components.
  out = out.replace(/<script[\s\S]*?<\/script>/g, '')

  // HTML comments become JSX comments.
  out = out.replace(/<!--([\s\S]*?)-->/g, (_match, body) => `{/*${body}*/}`)

  // Attribute renames.
  for (const [from, to] of Object.entries(ATTRIBUTE_RENAMES)) {
    out = out.replace(new RegExp(`(\\s)${escapeRegExp(from)}=`, 'g'), `$1${to}=`)
  }

  // `<option selected="">` -> `<option>`: React does not support the attribute
  // and browsers already preselect the first option, so rendering is unchanged.
  // The value is required in the match so that the word "selected" in element
  // text ("records for the selected station") is never touched.
  out = out.replace(/(<[^>]*?)\sselected=""/g, '$1')

  // SVG element renames.
  for (const [from, to] of Object.entries(ELEMENT_RENAMES)) {
    out = out.replace(new RegExp(`<(/?)${from}\\b`, 'g'), `<$1${to}`)
  }

  return out
}

function linkNavigation(html) {
  let converted = 0
  let left = 0

  const out = html.replace(
    /<a\b([^>]*?)>([\s\S]*?)<\/a>/g,
    (match, attributes, content) => {
      // The brand logo navigates home on every screen it is a link on.
      const route = attributes.includes('data-purpose="brand-logo"')
        ? '/'
        : ROUTES_BY_LABEL[labelOf(content)]
      if (!route) {
        left += 1
        return match
      }
      converted += 1
      const cleaned = attributes.replace(/\shref="[^"]*"/, '')
      return `<Link${cleaned} to="${route}">${content}</Link>`
    },
  )

  return { html: out, converted, left }
}

const stats = []

for (const page of PAGES) {
  const source = readFileSync(join(REFERENCE_ROOT, page.screen, 'code.html'), 'utf8')

  const body = source.match(/<body([^>]*)>([\s\S]*)<\/body>/)
  if (!body) throw new Error(`No <body> found in ${page.screen}/code.html`)

  const bodyClasses = body[1].match(/\sclass="([^"]*)"/)
  if (!bodyClasses) throw new Error(`No class attribute on <body> of ${page.screen}`)

  let markup = toJsx(body[2])
  markup = markup.replace(
    /<canvas id="groundwaterChart"><\/canvas>/,
    '<GroundwaterChart />',
  )

  const linked = linkNavigation(markup)

  const usesLink = linked.html.includes('<Link')
  const usesChart = linked.html.includes('<GroundwaterChart')

  const imports = [
    usesLink ? "import { Link } from 'react-router-dom'" : null,
    usesChart ? "import GroundwaterChart from '../components/GroundwaterChart.jsx'" : null,
  ].filter(Boolean)

  const file = [
    ...imports,
    imports.length ? '' : null,
    `export default function ${page.component}() {`,
    '  return (',
    `    <div className="${page.rootClass} ${bodyClasses[1]}">`,
    linked.html.replace(/^\n/, '').replace(/\s+$/, ''),
    '    </div>',
    '  )',
    '}',
    '',
  ]
    .filter((line) => line !== null)
    .join('\n')

  writeFileSync(join(PROJECT_ROOT, 'src', 'pages', `${page.component}.jsx`), file)
  stats.push({
    page: page.component,
    navLinks: linked.converted,
    plainAnchors: linked.left,
    chart: usesChart,
    bytes: file.length,
  })
}

console.table(stats)
