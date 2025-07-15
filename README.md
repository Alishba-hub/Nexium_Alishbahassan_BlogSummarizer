
# 🧠 NeuralAI – Intelligent Blog Summarizer

NeuralAI is a modern web-based application that **scrapes content from any public blog URL**, summarizes it using AI, and translates the summary into **pure Urdu** — all through an interactive, beautifully designed UI.

Check Demo : https://nexium-alishbahassan-blog-summarize-ecru.vercel.app/
---

## 🚀 Features

- 🔎 **Web Scraping** – Extracts blog content from any valid URL
- 🤖 **AI Summarization** – Generates a concise summary of the content in English
- 🌐 **Urdu Translation** – Converts the summary into pure Urdu using clear, simple language
- 🌙 **Dark/Light Mode** – Toggleable theme with smooth transitions
- ⚡ **Interactive UI** – Particle effects, mouse tracking, animations, and quick demo links
- 📦 **Data Storage** – Saves summaries in both MongoDB and Supabase

---

## 🧠 AI Model Used

This project integrates with **[OpenRouter](https://openrouter.ai/)** and uses the **Gemma-3 27B IT (free)** model:

> **Model:** `google/gemma-3-27b-it:free`  
> **API:** `https://openrouter.ai/api/v1/chat/completions`  
> **Key Stored In:** `.env.local` as `OPENROUTER_API_KEY`

The model is used for:
- Generating short English summaries from scraped blog content
- Translating summaries into Urdu while following natural, concise Urdu writing rules

---

## 🛠 Tech Stack

| Layer              | Technology                                                                 |
|-------------------|------------------------------------------------------------------------------|
| **Frontend**       | Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide Icons               |
| **Backend API**    | Next.js API Routes (`/api/summarise`)                                       |
| **AI Integration** | OpenRouter AI API with Google Gemma-3 Model                                 |
| **Database 1**     | MongoDB (stores full blog content)                                          |
| **Database 2**     | Supabase (stores Urdu summaries with corresponding URLs)                    |
| **UI Components**  | Custom Tailwind-based components (`@/components/ui/button`)                 |
| **Deployment**     | [Vercel](https://vercel.com)                                                |
| **Environment**    | `.env.local` file for API keys and secrets                                  |

---

## 📁 Project Structure

```
/src
  └── /app
      ├── /api/summarise/route.ts     # API route: scraping, summarization, DB storage
      ├── page.tsx                    # Main React page (UI logic and user interaction)
  └── /lib
      ├── summarizer.ts               # AI prompts + API calls to OpenRouter
      ├── supabase.ts                 # Supabase client instance 
      ├── mongodb.ts                  # MongoDB connection and Blog model
└── /utils
      └── scraper.ts                  # Web scraper to extract content from blog URLs
```

---

## 🧪 Quick Demo URLs

Here are some example blog URLs you can try inside the app:

- [HubSpot – AI Marketing](https://blog.hubspot.com/marketing/future-of-ai-marketing)
- [FreeCodeCamp – JS Closures](https://www.freecodecamp.org/news/javascript-closure/)
- [Cursor – AI-First Code Editor](https://www.cursor.so/)

---

## 🧾 Environment Setup

Create a `.env.local` file in the root directory and add your OpenRouter key:

```bash
OPENROUTER_API_KEY=your-openrouter-api-key
```

---

## 📦 Deployment Notes

- Deployed on **Vercel**.
- Make sure `.env.local` is properly configured in **Vercel > Project > Environment Variables**.
- Run locally with:

```bash
npm install
npm run dev
```

To build for production:

```bash
npm run build



