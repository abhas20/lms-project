import ChatMessage from "../models/ChatMessage.js";
import { v4 as uuid } from "uuid";
import { askBedrock } from "../utils/groq.js";

export const chatWithTutor = async (req, res) => {
  try {
    const { session_id, message } = req.body;

    if (!session_id || !message) {
      return res
        .status(400)
        .json({ error: "session_id and message are required" });
    }

    // 1️⃣ Fetch history FIRST
    const history = await ChatMessage.find(
      { session_id },
      { _id: 0, role: 1, content: 1 },
    )
      .sort({ timestamp: 1 })
      .limit(20);

    // 2️⃣ Format history
    const formattedHistory = history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // 3️⃣ Append newest user message
    formattedHistory.push({
      role: "user",
      content: message,
    });

    // 4️⃣ Ask Bedrock
    const aiResponse = await askBedrock(formattedHistory);

    // 5️⃣ Save user message
    await ChatMessage.create({
      id: uuid(),
      session_id,
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // 6️⃣ Save AI reply
    await ChatMessage.create({
      id: uuid(),
      session_id,
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    });

    res.json({ response: aiResponse });
  } catch (error) {
    console.error("ChatWithTutor Error:", error);

    res.status(500).json({
      error: "AI Tutor is currently unavailable. Please try again later.",
    });
  }
};


export const getChatHistory = async (req, res) => {
  try {
    const { session_id } = req.params;

    if (!session_id) {
      return res.status(400).json({ error: "session_id is required" });
    }

    const messages = await ChatMessage.find({ session_id }, { _id: 0 }).sort({
      timestamp: 1,
    });

    res.json(messages);
  } catch (error) {
    console.error("GetChatHistory Error:", error);

    res.status(500).json({
      error: "Failed to fetch chat history",
    });
  }
};
