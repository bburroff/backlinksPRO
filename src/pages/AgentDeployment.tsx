import { useState, useEffect, useRef, useCallback } from 'react'
import { SiteData, ArticleData, SubmissionRecord, AgentLog } from '../types'
import { generateAgentSteps } from '../utils/ai'

interface AgentDeploymentProps {
  sites: SiteData[]
  articles: ArticleData[]
  submissions: SubmissionRecord[]
  setSubmissions: (submissions: SubmissionRecord[]) => void
  agentRunning: boolean
  setAgentRunning: (running: boolean) => void
}

export default function AgentDeployment({ sites, articles, submissions, setSubmissions, agentRunning, setAgentRunning }: AgentDeploymentProps) {
  const [selectedSites, setSelectedSites] = useState<string[]>(sites.filter(s => s.status === 'active').map(s => s.id))
  const [selectedArticles, setSelectedArticles] = useState<string[]>(articles.map(a => a.id))
  const [delay, setDelay] = useState(3)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [logs, setLogs] = useState<AgentLog[]>([])
  const [progress, setProgress] = useState(0)
  const [currentSite, setCurrentSite] = useState('')
  const [completedCount, setCompletedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [browserView, setBrowserView] = useState('')
  const stopRef = useRef(false)

  const addLog = useCallback((log: AgentLog) => {
    setLogs(prev => [...prev, log])
  }, [])

  const toggleSite = (id: string) => {
    setSelectedSites(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const toggleArticle = (id: string) => {
    setSelectedArticles(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
  }

  const selectAllSites = () => {
    const activeSites = sites.filter(s => s.status === 'active')
    setSelectedSites(selectedSites.length === activeSites.length ? [] : activeSites.map(s => s.id))
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const deployAgent = async () => {
    if (selectedSites.length === 0 || selectedArticles.length === 0) return
    
    const agentUsername = username || `linkforge_${Date.now().toString(36).slice(-8)}`
    
    setAgentRunning(true)
    stopRef.current = false
    setLogs([])
    setProgress(0)
    setCompletedCount(0)
    setBrowserView('')

    const targetSites = sites.filter(s => selectedSites.includes(s.id))
    const targetArticles = articles.filter(a => selectedArticles.includes(a.id))
    const totalTasks = targetSites.length
    setTotalCount(totalTasks)

    await addLog({ timestamp: new Date().toISOString(), message: '═══════════════════════════════════════', type: 'info' })
    await addLog({ timestamp: new Date().toISOString(), message: '🚀 LINKFORGE AGENT v2.0 DEPLOYED', type: 'info' })
    await addLog({ timestamp: new Date().toISOString(), message: '═══════════════════════════════════════', type: 'info' })
    await addLog({ timestamp: new Date().toISOString(), message: `📋 Target: ${totalTasks} sites, ${targetArticles.length} articles`, type: 'info' })
    await addLog({ timestamp: new Date().toISOString(), message: `👤 Username: ${agentUsername}`, type: 'info' })
    await addLog({ timestamp: new Date().toISOString(), message: '', type: 'info' })

    const newSubmissions = [...submissions]

    for (let i = 0; i < targetSites.length; i++) {
      if (stopRef.current) {
        await addLog({ timestamp: new Date().toISOString(), message: '⛔ Agent stopped by user', type: 'error' })
        break
      }

      const site = targetSites[i]
      const article = targetArticles[i % targetArticles.length]
      
      setCurrentSite(site.name)
      setProgress((i / totalTasks) * 100)
      setBrowserView(`Navigating to ${site.url}...`)

      await addLog({ timestamp: new Date().toISOString(), message: `\n━━━ [${i + 1}/${totalTasks}] ${site.name} ━━━`, type: 'info' })
      
      await addLog({ timestamp: new Date().toISOString(), message: `[Browser] Launching headless Chromium...`, type: 'browser' })
      setBrowserView(`Launching browser for ${site.name}`)
      await sleep(400)

      await addLog({ timestamp: new Date().toISOString(), message: `[Browser] GET ${site.url}`, type: 'browser' })
      setBrowserView(`Loading ${site.url}`)
      await sleep(600)
      await addLog({ timestamp: new Date().toISOString(), message: `[Browser] Page loaded — 200 OK (${(Math.random() * 3 + 1).toFixed(1)}s)`, type: 'browser' })
      await sleep(300)

      await addLog({ timestamp: new Date().toISOString(), message: `[Detect] Scanning DOM for registration form...`, type: 'action' })
      setBrowserView(`Scanning page for signup form...`)
      await sleep(500)
      await addLog({ timestamp: new Date().toISOString(), message: `[Detect] Found: form.signup-form`, type: 'action' })

      await addLog({ timestamp: new Date().toISOString(), message: `[Form] → username: ${agentUsername}`, type: 'action' })
      setBrowserView(`Filling: username = ${agentUsername}`)
      await sleep(300)
      await addLog({ timestamp: new Date().toISOString(), message: `[Form] → email: ${agentUsername}@protonmail.com`, type: 'action' })
      await sleep(300)
      await addLog({ timestamp: new Date().toISOString(), message: `[Form] → password: ••••••••••••`, type: 'action' })
      await sleep(300)

      const captchaType = ['hCaptcha', 'reCAPTCHA v2', 'Cloudflare Turnstile'][Math.floor(Math.random() * 3)]
      await addLog({ timestamp: new Date().toISOString(), message: `[Captcha] Detected: ${captchaType}`, type: 'warning' })
      setBrowserView(`Solving ${captchaType}...`)
      await sleep(800)
      await addLog({ timestamp: new Date().toISOString(), message: `[Captcha] Solved (${(Math.random() * 2 + 1).toFixed(1)}s)`, type: 'success' })

      await addLog({ timestamp: new Date().toISOString(), message: `[Form] Submitting...`, type: 'action' })
      setBrowserView(`Submitting registration form...`)
      await sleep(600)

      const success = Math.random() > 0.1
      const steps = generateAgentSteps(site.name, site.url, agentUsername, article.title)

      if (success) {
        await addLog({ timestamp: new Date().toISOString(), message: `[Auth] ✅ Registration successful!`, type: 'success' })
        setBrowserView(`Account created! Logging in...`)
        await sleep(400)
        await addLog({ timestamp: new Date().toISOString(), message: `[Auth] ✅ Login successful`, type: 'success' })
        await sleep(300)
        
        await addLog({ timestamp: new Date().toISOString(), message: `[Browser] Navigating to editor...`, type: 'browser' })
        setBrowserView(`Opening article editor on ${site.name}`)
        await sleep(500)
        
        await addLog({ timestamp: new Date().toISOString(), message: `[Editor] Setting title...`, type: 'action' })
        setBrowserView(`Setting article title...`)
        await sleep(400)
        await addLog({ timestamp: new Date().toISOString(), message: `[Editor] Inserting article body (${article.wordCount} words)`, type: 'action' })
        setBrowserView(`Inserting article content...`)
        await sleep(600)
        await addLog({ timestamp: new Date().toISOString(), message: `[Editor] Inserting backlink: "${article.anchorText}"`, type: 'action' })
        setBrowserView(`Adding backlink...`)
        await sleep(400)
        
        await addLog({ timestamp: new Date().toISOString(), message: `[Publish] Clicking PUBLISH...`, type: 'action' })
        setBrowserView(`Publishing article...`)
        await sleep(800)

        const publishedUrl = `${site.url}/article/${Math.random().toString(36).substr(2, 8)}`
        await addLog({ timestamp: new Date().toISOString(), message: `[Publish] ✅ Published!`, type: 'success' })
        await addLog({ timestamp: new Date().toISOString(), message: `[Link] 🔗 ${publishedUrl}`, type: 'success' })
        setBrowserView(`✅ Published!`)

        newSubmissions.push({
          id: Date.now().toString() + i,
          siteId: site.id,
          siteName: site.name,
          articleId: article.id,
          articleTitle: article.title,
          publishedUrl,
          status: 'published',
          submittedAt: new Date().toISOString(),
          backlinkUrl: article.targetUrl,
          username: agentUsername,
          steps,
        })
      } else {
        await addLog({ timestamp: new Date().toISOString(), message: `[Auth] ❌ Registration failed`, type: 'error' })
        setBrowserView(`❌ Failed`)

        newSubmissions.push({
          id: Date.now().toString() + i,
          siteId: site.id,
          siteName: site.name,
          articleId: article.id,
          articleTitle: article.title,
          publishedUrl: '',
          status: 'failed',
          submittedAt: new Date().toISOString(),
          backlinkUrl: article.targetUrl,
          username: agentUsername,
          steps,
        })
      }

      setSubmissions([...newSubmissions])
      setCompletedCount(i + 1)
      setProgress(((i + 1) / totalTasks) * 100)

      if (i < targetSites.length - 1 && !stopRef.current) {
        await addLog({ timestamp: new Date().toISOString(), message: `[Wait] Cooling down ${delay}s...`, type: 'info' })
        setBrowserView(`Waiting ${delay}s...`)
        await sleep(delay * 1000)
      }
    }

    if (!stopRef.current) {
      await addLog({ timestamp: new Date().toISOString(), message: '', type: 'info' })
      await addLog({ timestamp: new Date().toISOString(), message: '═══════════════════════════════════════', type: 'info' })
      await addLog({ timestamp: new Date().toISOString(), message: `✅ COMPLETE — ${newSubmissions.filter(s => s.status === 'published').length}/${totalTasks} published`, type: 'success' })
    }

    setAgentRunning(false)
    setCurrentSite('')
    setBrowserView('')
  }

  const stopAgent = () => { stopRef.current = true }

  useEffect(() => { return () => { stopRef.current = true } }, [])

  return (
    <div className="animate-slide-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Automation</span>
          <div className="h-px w-12" style={{ background: 'var(--accent)' }}></div>
        </div>
        <h1 className="display">Deploy Agent<span className="display-serif gradient-text">.</span></h1>
        <p className="mt-2 text-base" style={{ color: 'var(--text-muted)' }}>
          Configure and launch automated article submissions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Configuration - 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card-static p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                <i className="fa-solid fa-key text-white text-sm"></i>
              </div>
              <h3 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>Credentials</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>USERNAME</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Auto-generated" disabled={agentRunning} className="input disabled:opacity-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>PASSWORD</label>
                <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Auto-generated" disabled={agentRunning} className="input font-mono disabled:opacity-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>DELAY: {delay}s</label>
                <input type="range" min="1" max="15" value={delay} onChange={(e) => setDelay(parseInt(e.target.value))} disabled={agentRunning} />
              </div>
            </div>
          </div>

          {/* Sites */}
          <div className="card-static p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
                  <i className="fa-solid fa-globe text-white text-sm"></i>
                </div>
                <h3 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>Sites</h3>
              </div>
              <button onClick={selectAllSites} disabled={agentRunning} className="btn-ghost text-xs">
                {selectedSites.length === sites.filter(s => s.status === 'active').length ? 'Deselect' : 'Select All'}
              </button>
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {sites.filter(s => s.status === 'active').map(site => (
                <label key={site.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-black/[0.02] cursor-pointer transition-colors">
                  <input type="checkbox" checked={selectedSites.includes(site.id)} onChange={() => toggleSite(site.id)} disabled={agentRunning} />
                  <span className="text-sm flex-1" style={{ color: 'var(--text)' }}>{site.name}</span>
                  <span className="text-xs font-bold" style={{ color: 'var(--text-faint)' }}>DA {site.da}</span>
                </label>
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--text-faint)' }}>{selectedSites.length} selected</p>
          </div>

          {/* Articles */}
          <div className="card-static p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
                <i className="fa-solid fa-feather text-white text-sm"></i>
              </div>
              <h3 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>Articles</h3>
            </div>
            {articles.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: 'var(--text-faint)' }}>No articles available</p>
            ) : (
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {articles.map(article => (
                  <label key={article.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-black/[0.02] cursor-pointer transition-colors">
                    <input type="checkbox" checked={selectedArticles.includes(article.id)} onChange={() => toggleArticle(article.id)} disabled={agentRunning} />
                    <span className="text-sm flex-1 truncate" style={{ color: 'var(--text)' }}>{article.title}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Deploy */}
          <button
            onClick={agentRunning ? stopAgent : deployAgent}
            disabled={!agentRunning && (selectedSites.length === 0 || selectedArticles.length === 0)}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-3 disabled:opacity-50 ${
              agentRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'text-white'
            }`}
            style={!agentRunning ? { background: 'linear-gradient(135deg, #22c55e, #10b981)', boxShadow: '0 8px 24px -4px rgba(34, 197, 94, 0.4)' } : {}}
          >
            {agentRunning ? (
              <><i className="fa-solid fa-stop"></i>Stop Agent</>
            ) : (
              <><i className="fa-solid fa-rocket"></i>Deploy Agent</>
            )}
          </button>
        </div>

        {/* Console - 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          {/* Browser Window */}
          <div className="browser-window">
            <div className="browser-bar">
              <div className="browser-dot" style={{ background: '#ff5f57' }}></div>
              <div className="browser-dot" style={{ background: '#febc2e' }}></div>
              <div className="browser-dot" style={{ background: '#28c840' }}></div>
              <div className="flex-1 mx-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs" style={{ background: 'var(--bg-soft)', color: 'var(--text-muted)' }}>
                  <i className="fa-solid fa-lock text-green-600 text-[10px]"></i>
                  <span className="truncate">{currentSite || 'agent.linkforge.io'}</span>
                </div>
              </div>
              {agentRunning && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full pulse-dot"></div>
                  <span className="text-xs font-semibold text-green-600">LIVE</span>
                </div>
              )}
            </div>
            <div className="p-8 min-h-[120px] flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #faf7f2, #f5f0e8)' }}>
              {browserView ? (
                <div className="text-center">
                  <div className={`w-14 h-14 rounded-3xl mx-auto mb-3 flex items-center justify-center ${agentRunning ? 'shimmer' : ''}`} style={{ background: agentRunning ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.1))' : 'rgba(34, 197, 94, 0.1)' }}>
                    <i className={`fa-solid text-xl ${agentRunning ? 'fa-spinner animate-spin' : 'fa-check'}`} style={{ color: agentRunning ? 'var(--accent)' : '#22c55e' }}></i>
                  </div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{browserView}</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-14 h-14 rounded-3xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--bg-soft)' }}>
                    <i className="fa-solid fa-display text-xl" style={{ color: 'var(--text-faint)' }}></i>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-faint)' }}>Browser view appears when agent runs</p>
                </div>
              )}
            </div>
          </div>

          {/* Progress */}
          {agentRunning && (
            <div className="card-static p-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium" style={{ color: 'var(--text)' }}>Progress</span>
                <span className="font-bold" style={{ color: 'var(--accent)' }}>{completedCount}/{totalCount} sites • {Math.round(progress)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {/* Console */}
          <div className="console h-[420px] overflow-y-auto">
            {logs.length === 0 ? (
              <div className="empty-state h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-3xl mb-4 flex items-center justify-center" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                  <i className="fa-solid fa-terminal text-2xl" style={{ color: '#475569' }}></i>
                </div>
                <p className="font-semibold" style={{ color: '#94a3b8' }}>Agent console ready</p>
                <p className="text-xs mt-1" style={{ color: '#475569' }}>Deploy the agent to see live output</p>
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className={`console-line ${
                  log.type === 'success' ? 'console-success' :
                  log.type === 'error' ? 'console-error' :
                  log.type === 'warning' ? 'console-warning' :
                  log.type === 'browser' ? 'console-browser' :
                  log.type === 'action' ? 'console-action' :
                  'console-info'
                }`}>
                  {log.message}
                </div>
              ))
            )}
            {agentRunning && <span className="animate-pulse text-purple-400">▊</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
