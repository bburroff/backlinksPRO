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
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Article Submission Sites</h1>
          <p className="text-slate-400 text-lg">Manage sites where articles will be published ({sites.length} total)</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setBulkMode(!bulkMode)}
            className="btn-secondary-modern flex items-center gap-2"
          >
            <i className="fa-solid fa-list"></i>
            Bulk Add
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-modern flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            Add Site
          </button>
        </div>
      </div>

      {bulkMode && (
        <div className="glass-card p-8 mb-8 animate-slide-in">
          <h3 className="text-xl font-bold text-white mb-4">Bulk Import Sites</h3>
          <p className="text-slate-400 mb-4">Enter one site per line. Format: <code className="text-indigo-400 bg-white/5 px-2 py-1 rounded-lg">Name, URL, Category</code></p>
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            className="input-modern h-40 font-mono resize-none"
            placeholder={`Medium, https://medium.com, General
HubPages, https://hubpages.com, General
Dev.to, https://dev.to, Technology`}
          />
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setBulkMode(false)} className="btn-secondary-modern">Cancel</button>
            <button onClick={addBulkSites} className="btn-modern">
              Import {bulkText.split('\n').filter(l => l.trim()).length} Sites
            </button>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="glass-card p-8 mb-8 animate-slide-in">
          <h3 className="text-xl font-bold text-white mb-6">Add New Site</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Site Name"
              value={newSite.name}
              onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
              className="input-modern"
            />
            <input
              type="text"
              placeholder="URL (e.g., https://example.com)"
              value={newSite.url}
              onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
              className="input-modern"
            />
            <select
              value={newSite.category}
              onChange={(e) => setNewSite({ ...newSite, category: e.target.value })}
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
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setShowAddForm(false)} className="btn-secondary-modern">Cancel</button>
            <button onClick={addSite} className="btn-modern">Add Site</button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-modern"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                filterCategory === cat 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg glow-purple' 
                  : 'glass-card text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSites.map((site) => (
          <div key={site.id} className="glass-card p-6 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-lg truncate">{site.name}</h3>
                <p className="text-xs text-slate-500 truncate mt-1">{site.url}</p>
              </div>
              <span className={`ml-3 w-3 h-3 rounded-full ${site.status === 'active' ? 'bg-green-400 shadow-lg glow-green' : 'bg-slate-500'}`}></span>
            </div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="badge-modern bg-white/10 text-slate-300 border-white/20">{site.category}</span>
              <span className="badge-modern bg-indigo-500/20 text-indigo-300 border-indigo-400/30">DA {site.da}</span>
              <span className="badge-modern bg-white/10 text-slate-400 border-white/20 capitalize">{site.signupMethod}</span>
              {site.requiresApproval && (
                <span className="badge-modern bg-amber-500/20 text-amber-300 border-amber-400/30">Approval</span>
              )}
            </div>
            <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all">
              <button onClick={() => toggleStatus(site.id)} className="text-xs text-slate-400 hover:text-white font-semibold">
                {site.status === 'active' ? '⏸ Disable' : '▶ Enable'}
              </button>
              <button onClick={() => removeSite(site.id)} className="text-xs text-red-400 hover:text-red-300 font-semibold">🗑 Remove</button>
            </div>
          </div>
        ))}
      </div>

      {filteredSites.length === 0 && (
        <div className="empty-state-modern">
          <i className="fa-solid fa-globe empty-state-icon-modern"></i>
          <p className="text-slate-400 text-lg font-semibold">No sites found</p>
        </div>
      )}
    </div>
  )
}
