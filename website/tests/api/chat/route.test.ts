import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/chat/route";

vi.mock("@ai-sdk/openai-compatible", () => ({
  createOpenAICompatible: vi.fn(() => vi.fn(() => ({ id: "mock-model" }))),
}));

vi.mock("ai", () => ({
  streamText: vi.fn(),
  convertToModelMessages: vi.fn(),
  stepCountIs: vi.fn(() => ({ type: "stop-condition" })),
}));

vi.mock("@/app/api/chat/rate-limit", () => ({
  getClientIp: vi.fn(() => "1.2.3.4"),
  isRateLimited: vi.fn(),
}));

vi.mock("@/app/api/chat/tools", () => ({
  deputyTools: { search_deputies: {}, count_deputies: {}, get_deputy_profile: {} },
}));

import { isRateLimited } from "@/app/api/chat/rate-limit";
import { streamText, convertToModelMessages } from "ai";

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isRateLimited).mockReturnValue(false);
    vi.mocked(convertToModelMessages).mockResolvedValue([] as unknown as Awaited<ReturnType<typeof convertToModelMessages>>);
  });

  it("returns 429 when rate limited", async () => {
    vi.mocked(isRateLimited).mockReturnValue(true);

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ messages: [] }),
    });

    const response = await POST(req);
    expect(response.status).toBe(429);
    const data = await response.json();
    expect(data.error).toContain("limite de mensagens");
  });

  it("returns 400 when messages is not an array", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ messages: "not-an-array" }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Formato de mensagens inválido");
  });

  it("returns stream response on success", async () => {
    const mockStreamResponse = new Response("stream-data");
    vi.mocked(streamText).mockResolvedValue({
      toUIMessageStreamResponse: () => mockStreamResponse,
    } as unknown as Awaited<ReturnType<typeof streamText>>);

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: "hello" }] }),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({
        model: { id: "mock-model" },
        system: expect.stringContaining("Populi"),
        tools: expect.any(Object),
        stopWhen: { type: "stop-condition" },
      }),
    );
  });

  it("returns 500 on unexpected error", async () => {
    vi.mocked(streamText).mockRejectedValue(new Error("AI provider failed"));

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: "hello" }] }),
    });

    const response = await POST(req);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toContain("temporariamente indisponível");
  });

  it("converts messages before passing to streamText", async () => {
    const mockMessages = [{ role: "user", content: "test" }];
    vi.mocked(convertToModelMessages).mockResolvedValue(mockMessages as unknown as Awaited<ReturnType<typeof convertToModelMessages>>);
    vi.mocked(streamText).mockResolvedValue({
      toUIMessageStreamResponse: () => new Response("stream"),
    } as unknown as Awaited<ReturnType<typeof streamText>>);

    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ messages: mockMessages }),
    });

    await POST(req);

    expect(convertToModelMessages).toHaveBeenCalledWith(mockMessages);
    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: mockMessages,
      }),
    );
  });
});
