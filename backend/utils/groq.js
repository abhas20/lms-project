import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: "eu-north-1",
});

export const askBedrock = async (prompt) => {
  console.log("hi am bedrock");

  const body = JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 500,
    temperature: 0.3,
    system: "You are a helpful course tutor.",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });

  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-haiku-20240307-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body
  });

  const response = await client.send(command);

  const responseBody = JSON.parse(
    new TextDecoder().decode(response.body)
  );

  return responseBody.content[0].text;
};