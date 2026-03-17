"""
main.py — FastAPI backend for Bank Statement Analyzer
Accepts pasted transaction text, calls Claude API, returns structured analysis.

Start with: uvicorn main:app --reload --port 8000
"""

import json
import os

import anthropic
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="Bank Statement Analyzer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


# ── Schemas ───────────────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    transactions: str

class CategoryBreakdown(BaseModel):
    category: str
    total: float
    percentage: float
    transactions: list[str]

class AnalysisResponse(BaseModel):
    total_spending: float
    total_income: float
    net: float
    currency: str
    categories: list[CategoryBreakdown]
    insights: list[str]
    summary: str
    top_merchant: str
    largest_expense: str


# ── Prompt ────────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are a financial analyst AI. The user will paste raw bank statement data 
in any format (CSV, plain text, copied from a banking app, etc.).

Your job is to:
1. Parse all transactions from the text
2. Categorize each transaction (e.g. Food & Dining, Transport, Shopping, Entertainment, 
   Bills & Utilities, Health, Income, Subscriptions, Travel, Other)
3. Return a clean structured JSON analysis

IMPORTANT: You must respond with ONLY valid JSON — no markdown, no explanation, no backticks.

Return exactly this structure:
{
  "total_spending": <number, sum of all expenses>,
  "total_income": <number, sum of all income/credits>,
  "net": <number, income minus spending>,
  "currency": "<detected currency symbol e.g. $ or CAD>",
  "categories": [
    {
      "category": "<category name>",
      "total": <number>,
      "percentage": <number, percentage of total spending>,
      "transactions": ["<merchant/description> $<amount>", ...]
    }
  ],
  "insights": [
    "<plain English insight about spending pattern>",
    "<another insight>",
    "<another insight>",
    "<another insight>"
  ],
  "summary": "<2-3 sentence plain English summary of the overall financial picture>",
  "top_merchant": "<merchant spent at most>",
  "largest_expense": "<single largest transaction description and amount>"
}

Sort categories by total (highest first). Include at least 4 insights. 
Insights should be specific, actionable, and reference actual numbers from the data."""


# ── Route ─────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalysisResponse)
def analyze_statement(req: AnalyzeRequest):
    if not req.transactions.strip():
        raise HTTPException(status_code=400, detail="No transaction data provided.")

    if len(req.transactions) > 20_000:
        raise HTTPException(status_code=400, detail="Input too long. Please paste fewer transactions.")

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        raise HTTPException(status_code=503, detail="ANTHROPIC_API_KEY not configured. See README.")

    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": f"Please analyze these bank transactions:\n\n{req.transactions}"
                }
            ]
        )

        raw = message.content[0].text.strip()

        # Strip markdown fences if model adds them despite instructions
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        data = json.loads(raw)
        return data

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response. Please try again.")
    except anthropic.AuthenticationError:
        raise HTTPException(status_code=401, detail="Invalid Anthropic API key. Check your .env file.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
