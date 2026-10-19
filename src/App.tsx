import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import SiteManager from './pages/SiteManager'
import WebsiteEvaluator from './pages/WebsiteEvaluator'
import ArticleGenerator from './pages/ArticleGenerator'
import AgentDeployment from './pages/AgentDeployment'
import Reports from './pages/Reports'
import { SiteData, ArticleData, SubmissionRecord } from './types'

export type Page = 'dashboard' | 'sites' | 'evaluator' | 'generator' | 'agent' | 'reports'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [sites, setSites] = useState<SiteData[]>([
    { id: '1', name: 'Medium', url: 'https://medium.com', category: 'General', da: 95, status: 'active', articleCount: 0 },
    { id: '2', name: 'HubPages', url: 'https://hubpages.com', category: 'General', da: 89, status: 'active', articleCount: 0 },
    { id: '3', name: 'LinkedIn Articles', url: 'https://linkedin.com/pulse', category: 'Professional', da: 98, status: 'active', articleCount: 0 },
    { id: '4', name: 'Dev.to', url: 'https://dev.to', category: 'Technology', da: 87, status: 'active', articleCount: 0 },
    { id: '5', name: 'Steemit', url: 'https://steemit.com', category: 'Blockchain', da: 72, status: 'active', articleCount: 0 },
    { id: '6', name: 'Blogger', url: 'https://blogger.com', category: 'General', da: 94, status: 'active', articleCount: 0 },
    { id: '7', name: 'WordPress.com', url: 'https://wordpress.com', category: 'General', da: 96, status: 'active', articleCount: 0 },
    { id: '8', name: 'Quora', url: 'https://quora.com', category: 'Q&A', da: 93, status: 'active', articleCount: 0 },
    { id: '9', name: 'Reddit', url: 'https://reddit.com', category: 'Social', da: 97, status: 'active', articleCount: 0 },
    { id: '10', name: 'Vocal.media', url: 'https://vocal.media', category: 'Creative', da: 82, status: 'active', articleCount: 0 },
  ])

  const [articles, setArticles] = useState<ArticleData[]>([])
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([])
  const [agentRunning, setAgentRunning] = useState(false)

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
    <div className="flex h-screen overflow-hidden bg-slate-900">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} agentRunning={agentRunning} />
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-6 lg:p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  )
}

export default App
