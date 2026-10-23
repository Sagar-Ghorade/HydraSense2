import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import MobileNav from './components/MobileNav.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import HistoricalData from './pages/HistoricalData.jsx'
import Predictions from './pages/Predictions.jsx'
import About from './pages/About.jsx'

/** The reference screens are separate documents, so each one opens at the top. */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      {/* Bottom padding keeps the fixed mobile nav from covering page footers. */}
      <div className="pb-14 md:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/historical-data" element={<HistoricalData />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <MobileNav />
    </>
  )
}
