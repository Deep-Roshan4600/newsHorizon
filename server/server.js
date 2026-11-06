import express from "express";
import cors from "cors";
import Parser from "rss-parser";

const app = express();
const parser = new Parser();
const port = process.env.PORT || 5000;

app.use(cors());

const feeds = [
  {
    name: "Economic Times",
    url: "https://economictimes.indiatimes.com/rssfeedsdefault.cms",
  },
  {
    name: "BBC India",
    url: "https://feeds.bbci.co.uk/news/world/asia/india/rss.xml",
  },
  {
    name: "NDTV",
    url: "https://feeds.feedburner.com/ndtvnews-top-stories",
  },
  {
    name: "Times of India",
    url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
  },
];

function cleanText(text = "") {
  return String(text)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

app.get("/api/news", async (_request, response) => {
  const sources = await Promise.all(
    feeds.map(async (feed) => {
      try {
        const result = await parser.parseURL(feed.url);

        return {
          source: feed.name,
          items: (result.items || []).slice(0, 5).map((item) => ({
            title: cleanText(item.title || "Untitled story"),
            summary: cleanText(
              item.contentSnippet || item.content || "Summary not available.",
            ),
            link: item.link || "#",
            publishedAt: item.isoDate || item.pubDate || "",
          })),
        };
      } catch (error) {
        console.log(`Could not load ${feed.name}: ${error.message}`);
        return { source: feed.name, items: [] };
      }
    }),
  );

  response.json(sources);
});

app.listen(port, () => {
  console.log(`News server is running on port ${port}`);
});