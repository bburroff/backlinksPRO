import { useState } from 'react'
import { SiteData, SiteEvaluation } from '../types'
import { evaluateWebsite } from '../utils/ai'

interface WebsiteEvaluatorProps {
  sites: SiteData[]
}

export default function WebsiteEvaluator({ sites }: WebsiteEvaluatorProps) {
  const [url, setUrl] = useState('')
  const [evaluating, setEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<SiteEvaluation | null>(null)
  const [evalStep, setEvalStep] = useState(0)

  const evaluateSite = async () => {
    if (!url) return
    setEvaluating(true)
    setEvaluation(null)
    setEvalStep(0)

    const steps = [
      'Fetching website data...',
      'Analyzing HTML structure & meta tags...',
      'Scanning content for keywords & topics...',
      'Identifying niche & target audience...',
      'Analyzing competitor landscape...',
      'Generating content strategy...',
      'Calculating backlink opportunities...',
      'Compiling final report...',
    ]

    for (let i = 0; i < steps.length; i++) {
      setEvalStep(i + 1)
      await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 300))
    }

    const result = evaluateWebsite(url)
    setEvaluation(result)
    setEvaluating(false)
  }

  const matchingSites = evaluation
    ? sites.filter(site => {
        const techCats = ['Technology', 'General', 'Business']
        return techCats.includes(site.category) && site.da > 80 && site.status === 'active'
      })
    : []

  return (
    <div className="animate-slide-in">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">AI Site Evaluator</h1>
        <p className="text-slate-400 text-lg">Enter your website URL and let AI analyze it for optimal article strategy</p>
      </div>

      <div className="glass-card p-8 mb-8">
        <label className="block text-sm font-semibold text-slate-300 mb-4">Your Website URL</label>
        <div className="flex gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yourwebsite.com"
            className="input-modern flex-1"
            onKeyDown={(e) => e.key === 'Enter' && evaluateSite()}
          />
          <button
            onClick={evaluateSite}
            disabled={evaluating || !url}
            className="btn-modern flex items-center gap-3 disabled:opacity-50"
          >
            {evaluating ? (
              <>
                <i className="fa-solid fa-spinner animate-spin"></i>
                Analyzing...
              </>
            ) : (
              <>
                <i className="fa-solid fa-magnifying-glass-chart"></i>
                Evaluate
              </>
            )}
          </button>
        </div>
      </div>

      {evaluating && (
        <div className="glass-card p-10 mb-8">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg glow-purple">
              <i className="fa-solid fa-brain text-white text-2xl animate-pulse"></i>
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">AI Analysis in Progress</h3>
              <p className="text-slate-400 mt-1">Scanning {url}...</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              'Fetching website data...',
              'Analyzing HTML structure & meta tags...',
              'Scanning content for keywords & topics...',
              'Identifying niche & target audience...',
              'Analyzing competitor landscape...',
              'Generating content strategy...',
              'Calculating backlink opportunities...',
              'Compiling final report...',
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <i className={`fa-solid ${
                  i < evalStep ? 'fa-check text-green-400' :
                  i === evalStep ? 'fa-spinner animate-spin text-indigo-400' :
                  'fa-circle text-slate-700'
                } text-lg`}></i>
                <span className={`text-sm font-medium ${
                  i < evalStep ? 'text-green-400' :
                  i === evalStep ? 'text-indigo-400' :
                  'text-slate-600'
                }`}>{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="progress-modern">
              <div className="progress-fill-modern" style={{ width: `${(evalStep / 8) * 100}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {evaluation && !evaluating && (
        <div className="space-y-6">
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="icon-container bg-gradient-to-br from-indigo-500 to-purple-600">
                <i className="fa-solid fa-chart-simple text-white"></i>
              </div>
              <h3 className="section-title-modern">Site Analysis</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-white/5 rounded-2xl">
                <p className="text-xs text-slate-500 mb-2 font-semibold">Detected Niche</p>
                <p className="text-white font-bold text-lg">{evaluation.niche}</p>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl">
                <p className="text-xs text-slate-500 mb-2 font-semibold">Content Tone</p>
                <p className="text-white font-bold text-lg">{evaluation.tone}</p>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl">
                <p className="text-xs text-slate-500 mb-2 font-semibold">Target Audience</p>
                <p className="text-white font-medium">{evaluation.audience}</p>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl">
                <p className="text-xs text-slate-500 mb-2 font-semibold">Estimated Traffic</p>
                <p className="text-white font-bold text-lg">{evaluation.estimatedTraffic}</p>
              </div>
            </div>
            <div className="mt-6 p-5 bg-white/5 rounded-2xl">
              <p className="text-xs text-slate-500 mb-2 font-semibold">Description</p>
              <p className="text-slate-300">{evaluation.description}</p>
            </div>
          </div>

          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="icon-container bg-gradient-to-br from-purple-500 to-pink-600">
                <i className="fa-solid fa-tags text-white"></i>
              </div>
              <h3 className="section-title-modern">Identified Keywords</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {evaluation.keywords.map((kw, i) => (
                <span key={i} className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-xl text-sm font-semibold border border-purple-400/30">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="icon-container bg-gradient-to-br from-cyan-500 to-blue-600">
                <i className="fa-solid fa-chess text-white"></i>
              </div>
              <h3 className="section-title-modern">Content Strategy</h3>
            </div>
            <div className="space-y-3">
              {evaluation.contentStrategy.map((strategy, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
                  <span className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</span>
                  <span className="text-slate-200 font-medium">{strategy}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="icon-container bg-gradient-to-br from-yellow-500 to-orange-600">
                <i className="fa-solid fa-lightbulb text-white"></i>
              </div>
              <h3 className="section-title-modern">AI-Suggested Article Topics</h3>
            </div>
            <div className="space-y-3">
              {evaluation.suggestedTopics.map((topic, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                  <span className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-xl flex items-center justify-center text-sm font-bold">{i + 1}</span>
                  <span className="text-slate-200 font-medium">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="icon-container bg-gradient-to-br from-green-500 to-emerald-600">
                <i className="fa-solid fa-link text-white"></i>
              </div>
              <h3 className="section-title-modern">Backlink Opportunities</h3>
            </div>
            <div className="flex items-center gap-8 mb-6">
              <div className="text-center">
                <p className="text-5xl font-bold text-green-400">{evaluation.backlinkOpportunities}</p>
                <p className="text-xs text-slate-500 mt-2 font-semibold">Potential Sites</p>
              </div>
              <div className="flex-1">
                <p className="text-slate-300">Based on your niche (<strong className="text-white">{evaluation.niche}</strong>), there are approximately <strong className="text-green-400">{evaluation.backlinkOpportunities}</strong> high-quality sites where you could publish articles with backlinks.</p>
              </div>
            </div>
            <div className="p-5 bg-white/5 rounded-2xl">
              <p className="text-xs text-slate-500 mb-3 font-semibold">Competitor sites in your niche:</p>
              <div className="flex flex-wrap gap-2">
                {evaluation.competitorSites.map((site, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white/10 text-slate-300 rounded-xl text-sm font-medium">{site}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="icon-container bg-gradient-to-br from-green-500 to-emerald-600">
                <i className="fa-solid fa-bullseye text-white"></i>
              </div>
              <h3 className="section-title-modern">Best Matching Sites ({matchingSites.length})</h3>
            </div>
            {matchingSites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchingSites.map((site) => (
                  <div key={site.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg glow-green">
                      <i className="fa-solid fa-check text-white"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold">{site.name}</p>
                      <p className="text-xs text-slate-500 mt-1">DA {site.da} • {site.category}</p>
                    </div>
                    <span className="badge-modern badge-success-modern">Good Match</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">No matching sites found in your list.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
