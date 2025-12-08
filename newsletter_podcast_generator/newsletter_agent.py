"""
LVX Newsletter & Podcast Agent v1.0
Generates sector-focused newsletters and podcasts for Let's Venture Platform

Supported Sectors:
- Artificial Intelligence
- EdTech
- Retail Tech & FMCG
- Technology & Software
- Consumer Tech & D2C
- Deep Tech
- Emerging Technologies
- PropTech
- Media & Entertainment
- Travel Tech & Hospitality
- AgriTech
- Fintech
- Health Tech & BioTech
"""

from typing import Dict, List
import pathlib
import wave

from google.adk.agents import LlmAgent, SequentialAgent
from google.adk.tools import google_search, ToolContext
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

from gemini_model_config import GEMINI_SMALL, TTS_MODEL


# --- Configuration ---
WHITELIST_DOMAINS = [
    "economictimes.indiatimes.com",
    "yourstory.com",
    "inc42.com",
    "techcrunch.com",
    "vccircle.com",
    "entrackr.com",
    "moneycontrol.com",
    "livemint.com",
    "business-standard.com",
    "crunchbase.com",
    "linkedin.com",
    "medianama.com",
    "thehindubusinessline.com",
]

VALID_SECTORS = [
    "Artificial Intelligence",
    "EdTech",
    "Retail Tech & FMCG",
    "Technology & Software",
    "Consumer Tech & D2C",
    "Deep Tech",
    "Emerging Technologies",
    "PropTech",
    "Media & Entertainment",
    "Travel Tech & Hospitality",
    "AgriTech",
    "Fintech",
    "Health Tech & BioTech",
]


# --- Pydantic Models ---
class SectorNewsItem(BaseModel):
    """A news item from the sector."""

    title: str = Field(description="News headline")
    summary: str = Field(description="Brief summary of the news")
    significance: str = Field(description="Why this matters for investors")
    source_domain: str = Field(description="Source domain")
    date: str = Field(default="", description="Publication date if available")
    category: str = Field(
        description="Category: Funding, Product Launch, M&A, Policy, Innovation, etc."
    )


class SectorInsight(BaseModel):
    """Key insight about the sector."""

    insight_type: str = Field(description="Type: Trend, Opportunity, Risk, Innovation")
    title: str = Field(description="Insight title")
    description: str = Field(description="Detailed description")
    investment_angle: str = Field(description="Investment perspective")


class SectorNewsletter(BaseModel):
    """Newsletter for a specific sector."""

    sector_name: str = Field(description="Sector name")
    edition_date: str = Field(description="Newsletter date")
    executive_summary: str = Field(description="High-level sector overview")
    top_stories: List[SectorNewsItem] = Field(
        description="Top 5-7 news items", default=[]
    )
    sector_insights: List[SectorInsight] = Field(description="Key insights", default=[])
    funding_highlights: List[str] = Field(
        description="Recent funding rounds", default=[]
    )
    startup_spotlight: str = Field(description="Featured startup of the week")
    outlook: str = Field(description="Sector outlook for investors")
    data_sources: List[str] = Field(description="Research sources", default=[])


# --- Helper Functions ---
def wave_file(filename, pcm, channels=1, rate=24000, sample_width=2):
    """Save audio data as a wave file."""
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm)


async def save_newsletter_content(
    filename: str, content: str, tool_context: ToolContext
) -> Dict:
    """Save newsletter content to markdown file."""
    try:
        if not filename.endswith(".md"):
            filename += ".md"

        file_path = pathlib.Path(filename)
        file_path.write_text(content, encoding="utf-8")

        return {
            "status": "success",
            "message": f"Newsletter saved to {file_path.resolve()}",
            "file_path": str(file_path.resolve()),
        }
    except Exception as e:
        return {"status": "error", "message": f"Failed to save newsletter: {str(e)}"}


async def generate_newsletter_audio(
    script: str, session_id: str, tool_context: ToolContext
) -> Dict:
    """Generate newsletter podcast audio in English and Hindi."""
    try:
        import re

        # Clean script
        clean_script = re.sub(r"\*[^*]+\*", "", script)
        clean_script = re.sub(r"\s+", " ", clean_script)
        clean_script = re.sub(r" +\n", "\n", clean_script)
        clean_script = clean_script.strip()

        def chunk_script(text: str, max_chars: int = 1800) -> List[str]:
            """Split script into chunks at natural boundaries."""
            lines = text.split("\n")
            chunks = []
            current_chunk = []
            current_length = 0

            for line in lines:
                line = line.strip()
                if not line:
                    continue

                line_length = len(line)

                if current_length + line_length > max_chars and current_chunk:
                    chunks.append("\n".join(current_chunk))
                    current_chunk = [line]
                    current_length = line_length
                else:
                    current_chunk.append(line)
                    current_length += line_length + 1

            if current_chunk:
                chunks.append("\n".join(current_chunk))

            return chunks

        script_chunks = chunk_script(clean_script)
        print(f"Split newsletter script into {len(script_chunks)} chunks")

        client = genai.Client()

        # Generate English audio
        english_audio_chunks = []
        for i, chunk in enumerate(script_chunks):
            print(f"Processing English chunk {i+1}/{len(script_chunks)}...")

            english_response = client.models.generate_content(
                model=TTS_MODEL,
                contents=f"TTS the following sector newsletter conversation between Priya and Arjun:\n\n{chunk}",
                config=types.GenerateContentConfig(
                    response_modalities=["AUDIO"],
                    speech_config=types.SpeechConfig(
                        multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
                            speaker_voice_configs=[
                                types.SpeakerVoiceConfig(
                                    speaker="Priya",
                                    voice_config=types.VoiceConfig(
                                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                            voice_name="Puck"
                                        )
                                    ),
                                ),
                                types.SpeakerVoiceConfig(
                                    speaker="Arjun",
                                    voice_config=types.VoiceConfig(
                                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                            voice_name="Kore"
                                        )
                                    ),
                                ),
                            ]
                        )
                    ),
                ),
            )

            chunk_data = (
                english_response.candidates[0].content.parts[0].inline_data.data
            )
            english_audio_chunks.append(chunk_data)

        # Combine English chunks
        english_data = b"".join(english_audio_chunks)
        english_filename = f"{session_id}_newsletter_english.wav"
        wave_file(english_filename, english_data)
        print(f"English newsletter audio saved: {len(english_data)} bytes")

        # Translate to Hindi
        translation_response = client.models.generate_content(
            model=GEMINI_SMALL,
            contents=f"""Translate this English sector newsletter podcast to natural Hindi.
Keep speaker labels (Priya: and Arjun:) and maintain conversational tone.
Use appropriate Hindi business/tech terminology.

{clean_script}

Return ONLY the translated conversation with labels.""",
        )

        hindi_script = translation_response.text.strip()
        hindi_script = re.sub(r"\*[^*]+\*", "", hindi_script)
        hindi_script = re.sub(r"\s+", " ", hindi_script)
        hindi_script = hindi_script.strip()

        # Generate Hindi audio
        hindi_chunks = chunk_script(hindi_script)
        print(f"Split Hindi script into {len(hindi_chunks)} chunks")

        hindi_audio_chunks = []
        for i, chunk in enumerate(hindi_chunks):
            print(f"Processing Hindi chunk {i+1}/{len(hindi_chunks)}...")

            hindi_response = client.models.generate_content(
                model=TTS_MODEL,
                contents=f"TTS the following sector newsletter conversation between Priya and Arjun:\n\n{chunk}",
                config=types.GenerateContentConfig(
                    response_modalities=["AUDIO"],
                    speech_config=types.SpeechConfig(
                        multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
                            speaker_voice_configs=[
                                types.SpeakerVoiceConfig(
                                    speaker="Priya",
                                    voice_config=types.VoiceConfig(
                                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                            voice_name="Charon"
                                        )
                                    ),
                                ),
                                types.SpeakerVoiceConfig(
                                    speaker="Arjun",
                                    voice_config=types.VoiceConfig(
                                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                            voice_name="Aoede"
                                        )
                                    ),
                                ),
                            ]
                        )
                    ),
                ),
            )

            chunk_data = hindi_response.candidates[0].content.parts[0].inline_data.data
            hindi_audio_chunks.append(chunk_data)

        # Combine Hindi chunks
        hindi_data = b"".join(hindi_audio_chunks)
        hindi_filename = f"{session_id}_newsletter_hindi.wav"
        wave_file(hindi_filename, hindi_data)
        print(f"Hindi newsletter audio saved: {len(hindi_data)} bytes")

        return {
            "status": "success",
            "message": f"Successfully generated English and Hindi newsletter audio ({len(script_chunks)} chunks)",
            "english_file": english_filename,
            "hindi_file": hindi_filename,
            "english_size": len(english_data),
            "hindi_size": len(hindi_data),
            "chunks_processed": len(script_chunks),
        }

    except Exception as e:
        return {
            "status": "error",
            "message": f"Newsletter audio generation failed: {str(e)[:200]}",
        }


# --- Sector Newsletter Agents ---

# Agent 1: Sector Research Agent
sector_research_agent = LlmAgent(
    name="SectorResearchAgent",
    model=GEMINI_SMALL,
    instruction=f"""You are a Sector Research Analyst for Let's Venture Platform.

Your task: Research comprehensive sector updates for investor newsletter.

SEARCH STRATEGY - Use these query patterns:
- "[Sector] India who are the key players and startups in [Sector] 2025"
- "[Sector] India government rules and schemes will impact market positively/negatively"
- "[Sector] India how AI/technology is impacting [Sector] positively/negatively"
- "[Sector] India important last 5 year developments/major changes"
- "[Sector] India funding rounds December 2025"
- "[Sector] India how does the future look like for [Sector] startups"

Focus on: {', '.join(WHITELIST_DOMAINS[:7])}

EXTRACT FOR EACH CATEGORY:

1. TOP STORIES (Last 7-14 days)
- Major announcements and launches
- Funding rounds and valuations
- Strategic partnerships
- M&A activities
- Policy/regulatory updates

2. SECTOR TRENDS
- Emerging technologies
- Market dynamics
- Consumer behavior shifts
- Investment patterns

3. FUNDING HIGHLIGHTS
- Recent rounds with amounts
- Notable investors
- Valuation trends

4. STARTUP SPOTLIGHT
- Most interesting startup this week
- What makes them stand out
- Recent achievements

5. MARKET OUTLOOK
- Short-term opportunities
- Potential challenges
- Investment thesis

CRITICAL RULES:
- Focus on Indian ecosystem and startups
- Recent information (last 14 days preferred)
- Include specific numbers, dates, amounts
- Cite source domains
- Balanced perspective
- Use google_search tool extensively (10-15 searches)""",
    description="Researches sector news and trends for newsletter.",
    tools=[google_search],
    output_key="sector_research_data",
)

# Agent 2: Newsletter Writing Agent
newsletter_writing_agent = LlmAgent(
    name="NewsletterWritingAgent",
    model=GEMINI_SMALL,
    instruction="""You are a Newsletter Editor for Let's Venture Platform.

Your task: Transform sector research into a compelling investor newsletter.

NEWSLETTER STRUCTURE:
```markdown
# LVX Sector Insights: [Sector Name]
### Weekly Newsletter for Investors
**Edition Date:** [Current Date]
**Brought to you by Let's Venture**

---

## 🎯 Executive Summary

[2-3 sentences capturing the week's most important developments in this sector]

---

## 📰 Top Stories This Week

### 1. [Story Title]
**Category:** [Funding/Product Launch/M&A/Policy/Innovation]
**Date:** [Date]

[3-4 sentences summary]

**Why it matters:** [Investment significance]

**Source:** [Domain]

---

### 2. [Story Title]
[Repeat format for 5-7 stories]

---

## 💡 Sector Insights

### 🔍 Key Trend: [Trend Title]
[2-3 sentences on emerging trend]

**Investment Angle:** [How investors should think about this]

---

### 🚀 Innovation Spotlight
[Highlight a new technology or approach in the sector]

---

### ⚠️ Risk Watch
[Note any challenges or headwinds]

---

## 💰 Funding Highlights

- **[Startup Name]** raised **[Amount]** from **[Investors]** - [Brief context]
- **[Startup Name]** raised **[Amount]** from **[Investors]** - [Brief context]
[3-5 funding announcements]

---

## ⭐ Startup Spotlight: [Startup Name]

[2-3 paragraphs on the most interesting startup this week]

**What they do:** [Brief description]
**Recent achievement:** [What caught attention]
**Why watch:** [Investment perspective]

---

## 📊 Sector Outlook

**Short-term (Next Quarter):**
[2-3 sentences on immediate opportunities/trends]

**Investment Thesis:**
[Key points for investors considering this sector]

**Areas to Watch:**
- [Area 1]
- [Area 2]
- [Area 3]

---

## 📚 Sources
[List 8-10 key sources]

---

*This newsletter is prepared for Let's Venture investors. For more insights and deal flow, visit Let's Venture Platform.*

---
**Next Edition:** [Next week's date]
**Feedback:** Share your thoughts with the LVX team
```

STYLE GUIDELINES:
- Professional investor tone
- Data-driven insights
- Balanced perspective
- Actionable intelligence
- Scannable format with clear sections
- 800-1200 words total

CRITICAL: After creating newsletter, call save_newsletter_content with:
- filename: "sector_newsletter.md"
- content: [complete markdown newsletter]""",
    description="Creates formatted sector newsletter.",
    tools=[save_newsletter_content],
    output_key="newsletter_content",
)

# Agent 3: Podcast Script Agent
podcast_script_agent = LlmAgent(
    name="PodcastScriptAgent",
    model=GEMINI_SMALL,
    instruction="""You are a Podcast Script Writer for Let's Venture Platform.

Your task: Convert newsletter into a 2-3 minute conversational podcast.

SCRIPT FORMAT:
```
Priya: "Welcome to LVX Sector Brief, your weekly 3-minute update on [Sector Name]. I'm Priya..."

Arjun: "And I'm Arjun. Let's dive into what happened this week in [Sector]."

Priya: "So Arjun, what's the biggest story this week?"

Arjun: "Well, the headline is definitely [Top Story]. [Company] just [action taken]... and here's why it matters..."

Priya: "That's significant. What else caught your attention?"

Arjun: "[Second story summary]... This shows [trend/insight]."

Priya: "On the funding front, what are we seeing?"

Arjun: "Interesting activity. [Funding highlight 1]. And [Funding highlight 2]... The pattern here is [investment trend]."

Priya: "Any startups we should be watching closely?"

Arjun: "Absolutely. [Startup spotlight]. They're worth watching because [reason]."

Priya: "Looking ahead, what's your take on this sector?"

Arjun: "[Outlook and investment angle]."

Priya: "Great insights. That's your LVX Sector Brief for [Sector]. We'll be back next week with more updates for the Let's Venture community."

Arjun: "Until then, happy investing!"
```

CONTENT STRUCTURE:
1. Intro (15 sec)
2. Top Story (30 sec)
3. Additional Stories (30 sec)
4. Funding Highlights (25 sec)
5. Startup Spotlight (25 sec)
6. Outlook (20 sec)
7. Outro (15 sec)

TOTAL: 2.5-3 minutes

STYLE:
- Priya: Anchor, asks questions, synthesizes
- Arjun: Analyst, provides insights, details
- Natural conversational flow
- Use ellipses (...) for pauses
- Professional but accessible
- Include specific numbers and names
- NO stage directions in asterisks

RULES:
- Keep tight at 2-3 minutes (around 400-450 words)
- Focus on top 2-3 stories only
- Mention Let's Venture naturally
- Use speaker labels: "Priya:" and "Arjun:"
- Natural speech patterns""",
    description="Creates podcast script from newsletter.",
    output_key="podcast_script",
)

# Agent 4: Audio Generation Agent
newsletter_audio_agent = LlmAgent(
    name="NewsletterAudioAgent",
    model=GEMINI_SMALL,
    instruction="""You are an Audio Production Specialist for sector newsletters.

Your task: Generate English and Hindi audio from podcast script.

WORKFLOW:
1. Receive podcast script from previous agent
2. Extract session_id from user's message (format: "Session ID: [id]")
3. Call generate_newsletter_audio with script and session_id
4. Verify both English and Hindi files created
5. Return file paths and confirmation

RULES:
- Extract session_id correctly
- Pass clean script without formatting artifacts
- Verify audio generation success
- Report file sizes and paths""",
    description="Generates bilingual newsletter audio.",
    tools=[generate_newsletter_audio],
    output_key="newsletter_audio_files",
)

# --- Sequential Pipeline ---
newsletter_generation_pipeline = SequentialAgent(
    name="NewsletterGenerationPipeline",
    sub_agents=[
        sector_research_agent,
        newsletter_writing_agent,
        podcast_script_agent,
        newsletter_audio_agent,
    ],
    description="Complete pipeline for sector newsletter and podcast generation.",
)

# Root agent export
newsletter_agent = newsletter_generation_pipeline
