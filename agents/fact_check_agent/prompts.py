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
Compare each claim with its gathered evidence items.
Determine whether the evidence supports, contradicts, or fails to verify the claim.

Return a JSON array like this:
[
  {
    "claim_id": "C1",
    "verdict": "Supported",
    "confidence": 0.92,
    "supporting_evidence": [
      "https://www.example.com/article"
    ],
    "corrected_claim": null
  }
]

Allowed verdicts: Supported, Contradicted, Unsubstantiated.
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
    },
    {
      "claim": {"id": "C2", "text": "Yulu was founded in 2017."},
      "verdict": "Contradicted",
      "evidences": [
        {"url": "https://www.example.com/yulu-founding", "title": "Yulu founding year confirmed", "snippet": "Yulu was founded in 2017 according to filings..."}
      ],
      "corrected_value": "Yulu was founded in 2018.",
      "reasoning": "Evidence contradicts the claim."
    }
  ]
}
"""
