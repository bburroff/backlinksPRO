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
    <div className="animate-slide-in">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">AI Article Writer</h1>
        <p className="text-slate-400 text-lg">Generate custom articles with backlinks to your website</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="icon-container bg-gradient-to-br from-indigo-500 to-purple-600">
                <i className="fa-solid fa-sliders text-white"></i>
              </div>
              <h3 className="section-title-modern">Configuration</h3>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-slate-400 mb-2 font-semibold">Target Website URL *</label>
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="input-modern"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2 font-semibold">Anchor Text</label>
                <input
                  type="text"
                  value={anchorText}
                  onChange={(e) => setAnchorText(e.target.value)}
                  placeholder="Click here to learn more"
                  className="input-modern"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2 font-semibold">Article Topic(s) *</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Digital Marketing, SEO Tips"
                  className="input-modern"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2 font-semibold">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-modern"
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
                <label className="block text-sm text-slate-400 mb-2 font-semibold">Target Word Count: ~{wordCount}</label>
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
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold">Generating...</span>
                    <span className="font-bold">{generationProgress}%</span>
                  </div>
                  <div className="progress-modern">
                    <div className="progress-fill-modern" style={{ width: `${generationProgress}%` }}></div>
                  </div>
                </div>
              )}

              <button
                onClick={generateArticleHandler}
                disabled={generating || !targetUrl || !topic}
                className="btn-modern w-full flex items-center justify-center gap-3 disabled:opacity-50"
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

          {targetUrl && (
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-white mb-3">Backlink Preview</h3>
              <div className="p-4 bg-white/5 rounded-2xl">
                <p className="text-xs text-slate-500 mb-2 font-semibold">Link will appear as:</p>
                <a href="#" className="text-indigo-400 text-sm hover:underline font-semibold">{anchorText || 'Your anchor text'}</a>
                <p className="text-xs text-slate-600 mt-2 truncate">→ {targetUrl}</p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="glass-card p-8 h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="icon-container bg-gradient-to-br from-purple-500 to-pink-600">
                  <i className="fa-solid fa-file-lines text-white"></i>
                </div>
                <h3 className="section-title-modern">Generated Article</h3>
              </div>
              {generatedContent && !generating && (
                <button
                  onClick={saveArticle}
                  className="btn-modern flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600"
                >
                  <i className="fa-solid fa-save"></i>
                  Save to Library
                </button>
              )}
            </div>

            {!generatedContent && !generating && (
              <div className="empty-state-modern py-20">
                <i className="fa-solid fa-wand-magic-sparkles empty-state-icon-modern"></i>
                <p className="text-slate-400 text-lg font-semibold mb-2">No article generated yet</p>
                <p className="text-slate-500 text-sm">Configure settings and click Generate</p>
              </div>
            )}

            {(generatedContent || generating) && (
              <div>
                <div className="console-modern max-h-[600px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-slate-200 font-sans leading-relaxed">
                    {generatedContent || 'Initializing AI model...'}
                    {generating && <span className="animate-pulse text-indigo-400">▊</span>}
                  </pre>
                </div>
                {generatedContent && !generating && (
                  <div className="flex items-center gap-6 mt-6 text-xs text-slate-500 flex-wrap">
                    <span className="font-semibold"><i className="fa-solid fa-font mr-2"></i>{generatedContent.split(/\s+/).length} words</span>
                    <span className="font-semibold"><i className="fa-solid fa-link mr-2"></i>2 backlinks</span>
                    <span className="font-semibold"><i className="fa-solid fa-clock mr-2"></i>{new Date().toLocaleDateString()}</span>
                    {generatedKeywords.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {generatedKeywords.slice(0, 3).map((kw, i) => (
                          <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-semibold">{kw}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {articles.length > 0 && (
            <div className="glass-card p-8 mt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="icon-container bg-gradient-to-br from-amber-500 to-orange-600">
                  <i className="fa-solid fa-folder-open text-white"></i>
                </div>
                <h3 className="section-title-modern">Saved Articles ({articles.length})</h3>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {articles.map((article) => (
                  <div key={article.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                    <i className="fa-solid fa-file-lines text-slate-500 text-lg"></i>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-semibold truncate">{article.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{article.wordCount} words • {article.category}</p>
                    </div>
                    <span className="badge-modern badge-success-modern">{article.status}</span>
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
