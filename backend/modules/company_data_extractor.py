import os
import io
import json
import fitz  # PyMuPDF
from PIL import Image
import google.generativeai as genai
from datetime import datetime
from dotenv import load_dotenv
from gemini_model_config import GEMINI_SMALL

load_dotenv()


def configure_gemini():
    """Configures the Gemini API with the key from environment variables."""
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found. Please set it in a .env file.")
    genai.configure(api_key=api_key)


# Initialize Gemini at startup
configure_gemini()


def pdf_to_images(pdf_path: str):
    """Convert PDF to a list of PIL images (one per page)."""
    doc = fitz.open(pdf_path)
    images = []
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        pix = page.get_pixmap(dpi=150)
        img_data = pix.tobytes("png")
        image = Image.open(io.BytesIO(img_data))
        images.append(image)
    doc.close()
    return images


def extract_company_data_from_pitch_deck(pdf_path: str) -> dict:
    """
    Extract company data from pitch deck PDF and return in Firebase companies collection schema format.
    """

    # Convert PDF to images
    page_images = pdf_to_images(pdf_path)

    model = genai.GenerativeModel(GEMINI_SMALL)

    # Detailed prompt to extract company data matching the Firebase schema
    prompt = """
    You are an expert data extraction specialist. Analyze this pitch deck and extract comprehensive company information.

    Return a JSON object with the EXACT structure below. If information is not found, use "Not Found" or empty string/array as appropriate.
    Do NOT include any markdown formatting, code blocks, or explanations - ONLY return the raw JSON object.

    IMPORTANT: For any field that has a "source_url", "source_name" structure, if you cannot find specific sources from the pitch deck,
    use "source_url": "Pitch Deck", "source_name": "Company Pitch Deck" as defaults.

    Required JSON structure:
    {
      "company_info": {
        "company_name": "",
        "logo_url": "",
        "headquarters_location": "",
        "year_founded": "",
        "company_type": "",
        "industry_sector": "",
        "business_model": "",
        "company_stage": {
          "value": "",
          "source_url": "Pitch Deck",
          "source_name": "Company Pitch Deck"
        },
        "employee_count": {
          "value": "",
          "source_url": "Pitch Deck",
          "source_name": "Company Pitch Deck"
        },
        "website_url": "",
        "company_description": ""
      },
      "financial_data": {
        "total_equity_funding": {
          "value": "",
          "source_url": "Pitch Deck",
          "source_name": "Company Pitch Deck"
        },
        "latest_funding_round": {
          "value": "",
          "source_url": "Pitch Deck",
          "source_name": "Company Pitch Deck"
        },
        "valuation": {
          "value": "",
          "source_url": "Pitch Deck",
          "source_name": "Company Pitch Deck"
        },
        "revenue_growth_rate": {
          "value": "",
          "source_url": "Pitch Deck",
          "source_name": "Company Pitch Deck"
        },
        "financial_strength": "",
        "key_investors": []
      },
      "people_data": {
        "key_people": [
          {
            "name": "",
            "role": "",
            "background": "",
            "source_url": "Pitch Deck"
          }
        ],
        "employee_growth_rate": "",
        "hiring_trends": ""
      },
      "market_data": {
        "market_size": {
          "value": "",
          "source_url": "Pitch Deck",
          "source_name": "Company Pitch Deck"
        },
        "competitive_landscape": {
          "value": "",
          "source_url": "Pitch Deck",
          "source_name": "Company Pitch Deck"
        },
        "market_position": "",
        "competitive_advantages": [
          {
            "value": "",
            "source_url": "Pitch Deck",
            "source_name": "Company Pitch Deck"
          }
        ],
        "product_market_fit": ""
      },
      "reputation_data": {
        "customer_satisfaction": {
          "value": "",
          "source_url": "Pitch Deck",
          "source_name": "Company Pitch Deck"
        },
        "news_mentions_count": "",
        "notable_news": [],
        "partnerships": [
          {
            "value": "",
            "source_url": "Pitch Deck",
            "source_name": "Company Pitch Deck"
          }
        ],
        "brand_sentiment": ""
      },
      "extraction_summary": ""
    }

    Be thorough and extract as much information as possible from the pitch deck.
    For the extraction_summary, provide a brief summary of what data was successfully extracted and what was missing.
    """

    content = [prompt] + page_images
    response = model.generate_content(content)

    # Clean the response text
    cleaned_response = response.text.strip()

    # Remove markdown code blocks if present
    if cleaned_response.startswith("```json"):
        cleaned_response = cleaned_response[7:]
    if cleaned_response.startswith("```"):
        cleaned_response = cleaned_response[3:]
    if cleaned_response.endswith("```"):
        cleaned_response = cleaned_response[:-3]

    cleaned_response = cleaned_response.strip()

    try:
        extracted_data = json.loads(cleaned_response)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse AI response as JSON: {e}\nResponse: {cleaned_response}")

    # Ensure all required keys exist with proper structure
    default_structure = {
        "company_info": {
            "company_name": "Unknown Company",
            "logo_url": "",
            "headquarters_location": "",
            "year_founded": "",
            "company_type": "",
            "industry_sector": "",
            "business_model": "",
            "company_stage": {"value": "", "source_url": "Pitch Deck", "source_name": "Company Pitch Deck"},
            "employee_count": {"value": "", "source_url": "Pitch Deck", "source_name": "Company Pitch Deck"},
            "website_url": "",
            "company_description": ""
        },
        "financial_data": {
            "total_equity_funding": {"value": "", "source_url": "Pitch Deck", "source_name": "Company Pitch Deck"},
            "latest_funding_round": {"value": "", "source_url": "Pitch Deck", "source_name": "Company Pitch Deck"},
            "valuation": {"value": "", "source_url": "Pitch Deck", "source_name": "Company Pitch Deck"},
            "revenue_growth_rate": {"value": "", "source_url": "Pitch Deck", "source_name": "Company Pitch Deck"},
            "financial_strength": "",
            "key_investors": []
        },
        "people_data": {
            "key_people": [],
            "employee_growth_rate": "",
            "hiring_trends": ""
        },
        "market_data": {
            "market_size": {"value": "", "source_url": "Pitch Deck", "source_name": "Company Pitch Deck"},
            "competitive_landscape": {"value": "", "source_url": "Pitch Deck", "source_name": "Company Pitch Deck"},
            "market_position": "",
            "competitive_advantages": [],
            "product_market_fit": ""
        },
        "reputation_data": {
            "customer_satisfaction": {"value": "", "source_url": "Pitch Deck", "source_name": "Company Pitch Deck"},
            "news_mentions_count": "",
            "notable_news": [],
            "partnerships": [],
            "brand_sentiment": ""
        },
        "extraction_summary": ""
    }

    # Deep merge extracted_data with default_structure
    def deep_merge(default, extracted):
        """Recursively merge extracted data with defaults"""
        if isinstance(default, dict) and isinstance(extracted, dict):
            merged = default.copy()
            for key, value in extracted.items():
                if key in merged and isinstance(merged[key], dict) and isinstance(value, dict):
                    merged[key] = deep_merge(merged[key], value)
                else:
                    merged[key] = value
            return merged
        return extracted if extracted else default

    complete_data = deep_merge(default_structure, extracted_data)

    # Return just the extracted company data structure (matching CompanyProfile)
    # The Firebase document wrapping will be done in the agents service endpoint
    return complete_data
