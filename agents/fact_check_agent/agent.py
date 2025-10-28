# ============================================
# FACT-CHECKING AGENT PIPELINE
# ============================================

import json
import time
import os
import re
from dotenv import load_dotenv

from google.adk.agents import LlmAgent, SequentialAgent
from google.adk.tools import google_search
from google.api_core.exceptions import ResourceExhausted, ServiceUnavailable
from google.genai import Client

from .prompts import (
    CLAIM_EXTRACTION_PROMPT,
    EVIDENCE_SEARCH_PROMPT,
    FACT_COMPARISON_PROMPT,
)

# ------------------------------------------------
# Load environment and initialize Gemini client
# ------------------------------------------------
load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("❌ Missing GOOGLE_API_KEY in .env file")

print("🔑 Loaded Google API key successfully...")  # Optional debug line

client = Client(api_key=api_key)


# ------------------------------------------------
# Safe Execution with Retry & Fallback
# ------------------------------------------------
def safe_run_agent(agent, input_text):
    """Safely run an agent with retries and Gemini fallback."""
    for attempt in range(3):  # retry up to 3 times
        try:
            return agent.run(input_text=input_text)
        except (ResourceExhausted, ServiceUnavailable):
            print(f"⚠️ API temporarily unavailable. Retry {attempt+1}/3...")
            time.sleep(5 * (attempt + 1))  # exponential backoff
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            break

    # Fallback using direct Gemini API call
    print("🔄 Falling back to direct Gemini API call...")
    response = client.models.generate_content(
        model="gemini-1.5-flash", contents=input_text
    )
    return response.text


# ------------------------------------------------
# Model Configuration
# ------------------------------------------------
GEMINI_LARGE = "gemini-2.5-pro"
GEMINI_SMALL = "gemini-2.0-flash"


# ------------------------------------------------
# Initialize Agents
# ------------------------------------------------
claim_extractor = LlmAgent(
    name="claim_extractor",
    model=GEMINI_SMALL,
    instruction=CLAIM_EXTRACTION_PROMPT,
    description="Extracts factual claims from text.",
)

evidence_search_agent = LlmAgent(
    name="evidence_search_agent",
    model=GEMINI_LARGE,
    tools=[google_search],
    instruction=EVIDENCE_SEARCH_PROMPT,
    description="Searches for evidence supporting or refuting claims.",
)

fact_comparison_agent = LlmAgent(
    name="fact_comparison_agent",
    model=GEMINI_LARGE,
    instruction=FACT_COMPARISON_PROMPT,
    description="Compares each claim with evidence and outputs verdicts.",
)


# ------------------------------------------------
# Create Sequential Pipeline
# ------------------------------------------------
fact_check_pipeline = SequentialAgent(
    name="fact_check_pipeline",
    description="Extracts claims, finds evidence, and compares them using Gemini models.",
    sub_agents=[claim_extractor, evidence_search_agent, fact_comparison_agent],
)


# ------------------------------------------------
# Runner Function — Readable Output
# ------------------------------------------------
def run_fact_check(article_text: str):
    print("\n🚀 Running Fact-Check Pipeline...\n")

    try:
        raw_result = safe_run_agent(fact_check_pipeline, article_text)

        # Extract first valid JSON block
        def extract_json(text):
            array_match = re.search(r"(\[.*?\])", text, re.DOTALL)
            if array_match:
                try:
                    return json.loads(array_match.group(1))
                except Exception:
                    pass
            obj_match = re.search(r"(\{.*?\})", text, re.DOTALL)
            if obj_match:
                try:
                    return json.loads(obj_match.group(1))
                except Exception:
                    pass
            return None

        result = extract_json(str(raw_result))
        print("✅ Fact-check completed successfully!\n")

        # Always return a valid JSON object for API
        if isinstance(result, dict) and "claims" in result:
            return result
        elif isinstance(result, list):
            return {"claims": result}
        else:
            print("⚠️ Could not parse structured results. Attempting to parse Markdown/text output.")
            print(raw_result)

            def parse_markdown_claims(text):
                claim_pattern = re.compile(
                    r"\*\*Claim (\d+):\*\* (.*?)\n\*\*Verdict: (.*?)\*\*\n\*\*Reasoning:\*\* (.*?)(?=\n\*\*Claim|$)",
                    re.DOTALL,
                )
                claims = []
                for match in claim_pattern.finditer(text):
                    claim_id = match.group(1).strip()
                    claim_text = match.group(2).strip()
                    verdict = match.group(3).strip()
                    reasoning = match.group(4).strip()
                    claims.append(
                        {
                            "claim": {"id": claim_id, "text": claim_text},
                            "verdict": verdict,
                            "evidences": [],
                            "corrected_value": None,
                            "reasoning": reasoning,
                        }
                    )
                return claims

            def parse_claim_evidence_verdict_blocks(text):
                block_pattern = re.compile(
                    r"\*\*Claim:\*\*\s*(.*?)\n\*\*Evidence:\*\*\s*(.*?)\n\*\*Verdict:\*\*\s*(.*?)(?=\n\*\*Claim:|$)",
                    re.DOTALL,
                )
                claims = []
                for match in block_pattern.finditer(text):
                    claim_text = match.group(1).strip()
                    evidence = match.group(2).strip()
                    verdict = match.group(3).strip()
                    claims.append(
                        {
                            "claim": {"id": None, "text": claim_text},
                            "verdict": verdict,
                            "evidences": [evidence] if evidence else [],
                            "corrected_value": None,
                            "reasoning": evidence,
                        }
                    )
                return claims

            parsed_claims = parse_markdown_claims(str(raw_result))
            if not parsed_claims:
                parsed_claims = parse_claim_evidence_verdict_blocks(str(raw_result))

            if parsed_claims:
                print(f"✅ Parsed {len(parsed_claims)} claims from Markdown/text output.")
                return {"claims": parsed_claims}
            else:
                print("❌ Could not parse Markdown/text output. Returning empty claims array.")
                return {"claims": []}

    except Exception as e:
        print(f"❌ Error: {e}")
        return {"claims": []}


# ------------------------------------------------
# Quick Test
# ------------------------------------------------
if __name__ == "__main__":
    sample_text = "Company X reported 50% growth in Q2 2025 profits."
    output = run_fact_check(sample_text)
    print("\n🧾 Final Output:\n", output)


# Export the root agent for external use
root_agent = fact_check_pipeline
