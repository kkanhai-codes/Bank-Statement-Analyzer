# Ledger: Bank Statement Analyzer

> Paste any bank statement. Claude AI categorizes your spending and surfaces plain-English insights instantly.

Built with **Claude AI (Anthropic)**, **FastAPI**, and **React**.

---

## What it does

- Accepts transactions in any format: CSV exports, copied bank app text, raw tabular data
- Calls the Claude API to categorize spending automatically
- Returns a full breakdown: categories, percentages, top merchants, largest expenses
- Generates 4+ plain-English insights about your spending patterns
- Shows a net balance summary (income vs. spending)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Python + FastAPI + Uvicorn |
| AI | Anthropic Claude API (`claude-sonnet`) |
| Validation | Pydantic |

---

## Setup (macOS)

### Prerequisites

- **Python 3.11+** — check with `python3 --version`
- **Node.js 18+** — check with `node --version` (install via [nodejs.org](https://nodejs.org) or `brew install node`)
- **An Anthropic API key** — get one at [console.anthropic.com](https://console.anthropic.com)

---

### 1 — Get your Anthropic API key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / log in
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

---

### 2 — Backend setup

```bash
cd bank-analyzer/backend

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create your .env file from the example
cp .env.example .env
```

Open `.env` and paste your API key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Start the backend:
```bash
uvicorn main:app --reload --port 8000
```

Verify at [http://localhost:8000/health](http://localhost:8000/health) — should return `{"status":"ok"}`.

---

### 3 — Frontend setup (new terminal tab)

```bash
cd bank-analyzer/frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Usage

1. Open the app at `http://localhost:5173`
2. Paste your bank transactions — or click **"Load sample data"** to try it instantly
3. Click **Analyse Statement**
4. View your spending breakdown, insights, and summary

### Accepted formats

The app handles any text format, for example:

**CSV:**
```
Date,Description,Amount
2024-01-02,Tim Hortons,-4.75
2024-01-03,Salary Deposit,+4200.00
```

**Plain text:**
```
Jan 2  Tim Hortons        -$4.75
Jan 3  Salary             +$4,200.00
```

---

## Project Structure

```
bank-analyzer/
├── backend/
│   ├── main.py           # FastAPI app + Claude API call + response parsing
│   ├── requirements.txt
│   └── .env.example      # Copy to .env and add your API key
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                        # Main layout + API call
│   │   ├── sampleData.js                  # Built-in sample transactions
│   │   ├── index.css                      # Global styles
│   │   └── components/
│   │       ├── StatementInput.jsx         # Paste area + submit
│   │       └── ResultsDashboard.jsx       # Results: cards, chart, insights
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## API Reference

### `POST /analyze`

**Request:**
```json
{ "transactions": "<raw transaction text>" }
```

**Response:**
```json
{
  "total_spending": 892.43,
  "total_income": 4200.00,
  "net": 3307.57,
  "currency": "$",
  "categories": [
    {
      "category": "Food & Dining",
      "total": 186.78,
      "percentage": 20.9,
      "transactions": ["Tim Hortons -$4.75", "Uber Eats -$34.20"]
    }
  ],
  "insights": [
    "You spent $186.78 on Food & Dining — your largest category at 20.9% of expenses.",
    "..."
  ],
  "summary": "...",
  "top_merchant": "Uber Eats",
  "largest_expense": "Enbridge Gas -$134.00"
}
```

---
