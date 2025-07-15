import { NextRequest, NextResponse } from "next/server";
import { scrapeBlogText } from "@/utils/scraper";
import { supabase } from "@/lib/supabase";
import { connectMongo, Blog } from "@/lib/mongodb";
import {
  generateSummaryWithGemini,
  translateToUrduWithGemini,
} from "@/lib/summarizer";

const MAX_CHARS = 3_000; // keep prompts within free-tier token budget

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    
    if (!url || typeof url !== "string") {
      return NextResponse.json({ message: "Invalid URL" }, { status: 400 });
    }

    /* ─── 1. Scrape blog text ─── */
    let content = await scrapeBlogText(url);
    content = content.slice(0, MAX_CHARS);

    /* ─── 2. Summarise & translate with Gemini ─── */
    let summaryEn: string, summaryUr: string;
    
    try {
      summaryEn = await generateSummaryWithGemini(content);
      summaryUr = await translateToUrduWithGemini(summaryEn);
    } catch (err: unknown) {
      // Better error handling with proper type checking
      if (err && typeof err === 'object' && 'status' in err) {
        const error = err as { status: number };
        if (error.status === 429 || error.status === 503) {
          console.warn("📉 Gemini quota hit—retrying once after 3 s …");
          await new Promise(r => setTimeout(r, 3000));
          summaryEn = await generateSummaryWithGemini(content);
          summaryUr = await translateToUrduWithGemini(summaryEn);
        } else {
          throw err;
        }
      } else {
        throw err;
      }
    }

    /* ─── 3. Save Urdu summary to Supabase ─── */
    try {
      const { data, error } = await supabase
        .from("summriser")
        .insert([{ url, summary: summaryUr }]);
      
      if (error) {
        console.error("❌ Supabase insert error:", error.message);
      } else {
        console.log("✅ Supabase insert success:", data);
      }
    } catch (supabaseError) {
      console.error("❌ Supabase operation failed:", supabaseError);
      // Continue execution - don't fail the whole request for logging issues
    }

    /* ─── 4. Save full blog to MongoDB ─── */
    try {
      await connectMongo();
      await Blog.create({ url, content });
      console.log("✅ MongoDB save successful");
    } catch (mongoError) {
      console.error("❌ MongoDB save failed:", mongoError);
      // Continue execution - don't fail the whole request for logging issues
    }

    /* ─── 5. Respond to client ─── */
    return NextResponse.json({ 
      content, 
      summaryEn, 
      summary: summaryUr 
    });

  } catch (error) {
    console.error("❌ API route error:", error);
    
    // Return appropriate error response
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { message: errorMessage }, 
      { status: 500 }
    );
  }
}
