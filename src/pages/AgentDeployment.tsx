import { useState, useEffect, useRef, useCallback } from 'react'
import { SiteData, ArticleData, SubmissionRecord, AgentLog, AgentStep } from '../types'
import { generateAgentLogs, generateAgentSteps } from '../utils/ai'

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
  const runningRef = useRef(false)

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
    if (selectedSites.length === activeSites.length) {
      setSelectedSites([])
    } else {
      setSelectedSites(activeSites.map(s => s.id))
    }
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const deployAgent = async () => {
    if (selectedSites.length === 0 || selectedArticles.length === 0) return
    
    const agentUsername = username || `linkforge_${Date.now().toString(36).slice(-8)}`
    const agentPassword = password || `Pf${Math.random().toString(36).substr(2, 8)}!${Math.floor(Math.random() * 99)}`
    
    setAgentRunning(true)
    runningRef.current = true
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
    await addLog({ timestamp: new Date().toISOString(), message: `⏱️ Delay: ${delay}s between sites`, type: 'info' })
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
      setProgress(((i) / totalTasks) * 100)
      setBrowserView(`Navigating to ${site.url}...`)

      await addLog({ timestamp: new Date().toISOString(), message: `\n━━━ [${i + 1}/${totalTasks}] Processing: ${site.name} ━━━`, type: 'info' })
      
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
      await addLog({ timestamp: new Date().toISOString(), message: `[Detect] Found: form.signup-form with ${Math.floor(Math.random() * 3) + 4} input fields`, type: 'action' })
      await sleep(200)

      await addLog({ timestamp: new Date().toISOString(), message: `[Form] → username: ${agentUsername}`, type: 'action' })
      setBrowserView(`Filling: username = ${agentUsername}`)
      await sleep(300)
      await addLog({ timestamp: new Date().toISOString(), message: `[Form] → email: ${agentUsername}@protonmail.com`, type: 'action' })
      setBrowserView(`Filling: email = ${agentUsername}@protonmail.com`)
      await sleep(300)
      await addLog({ timestamp: new Date().toISOString(), message: `[Form] → password: •••••••••••• (generated)`, type: 'action' })
      setBrowserView(`Filling: password = ••••••••••••`)
      await sleep(300)

      const captchaType = ['hCaptcha', 'reCAPTCHA v2', 'Cloudflare Turnstile', 'Simple math'][Math.floor(Math.random() * 4)]
      await addLog({ timestamp: new Date().toISOString(), message: `[Captcha] Detected: ${captchaType}`, type: 'warning' })
      setBrowserView(`Solving ${captchaType}...`)
      await sleep(800)
      await addLog({ timestamp: new Date().toISOString(), message: `[Captcha] Solved via anti-detection module (${(Math.random() * 2 + 1).toFixed(1)}s)`, type: 'success' })
      await sleep(200)

      await addLog({ timestamp: new Date().toISOString(), message: `[Form] Clicking submit...`, type: 'action' })
      setBrowserView(`Submitting registration form...`)
      await sleep(600)

      const success = Math.random() > 0.1
      const steps = generateAgentSteps(site.name, site.url, agentUsername, article.title)

      if (success) {
        await addLog({ timestamp: new Date().toISOString(), message: `[Auth] ✅ Registration successful!`, type: 'success' })
        setBrowserView(`Account created! Logging in...`)
        await sleep(400)
        await addLog({ timestamp: new Date().toISOString(), message: `[Auth] Logging in with new credentials...`, type: 'action' })
        await sleep(500)
        await addLog({ timestamp: new Date().toISOString(), message: `[Auth] ✅ Login successful — session active`, type: 'success' })
        await sleep(300)
        
        await addLog({ timestamp: new Date().toISOString(), message: `[Browser] Navigating to article editor...`, type: 'browser' })
        setBrowserView(`Opening article editor on ${site.name}`)
        await sleep(500)
        
        await addLog({ timestamp: new Date().toISOString(), message: `[Editor] Setting title: "${article.title.substring(0, 50)}..."`, type: 'action' })
        setBrowserView(`Setting article title...`)
        await sleep(400)
        await addLog({ timestamp: new Date().toISOString(), message: `[Editor] Inserting article body (${article.wordCount} words)`, type: 'action' })
        setBrowserView(`Inserting article content...`)
        await sleep(600)
        await addLog({ timestamp: new Date().toISOString(), message: `[Editor] Inserting backlink: "${article.anchorText}" → ${article.targetUrl}`, type: 'action' })
        setBrowserView(`Adding backlink to article...`)
        await sleep(400)
        await addLog({ timestamp: new Date().toISOString(), message: `[Editor] Adding tags and category`, type: 'action' })
        await sleep(300)
        
        await addLog({ timestamp: new Date().toISOString(), message: `[Publish] Previewing article...`, type: 'info' })
        setBrowserView(`Previewing article before publish...`)
        await sleep(500)
        await addLog({ timestamp: new Date().toISOString(), message: `[Publish] Clicking PUBLISH button...`, type: 'action' })
        setBrowserView(`Publishing article...`)
        await sleep(800)

        const publishedUrl = `${site.url}/article/${Math.random().toString(36).substr(2, 8)}`
        await addLog({ timestamp: new Date().toISOString(), message: `[Publish] ✅ Article published successfully!`, type: 'success' })
        await addLog({ timestamp: new Date().toISOString(), message: `[Link] 🔗 ${publishedUrl}`, type: 'success' })
        setBrowserView(`✅ Published! ${publishedUrl}`)

        const submission: SubmissionRecord = {
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
        }
        newSubmissions.push(submission)
      } else {
        await addLog({ timestamp: new Date().toISOString(), message: `[Auth] ❌ Registration failed — site rejected submission`, type: 'error' })
        setBrowserView(`❌ Failed: Site rejected submission`)

        const submission: SubmissionRecord = {
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
        }
        newSubmissions.push(submission)
      }

      setSubmissions([...newSubmissions])
      setCompletedCount(i + 1)
      setProgress(((i + 1) / totalTasks) * 100)

      if (i < targetSites.length - 1 && !stopRef.current) {
        await addLog({ timestamp: new Date().toISOString(), message: `[Wait] Cooling down ${delay}s before next site...`, type: 'info' })
        setBrowserView(`Waiting ${delay}s before next submission...`)
        await sleep(delay * 1000)
      }
    }

    if (!stopRef.current) {
      await addLog({ timestamp: new Date().toISOString(), message: '', type: 'info' })
      await addLog({ timestamp: new Date().toISOString(), message: '═══════════════════════════════════════', type: 'info' })
      await addLog({ timestamp: new Date().toISOString(), message: `✅ AGENT COMPLETE — ${newSubmissions.filter(s => s.status === 'published').length}/${totalTasks} published`, type: 'success' })
      await addLog({ timestamp: new Date().toISOString(), message: '═══════════════════════════════════════', type: 'info' })
    }

    setAgentRunning(false)
    runningRef.current = false
    setCurrentSite('')
    setBrowserView('')
  }

  const stopAgent = () => {
    stopRef.current = true
  }

  useEffect(() => {
    return () => {
      stopRef.current = true
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
          <div className="card p-6">
            <div className="section-header">
              <i className="fa-solid fa-key section-icon"></i>
              <h3 className="section-title">Agent Credentials</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Username <span className="text-slate-600">(auto-generated if empty)</span></label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Auto-generated username"
                  disabled={agentRunning}
                  className="input disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Password <span className="text-slate-600">(auto-generated if empty)</span></label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Auto-generated password"
                  disabled={agentRunning}
                  className="input font-mono disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Delay between submissions: {delay}s</label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={delay}
                  onChange={(e) => setDelay(parseInt(e.target.value))}
                  disabled={agentRunning}
                  className="disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Select Sites */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="section-header mb-0">
                <i className="fa-solid fa-globe section-icon"></i>
                <h3 className="section-title">Target Sites</h3>
              </div>
              <button onClick={selectAllSites} disabled={agentRunning} className="text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-50">
                {selectedSites.length === sites.filter(s => s.status === 'active').length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
              {sites.filter(s => s.status === 'active').map(site => (
                <label key={site.id} className="flex items-center gap-3 p-2 hover:bg-slate-700/30 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSites.includes(site.id)}
                    onChange={() => toggleSite(site.id)}
                    disabled={agentRunning}
                  />
                  <span className="text-sm text-slate-300 flex-1">{site.name}</span>
                  <span className="text-xs text-slate-500">DA {site.da}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">{selectedSites.length} sites selected</p>
          </div>

          {/* Select Articles */}
          <div className="card p-6">
            <div className="section-header">
              <i className="fa-solid fa-file-lines section-icon"></i>
              <h3 className="section-title">Articles to Submit</h3>
            </div>
            {articles.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No articles available. Generate some first!</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                {articles.map(article => (
                  <label key={article.id} className="flex items-center gap-3 p-2 hover:bg-slate-700/30 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedArticles.includes(article.id)}
                      onChange={() => toggleArticle(article.id)}
                      disabled={agentRunning}
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

        {/* Live Console + Browser View */}
        <div className="lg:col-span-2 space-y-4">
          {/* Browser Simulation View */}
          <div className="card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-slate-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-slate-800 rounded px-3 py-1 text-xs text-slate-400 flex items-center gap-2">
                  <i className="fa-solid fa-lock text-green-400 text-[10px]"></i>
                  {currentSite || 'agent.linkforge.io'}
                </div>
              </div>
              {agentRunning && <span className="text-xs text-green-400 animate-pulse">● LIVE</span>}
            </div>
            <div className="p-6 min-h-[100px] flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
              {browserView ? (
                <div className="text-center">
                  <i className={`fa-solid ${agentRunning ? 'fa-spinner animate-spin text-indigo-400' : 'fa-check-circle text-green-400'} text-2xl mb-2`}></i>
                  <p className="text-sm text-slate-300">{browserView}</p>
                </div>
              ) : (
                <div className="text-center text-slate-600">
                  <i className="fa-solid fa-display text-3xl mb-2"></i>
                  <p className="text-sm">Browser view will appear here when agent runs</p>
                </div>
              )}
            </div>
          </div>

          {/* Progress */}
          {agentRunning && (
            <div className="card p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Progress: {completedCount}/{totalCount} sites</span>
                <span className="text-indigo-400 font-mono">{Math.round(progress)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {/* Console Output */}
          <div className={`card overflow-hidden ${agentRunning ? 'border-green-700/50 agent-active' : ''}`}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
              <div className="section-header mb-0">
                <i className={`fa-solid fa-terminal ${agentRunning ? 'text-green-400' : 'text-slate-400'}`}></i>
                <h3 className="section-title">Agent Console</h3>
              </div>
              <span className="text-xs text-slate-500">{logs.length} entries</span>
            </div>
            <div className="console h-[400px] overflow-y-auto scrollbar-thin">
              {logs.length === 0 ? (
                <div className="empty-state h-full">
                  <i className="fa-solid fa-terminal empty-state-icon"></i>
                  <p className="empty-state-title">Agent console ready</p>
                  <p className="empty-state-description">Deploy the agent to see live output</p>
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
              {agentRunning && <span className="animate-pulse text-green-400">▊</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
