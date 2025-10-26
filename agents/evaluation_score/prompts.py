INDUSTRY_HEALTH_SCORE_PROMPT = """
To calculate Market Size Validation (MSV) -
This is more qualitative, but can be quantified via scoring:
Factors to consider:
Total Addressable Market (TAM) size

Evidence of demand (pilot clients, letters of intent, adoption metrics)

Market trends / industry reports

Example Scoring Bands:
Large validated TAM + multiple paying clients → 1000
Medium TAM with early adoption → 850
Small niche TAM → 700
Untested market → 500
Questionable market → 300


"""

FINANCIAL_STRENGTH_SCORE_PROMPT_V0 = """
Your task is to analyze the financial strength of a company based on the following criteria:

To calculate Burn and Runway Score (BR) -

Burn Rate=Monthly Operating Expenses-Monthly Revenue

Runway (months)=Cash Reserves/Monthly Net Burn

Where:
Cash Reserves = funds in bank / treasury (from funding or revenue surplus).

Monthly Net Burn = cash outflow after adjusting for revenues.

Example Calculation
Cash Reserves = $6M
Monthly Expenses = $500K
Monthly Revenue = $200K
Net Burn = $500K - $200K = $300K
BR = 6M/300K = 20 Months

Runway (months)
Normalized BR Score
> 24 months: 1000
18-24 months: 850
12-17 months: 700
6-11 months: 500
< 6 months: 300

"""
FINANCIAL_STRENGTH_SCORE_PROMPT = """
Your task is to analyze the financial strength of a company based on the following criteria:

If the financial data is not available, please provide an estimated score based on qualitative factors such as funding rounds, investor profiles, and revenue indicators.

To calculate Financial Strength Score (FS) -
Consider factors such as funding rounds, investor profiles, revenue indicators, and burn rate/runway if data is available.
Example Scoring Bands:
Strong funding with reputable investors and positive revenue indicators → 1000
Moderate funding with some revenue indicators → 850
Basic funding with limited revenue indicators → 700
Minimal funding and questionable revenue indicators → 500
No funding and negative revenue indicators → 300

"""


REVENUE_GROWTH_SCORE_PROMPT = """
Your task is to analyze the revenue growth of a company based on the following criteria:


To calculate Revenue Growth Score (RG) -

RG%= {(Revenueprevious-Revenuecurrent)/Revenueprevious} x100

Where:
Revenuecurrent = most recent annual (or monthly) revenue


Revenueprevious = revenue from the previous comparable period
Example Calculation
Revenue in 2023 = $5M
Revenue in 2022 = $3M

RG%={(5M-3M)/3M}x100 = 66.7%

YoY Growth %
Normalized Score (RG)
>100%: 1000
50-100%: 850
20-49%: 700
0-19%: 500
Negative growth: 300



"""


FOUNDER_BACKGROUND_RESEARCH_PROMPT = """
You are an expert researcher who specializes in gathering and analyzing founder background information.

Your task is to gather founder background details given a company name.

## Use planning agent design pattern. Following are the steps of the plan
  
1. Identify the founders of the company.
2. For each founder, gather information on the following attributes:
   - Education Prestige (Tier-1, Tier-2, Tier-3). If multiple degrees, take the highest tier.
   - Past Startup Experience (Successful exit, Prior startup raised VC, No startup experience). If multiple startups, take the highest level of experience.
   - Domain Expertise (10+ years, 5-10 years, <5 years). If multiple domains, take the level of expertise in the domain most relevant to the company's industry.
   - Leadership Roles (CXO in large firm, Senior Manager, Junior roles). If multiple roles, take the highest role.
   - Network Strength (Multiple Tier-1 investors & accelerators in network, limited). If multiple networks, take the strongest network.
   - Reputation Signals (Positive media, awards; Neutral; Negative controversies). If multiple signals, take the negative signal if any, else positive if any, else neutral.

Return data in key:value pairs.

"""

POINTS_ATTRIBUTER_PROMPT_V1 = """
Your task is to attribute points to each founder based on the rubric provided below.

For each founder, attribute points based on the following rubric:
   - Education Prestige : Tier-1 → 1000; Tier-2 → 700; Tier-3 → 500
   - Past Startup Experience   : Successful exit → 1000; Prior startup raised VC → 800; No startup exp. → 500
   - Domain Expertise  : 10+ yrs in same domain → 1000; 5-10 yrs → 800; <5 yrs → 600
   - Leadership Roles  : CXO in large firm → 1000; Sr. Manager → 800; Junior roles → 600
   - Network Strength : Multiple Tier-1 investors & accelerators in network → 1000; limited → 600
   - Reputation Signals : Positive media, awards → 1000; Neutral → 700; Negative controversies → 300
"""

FOUNDER_BACKGROUND_SCORE_CALCULATOR_PROMPT_V1 = """
Your task is to calculate the average founder background score based on the scores of individual founders.
Following are the weights for each attribute:
   - Education Prestige :  15%
   - Past Startup Experience   :  20%
   - Domain Expertise  : 20%
   - Leadership Roles  : 15%
   - Network Strength :  15%
   - Reputation Signals  : 15%
   
Score for individual founder = Sum of (attribute score * attribute weight)

Overall founder background score = Average of scores of all founders rounded to nearest hundred.

Return only the final overall founder background score as plain text. Without markdown or code.
"""
