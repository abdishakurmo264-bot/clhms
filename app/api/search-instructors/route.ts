import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "mock-openai-key",
});

// Initialize Pinecone Client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "mock-pinecone-key",
});

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || "clhms-instructors";

export interface InstructorSearchResult {
  instructorId: string;
  fullName: string;
  department: string;
  specializations: string[];
  bio: string;
  preferredShifts: string[];
  activeLoadCount: number;
  matchScore: number;
  snippet: string;
}

/**
 * AI-Semantic-Agent: Route Handler for Intelligent Instructor Search
 * Natural Language Query (e.g., "Cisco BGP afternoon instructor", "Linux Kernel debugging assistant")
 * Method: POST or GET
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { query, topK = 5, departmentFilter, minScore = 0.55 } = body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Fadlan soo geli weedh raadin ah (Query string is required).",
        },
        { status: 400 }
      );
    }

    const trimmedQuery = query.trim();

    // 1. Generate Query Vector Embedding using OpenAI text-embedding-3-small (1536 dim)
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: trimmedQuery,
      encoding_format: "float",
    });

    const queryVector = embeddingResponse.data[0].embedding;

    // 2. Connect to Pinecone Index & Execute Semantic Query
    const index = pinecone.index(PINECONE_INDEX_NAME);

    // Optional metadata filter builder (e.g. filter by department or availability)
    const filter: Record<string, any> = {};
    if (departmentFilter) {
      filter["department"] = { $eq: departmentFilter };
    }

    // Query Pinecone Index
    const pineconeRes = await index.query({
      vector: queryVector,
      topK: Math.min(topK, 20),
      includeMetadata: true,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    });

    // 3. Transform and rank results
    const results: InstructorSearchResult[] = (pineconeRes.matches || [])
      .filter((match) => (match.score ?? 0) >= minScore)
      .map((match) => {
        const metadata = (match.metadata || {}) as Record<string, any>;
        return {
          instructorId: (match.id as string) || (metadata.instructorId as string),
          fullName: (metadata.full_name as string) || "Macallin aan la magacaabin",
          department: (metadata.department as string) || "Computer Science",
          specializations: (metadata.specializations as string[]) || [],
          bio: (metadata.bio as string) || (metadata.text as string) || "",
          preferredShifts: (metadata.preferred_shifts as string[]) || ["Morning", "Afternoon"],
          activeLoadCount: Number(metadata.active_load_count ?? 0),
          matchScore: parseFloat(((match.score ?? 0) * 100).toFixed(1)),
          snippet: (metadata.snippet as string) || `Khabiir ku takhasusay ${((metadata.specializations as string[]) || []).join(", ")}`,
        };
      });

    // 4. Return formatted response
    return NextResponse.json({
      success: true,
      query: trimmedQuery,
      totalMatched: results.length,
      instructors: results,
      searchLatencyMs: Date.now(),
    });
  } catch (error: any) {
    console.error("AI Semantic Search Error:", error);

    // Friendly fallback mock data if vector DB keys are not yet configured in local test env
    if (
      process.env.NODE_ENV !== "production" &&
      (!process.env.PINECONE_API_KEY || !process.env.OPENAI_API_KEY)
    ) {
      return NextResponse.json({
        success: true,
        query: "Cisco BGP afternoon instructor (Local Development Mock)",
        totalMatched: 2,
        instructors: [
          {
            instructorId: "inst-cisco-01",
            fullName: "Eng. Ahmed Maxamed (CCIE)",
            department: "Network Engineering",
            specializations: ["Cisco BGP", "OSPF", "MPLS", "Firewall Configuration"],
            bio: "Senior Network Engineer with 8+ years teaching Cisco routing protocols and BGP transit topologies.",
            preferredShifts: ["Afternoon", "Evening"],
            activeLoadCount: 2,
            matchScore: 94.8,
            snippet: "Khabiir sare oo dhiga Cisco BGP Routing & Switching.",
          },
          {
            instructorId: "inst-cisco-02",
            fullName: "Ust. Fartuun Cali",
            department: "Computer Networks & Security",
            specializations: ["BGP Peering", "Juniper Junos", "Network Automation"],
            bio: "Certified Cisco & Juniper trainer managing campus core routing labs.",
            preferredShifts: ["Afternoon"],
            activeLoadCount: 1,
            matchScore: 89.2,
            snippet: "Khabiir ku takhasustay BGP Peering iyo Network Infrastructure.",
          },
        ],
        note: "Configured with Pinecone SDK and OpenAI Embeddings. Set PINECONE_API_KEY and OPENAI_API_KEY for live production index.",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Raadinta AI Semantic way fashilantay.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET Handler to allow quick queries via URL query parameters
 * Usage: /api/search-instructors?q=Cisco+BGP+afternoon
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || searchParams.get("query") || "";
  const topK = parseInt(searchParams.get("topK") || "5", 10);
  const departmentFilter = searchParams.get("department") || undefined;

  const simulatedReq = new NextRequest(req.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, topK, departmentFilter }),
  });

  return POST(simulatedReq);
}
