import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { getClientIp, isRateLimited } from "./rate-limit";
import { deputyTools } from "./tools";

const provider = createOpenAICompatible({
  name: "opencode-go",
  apiKey: process.env.OPENCODE_GO_API_KEY,
  baseURL: "https://opencode.ai/zen/go/v1",
});

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({
          error:
            "Atingiu o limite de mensagens. Aguarde uns minutos antes de enviar novamente.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      );
    }

    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Formato de mensagens inválido." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const result = await streamText({
      model: provider("kimi-k2.6"),
      system: `You are a helpful assistant for the Populi platform, which provides public information about Portuguese politicians and deputies. You have access to tools that query a PostgreSQL database with real parliamentary data.

CRITICAL INSTRUCTIONS:
- You must ONLY use information returned by the tools. Do not use external knowledge, do not guess, and do not hallucinate.
- If the tools do not provide the answer, say that you do not know or that you do not have that information. Do NOT say that the information is not in the database, not in the system, or make any reference to data sources, databases, or technical infrastructure. Simply say you do not know.
- Output your responses as plain text. You may use bullet lists (starting lines with "- ") and numbered lists (starting lines with "1. ", "2. ", etc.) when helpful. Do NOT use any other Markdown formatting such as bold, italics, headers, code blocks, tables, horizontal rules, links, images, blockquotes, or inline HTML.

Available tools and when to use them:
- search_deputies: Find deputies by name, party, or constituency. Returns up to 10 matches.
- count_deputies: Use this when the user asks "how many" deputies match certain criteria.
- get_deputy_profile: Use this for ALL detailed information about a single deputy. It returns the full profile including party, constituency, committees, status history, recent initiatives, recent interventions, and activity counts. Do NOT call separate tools for committees, initiatives, or interventions — they are all included in the profile.

Always answer in Portuguese (PT-PT). Be concise and factual.

When searching for deputies:
- Use the search_deputies tool with partial names
- If the user mentions a party, use the party sigla (e.g. PS, PSD, CH, IL, BE, PCP, L, PAN)
- If no exact match is found, suggest similar names

When providing information about a deputy:
- Include their full name and party
- Mention their constituency if relevant
- Use get_deputy_profile for all details (committees, initiatives, interventions are all included)

Example queries you can handle:
- "Tell me about Maria Santos"
- "What did the PSD deputy from Lisbon say about housing?"
- "Show me initiatives by BE on education"
- "What committees is João Ferreira part of?"
- "How many deputies are from Porto?"`,
      messages: await convertToModelMessages(messages),
      tools: deputyTools,
      stopWhen: stepCountIs(5),
    });

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
