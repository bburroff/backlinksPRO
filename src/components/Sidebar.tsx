import { Page } from '../App'

interface SidebarProps {
  currentPage: Page
  setCurrentPage: (page: Page) => void
  agentRunning: boolean
}

export default function Sidebar({ currentPage, setCurrentPage, agentRunning }: SidebarProps) {
  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-gauge-high' },
    { id: 'sites', label: 'Article Sites', icon: 'fa-globe' },
    { id: 'evaluator', label: 'Site Evaluator', icon: 'fa-wand-magic-sparkles' },
    { id: 'generator', label: 'AI Writer', icon: 'fa-feather' },
    { id: 'agent', label: 'Deploy Agent', icon: 'fa-rocket' },
    { id: 'reports', label: 'Reports', icon: 'fa-chart-simple' },
  ]

  return (
    <aside className="sidebar w-72 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)'
          }}>
            <i className="fa-solid fa-link text-white text-base"></i>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>LinkForge</h1>
            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Article Automation</p>
          </div>
        </div>
      </div>

      {/* Agent Status */}
      {agentRunning && (
        <div className="mx-4 mb-4 p-3 rounded-2xl agent-active border" style={{ borderColor: 'rgba(34, 197, 94, 0.3)' }}>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full pulse-dot"></div>
            </div>
            <span className="text-xs font-semibold text-green-700">Agent Active</span>
          </div>
          <p className="text-xs text-green-600/80 mt-1">Processing submissions...</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`nav-item w-full ${currentPage === item.id ? 'active' : ''}`}
          >
            <i className={`fa-solid ${item.icon} w-5 text-center text-sm`}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-black/5 transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)'
          }}>
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>User</p>
            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Pro Plan</p>
          </div>
          <i className="fa-solid fa-ellipsis text-slate-400 text-xs"></i>
        </div>
      </div>
    </aside>
  )
}
