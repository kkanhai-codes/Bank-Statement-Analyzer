import { useState } from 'react'
import { SAMPLE_DATA } from '../sampleData'

export default function StatementInput({ onSubmit, loading }) {
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (text.trim()) onSubmit(text)
  }

  function loadSample() {
    setText(SAMPLE_DATA)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-forest-800/8 text-forest-800 text-xs font-mono uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 border border-forest-800/15">
          <span className="w-1.5 h-1.5 rounded-full bg-forest-600 inline-block" />
          AI-Powered Analysis
        </div>
        <h1 className="font-display text-5xl font-semibold text-ink leading-tight mb-3">
          Understand your<br />
          <span className="text-forest-800">spending instantly</span>
        </h1>
        <p className="text-muted text-base font-light max-w-md mx-auto leading-relaxed">
          Paste any bank statement — CSV export, copied text, or raw transactions.
          Claude AI categorizes everything and surfaces insights in seconds.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-6">
        <div className="flex items-center justify-between mb-3">
          <label className="label">Paste your transactions</label>
          <button
            type="button"
            onClick={loadSample}
            className="text-xs font-mono text-forest-700 hover:text-forest-800 underline underline-offset-2 transition-colors"
          >
            Load sample data
          </button>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={`Paste transactions in any format:\n\nDate, Description, Amount\n2024-01-02, Tim Hortons, -4.75\n2024-01-03, Salary, +4200.00\n...`}
          rows={12}
          className="w-full bg-cream-50 border border-cream-200 rounded-xl px-4 py-3
                     font-mono text-sm text-ink placeholder-muted/50
                     focus:outline-none focus:ring-1 focus:ring-forest-700 focus:border-forest-700
                     resize-none transition-colors"
        />

        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted font-mono">
            {text.trim().split('\n').filter(Boolean).length} lines pasted
          </p>
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Analysing…
              </>
            ) : (
              'Analyse Statement →'
            )}
          </button>
        </div>
      </form>

      {/* Accepted formats note */}
      <p className="text-center text-xs text-muted mt-4 font-mono">
        Accepts CSV exports · copied bank app text · any tabular format
      </p>
    </div>
  )
}
