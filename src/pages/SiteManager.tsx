import { useState } from 'react'
import { SiteData } from '../types'

interface SiteManagerProps {
  sites: SiteData[]
  setSites: (sites: SiteData[]) => void
}

export default function SiteManager({ sites, setSites }: SiteManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [bulkMode, setBulkMode] = useState(false)
  const [newSite, setNewSite] = useState({ name: '', url: '', category: 'General' })
  const [bulkText, setBulkText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set(sites.map(s => s.category)))]

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.url.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'All' || site.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const addSite = () => {
    if (!newSite.name || !newSite.url) return
    const site: SiteData = {
      id: Date.now().toString(),
      name: newSite.name,
      url: newSite.url.startsWith('http') ? newSite.url : `https://${newSite.url}`,
      category: newSite.category,
      da: Math.floor(Math.random() * 40) + 60,
      status: 'active',
      articleCount: 0,
      signupMethod: 'email',
      requiresApproval: Math.random() > 0.7,
    }
    setSites([...sites, site])
    setNewSite({ name: '', url: '', category: 'General' })
    setShowAddForm(false)
  }

  const addBulkSites = () => {
    const lines = bulkText.split('\n').filter(l => l.trim())
    const newSites: SiteData[] = lines.map(line => {
      const parts = line.split(',').map(p => p.trim())
      const urlVal = parts[1] || parts[0] || ''
      return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        name: parts[0] || 'Unknown',
        url: urlVal.startsWith('http') ? urlVal : `https://${urlVal}`,
        category: parts[2] || 'General',
        da: Math.floor(Math.random() * 40) + 60,
        status: 'active' as const,
        articleCount: 0,
        signupMethod: 'email' as const,
        requiresApproval: Math.random() > 0.7,
      }
    })
    setSites([...sites, ...newSites])
    setBulkText('')
    setBulkMode(false)
  }

  const removeSite = (id: string) => {
    setSites(sites.filter(s => s.id !== id))
  }

  const toggleStatus = (id: string) => {
    setSites(sites.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' as const : 'active' as const } : s))
  }

  return (
    <div className="animate-slide-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Article Submission Sites</h1>
          <p className="text-slate-400">Manage sites where articles will be published ({sites.length} total)</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setBulkMode(!bulkMode)}
            className="btn-secondary"
          >
            <i className="fa-solid fa-list mr-2"></i>
            Bulk Add
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            Add Site
          </button>
        </div>
      </div>

      {/* Bulk Add */}
      {bulkMode && (
        <div className="card p-6 mb-6 animate-slide-in">
          <h3 className="text-lg font-semibold text-white mb-3">Bulk Import Sites</h3>
          <p className="text-sm text-slate-400 mb-3">Enter one site per line. Format: <code className="text-indigo-400 bg-slate-900 px-2 py-0.5 rounded">Name, URL, Category</code></p>
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            className="input h-40 font-mono resize-none"
            placeholder={`Medium, https://medium.com, General
HubPages, https://hubpages.com, General
Dev.to, https://dev.to, Technology
LinkedIn, https://linkedin.com/pulse, Business
Vocal.media, https://vocal.media, Lifestyle`}
          />
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setBulkMode(false)} className="btn-secondary">Cancel</button>
            <button onClick={addBulkSites} className="btn-primary">
              Import {bulkText.split('\n').filter(l => l.trim()).length} Sites
            </button>
          </div>
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="card p-6 mb-6 animate-slide-in">
          <h3 className="text-lg font-semibold text-white mb-4">Add New Site</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Site Name"
              value={newSite.name}
              onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
              className="input"
            />
            <input
              type="text"
              placeholder="URL (e.g., https://example.com)"
              value={newSite.url}
              onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
              className="input"
            />
            <select
              value={newSite.category}
              onChange={(e) => setNewSite({ ...newSite, category: e.target.value })}
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
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowAddForm(false)} className="btn-secondary">Cancel</button>
            <button onClick={addSite} className="btn-primary">Add Site</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                filterCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSites.map((site) => (
          <div key={site.id} className="card p-5 group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold truncate">{site.name}</h3>
                <p className="text-xs text-slate-500 truncate">{site.url}</p>
              </div>
              <span className={`ml-2 w-2 h-2 rounded-full mt-2 ${site.status === 'active' ? 'bg-green-400' : 'bg-slate-500'}`}></span>
            </div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="badge bg-slate-700 text-slate-300">{site.category}</span>
              <span className="badge bg-indigo-900/50 text-indigo-400 border-indigo-700/30">DA {site.da}</span>
              <span className="badge bg-slate-700 text-slate-400 capitalize">{site.signupMethod}</span>
              {site.requiresApproval && (
                <span className="badge bg-amber-900/50 text-amber-400 border-amber-700/30">Approval</span>
              )}
            </div>
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => toggleStatus(site.id)} className="text-xs text-slate-400 hover:text-white">
                {site.status === 'active' ? '⏸ Disable' : '▶ Enable'}
              </button>
              <button onClick={() => removeSite(site.id)} className="text-xs text-red-400 hover:text-red-300">🗑 Remove</button>
            </div>
          </div>
        ))}
      </div>

      {filteredSites.length === 0 && (
        <div className="empty-state">
          <i className="fa-solid fa-globe empty-state-icon"></i>
          <p className="empty-state-title">No sites found</p>
        </div>
      )}
    </div>
  )
}
