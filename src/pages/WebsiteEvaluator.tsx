import { useState } from 'react'
import { SiteData, SiteEvaluation } from '../types'

interface WebsiteEvaluatorProps {
  sites: SiteData[]
}

export default function WebsiteEvaluator({ sites }: WebsiteEvaluatorProps) {
  const [url, setUrl] = useState('')
  const [evaluating, setEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<SiteEvaluation | null>(null)

  const evaluateSite = async () => {
    if (!url) return
    setEvaluating(true)
    
    // Simulate AI evaluation
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    const mockEvaluations: Record<string, Partial<SiteEvaluation>> = {
      default: {
        title: url.includes('shop') ? 'E-Commerce & Online Shopping' :
               url.includes('tech') ? 'Technology & Innovation' :
               url.includes('health') ? 'Health & Wellness' :
               'Digital Business Solutions',
        description: 'A modern website focused on delivering value to its audience through quality content and services.',
        niche: url.includes('shop') ? 'E-Commerce' :
               url.includes('tech') ? 'Technology' :
               url.includes('health') ? 'Healthcare' :
               'Business & Technology',
        keywords: ['digital marketing', 'online presence', 'growth strategy', 'content marketing', 'SEO optimization'],
        tone: 'Professional yet approachable',
        audience: 'Business professionals, entrepreneurs, and digital enthusiasts aged 25-45',
        suggestedTopics: [
          'How to Build a Strong Online Presence in 2026',
          'The Future of Digital Marketing: Trends to Watch',
          '5 Strategies to Boost Your Website Traffic Organically',
          'Why Content Marketing is Essential for Business Growth',
          'Mastering SEO: A Complete Guide for Beginners',
        ],
      }
    }

    setEvaluation({
      url,
      ...mockEvaluations.default,
    } as SiteEvaluation)
    setEvaluating(false)
  }

  const matchingSites = sites.filter(site => {
    if (!evaluation) return []
    const techSites = ['Technology', 'General']
    return techSites.includes(site.category) && site.da > 80
  })

  return (
    <div className="animate-slide-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Site Evaluator</h1>
        <p className="text-slate-400">Enter your website URL and let AI analyze it for optimal article strategy</p>
      </div>

      {/* URL Input */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-3">Your Website URL</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yourwebsite.com"
            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={evaluateSite}
            disabled={evaluating || !url}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center gap-2"
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

      {/* Evaluation Results */}
      {evaluating && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-brain text-indigo-400 animate-pulse"></i>
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Analysis in Progress</h3>
              <p className="text-sm text-slate-400">Scanning website content, structure, and niche...</p>
            </div>
          </div>
          <div className="space-y-3">
            {['Fetching website data...', 'Analyzing content structure...', 'Identifying niche & keywords...', 'Generating recommendations...'].map((step, i) => (
              <div key={i} className="flex items-center gap-3" style={{ animationDelay: `${i * 0.5}s` }}>
                <i className={`fa-solid ${i < 2 ? 'fa-check text-green-400' : 'fa-spinner animate-spin text-indigo-400'}`}></i>
                <span className={`text-sm ${i < 2 ? 'text-green-400' : 'text-slate-400'}`}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {evaluation && !evaluating && (
        <div className="space-y-6">
          {/* Site Overview */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-chart-simple text-indigo-400"></i>
              Site Analysis
            </h3>
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
                <p className="text-xs text-slate-500 mb-1">Website</p>
                <p className="text-indigo-400 font-medium text-sm truncate">{evaluation.url}</p>
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-tags text-purple-400"></i>
              Identified Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {evaluation.keywords.map((kw, i) => (
                <span key={i} className="px-3 py-1.5 bg-purple-900/30 text-purple-300 rounded-full text-sm border border-purple-700/30">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Suggested Topics */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-lightbulb text-yellow-400"></i>
              AI-Suggested Article Topics
            </h3>
            <div className="space-y-2">
              {evaluation.suggestedTopics.map((topic, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                  <span className="w-6 h-6 bg-indigo-600/30 text-indigo-400 rounded flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <span className="text-sm text-slate-200">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Matching Sites */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-bullseye text-green-400"></i>
              Best Matching Sites ({matchingSites.length})
            </h3>
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
                  <span className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded">Good Match</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
