import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ManyChatClient, handleApiError } from "../client.js";

const CreateTagSchema = z.object({
  name: z.string().min(1).describe("Tag name to create"),
});

const TagSubscriberSchema = z.object({
  subscriber_id: z.string().describe("ManyChat subscriber ID"),
  tag_name: z.string().describe("Tag name to add"),
});

const UntagSubscriberSchema = z.object({
  subscriber_id: z.string().describe("ManyChat subscriber ID"),
  tag_name: z.string().describe("Tag name to remove"),
});

export function registerTagTools(server: McpServer, client: ManyChatClient) {
  server.registerTool(
    "manychat_list_tags",
    {
      title: "List Tags",
      description: "List all tags in the ManyChat account with their IDs and names",
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () => {
      try {
        const data = await client.get("/fb/page/getTags");
        return {
          content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text" as const, text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "manychat_create_tag",
    {
      title: "Create Tag",
      description: "Create a new tag in the ManyChat account. Returns the created tag with its ID.",
      inputSchema: CreateTagSchema,
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async (params) => {
      try {
        const data = await client.post("/fb/page/createTag", { name: params.name });
        return {
          content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text" as const, text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "manychat_tag_subscriber",
    {
      title: "Tag Subscriber",
      description: "Add a tag to a subscriber by tag name. The tag must already exist.",
      inputSchema: TagSubscriberSchema,
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async (params) => {
      try {
        const data = await client.post("/fb/subscriber/addTagByName", {
          subscriber_id: params.subscriber_id,
          tag_name: params.tag_name,
        });
        return {
          content: [{ type: "text" as const, text: JSON.stringify(data ?? { success: true }, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text" as const, text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "manychat_untag_subscriber",
    {
      title: "Untag Subscriber",
      description: "Remove a tag from a subscriber by tag name",
      inputSchema: UntagSubscriberSchema,
      annotations: { readOnlyHint: false, destructiveHint: false },
    },
    async (params) => {
      try {
        const data = await client.post("/fb/subscriber/removeTagByName", {
          subscriber_id: params.subscriber_id,
          tag_name: params.tag_name,
        });
        return {
          content: [{ type: "text" as const, text: JSON.stringify(data ?? { success: true }, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text" as const, text: handleApiError(error) }] };
      }
    }
  );
}
