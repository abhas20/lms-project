import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  ConverseCommand
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export const askBedrock = async (prompt) => {
  try {
    const command = new ConverseCommand({
      modelId: "meta.llama3-8b-instruct-v1:0",

      system: [
        {
          text: "You are a helpful course tutor.",
        },
      ],

      messages: [
        {
          role: "user",
          content: [{ text: prompt }],
        },
      ],

      inferenceConfig: {
        maxTokens: 700,
        temperature: 0.3,
        topP: 0.9,
      },
    });

    const response = await client.send(command);

    return response.output.message.content[0].text || "";
  } catch (error) {
    console.error("Bedrock API Error:", error);
    throw new Error("Failed to generate AI response");
  }
};