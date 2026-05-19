import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
from ddgs import DDGS

load_dotenv()

app = FastAPI(title="Research AI Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class ResearchRequest(BaseModel):
    topic: str

def call_ai(prompt: str):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are an expert research AI agent."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.4,
    )

    return response.choices[0].message.content

def fetch_agent(topic: str):
    results = []

    try:
        with DDGS() as ddgs:
            for r in ddgs.text(topic, max_results=5):
                results.append({
                    "title": r.get("title"),
                    "link": r.get("href"),
                    "snippet": r.get("body")
                })

    except Exception:
        results = [
            {
                "title": f"Research source unavailable for {topic}",
                "link": "https://www.google.com",
                "snippet": "Live search failed temporarily, so the AI will continue using its internal knowledge and the provided topic."
            }
        ]

    return results

@app.get("/")
def home():
    return {
        "message": "Research AI Agent Backend Running"
    }

@app.post("/research")
def research(req: ResearchRequest):

    topic = req.topic

    sources = fetch_agent(topic)

    source_text = "\n".join([
        f"""
        Title: {s['title']}
        Link: {s['link']}
        Snippet: {s['snippet']}
        """
        for s in sources
    ])

    summary = call_ai(f"""
    Summarize this topic professionally.

    Topic:
    {topic}

    Sources:
    {source_text}

    Give:
    1. Overview
    2. Key Insights
    3. Important Trends
    4. Challenges
    """)

    report = call_ai(f"""
    Create a detailed professional research report.

    Topic:
    {topic}

    Summary:
    {summary}

    Structure:
    # Executive Summary
    # Background
    # Key Findings
    # Applications
    # Risks
    # Future Scope
    # Conclusion
    """)

    review = call_ai(f"""
    Review this research report strictly.

    Report:
    {report}

    Give:
    1. Accuracy score /10
    2. Clarity score /10
    3. Missing points
    4. Improvements
    5. Final verdict
    """)

    return {
        "topic": topic,
        "fetch_agent": sources,
        "summarize_agent": summary,
        "report_agent": report,
        "review_agent": review
    }