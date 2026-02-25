# ManyChat MCP Server

MCP (Model Context Protocol) server for ManyChat API integration. Enables Claude and other LLMs to manage ManyChat accounts, subscribers, tags, custom fields, flows, and messaging.

## Features

- **14 MCP tools** across 5 domains
- **Bearer authentication** with automatic rate limit retry (429 handling)
- **Type-safe** with Zod schema validation
- **Read-only and write operations** with proper annotations
- **Comprehensive error handling** with actionable messages

## Tools

### Page & Configuration (3 tools)
- `manychat_page_info` — Get account status, page name, connected channels
- `manychat_list_flows` — List all automation flows with IDs and names
- `manychat_list_growth_tools` — List comment triggers, ad tools, widgets

### Tags (4 tools)
- `manychat_list_tags` — List all tags
- `manychat_create_tag` — Create a new tag
- `manychat_tag_subscriber` — Add tag to subscriber by name
- `manychat_untag_subscriber` — Remove tag from subscriber by name

### Custom Fields (3 tools)
- `manychat_list_custom_fields` — List all custom fields
- `manychat_create_custom_field` — Create custom field (text, number, date, datetime, boolean)
- `manychat_set_field` — Set custom field value for subscriber by name

### Subscribers (3 tools)
- `manychat_get_subscriber` — Get full subscriber info by ID
- `manychat_find_subscriber` — Search subscribers by name
- `manychat_find_by_field` — Search subscribers by custom field value

### Sending (1 tool)
- `manychat_send_flow` — Trigger a flow for a subscriber

## Installation

```bash
npm install
npm run build
```

## Configuration

Add to your MCP client config (e.g., Claude Code `.mcp.json`):

```json
{
  "mcpServers": {
    "manychat": {
      "command": "node",
      "args": ["/path/to/manychat-mcp/dist/index.js"],
      "env": {
        "MANYCHAT_API_TOKEN": "your_manychat_api_token"
      }
    }
  }
}
```

### Getting Your ManyChat API Token

1. Log into ManyChat: https://manychat.com
2. Go to Settings → API
3. Generate a new API token
4. Copy the token (format: `PAGE_ID:TOKEN_STRING`)

**Permissions required:**
- Read access: Page info, flows, tags, custom fields, subscribers
- Write access: Create tags, create fields, tag subscribers, send flows

## Usage Examples

### Check Account Info
```
manychat_page_info()
```

### Create Tags for Segmentation
```
manychat_create_tag(name: "quiz_completed")
manychat_create_tag(name: "purchased")
```

### Create Custom Fields
```
manychat_create_custom_field(
  name: "wellnessGoal",
  type: "text",
  description: "Primary wellness goal from quiz"
)
```

### Find and Tag a Subscriber
```
# Find subscriber
manychat_find_subscriber(name: "John Doe")

# Add tag
manychat_tag_subscriber(
  subscriber_id: "1234567890",
  tag_name: "quiz_completed"
)
```

### Trigger a Flow
```
# First get flow ID
manychat_list_flows()

# Then trigger it
manychat_send_flow(
  subscriber_id: "1234567890",
  flow_ns: "content20250101000000_123456"
)
```

## API Rate Limits

ManyChat API allows **10 requests per second**. This server automatically:
- Retries on 429 (rate limit) errors
- Uses exponential backoff
- Maximum 3 retry attempts

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Build for production
npm run build

# Clean build artifacts
npm run clean
```

## Project Structure

```
manychat-mcp/
├── src/
│   ├── index.ts            # Server entry point
│   ├── client.ts           # ManyChat API client
│   └── tools/
│       ├── page.ts         # Page info, flows, growth tools
│       ├── tags.ts         # Tag management
│       ├── fields.ts       # Custom field management
│       ├── subscribers.ts  # Subscriber search
│       └── sending.ts      # Flow triggering
├── dist/                   # Compiled JavaScript
├── package.json
└── tsconfig.json
```

## Error Handling

The server provides clear, actionable error messages:

- **401 Unauthorized** → Check your API token
- **403 Forbidden** → Token lacks required scope
- **404 Not Found** → Resource doesn't exist
- **429 Rate Limit** → Auto-retries with backoff
- **400 Bad Request** → Invalid parameters (check Zod validation errors)

## Tech Stack

- **TypeScript** — Type-safe implementation
- **MCP SDK** — Official Model Context Protocol SDK
- **Zod** — Runtime schema validation
- **Native fetch** — HTTP client (Node 18+)

## Requirements

- Node.js 18+
- ManyChat PRO account (required for API access)
- Valid ManyChat API token

## Use Cases

- **Automation**: Bulk tag/field management via LLM
- **DM Ecosystems**: Build conversational flows with AI assistance
- **Analytics**: Query subscriber data and engagement
- **Customer Support**: Find and manage subscribers programmatically
- **Integration**: Connect ManyChat with other tools via Claude

## ManyChat API Documentation

For full API reference: https://manychat.com/api-docs

## License

MIT

## Contributing

Issues and pull requests welcome! This is a community-maintained MCP server.

## Acknowledgments

Built with the [Model Context Protocol](https://modelcontextprotocol.io) by Anthropic.

---

**Note:** This is an unofficial ManyChat integration. Not affiliated with or endorsed by ManyChat.
