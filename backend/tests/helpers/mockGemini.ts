import { mockResponseQueue } from "../setup";

/** Queues a JSON-serializable value to be returned by the next Gemini call. */
export function queueGeminiResponse(value: unknown): void {
  mockResponseQueue.push(typeof value === "string" ? value : JSON.stringify(value));
}

export function clearGeminiQueue(): void {
  mockResponseQueue.length = 0;
}
