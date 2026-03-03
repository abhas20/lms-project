import dotenv from "dotenv";
dotenv.config();

import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    token: process.env.AWS_BEARER_TOKEN_BEDROCK
  }
});

export const generateSchedule = async (structuredData) => {
  console.log("hit");

  const { subjects = [], weakSubjects = [], freeTimeSlots = [], offDays = [] } = structuredData;

  const prompt = `
You are an Advanced Study Architect.

Generate a weekly study schedule STRICTLY using the available free time slots.

INPUT DATA:

Subjects: ${subjects.join(", ")}
Weak Subjects: ${weakSubjects.join(", ")}

Free Time Slots (YOU MUST USE ONLY THESE SLOTS):
${JSON.stringify(freeTimeSlots, null, 2)}

Off Days (NO study allowed):
${offDays.join(", ")}

RULES:

1. NEVER create a session outside the provided free time slots.
2. Every study block must fit completely inside a free time slot.
3. Weak subjects → 45-60 min blocks + 15 min break.
4. Strong subjects → 90 min blocks + 10 min break.
5. If a slot is longer than 2 hours → split into multiple sessions.
6. Do NOT schedule anything on off days.

IMPORTANT:

Return ONLY valid JSON.
No explanation.
No markdown.

FORMAT:

{
 "Monday":[
  {"start":"HH:MM","end":"HH:MM","subject":"Name","activity":"Task","type":"study"}
 ],
 "Tuesday":[]
}
`;

  try {

    const body = JSON.stringify({
      prompt,
      max_gen_len: 800,
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

console.log("RAW MODEL OUTPUT:", content);

// remove markdown blocks
content = content.replace(/```[\s\S]*?```/g, "").trim();

// find first JSON object
const start = content.indexOf("{");
if (start === -1) {
  throw new Error("No JSON object found in model output");
}

let braceCount = 0;
let end = -1;

for (let i = start; i < content.length; i++) {
  if (content[i] === "{") braceCount++;
  if (content[i] === "}") braceCount--;

  if (braceCount === 0) {
    end = i;
    break;
  }
}

if (end === -1) {
  throw new Error("JSON block not properly closed");
}

const cleanJSON = content.slice(start, end + 1);

return JSON.parse(cleanJSON);
  } catch (error) {
    console.error("Bedrock AI Error:", error);
    throw new Error("Bedrock failed to architect the schedule.");
  }
};