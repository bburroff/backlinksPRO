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
    <div className="animate-slide-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>Manage</span>
            <div className="h-px w-12" style={{ background: 'var(--accent)' }}></div>
          </div>
          <h1 className="display">Article Sites<span className="display-serif gradient-text">.</span></h1>
          <p className="mt-2 text-base" style={{ color: 'var(--text-muted)' }}>
            {sites.length} sites ready for publishing
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setBulkMode(!bulkMode)} className="btn-secondary">
            <i className="fa-solid fa-layer-group"></i>
            Bulk Add
          </button>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary">
            <i className="fa-solid fa-plus"></i>
            Add Site
          </button>
        </div>
      </div>

      {/* Bulk Add */}
      {bulkMode && (
        <div className="card-static p-6 mb-6 animate-slide-in">
          <h3 className="text-lg font-bold tracking-tight mb-2" style={{ color: 'var(--text)' }}>Bulk Import Sites</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            Enter one site per line. Format: <code className="px-2 py-0.5 rounded-md text-xs font-mono" style={{ background: 'var(--bg-soft)', color: 'var(--accent)' }}>Name, URL, Category</code>
          </p>
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            className="input h-40 font-mono resize-none"
            placeholder={`Medium, https://medium.com, General
HubPages, https://hubpages.com, General
Dev.to, https://dev.to, Technology`}
          />
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setBulkMode(false)} className="btn-ghost">Cancel</button>
            <button onClick={addBulkSites} className="btn-primary">
              Import {bulkText.split('\n').filter(l => l.trim()).length} Sites
            </button>
          </div>
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="card-static p-6 mb-6 animate-slide-in">
          <h3 className="text-lg font-bold tracking-tight mb-4" style={{ color: 'var(--text)' }}>Add New Site</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="text" placeholder="Site Name" value={newSite.name} onChange={(e) => setNewSite({ ...newSite, name: e.target.value })} className="input" />
            <input type="text" placeholder="https://example.com" value={newSite.url} onChange={(e) => setNewSite({ ...newSite, url: e.target.value })} className="input" />
            <select value={newSite.category} onChange={(e) => setNewSite({ ...newSite, category: e.target.value })} className="input">
              <option>General</option>
              <option>Technology</option>
              <option>Business</option>
              <option>Health</option>
              <option>Lifestyle</option>
              <option>Education</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setShowAddForm(false)} className="btn-ghost">Cancel</button>
            <button onClick={addSite} className="btn-primary">Add Site</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-faint)' }}></i>
          <input
            type="text"
            placeholder="Search sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-11"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap p-1 rounded-2xl" style={{ background: 'var(--bg-soft)' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filterCategory === cat 
                  ? 'bg-white shadow-sm font-semibold' 
                  : 'hover:bg-white/50'
              }`}
              style={{ color: filterCategory === cat ? 'var(--text)' : 'var(--text-muted)' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSites.map((site) => (
          <div key={site.id} className="card p-5 group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate" style={{ color: 'var(--text)' }}>{site.name}</h3>
                  <span className={`w-1.5 h-1.5 rounded-full ${site.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                </div>
                <p className="text-xs truncate" style={{ color: 'var(--text-faint)' }}>{site.url}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mb-4 flex-wrap">
              <span className="badge badge-neutral">{site.category}</span>
              <span className="badge badge-purple">DA {site.da}</span>
              {site.requiresApproval && (
                <span className="badge badge-warning">Approval</span>
              )}
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => toggleStatus(site.id)} className="btn-ghost text-xs py-1 px-2">
                {site.status === 'active' ? '⏸ Disable' : '▶ Enable'}
              </button>
              <button onClick={() => removeSite(site.id)} className="btn-ghost text-xs py-1 px-2 text-red-500 hover:text-red-600">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSites.length === 0 && (
        <div className="empty-state">
          <div className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--bg-soft)' }}>
            <i className="fa-solid fa-globe text-2xl" style={{ color: 'var(--text-faint)' }}></i>
          </div>
          <p className="font-semibold" style={{ color: 'var(--text-muted)' }}>No sites found</p>
        </div>
      )}
    </div>
  )
}
