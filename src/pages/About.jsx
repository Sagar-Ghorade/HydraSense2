import SiteLayout from '../components/SiteLayout'

export default function About() {
  return (
    <SiteLayout locationLabel="Select location">
      <div className="space-y-6 sm:space-y-8">
{/* BEGIN: HeroSection */}
<section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50/70 via-sky-50/40 to-blue-100/60 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between min-h-[220px]" data-purpose="hero-section">
{/* Hero Text Details */}
<div className="w-full md:w-3/5 z-10 space-y-3">
<h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            About <span className="text-brand-600">HydraSense</span>
</h1>
<p className="text-slate-600 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
            A simple system to monitor and predict groundwater levels using DWLR groundwater data and machine learning.
          </p>
</div>
{/* Scenic Illustration Graphic */}
<div aria-hidden="true" className="w-full md:w-2/5 flex justify-end mt-4 md:mt-0 relative overflow-hidden pointer-events-none">
<svg className="w-full max-w-[380px] h-[190px] drop-shadow-sm select-none" fill="none" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
<defs>
<linearGradient id="skyGrad" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.7"></stop>
<stop offset="100%" stopColor="#eff6ff" stopOpacity="0.1"></stop>
</linearGradient>
<linearGradient id="waterGrad" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#38bdf8"></stop>
<stop offset="100%" stopColor="#0284c7"></stop>
</linearGradient>
<linearGradient id="hillGrad1" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#93c5fd"></stop>
<stop offset="100%" stopColor="#60a5fa"></stop>
</linearGradient>
<linearGradient id="hillGrad2" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#86efac"></stop>
<stop offset="100%" stopColor="#4ade80"></stop>
</linearGradient>
</defs>
{/* Sky background gradient element */}
<rect fill="url(#skyGrad)" height="200" rx="16" width="400"></rect>
{/* Soft Clouds in Sky */}
<path d="M40 50 C50 40, 70 40, 80 50 C90 40, 110 40, 120 50 C125 55, 125 65, 115 70 C100 70, 50 70, 40 65 C35 60, 35 55, 40 50 Z" fill="#ffffff" fillOpacity="0.5"></path>
<path d="M220 30 C230 20, 250 20, 260 30 C270 25, 285 28, 290 35 C295 42, 290 50, 280 50 L230 50 C220 50, 215 40, 220 30 Z" fill="#ffffff" fillOpacity="0.4"></path>
{/* Distant Mountains */}
<path d="M120 160 L190 70 C205 50, 225 55, 240 80 L310 160 Z" fill="url(#hillGrad1)" opacity="0.65"></path>
<path d="M200 160 L260 85 C270 70, 285 70, 295 90 L360 160 Z" fill="#93c5fd" opacity="0.5"></path>
{/* Rolling Green Hills */}
<path d="M-20 170 Q70 90 200 135 T420 120 L420 200 L-20 200 Z" fill="url(#hillGrad2)" opacity="0.9"></path>
<path d="M100 170 Q240 100 420 140 L420 200 L100 200 Z" fill="#22c55e" opacity="0.85"></path>
{/* Lake / Water Reservoir */}
<path d="M-10 165 C120 155, 220 168, 410 155 L410 200 L-10 200 Z" fill="url(#waterGrad)" opacity="0.95"></path>
{/* Water ripple accents */}
<path d="M80 178 H130 M170 185 H240 M40 188 H100 M270 176 H320" stroke="#bae6fd" strokeLinecap="round" strokeWidth="2"></path>
{/* Decorative Trees */}
{/* Tree 1 */}
<rect fill="#78350f" height="30" rx="2" width="6" x="250" y="105"></rect>
<circle cx="253" cy="95" fill="#15803d" r="18"></circle>
<circle cx="253" cy="90" fill="#22c55e" r="14"></circle>
{/* Tree 2 */}
<rect fill="#78350f" height="36" rx="2" width="8" x="290" y="90"></rect>
<circle cx="294" cy="80" fill="#166534" r="22"></circle>
<circle cx="294" cy="74" fill="#15803d" r="17"></circle>
{/* Tree 3 */}
<rect fill="#78350f" height="32" rx="2" width="7" x="375" y="95"></rect>
<circle cx="378" cy="85" fill="#15803d" r="20"></circle>
<circle cx="378" cy="79" fill="#22c55e" r="15"></circle>
{/* Cozy Country House */}
{/* House Shadow / Ground Base */}
<ellipse cx="335" cy="138" fill="#15803d" opacity="0.4" rx="26" ry="6"></ellipse>
{/* Walls */}
<rect fill="#ffffff" height="26" rx="1.5" width="34" x="318" y="105"></rect>
{/* Roof */}
<polygon fill="#ef4444" points="314,106 335,85 356,106"></polygon>
<polygon fill="#dc2626" points="316,106 335,88 354,106"></polygon>
{/* Chimney */}
<rect fill="#b91c1c" height="10" rx="1" width="5" x="343" y="87"></rect>
{/* Windows */}
<rect fill="#38bdf8" height="6" rx="1" width="6" x="323" y="111"></rect>
<rect fill="#38bdf8" height="6" rx="1" width="6" x="333" y="111"></rect>
<rect fill="#38bdf8" height="6" rx="1" width="6" x="343" y="111"></rect>
<rect fill="#0284c7" height="10" rx="1" width="6" x="333" y="121"></rect>
</svg>
</div>
</section>
{/* END: HeroSection */}
{/* BEGIN: ThreePillarsGrid */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6" data-purpose="feature-cards">
{/* Pillar 1: Real DWLR Data */}
<div className="bg-white rounded-2xl border border-slate-100 p-8 flex flex-col items-center text-center shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition">
{/* Icon Circle Container */}
<div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-5">
<svg className="w-10 h-10 text-brand-600" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
<path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
<path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
</svg>
</div>
<h2 className="text-xl font-bold text-slate-900 mb-2">Real DWLR Data</h2>
<p className="text-slate-600 text-sm leading-relaxed max-w-[240px]">
            Works with DWLR groundwater records from the project dataset.
          </p>
</div>
{/* Pillar 2: Machine Learning */}
<div className="bg-white rounded-2xl border border-slate-100 p-8 flex flex-col items-center text-center shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition">
{/* Icon Circle Container */}
<div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-5">
<svg className="w-10 h-10 text-brand-600" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
{/* Stylized Brain / Neural Net Icon */}
<path d="M9.5 2a3.5 3.5 0 0 0-3.5 3.5c0 .3.04.58.11.85A4.5 4.5 0 0 0 4 10.5a4.48 4.48 0 0 0 1.5 3.35A4 4 0 0 0 9 20h.5"></path>
<path d="M14.5 2a3.5 3.5 0 0 1 3.5 3.5c0 .3-.04.58-.11.85A4.5 4.5 0 0 1 20 10.5a4.48 4.48 0 0 1-1.5 3.35A4 4 0 0 1 15 20h-.5"></path>
<path d="M12 4v16"></path>
<path d="M8 8h1"></path>
<path d="M8 12h1"></path>
<path d="M8 16h1"></path>
<path d="M15 8h1"></path>
<path d="M15 12h1"></path>
<path d="M15 16h1"></path>
</svg>
</div>
<h2 className="text-xl font-bold text-slate-900 mb-2">Machine Learning</h2>
<p className="text-slate-600 text-sm leading-relaxed max-w-[240px]">
            Predicts future groundwater levels using trained models.
          </p>
</div>
{/* Pillar 3: Better Decisions */}
<div className="bg-white rounded-2xl border border-slate-100 p-8 flex flex-col items-center text-center shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition">
{/* Icon Circle Container */}
<div className="w-20 h-20 rounded-full bg-[#eafaf1] flex items-center justify-center mb-5">
<svg className="w-10 h-10 text-[#10b981]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
<path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
</svg>
</div>
<h2 className="text-xl font-bold text-slate-900 mb-2">Better Decisions</h2>
<p className="text-slate-600 text-sm leading-relaxed max-w-[240px]">
            Helps in sustainable water resource management.
          </p>
</div>
</section>
{/* END: ThreePillarsGrid */}
{/* BEGIN: DetailStackedCards */}
<section className="space-y-4" data-purpose="details-section">
{/* Card 1: Data Source */}
<div className="bg-[#f0f7fe] rounded-2xl p-6 sm:px-8 sm:py-6 flex items-start sm:items-center space-x-5 border border-blue-50/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
<div className="w-14 h-14 rounded-2xl bg-blue-100/70 flex items-center justify-center shrink-0">
<svg className="w-7 h-7 text-brand-600" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
<polyline points="14 2 14 8 20 8"></polyline>
<line x1="16" x2="8" y1="13" y2="13"></line>
<line x1="16" x2="8" y1="17" y2="17"></line>
<polyline points="10 9 9 9 8 9"></polyline>
</svg>
</div>
<div className="space-y-1">
<h3 className="text-lg font-bold text-slate-900">Data Source</h3>
<p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed">
              DWLR (Dynamic Ground Water Level Records)<br className="hidden sm:inline"/>
              Dataset: DWLR_Dataset_2023.csv · official source and licensing pending confirmation
            </p>
</div>
</div>
{/* Card 2: Our Goal */}
<div className="bg-white rounded-2xl p-6 sm:px-8 sm:py-6 flex items-start sm:items-center space-x-5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
<div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
<svg className="w-7 h-7 text-brand-600" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
<circle cx="12" cy="12" r="10"></circle>
<circle cx="12" cy="12" r="6"></circle>
<circle cx="12" cy="12" r="2"></circle>
</svg>
</div>
<div className="space-y-1">
<h3 className="text-lg font-bold text-slate-900">Our Goal</h3>
<p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed">
              To provide easy access to groundwater information so that individuals, researchers and authorities can make better decisions for sustainable water management.
            </p>
</div>
</div>
</section>
{/* END: DetailStackedCards */}
      </div>
    </SiteLayout>
  )
}
