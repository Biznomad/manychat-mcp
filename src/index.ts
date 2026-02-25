import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ManyChatClient } from "./client.js";
import { registerPageTools } from "./tools/page.js";
import { registerTagTools } from "./tools/tags.js";
import { registerFieldTools } from "./tools/fields.js";
import { registerSubscriberTools } from "./tools/subscribers.js";
import { registerSendingTools } from "./tools/sending.js";

const token = process.env.MANYCHAT_API_TOKEN;

if (!token) {
  console.error("Missing required environment variable: MANYCHAT_API_TOKEN");
  process.exit(1);
}

const client = new ManyChatClient(token);

const server = new McpServer({
  name: "manychat-mcp",
  version: "1.0.0",
});

registerPageTools(server, client);
registerTagTools(server, client);
registerFieldTools(server, client);
registerSubscriberTools(server, client);
registerSendingTools(server, client);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ManyChat MCP server running");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
