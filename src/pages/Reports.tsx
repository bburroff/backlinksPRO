import { useState } from 'react'
import { SubmissionRecord, ArticleData, SiteData } from '../types'

interface ReportsProps {
  submissions: SubmissionRecord[]
  articles: ArticleData[]
  sites: SiteData[]
}

export default function Reports({ submissions }: ReportsProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSteps, setShowSteps] = useState<string | null>(null)

  const published = submissions.filter(s => s.status === 'published')
  const failed = submissions.filter(s => s.status === 'failed')
  const pending = submissions.filter(s => s.status !== 'published' && s.status !== 'failed')

  const filteredSubmissions = submissions.filter(s => {
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'published' && s.status === 'published') ||
      (filterStatus === 'failed' && s.status === 'failed') ||
      (filterStatus === 'pending' && s.status !== 'published' && s.status !== 'failed')
    const matchesSearch = s.articleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.siteName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const exportCSV = () => {
    const headers = ['Site', 'Article Title', 'Published URL', 'Backlink URL', 'Username', 'Status', 'Date']
    const rows = submissions.map(s => [
      s.siteName,
      `"${s.articleTitle}"`,
      s.publishedUrl,
      s.backlinkUrl,
      s.username,
      s.status,
      new Date(s.submittedAt).toLocaleDateString()
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `linkforge-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyAllLinks = () => {
    const links = published.map(s => s.publishedUrl).join('\n')
    navigator.clipboard.writeText(links)
  }

  return (
    <div className="animate-slide-in">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Reports</h1>
          <p className="text-slate-400 text-lg">Track all submissions and published article links</p>
        </div>
        <div className="flex gap-3">
          <button onClick={copyAllLinks} disabled={published.length === 0} className="btn-secondary-modern flex items-center gap-2 disabled:opacity-50">
            <i className="fa-solid fa-copy"></i>
            Copy URLs
          </button>
          <button onClick={exportCSV} disabled={submissions.length === 0} className="btn-modern flex items-center gap-2 disabled:opacity-50">
            <i className="fa-solid fa-download"></i>
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stat-card-modern">
          <div className="flex items-center gap-4">
            <div className="icon-container bg-gradient-to-br from-blue-500 to-cyan-600">
              <i className="fa-solid fa-paper-plane text-white"></i>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{submissions.length}</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Total Submissions</p>
            </div>
          </div>
        </div>
        <div className="stat-card-modern">
          <div className="flex items-center gap-4">
            <div className="icon-container bg-gradient-to-br from-green-500 to-emerald-600">
              <i className="fa-solid fa-check-circle text-white"></i>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{published.length}</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Published</p>
            </div>
          </div>
        </div>
        <div className="stat-card-modern">
          <div className="flex items-center gap-4">
            <div className="icon-container bg-gradient-to-br from-yellow-500 to-amber-600">
              <i className="fa-solid fa-clock text-white"></i>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{pending.length}</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">In Progress</p>
            </div>
          </div>
        </div>
        <div className="stat-card-modern">
          <div className="flex items-center gap-4">
            <div className="icon-container bg-gradient-to-br from-red-500 to-pink-600">
              <i className="fa-solid fa-xmark text-white"></i>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{failed.length}</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Failed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by site or article title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-modern flex-1"
        />
        <div className="flex gap-3">
          {['all', 'published', 'pending', 'failed'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-5 py-3 rounded-xl text-xs font-bold capitalize transition-all ${
                filterStatus === status
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg glow-purple'
                  : 'glass-card text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="empty-state-modern py-20">
            <i className="fa-solid fa-file-lines empty-state-icon-modern"></i>
            <p className="text-slate-400 text-lg font-semibold mb-2">No submissions yet</p>
            <p className="text-slate-500 text-sm">Deploy the agent to start submitting articles</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Site</th>
                  <th>Article</th>
                  <th>Published URL</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.slice().reverse().map((sub) => (
                  <>
                    <tr key={sub.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <i className="fa-solid fa-globe text-xs text-white"></i>
                          </div>
                          <div>
                            <span className="text-sm text-white font-bold block">{sub.siteName}</span>
                            <span className="text-xs text-slate-500">@{sub.username}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="text-sm text-slate-300 max-w-[200px] truncate font-medium">{sub.articleTitle}</p>
                      </td>
                      <td>
                        {sub.publishedUrl ? (
                          <a href={sub.publishedUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:underline max-w-[200px] truncate block font-medium">
                            {sub.publishedUrl.replace(/https?:\/\//, '').substring(0, 40)}...
                          </a>
                        ) : (
                          <span className="text-sm text-slate-500">—</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge-modern ${
                          sub.status === 'published' ? 'badge-success-modern' :
                          sub.status === 'failed' ? 'badge-error-modern' :
                          'badge-warning-modern'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm text-slate-400 font-medium">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          {sub.publishedUrl && (
                            <button
                              onClick={() => navigator.clipboard.writeText(sub.publishedUrl)}
                              className="text-slate-400 hover:text-white transition-all"
                              title="Copy URL"
                            >
                              <i className="fa-solid fa-copy"></i>
                            </button>
                          )}
                          {sub.steps && sub.steps.length > 0 && (
                            <button
                              onClick={() => setShowSteps(showSteps === sub.id ? null : sub.id)}
                              className="text-slate-400 hover:text-indigo-400 transition-all"
                              title="View steps"
                            >
                              <i className="fa-solid fa-list-check"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {showSteps === sub.id && sub.steps && (
                      <tr key={`${sub.id}-steps`}>
                        <td colSpan={6} className="p-6 bg-white/5">
                          <div className="space-y-2 font-mono text-xs max-h-60 overflow-y-auto">
                            {sub.steps.map((step, i) => (
                              <div key={i} className={`flex items-center gap-3 ${
                                step.status === 'success' ? 'text-green-400' :
                                step.status === 'error' ? 'text-red-400' :
                                step.status === 'warning' ? 'text-yellow-400' :
                                'text-slate-400'
                              }`}>
                                <span className="text-slate-600 font-semibold">{new Date(step.timestamp).toLocaleTimeString()}</span>
                                <span className="text-indigo-400 font-bold">[{step.action}]</span>
                                <span>{step.detail}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {published.length > 0 && (
        <div className="glass-card p-8 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="icon-container bg-gradient-to-br from-green-500 to-emerald-600">
              <i className="fa-solid fa-link text-white"></i>
            </div>
            <h3 className="section-title-modern">Published Article Links ({published.length})</h3>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {published.map((sub) => (
              <div key={sub.id} className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg glow-green">
                  <i className="fa-solid fa-circle-check text-white"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-bold truncate">{sub.articleTitle}</p>
                  <a href={sub.publishedUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline truncate block mt-1 font-medium">
                    {sub.publishedUrl}
                  </a>
                  <p className="text-xs text-slate-600 mt-1">Backlink → {sub.backlinkUrl}</p>
                </div>
                <span className="text-xs text-slate-500 font-semibold">{sub.siteName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
