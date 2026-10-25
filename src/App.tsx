import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import SiteManager from './pages/SiteManager'
import WebsiteEvaluator from './pages/WebsiteEvaluator'
import ArticleGenerator from './pages/ArticleGenerator'
import AgentDeployment from './pages/AgentDeployment'
import Reports from './pages/Reports'
import { SiteData, ArticleData, SubmissionRecord } from './types'
import { saveToStorage, loadFromStorage } from './utils/ai'

export type Page = 'dashboard' | 'sites' | 'evaluator' | 'generator' | 'agent' | 'reports'

const defaultSites: SiteData[] = [
  { id: '1', name: 'Medium', url: 'https://medium.com', category: 'General', da: 95, status: 'active', articleCount: 0, signupMethod: 'email', requiresApproval: false },
  { id: '2', name: 'HubPages', url: 'https://hubpages.com', category: 'General', da: 89, status: 'active', articleCount: 0, signupMethod: 'email', requiresApproval: true },
  { id: '3', name: 'LinkedIn Articles', url: 'https://linkedin.com/pulse', category: 'Business', da: 98, status: 'active', articleCount: 0, signupMethod: 'email', requiresApproval: false },
  { id: '4', name: 'Dev.to', url: 'https://dev.to', category: 'Technology', da: 87, status: 'active', articleCount: 0, signupMethod: 'github', requiresApproval: false },
  { id: '5', name: 'Steemit', url: 'https://steemit.com', category: 'Technology', da: 72, status: 'active', articleCount: 0, signupMethod: 'email', requiresApproval: false },
  { id: '6', name: 'Blogger', url: 'https://blogger.com', category: 'General', da: 94, status: 'active', articleCount: 0, signupMethod: 'email', requiresApproval: false },
  { id: '7', name: 'WordPress.com', url: 'https://wordpress.com', category: 'General', da: 96, status: 'active', articleCount: 0, signupMethod: 'email', requiresApproval: false },
  { id: '8', name: 'Quora', url: 'https://quora.com', category: 'General', da: 93, status: 'active', articleCount: 0, signupMethod: 'email', requiresApproval: false },
  { id: '9', name: 'Reddit', url: 'https://reddit.com', category: 'General', da: 97, status: 'active', articleCount: 0, signupMethod: 'email', requiresApproval: false },
  { id: '10', name: 'Vocal.media', url: 'https://vocal.media', category: 'General', da: 82, status: 'active', articleCount: 0, signupMethod: 'email', requiresApproval: false },
  { id: '11', name: 'Telegra.ph', url: 'https://telegra.ph', category: 'General', da: 91, status: 'active', articleCount: 0, signupMethod: 'manual', requiresApproval: false },
  { id: '12', name: 'Ghost', url: 'https://ghost.org', category: 'Technology', da: 85, status: 'active', articleCount: 0, signupMethod: 'email', requiresApproval: false },
  { id: '13', name: 'Substack', url: 'https://substack.com', category: 'General', da: 90, status: 'active', articleCount: 0, signupMethod: 'email', requiresApproval: false },
  { id: '14', name: 'Hashnode', url: 'https://hashnode.com', category: 'Technology', da: 83, status: 'active', articleCount: 0, signupMethod: 'github', requiresApproval: false },
  { id: '15', name: 'Tumblr', url: 'https://tumblr.com', category: 'Lifestyle', da: 92, status: 'active', articleCount: 0, signupMethod: 'email', requiresApproval: false },
]

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [sites, setSites] = useState<SiteData[]>(() => loadFromStorage('sites', defaultSites))
  const [articles, setArticles] = useState<ArticleData[]>(() => loadFromStorage('articles', []))
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(() => loadFromStorage('submissions', []))
  const [agentRunning, setAgentRunning] = useState(false)

  useEffect(() => { saveToStorage('sites', sites) }, [sites])
  useEffect(() => { saveToStorage('articles', articles) }, [articles])
  useEffect(() => { saveToStorage('submissions', submissions) }, [submissions])

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard sites={sites} articles={articles} submissions={submissions} agentRunning={agentRunning} />
      case 'sites':
        return <SiteManager sites={sites} setSites={setSites} />
      case 'evaluator':
        return <WebsiteEvaluator sites={sites} />
      case 'generator':
        return <ArticleGenerator articles={articles} setArticles={setArticles} sites={sites} />
      case 'agent':
        return <AgentDeployment 
          sites={sites} 
          articles={articles} 
          submissions={submissions} 
          setSubmissions={setSubmissions}
          agentRunning={agentRunning}
          setAgentRunning={setAgentRunning}
        />
      case 'reports':
        return <Reports submissions={submissions} articles={articles} sites={sites} />
      default:
        return <Dashboard sites={sites} articles={articles} submissions={submissions} agentRunning={agentRunning} />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden app-bg">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} agentRunning={agentRunning} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 lg:p-12">
          {renderPage()}
        </div>
      </main>
    </div>
  )
}

export default App
