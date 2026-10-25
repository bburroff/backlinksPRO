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

    setEvaluation(evaluateWebsite(url))
    setEvaluating(false)
  }

  const matchingSites = evaluation
    ? sites.filter(site => {
        const techCats = ['Technology', 'General', 'Business']
        return techCats.includes(site.category) && site.da > 80 && site.status === 'active'
      })
    : []

  return (
    <div className="animate-slide-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>AI Powered</span>
          <div className="h-px w-12" style={{ background: 'var(--accent)' }}></div>
        </div>
        <h1 className="display">Site Evaluator<span className="display-serif gradient-text">.</span></h1>
        <p className="mt-2 text-base" style={{ color: 'var(--text-muted)' }}>
          Analyze any website and get AI-powered insights for your content strategy
        </p>
      </div>

      {/* URL Input */}
      <div className="card-static p-6 mb-6">
        <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>Your Website URL</label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <i className="fa-solid fa-globe absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-faint)' }}></i>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="input pl-11"
              onKeyDown={(e) => e.key === 'Enter' && evaluateSite()}
            />
          </div>
          <button
            onClick={evaluateSite}
            disabled={evaluating || !url}
            className="btn-gradient"
          >
            {evaluating ? (
              <>
                <i className="fa-solid fa-spinner animate-spin"></i>
                Analyzing...
              </>
            ) : (
              <>
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                Evaluate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress */}
      {evaluating && (
        <div className="card-static p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-3xl flex items-center justify-center float" style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
              <i className="fa-solid fa-brain text-white text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>AI Analysis in Progress</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Scanning {url}...</p>
            </div>
          </div>
          <div className="space-y-2.5">
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
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  i < evalStep ? 'bg-green-100' :
                  i === evalStep ? 'shimmer' :
                  ''
                }`} style={i >= evalStep ? { background: 'var(--bg-soft)' } : {}}>
                  <i className={`fa-solid text-xs ${
                    i < evalStep ? 'fa-check text-green-600' :
                    i === evalStep ? 'fa-spinner animate-spin' :
                    'fa-circle'
                  }`} style={i >= evalStep && i !== evalStep ? { color: 'var(--text-faint)' } : {}}></i>
                </div>
                <span className={`text-sm ${
                  i < evalStep ? 'font-medium text-green-700' :
                  i === evalStep ? 'font-medium' :
                  ''
                }`} style={{ color: i >= evalStep && i !== evalStep ? 'var(--text-faint)' : 'var(--text)' }}>{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(evalStep / 8) * 100}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {evaluation && !evaluating && (
        <div className="space-y-4">
          {/* Site Overview - Bento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card-static p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
                  <i className="fa-solid fa-chart-simple text-white text-sm"></i>
                </div>
                <h3 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>Site Analysis</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-xl" style={{ background: 'var(--bg-soft)' }}>
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-faint)' }}>Detected Niche</p>
                  <p className="font-semibold" style={{ color: 'var(--text)' }}>{evaluation.niche}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: 'var(--bg-soft)' }}>
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-faint)' }}>Content Tone</p>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{evaluation.tone}</p>
                </div>
              </div>
            </div>
            
            <div className="card-static p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06b6d4, #7c3aed)' }}>
                  <i className="fa-solid fa-users text-white text-sm"></i>
                </div>
                <h3 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>Audience</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-xl" style={{ background: 'var(--bg-soft)' }}>
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-faint)' }}>Target Audience</p>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{evaluation.audience}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: 'var(--bg-soft)' }}>
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-faint)' }}>Estimated Traffic</p>
                  <p className="font-semibold" style={{ color: 'var(--text)' }}>{evaluation.estimatedTraffic}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="card-static p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)' }}>
                <i className="fa-solid fa-tags text-white text-sm"></i>
              </div>
              <h3 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>Identified Keywords</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {evaluation.keywords.map((kw, i) => (
                <span key={i} className="badge badge-purple">{kw}</span>
              ))}
            </div>
          </div>

          {/* Content Strategy + Topics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card-static p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
                  <i className="fa-solid fa-chess text-white text-sm"></i>
                </div>
                <h3 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>Content Strategy</h3>
              </div>
              <div className="space-y-2">
                {evaluation.contentStrategy.map((strategy, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-soft)' }}>
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>{i + 1}</span>
                    <span className="text-sm" style={{ color: 'var(--text)' }}>{strategy}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-static p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                  <i className="fa-solid fa-lightbulb text-white text-sm"></i>
                </div>
                <h3 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>Suggested Topics</h3>
              </div>
              <div className="space-y-2">
                {evaluation.suggestedTopics.map((topic, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/[0.02] transition-colors cursor-pointer" style={{ background: 'var(--bg-soft)' }}>
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>{i + 1}</span>
                    <span className="text-sm" style={{ color: 'var(--text)' }}>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Backlink Opportunities */}
          <div className="card-static p-6">
            <div className="flex items-center gap-4">
              <div className="text-center p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.05))' }}>
                <p className="text-4xl font-bold text-green-600">{evaluation.backlinkOpportunities}</p>
                <p className="text-xs text-green-700 mt-1">Potential Sites</p>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold tracking-tight mb-2" style={{ color: 'var(--text)' }}>Backlink Opportunities</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Based on your niche (<strong style={{ color: 'var(--text)' }}>{evaluation.niche}</strong>), there are approximately <strong style={{ color: 'var(--text)' }}>{evaluation.backlinkOpportunities}</strong> high-quality sites where you could publish articles with backlinks.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {evaluation.competitorSites.map((site, i) => (
                    <span key={i} className="badge badge-neutral">{site}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Matching Sites */}
          {matchingSites.length > 0 && (
            <div className="card-static p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #22c55e, #10b981)' }}>
                  <i className="fa-solid fa-bullseye text-white text-sm"></i>
                </div>
                <h3 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>Best Matching Sites ({matchingSites.length})</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {matchingSites.map((site) => (
                  <div key={site.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-soft)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-green-100">
                      <i className="fa-solid fa-check text-green-600 text-xs"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{site.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-faint)' }}>DA {site.da} • {site.category}</p>
                    </div>
                    <span className="badge badge-success">Good Match</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
