# NinjaOne MCP Bridge

A Model Context Protocol (MCP) bridge that enables Claude to interact with NinjaOne RMM platform for MSP operations.

## Features

- 🔒 Secure OAuth 2.0 authentication
- 📊 Read-only access to NinjaOne data
- 🚀 Full TypeScript implementation
- 📝 Comprehensive audit logging
- ⚡ Rate limiting protection
- 🐳 Docker support

## Available Tools

### Basic Tools (Original)
- `ninjaone_get_organizations` - List all organizations
- `ninjaone_get_organization` - Get specific organization details
- `ninjaone_get_devices` - List devices (all or by organization)
- `ninjaone_get_device` - Get specific device details
- `ninjaone_get_alerts` - Get alerts with filtering
- `ninjaone_get_activities` - Get activity logs
- `ninjaone_get_device_software` - Get software inventory for a device
- `ninjaone_get_os_patches` - Get OS patches for a single device
- `ninjaone_health_check` - Check API connectivity

### Phase 1 Query Tools (NEW)
- `ninjaone_query_device_health` - Query device health status across environment with filtering
- `ninjaone_query_os_patches` - Query OS patch status across all devices with compliance reporting
- `ninjaone_query_antivirus_status` - Query antivirus status and threat detection across devices
- `ninjaone_get_device_roles` - List all device role definitions and associated custom fields
- `ninjaone_get_policies` - List all policies (patch, AV, backup) configured in NinjaOne
- `ninjaone_get_groups` - List saved search groups (static and dynamic)
- `ninjaone_get_active_jobs` - Get currently running or pending jobs across all devices
- `ninjaone_get_scheduled_tasks` - List all scheduled automation tasks with cron schedules
- `ninjaone_get_custom_fields` - Get custom field definitions for devices, orgs, locations, or users

## Prerequisites

- Node.js 18+ or Docker
- NinjaOne API credentials
- Claude Desktop (for MCP integration)

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ninjaone-mcp-bridge.git
cd ninjaone-mcp-bridge
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
    "ninjaone-bridge": {
      "command": "node",
      "args": ["C:/MSP-Lab/ninjaone-mcp-bridge/dist/index.js"],
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
docker build -f docker/Dockerfile -t ninjaone-mcp-bridge:latest .

# Run container
docker run -d \
  --name ninjaone-mcp-bridge \
  --env-file .env \
  -v $(pwd)/logs:/app/logs \
  ninjaone-mcp-bridge:latest
```

## Security

- API credentials are never exposed to Claude
- All operations are read-only
- Comprehensive audit logging
- Rate limiting prevents API abuse
- Runs as non-root user in Docker

## Project Structure

```
ninjaone-mcp-bridge/
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


## Phase 1 Usage Examples

### Device Health Monitoring
```
"Check the health status of all devices"
"Show me critical health issues across the organization"
"Which devices are offline?"
```

### Patch Management
```
"Show me all critical patches pending"
"Which servers need patches?"
"Get patch statistics for Windows devices"
```

### Security Status
```
"Check antivirus status on all workstations"
"Show devices with active threats"
"Which devices have outdated AV definitions?"
```

### Configuration & Automation
```
"List all device roles and their custom fields"
"Show me enabled policies"
"What dynamic groups exist?"
"Are there any jobs running right now?"
"What tasks are scheduled for tonight?"
```

### Filter Examples (df parameter)
- `status = 'APPROVED'` - Approved devices only
- `os = 'WINDOWS' OR os = 'MAC'` - Windows or Mac devices  
- `nodeClass = 'WINDOWS_SERVER'` - Windows servers only
- `organization = 123 AND offline = true` - Offline devices in specific org
- `lastContact < '2024-10-01'` - Devices not seen since October

### Pagination
All Phase 1 tools support pagination:
- `pageSize` - Number of results per page (default: 100, max: 1000)
- `after` - Cursor from previous response to get next page

## Version History

- **v1.0.0** - Initial release with basic read-only tools
- **v1.1.0** - Phase 1 expansion with 9 new query tools (device health, patches, AV, policies, groups, jobs, tasks, custom fields)
