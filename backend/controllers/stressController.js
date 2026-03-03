import dotenv from "dotenv";
dotenv.config();

import User from "../models/userModel.js";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    token: process.env.AWS_BEARER_TOKEN_BEDROCK
  }
});

export const analyzeStress = async (req, res) => {
  try {

    const userId = req.userId;

    const {
      sleepHours,
      exerciseDays,
      assignmentPressure,
      mood,
      breakHabit
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // last 7 days usage
    const last7 = user.dailyUsage.slice(-7);

    const totalMinutes = last7.reduce(
      (sum, d) => sum + d.minutesSpent,
      0
    );

    const studyHours = (totalMinutes / 60).toFixed(2);

    const prompt = `
You are a student mental wellness AI.

Analyze the student's stress level.

INPUT DATA

Study hours last week: ${studyHours}
Sleep hours per day: ${sleepHours}
Exercise days per week: ${exerciseDays}
Assignment pressure: ${assignmentPressure}
Mood: ${mood}
Break habit: ${breakHabit}

TASK

Return ONLY JSON.

DO NOT write code.
DO NOT explain anything.
DO NOT include markdown.
DO NOT include python.

Return exactly this format:

{
  "stressLevel": "Low | Moderate | High",
  "explanation": "short explanation",
  "suggestions": [
    "suggestion1",
    "suggestion2",
    "suggestion3",
    "suggestion4"
  ]
}
`;

    const body = JSON.stringify({
      prompt,
      max_gen_len: 500,
      temperature: 0.3
    });

    const command = new InvokeModelCommand({
      modelId: "meta.llama3-8b-instruct-v1:0",
      body,
      contentType: "application/json",
      accept: "application/json"
    });

    const response = await client.send(command);

    const decoded = new TextDecoder().decode(response.body);
    const responseBody = JSON.parse(decoded);

    let content =
      responseBody.generation ||
      responseBody.output_text ||
      "";

    // remove markdown blocks
    content = content.replace(/```[\s\S]*?```/g, "").trim();

    // Try to extract JSON using regex first
    let cleanJSON = null;

    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      cleanJSON = jsonMatch[0];
    } else {
      // fallback: try to find first { and last }
      const start = content.indexOf("{");
      const end = content.lastIndexOf("}");

      if (start !== -1 && end !== -1 && end > start) {
        cleanJSON = content.slice(start, end + 1);
      }
    }

    if (!cleanJSON) {
      console.error("MODEL OUTPUT WITHOUT JSON:", content);
      throw new Error("No JSON object found in model output");
    }

    const stressAnalysis = JSON.parse(cleanJSON);

    res.json({
      studyHoursLastWeek: studyHours,
      analysis: stressAnalysis
    });

  } catch (error) {
    console.error("Stress Analysis Error:", error);
    res.status(500).json({ message: "Stress analysis failed" });
  }
};