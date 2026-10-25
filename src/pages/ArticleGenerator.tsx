import { useState } from 'react'
import { ArticleData, SiteData } from '../types'
import { generateArticle } from '../utils/ai'

interface ArticleGeneratorProps {
  articles: ArticleData[]
  setArticles: (articles: ArticleData[]) => void
  sites: SiteData[]
}

export default function ArticleGenerator({ articles, setArticles }: ArticleGeneratorProps) {
  const [targetUrl, setTargetUrl] = useState('')
  const [anchorText, setAnchorText] = useState('')
  const [topic, setTopic] = useState('')
  const [category, setCategory] = useState('General')
  const [wordCount, setWordCount] = useState(800)
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [generatedTitle, setGeneratedTitle] = useState('')
  const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([])
  const [generationProgress, setGenerationProgress] = useState(0)

  const generateArticleHandler = async () => {
    if (!targetUrl || !topic) return
    setGenerating(true)
    setGeneratedContent('')
    setGeneratedTitle('')
    setGeneratedKeywords([])
    setGenerationProgress(0)

    await new Promise(resolve => setTimeout(resolve, 800))
    setGenerationProgress(20)

    const result = generateArticle(topic, targetUrl, anchorText || targetUrl, category)
    
    await new Promise(resolve => setTimeout(resolve, 600))
    setGeneratedTitle(result.title)
    setGenerationProgress(40)
    setGeneratedKeywords(result.keywords)

    const words = result.content.split(' ')
    let currentContent = ''
    for (let i = 0; i < words.length; i++) {
      currentContent += words[i] + ' '
      if (i % 8 === 0) {
        await new Promise(resolve => setTimeout(resolve, 15))
        setGeneratedContent(currentContent)
        setGenerationProgress(40 + Math.floor((i / words.length) * 60))
      }
    }
    setGeneratedContent(result.content)
    setGenerationProgress(100)
    setGenerating(false)
  }

  const saveArticle = () => {
    if (!generatedContent || !generatedTitle) return
    const article: ArticleData = {
      id: Date.now().toString(),
      title: generatedTitle,
      content: generatedContent,
      targetUrl,
      anchorText: anchorText || targetUrl,
      category,
      wordCount: generatedContent.split(/\s+/).length,
      createdAt: new Date().toISOString(),
      status: 'ready',
      keywords: generatedKeywords,
    }
    setArticles([...articles, article])
    setGeneratedContent('')
    setGeneratedTitle('')
    setGeneratedKeywords([])
    setTopic('')
    setGenerationProgress(0)
  }

  return (
    <div className="animate-slide-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>AI Writer</span>
          <div className="h-px w-12" style={{ background: 'var(--accent)' }}></div>
        </div>
        <h1 className="display">Article Generator<span className="display-serif gradient-text">.</span></h1>
        <p className="mt-2 text-base" style={{ color: 'var(--text-muted)' }}>
          Create custom articles with backlinks to your website
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Configuration - 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card-static p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
                <i className="fa-solid fa-sliders text-white text-sm"></i>
              </div>
              <h3 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>Configuration</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>TARGET WEBSITE URL *</label>
                <input type="text" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="https://yourwebsite.com" className="input" />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>ANCHOR TEXT</label>
                <input type="text" value={anchorText} onChange={(e) => setAnchorText(e.target.value)} placeholder="Click here to learn more" className="input" />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>ARTICLE TOPIC(S) *</label>
                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Digital Marketing, SEO Tips" className="input" />
                <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>Comma-separate for batch generation</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>CATEGORY</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
                    <option>General</option>
                    <option>Technology</option>
                    <option>Business</option>
                    <option>Health</option>
                    <option>Lifestyle</option>
                    <option>Education</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>~{wordCount} WORDS</label>
                  <input type="range" min="300" max="2000" step="100" value={wordCount} onChange={(e) => setWordCount(parseInt(e.target.value))} className="mt-3" />
                </div>
              </div>

              {generating && (
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium" style={{ color: 'var(--text-muted)' }}>Generating...</span>
                    <span className="font-bold" style={{ color: 'var(--accent)' }}>{generationProgress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${generationProgress}%` }}></div>
                  </div>
                </div>
              )}

              <button
                onClick={generateArticleHandler}
                disabled={generating || !targetUrl || !topic}
                className="btn-gradient w-full justify-center"
              >
                {generating ? (
                  <>
                    <i className="fa-solid fa-robot animate-pulse"></i>
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    Generate Article
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Backlink Preview */}
          {targetUrl && (
            <div className="card-static p-5">
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>BACKLINK PREVIEW</p>
              <div className="p-3 rounded-xl" style={{ background: 'var(--bg-soft)' }}>
                <a href="#" className="font-medium text-sm">{anchorText || 'Your anchor text'}</a>
                <p className="text-xs mt-1 truncate" style={{ color: 'var(--text-faint)' }}>→ {targetUrl}</p>
              </div>
            </div>
          )}
        </div>

        {/* Generated Content - 3 cols */}
        <div className="lg:col-span-3">
          <div className="card-static p-6 h-full">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06b6d4, #7c3aed)' }}>
                  <i className="fa-solid fa-file-lines text-white text-sm"></i>
                </div>
                <h3 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>Generated Article</h3>
              </div>
              {generatedContent && !generating && (
                <button onClick={saveArticle} className="btn-primary">
                  <i className="fa-solid fa-save"></i>
                  Save
                </button>
              )}
            </div>

            {!generatedContent && !generating && (
              <div className="empty-state py-16">
                <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--bg-soft)' }}>
                  <i className="fa-solid fa-wand-magic-sparkles text-3xl" style={{ color: 'var(--text-faint)' }}></i>
                </div>
                <p className="font-semibold" style={{ color: 'var(--text-muted)' }}>No article generated yet</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-faint)' }}>Configure settings and click Generate</p>
              </div>
            )}

            {(generatedContent || generating) && (
              <div>
                <div className="console max-h-[600px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: '#e2e8f0' }}>
                    {generatedContent || 'Initializing AI model...'}
                    {generating && <span className="animate-pulse text-purple-400">▊</span>}
                  </pre>
                </div>
                {generatedContent && !generating && (
                  <div className="flex items-center gap-4 mt-4 text-xs flex-wrap" style={{ color: 'var(--text-faint)' }}>
                    <span className="flex items-center gap-1"><i className="fa-solid fa-font"></i> {generatedContent.split(/\s+/).length} words</span>
                    <span className="flex items-center gap-1"><i className="fa-solid fa-link"></i> 2 backlinks</span>
                    <span className="flex items-center gap-1"><i className="fa-solid fa-clock"></i> {new Date().toLocaleDateString()}</span>
                    {generatedKeywords.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {generatedKeywords.slice(0, 3).map((kw, i) => (
                          <span key={i} className="badge badge-purple">{kw}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Saved Articles */}
          {articles.length > 0 && (
            <div className="card-static p-6 mt-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)' }}>
                  <i className="fa-solid fa-folder-open text-white text-sm"></i>
                </div>
                <h3 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>Saved Articles</h3>
                <span className="badge badge-neutral">{articles.length}</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {articles.map((article) => (
                  <div key={article.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-soft)' }}>
                    <i className="fa-solid fa-file-lines" style={{ color: 'var(--text-faint)' }}></i>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{article.title}</p>
                      <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{article.wordCount} words • {article.category}</p>
                    </div>
                    <span className="badge badge-success">{article.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
