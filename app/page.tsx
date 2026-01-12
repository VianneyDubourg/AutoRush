"use client"

import { useEffect } from "react"
import Script from "next/script"

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize Lucide icons after a short delay to ensure script is loaded
      const initIcons = () => {
        if ((window as any).lucide) {
          (window as any).lucide.createIcons()
        } else {
          setTimeout(initIcons, 100)
        }
      }
      initIcons()

      // Live Data Simulation
      const updateStats = () => {
        // Vidéos traitées - légère variation
        if(Math.random() > 0.8) {
          const videos = document.getElementById('stat-videos')
          if(videos) {
            const val = parseInt(videos.innerText)
            videos.innerText = (val + (Math.random() > 0.5 ? 1 : 0)).toString()
          }
        }
        
        // AutoCut - légère variation
        if(Math.random() > 0.85) {
          const autocut = document.getElementById('stat-autocut')
          if(autocut) {
            const val = parseInt(autocut.innerText)
            autocut.innerText = (val + (Math.random() > 0.5 ? 1 : 0)).toString()
          }
        }
        
        // AutoFrame - légère variation
        if(Math.random() > 0.9) {
          const autoframe = document.getElementById('stat-autoframe')
          if(autoframe) {
            const val = parseInt(autoframe.innerText)
            autoframe.innerText = (val + (Math.random() > 0.7 ? 1 : 0)).toString()
          }
        }
      }
      const statsInterval = setInterval(updateStats, 2000)

      // Sidebar Navigation Logic
      ;(window as any).setActiveTab = (element: HTMLElement, tabName: string) => {
        const items = document.querySelectorAll('.sidebar-item')
        items.forEach(item => item.classList.remove('active'))
        element.classList.add('active')

        const title = document.getElementById('page-title')
        if (title) {
          const titles: Record<string, string> = {
            overview: "Vue d'ensemble",
            analytics: "AutoCut",
            deployments: "AutoFrame",
            team: "Mes vidéos"
          }
          title.innerText = titles[tabName] || tabName.charAt(0).toUpperCase() + tabName.slice(1)
        }

        const views = document.querySelectorAll('.view-content')
        views.forEach(view => {
          view.classList.remove('active')
        })

        const selectedView = document.getElementById('view-' + tabName)
        if(selectedView) {
          selectedView.classList.add('active')
          selectedView.style.animation = 'none'
          selectedView.offsetHeight
          selectedView.style.animation = ''
        }
      }

      // Chart Tooltip Logic
      ;(window as any).showTooltip = (element: HTMLElement, value: string) => {
        const tooltip = document.getElementById('tooltip')
        if (tooltip) {
          tooltip.innerText = value + ' vidéos/h'
          tooltip.style.opacity = '1'
          
          const rect = element.getBoundingClientRect()
          const parentRect = element.parentElement?.getBoundingClientRect()
          if (parentRect) {
            const left = rect.left - parentRect.left
            tooltip.style.left = (left - 10) + 'px'
          }
        }
      }

      ;(window as any).hideTooltip = () => {
        const tooltip = document.getElementById('tooltip')
        if (tooltip) tooltip.style.opacity = '0'
      }

      return () => {
        clearInterval(statsInterval)
      }
    }
  }, [])

  return (
    <>
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      <Script src="https://unpkg.com/lucide@latest" strategy="beforeInteractive" />
      
      <div className="min-h-screen" style={{
        backgroundColor: "#000000",
        color: "#ffffff",
        overflowX: "hidden"
      }}>
        <style dangerouslySetInnerHTML={{__html: `
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #0a0a0a; }
          ::-webkit-scrollbar-thumb { background: #262626; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #404040; }
          .glass-panel {
            background: rgba(20, 20, 20, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }
          .glass-nav {
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
          .gradient-text {
            background: linear-gradient(to right, #ffffff, #a3a3a3);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .glow-effect {
            box-shadow: 0 0 40px -10px rgba(255, 255, 255, 0.1);
          }
          .bg-grid {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          }
          @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.5; }
            100% { transform: scale(2); opacity: 0; }
          }
          .animate-pulse-ring::before {
            content: '';
            position: absolute;
            left: 0; top: 0; right: 0; bottom: 0;
            border-radius: 50%;
            border: 1px solid #22c55e;
            animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
          }
          .chart-bar {
            transition: height 0.3s ease, background-color 0.2s;
          }
          .chart-bar:hover {
            background-color: #a855f7 !important;
            filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.5));
          }
          #dashboard-wrapper {
            transition: transform 0.1s cubic-bezier(0, 0, 0.2, 1);
            position: relative;
            z-index: 40;
            touch-action: none;
          }
          .sidebar-item.active {
            background: rgba(255,255,255,0.08);
            color: white;
            border-color: rgba(255,255,255,0.08);
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in {
            animation: fadeIn 0.3s ease-out forwards;
          }
          .view-content { display: none; }
          .view-content.active { display: block; }
        `}} />

        {/* Background */}
        <div className="aura-background-component fixed top-0 w-full h-screen -z-10 opacity-50" style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)'
        }}>
          <div data-us-project="cqcLtDwfoHqqRPttBbQE" className="absolute top-0 left-0 -z-10 w-full h-full"></div>
          <Script id="unicorn-studio" strategy="beforeInteractive">
            {`!function(){if(!window.UnicornStudio){window.UnicornStudio={isInitialized:!1};var i=document.createElement("script");i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js",i.onload=function(){window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)},(document.head || document.body).appendChild(i)}}();`}
          </Script>
        </div>

        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 glass-nav">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 cursor-pointer group">
              <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center transition-transform group-hover:rotate-12">
                <i data-lucide="zap" className="w-4 h-4 text-black"></i>
              </div>
              <span className="font-semibold tracking-tight text-white">autorush</span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Fonctionnalités</a>
              <a href="#method" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Méthode</a>
              <a href="#customers" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Clients</a>
              <a href="#pricing" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Tarifs</a>
            </div>

            <div className="flex items-center gap-4">
              <a href="/login" className="hidden sm:block text-sm font-medium text-neutral-300 hover:text-white transition-colors">Se connecter</a>
              <a href="/register" className="bg-white text-black text-sm font-medium px-4 py-2 rounded-full hover:bg-neutral-200 transition-colors transform hover:scale-105 active:scale-95 duration-200">
                Commencer
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden min-h-screen">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px]"></div>
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px]"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center pointer-events-none">
            <a href="/dashboard" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 pointer-events-auto cursor-pointer hover:bg-white/10 transition-colors">
              <span className="flex h-2 w-2 rounded-full bg-green-500 relative animate-pulse-ring"></span>
              <span className="text-xs font-medium text-neutral-300">AutoRush v1.0 est maintenant disponible</span>
            </a>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 gradient-text max-w-4xl mx-auto leading-[1.1]">
              Préparez vos vidéos en quelques clics.
            </h1>
            
            <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Supprimez intelligemment les silences et adaptez vos formats avec AutoCut et AutoFrame. 
              L'outil simple pour les créateurs qui veulent publier rapidement.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 pointer-events-auto">
              <a href="/register" className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-medium rounded-full hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 text-center">
                <span>Commencer gratuitement</span>
                <i data-lucide="arrow-right" className="w-4 h-4 flex-shrink-0"></i>
              </a>
              <a href="/docs" className="w-full sm:w-auto px-8 py-3.5 bg-white/5 text-white border border-white/10 font-medium rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95">
                <i data-lucide="book-open" className="w-4 h-4 text-neutral-400"></i>
                Documentation
                <i data-lucide="arrow-right" className="w-4 h-4"></i>
              </a>
            </div>

            {/* Draggable Dashboard Mockup */}
            <div className="relative max-w-5xl mx-auto pointer-events-auto perspective-1000">
              <div id="dashboard-wrapper" className="glass-panel rounded-xl overflow-hidden shadow-2xl glow-effect select-none transform-gpu transition-all duration-75">
                <div id="drag-handle" className="h-10 bg-black/40 border-b border-white/5 flex items-center px-4 gap-2 group">
                  <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50 transition-colors"></div>
                  </div>
                  <div className="ml-4 flex items-center gap-2 px-3 py-1 bg-white/5 rounded text-xs text-neutral-500 font-mono group/url">
                    <i data-lucide="lock" className="w-3 h-3 group-hover/url:text-green-400 transition-colors"></i>
                    autorush.fr/dashboard
                  </div>
                </div>
                
                <div className="flex h-[500px] bg-black/80">
                  <div className="w-64 border-r border-white/5 p-4 flex flex-col gap-1 hidden md:flex bg-black/20">
                    <div className="flex items-center gap-2 px-3 py-2 text-white bg-white/5 rounded-lg border border-white/5 mb-4 hover:border-white/20 cursor-pointer transition-colors">
                      <div className="w-5 h-5 bg-gradient-to-tr from-blue-500 to-blue-600 rounded flex items-center justify-center text-[10px] font-bold shadow-lg">AR</div>
                      <span className="text-sm font-medium">AutoRush</span>
                      <i data-lucide="chevron-down" className="w-3 h-3 ml-auto text-neutral-500"></i>
                    </div>
                    
                    <div className="space-y-0.5" id="sidebar-menu">
                      <div onClick={(e) => (window as any).setActiveTab(e.currentTarget, 'overview')} className="sidebar-item active px-3 py-2 text-sm text-neutral-400 hover:text-white rounded-md flex items-center gap-3 transition-all cursor-pointer border border-transparent">
                        <i data-lucide="layout-grid" className="w-4 h-4"></i>
                        Vue d'ensemble
                      </div>
                      <div onClick={(e) => (window as any).setActiveTab(e.currentTarget, 'analytics')} className="sidebar-item px-3 py-2 text-sm text-neutral-400 hover:text-white rounded-md flex items-center gap-3 transition-all cursor-pointer border border-transparent">
                        <i data-lucide="scissors" className="w-4 h-4"></i>
                        AutoCut
                      </div>
                      <div onClick={(e) => (window as any).setActiveTab(e.currentTarget, 'deployments')} className="sidebar-item px-3 py-2 text-sm text-neutral-400 hover:text-white rounded-md flex items-center gap-3 transition-all cursor-pointer border border-transparent">
                        <i data-lucide="frame" className="w-4 h-4"></i>
                        AutoFrame
                      </div>
                      <div onClick={(e) => (window as any).setActiveTab(e.currentTarget, 'team')} className="sidebar-item px-3 py-2 text-sm text-neutral-400 hover:text-white rounded-md flex items-center gap-3 transition-all cursor-pointer border border-transparent">
                        <i data-lucide="video" className="w-4 h-4"></i>
                        Mes vidéos
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5">
                      <div className="px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-white/5 rounded-md cursor-pointer flex items-center gap-3 transition-colors">
                        <i data-lucide="settings" className="w-4 h-4"></i>
                        Paramètres
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-8 relative overflow-y-auto" id="main-view">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>

                    <div className="flex items-center justify-between mb-8 fade-in sticky top-0 z-30">
                      <h2 className="text-lg font-medium text-white flex items-center gap-2">
                        <span id="page-title">Vue d'ensemble</span>
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      </h2>
                      <div className="flex gap-2">
                        <div className="relative group">
                          <button className="px-3 py-1.5 rounded-md bg-white/5 text-xs text-neutral-400 border border-white/5 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2">
                            Dernières 24h <i data-lucide="chevron-down" className="w-3 h-3"></i>
                          </button>
                        </div>
                        <button className="p-1.5 rounded-md bg-white text-black hover:bg-neutral-200 hover:scale-105 transition-all active:scale-95">
                          <i data-lucide="plus" className="w-4 h-4"></i>
                        </button>
                      </div>
                    </div>

                    {/* OVERVIEW CONTENT */}
                    <div id="view-overview" className="view-content active fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-default">
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                              <i data-lucide="video" className="w-4 h-4"></i>
                            </div>
                            <span className="text-green-400 text-xs flex items-center gap-1">+23 <i data-lucide="arrow-up-right" className="w-3 h-3"></i></span>
                          </div>
                          <div className="text-2xl font-semibold text-white mb-1 font-mono"><span id="stat-videos">127</span></div>
                          <div className="text-xs text-neutral-500">Vidéos traitées</div>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-default">
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                              <i data-lucide="clock" className="w-4 h-4"></i>
                            </div>
                            <span className="text-green-400 text-xs flex items-center gap-1">Ce mois-ci</span>
                          </div>
                          <div className="text-2xl font-semibold text-white mb-1 font-mono"><span id="stat-time">8h</span> 42m</div>
                          <div className="text-xs text-neutral-500">Temps économisé</div>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-default">
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                              <i data-lucide="scissors" className="w-4 h-4"></i>
                            </div>
                            <span className="text-green-400 text-xs flex items-center gap-1">Suppressions</span>
                          </div>
                          <div className="text-2xl font-semibold text-white mb-1 font-mono"><span id="stat-autocut">89</span></div>
                          <div className="text-xs text-neutral-500">AutoCut utilisés</div>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-default">
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                              <i data-lucide="frame" className="w-4 h-4"></i>
                            </div>
                            <span className="text-green-400 text-xs flex items-center gap-1">Adaptations</span>
                          </div>
                          <div className="text-2xl font-semibold text-white mb-1 font-mono"><span id="stat-autoframe">38</span></div>
                          <div className="text-xs text-neutral-500">AutoFrame utilisés</div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 h-48 flex flex-col justify-between relative overflow-hidden group">
                        <div className="flex justify-between items-center z-10">
                          <h3 className="text-sm font-medium text-neutral-300">Activité</h3>
                          <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-end justify-between gap-1 h-24 mt-4 relative" id="chart-bars">
                          <div id="tooltip" className="absolute -top-8 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 transition-opacity pointer-events-none z-20 whitespace-nowrap">240 vidéos/h</div>
                          
                          <div className="chart-bar w-full bg-white/5 rounded-t-sm h-[40%]" onMouseOver={(e) => (window as any).showTooltip(e.currentTarget, '124')} onMouseOut={(window as any).hideTooltip}></div>
                          <div className="chart-bar w-full bg-white/5 rounded-t-sm h-[60%]" onMouseOver={(e) => (window as any).showTooltip(e.currentTarget, '210')} onMouseOut={(window as any).hideTooltip}></div>
                          <div className="chart-bar w-full bg-white/5 rounded-t-sm h-[55%]" onMouseOver={(e) => (window as any).showTooltip(e.currentTarget, '185')} onMouseOut={(window as any).hideTooltip}></div>
                          <div className="chart-bar w-full bg-white/5 rounded-t-sm h-[75%]" onMouseOver={(e) => (window as any).showTooltip(e.currentTarget, '320')} onMouseOut={(window as any).hideTooltip}></div>
                          <div className="chart-bar w-full bg-white/5 rounded-t-sm h-[45%]" onMouseOver={(e) => (window as any).showTooltip(e.currentTarget, '150')} onMouseOut={(window as any).hideTooltip}></div>
                          <div className="chart-bar w-full bg-white/10 rounded-t-sm h-[85%]" onMouseOver={(e) => (window as any).showTooltip(e.currentTarget, '380')} onMouseOut={(window as any).hideTooltip}></div>
                          <div className="chart-bar w-full bg-white/5 rounded-t-sm h-[70%]" onMouseOver={(e) => (window as any).showTooltip(e.currentTarget, '290')} onMouseOut={(window as any).hideTooltip}></div>
                          <div className="chart-bar w-full bg-white/5 rounded-t-sm h-[65%]" onMouseOver={(e) => (window as any).showTooltip(e.currentTarget, '240')} onMouseOut={(window as any).hideTooltip}></div>
                          <div className="chart-bar w-full bg-blue-500 rounded-t-sm h-[90%] shadow-[0_0_15px_rgba(59,130,246,0.5)]" onMouseOver={(e) => (window as any).showTooltip(e.currentTarget, '410')} onMouseOut={(window as any).hideTooltip}></div>
                        </div>
                      </div>
                    </div>

                    {/* ANALYTICS CONTENT - AutoCut */}
                    <div id="view-analytics" className="view-content fade-in">
                      <div className="grid grid-cols-1 gap-6">
                        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                          <h3 className="text-sm font-medium text-white mb-4">Mes vidéos AutoCut</h3>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <i data-lucide="video" className="w-4 h-4 text-neutral-400"></i>
                              <span className="text-xs text-neutral-400 font-mono flex-1">video_tutoriel.mp4</span>
                              <span className="text-xs text-neutral-500">Il y a 2h</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <i data-lucide="video" className="w-4 h-4 text-neutral-400"></i>
                              <span className="text-xs text-neutral-400 font-mono flex-1">interview_clean.mp4</span>
                              <span className="text-xs text-neutral-500">Hier</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <i data-lucide="video" className="w-4 h-4 text-neutral-400"></i>
                              <span className="text-xs text-neutral-400 font-mono flex-1">presentation_short.mp4</span>
                              <span className="text-xs text-neutral-500">Il y a 3j</span>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                          <h3 className="text-sm font-medium text-white mb-4">Statistiques AutoCut</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-neutral-400">Vidéos traitées</span>
                              <span className="text-sm font-medium text-white">89</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-neutral-400">Temps économisé</span>
                              <span className="text-sm font-medium text-white">~6h 30m</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-neutral-400">Silences supprimés</span>
                              <span className="text-sm font-medium text-white">1,247</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DEPLOYMENTS CONTENT - AutoFrame */}
                    <div id="view-deployments" className="view-content fade-in">
                      <div className="grid grid-cols-1 gap-6">
                        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                          <h3 className="text-sm font-medium text-white mb-4">Mes vidéos AutoFrame</h3>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <i data-lucide="frame" className="w-4 h-4 text-blue-400"></i>
                              <span className="text-xs text-neutral-400 font-mono flex-1">presentation_vertical.mp4</span>
                              <span className="text-xs text-neutral-500">16:9 → 9:16</span>
                              <span className="text-xs text-neutral-500">Il y a 5h</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <i data-lucide="frame" className="w-4 h-4 text-blue-400"></i>
                              <span className="text-xs text-neutral-400 font-mono flex-1">video_carre.mp4</span>
                              <span className="text-xs text-neutral-500">16:9 → 1:1</span>
                              <span className="text-xs text-neutral-500">Il y a 1j</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <i data-lucide="frame" className="w-4 h-4 text-blue-400"></i>
                              <span className="text-xs text-neutral-400 font-mono flex-1">tutoriel_format.mp4</span>
                              <span className="text-xs text-neutral-500">16:9 → 4:5</span>
                              <span className="text-xs text-neutral-500">Il y a 2j</span>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                          <h3 className="text-sm font-medium text-white mb-4">Statistiques AutoFrame</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-neutral-400">Vidéos adaptées</span>
                              <span className="text-sm font-medium text-white">38</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-neutral-400">Format le plus utilisé</span>
                              <span className="text-sm font-medium text-white">9:16</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-neutral-400">Total formats</span>
                              <span className="text-sm font-medium text-white">3</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* TEAM CONTENT - Mes vidéos */}
                    <div id="view-team" className="view-content fade-in">
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors flex items-center gap-4">
                          <i data-lucide="video" className="w-8 h-8 text-neutral-400"></i>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium text-white">video_tutoriel.mp4</p>
                            <p className="text-xs text-neutral-500">AutoCut • Il y a 2 heures</p>
                          </div>
                          <button className="px-3 py-1 rounded-md bg-white/5 text-xs text-neutral-400 border border-white/5 hover:bg-white/10 hover:text-white transition-colors">
                            Voir
                          </button>
                        </div>
                        <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors flex items-center gap-4">
                          <i data-lucide="video" className="w-8 h-8 text-neutral-400"></i>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium text-white">presentation_vertical.mp4</p>
                            <p className="text-xs text-neutral-500">AutoFrame • Il y a 5 heures</p>
                          </div>
                          <button className="px-3 py-1 rounded-md bg-white/5 text-xs text-neutral-400 border border-white/5 hover:bg-white/10 hover:text-white transition-colors">
                            Voir
                          </button>
                        </div>
                        <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors flex items-center gap-4">
                          <i data-lucide="video" className="w-8 h-8 text-neutral-400"></i>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium text-white">interview_clean.mp4</p>
                            <p className="text-xs text-neutral-500">AutoCut • Hier</p>
                          </div>
                          <button className="px-3 py-1 rounded-md bg-white/5 text-xs text-neutral-400 border border-white/5 hover:bg-white/10 hover:text-white transition-colors">
                            Voir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Brands */}
          <div className="max-w-7xl mx-auto px-6 mt-20 pointer-events-auto">
            <p className="text-center text-sm text-neutral-500 mb-8 font-medium">UTILISÉ PAR DES CRÉATEURS INNOVANTS</p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 transition-all duration-500 hover:opacity-100">
              <div className="flex items-center gap-2 font-semibold text-xl text-white grayscale hover:grayscale-0 transition-all cursor-default">
                <div className="w-6 h-6 bg-white rounded-full"></div> Créateur Pro
              </div>
              <div className="flex items-center gap-2 font-semibold text-xl text-white grayscale hover:grayscale-0 transition-all cursor-default">
                <div className="w-6 h-6 bg-white rounded-tr-lg"></div> Studio Vidéo
              </div>
              <div className="flex items-center gap-2 font-semibold text-xl text-white grayscale hover:grayscale-0 transition-all cursor-default">
                <div className="w-6 h-6 border-2 border-white rounded-sm"></div> Media Agency
              </div>
              <div className="flex items-center gap-2 font-semibold text-xl text-white grayscale hover:grayscale-0 transition-all cursor-default">
                <div className="w-6 h-6 bg-white transform rotate-45"></div> Content Lab
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 border-t border-white/5 bg-neutral-900/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 md:text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">Tout ce dont vous avez besoin</h2>
              <p className="text-lg text-neutral-400">AutoRush fournit les outils essentiels pour préparer vos vidéos sans la complexité des logiciels de montage.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group p-8 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                  <i data-lucide="scissors" className="w-6 h-6 text-blue-400"></i>
                </div>
                <h3 className="text-xl font-medium text-white mb-3">AutoCut</h3>
                <p className="text-neutral-400 leading-relaxed">
                  Supprimez intelligemment les silences de vos vidéos. Notre algorithme détecte et coupe automatiquement les pauses inutiles.
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                  <i data-lucide="frame" className="w-6 h-6 text-blue-400"></i>
                </div>
                <h3 className="text-xl font-medium text-white mb-3">AutoFrame</h3>
                <p className="text-neutral-400 leading-relaxed">
                  Adaptez vos vidéos à différents formats (16:9, vertical, carré) avec ajustement automatique du cadrage et du regard.
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-green-500/20 transition-all duration-300">
                  <i data-lucide="zap" className="w-6 h-6 text-green-400"></i>
                </div>
                <h3 className="text-xl font-medium text-white mb-3">Traitement rapide</h3>
                <p className="text-neutral-400 leading-relaxed">
                  Obtenez des résultats en quelques secondes. Prêt à publier sans attendre.
                </p>
              </div>
            </div>
            
            {/* Code Section */}
            <div className="mt-6 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 overflow-hidden grid grid-cols-1 lg:grid-cols-2 group hover:border-white/20 transition-colors">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-2xl font-semibold text-white mb-4">Configurable facilement</h3>
                <p className="text-neutral-400 mb-8 leading-relaxed">
                  Ajustez les paramètres selon vos besoins. Interface intuitive avec prévisualisation en temps réel et réglages simples.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-sm text-neutral-300">
                    <i data-lucide="check" className="w-4 h-4 text-blue-500"></i>
                    Détection automatique des silences
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-300">
                    <i data-lucide="check" className="w-4 h-4 text-blue-500"></i>
                    Réglages personnalisables
                  </li>
                  <li className="flex items-center gap-3 text-sm text-neutral-300">
                    <i data-lucide="check" className="w-4 h-4 text-blue-500"></i>
                    Prévisualisation en temps réel
                  </li>
                </ul>
              </div>
              <div className="bg-black/20 border-l border-white/5 p-8 flex items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="w-full rounded-lg bg-[#0A0A0A] border border-white/5 p-4 font-mono text-sm overflow-x-auto shadow-2xl relative z-10 transition-transform group-hover:scale-[1.01] duration-500">
                  <div className="flex gap-1.5 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                  </div>
                  <div className="text-blue-400">const</div> <span className="text-blue-300">config</span> = <span className="text-white">{'{'}</span>
                  <div>&nbsp;&nbsp;<span className="text-blue-300">seuil</span>: <span className="text-orange-400">-40</span>,</div>
                  <div>&nbsp;&nbsp;<span className="text-blue-300">dureeMinimum</span>: <span className="text-orange-400">500</span>,</div>
                  <div>&nbsp;&nbsp;<span className="text-blue-300">padding</span>: <span className="text-orange-400">100</span>,</div>
                  <div>&nbsp;&nbsp;<span className="text-blue-300">format</span>: <span className="text-green-400">'mp4'</span>,</div>
                  <div>&nbsp;&nbsp;<span className="text-blue-300">qualite</span>: <span className="text-green-400">'high'</span></div>
                  <div className="text-white">{'}'}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/10 pointer-events-none"></div>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">Prêt à transformer votre workflow ?</h2>
            <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto">
              Rejoignez des centaines de créateurs qui utilisent AutoRush pour préparer leurs vidéos rapidement et efficacement.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-neutral-200 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center text-center">
                Commencer gratuitement
              </a>
              <a href="/contact" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/10 text-white font-medium rounded-full hover:bg-white/5 transition-all transform hover:scale-105 active:scale-95">
                Contacter l'équipe
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative pt-24 pb-12">
          <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
            <div className="absolute inset-0 backdrop-blur-3xl [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
              <div>
                <h4 className="text-base font-medium text-white mb-6">Plateforme</h4>
                <ul className="space-y-4">
                  <li><a href="/dashboard/autocut" className="text-sm text-neutral-500 hover:text-white transition-colors">AutoCut</a></li>
                  <li><a href="/dashboard/autoframe" className="text-sm text-neutral-500 hover:text-white transition-colors">AutoFrame</a></li>
                  <li><a href="/dashboard/videos" className="text-sm text-neutral-500 hover:text-white transition-colors">Mes vidéos</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-base font-medium text-white mb-6">Entreprise</h4>
                <ul className="space-y-4">
                  <li><a href="/about" className="text-sm text-neutral-500 hover:text-white transition-colors">À propos</a></li>
                  <li><a href="/blog" className="text-sm text-neutral-500 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="/careers" className="text-sm text-neutral-500 hover:text-white transition-colors">Carrières</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-base font-medium text-white mb-6">Ressources</h4>
                <ul className="space-y-4">
                  <li><a href="/docs" className="text-sm text-neutral-500 hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="/api" className="text-sm text-neutral-500 hover:text-white transition-colors">Référence API</a></li>
                  <li><a href="/status" className="text-sm text-neutral-500 hover:text-white transition-colors">Statut</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-base font-medium text-white mb-6">Légal</h4>
                <ul className="space-y-4">
                  <li><a href="/privacy" className="text-sm text-neutral-500 hover:text-white transition-colors">Confidentialité</a></li>
                  <li><a href="/terms" className="text-sm text-neutral-500 hover:text-white transition-colors">Conditions</a></li>
                  <li><a href="/cookies" className="text-sm text-neutral-500 hover:text-white transition-colors">Cookies</a></li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <div className="w-6 h-6 bg-white/10 rounded-md flex items-center justify-center border border-white/10">
                  <i data-lucide="zap" className="w-3 h-3 text-white"></i>
                </div>
                <span className="text-neutral-500 text-sm">© 2024 AutoRush</span>
              </div>
              <div className="flex gap-6">
                <a href="https://github.com/autorush" className="text-neutral-500 hover:text-white transition-colors">
                  <i data-lucide="github" className="w-4 h-4"></i>
                </a>
                <a href="https://twitter.com/autorush" className="text-neutral-500 hover:text-white transition-colors">
                  <i data-lucide="twitter" className="w-4 h-4"></i>
                </a>
                <a href="https://linkedin.com/company/autorush" className="text-neutral-500 hover:text-white transition-colors">
                  <i data-lucide="linkedin" className="w-4 h-4"></i>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
