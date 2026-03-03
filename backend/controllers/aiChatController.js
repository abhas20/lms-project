import AIEmbedding from "../models/AIEmbedding.js";
import AICourseChat from "../models/AICourseChat.js";
import { embedText } from "../utils/embeddings.js";
import { cosineSimilarity } from "../utils/similarity.js";
import { askBedrock } from "../utils/groq.js";

const SIMILARITY_THRESHOLD = 0.78;

export const askCourseAI = async (req, res) => {
  console.log("hi am bedrock");
  try {
    const { question, courseId } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        messages: [{ role: "assistant", content: "Please login to use AI tutor." }],
      });
    }

    if (!question?.trim() || !courseId) {
      return res.status(400).json({
        messages: [{ role: "assistant", content: "Invalid question or course." }],
      });
    }

    const qEmbedding = await embedText(question);

    const docs = await AIEmbedding.find({ courseId });

    let prompt = "";

    if (docs.length) {
      const ranked = docs
        .map(d => ({
          chunk: d.chunk,
          score: cosineSimilarity(qEmbedding, d.embedding),
        }))
        .sort((a, b) => b.score - a.score);

      const topMatches = ranked.slice(0, 6);
      const bestScore = topMatches[0]?.score || 0;

      if (bestScore >= SIMILARITY_THRESHOLD) {
        const context = topMatches
          .map(r => r.chunk)
          .join("\n\n")
          .slice(0, 6000);

        prompt = `
You are a course tutor.
Answer ONLY using the notes below.

NOTES:
${context}

QUESTION:
${question}
`;
      }
    }

  
    if (!prompt) {
      prompt = `
You are a knowledgeable teaching assistant.
Answer the question clearly using general knowledge.
Explain simply.

QUESTION:
${question}
`;
    }

    
    const answer = await askBedrock(prompt);

    
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
      { upsert: true, new: true }
    );

    return res.json({ messages: chat.messages });

  } catch (err) {
    console.error("AI ERROR:", err);
    return res.status(500).json({
      messages: [{ role: "assistant", content: "AI is currently unavailable." }],
    });
  }
};