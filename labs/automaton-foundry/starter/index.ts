import { CopilotClient } from "@github/copilot-sdk";

const prompt = process.argv.slice(2).join(" ").trim();
if (!prompt) {
  throw new Error("Provide a prompt as a command-line argument.");
}

const client = new CopilotClient();

try {
  const session = await client.createSession({ model: "CHANGE_ME" });
  const response = await session.sendAndWait({ prompt });
  console.log(response?.data.content);
} finally {
  // Replace this comment with the client shutdown call.
}
