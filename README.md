# NinjaOne MCP Server

A Model Context Protocol (MCP) server that enables Claude to interact with NinjaOne RMM platform for MSP operations.

## Features

- 🔒 Secure OAuth 2.0 authentication
- 📊 Read-only access to NinjaOne data
- 🚀 Full TypeScript implementation
- 📝 Comprehensive audit logging
- ⚡ Rate limiting protection
- 🐳 Docker support

## Available Tools

- `ninjaone_get_organizations` - List all organizations
- `ninjaone_get_organization` - Get specific organization details
- `ninjaone_get_devices` - List devices (all or by organization)
- `ninjaone_get_device` - Get specific device details
- `ninjaone_get_alerts` - Get alerts with filtering
- `ninjaone_get_activities` - Get activity logs
- `ninjaone_get_device_software` - Get software inventory for a device
- `ninjaone_get_os_patches` - Get OS patches for a device
- `ninjaone_health_check` - Check API connectivity

## Prerequisites

- Node.js 18+ or Docker
- NinjaOne API credentials
- Claude Desktop (for MCP integration)

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ninjaone-mcp.git
cd ninjaone-mcp
```

### 2. Configure Environment

Create a `.env` file with your NinjaOne credentials:

```env
NINJAONE_CLIENT_ID=your_client_id_here
NINJAONE_CLIENT_SECRET=your_client_secret_here
NINJAONE_REGION=US
LOG_LEVEL=info
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Build the Project

```bash
npm run build
```

### 5. Configure Claude Desktop

Add to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "ninjaone": {
      "command": "node",
      "args": ["C:/MSP-Lab/ninjaone-mcp/dist/index.js"],
      "env": {
        "NINJAONE_CLIENT_ID": "your_client_id",
        "NINJAONE_CLIENT_SECRET": "your_client_secret",
        "NINJAONE_REGION": "US"
      }
    }
  }
}
```

## Development

```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## Docker Deployment

```bash
# Build Docker image
docker build -f docker/Dockerfile -t ninjaone-mcp:latest .

# Run container
docker run -d \
  --name ninjaone-mcp \
  --env-file .env \
  -v $(pwd)/logs:/app/logs \
  ninjaone-mcp:latest
```

## Security

- API credentials are never exposed to Claude
- All operations are read-only
- Comprehensive audit logging
- Rate limiting prevents API abuse
- Runs as non-root user in Docker

## Project Structure

```
ninjaone-mcp/
├── src/
│   ├── api/
│   │   ├── client.ts      # NinjaOne API client
│   │   └── types.ts       # TypeScript interfaces
│   ├── mcp/
│   │   ├── server.ts      # MCP server implementation
│   │   └── tools.ts       # Tool definitions
│   ├── utils/
│   │   └── logger.ts      # Winston logger
│   ├── config.ts          # Configuration management
│   └── index.ts           # Entry point
├── docker/
│   └── Dockerfile         # Docker configuration
├── logs/                  # Application logs
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
└── .env                   # Environment variables
```

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
