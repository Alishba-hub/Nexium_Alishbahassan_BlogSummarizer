import * as cheerio from "cheerio";

export async function scrapeBlogText(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Priority selectors for main content (ordered by importance)
    const contentSelectors = [
      "article", 
      ".article-content",
      ".post-content",
      ".entry-content",
      ".blog-post",
      "main",
      "body"  
    ];

    
    let content = "";
    for (const selector of contentSelectors) {
      const elements = $(selector);
      if (elements.length) {
        content = elements
          .find("p, h2, h3, h4, li")  
          .map((_, el) => $(el).text().trim())
          .get()
          .filter(text => text.length > 30)  
          .join("\n\n");
        
        if (content.split('\n').length >= 30) break;
      }
    }

    
    if (content.split('\n').length < 30) {
      content = $("body")
        .find("p, h2, h3, h4")
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(text => text.length > 30)
        .join("\n\n");
    }

    
    if (!content.trim() || content.split('\n').length < 10) {
      throw new Error("No meaningful content found");
    }

    // Clean and format the content
    return content
      .replace(/\n{3,}/g, "\n\n")
      .replace(/\s{2,}/g, " ")
      .replace(/\[.*?\]/g, "")  
      .replace(/\bAdvertisement\b.*?\n/gi, "")  // Remove ads
      .trim();

  } catch (err) {
    console.error("Scraping failed:", err);
    return "Failed to scrape blog content. Original error: " + 
           (err instanceof Error ? err.message : String(err));
  }
}
