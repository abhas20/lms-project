import AIEmbedding from "../models/AIEmbedding.js";
import AICourseChat from "../models/AICourseChat.js";
import { embedText } from "../utils/embeddings.js";
import { cosineSimilarity } from "../utils/similarity.js";
import { askBedrock } from "../utils/groq.js";

const SIMILARITY_THRESHOLD = 0.78;

export const askCourseAI = async (req, res) => {
  try {
    const { question, courseId } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        messages: [
          { role: "assistant", content: "Please login to use AI tutor." },
        ],
      });
    }

    if (!question?.trim() || !courseId) {
      return res.status(400).json({
        messages: [
          { role: "assistant", content: "Invalid question or course." },
        ],
      });
    }

    // Generate embedding for question
    const qEmbedding = await embedText(question);

    const docs = await AIEmbedding.find({ courseId });

    let prompt = "";

    if (docs.length) {
      const ranked = docs
        .map((d) => ({
          chunk: d.chunk,
          score: cosineSimilarity(qEmbedding, d.embedding),
        }))
        .sort((a, b) => b.score - a.score);

      const topMatches = ranked.slice(0, 6);
      const bestScore = topMatches[0]?.score || 0;

      if (bestScore >= SIMILARITY_THRESHOLD) {
        const context = topMatches
          .map((r) => r.chunk)
          .join("\n\n")
          .slice(0, 6000);

        prompt = `
You are a course tutor.

Use ONLY the notes below to answer the question.
If the answer is not in the notes, say you could not find it.

NOTES:
${context}

QUESTION:
${question}
`;
      }
    }

    // fallback if no relevant notes found
    if (!prompt) {
      prompt = `
You are a knowledgeable teaching assistant.

Explain the answer clearly in simple terms.

QUESTION:
${question}
`;
    }

    // Ask Bedrock
    const answer = await askBedrock(prompt);

    // Save conversation
    const chat = await AICourseChat.findOneAndUpdate(
      { courseId, userId },
      {
        $push: {
          messages: [
            { role: "user", content: question },
            { role: "assistant", content: answer },
          ],
        },
      },
      { upsert: true, new: true },
    );

    return res.json({ messages: chat.messages });
  } catch (err) {
    console.error("AI ERROR:", err);

    return res.status(500).json({
      messages: [
        { role: "assistant", content: "AI is currently unavailable." },
      ],
    });
  }
};
