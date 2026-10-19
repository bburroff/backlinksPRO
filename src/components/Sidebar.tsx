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
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i className="fa-solid fa-link text-white text-lg"></i>
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">LinkForge</h1>
            <p className="text-xs text-slate-400">Article Automation</p>
          </div>
        </div>
      </div>

      {agentRunning && (
        <div className="mx-4 mt-4 p-3 bg-green-900/30 border border-green-700/50 rounded-lg agent-active">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">Agent Active</span>
          </div>
          <p className="text-xs text-green-300/70 mt-1">Processing submissions...</p>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              currentPage === item.id
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-user text-sm text-white"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">User</p>
            <p className="text-xs text-slate-500">Pro Plan</p>
          </div>
        </div>
        <p className="text-center text-xs text-slate-600">LinkForge v2.0</p>
      </div>
    </aside>
  )
}
