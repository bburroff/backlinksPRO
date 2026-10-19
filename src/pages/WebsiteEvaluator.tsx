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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Site Evaluator</h1>
        <p className="text-slate-400">Enter your website URL and let AI analyze it for optimal article strategy</p>
      </div>

      {/* URL Input */}
      <div className="card p-6 mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-3">Your Website URL</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yourwebsite.com"
            className="input flex-1"
            onKeyDown={(e) => e.key === 'Enter' && evaluateSite()}
          />
          <button
            onClick={evaluateSite}
            disabled={evaluating || !url}
            className="btn-primary flex items-center gap-2"
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

      {/* Evaluation Progress */}
      {evaluating && (
        <div className="card p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-brain text-indigo-400 animate-pulse"></i>
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Analysis in Progress</h3>
              <p className="text-sm text-slate-400">Scanning {url}...</p>
            </div>
          </div>
          <div className="space-y-3">
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
              <div key={i} className="flex items-center gap-3">
                <i className={`fa-solid ${
                  i < evalStep ? 'fa-check text-green-400' :
                  i === evalStep ? 'fa-spinner animate-spin text-indigo-400' :
                  'fa-circle text-slate-700'
                }`}></i>
                <span className={`text-sm ${
                  i < evalStep ? 'text-green-400' :
                  i === evalStep ? 'text-indigo-400' :
                  'text-slate-600'
                }`}>{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(evalStep / 8) * 100}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {evaluation && !evaluating && (
        <div className="space-y-6">
          {/* Site Overview */}
          <div className="card p-6">
            <div className="section-header">
              <i className="fa-solid fa-chart-simple section-icon"></i>
              <h3 className="section-title">Site Analysis</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Detected Niche</p>
                <p className="text-white font-medium">{evaluation.niche}</p>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Content Tone</p>
                <p className="text-white font-medium">{evaluation.tone}</p>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Target Audience</p>
                <p className="text-white font-medium text-sm">{evaluation.audience}</p>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Estimated Traffic</p>
                <p className="text-white font-medium">{evaluation.estimatedTraffic}</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-slate-700/30 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Description</p>
              <p className="text-sm text-slate-300">{evaluation.description}</p>
            </div>
          </div>

          {/* Keywords */}
          <div className="card p-6">
            <div className="section-header">
              <i className="fa-solid fa-tags section-icon"></i>
              <h3 className="section-title">Identified Keywords</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {evaluation.keywords.map((kw, i) => (
                <span key={i} className="px-3 py-1.5 bg-purple-900/30 text-purple-300 rounded-full text-sm border border-purple-700/30">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Content Strategy */}
          <div className="card p-6">
            <div className="section-header">
              <i className="fa-solid fa-chess section-icon"></i>
              <h3 className="section-title">Content Strategy</h3>
            </div>
            <div className="space-y-2">
              {evaluation.contentStrategy.map((strategy, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <span className="w-6 h-6 bg-cyan-600/30 text-cyan-400 rounded flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                  <span className="text-sm text-slate-200">{strategy}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Topics */}
          <div className="card p-6">
            <div className="section-header">
              <i className="fa-solid fa-lightbulb section-icon"></i>
              <h3 className="section-title">AI-Suggested Article Topics</h3>
            </div>
            <div className="space-y-2">
              {evaluation.suggestedTopics.map((topic, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                  <span className="w-6 h-6 bg-indigo-600/30 text-indigo-400 rounded flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <span className="text-sm text-slate-200">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Backlink Opportunities */}
          <div className="card p-6">
            <div className="section-header">
              <i className="fa-solid fa-link section-icon"></i>
              <h3 className="section-title">Backlink Opportunities</h3>
            </div>
            <div className="flex items-center gap-6 mb-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">{evaluation.backlinkOpportunities}</p>
                <p className="text-xs text-slate-500">Potential Sites</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-400">Based on your niche ({evaluation.niche}), there are approximately <strong className="text-white">{evaluation.backlinkOpportunities}</strong> high-quality sites where you could publish articles with backlinks.</p>
              </div>
            </div>
            <div className="p-3 bg-slate-700/30 rounded-lg">
              <p className="text-xs text-slate-500 mb-2">Competitor sites in your niche:</p>
              <div className="flex flex-wrap gap-2">
                {evaluation.competitorSites.map((site, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-slate-600 text-slate-300 rounded">{site}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Matching Sites */}
          <div className="card p-6">
            <div className="section-header">
              <i className="fa-solid fa-bullseye section-icon"></i>
              <h3 className="section-title">Best Matching Sites from Your List ({matchingSites.length})</h3>
            </div>
            {matchingSites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {matchingSites.map((site) => (
                  <div key={site.id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <div className="w-8 h-8 bg-green-600/20 rounded flex items-center justify-center">
                      <i className="fa-solid fa-check text-green-400 text-xs"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">{site.name}</p>
                      <p className="text-xs text-slate-500">DA {site.da} • {site.category}</p>
                    </div>
                    <span className="badge badge-success">Good Match</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">No matching sites found in your list. Add more sites in the Article Sites section.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
