# ============================================
# FACT-CHECKING AGENT PIPELINE
# ============================================

import json
import time

from google.adk.agents import LlmAgent, SequentialAgent
from google.adk.tools import google_search
from google.api_core.exceptions import ResourceExhausted, ServiceUnavailable
from google.genai import Client

from .prompts import (
    CLAIM_EXTRACTION_PROMPT,
    EVIDENCE_SEARCH_PROMPT,
    FACT_COMPARISON_PROMPT,
)
from .models import FactCheckReport


# ------------------------------------------------
# Safe Execution with Retry & Fallback
# ------------------------------------------------
def safe_run_agent(agent, input_text):
    # Initialize Gemini client
    client = Client()

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
# Load Prompts Dynamically
# ------------------------------------------------


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

data_format_agent = LlmAgent(
    name="data_format_agent",
    model=GEMINI_SMALL,
    instruction="Format the input data into a structured JSON format.",
    description="Formats data into JSON.",
    output_schema=FactCheckReport,
)


# ------------------------------------------------
# Create Sequential Pipeline
# ------------------------------------------------
fact_check_pipeline = SequentialAgent(
    name="fact_check_pipeline",
    description="Extracts claims, finds evidence, and compares them using Gemini models"
                " and formats into `FactCheckReport` schema"
                ".",
    sub_agents=[claim_extractor, evidence_search_agent, fact_comparison_agent, data_format_agent],
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
            # Wrap legacy list format into expected dict
            return {"claims": result}
        else:
            print(
                "⚠️ Could not parse structured results. Attempting to parse Markdown/text output."
            )
            print(raw_result)

            import re

            def parse_markdown_claims(text):
                # First, try to parse claim blocks (old format)
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
                import re

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
                print(
                    f"✅ Parsed {len(parsed_claims)} claims from Markdown/text/table/block output."
                )
                return {"claims": parsed_claims}
            else:
                print(
                    "❌ Could not parse Markdown/text output. Returning empty claims array."
                )
                return {"claims": []}

    except Exception as e:
        print(f"❌ Error: {e}")
        return {"claims": []}


# ------------------------------------------------
#  Quick Test
# ------------------------------------------------
if __name__ == "__main__":
    sample_text = "Company X reported 50% growth in Q2 2025 profits."
    output = run_fact_check(sample_text)
    print("\n🧾 Final Output:\n", output)


# Export the root agent for external use
root_agent = fact_check_pipeline
