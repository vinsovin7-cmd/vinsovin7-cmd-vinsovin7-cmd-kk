import React, { useState, useEffect } from 'react';
import { HeroScene, QuantumComputerScene } from './components/QuantumScene';
import { SurfaceCodeDiagram, TransformerDecoderDiagram, PerformanceMetricDiagram } from './components/Diagrams';
import { EcosystemDashboard } from './components/EcosystemDashboard';
import { MailStudioSuite } from './components/MailStudioSuite';
import { ShoppingBag, Mail, Sparkles, BookOpen, Layers, Globe, ShieldCheck, Activity, X } from 'lucide-react';

const AuthorCard = ({ name, role, delay }: { name: string, role: string, delay: string }) => {
  return (
    <div className="flex flex-col group animate-fade-in-up items-center p-8 bg-stone-900/90 rounded-2xl border border-stone-800/80 shadow-2xl hover:shadow-amber-900/20 transition-all duration-300 w-full max-w-xs hover:border-nobel-gold/50" style={{ animationDelay: delay }}>
      <h3 className="font-serif text-2xl text-stone-100 text-center mb-3">{name}</h3>
      <div className="w-12 h-0.5 bg-nobel-gold mb-4 opacity-70"></div>
      <p className="text-xs text-stone-400 font-bold uppercase tracking-widest text-center leading-relaxed">{role}</p>
    </div>
  );
};

const App: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<"revenue" | "mail_ai" | "quantum">("revenue");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0E] text-stone-100 selection:bg-nobel-gold selection:text-black font-sans">
      
      {/* EXECUTIVE TOP NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 bg-[#090A0E]/95 backdrop-blur-md border-b border-stone-800 py-3.5 px-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Brand & Live System Status */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-nobel-gold rounded-xl flex items-center justify-center text-stone-950 font-serif font-bold text-2xl shadow-lg">
              α
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg tracking-wide text-white flex items-center gap-2">
                AlphaQubit Quantum Ecosystem <span className="text-nobel-gold font-normal">2024</span>
              </h1>
              <p className="text-xs text-stone-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Shopify ID: 5144661590b... • Mail.com Proxy Connected</span>
              </p>
            </div>
          </div>

          {/* Main Top Navigation Tabs */}
          <div className="flex items-center gap-2 bg-[#12151E] p-1.5 rounded-xl border border-stone-800">
            <button
              onClick={() => setActiveMainTab("revenue")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeMainTab === "revenue"
                  ? "bg-amber-600 text-white shadow-lg border border-amber-400/50"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <ShoppingBag size={15} className="text-amber-300" />
              <span>Shopify + Tidio Revenue Engine</span>
            </button>

            <button
              onClick={() => setActiveMainTab("mail_ai")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeMainTab === "mail_ai"
                  ? "bg-purple-900 text-purple-100 shadow-lg border border-purple-600"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <Mail size={15} className="text-purple-300" />
              <Sparkles size={12} className="text-amber-400" />
              <span>Mail.com & Multi Sreymara AI</span>
            </button>

            <button
              onClick={() => setActiveMainTab("quantum")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeMainTab === "quantum"
                  ? "bg-stone-800 text-stone-100 shadow-lg border border-stone-700"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <BookOpen size={15} className="text-sky-400" />
              <span>AlphaQubit Research Paper</span>
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        {/* VIEW 1: SHOPIFY + TIDIO + PHANTOM REVENUE ENGINE */}
        {activeMainTab === "revenue" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#0C0E14] p-4 rounded-xl border border-stone-800 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="font-serif font-bold text-lg text-amber-400 flex items-center gap-2">
                  <Activity size={18} /> Live Interactive Revenue & Event Simulation Control
                </h2>
                <p className="text-xs text-stone-400">
                  Track real-time visitor signals, active session durations, yield accruals, Phantom USDT withdrawals, and 80/20 cinema video shares.
                </p>
              </div>
              <button
                onClick={() => setActiveMainTab("mail_ai")}
                className="px-4 py-2 bg-purple-900/80 hover:bg-purple-800 text-purple-200 text-xs font-bold rounded-lg border border-purple-700 flex items-center gap-2 cursor-pointer"
              >
                <Mail size={14} /> Open Mail.com & Multi Sreymara AI Engine
              </button>
            </div>

            {/* Embedded Live Ecosystem Dashboard */}
            <EcosystemDashboard />
          </div>
        )}

        {/* VIEW 2: MAIL.COM & MULTI SREYMARA AI STUDIO */}
        {activeMainTab === "mail_ai" && (
          <div className="space-y-6 animate-fade-in">
            <MailStudioSuite onClose={() => setActiveMainTab("revenue")} />
          </div>
        )}

        {/* VIEW 3: ALPHAQUBIT QUANTUM RESEARCH PAPER */}
        {activeMainTab === "quantum" && (
          <div className="space-y-16 animate-fade-in pt-4">
            
            {/* Paper Navigation Links & Close Button (Screenshot 6 Fix) */}
            <div className="flex justify-between items-center bg-[#0D0F17] p-3 rounded-2xl border border-stone-800 flex-wrap gap-4 shadow-xl">
              <div className="flex items-center gap-3 flex-wrap text-xs font-bold uppercase tracking-wider">
                <a href="#introduction" onClick={scrollToSection('introduction')} className="px-4 py-2 bg-stone-900 border border-stone-800 hover:border-nobel-gold rounded-lg text-stone-300">
                  Introduction
                </a>
                <a href="#science" onClick={scrollToSection('science')} className="px-4 py-2 bg-stone-900 border border-stone-800 hover:border-nobel-gold rounded-lg text-stone-300">
                  The Surface Code
                </a>
                <a href="#impact" onClick={scrollToSection('impact')} className="px-4 py-2 bg-stone-900 border border-stone-800 hover:border-nobel-gold rounded-lg text-stone-300">
                  Impact
                </a>
                <a href="#authors" onClick={scrollToSection('authors')} className="px-4 py-2 bg-stone-900 border border-stone-800 hover:border-nobel-gold rounded-lg text-stone-300">
                  Authors
                </a>
              </div>

              <button
                onClick={() => setActiveMainTab("revenue")}
                className="px-4 py-2 bg-red-950/80 hover:bg-red-800 text-red-200 hover:text-white rounded-xl text-xs font-bold border border-red-700/60 shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                title="Close AlphaQubit Research Paper"
              >
                <X size={15} className="text-red-400" />
                <span>CLOSE PAPER</span>
              </button>
            </div>

            {/* Hero Section */}
            <section className="relative pt-8 pb-16 min-h-[60vh] flex items-center justify-center">
              <div className="absolute inset-0 z-0 opacity-40">
                <HeroScene />
              </div>

              <div className="container mx-auto px-6 z-10 text-center relative max-w-4xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-nobel-gold/40 bg-nobel-gold/10 text-nobel-gold text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-md">
                  <span>Nature</span>
                  <span>•</span>
                  <span>Nov 2024</span>
                  <span>•</span>
                  <span>Luxury Quantum Edition</span>
                </div>

                <h1 className="font-serif text-4xl md:text-6xl text-stone-100 font-bold mb-6 leading-tight tracking-tight">
                  AlphaQubit: AI for Quantum Error Correction
                </h1>

                <p className="text-lg md:text-xl text-stone-300 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
                  A recurrent, transformer-based neural network that learns to decode the surface code with unprecedented accuracy.
                </p>

                <div className="flex justify-center gap-4">
                  <a href="#science" onClick={scrollToSection('science')} className="px-6 py-3 bg-nobel-gold hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-sm transition-all shadow-lg">
                    Discover AlphaQubit
                  </a>
                </div>
              </div>
            </section>

            {/* Section 1: Introduction */}
            <section id="introduction" className="py-12 border-t border-stone-800">
              <div className="container mx-auto max-w-4xl">
                <h2 className="font-serif text-3xl font-bold text-amber-400 mb-6 text-center">Learning High-Accuracy Error Decoding</h2>
                <p className="text-stone-300 leading-relaxed text-base mb-6">
                  Quantum computers hold immense promise for solving complex problems, but quantum bits (qubits) are inherently fragile and prone to environmental noise. Quantum error correction (QEC) protects quantum information by entangling multiple physical qubits into a single logical qubit using surface codes.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                  <div className="p-6 bg-stone-900/80 rounded-xl border border-stone-800">
                    <h3 className="font-serif text-lg font-bold text-stone-100 mb-2">Syndrome Decoding Challenge</h3>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      Measuring stabilizer operators yields syndrome data. Translating complex syndrome patterns into precise physical error locations in real-time requires powerful AI architectures.
                    </p>
                  </div>
                  <div className="p-6 bg-stone-900/80 rounded-xl border border-stone-800">
                    <h3 className="font-serif text-lg font-bold text-stone-100 mb-2">AlphaQubit Breakthrough</h3>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      Trained on quantum processor simulations and experimental Sycamore data, AlphaQubit outperforms standard minimum-weight perfect matching (MWPM) algorithms across all noise regimes.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Science */}
            <section id="science" className="py-12 border-t border-stone-800">
              <div className="container mx-auto max-w-5xl space-y-12">
                <div className="text-center">
                  <h2 className="font-serif text-3xl font-bold text-stone-100 mb-3">The Science Behind AlphaQubit</h2>
                  <p className="text-stone-400 text-sm">Visualizing surface code grid layout and syndrome detection pipeline.</p>
                </div>

                <SurfaceCodeDiagram />
                <TransformerDecoderDiagram />
              </div>
            </section>

            {/* Section 3: Impact */}
            <section id="impact" className="py-12 border-t border-stone-800">
              <div className="container mx-auto max-w-5xl space-y-8">
                <div className="text-center">
                  <h2 className="font-serif text-3xl font-bold text-stone-100 mb-3">Performance & Benchmark Impact</h2>
                  <p className="text-stone-400 text-sm">Comparing AlphaQubit against classical decoders on Google Sycamore processor chips.</p>
                </div>
                <PerformanceMetricDiagram />
              </div>
            </section>

            {/* Section 4: Authors */}
            <section id="authors" className="py-12 border-t border-stone-800">
              <div className="container mx-auto max-w-5xl">
                <h2 className="font-serif text-3xl font-bold text-amber-400 mb-8 text-center">Research Contributors</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
                  <AuthorCard name="Julian Bausch" role="Google DeepMind" delay="0.1s" />
                  <AuthorCard name="Michael Newman" role="Google Quantum AI" delay="0.3s" />
                  <AuthorCard name="Multi Sreymara AI" role="Executive AI Synthesis Engine" delay="0.5s" />
                </div>
              </div>
            </section>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-stone-950 text-stone-400 py-10 border-t border-stone-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div>
            <div className="text-white font-serif font-bold text-lg">AlphaQubit Quantum Ecosystem</div>
            <p className="text-stone-500">Live Shopify, Tidio, Phantom Web3, Mail.com & Multi Sreymara AI Integration.</p>
          </div>
          <div className="text-stone-600 font-mono text-[11px]">
            Based on research published in Nature (2024). All server endpoints operational.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
