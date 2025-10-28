# ============================================
# PROMPT DEFINITIONS FOR FACT-CHECK PIPELINE
# ============================================

# 1️⃣ Claim Extraction
CLAIM_EXTRACTION_PROMPT = """
Extract atomic, verifiable factual claims from the given text.
Each claim should be simple, objective, and testable.

Return output strictly in JSON array format:
[
  {
    "id": "C1",
    "claim_text": "The company reported a 50% growth in profits in Q2 2025.",
    "context": "Paragraph where this claim appears"
  },
  ...
]
Output ONLY valid JSON. Do NOT include any markdown, explanations, or text outside the JSON. If you do not comply, your output will be discarded and ignored.
Example output:
{
  "claims": [
    {
      "claim": {"id": "C1", "text": "The company reported a 50% growth in profits in Q2 2025."},
      "verdict": "Supported",
      "evidences": [
        {"url": "https://www.example.com/article", "title": "Company X Q2 2025 financial report", "snippet": "Company X announced a 50% growth in Q2 2025 profits..."}
      ],
      "corrected_value": null,
      "reasoning": "Evidence supports the claim."
    }
  ]
}
"""

# 2️⃣ Evidence Search
EVIDENCE_SEARCH_PROMPT = """
For each input claim, use the web search tool to find up to 4 evidence items.
Each item should help verify, refute, or clarify the claim.

Return JSON object keyed by claim id:
{
  "C1": [
    {
      "title": "Company X Q2 2025 financial report",
      "url": "https://www.example.com/article",
      "snippet": "Company X announced a 50% growth in Q2 2025 profits...",
      "published_date": "2025-07-15",
      "source": "Reuters"
    }
  ]
}

Output ONLY valid JSON. Do NOT include any markdown, explanations, or text outside the JSON. If you do not comply, your output will be discarded and ignored.
Example output:
{
  "C1": [
    {
      "title": "Company X Q2 2025 financial report",
      "url": "https://www.example.com/article",
      "snippet": "Company X announced a 50% growth in Q2 2025 profits...",
      "published_date": "2025-07-15",
      "source": "Reuters"
    }
  ],
  "C2": [
    {
      "title": "Yulu founding year confirmed",
      "url": "https://www.example.com/yulu-founding",
      "snippet": "Yulu was founded in 2017 according to filings...",
      "published_date": "2017-08-07",
      "source": "Official Filings"
    }
  ]
}
"""

# 3️⃣ Fact Comparison
FACT_COMPARISON_PROMPT = """
For each claim, compare it with the gathered evidence items and return a JSON array of fact-check results.

Each result must have:
- statement_checked: The claim text being checked.
- verdict: True, False, Partially True, or other appropriate label.
- confidence_score: A number between 0 and 1.
- reasoning: A brief explanation for the verdict.
- evidence_sources: Array of {source_name, url} objects.
- correction_if_false: If the claim is false, provide the correct statement; otherwise null.

Output ONLY valid JSON. Do NOT include any markdown, explanations, or text outside the JSON.

Example output:
[
  {
    "statement_checked": "Yulu was founded in 2017.",
    "verdict": "True",
    "confidence_score": 0.98,
    "reasoning": "Multiple sources confirm the founding year.",
    "evidence_sources": [
      {"source_name": "Wikipedia", "url": "https://en.wikipedia.org/wiki/Yulu_(transportation_company)"},
      {"source_name": "Tracxn", "url": "https://tracxn.com/d/companies/yulu/..."}
    ],
    "correction_if_false": null
  }
]
"""
