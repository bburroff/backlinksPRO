import { useState } from 'react'
import { SubmissionRecord, ArticleData, SiteData } from '../types'

interface ReportsProps {
  submissions: SubmissionRecord[]
  articles: ArticleData[]
  sites: SiteData[]
}

export default function Reports({ submissions, articles, sites }: ReportsProps) {
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

  const copyAllBacklinks = () => {
    const links = published.map(s => `${s.publishedUrl} → ${s.backlinkUrl}`).join('\n')
    navigator.clipboard.writeText(links)
  }

  return (
    <div className="animate-slide-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
          <p className="text-slate-400">Track all submissions and published article links</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={copyAllLinks}
            disabled={published.length === 0}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 disabled:opacity-50 transition-colors text-sm font-medium"
          >
            <i className="fa-solid fa-copy mr-2"></i>
            Copy URLs
          </button>
          <button
            onClick={copyAllBacklinks}
            disabled={published.length === 0}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 disabled:opacity-50 transition-colors text-sm font-medium"
          >
            <i className="fa-solid fa-link mr-2"></i>
            Copy Backlinks
          </button>
          <button
            onClick={exportCSV}
            disabled={submissions.length === 0}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-colors text-sm font-medium"
          >
            <i className="fa-solid fa-download mr-2"></i>
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-paper-plane text-blue-400"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{submissions.length}</p>
              <p className="text-xs text-slate-400">Total Submissions</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-check-circle text-green-400"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{published.length}</p>
              <p className="text-xs text-slate-400">Published</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-clock text-yellow-400"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{pending.length}</p>
              <p className="text-xs text-slate-400">In Progress</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-xmark text-red-400"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{failed.length}</p>
              <p className="text-xs text-slate-400">Failed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by site or article title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
        />
        <div className="flex gap-2">
          {['all', 'published', 'pending', 'failed'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-16">
            <i className="fa-solid fa-file-lines text-5xl text-slate-600 mb-4"></i>
            <p className="text-slate-500 text-lg">No submissions yet</p>
            <p className="text-slate-600 text-sm mt-1">Deploy the agent to start submitting articles and see results here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Site</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Article</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Published URL</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredSubmissions.slice().reverse().map((sub) => (
                  <>
                    <tr key={sub.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center">
                            <i className="fa-solid fa-globe text-xs text-slate-400"></i>
                          </div>
                          <div>
                            <span className="text-sm text-white font-medium block">{sub.siteName}</span>
                            <span className="text-xs text-slate-500">@{sub.username}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-300 max-w-[200px] truncate">{sub.articleTitle}</p>
                      </td>
                      <td className="px-6 py-4">
                        {sub.publishedUrl ? (
                          <a href={sub.publishedUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-400 hover:underline max-w-[200px] truncate block">
                            {sub.publishedUrl.replace(/https?:\/\//, '').substring(0, 40)}...
                          </a>
                        ) : (
                          <span className="text-sm text-slate-500">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          sub.status === 'published' ? 'bg-green-900/50 text-green-400 border border-green-700/30' :
                          sub.status === 'failed' ? 'bg-red-900/50 text-red-400 border border-red-700/30' :
                          'bg-yellow-900/50 text-yellow-400 border border-yellow-700/30'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-400">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {sub.publishedUrl && (
                            <button
                              onClick={() => navigator.clipboard.writeText(sub.publishedUrl)}
                              className="text-slate-400 hover:text-white transition-colors"
                              title="Copy URL"
                            >
                              <i className="fa-solid fa-copy text-xs"></i>
                            </button>
                          )}
                          {sub.steps && sub.steps.length > 0 && (
                            <button
                              onClick={() => setShowSteps(showSteps === sub.id ? null : sub.id)}
                              className="text-slate-400 hover:text-indigo-400 transition-colors"
                              title="View steps"
                            >
                              <i className="fa-solid fa-list-check text-xs"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {showSteps === sub.id && sub.steps && (
                      <tr key={`${sub.id}-steps`}>
                        <td colSpan={6} className="px-6 py-4 bg-slate-900/50">
                          <div className="space-y-1 font-mono text-xs max-h-48 overflow-y-auto scrollbar-thin">
                            {sub.steps.map((step, i) => (
                              <div key={i} className={`flex items-center gap-2 ${
                                step.status === 'success' ? 'text-green-400' :
                                step.status === 'error' ? 'text-red-400' :
                                step.status === 'warning' ? 'text-yellow-400' :
                                'text-slate-400'
                              }`}>
                                <span className="text-slate-600">{new Date(step.timestamp).toLocaleTimeString()}</span>
                                <span className="text-indigo-400">[{step.action}]</span>
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

      {/* Published Links Summary */}
      {published.length > 0 && (
        <div className="mt-6 bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-link text-green-400"></i>
            Published Article Links ({published.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
            {published.map((sub) => (
              <div key={sub.id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                <i className="fa-solid fa-circle-check text-green-400"></i>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 truncate">{sub.articleTitle}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <a href={sub.publishedUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline truncate">
                      {sub.publishedUrl}
                    </a>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">Backlink → {sub.backlinkUrl}</p>
                </div>
                <span className="text-xs text-slate-500">{sub.siteName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
