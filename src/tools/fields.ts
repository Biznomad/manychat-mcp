import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ManyChatClient, handleApiError } from "../client.js";

const CreateFieldSchema = z.object({
  name: z.string().min(1).describe("Custom field name"),
  type: z
    .enum(["text", "number", "date", "datetime", "boolean"])
    .describe("Field data type"),
  description: z.string().optional().describe("Optional field description"),
});

const SetFieldSchema = z.object({
  subscriber_id: z.string().describe("ManyChat subscriber ID"),
  field_name: z.string().describe("Custom field name"),
  field_value: z
    .union([z.string(), z.number(), z.boolean()])
    .describe("Value to set for the field"),
});

export function registerFieldTools(server: McpServer, client: ManyChatClient) {
  server.registerTool(
    "manychat_list_custom_fields",
    {
      title: "List Custom Fields",
      description:
        "List all custom fields in the ManyChat account with their IDs, names, and types",
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () => {
      try {
        const data = await client.get("/fb/page/getCustomFields");
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
    "manychat_create_custom_field",
    {
      title: "Create Custom Field",
      description:
        "Create a new custom field in the ManyChat account. Types: text, number, date, datetime, boolean.",
      inputSchema: CreateFieldSchema,
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async (params) => {
      try {
        const body: Record<string, unknown> = {
          caption: params.name,
          type: params.type,
        };
        if (params.description) {
          body.description = params.description;
        }
        const data = await client.post("/fb/page/createCustomField", body);
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
    "manychat_set_field",
    {
      title: "Set Custom Field",
      description:
        "Set a custom field value for a subscriber by field name. The field must already exist.",
      inputSchema: SetFieldSchema,
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async (params) => {
      try {
        const data = await client.post(
          "/fb/subscriber/setCustomFieldByName",
          {
            subscriber_id: params.subscriber_id,
            field_name: params.field_name,
            field_value: params.field_value,
          }
        );
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
