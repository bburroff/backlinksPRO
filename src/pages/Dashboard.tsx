import { SiteData, ArticleData, SubmissionRecord } from '../types'

interface DashboardProps {
  sites: SiteData[]
  articles: ArticleData[]
  submissions: SubmissionRecord[]
  agentRunning: boolean
}

export default function Dashboard({ sites, articles, submissions, agentRunning }: DashboardProps) {
  const totalSubmissions = submissions.length
  const publishedCount = submissions.filter(s => s.status === 'published').length
  const pendingCount = submissions.filter(s => s.status !== 'published' && s.status !== 'failed').length
  const failedCount = submissions.filter(s => s.status === 'failed').length
  const successRate = totalSubmissions > 0 ? Math.round((publishedCount / totalSubmissions) * 100) : 0

  const stats = [
    { label: 'Article Sites', value: sites.filter(s => s.status === 'active').length, icon: 'fa-globe', color: 'from-blue-500 to-cyan-500' },
    { label: 'Articles Generated', value: articles.length, icon: 'fa-feather', color: 'from-purple-500 to-pink-500' },
    { label: 'Published', value: publishedCount, icon: 'fa-check', color: 'from-green-500 to-emerald-500' },
    { label: 'Success Rate', value: `${successRate}%`, icon: 'fa-chart-line', color: 'from-orange-500 to-amber-500' },
  ]

  return (
    <div className="animate-slide-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Overview</span>
          <div className="h-px flex-1" style={{ background: 'var(--border)' }}></div>
        </div>
        <h1 className="display">
          Welcome back<span className="display-serif gradient-text">.</span>
        </h1>
        <p className="mt-3 text-base" style={{ color: 'var(--text-muted)' }}>
          Here's what's happening with your article automation today.
        </p>
      </div>

      {/* Agent Banner */}
      {agentRunning && (
        <div className="mb-8 p-5 rounded-3xl agent-active border flex items-center gap-4" style={{ borderColor: 'rgba(34, 197, 94, 0.3)' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(34, 197, 94, 0.15)' }}>
            <i className="fa-solid fa-robot text-green-600 text-lg"></i>
          </div>
          <div className="flex-1">
            <h3 className="text-green-800 font-semibold">Agent is Running</h3>
            <p className="text-green-700/80 text-sm">Processing bulk submissions across article sites...</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full pulse-dot"></div>
            </div>
            <span className="text-green-700 text-sm font-semibold">Active</span>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <i className={`fa-solid ${stat.icon} text-white text-sm`}></i>
              </div>
              <i className="fa-solid fa-arrow-up-right text-xs" style={{ color: 'var(--text-faint)' }}></i>
            </div>
            <p className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>{stat.value}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recent Activity - 3 cols */}
        <div className="card-static p-6 lg:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>Recent Submissions</h3>
              <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>Latest activity from your agent</p>
            </div>
            <button className="btn-ghost text-xs">View all</button>
          </div>
          
          {submissions.length === 0 ? (
            <div className="empty-state py-12">
              <div className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--bg-soft)' }}>
                <i className="fa-solid fa-inbox text-2xl" style={{ color: 'var(--text-faint)' }}></i>
              </div>
              <p className="font-semibold" style={{ color: 'var(--text-muted)' }}>No submissions yet</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-faint)' }}>Deploy the agent to start submitting articles</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {submissions.slice(-8).reverse().map((sub) => (
                <div key={sub.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-black/[0.02] transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    sub.status === 'published' ? 'bg-green-100' :
                    sub.status === 'failed' ? 'bg-red-100' :
                    'bg-amber-100'
                  }`}>
                    <i className={`fa-solid ${
                      sub.status === 'published' ? 'fa-check text-green-600' :
                      sub.status === 'failed' ? 'fa-xmark text-red-600' :
                      'fa-clock text-amber-600'
                    } text-xs`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{sub.articleTitle}</p>
                    <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{sub.siteName} • {new Date(sub.submittedAt).toLocaleTimeString()}</p>
                  </div>
                  <span className={`badge ${
                    sub.status === 'published' ? 'badge-success' :
                    sub.status === 'failed' ? 'badge-error' :
                    'badge-warning'
                  }`}>{sub.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          {/* Progress Card */}
          <div className="card-static p-6">
            <h3 className="text-lg font-bold tracking-tight mb-5" style={{ color: 'var(--text)' }}>Submission Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium" style={{ color: 'var(--text)' }}>Published</span>
                  <span className="font-bold text-green-600">{publishedCount}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${totalSubmissions ? (publishedCount / totalSubmissions) * 100 : 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium" style={{ color: 'var(--text)' }}>Pending</span>
                  <span className="font-bold text-amber-600">{pendingCount}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill progress-fill-cool" style={{ width: `${totalSubmissions ? (pendingCount / totalSubmissions) * 100 : 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium" style={{ color: 'var(--text)' }}>Failed</span>
                  <span className="font-bold text-red-600">{failedCount}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${totalSubmissions ? (failedCount / totalSubmissions) * 100 : 0}%`, background: 'linear-gradient(90deg, #ef4444, #f97316)' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Sites */}
          <div className="card-static p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4" style={{ color: 'var(--text)' }}>Top Sites by DA</h3>
            <div className="space-y-3">
              {[...sites].sort((a, b) => b.da - a.da).slice(0, 5).map((site, i) => (
                <div key={site.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold" style={{ 
                    background: i === 0 ? 'linear-gradient(135deg, #7c3aed, #ec4899)' : 'var(--bg-soft)',
                    color: i === 0 ? 'white' : 'var(--text-muted)'
                  }}>{i + 1}</span>
                  <span className="text-sm font-medium flex-1 truncate" style={{ color: 'var(--text)' }}>{site.name}</span>
                  <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: 'var(--bg-soft)', color: 'var(--accent)' }}>DA {site.da}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
