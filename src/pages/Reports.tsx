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
    navigator.clipboard.writeText(published.map(s => s.publishedUrl).join('\n'))
  }

  return (
    <div className="animate-slide-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Analytics</span>
            <div className="h-px w-12" style={{ background: 'var(--accent)' }}></div>
          </div>
          <h1 className="display">Reports<span className="display-serif gradient-text">.</span></h1>
          <p className="mt-2 text-base" style={{ color: 'var(--text-muted)' }}>
            Track all submissions and published article links
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={copyAllLinks} disabled={published.length === 0} className="btn-secondary disabled:opacity-50">
            <i className="fa-solid fa-copy"></i>Copy URLs
          </button>
          <button onClick={exportCSV} disabled={submissions.length === 0} className="btn-primary disabled:opacity-50">
            <i className="fa-solid fa-download"></i>Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
              <i className="fa-solid fa-paper-plane text-white text-sm"></i>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>{submissions.length}</p>
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Total</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #22c55e, #10b981)' }}>
              <i className="fa-solid fa-check text-white text-sm"></i>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-green-600">{published.length}</p>
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Published</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
              <i className="fa-solid fa-clock text-white text-sm"></i>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-amber-600">{pending.length}</p>
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Pending</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}>
              <i className="fa-solid fa-xmark text-white text-sm"></i>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-red-600">{failed.length}</p>
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Failed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-faint)' }}></i>
          <input type="text" placeholder="Search submissions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input pl-11" />
        </div>
        <div className="flex gap-1 p-1 rounded-2xl" style={{ background: 'var(--bg-soft)' }}>
          {['all', 'published', 'pending', 'failed'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                filterStatus === status ? 'bg-white shadow-sm font-semibold' : 'hover:bg-white/50'
              }`}
              style={{ color: filterStatus === status ? 'var(--text)' : 'var(--text-muted)' }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {filteredSubmissions.length === 0 ? (
          <div className="empty-state py-16">
            <div className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--bg-soft)' }}>
              <i className="fa-solid fa-file-lines text-2xl" style={{ color: 'var(--text-faint)' }}></i>
            </div>
            <p className="font-semibold" style={{ color: 'var(--text-muted)' }}>No submissions yet</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-faint)' }}>Deploy the agent to start submitting articles</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--bg-soft)' }}>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Site</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Article</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Published URL</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.slice().reverse().map((sub) => (
                  <>
                    <tr key={sub.id} className="table-row">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-soft)' }}>
                            <i className="fa-solid fa-globe text-xs" style={{ color: 'var(--text-faint)' }}></i>
                          </div>
                          <div>
                            <span className="text-sm font-semibold block" style={{ color: 'var(--text)' }}>{sub.siteName}</span>
                            <span className="text-xs" style={{ color: 'var(--text-faint)' }}>@{sub.username}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm max-w-[200px] truncate" style={{ color: 'var(--text)' }}>{sub.articleTitle}</p>
                      </td>
                      <td className="px-6 py-4">
                        {sub.publishedUrl ? (
                          <a href={sub.publishedUrl} target="_blank" rel="noopener noreferrer" className="text-sm max-w-[200px] truncate block">
                            {sub.publishedUrl.replace(/https?:\/\//, '').substring(0, 40)}...
                          </a>
                        ) : (
                          <span className="text-sm" style={{ color: 'var(--text-faint)' }}>—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${
                          sub.status === 'published' ? 'badge-success' :
                          sub.status === 'failed' ? 'badge-error' :
                          'badge-warning'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {sub.publishedUrl && (
                            <button onClick={() => navigator.clipboard.writeText(sub.publishedUrl)} className="btn-ghost text-xs py-1 px-2" title="Copy URL">
                              <i className="fa-solid fa-copy"></i>
                            </button>
                          )}
                          {sub.steps && sub.steps.length > 0 && (
                            <button onClick={() => setShowSteps(showSteps === sub.id ? null : sub.id)} className="btn-ghost text-xs py-1 px-2" title="View steps">
                              <i className="fa-solid fa-list-check"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {showSteps === sub.id && sub.steps && (
                      <tr key={`${sub.id}-steps`}>
                        <td colSpan={6} className="px-6 py-4" style={{ background: 'var(--bg-soft)' }}>
                          <div className="space-y-1 font-mono text-xs max-h-48 overflow-y-auto">
                            {sub.steps.map((step, i) => (
                              <div key={i} className={`flex items-center gap-2 ${
                                step.status === 'success' ? 'text-green-600' :
                                step.status === 'error' ? 'text-red-600' :
                                step.status === 'warning' ? 'text-amber-600' :
                                ''
                              }`} style={step.status === 'info' ? { color: 'var(--text-muted)' } : {}}>
                                <span style={{ color: 'var(--text-faint)' }}>{new Date(step.timestamp).toLocaleTimeString()}</span>
                                <span style={{ color: 'var(--accent)' }}>[{step.action}]</span>
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

      {/* Published Links */}
      {published.length > 0 && (
        <div className="card-static p-6 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #22c55e, #10b981)' }}>
              <i className="fa-solid fa-link text-white text-sm"></i>
            </div>
            <h3 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>Published Links</h3>
            <span className="badge badge-success">{published.length}</span>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {published.map((sub) => (
              <div key={sub.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-soft)' }}>
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <i className="fa-solid fa-circle-check text-green-600 text-xs"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{sub.articleTitle}</p>
                  <a href={sub.publishedUrl} target="_blank" rel="noopener noreferrer" className="text-xs truncate block">{sub.publishedUrl}</a>
                </div>
                <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{sub.siteName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
