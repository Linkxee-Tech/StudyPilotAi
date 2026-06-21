import { vi, beforeAll, afterAll } from "vitest";

// The Gemini SDK is mocked globally because this test environment has no
// outbound network access to generativelanguage.googleapis.com. Every other
// dependency (Postgres, Redis) is the real local instance — these are
// genuine integration tests, not a fully-mocked unit suite.
vi.mock("@google/generative-ai", () => {
  class FakeGoogleGenerativeAI {
    getGenerativeModel() {
      return {
        generateContent: vi.fn().mockResolvedValue({
          response: { text: () => mockResponseQueue.shift() ?? JSON.stringify({}) },
        }),
      };
    }
  }
  return {
    GoogleGenerativeAI: FakeGoogleGenerativeAI,
    HarmCategory: {
      HARM_CATEGORY_HARASSMENT: "HARM_CATEGORY_HARASSMENT",
      HARM_CATEGORY_HATE_SPEECH: "HARM_CATEGORY_HATE_SPEECH",
      HARM_CATEGORY_SEXUALLY_EXPLICIT: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      HARM_CATEGORY_DANGEROUS_CONTENT: "HARM_CATEGORY_DANGEROUS_CONTENT",
    },
    HarmBlockThreshold: { BLOCK_LOW_AND_ABOVE: "BLOCK_LOW_AND_ABOVE" },
  };
});

// Tests push the exact JSON string they want the "model" to return next,
// then call the service under test — see tests/helpers/mockGemini.ts.
export const mockResponseQueue: string[] = [];

beforeAll(() => {
  Object.defineProperty(process.env, "NODE_ENV", { value: "test", configurable: true });
});

afterAll(() => {
  mockResponseQueue.length = 0;
});
