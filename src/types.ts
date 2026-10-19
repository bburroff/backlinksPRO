export interface SiteData {
  id: string
  name: string
  url: string
  category: string
  da: number
  status: 'active' | 'inactive' | 'pending'
  articleCount: number
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
}

export interface SubmissionRecord {
  id: string
  siteId: string
  siteName: string
  articleId: string
  articleTitle: string
  publishedUrl: string
  status: 'pending' | 'submitting' | 'published' | 'failed'
  submittedAt: string
  backlinkUrl: string
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
}
