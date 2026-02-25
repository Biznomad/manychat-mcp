import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ManyChatClient, handleApiError } from "../client.js";

const SendFlowSchema = z.object({
  subscriber_id: z.string().describe("ManyChat subscriber ID"),
  flow_ns: z.string().describe("Flow namespace/ID to trigger (from manychat_list_flows)"),
});

export function registerSendingTools(
  server: McpServer,
  client: ManyChatClient
) {
  server.registerTool(
    "manychat_send_flow",
    {
      title: "Send Flow",
      description:
        "Trigger a specific flow for a subscriber. Use manychat_list_flows to get flow IDs first.",
      inputSchema: SendFlowSchema,
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async (params) => {
      try {
        const data = await client.post("/fb/sending/sendFlow", {
          subscriber_id: params.subscriber_id,
          flow_ns: params.flow_ns,
        });
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(data ?? { success: true }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            { type: "text" as const, text: handleApiError(error) },
          ],
        };
      }
    }
  );
}
