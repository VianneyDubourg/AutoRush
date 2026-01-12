"use client"

import { useEffect } from "react"
import Script from "next/script"

export default function Home() {
  useEffect(() => {
    // Initialize Lucide icons
    if (typeof window !== 'undefined' && (window as any).lucide) {
      (window as any).lucide.createIcons()
    }
  }, [])

  return (
    <>
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      <Script src="https://unpkg.com/lucide@latest" strategy="beforeInteractive" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      <html lang="fr" className="scroll-smooth">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>AutoRush | Préparez vos vidéos en quelques clics</title>
        </head>
        <body className="antialiased selection:bg-white/20" style={{
          fontFamily: "'Inter', sans-serif",
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
            #dashboard-wrapper {
              transition: transform 0.1s cubic-bezier(0, 0, 0.2, 1);
              position: relative;
              z-index: 40;
              touch-action: none;
            }
            #dashboard-wrapper.dragging {
              transition: none;
              cursor: grabbing;
              transform: scale(1.01);
            }
            .grab-handle { cursor: grab; }
            .grab-handle:active { cursor: grabbing; }
            .sidebar-item.active {
              background: rgba(255,255,255,0.08);
              color: white;
              border-color: rgba(255,255,255,0.08);
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
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px]"></div>
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
                <a href="/register" className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-medium rounded-full hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95">
                  Commencer gratuitement
                  <i data-lucide="arrow-right" className="w-4 h-4"></i>
                </a>
                <a href="/docs" className="w-full sm:w-auto px-8 py-3.5 bg-white/5 text-white border border-white/10 font-medium rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95">
                  <i data-lucide="book-open" className="w-4 h-4 text-neutral-400"></i>
                  Documentation
                </a>
              </div>

              {/* Draggable Dashboard Mockup - Structure exacte du template */}
              <div className="relative max-w-5xl mx-auto pointer-events-auto perspective-1000">
                <div id="dashboard-wrapper" className="glass-panel rounded-xl overflow-hidden shadow-2xl glow-effect select-none transform-gpu transition-all duration-75">
                  <div id="drag-handle" className="grab-handle h-10 bg-black/40 border-b border-white/5 flex items-center px-4 gap-2 group">
                    <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50 hover:bg-red-500 transition-colors cursor-pointer"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50 hover:bg-yellow-500 transition-colors cursor-pointer"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50 hover:bg-green-500 transition-colors cursor-pointer"></div>
                    </div>
                    <div className="ml-4 flex items-center gap-2 px-3 py-1 bg-white/5 rounded text-xs text-neutral-500 font-mono hover:bg-white/10 hover:text-neutral-300 transition-colors cursor-text group/url">
                      <i data-lucide="lock" className="w-3 h-3 group-hover/url:text-green-400 transition-colors"></i>
                      autorush.fr/dashboard
                    </div>
                    <div className="ml-auto text-xs text-neutral-600 font-medium">Glisser pour déplacer</div>
                  </div>
                  
                  <div className="flex h-[500px] bg-black/80">
                    <div className="w-64 border-r border-white/5 p-4 flex flex-col gap-1 hidden md:flex bg-black/20">
                      <div className="flex items-center gap-2 px-3 py-2 text-white bg-white/5 rounded-lg border border-white/5 mb-4 hover:border-white/20 cursor-pointer transition-colors">
                        <div className="w-5 h-5 bg-gradient-to-tr from-purple-500 to-blue-500 rounded flex items-center justify-center text-[10px] font-bold shadow-lg">AR</div>
                        <span className="text-sm font-medium">AutoRush</span>
                        <i data-lucide="chevron-down" className="w-3 h-3 ml-auto text-neutral-500"></i>
                      </div>
                      
                      <div className="space-y-0.5" id="sidebar-menu">
                        <div onClick={() => setActiveTab('overview')} className="sidebar-item active px-3 py-2 text-sm text-neutral-400 hover:text-white rounded-md flex items-center gap-3 transition-all cursor-pointer border border-transparent">
                          <i data-lucide="layout-grid" className="w-4 h-4"></i>
                          Vue d'ensemble
                        </div>
                        <div onClick={() => setActiveTab('analytics')} className="sidebar-item px-3 py-2 text-sm text-neutral-400 hover:text-white rounded-md flex items-center gap-3 transition-all cursor-pointer border border-transparent">
                          <i data-lucide="scissors" className="w-4 h-4"></i>
                          AutoCut
                        </div>
                        <div onClick={() => setActiveTab('deployments')} className="sidebar-item px-3 py-2 text-sm text-neutral-400 hover:text-white rounded-md flex items-center gap-3 transition-all cursor-pointer border border-transparent">
                          <i data-lucide="frame" className="w-4 h-4"></i>
                          AutoFrame
                        </div>
                        <div onClick={() => setActiveTab('team')} className="sidebar-item px-3 py-2 text-sm text-neutral-400 hover:text-white rounded-md flex items-center gap-3 transition-all cursor-pointer border border-transparent">
                          <i data-lucide="video" className="w-4 h-4"></i>
                          Mes vidéos
                        </div>
                        <div onClick={() => setActiveTab('settings')} className="sidebar-item px-3 py-2 text-sm text-neutral-400 hover:text-white rounded-md flex items-center gap-3 transition-all cursor-pointer border border-transparent mt-4">
                          <i data-lucide="settings" className="w-4 h-4"></i>
                          Paramètres
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-6 overflow-y-auto">
                      <div id="overview" className="view-content active">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl font-semibold text-white">Vue d'ensemble</h2>
                          <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors flex items-center gap-2">
                              Dernières 24h
                              <i data-lucide="chevron-down" className="w-3 h-3"></i>
                            </button>
                            <button className="p-1.5 text-neutral-400 hover:text-white bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                              <i data-lucide="more-vertical" className="w-4 h-4"></i>
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                          <div className="bg-white/5 rounded-lg border border-white/5 p-4">
                            <div className="flex items-center justify-between mb-2">
                              <i data-lucide="trending-up" className="w-4 h-4 text-green-400"></i>
                              <span className="text-xs font-medium text-green-400 flex items-center gap-1">
                                +23%
                                <i data-lucide="arrow-up" className="w-3 h-3"></i>
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">127</div>
                            <div className="text-xs text-neutral-400">Vidéos traitées</div>
                          </div>
                          <div className="bg-white/5 rounded-lg border border-white/5 p-4">
                            <div className="flex items-center justify-between mb-2">
                              <i data-lucide="clock" className="w-4 h-4 text-blue-400"></i>
                              <span className="text-xs font-medium text-green-400 flex items-center gap-1">
                                +15%
                                <i data-lucide="arrow-up" className="w-3 h-3"></i>
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">8h 42m</div>
                            <div className="text-xs text-neutral-400">Temps économisé</div>
                          </div>
                          <div className="bg-white/5 rounded-lg border border-white/5 p-4">
                            <div className="flex items-center justify-between mb-2">
                              <i data-lucide="activity" className="w-4 h-4 text-purple-400"></i>
                              <span className="text-xs font-medium text-neutral-400">Stable</span>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">98%</div>
                            <div className="text-xs text-neutral-400">Satisfaction</div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-semibold text-white mb-4">Activité récente</h3>
                          <div className="bg-white/5 rounded-lg border border-white/5 p-4">
                            <div className="text-sm text-neutral-400">240 vidéos/heure</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Rest of sections... */}
          <Script id="dashboard-script" strategy="afterInteractive">
            {`
              if (typeof lucide !== 'undefined') lucide.createIcons();
              
              let isDragging = false, currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;
              const dashboardWrapper = document.getElementById('dashboard-wrapper');
              const dragHandle = document.getElementById('drag-handle');
              
              if (dragHandle && dashboardWrapper) {
                dragHandle.addEventListener('mousedown', dragStart);
                dragHandle.addEventListener('touchstart', dragStart);
                document.addEventListener('mousemove', drag);
                document.addEventListener('touchmove', drag);
                document.addEventListener('mouseup', dragEnd);
                document.addEventListener('touchend', dragEnd);
              }
              
              function dragStart(e) {
                if (e.type === "touchstart") {
                  initialX = e.touches[0].clientX - xOffset;
                  initialY = e.touches[0].clientY - yOffset;
                } else {
                  initialX = e.clientX - xOffset;
                  initialY = e.clientY - yOffset;
                }
                if (e.target === dragHandle || dragHandle.contains(e.target)) {
                  isDragging = true;
                  dashboardWrapper.classList.add('dragging');
                }
              }
              
              function drag(e) {
                if (isDragging) {
                  e.preventDefault();
                  if (e.type === "touchmove") {
                    currentX = e.touches[0].clientX - initialX;
                    currentY = e.touches[0].clientY - initialY;
                  } else {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                  }
                  xOffset = currentX;
                  yOffset = currentY;
                  dashboardWrapper.style.transform = \`translate3d(\${currentX}px, \${currentY}px, 0)\`;
                }
              }
              
              function dragEnd(e) {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
                dashboardWrapper.classList.remove('dragging');
              }
              
              function setActiveTab(viewName) {
                document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
                event?.target?.closest('.sidebar-item')?.classList.add('active');
                document.querySelectorAll('.view-content').forEach(view => view.classList.remove('active'));
                document.getElementById(viewName)?.classList.add('active');
              }
              
              window.setActiveTab = setActiveTab;
            `}
          </Script>
        </body>
      </html>
    </>
  )
}
