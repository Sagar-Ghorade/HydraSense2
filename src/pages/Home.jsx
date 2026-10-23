import { Link } from 'react-router-dom'
import SiteLayout from '../components/SiteLayout'

export default function Home() {
  return (
    <SiteLayout locationLabel="Select location">
      <section className="hero-bg relative overflow-hidden rounded-3xl border border-slate-200/70 px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
{/* Top Content Area with split text & vector landscape illustration */}
<div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
{/* Left Column: Headline and Call-to-actions */}
<div className="lg:col-span-5 flex flex-col items-start pt-2 lg:pt-6 z-10" data-purpose="hero-content">
{/* Subtitle badge */}
<span className="text-slate-500 font-bold tracking-[0.16em] text-[12px] sm:text-[12.5px] uppercase mb-4 block">
          Groundwater Intelligence
        </span>
{/* Headline */}
<h1 className="text-4xl sm:text-[46px] lg:text-[52px] font-extrabold text-slate-900 leading-[1.12] tracking-tight mb-5">
          Monitor<br/>
          Groundwater<br/>
          today for a<br/>
<span className="text-brand-600">Sustainable Tomorrow</span>
</h1>
{/* Subparagraph */}
<p className="text-slate-600 text-base sm:text-[15.5px] leading-relaxed max-w-[440px] mb-8 font-normal">
          HydraSense uses DWLR groundwater records and machine learning to help you understand, analyze and predict groundwater levels for better water management.
        </p>
{/* CTA Action Buttons */}
<div className="flex flex-wrap items-center gap-3.5" data-purpose="hero-actions">
{/* Primary Button */}
<Link className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-[15px] px-6 py-3.5 rounded-xl shadow-[0_4px_14px_rgba(0,102,255,0.35)] transition-all transform active:scale-95" to="/dashboard">
<span>Get Started</span>
<svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round"></path>
</svg>
</Link>
{/* Secondary Button */}
<Link className="inline-flex items-center justify-center bg-white hover:bg-slate-50 text-slate-800 font-semibold text-[15px] px-6 py-3.5 rounded-xl border border-slate-200/90 shadow-sm transition-all active:scale-95" to="/about">
            Learn More
          </Link>
</div>
</div>
{/* Right Column: Vector Illustration of Landscape & Geological Cross-section */}
<div className="relative flex h-[360px] w-full items-center justify-center sm:h-[420px] lg:col-span-7 lg:h-[460px]" data-purpose="hero-illustration">
<svg className="w-full h-full select-none" fill="none" viewBox="0 0 850 500" xmlns="http://www.w3.org/2000/svg">
<defs>
{/* Sky and Sun Gradients */}
<radialGradient cx="50%" cy="50%" id="sunGlow" r="50%">
<stop offset="0%" stopColor="#FFF8D6" stopOpacity="0.9"></stop>
<stop offset="100%" stopColor="#FFEBB0" stopOpacity="0"></stop>
</radialGradient>
<linearGradient id="mistFade" x1="0%" x2="40%" y1="0%" y2="0%">
<stop offset="0%" stopColor="#E8F3FF" stopOpacity="1"></stop>
<stop offset="100%" stopColor="#E8F3FF" stopOpacity="0"></stop>
</linearGradient>
{/* Water Aquifer Gradient */}
<linearGradient id="aquiferGrad" x1="0%" x2="0%" y1="0%" y2="100%">
<stop offset="0%" stopColor="#0062D6"></stop>
<stop offset="40%" stopColor="#2190FF"></stop>
<stop offset="100%" stopColor="#70BAFF"></stop>
</linearGradient>
<linearGradient id="tubeWaterGrad" x1="0%" x2="0%" y1="0%" y2="100%">
<stop offset="0%" stopColor="#0066FF"></stop>
<stop offset="100%" stopColor="#00C2FF"></stop>
</linearGradient>
{/* Glass Tube Shadow */}
<filter height="120%" id="tubeShadow" width="140%" x="-20%" y="-10%">
<feDropShadow dx="0" dy="4" floodColor="#003580" floodOpacity="0.25" stdDeviation="6"></feDropShadow>
</filter>
</defs>
{/* Sun */}
<circle cx="660" cy="85" fill="url(#sunGlow)" r="46"></circle>
<circle cx="660" cy="85" fill="#FFF4C4" r="23"></circle>
{/* Distant Clouds */}
<path d="M440 102 C440 92 452 82 466 84 C474 72 492 70 505 80 C514 74 528 78 534 88 C542 89 548 96 547 104 C547 105 440 105 440 102 Z" fill="#FFFFFF" fillOpacity="0.75"></path>
<path d="M340 135 C340 126 350 117 362 119 C368 110 384 107 395 116 C403 111 416 114 421 123 C428 124 434 130 433 137 Z" fill="#FFFFFF" fillOpacity="0.6"></path>
{/* Distant City Skyline Silhouettes */}
<g fill="#A5C7E6" opacity="0.45">
<rect height="50" rx="1" width="12" x="360" y="160"></rect>
<rect height="65" rx="1" width="14" x="375" y="145"></rect>
<polygon points="382,125 375,145 389,145"></polygon>
<rect height="58" rx="1" width="16" x="393" y="152"></rect>
<rect height="72" rx="1" width="18" x="414" y="138"></rect>
<polygon points="423,118 414,138 432,138"></polygon>
<rect height="52" rx="1" width="14" x="436" y="158"></rect>
<rect height="44" rx="1" width="16" x="454" y="166"></rect>
</g>
{/* Mountain Backdrop (Layer 1 - Distant) */}
<path d="M470 215 L585 110 C595 101 610 102 620 112 L710 205 L775 145 C785 136 800 137 810 148 L860 200 L860 250 L460 250 Z" fill="#75AADB" opacity="0.6"></path>
{/* Mountain Backdrop (Layer 2 - Foreground Mountains) */}
<path d="M510 220 L615 125 C625 116 640 118 649 128 L740 225 L850 140 L860 150 L860 230 L500 230 Z" fill="#5A96D4" opacity="0.8"></path>
<path d="M632 127 L650 145 L625 170 L615 125 Z" fill="#80B3E8" opacity="0.4"></path>
{/* Rolling Green Hill (Upper Background) */}
<path d="M370 235 C450 215 540 205 650 200 C740 196 800 190 860 170 L860 240 L360 240 Z" fill="#72C244"></path>
{/* Trees on Distant Hills */}
<g fill="#2B7F38">
<ellipse cx="505" cy="208" rx="6" ry="11"></ellipse>
<ellipse cx="518" cy="204" rx="7" ry="13"></ellipse>
<ellipse cx="530" cy="209" rx="5" ry="10"></ellipse>
<ellipse cx="570" cy="202" rx="6" ry="11"></ellipse>
<ellipse cx="580" cy="198" rx="7" ry="14"></ellipse>
<ellipse cx="592" cy="204" rx="5" ry="9"></ellipse>
</g>
{/* Midground Green Field with House and Pine/Lush Trees */}
<path d="M330 245 C440 230 570 215 720 210 C780 208 820 205 860 205 L860 265 C780 265 670 262 550 268 C440 274 370 278 320 280 Z" fill="#8BD34A"></path>
{/* Miniature White Country House with Red Roof */}
<g transform="translate(738, 158)">
{/* Main Building Base */}
<rect fill="#FFFFFF" height="32" rx="2" width="52" x="5" y="18"></rect>
{/* Roof */}
<polygon fill="#DE5246" points="31,0 0,19 62,19"></polygon>
{/* Chimney */}
<rect fill="#BA3B30" height="12" width="6" x="42" y="5"></rect>
{/* Windows & Door */}
<rect fill="#4B90E2" height="9" rx="1" width="7" x="14" y="24"></rect>
<rect fill="#4B90E2" height="9" rx="1" width="7" x="25" y="24"></rect>
<rect fill="#4B90E2" height="9" rx="1" width="7" x="41" y="24"></rect>
<rect fill="#2E4A62" height="12" rx="1" width="8" x="25" y="38"></rect>
</g>
{/* Foreground Lush Green Trees around House */}
{/* Tree 1 */}
<rect fill="#6B4B31" height="22" width="4" x="560" y="195"></rect>
<ellipse cx="562" cy="185" fill="#277E3C" rx="12" ry="19"></ellipse>
<ellipse cx="560" cy="183" fill="#3AA64C" rx="9" ry="15"></ellipse>
{/* Tree 2 */}
<rect fill="#6B4B31" height="26" width="5" x="600" y="182"></rect>
<ellipse cx="602.5" cy="168" fill="#1C6C33" rx="15" ry="24"></ellipse>
<ellipse cx="600" cy="165" fill="#2B9142" rx="11" ry="19"></ellipse>
{/* Tree 3 */}
<rect fill="#6B4B31" height="34" width="6" x="646" y="174"></rect>
<ellipse cx="649" cy="155" fill="#185C2B" rx="18" ry="27"></ellipse>
<ellipse cx="646" cy="152" fill="#26873C" rx="14" ry="22"></ellipse>
{/* Tree 4 */}
<rect fill="#6B4B31" height="42" width="6" x="710" y="165"></rect>
<ellipse cx="713" cy="144" fill="#1B632E" rx="20" ry="30"></ellipse>
<ellipse cx="710" cy="140" fill="#2E9946" rx="15" ry="25"></ellipse>
{/* Tree 5 (Right of House) */}
<rect fill="#6B4B31" height="45" width="6" x="806" y="162"></rect>
<ellipse cx="809" cy="138" fill="#165B29" rx="22" ry="32"></ellipse>
<ellipse cx="806" cy="134" fill="#248F3D" rx="17" ry="26"></ellipse>
{/* Tree 6 (Far Right) */}
<ellipse cx="855" cy="145" fill="#1E6B32" rx="24" ry="35"></ellipse>
<ellipse cx="852" cy="140" fill="#309F49" rx="19" ry="28"></ellipse>
{/* GEOLOGICAL CROSS-SECTION (Underground Strata) */}
{/* Layer 1: Topsoil / Humus (Medium Clay Brown) */}
<path d="M300 270 C380 268 470 262 560 258 C680 252 770 250 860 248 L860 305 C760 310 650 312 550 316 C430 321 340 328 290 334 Z" fill="#9B7355"></path>
{/* Topsoil Texture Dots / Stones */}
<g fill="#7A563D" opacity="0.75">
<ellipse cx="430" cy="285" rx="5" ry="3"></ellipse>
<ellipse cx="490" cy="298" rx="7" ry="4"></ellipse>
<ellipse cx="580" cy="280" rx="6" ry="3.5"></ellipse>
<ellipse cx="670" cy="288" rx="8" ry="4.5"></ellipse>
<ellipse cx="770" cy="275" rx="5" ry="3"></ellipse>
<ellipse cx="820" cy="292" rx="7" ry="4"></ellipse>
</g>
{/* Layer 2: Subsoil / Gravel Earth (Sandy Ochre / Light Brown) */}
<path d="M280 334 C360 328 450 321 560 316 C670 311 770 308 860 305 L860 365 C780 368 680 370 560 370 C430 370 330 378 260 388 Z" fill="#C99B72"></path>
{/* Subsoil Rocks & Particles */}
<g fill="#A67B53" opacity="0.6">
<circle cx="370" cy="354" r="5"></circle>
<circle cx="440" cy="342" r="7"></circle>
<circle cx="510" cy="358" r="9"></circle>
<circle cx="610" cy="338" r="6"></circle>
<circle cx="700" cy="352" r="8"></circle>
<circle cx="790" cy="336" r="7"></circle>
<circle cx="835" cy="348" r="5"></circle>
</g>
{/* Layer 3: Upper Aquifer / Saturated Sand (Deep Indigo/Cobalt Blue) */}
<path d="M250 388 C330 378 440 370 570 370 C690 370 780 368 860 365 L860 425 C780 435 670 442 550 442 C410 442 300 452 230 468 Z" fill="#175494"></path>
{/* Layer 4: Deep Confined Aquifer (Vibrant Sky Blue with Porous Water Dots) */}
<path d="M220 468 C310 450 420 442 560 442 C680 442 780 435 860 425 L860 500 L200 500 Z" fill="url(#aquiferGrad)"></path>
{/* Porous Water Dots inside Aquifer Layer */}
<g fill="#FFFFFF" opacity="0.35">
<circle cx="320" cy="485" r="4.5"></circle>
<circle cx="420" cy="470" r="5"></circle>
<circle cx="480" cy="488" r="3.5"></circle>
<circle cx="540" cy="465" r="6"></circle>
<circle cx="620" cy="480" r="4.5"></circle>
<circle cx="720" cy="460" r="5.5"></circle>
<circle cx="790" cy="482" r="4"></circle>
<circle cx="840" cy="465" r="5"></circle>
</g>
{/* BOREHOLE / DWLR SENSOR WELL TUBE */}
{/* Borehole casing insertion */}
<g filter="url(#tubeShadow)">
{/* Outer Glass/Casing Tube */}
<rect fill="#FFFFFF" fillOpacity="0.85" height="250" rx="7" stroke="#FFFFFF" strokeWidth="2.5" width="14" x="616" y="200"></rect>
{/* Water level fill inside tube */}
<rect fill="url(#tubeWaterGrad)" height="122" rx="5" width="10" x="618" y="325"></rect>
{/* Sensor Cap on top of tube */}
<rect fill="#6C8299" height="10" rx="3" width="18" x="614" y="195"></rect>
<rect fill="#99B0C7" height="3" rx="1" width="12" x="617" y="198"></rect>
<line stroke="#50667D" strokeWidth="1.5" x1="616" x2="630" y1="208" y2="208"></line>
{/* Measurement Graduations/Ticks on tube */}
<line stroke="#7A93AA" strokeWidth="1.2" x1="617" x2="621" y1="230" y2="230"></line>
<line stroke="#7A93AA" strokeWidth="1.2" x1="617" x2="622" y1="250" y2="250"></line>
<line stroke="#7A93AA" strokeWidth="1.2" x1="617" x2="621" y1="270" y2="270"></line>
<line stroke="#7A93AA" strokeWidth="1.2" x1="617" x2="622" y1="290" y2="290"></line>
<line stroke="#7A93AA" strokeWidth="1.2" x1="617" x2="621" y1="310" y2="310"></line>
<line stroke="#FFFFFF" strokeWidth="1.2" x1="617" x2="622" y1="330" y2="330"></line>
<line stroke="#FFFFFF" strokeWidth="1.2" x1="617" x2="621" y1="350" y2="350"></line>
<line stroke="#FFFFFF" strokeWidth="1.2" x1="617" x2="622" y1="370" y2="370"></line>
<line stroke="#FFFFFF" strokeWidth="1.2" x1="617" x2="621" y1="390" y2="390"></line>
<line stroke="#FFFFFF" strokeWidth="1.2" x1="617" x2="622" y1="410" y2="410"></line>
<line stroke="#FFFFFF" strokeWidth="1.2" x1="617" x2="621" y1="430" y2="430"></line>
{/* Meniscus highlight in water tube */}
<ellipse cx="623" cy="326" fill="#B3E5FC" rx="4.5" ry="1.5"></ellipse>
</g>
{/* Left Soft Fade Gradient Overlay (seamlessly blends illustration with left hero text) */}
<rect fill="url(#mistFade)" height="500" width="460" x="0" y="0"></rect>
</svg>
</div>
</div>
{/* BEGIN: BottomFeatureCards */}
{/* 3 High fidelity responsive bottom cards */}
<div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3" data-purpose="features-grid">
{/* Card 1: Real DWLR Data */}
<div className="bg-[#EFF7FF]/90 border border-[#D8EBFF] rounded-2xl p-5 flex items-center gap-4.5 shadow-sm hover:shadow-md transition-shadow" data-purpose="feature-card">
{/* Icon Container (Light Blue) */}
<div className="w-14 h-14 rounded-2xl bg-[#DDF0FF] flex items-center justify-center flex-shrink-0">
{/* Blue Bar Chart Icon */}
<svg className="w-7 h-7 text-brand-600" fill="currentColor" viewBox="0 0 24 24">
<rect height="8" rx="1.5" width="4.5" x="3" y="13"></rect>
<rect height="13" rx="1.5" width="4.5" x="9.75" y="8"></rect>
<rect height="18" rx="1.5" width="4.5" x="16.5" y="3"></rect>
</svg>
</div>
<div>
<h3 className="font-bold text-slate-900 text-[16.5px] leading-snug">Real DWLR Data</h3>
<p className="text-slate-500 text-[13.5px] leading-normal mt-0.5">Built on DWLR groundwater records</p>
</div>
</div>
{/* Card 2: Smart Predictions */}
<div className="bg-[#EFFDF4]/90 border border-[#D5F5E2] rounded-2xl p-5 flex items-center gap-4.5 shadow-sm hover:shadow-md transition-shadow" data-purpose="feature-card">
{/* Icon Container (Light Green) */}
<div className="w-14 h-14 rounded-2xl bg-[#DBF7E5] flex items-center justify-center flex-shrink-0">
{/* Green Circuit / Brain Icon */}
<svg className="w-7 h-7 text-[#059652]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
{/* Left lobe */}
<path d="M9.5 4a3.5 3.5 0 0 0-3.5 3.5 3.5 3.5 0 0 0 1 2.5 3.5 3.5 0 0 0-1 2.5 3.5 3.5 0 0 0 1 2.5 3.5 3.5 0 0 0-1 2.5 3.5 3.5 0 0 0 3.5 3.5"></path>
{/* Right lobe */}
<path d="M14.5 4a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-1 2.5 3.5 3.5 0 0 1 1 2.5 3.5 3.5 0 0 1-1 2.5 3.5 3.5 0 0 1 1 2.5 3.5 3.5 0 0 1-3.5 3.5"></path>
{/* Center stem */}
<path d="M12 4v16"></path>
<path d="M9.5 8h2.5"></path>
<path d="M12 12h2.5"></path>
<path d="M9.5 16h2.5"></path>
</svg>
</div>
<div>
<h3 className="font-bold text-slate-900 text-[16.5px] leading-snug">Smart Predictions</h3>
<p className="text-slate-500 text-[13.5px] leading-normal mt-0.5">Using machine learning models</p>
</div>
</div>
{/* Card 3: Sustainable Impact */}
<div className="bg-[#FCF9EE]/90 border border-[#F3EDCE] rounded-2xl p-5 flex items-center gap-4.5 shadow-sm hover:shadow-md transition-shadow" data-purpose="feature-card">
{/* Icon Container (Light Yellow/Green) */}
<div className="w-14 h-14 rounded-2xl bg-[#F6F0CF] flex items-center justify-center flex-shrink-0">
{/* Green Leaf in circle icon */}
<svg className="w-7 h-7 text-[#0B8A5A]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
<line x1="16" x2="2" y1="8" y2="22"></line>
</svg>
</div>
<div>
<h3 className="font-bold text-slate-900 text-[16.5px] leading-snug">Sustainable Impact</h3>
<p className="text-slate-500 text-[13.5px] leading-normal mt-0.5">Supports better water resource management</p>
</div>
</div>
</div>
{/* END: BottomFeatureCards */}
      </section>
    </SiteLayout>
  )
}
