export interface SiteData {
  id: string
  name: string
  url: string
  category: string
  da: number
  status: 'active' | 'inactive' | 'pending'
  articleCount: number
  signupMethod: 'email' | 'google' | 'github' | 'manual'
  requiresApproval: boolean
}

export interface ArticleData {
  id: string
  title: string
  content: string
  targetUrl: string
  anchorText: string
  category: string
  wordCount: number
  createdAt: string
  status: 'draft' | 'ready' | 'submitted'
  keywords: string[]
}

export interface SubmissionRecord {
  id: string
  siteId: string
  siteName: string
  articleId: string
  articleTitle: string
  publishedUrl: string
  status: 'pending' | 'signing_up' | 'filling_form' | 'publishing' | 'published' | 'failed'
  submittedAt: string
  backlinkUrl: string
  username: string
  steps: AgentStep[]
}

export interface AgentStep {
  timestamp: string
  action: string
  detail: string
  status: 'success' | 'error' | 'info' | 'warning'
}

export interface SiteEvaluation {
  url: string
  title: string
  description: string
  niche: string
  keywords: string[]
  tone: string
  audience: string
  suggestedTopics: string[]
  contentStrategy: string[]
  competitorSites: string[]
  backlinkOpportunities: number
  estimatedTraffic: string
}

export interface AgentLog {
  timestamp: string
  message: string
  type: 'info' | 'success' | 'error' | 'warning' | 'action' | 'browser'
}
