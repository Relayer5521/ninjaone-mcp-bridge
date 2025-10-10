# NinjaOne MCP Bridge - Phase 2 In Progress 🚧

Production-ready MCP server for NinjaOne RMM integration with Claude Desktop. Features OAuth 2.0 authentication, comprehensive error handling, audit logging, and 20 powerful tools for MSP operations (Phase 1 complete + 3 Phase 2 tools implemented).

## ✅ Testing Status

**Last Tested**: October 10, 2025  
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

### Phase 2 Tools (IN PROGRESS - 3/5 Complete)
- ✅ `ninjaone_query_devices_advanced` - **COMPLETE!** Advanced device filtering with full df syntax support
  - Supports complex boolean logic (AND operators)
  - Filter by organization, location, role, class, status, online/offline, creation date, group
  - Rich summary statistics (online/offline counts, breakdown by class, organization, etc.)
  - Pagination support with cursor-based navigation
  - **df Syntax Examples:**
    - `"class=WINDOWS_SERVER AND offline"` - Offline Windows servers
    - `"org=123 AND status=APPROVED"` - Approved devices in org 123
    - `"created after 2024-01-01"` - Devices created in 2024
    - `"class in (WINDOWS_WORKSTATION,MAC) AND online"` - Online workstations
- ✅ `ninjaone_query_software_inventory` - **COMPLETE!** Software search across entire environment
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
- ✅ `ninjaone_query_activities_advanced` - **COMPLETE!** Enhanced activity logs with date ranges and advanced filtering
  - Date range filtering (startDate, endDate) for historical queries
  - Organization-wide activity monitoring
  - Device-specific or organization-wide queries
  - Rich summary statistics with type and status breakdowns
  - Activity timeline with earliest/latest timestamps
  - Pagination support for large result sets
  - **Usage Examples:**
    - `"Show me all activities from last week"`
    - `"What happened on device X between January 1 and January 31?"`
    - `"List all patch activities from the past 24 hours"`
    - `"Show organization-wide activities for the last month"`
    - `"Find all failed activities in the last 7 days"`
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