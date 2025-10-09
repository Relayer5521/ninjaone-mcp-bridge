# NinjaOne MCP Bridge - Phase 2 In Progress 🚧

Production-ready MCP server for NinjaOne RMM integration with Claude Desktop. Features OAuth 2.0 authentication, comprehensive error handling, audit logging, and 20 powerful tools for MSP operations (Phase 1 complete + 2 Phase 2 tools implemented).

## ✅ Testing Status

**Last Tested**: October 9, 2025  
**Test Environment**: Canopy Technology Group (Org ID: 3)  
**Connection Status**: ✅ Operational  

| Test | Status | Results |
|------|--------|---------|
| **API Health Check** | ✅ PASS | Connection verified |
| **Organizations Query** | ✅ PASS | 13 organizations retrieved |
| **Device Retrieval** | ✅ PASS | 21 devices (10 online, 11 offline) |
| **Alert Monitoring** | ✅ PASS | 22 active alerts retrieved |

**Active Findings**:
- 13 low disk space alerts (≤15% free)
- 6 high memory utilization alerts (≥90%)
- 3 disk I/O performance alerts (>90% active time)
- 1 extended uptime alert (30+ days without reboot)

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

### Phase 1 Query Tools (COMPLETE)
- `ninjaone_query_device_health` - Device health rollup across environment
- `ninjaone_query_os_patches` - OS patch status across all devices
- `ninjaone_query_antivirus_status` - AV status and threat detection
- `ninjaone_get_device_roles` - List all device role definitions
- `ninjaone_get_policies` - List all policies (patch, AV, backup)
- `ninjaone_get_groups` - Static and dynamic device groups
- `ninjaone_get_active_jobs` - Currently running/pending jobs
- `ninjaone_get_scheduled_tasks` - Scheduled automation tasks
- `ninjaone_get_custom_fields` - Custom field definitions

### Phase 2 Tools (IN PROGRESS - 2/5 Complete)
- ✅ `ninjaone_query_devices_advanced` - **NEW!** Advanced device filtering with full df syntax support
  - Supports complex boolean logic (AND operators)
  - Filter by organization, location, role, class, status, online/offline, creation date, group
  - Rich summary statistics (online/offline counts, breakdown by class, organization, etc.)
  - Pagination support with cursor-based navigation
  - **df Syntax Examples:**
    - `"class=WINDOWS_SERVER AND offline"` - Offline Windows servers
    - `"org=123 AND status=APPROVED"` - Approved devices in org 123
    - `"created after 2024-01-01"` - Devices created in 2024
    - `"class in (WINDOWS_WORKSTATION,MAC) AND online"` - Online workstations
- ✅ `ninjaone_query_software_inventory` - **NEW!** Software search across entire environment
  - Search by software name with partial matching
  - Filter by device class (WINDOWS_SERVER, WINDOWS_WORKSTATION, MAC, etc.)
  - Filter by organization ID
  - Filter by installation status (INSTALLED/UNINSTALLED)
  - Rich summary statistics (unique devices, software counts, version distribution)
  - **Usage Examples:**
    - `"Find all devices with Chrome installed"`
    - `"Which machines have Adobe Reader?"`
    - `"Show me all servers with SQL Server installed"`
    - `"List all software on Windows workstations"`
- ⏳ `ninjaone_query_activities_advanced` - Coming soon
- ⏳ `ninjaone_query_backup_status` - Coming soon
- ⏳ `ninjaone_query_system_metrics` - Coming soon

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

## 📍 Project Checkpoint System

This project uses a checkpoint system to seamlessly resume work across chat sessions.

**Quick Resume:**
```
Read the following files and continue development:
1. C:\MSP-Lab\ninjaone-mcp-bridge\CHECKPOINT.md
2. C:\MSP-Lab\ninjaone-mcp-bridge\README.md
```

**Files:**
- `CHECKPOINT.md` - Current project status, next priorities, blockers
- `CHECKPOINT_GUIDE.md` - How to use and update the checkpoint system

**When to Update:**
- After completing each tool
- When discovering blockers
- Before ending work session
- When switching major tasks

See `CHECKPOINT_GUIDE.md` for complete instructions.

---

## 🔍 Usage Examples

### Advanced Device Queries (Phase 2 - NEW!)
```
"Find all offline Windows servers"
"Show me devices in organization 5 that are approved and online"
"List all Mac devices"
"Get devices created in the last 30 days"
"Show me all workstations that are offline"
"Find devices in role 3"
```

### Software Inventory (Phase 2 - NEW!)
```
"Find all devices with Chrome installed"
"Which machines have Adobe Reader?"
"Show me all servers with SQL Server installed"
"Find devices with Java installed in organization 5"
"List all Microsoft Office installations"
```

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

### ✅ Phase 1 (COMPLETE - 18 Tools)
- 9 core read-only query tools
- 9 advanced query tools
- Device health, patches, AV monitoring
- Configuration viewing
- Job and task monitoring

### 🚧 Phase 2 (IN PROGRESS - 1/5 Complete)
- ✅ Advanced device filtering with df syntax (`ninjaone_query_devices_advanced`)
- ⏳ Software inventory search across environment
- ⏳ Enhanced activity logs with date filtering
- ⏳ Backup status queries
- ⏳ System performance metrics

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

**Version**: 1.2.0  
**Phase**: 2 In Progress (Tool 1/5 Complete)  
**Tools**: 19 (18 from Phase 1 + 1 from Phase 2)  
**Status**: Production Ready 🚀
