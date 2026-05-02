import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { deputyTools } from "./tools";

const provider = createOpenAICompatible({
  name: "opencode-go",
  apiKey: process.env.OPENCODE_GO_API_KEY,
  baseURL: "https://opencode.ai/zen/go/v1",
});

const RATE_LIMIT_REQUESTS = Number(
  process.env.CHAT_RATE_LIMIT_REQUESTS || "30",
);
const RATE_LIMIT_WINDOW_MS = Number(
  process.env.CHAT_RATE_LIMIT_WINDOW_MS || "3600000",
);

interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { timestamps: [now] });
    return false;
  }

  const validTimestamps = entry.timestamps.filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );

  if (validTimestamps.length >= RATE_LIMIT_REQUESTS) {
    rateLimitMap.set(ip, { timestamps: validTimestamps });
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, { timestamps: validTimestamps });
  return false;
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    console.log("[Chat API] Request from IP:", ip);

    if (isRateLimited(ip)) {
      console.log("[Chat API] Rate limited:", ip);
      return new Response(
        JSON.stringify({
          error:
            "Atingiu o limite de mensagens. Aguarde uns minutos antes de enviar novamente.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      );
    }

    const { messages } = await req.json();
    console.log("[Chat API] Received messages count:", messages?.length);
    console.log("[Chat API] Last message:", messages?.[messages.length - 1]);

    if (!Array.isArray(messages)) {
      console.error("[Chat API] Invalid messages format");
      return new Response(
        JSON.stringify({ error: "Formato de mensagens inválido." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    console.log("[Chat API] Calling streamText with model kimi-k2.6");
    const result = await streamText({
      model: provider("kimi-k2.6"),
      system: `You are a helpful assistant for the Populi platform, which provides public information about Portuguese politicians and deputies. You have access to tools that query a PostgreSQL database with real parliamentary data.

Always answer in Portuguese (PT-PT). Be concise and factual.

When searching for deputies:
- Use the search_deputies tool with partial names
- If the user mentions a party, use the party sigla (e.g. PS, PSD, CH, IL, BE, PCP, L, PAN)
- If no exact match is found, suggest similar names

When providing information about a deputy:
- Include their full name and party
- Mention their constituency if relevant
- Use the appropriate tools to get detailed information

Example queries you can handle:
- "Tell me about Maria Santos"
- "What did the PSD deputy from Lisbon say about housing?"
- "Show me initiatives by BE on education"
- "What committees is João Ferreira part of?"`,
      messages: await convertToModelMessages(messages),
      tools: deputyTools,
      stopWhen: stepCountIs(5),
    });

    console.log("[Chat API] Streaming response...");
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[Chat API] Error:", error);

    return new Response(
      JSON.stringify({
        error:
          "O serviço de chat está temporariamente indisponível. Por favor, tente mais tarde.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
