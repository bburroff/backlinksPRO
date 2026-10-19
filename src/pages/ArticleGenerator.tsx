import { useState } from 'react'
import { ArticleData, SiteData } from '../types'

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

  const generateArticle = async () => {
    if (!targetUrl || !topic) return
    setGenerating(true)
    setGeneratedContent('')
    setGeneratedTitle('')

    // Simulate AI generation with progressive text
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const title = `${topic}: A Comprehensive Guide for ${new Date().getFullYear()}`
    setGeneratedTitle(title)

    const content = `# ${title}

In today's rapidly evolving digital landscape, understanding ${topic.toLowerCase()} has become more important than ever. Whether you're a seasoned professional or just getting started, this guide will provide you with actionable insights and strategies to succeed.

## Understanding the Fundamentals

Before diving deep into ${topic.toLowerCase()}, it's essential to grasp the core concepts that form the foundation of this field. The key principles revolve around strategic planning, consistent execution, and continuous optimization.

Many experts in the field recommend starting with a solid understanding of the basics. According to industry leaders, "The most successful approach combines traditional wisdom with innovative thinking."

## Key Strategies for Success

### 1. Research and Analysis
Thorough research is the cornerstone of any successful strategy. By analyzing market trends, competitor activities, and audience behavior, you can develop a data-driven approach that yields better results.

### 2. Content-Driven Approach
Quality content remains king in the digital world. Creating valuable, informative, and engaging content helps establish authority and build trust with your audience.

### 3. Leverage Technology
Modern tools and platforms can significantly enhance your efforts. From AI-powered analytics to automation software, technology offers unprecedented opportunities for growth.

Visit [${anchorText || 'our website'}](${targetUrl}) to learn more about how these strategies can be applied to your specific situation.

## Implementation Steps

Getting started with ${topic.toLowerCase()} doesn't have to be overwhelming. Follow these steps:

1. **Assess your current position** - Understand where you stand today
2. **Set clear objectives** - Define what success looks like for you
3. **Create an action plan** - Break down goals into manageable tasks
4. **Execute consistently** - Implementation is where results come from
5. **Measure and optimize** - Track progress and refine your approach

## Common Mistakes to Avoid

Even experienced professionals can fall into common traps:
- Neglecting the fundamentals in pursuit of advanced tactics
- Failing to adapt to changing market conditions
- Underestimating the power of consistency
- Not measuring results effectively

## Conclusion

Mastering ${topic.toLowerCase()} is a journey, not a destination. By following the strategies outlined in this guide and staying committed to continuous improvement, you'll be well-positioned for success.

For more insights and resources on ${topic.toLowerCase()}, check out [${anchorText || 'our expert resources'}](${targetUrl}) where you'll find in-depth guides, case studies, and expert advice.

---

*This article was crafted to provide genuine value to readers seeking to improve their understanding of ${topic.toLowerCase()}.*`

    // Simulate typing effect
    const words = content.split(' ')
    let currentContent = ''
    for (let i = 0; i < words.length; i++) {
      currentContent += words[i] + ' '
      if (i % 5 === 0) {
        await new Promise(resolve => setTimeout(resolve, 10))
        setGeneratedContent(currentContent)
      }
    }
    setGeneratedContent(content)
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
    }
    setArticles([...articles, article])
    setGeneratedContent('')
    setGeneratedTitle('')
    setTopic('')
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
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-sliders text-indigo-400"></i>
              Configuration
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Target Website URL</label>
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Anchor Text</label>
                <input
                  type="text"
                  value={anchorText}
                  onChange={(e) => setAnchorText(e.target.value)}
                  placeholder="Click here to learn more"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Article Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Digital Marketing Strategies"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
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
                <label className="block text-sm text-slate-400 mb-1">Target Word Count: {wordCount}</label>
                <input
                  type="range"
                  min="300"
                  max="2000"
                  step="100"
                  value={wordCount}
                  onChange={(e) => setWordCount(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <button
                onClick={generateArticle}
                disabled={generating || !targetUrl || !topic}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <i className="fa-solid fa-robot animate-pulse"></i>
                    Generating Article...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    Generate Article with AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Backlink Preview */}
          {targetUrl && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
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
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <i className="fa-solid fa-file-lines text-purple-400"></i>
                Generated Article
              </h3>
              {generatedContent && (
                <button
                  onClick={saveArticle}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 text-sm font-medium flex items-center gap-2"
                >
                  <i className="fa-solid fa-save"></i>
                  Save Article
                </button>
              )}
            </div>

            {!generatedContent && !generating && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <i className="fa-solid fa-wand-magic-sparkles text-5xl text-slate-600 mb-4"></i>
                <p className="text-slate-500 mb-2">No article generated yet</p>
                <p className="text-slate-600 text-sm">Configure settings and click Generate to create an AI-written article</p>
              </div>
            )}

            {(generatedContent || generating) && (
              <div className="prose prose-invert max-w-none">
                <div className="bg-slate-900 rounded-lg p-6 max-h-[600px] overflow-y-auto scrollbar-thin">
                  <pre className="whitespace-pre-wrap text-sm text-slate-200 font-sans leading-relaxed">
                    {generatedContent || 'Generating...'}
                    {generating && <span className="animate-pulse">▊</span>}
                  </pre>
                </div>
                {generatedContent && (
                  <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                    <span><i className="fa-solid fa-font mr-1"></i> {generatedContent.split(/\s+/).length} words</span>
                    <span><i className="fa-solid fa-link mr-1"></i> 2 backlinks</span>
                    <span><i className="fa-solid fa-clock mr-1"></i> {new Date().toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Saved Articles */}
          {articles.length > 0 && (
            <div className="mt-6 bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <i className="fa-solid fa-folder-open text-amber-400"></i>
                Saved Articles ({articles.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                {articles.map((article) => (
                  <div key={article.id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <i className="fa-solid fa-file-lines text-slate-500"></i>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 truncate">{article.title}</p>
                      <p className="text-xs text-slate-500">{article.wordCount} words • {article.category}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-900/50 text-green-400 rounded">{article.status}</span>
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
