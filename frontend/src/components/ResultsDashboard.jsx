// Category colour palette — cycles through these
const CATEGORY_COLORS = [
  { bar: 'bg-forest-700', text: 'text-forest-800', bg: 'bg-forest-800/8'  },
  { bar: 'bg-gold',       text: 'text-gold',       bg: 'bg-gold/8'        },
  { bar: 'bg-forest-500', text: 'text-forest-700', bg: 'bg-forest-500/10' },
  { bar: 'bg-amber-500',  text: 'text-amber-700',  bg: 'bg-amber-50'      },
  { bar: 'bg-teal-600',   text: 'text-teal-700',   bg: 'bg-teal-50'       },
  { bar: 'bg-rose-400',   text: 'text-rose-700',   bg: 'bg-rose-50'       },
  { bar: 'bg-violet-500', text: 'text-violet-700', bg: 'bg-violet-50'     },
  { bar: 'bg-sky-500',    text: 'text-sky-700',    bg: 'bg-sky-50'        },
]

function fmt(amount, currency = '$') {
  return `${currency}${Math.abs(amount).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="card p-5">
      <p className="label mb-2">{label}</p>
      <p className={`font-display text-2xl font-semibold ${accent ?? 'text-ink'}`}>{value}</p>
      {sub && <p className="text-xs text-muted mt-1 font-mono">{sub}</p>}
    </div>
  )
}

function CategoryRow({ category, total, percentage, transactions, color, currency }) {
  return (
    <div className="py-4 border-b border-cream-200 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${color.bar} shrink-0`} />
          <span className="font-body font-medium text-sm text-ink">{category}</span>
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}>
            {percentage.toFixed(1)}%
          </span>
        </div>
        <span className="font-mono text-sm font-medium text-ink">{fmt(total, currency)}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-cream-200 rounded-full mb-2.5">
        <div
          className={`h-full rounded-full ${color.bar} transition-all duration-700`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Transactions list */}
      <div className="flex flex-wrap gap-1.5">
        {transactions.slice(0, 4).map((t, i) => (
          <span key={i} className="text-xs font-mono text-muted bg-cream-100 border border-cream-200 px-2 py-0.5 rounded-md">
            {t}
          </span>
        ))}
        {transactions.length > 4 && (
          <span className="text-xs font-mono text-muted px-2 py-0.5">
            +{transactions.length - 4} more
          </span>
        )}
      </div>
    </div>
  )
}

export default function ResultsDashboard({ result, onReset }) {
  const { total_spending, total_income, net, currency, categories, insights, summary, top_merchant, largest_expense } = result
  const cur = currency || '$'

  return (
    <div className="max-w-3xl mx-auto animate-fade-up">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="label mb-1">Analysis Complete</p>
          <h2 className="font-display text-3xl font-semibold text-ink">Your spending report</h2>
        </div>
        <button
          onClick={onReset}
          className="text-sm font-mono text-muted hover:text-ink transition-colors border border-cream-300 hover:border-cream-300 px-4 py-2 rounded-lg"
        >
          ← New analysis
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Spending"
          value={fmt(total_spending, cur)}
          sub="This period"
          accent="text-rose-700"
        />
        <StatCard
          label="Total Income"
          value={fmt(total_income, cur)}
          sub="Credits & deposits"
          accent="text-forest-800"
        />
        <StatCard
          label="Net Balance"
          value={`${net >= 0 ? '+' : ''}${fmt(net, cur)}`}
          sub={net >= 0 ? 'Under budget' : 'Over income'}
          accent={net >= 0 ? 'text-forest-800' : 'text-rose-700'}
        />
      </div>

      {/* Quick facts row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
            <span className="text-gold text-lg">★</span>
          </div>
          <div>
            <p className="label mb-0.5">Top Merchant</p>
            <p className="font-mono text-sm font-medium text-ink">{top_merchant}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
            <span className="text-rose-500 text-lg">↑</span>
          </div>
          <div>
            <p className="label mb-0.5">Largest Expense</p>
            <p className="font-mono text-sm font-medium text-ink">{largest_expense}</p>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="card p-6 mb-6">
        <p className="label mb-1">Breakdown</p>
        <h3 className="font-display text-xl font-semibold text-ink mb-4">Spending by category</h3>

        <div>
          {categories
            .filter(c => c.category.toLowerCase() !== 'income')
            .map((cat, i) => (
              <CategoryRow
                key={cat.category}
                {...cat}
                color={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                currency={cur}
              />
            ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="card p-6 mb-6">
        <p className="label mb-1">AI Insights</p>
        <h3 className="font-display text-xl font-semibold text-ink mb-4">What Claude noticed</h3>

        <div className="space-y-3">
          {insights.map((insight, i) => (
            <div key={i} className="flex gap-3 p-3 bg-cream-50 rounded-xl border border-cream-200">
              <span className="text-forest-700 font-mono text-sm shrink-0 mt-0.5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-sm text-ink leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="card p-6 bg-forest-900 border-forest-800">
        <p className="label text-forest-500 mb-2">Summary</p>
        <p className="text-cream-100 text-base leading-relaxed font-light">{summary}</p>
      </div>

      <p className="text-center text-xs text-muted font-mono mt-6">
        Powered by Claude AI · Data never stored · Analysis for informational purposes only
      </p>
    </div>
  )
}
