const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
import { useEffect, useState } from "react";

export default function NewsPage() {
  const [sources, setSources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNews() {
      try {
        const response = await fetch(`${apiUrl}/api/news`);

        if (!response.ok) {
          throw new Error("The news server returned an error.");
        }

        const newsSources = await response.json();
        setSources(newsSources);
      } catch {
        setError("Could not load the news. Check that the server is running.");
      } finally {
        setIsLoading(false);
      }
    }

    loadNews();
  }, []);

  return (
    <>
      <section className="page-card">
        <p className="eyebrow">YOUR DAILY BRIEFING</p>
        <h1>See what’s happening.</h1>
        <p>Headlines from trusted sources, gathered in one place.</p>
      </section>

      {isLoading && <p className="status-message">Loading headlines…</p>}
      {error && <p className="status-message">{error}</p>}

      <div className="source-grid">
        {sources.map((source) => (
          <section className="source-card" key={source.source}>
            <h2>{source.source}</h2>

            {source.items.length === 0 ? (
              <p>No stories available right now.</p>
            ) : (
              <ul className="story-list">
                {source.items.map((story, index) => (
                  <li key={`${story.link}-${index}`}>
                    <details>
                      <summary>{story.title}</summary>
                      <p>{story.summary}</p>
                      <a href={story.link} target="_blank" rel="noreferrer">
                        Read the full story
                      </a>
                    </details>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </>
  );
}