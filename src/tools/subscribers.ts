import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ManyChatClient, handleApiError } from "../client.js";

const GetSubscriberSchema = z.object({
  subscriber_id: z.string().describe("ManyChat subscriber ID"),
});

const FindSubscriberSchema = z.object({
  name: z.string().min(1).describe("Subscriber name to search for"),
});

const FindByFieldSchema = z.object({
  field_name: z.string().describe("Custom field name to search by"),
  field_value: z.string().describe("Value to match"),
});

export function registerSubscriberTools(
  server: McpServer,
  client: ManyChatClient
) {
  server.registerTool(
    "manychat_get_subscriber",
    {
      title: "Get Subscriber",
      description:
        "Get full subscriber info by ID, including tags, custom fields, and channel data",
      inputSchema: GetSubscriberSchema,
      annotations: { readOnlyHint: true },
    },
    async (params) => {
      try {
        const data = await client.get("/fb/subscriber/getInfo", {
          subscriber_id: params.subscriber_id,
        });
        return {
          content: [
            { type: "text" as const, text: JSON.stringify(data, null, 2) },
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

  server.registerTool(
    "manychat_find_subscriber",
    {
      title: "Find Subscriber by Name",
      description:
        "Search for subscribers by name. Returns matching subscribers with their IDs.",
      inputSchema: FindSubscriberSchema,
      annotations: { readOnlyHint: true },
    },
    async (params) => {
      try {
        const data = await client.get("/fb/subscriber/findByName", {
          name: params.name,
        });
        return {
          content: [
            { type: "text" as const, text: JSON.stringify(data, null, 2) },
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

  server.registerTool(
    "manychat_find_by_field",
    {
      title: "Find Subscriber by Custom Field",
      description:
        "Search for subscribers by a custom field value. Returns matching subscribers.",
      inputSchema: FindByFieldSchema,
      annotations: { readOnlyHint: true },
    },
    async (params) => {
      try {
        const data = await client.get(
          "/fb/subscriber/findByCustomField",
          {
            field_name: params.field_name,
            field_value: params.field_value,
          }
        );
        return {
          content: [
            { type: "text" as const, text: JSON.stringify(data, null, 2) },
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
