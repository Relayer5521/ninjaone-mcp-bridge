# NinjaOne MCP Bridge - Phase 1 Complete ✅

Production-ready MCP server for NinjaOne RMM integration with Claude Desktop. Features OAuth 2.0 authentication, comprehensive error handling, audit logging, and 18 powerful tools for MSP operations.

## 🚀 Phase 1 Features (COMPLETE)

### Core Tools (Original)
- `ninjaone_get_organizations` - List all organizations
- `ninjaone_get_organization` - Get specific organization details
- `ninjaone_get_devices` - List devices (with optional org filter)
- `ninjaone_get_device` - Get specific device details
- `ninjaone_get_alerts` - Get alerts with severity/status filtering
- `ninjaone_get_activities` - Activity logs with filtering
- `ninjaone_get_device_software` - Software inventory per device
- `ninjaone_get_os_patches` - OS patches for specific device
- `ninjaone_health_check` - API connectivity check

### Phase 1 Query Tools (NEW)
- `ninjaone_query_device_health` - Device health rollup across environment
- `ninjaone_query_os_patches` - OS patch status across all devices
- `ninjaone_query_antivirus_status` - AV status and threat detection
- `ninjaone_get_device_roles` - List all device role definitions
- `ninjaone_get_policies` - List all policies (patch, AV, backup)
- `ninjaone_get_groups` - Static and dynamic device groups
- `ninjaone_get_active_jobs` - Currently running/pending jobs
- `ninjaone_get_scheduled_tasks` - Scheduled automation tasks
- `ninjaone_get_custom_fields` - Custom field definitions

## 📋 Installation

### Prerequisites
- Node.js 18+
- NinjaOne API credentials
- Claude Desktop

### Setup
```bash
# Clone the repository
git clone https://github.com/Relayer5521/ninjaone-mcp-bridge.git
cd ninjaone-mcp-bridge

# Install dependencies
npm install

# Build the project
npm run build
```

### Claude Desktop Configuration

Add to `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ninjaone-bridge": {
      "command": "node",
      "args": [
        "C:\\path\\to\\ninjaone-mcp-bridge\\dist\\index.js"
      ],
      "env": {
        "NINJAONE_CLIENT_ID": "your-client-id",
        "NINJAONE_CLIENT_SECRET": "your-client-secret",
        "NINJAONE_REGION": "US",
        "NODE_ENV": "production",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

## 🔍 Usage Examples

### Device Health Monitoring
```
"Show me all devices with critical health issues"
"Check device health for organization 123"
"List offline devices"
```

### Patch Management
```
"Show critical patches pending across all servers"
"Which devices need Windows updates?"
"Get patch statistics for the environment"
```

### Security Monitoring
```
"Check antivirus status on all workstations"
"Show devices with active threats"
"Which devices have outdated AV definitions?"
```

### Configuration Management
```
"List all device roles and their policies"
"Show me enabled backup policies"
"What dynamic groups are configured?"
```

### Operations Monitoring
```
"Are there any jobs running right now?"
"What maintenance tasks are scheduled for tonight?"
"Show me all custom fields for devices"
```

## 🔐 Security Features

- **OAuth 2.0 Authentication** with automatic token refresh
- **Read-only operations** in Phase 1 (zero risk)
- **Comprehensive audit logging** for all API calls
- **Rate limiting** compliance (30 req/min)
- **Error handling** with detailed logging
- **Environment-based configuration** (no hardcoded secrets)

## 📊 Response Features

All tools provide:
- **Rich summaries** with counts and statistics
- **Grouped data** for better organization
- **Pagination support** with cursor-based navigation
- **Actionable insights** (critical devices, upcoming tasks, etc.)
- **Formatted JSON** responses for readability

## 🛠️ Development

### Project Structure
```
ninjaone-mcp-bridge/
├── src/
│   ├── api/
│   │   ├── client.ts     # NinjaOne API client
│   │   └── types.ts      # TypeScript interfaces
│   ├── mcp/
│   │   ├── server.ts     # MCP server implementation
│   │   └── tools.ts      # Tool definitions
│   ├── utils/
│   │   └── logger.ts     # Winston logging
│   ├── config.ts         # Configuration
│   └── index.ts          # Entry point
├── dist/                 # Compiled output
├── package.json
└── tsconfig.json
```

### Testing Tools
```bash
# Test Phase 1 tools
node test-phase1.js

# Check build
npm run build

# View logs
tail -f ninjaone-mcp.log
```

## 📈 Roadmap

### ✅ Phase 1 (COMPLETE)
- 9 read-only query tools
- Device health, patches, AV monitoring
- Configuration viewing
- Job and task monitoring

### 🔄 Phase 2 (Next)
- Enhanced device queries
- Advanced filtering with df syntax
- Activity logs with date filtering
- Backup status queries

### ⚠️ Phase 3 (Requires Approval Framework)
- Device actions (reboot, maintenance mode)
- Alert acknowledgment
- Approval pattern: "APPROVE: <device_id>"

### 🚀 Phase 4 (Advanced)
- Service control
- Script execution
- Ticket management
- Software deployment

### 🏢 Phase 5 (Enterprise)
- Organization management
- Policy deployment
- Webhook configuration
- Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Follow existing patterns
4. Add comprehensive error handling
5. Update documentation
6. Submit PR with detailed description

## 📝 License

MIT License - See LICENSE file

## 🙏 Acknowledgments

- Built for MSP operations
- Production-quality implementation
- Following MCP best practices
- Designed for expansion and maintenance

## 💬 Support

- Issues: [GitHub Issues](https://github.com/Relayer5521/ninjaone-mcp-bridge/issues)
- Documentation: [MCP Docs](https://modelcontextprotocol.io)
- NinjaOne API: [API Documentation](https://app.ninjarmm.com/apidocs/)

---

**Version**: 1.1.0  
**Phase**: 1 Complete  
**Tools**: 18  
**Status**: Production Ready 🚀
