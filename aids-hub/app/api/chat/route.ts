import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function isChatMessage(message: unknown): message is ChatMessage {
  if (typeof message !== "object" || message === null) return false;

  return (
    "role" in message &&
    (message.role === "user" || message.role === "assistant") &&
    "content" in message &&
    typeof message.content === "string" &&
    message.content.trim().length > 0 &&
    message.content.length <= 5000
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Groq API key is missing. Add GROQ_API_KEY to .env.local and restart the server." },
      { status: 500 }
    );
  }

  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("messages" in body) ||
      !Array.isArray(body.messages) ||
      body.messages.length === 0 ||
      body.messages.length > 30
    ) {
      return NextResponse.json({ error: "Please provide a valid chat conversation." }, { status: 400 });
    }

    if (!body.messages.every(isChatMessage)) {
      return NextResponse.json({ error: "Invalid message format. Each message must be under 5,000 characters." }, { status: 400 });
    }

    const messages = body.messages;
    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });
    const response = await client.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are StudyAI, a helpful academic assistant for Artificial Intelligence and Data Science students.
Answer every request using only 2 to 5 short numbered points. Keep each point to one concise sentence and answer directly.
Do not add an introduction, conclusion, headings, tables, or extra examples unless essential to answer the question. For quizzes, give only 2 to 5 questions.
Explain academic concepts simply and help with AI, Python, statistics, data science, machine learning, coding, and projects. Do not invent college rules, exam dates, marks, or official notices. Say when information is uncertain and support learning rather than completing assessed work.`,
        },
        ...messages,
      ],
      max_tokens: 300,
    });

    return NextResponse.json({
      reply: response.choices[0]?.message.content || "I couldn't generate an answer. Please try again.",
    });
  } catch (error) {
    console.error("StudyAI request failed:", error);
    return NextResponse.json(
      { error: "StudyAI could not respond. Check GROQ_API_KEY, model availability, and your Groq API usage." },
      { status: 500 }
    );
  }
}
