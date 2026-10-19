import { useState } from 'react'
import { ArticleData, SiteData } from '../types'
import { generateArticle } from '../utils/ai'

interface ArticleGeneratorProps {
  articles: ArticleData[]
  setArticles: (articles: ArticleData[]) => void
  sites: SiteData[]
}

export default function ArticleGenerator({ articles, setArticles, sites }: ArticleGeneratorProps) {
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

  const generateBatch = async () => {
    if (!targetUrl || !topic) return
    const topics = topic.split(',').map(t => t.trim()).filter(Boolean)
    if (topics.length <= 1) {
      generateArticleHandler()
      return
    }

    setGenerating(true)
    const newArticles: ArticleData[] = []
    
    for (let i = 0; i < topics.length; i++) {
      setGenerationProgress(((i + 1) / topics.length) * 100)
      const result = generateArticle(topics[i], targetUrl, anchorText || targetUrl, category)
      newArticles.push({
        id: Date.now().toString() + i,
        title: result.title,
        content: result.content,
        targetUrl,
        anchorText: anchorText || targetUrl,
        category,
        wordCount: result.content.split(/\s+/).length,
        createdAt: new Date().toISOString(),
        status: 'ready',
        keywords: result.keywords,
      })
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    setArticles([...articles, ...newArticles])
    setGenerating(false)
    setGenerationProgress(0)
  }

  return (
    <div className="animate-slide-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Article Writer</h1>
        <p className="text-slate-400">Generate custom articles with backlinks to your website</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6">
            <div className="section-header">
              <i className="fa-solid fa-sliders section-icon"></i>
              <h3 className="section-title">Configuration</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Target Website URL *</label>
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Anchor Text</label>
                <input
                  type="text"
                  value={anchorText}
                  onChange={(e) => setAnchorText(e.target.value)}
                  placeholder="Click here to learn more"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Article Topic(s) * <span className="text-slate-600">(comma-separate for batch)</span></label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Digital Marketing, SEO Tips, Content Strategy"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input"
                >
                  <option>General</option>
                  <option>Technology</option>
                  <option>Business</option>
                  <option>Health</option>
                  <option>Lifestyle</option>
                  <option>Education</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Target Word Count: ~{wordCount}</label>
                <input
                  type="range"
                  min="300"
                  max="2000"
                  step="100"
                  value={wordCount}
                  onChange={(e) => setWordCount(parseInt(e.target.value))}
                />
              </div>

              {generating && (
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Generating...</span>
                    <span>{generationProgress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${generationProgress}%` }}></div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <button
                  onClick={generateArticleHandler}
                  disabled={generating || !targetUrl || !topic}
                  className="btn-primary w-full flex items-center justify-center gap-2"
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
                {topic.includes(',') && (
                  <button
                    onClick={generateBatch}
                    disabled={generating || !targetUrl}
                    className="btn-primary w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
                  >
                    <i className="fa-solid fa-layer-group"></i>
                    Batch Generate ({topic.split(',').filter(t => t.trim()).length} articles)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Backlink Preview */}
          {targetUrl && (
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Backlink Preview</h3>
              <div className="p-3 bg-slate-900 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Link will appear as:</p>
                <a href="#" className="text-indigo-400 text-sm hover:underline">{anchorText || 'Your anchor text'}</a>
                <p className="text-xs text-slate-600 mt-1 truncate">→ {targetUrl}</p>
              </div>
            </div>
          )}
        </div>

        {/* Generated Content */}
        <div className="lg:col-span-2">
          <div className="card p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="section-header mb-0">
                <i className="fa-solid fa-file-lines section-icon"></i>
                <h3 className="section-title">Generated Article</h3>
              </div>
              {generatedContent && !generating && (
                <button
                  onClick={saveArticle}
                  className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-500"
                >
                  <i className="fa-solid fa-save"></i>
                  Save to Library
                </button>
              )}
            </div>

            {!generatedContent && !generating && (
              <div className="empty-state py-16">
                <i className="fa-solid fa-wand-magic-sparkles empty-state-icon"></i>
                <p className="empty-state-title">No article generated yet</p>
                <p className="empty-state-description">Configure settings and click Generate to create an AI-written article</p>
              </div>
            )}

            {(generatedContent || generating) && (
              <div className="prose prose-invert max-w-none">
                <div className="console max-h-[600px] overflow-y-auto scrollbar-thin">
                  <pre className="whitespace-pre-wrap text-sm text-slate-200 font-sans leading-relaxed">
                    {generatedContent || 'Initializing AI model...'}
                    {generating && <span className="animate-pulse text-indigo-400">▊</span>}
                  </pre>
                </div>
                {generatedContent && !generating && (
                  <div className="flex items-center gap-4 mt-4 text-xs text-slate-500 flex-wrap">
                    <span><i className="fa-solid fa-font mr-1"></i> {generatedContent.split(/\s+/).length} words</span>
                    <span><i className="fa-solid fa-link mr-1"></i> 2 backlinks</span>
                    <span><i className="fa-solid fa-clock mr-1"></i> {new Date().toLocaleDateString()}</span>
                    {generatedKeywords.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {generatedKeywords.slice(0, 3).map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 bg-purple-900/30 text-purple-400 rounded text-xs">{kw}</span>
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
            <div className="card p-6 mt-6">
              <div className="section-header">
                <i className="fa-solid fa-folder-open section-icon"></i>
                <h3 className="section-title">Saved Articles ({articles.length})</h3>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                {articles.map((article) => (
                  <div key={article.id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <i className="fa-solid fa-file-lines text-slate-500"></i>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 truncate">{article.title}</p>
                      <p className="text-xs text-slate-500">{article.wordCount} words • {article.category} • → {article.targetUrl}</p>
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
