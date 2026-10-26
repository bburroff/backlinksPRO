import { Page } from '../App'

interface SidebarProps {
  currentPage: Page
  setCurrentPage: (page: Page) => void
  agentRunning: boolean
}

export default function Sidebar({ currentPage, setCurrentPage, agentRunning }: SidebarProps) {
  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'sites', label: 'Article Sites', icon: 'fa-globe' },
    { id: 'evaluator', label: 'Site Evaluator', icon: 'fa-magnifying-glass-chart' },
    { id: 'generator', label: 'AI Writer', icon: 'fa-robot' },
    { id: 'agent', label: 'Deploy Agent', icon: 'fa-rocket' },
    { id: 'reports', label: 'Reports', icon: 'fa-file-lines' },
  ]

  return (
    <aside className="w-72 glass-card border-r border-white/10 flex flex-col" style={{ borderRadius: 0 }}>
      <div className="p-8 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg glow-purple">
            <i className="fa-solid fa-link text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">LinkForge</h1>
            <p className="text-xs text-slate-400 mt-0.5">Article Automation</p>
          </div>
        </div>
      </div>

      {agentRunning && (
        <div className="mx-6 mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl agent-active">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-300 font-semibold">Agent Active</span>
          </div>
          <p className="text-xs text-green-300/70 mt-2">Processing submissions...</p>
        </div>
      )}

      <nav className="flex-1 p-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all ${
              currentPage === item.id
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-400/30 shadow-lg glow-purple'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-6 text-center text-lg`}></i>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-white/10">
        <div className="flex items-center gap-4 px-4 py-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <i className="fa-solid fa-user text-sm text-white"></i>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">User</p>
            <p className="text-xs text-slate-400">Pro Plan</p>
          </div>
        </div>
        <p className="text-center text-xs text-slate-500">LinkForge v2.0</p>
      </div>
    </aside>
  )
}
