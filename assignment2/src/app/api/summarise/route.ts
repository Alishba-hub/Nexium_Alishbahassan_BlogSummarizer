import { NextRequest, NextResponse } from "next/server";
import { scrapeBlogText } from "@/utils/scraper";
import { supabase } from "@/lib/supabase";
import { connectMongo, Blog } from "@/lib/mongodb";

import {
  generateSummaryWithGemini,
  translateToUrduWithGemini,
} from "@/lib/summarizer";

const MAX_CHARS = 3_000;   // keep prompts within free‑tier token budget

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ message: "Invalid URL" }, { status: 400 });
    }

    /* ─── 1. Scrape blog text ─── */
    let content = await scrapeBlogText(url);
    content = content.slice(0, MAX_CHARS);            

    /* ─── 2. Summarise & translate with Gemini  ─── */
    let summaryEn: string, summaryUr: string;

    try {
      summaryEn = await generateSummaryWithGemini(content);
      summaryUr = await translateToUrduWithGemini(summaryEn);
    } catch (err: any) {
      if ((err.status === 429 || err.status === 503)) {
        console.warn("📉 Gemini quota hit—retrying once after 3 s …");
        await new Promise(r => setTimeout(r, 3000));
        summaryEn = await generateSummaryWithGemini(content);
        summaryUr = await translateToUrduWithGemini(summaryEn);
      } else {
        throw err;
      }
    }

    /* ─── 3. Save Urdu summary to Supabase ─── */
    const { data, error } = await supabase
      .from("summriser")
      .insert([{ url, summary: summaryUr }]);

    if (error) console.error("❌ Supabase insert error:", error.message);
    else       console.log("✅ Supabase insert success:", data);

    /* ─── 4. Save full blog to MongoDB ─── */
    await connectMongo();
    await Blog.create({ url, content });

    /* ─── 5. Respond to client ─── */
    return NextResponse.json({ content, summaryEn, summary: summaryUr });

  } catch (err:any) {
    console.error("Summarise route error:", err);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
