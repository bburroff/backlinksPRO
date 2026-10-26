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
    { label: 'Article Sites', value: sites.filter(s => s.status === 'active').length, icon: 'fa-globe', gradient: 'from-blue-500 to-cyan-500', glow: 'glow-blue' },
    { label: 'Articles Generated', value: articles.length, icon: 'fa-file-pen', gradient: 'from-purple-500 to-pink-500', glow: 'glow-purple' },
    { label: 'Published', value: publishedCount, icon: 'fa-check-circle', gradient: 'from-green-500 to-emerald-500', glow: 'glow-green' },
    { label: 'Success Rate', value: `${successRate}%`, icon: 'fa-chart-line', gradient: 'from-orange-500 to-amber-500', glow: 'glow-pink' },
  ]

  return (
    <div className="animate-slide-in">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Dashboard</h1>
        <p className="text-slate-400 text-lg">Overview of your article submission automation</p>
      </div>

      {agentRunning && (
        <div className="mb-8 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-3xl flex items-center gap-6 backdrop-blur-xl agent-active">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg glow-green">
            <i className="fa-solid fa-robot text-white text-2xl animate-pulse"></i>
          </div>
          <div className="flex-1">
            <h3 className="text-green-300 font-bold text-xl">Agent is Running</h3>
            <p className="text-green-300/70 text-sm mt-1">Processing bulk submissions across article sites...</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 font-semibold">Active</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card-modern">
            <div className="flex items-center justify-between mb-4">
              <div className={`icon-container bg-gradient-to-br ${stat.gradient} ${stat.glow}`}>
                <i className={`fa-solid ${stat.icon} text-white text-lg`}></i>
              </div>
              <span className="text-3xl font-bold text-white">{stat.value}</span>
            </div>
            <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="icon-container bg-gradient-to-br from-indigo-500 to-purple-600">
              <i className="fa-solid fa-clock-rotate-left text-white"></i>
            </div>
            <h3 className="section-title-modern">Recent Submissions</h3>
          </div>
          {submissions.length === 0 ? (
            <div className="empty-state-modern">
              <i className="fa-solid fa-inbox empty-state-icon-modern"></i>
              <p className="text-slate-400 text-lg font-semibold mb-2">No submissions yet</p>
              <p className="text-slate-500 text-sm">Deploy the agent to start submitting articles</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {submissions.slice(-8).reverse().map((sub) => (
                <div key={sub.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                  <div className={`w-3 h-3 rounded-full ${
                    sub.status === 'published' ? 'bg-green-400 shadow-lg glow-green' :
                    sub.status === 'failed' ? 'bg-red-400' :
                    'bg-yellow-400 animate-pulse'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-semibold truncate">{sub.articleTitle}</p>
                    <p className="text-xs text-slate-500 mt-1">{sub.siteName} • {new Date(sub.submittedAt).toLocaleTimeString()}</p>
                  </div>
                  <span className={`badge-modern ${
                    sub.status === 'published' ? 'badge-success-modern' :
                    sub.status === 'failed' ? 'badge-error-modern' :
                    'badge-warning-modern'
                  }`}>{sub.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="icon-container bg-gradient-to-br from-purple-500 to-pink-600">
              <i className="fa-solid fa-chart-pie text-white"></i>
            </div>
            <h3 className="section-title-modern">Submission Status</h3>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400 font-medium">Published</span>
                <span className="text-green-400 font-bold">{publishedCount}</span>
              </div>
              <div className="progress-modern">
                <div className="progress-fill-modern bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${totalSubmissions ? (publishedCount / totalSubmissions) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400 font-medium">Pending</span>
                <span className="text-yellow-400 font-bold">{pendingCount}</span>
              </div>
              <div className="progress-modern">
                <div className="progress-fill-modern bg-gradient-to-r from-yellow-500 to-amber-500" style={{ width: `${totalSubmissions ? (pendingCount / totalSubmissions) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400 font-medium">Failed</span>
                <span className="text-red-400 font-bold">{failedCount}</span>
              </div>
              <div className="progress-modern">
                <div className="progress-fill-modern bg-gradient-to-r from-red-500 to-pink-500" style={{ width: `${totalSubmissions ? (failedCount / totalSubmissions) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-5 bg-white/5 rounded-2xl">
            <h4 className="text-sm font-bold text-white mb-4">Top Sites by DA</h4>
            <div className="space-y-3">
              {[...sites].sort((a, b) => b.da - a.da).slice(0, 5).map((site, i) => (
                <div key={site.id} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-6 font-bold">{i + 1}</span>
                  <span className="text-sm text-slate-300 flex-1 font-medium">{site.name}</span>
                  <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${site.da}%` }}></div>
                  </div>
                  <span className="text-xs text-indigo-400 w-8 text-right font-bold">{site.da}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
