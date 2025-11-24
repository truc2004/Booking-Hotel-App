// src/api/aiChatApi.ts
export type ChatHistoryItem = {
  from: "user" | "ai";
  text: string;
};

const API_URL = "https://hotel-mobile-be.onrender.com/hotel/ai";
// const API_URL = "http://localhost:3002/hotel/ai"; // khi test local

export async function sendMessageToAI(
  message: string,
  history: ChatHistoryItem[]
): Promise<string> {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      history, // [{ from, text }]
    }),
  });

  if (!res.ok) {
    throw new Error("Lỗi gọi AI!");
  }

  const data = await res.json();
  return data.reply as string;
}
