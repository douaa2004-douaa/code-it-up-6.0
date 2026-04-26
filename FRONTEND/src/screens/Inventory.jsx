import { useState } from 'react'
import PageHeader from '../widgets/PageHeader'
import Badge from '../widgets/Badge'

const ITEMS = [
  { id:1,  name:'Sodium Chloride (NaCl)',  cat:'Chemicals',  qty:12,  unit:'kg',   min:20,  location:'Shelf A1', cost:4.50  },
  { id:2,  name:'Distilled Water',         cat:'Solvents',   qty:200, unit:'L',    min:50,  location:'Tank B',   cost:0.80  },
  { id:3,  name:'Copper Wire (16AWG)',      cat:'Electronics',qty:5,   unit:'roll', min:3,   location:'Drawer C3',cost:18.00 },
  { id:4,  name:'Acorn Extract',           cat:'Organic',    qty:0,   unit:'mL',   min:100, location:'Fridge 1', cost:35.00 },
  { id:5,  name:'Hydrochloric Acid',       cat:'Chemicals',  qty:8,   unit:'L',    min:5,   location:'Cabinet D',cost:12.00 },
  { id:6,  name:'Kelp Biomass',            cat:'Organic',    qty:450, unit:'g',    min:200, location:'Tray E2',  cost:2.20  },
  { id:7,  name:'Borosilicate Beakers',    cat:'Glassware',  qty:34,  unit:'pcs',  min:10,  location:'Shelf A3', cost:6.50  },
  { id:8,  name:'pH Buffer Solution',      cat:'Chemicals',  qty:3,   unit:'L',    min:5,   location:'Shelf A2', cost:9.00  },
  { id:9,  name:'Micropipette Tips',       cat:'Supplies',   qty:800, unit:'pcs',  min:200, location:'Box F1',   cost:0.05  },
  { id:10, name:'Arduino Nano',            cat:'Electronics',qty:7,   unit:'pcs',  min:5,   location:'Drawer C1',cost:22.00 },
]

function stockStatus(qty, min) {
  if (qty === 0)         return { label:'Out of Stock', variant:'danger'  }
  if (qty < min)         return { label:'Low Stock',    variant:'warning' }
  if (qty < min * 1.5)   return { label:'OK',           variant:'info'    }
  return                        { label:'In Stock',     variant:'success' }
}

const CATS = ['All', ...new Set(ITEMS.map(i => i.cat))]

export default function Inventory() {
  const [cat, setCat]     = useState('All')
  const [search, setSearch] = useState('')

  const filtered = ITEMS.filter(i =>
    (cat === 'All' || i.cat === cat) &&
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  const outCount = ITEMS.filter(i => i.qty === 0).length
  const lowCount = ITEMS.filter(i => i.qty > 0 && i.qty < i.min).length

  return (
    <div className="page-enter p-6 max-w-7xl mx-auto">
      <PageHeader
        icon="🧪"
        title="Inventory"
        subtitle="Track all lab materials and supplies"
        actions={
          <button className="btn-glow text-white font-bold px-5 py-2.5 rounded-2xl text-sm">
            + Add Item
          </button>
        }
      />

      {/* Alert banners */}
      {(outCount > 0 || lowCount > 0) && (
        <div className="flex flex-wrap gap-3 mb-5">
          {outCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold"
              style={{ background:'rgba(244,67,54,0.15)', border:'1px solid rgba(244,67,54,0.4)', color:'#f44336' }}>
              ⚠️ {outCount} item(s) out of stock
            </div>
          )}
          {lowCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold"
              style={{ background:'rgba(255,152,0,0.15)', border:'1px solid rgba(255,152,0,0.4)', color:'#ff9800' }}>
              📉 {lowCount} item(s) running low
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search inventory…"
          className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-blue-400 text-sm outline-none focus:border-cyan-400 flex-1 min-w-[180px]"
        />
        {CATS.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${
              cat === c ? 'btn-glow text-white' : 'bg-white/10 text-blue-300 hover:bg-white/15'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-blue-400 text-xs uppercase tracking-wider">
                {['Name','Category','Quantity','Min Stock','Location','Unit Cost','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(item => {
                const st = stockStatus(item.qty, item.min)
                return (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-semibold text-white">{item.name}</td>
                    <td className="px-4 py-3 text-blue-300">{item.cat}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${item.qty === 0 ? 'text-red-400' : item.qty < item.min ? 'text-orange-400' : 'text-green-400'}`}>
                        {item.qty}
                      </span>
                      <span className="text-blue-400 ml-1 text-xs">{item.unit}</span>
                    </td>
                    <td className="px-4 py-3 text-blue-400">{item.min} {item.unit}</td>
                    <td className="px-4 py-3 text-blue-300 font-mono text-xs">{item.location}</td>
                    <td className="px-4 py-3 text-blue-200">${item.cost.toFixed(2)}</td>
                    <td className="px-4 py-3"><Badge label={st.label} variant={st.variant} /></td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition mr-3">Edit</button>
                      <button className="text-xs text-orange-400 hover:text-orange-300 font-semibold transition">Order</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-white/10 text-xs text-blue-400">
          Showing {filtered.length} of {ITEMS.length} items
        </div>
      </div>
    </div>
  )
}
