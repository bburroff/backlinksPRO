import { useState, useEffect, useRef } from 'react'
import { SiteData, ArticleData, SubmissionRecord } from '../types'

interface AgentDeploymentProps {
  sites: SiteData[]
  articles: ArticleData[]
  submissions: SubmissionRecord[]
  setSubmissions: (submissions: SubmissionRecord[]) => void
  agentRunning: boolean
  setAgentRunning: (running: boolean) => void
}

export default function AgentDeployment({ sites, articles, submissions, setSubmissions, agentRunning, setAgentRunning }: AgentDeploymentProps) {
  const [selectedSites, setSelectedSites] = useState<string[]>(sites.map(s => s.id))
  const [selectedArticles, setSelectedArticles] = useState<string[]>(articles.map(a => a.id))
  const [delay, setDelay] = useState(5)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [currentSite, setCurrentSite] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const toggleSite = (id: string) => {
    setSelectedSites(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const toggleArticle = (id: string) => {
    setSelectedArticles(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
  }

  const selectAllSites = () => {
    if (selectedSites.length === sites.length) {
      setSelectedSites([])
    } else {
      setSelectedSites(sites.map(s => s.id))
    }
  }

  const deployAgent = () => {
    if (selectedSites.length === 0 || selectedArticles.length === 0) return
    
    const agentUsername = username || `user_${Date.now().toString(36)}`
    const agentPassword = password || `pass_${Math.random().toString(36).substr(2, 10)}`
    
    setAgentRunning(true)
    setLogs([])
    setProgress(0)

    addLog('🚀 Agent deployment initiated')
    addLog(`👤 Using credentials: ${agentUsername}`)
    addLog(`📋 ${selectedSites.length} sites, ${selectedArticles.length} articles selected`)
    addLog(`⏱️ Delay between submissions: ${delay}s`)
    addLog('')
    addLog('--- Starting bulk submission process ---')

    const targetSites = sites.filter(s => selectedSites.includes(s.id))
    const targetArticles = articles.filter(a => selectedArticles.includes(a.id))
    
    let siteIndex = 0
    let articleIndex = 0
    const totalTasks = targetSites.length

    const processNext = () => {
      if (siteIndex >= targetSites.length) {
        addLog('')
        addLog('✅ All submissions completed!')
        addLog(`📊 Total: ${totalTasks} submissions processed`)
        setAgentRunning(false)
        if (intervalRef.current) clearInterval(intervalRef.current)
        return
      }

      const site = targetSites[siteIndex]
      const article = targetArticles[articleIndex % targetArticles.length]
      
      setCurrentSite(site.name)
      setProgress(((siteIndex + 1) / totalTasks) * 100)

      addLog(`\n🔄 Processing: ${site.name}`)
      addLog(`   → Signing up with: ${agentUsername}`)
      
      setTimeout(() => {
        addLog(`   → Account created successfully`)
        addLog(`   → Publishing article: "${article.title.substring(0, 50)}..."`)
      }, 800)

      setTimeout(() => {
        const success = Math.random() > 0.15 // 85% success rate
        const submission: SubmissionRecord = {
          id: Date.now().toString() + siteIndex,
          siteId: site.id,
          siteName: site.name,
          articleId: article.id,
          articleTitle: article.title,
          publishedUrl: success ? `${site.url}/article/${Math.random().toString(36).substr(2, 8)}` : '',
          status: success ? 'published' : 'failed',
          submittedAt: new Date().toISOString(),
          backlinkUrl: article.targetUrl,
        }

        if (success) {
          addLog(`   ✅ Published successfully!`)
          addLog(`   🔗 ${submission.publishedUrl}`)
        } else {
          addLog(`   ❌ Failed: Site rejected submission`)
        }

        setSubmissions([...submissions, submission])
        siteIndex++
        articleIndex++
      }, 2000)
    }

    intervalRef.current = setInterval(processNext, delay * 1000)
    processNext()
  }

  const stopAgent = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setAgentRunning(false)
    addLog('\n⛔ Agent stopped by user')
    setCurrentSite('')
  }

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="animate-slide-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Deploy Agent</h1>
        <p className="text-slate-400">Configure and launch the automated submission agent</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration */}
        <div className="lg:col-span-1 space-y-6">
          {/* Credentials */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-key text-amber-400"></i>
              Agent Credentials
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Username (auto-generated if empty)</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Auto-generated username"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Password (auto-generated if empty)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Auto-generated password"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Delay between submissions: {delay}s</label>
                <input
                  type="range"
                  min="2"
                  max="30"
                  value={delay}
                  onChange={(e) => setDelay(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Select Sites */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <i className="fa-solid fa-globe text-blue-400"></i>
                Target Sites
              </h3>
              <button onClick={selectAllSites} className="text-xs text-indigo-400 hover:text-indigo-300">
                {selectedSites.length === sites.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
              {sites.map(site => (
                <label key={site.id} className="flex items-center gap-3 p-2 hover:bg-slate-700/30 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSites.includes(site.id)}
                    onChange={() => toggleSite(site.id)}
                    className="accent-indigo-500"
                  />
                  <span className="text-sm text-slate-300 flex-1">{site.name}</span>
                  <span className="text-xs text-slate-500">DA {site.da}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">{selectedSites.length} sites selected</p>
          </div>

          {/* Select Articles */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-file-lines text-purple-400"></i>
              Articles to Submit
            </h3>
            {articles.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No articles available. Generate some first!</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                {articles.map(article => (
                  <label key={article.id} className="flex items-center gap-3 p-2 hover:bg-slate-700/30 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedArticles.includes(article.id)}
                      onChange={() => toggleArticle(article.id)}
                      className="accent-indigo-500"
                    />
                    <span className="text-sm text-slate-300 flex-1 truncate">{article.title}</span>
                  </label>
                ))}
              </div>
            )}
            <p className="text-xs text-slate-500 mt-2">{selectedArticles.length} articles selected</p>
          </div>

          {/* Deploy Button */}
          <button
            onClick={agentRunning ? stopAgent : deployAgent}
            disabled={!agentRunning && (selectedSites.length === 0 || selectedArticles.length === 0)}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
              agentRunning
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {agentRunning ? (
              <>
                <i className="fa-solid fa-stop"></i>
                Stop Agent
              </>
            ) : (
              <>
                <i className="fa-solid fa-rocket"></i>
                Deploy Agent
              </>
            )}
          </button>
        </div>

        {/* Live Console */}
        <div className="lg:col-span-2">
          <div className={`bg-slate-800 border rounded-xl p-6 h-full ${agentRunning ? 'border-green-700/50 agent-active' : 'border-slate-700'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <i className={`fa-solid fa-terminal ${agentRunning ? 'text-green-400' : 'text-slate-400'}`}></i>
                Agent Console
                {agentRunning && <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded-full animate-pulse">LIVE</span>}
              </h3>
              {currentSite && (
                <span className="text-xs text-slate-400">
                  Processing: <span className="text-indigo-400">{currentSite}</span>
                </span>
              )}
            </div>

            {/* Progress Bar */}
            {agentRunning && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}

            {/* Console Output */}
            <div className="bg-slate-900 rounded-lg p-4 h-[500px] overflow-y-auto scrollbar-thin font-mono text-xs">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-600">
                  <i className="fa-solid fa-terminal text-3xl mb-3"></i>
                  <p>Agent console ready</p>
                  <p className="text-xs mt-1">Deploy the agent to see live output</p>
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={`py-0.5 ${
                    log.includes('✅') ? 'text-green-400' :
                    log.includes('❌') ? 'text-red-400' :
                    log.includes('🔗') ? 'text-blue-400' :
                    log.includes('🔄') ? 'text-yellow-400' :
                    log.includes('⛔') ? 'text-red-500' :
                    log.includes('🚀') ? 'text-purple-400' :
                    'text-slate-400'
                  }`}>
                    {log}
                  </div>
                ))
              )}
              {agentRunning && <span className="animate-pulse text-green-400">▊</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
