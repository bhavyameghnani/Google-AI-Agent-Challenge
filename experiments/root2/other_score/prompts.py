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


PROMPT_V1 = """
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

 

# Output of above

"""
Founder Background Analysis: House of X
Mumbai, India - House of X, a platform enabling creators to launch their own D2C brands, is led by a founding team with a blend of entrepreneurial zeal and deep technical expertise. An analysis of the backgrounds of co-founders Raj Shamani and Neeraj Kumawat reveals a combination of strong educational credentials, seasoned startup experience, and established industry reputations.

Raj Shamani: The Visionary Entrepreneur and Content Creator
Raj Shamani, a well-known public figure and content creator, brings a wealth of entrepreneurial experience to House of X. His journey has been widely covered in the media, highlighting a strong narrative of building businesses from the ground up.

Attribute	Details
Education Prestige	Tier-3
Past Startup Experience	Successful exit
Domain Expertise	10+ years
Leadership Roles	CXO in large firm
Network Strength	Multiple Tier-1 investors & accelerators in network
Reputation Signals	Positive media, awards
Shamani's educational background includes a Bachelor of Business Administration from the Prestige Institute of Management & Research and a Master of Business Administration from SP Jain Institute of Management & Research. His entrepreneurial journey began at the age of 16 with his family's business, Shamani Industries, which he significantly scaled. Prior to House of X, he founded "Figuring Out Academy," an ed-tech platform. His network is extensive, evidenced by his angel investments in multiple startups and the backing of House of X by prominent investors. Shamani has cultivated a strong personal brand, receiving positive media attention and awards, including recognition at the National Creators Award from PM Narendra Modi.

Neeraj Kumawat: The Technology Leader
Neeraj Kumawat, the Co-founder and Chief Technology Officer, provides the essential technical leadership for House of X. His background is firmly rooted in technology and scaling engineering teams within the startup ecosystem.

Attribute	Details
Education Prestige	Tier-1
Past Startup Experience	Prior startup raised VC
Domain Expertise	10+ years
Leadership Roles	CXO in large firm
Network Strength	Limited
Reputation Signals	Neutral
Kumawat holds a B.Tech from the prestigious Indian Institute of Technology, Guwahati, placing him in the Tier-1 category for education. His career has been marked by significant leadership roles in the tech industry. He has served as the Co-Founder and CTO at several ventures, including Nirmaaan Technologies and Samriddhee Techlabs. Notably, he held senior positions, including VP and AVP of Engineering, at Trell, a venture-backed startup. This extensive experience in building and leading engineering teams provides House of X with a strong technical foundation. While his public profile is more neutral compared to his co-founder, his background demonstrates a solid track record within the tech and startup community.

     
{
"founders": [
{
"founder_name": "Raj Shamani",
"education_prestige": "Tier-3",
"past_startup_experience": "Successful exit",
"domain_expertise": "10+ years",
"leadership_roles": "CXO in large firm",
"network_strength": "Multiple Tier-1 investors & accelerators in network",
"reputation_signals": "Positive media, awards"
},
{
"founder_name": "Neeraj Kumawat",
"education_prestige": "Tier-1",
"past_startup_experience": "Prior startup raised VC",
"domain_expertise": "10+ years",
"leadership_roles": "CXO in large firm",
"network_strength": "Limited",
"reputation_signals": "Neutral"
}
]
}
"""

# It is better to not directly map to scores as this data can be used for People page also