import { useState } from 'react'
import StatementInput from './components/StatementInput'
import ResultsDashboard from './components/ResultsDashboard'

const API_URL = 'http://localhost:8000'

export default function App() {
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function handleSubmit(text) {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ transactions: text }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Server error')
      }

      setResult(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">

      {/* Nav */}
      <header className="border-b border-cream-200 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-forest-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-display font-semibold">L</span>
            </div>
            <span className="font-display text-base font-semibold text-ink">Ledger</span>
          </div>
          <span className="text-xs font-mono text-muted">Bank Statement Analyzer · Claude AI</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16">
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-mono">
            ⚠ {error}
          </div>
        )}

        {result ? (
          <ResultsDashboard result={result} onReset={() => setResult(null)} />
        ) : (
          <StatementInput onSubmit={handleSubmit} loading={loading} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-cream-200 py-4 text-center">
        <p className="text-xs font-mono text-muted">
          Ledger · Built with Claude AI, FastAPI & React · Portfolio project
        </p>
      </footer>
    </div>
  )
}
