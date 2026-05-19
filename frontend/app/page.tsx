"use client";

import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  async function runResearch() {
    if (!topic.trim()) return;

    setLoading(true);
    setData(null);

    try {
      const response = await fetch("https://ai-research-agent-259e.onrender.com/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
        }),
      });

      const result = await response.json();

      setData(result);
    } catch (error) {
      console.error(error);
      alert("Backend connection failed");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="text-center mb-12">
          <p className="text-indigo-400 font-semibold mb-3">
            Multi-Agent Research Automation
          </p>

          <h1 className="text-6xl font-black mb-5">
            Research AI Agent
          </h1>

          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            Enter any topic and let four intelligent AI agents fetch data,
            summarize insights, generate reports, and review quality
            automatically.
          </p>
        </div>

        <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-6 shadow-2xl mb-10">

          <div className="flex flex-col md:flex-row gap-4">

            <input
              type="text"
              placeholder="Enter research topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1 px-5 py-4 rounded-2xl bg-slate-900 border border-slate-700 outline-none focus:border-indigo-400"
            />

            <button
              onClick={runResearch}
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 transition-all px-8 py-4 rounded-2xl font-bold"
            >
              {loading ? "Running Agents..." : "Run Research"}
            </button>

          </div>
        </div>

        {loading && (
          <div className="grid md:grid-cols-4 gap-5 mb-10">

            {[
              "Fetch Agent",
              "Summarize Agent",
              "Report Agent",
              "Review Agent",
            ].map((agent) => (
              <div
                key={agent}
                className="bg-white/10 border border-white/20 rounded-3xl p-6 animate-pulse"
              >
                <h3 className="font-bold text-xl mb-3">{agent}</h3>

                <div className="h-3 bg-slate-700 rounded mb-2"></div>
                <div className="h-3 bg-slate-700 rounded mb-2"></div>
                <div className="h-3 bg-slate-700 rounded"></div>
              </div>
            ))}

          </div>
        )}

        {data && (
          <div className="space-y-8">

            <Section
              title="1. Fetch Agent"
              content=""
            >
              <div className="space-y-4">

                {data.fetch_agent.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="bg-slate-950/60 border border-slate-700 rounded-2xl p-5"
                  >
                    <h3 className="text-xl font-bold text-indigo-300 mb-2">
                      {item.title}
                    </h3>

                    <p className="text-slate-300 mb-3">
                      {item.snippet}
                    </p>

                    <a
                      href={item.link}
                      target="_blank"
                      className="text-blue-400"
                    >
                      View Source
                    </a>
                  </div>
                ))}

              </div>
            </Section>

            <Section
              title="2. Summarize Agent"
              content={data.summarize_agent}
            />

            <Section
              title="3. Report Agent"
              content={data.report_agent}
            />

            <Section
              title="4. Review Agent"
              content={data.review_agent}
            />

          </div>
        )}

      </div>
    </main>
  );
}

function Section({
  title,
  content,
  children,
}: {
  title: string;
  content: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-xl">

      <h2 className="text-3xl font-black text-indigo-300 mb-5">
        {title}
      </h2>

      {children ? (
        children
      ) : (
        <pre className="whitespace-pre-wrap text-slate-200 leading-relaxed font-sans">
          {content}
        </pre>
      )}

    </div>
  );
}