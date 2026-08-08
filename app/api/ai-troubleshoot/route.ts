import { NextRequest, NextResponse } from "next/server";

interface TroubleshootingSolution {
  category: "Cisco Routing" | "Workstation PC" | "Network Switch" | "Peripherals";
  title: string;
  confidenceScore: number;
  diagnosticSteps: string[];
  recommendedAction: "REPLACE_HARDWARE" | "FLAG_MAINTENANCE" | "SOFTWARE_RESET" | "PORT_RECONFIG";
}

const HARDWARE_KNOWLEDGE_BASE: {
  keywords: string[];
  solution: TroubleshootingSolution;
}[] = [
  {
    keywords: ["cisco", "bgp", "boot loop", "router", "rommon", "ios"],
    solution: {
      category: "Cisco Routing",
      title: "Cisco 2901 Router ROMMON / Boot Loop Recovery",
      confidenceScore: 96,
      diagnosticSteps: [
        "1. Ku xidh console cable dekedda RJ45 Console ee router-ka adiga oo adeegsanaya PuTTY (Speed: 9600 baud).",
        "2. Haddii router-ku ku jiro `rommon 1 >`, hubi variable-ka boot-ka adiga oo qoraya `set`.",
        "3. Ku qor `dir flash:` si aad u xaqiijiso in faylka Cisco IOS `.bin` uu ku jiro xusuusta flash-ka.",
        "4. Samee boot toos ah adiga oo qoraya: `boot flash:c2900-universalk9-mz.SPA.157-3.M3.bin`.",
      ],
      recommendedAction: "SOFTWARE_RESET",
    },
  },
  {
    keywords: ["amber", "switch", "catalyst", "blinking", "port", "loop"],
    solution: {
      category: "Network Switch",
      title: "Cisco Catalyst 2960 Port Amber Blinking (STP Loop Detection)",
      confidenceScore: 94,
      diagnosticSteps: [
        "1. Nalalka midabka amber-ka (hurdi) ee libiqsanaya waxay muujinayaan in Spanning Tree Protocol (STP) uu xidhay port-ka si looga hortago Broadcast Loop.",
        "2. Ka saar labada patch cable ee laga yaabo in ay isku switch dib ugu xidhan yihiin (Loopback Cable).",
        "3. Gal switch configuration mode: `show spanning-tree blockedports`.",
        "4. Haddii port-ku yahay `err-disabled`, ku samee `shutdown` ka dibna `no shutdown`.",
      ],
      recommendedAction: "PORT_RECONFIG",
    },
  },
  {
    keywords: ["pc", "workstation", "boot", "beep", "ram", "display", "black screen", "power"],
    solution: {
      category: "Workstation PC",
      title: "Dell OptiPlex Power Amber Blinking / RAM Reseating",
      confidenceScore: 92,
      diagnosticSteps: [
        "1. Haddii badhanka korontada ee Dell uu 2 jeer libiqsado (Code 2, 3), waxay la macno tahay in RAM-ku uusan si buuxda u fadhin.",
        "2. Ka saar fiilada korontada, fur daboolka PC-ga, ka dibna soo bixi labada DDR4 RAM sticks.",
        "3. Ku nadiifi baalasha dahabka ah (pins) maro qalalan ama tirtire, dibna ugu riix labada dhinac ilaa ay ka guxaan (Click).",
        "4. Dib u daar oo hubi in nalka Dell uu caddaan noqdo.",
      ],
      recommendedAction: "FLAG_MAINTENANCE",
    },
  },
  {
    keywords: ["cable", "patch", "rj45", "lan", "no link", "crimping"],
    solution: {
      category: "Network Switch",
      title: "Patch Cable & RJ45 Pinout Discontinuity (T568B Standard)",
      confidenceScore: 91,
      diagnosticSteps: [
        "1. Ku xidh labada dacal ee cable-ka Network Cable Tester-ka.",
        "2. Hubi in dhammaan 8-da nal (Pins 1 ilaa 8) ay si isku xigxigta u daarmaan (Orange-white, Orange, Green-white, Blue, Blue-white, Green, Brown-white, Brown).",
        "3. Haddii pin 1, 2, 3, ama 6 ay go'an yihiin, jar RJ45 madaxiisa oo dib u crimp-garee adiga oo adeegsanaya T568B standard.",
      ],
      recommendedAction: "REPLACE_HARDWARE",
    },
  },
];

export async function POST(req: NextRequest) {
  try {
    const { issueDescription } = await req.json();

    if (!issueDescription || typeof issueDescription !== "string") {
      return NextResponse.json(
        { success: false, error: "Fadlan sharax ciladda hardware-ka." },
        { status: 400 }
      );
    }

    const lower = issueDescription.toLowerCase();

    // Semantic matching against knowledge base
    let bestMatch = HARDWARE_KNOWLEDGE_BASE[0].solution;
    let highestScore = 0;

    for (const item of HARDWARE_KNOWLEDGE_BASE) {
      let score = 0;
      for (const kw of item.keywords) {
        if (lower.includes(kw)) {
          score += 20;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item.solution;
      }
    }

    return NextResponse.json({
      success: true,
      query: issueDescription,
      solution: bestMatch,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Troubleshooting failed" },
      { status: 500 }
    );
  }
}
