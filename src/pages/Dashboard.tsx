import { useState } from 'react'
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
    { label: 'Articles Generated', value: articles.length, icon: 'fa-file-pen', color: 'from-purple-500 to-pink-500' },
    { label: 'Published', value: publishedCount, icon: 'fa-check-circle', color: 'from-green-500 to-emerald-500' },
    { label: 'Success Rate', value: `${successRate}%`, icon: 'fa-chart-line', color: 'from-orange-500 to-amber-500' },
  ]

  return (
    <div className="animate-slide-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Overview of your article submission automation</p>
      </div>

      {agentRunning && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700/50 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-robot text-green-400 text-xl animate-pulse"></i>
          </div>
          <div>
            <h3 className="text-green-400 font-semibold">Agent is Running</h3>
            <p className="text-green-300/70 text-sm">Processing bulk submissions across article sites...</p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Active</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <i className={`fa-solid ${stat.icon} text-white text-sm`}></i>
              </div>
              <span className="text-2xl font-bold text-white">{stat.value}</span>
            </div>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-clock-rotate-left text-indigo-400"></i>
            Recent Submissions
          </h3>
          {submissions.length === 0 ? (
            <div className="text-center py-8">
              <i className="fa-solid fa-inbox text-4xl text-slate-600 mb-3"></i>
              <p className="text-slate-500">No submissions yet</p>
              <p className="text-slate-600 text-sm">Deploy the agent to start submitting articles</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
              {submissions.slice(-8).reverse().map((sub) => (
                <div key={sub.id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    sub.status === 'published' ? 'bg-green-400' :
                    sub.status === 'failed' ? 'bg-red-400' :
                    'bg-yellow-400 animate-pulse'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 truncate">{sub.articleTitle}</p>
                    <p className="text-xs text-slate-500">{sub.siteName} • {new Date(sub.submittedAt).toLocaleTimeString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    sub.status === 'published' ? 'bg-green-900/50 text-green-400' :
                    sub.status === 'failed' ? 'bg-red-900/50 text-red-400' :
                    'bg-yellow-900/50 text-yellow-400'
                  }`}>{sub.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submission Status */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-chart-pie text-purple-400"></i>
            Submission Status
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Published</span>
                <span className="text-green-400">{publishedCount}</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${totalSubmissions ? (publishedCount / totalSubmissions) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Pending</span>
                <span className="text-yellow-400">{pendingCount}</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full transition-all" style={{ width: `${totalSubmissions ? (pendingCount / totalSubmissions) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Failed</span>
                <span className="text-red-400">{failedCount}</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${totalSubmissions ? (failedCount / totalSubmissions) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
            <h4 className="text-sm font-medium text-slate-300 mb-3">Top Sites by DA</h4>
            <div className="space-y-2">
              {[...sites].sort((a, b) => b.da - a.da).slice(0, 5).map((site, i) => (
                <div key={site.id} className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-4">{i + 1}.</span>
                  <span className="text-sm text-slate-300 flex-1">{site.name}</span>
                  <div className="w-20 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${site.da}%` }}></div>
                  </div>
                  <span className="text-xs text-indigo-400 w-6 text-right">{site.da}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
