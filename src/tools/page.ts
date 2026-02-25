import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ManyChatClient, handleApiError } from "../client.js";

export function registerPageTools(server: McpServer, client: ManyChatClient) {
  server.registerTool(
    "manychat_page_info",
    {
      title: "Page Info",
      description: "Get ManyChat account/page info including name, status, and connected channels",
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () => {
      try {
        const data = await client.get("/fb/page/getInfo");
        return {
          content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text" as const, text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "manychat_list_flows",
    {
      title: "List Flows",
      description: "List all automation flows in the ManyChat account with their IDs, names, and statuses",
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () => {
      try {
        const data = await client.get("/fb/page/getFlows");
        return {
          content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text" as const, text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "manychat_list_growth_tools",
    {
      title: "List Growth Tools",
      description: "List all growth tools (widgets, comment triggers, ads JSON) in the ManyChat account",
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () => {
      try {
        const data = await client.get("/fb/page/getGrowthTools");
        return {
          content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text" as const, text: handleApiError(error) }] };
      }
    }
  );
}
