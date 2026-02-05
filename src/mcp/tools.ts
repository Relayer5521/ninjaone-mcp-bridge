import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const tools: Tool[] = [
  // ============ PHASE 1 CORE TOOLS ============
  {
    name: 'ninjaone_get_organizations',
    description: 'Get all organizations from NinjaOne RMM',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'ninjaone_get_organization',
    description: 'Get details for a specific organization',
    inputSchema: {
      type: 'object',
      properties: {
        orgId: {
          type: 'number',
          description: 'Organization ID'
        }
      },
      required: ['orgId']
    }
  },
  {
    name: 'ninjaone_get_devices',
    description: 'Get all devices, optionally filtered by organization',
    inputSchema: {
      type: 'object',
      properties: {
        orgId: {
          type: 'number',
          description: 'Optional organization ID to filter devices'
        }
      },
      required: []
    }
  },
  {
    name: 'ninjaone_get_device',
    description: 'Get details for a specific device',
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: {
          type: 'number',
          description: 'Device ID'
        }
      },
      required: ['deviceId']
    }
  },
  {
    name: 'ninjaone_get_alerts',
    description: 'Get alerts with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        severity: {
          type: 'string',
          enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW', 'INFO'],
          description: 'Filter by severity: CRITICAL, HIGH, MODERATE, LOW, INFO'
        },
        status: {
          type: 'string',
          description: 'Filter by status'
        }
      },
      required: []
    }
  },
  {
    name: 'ninjaone_get_activities',
    description: 'Get activity logs with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: {
          type: 'number',
          description: 'Filter by device ID'
        },
        type: {
          type: 'string',
          description: 'Filter by activity type'
        }
      },
      required: []
    }
  },
  {
    name: 'ninjaone_get_device_software',
    description: 'Get software inventory for a device',
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: {
          type: 'number',
          description: 'Device ID'
        }
      },
      required: ['deviceId']
    }
  },
  {
    name: 'ninjaone_get_os_patches',
    description: 'Get OS patches for a specific device',
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: {
          type: 'number',
          description: 'Device ID'
        }
      },
      required: ['deviceId']
    }
  },
  {
    name: 'ninjaone_health_check',
    description: 'Check NinjaOne API connectivity',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },

  // ============ PHASE 1 QUERY TOOLS ============
  {
    name: 'ninjaone_query_device_health',
    description: 'Query device health status across your environment. Returns device health rollup with issues categorized by severity. Supports filtering by organization, OS type, online/offline status, and more using NinjaOne\'s device filter syntax.',
    inputSchema: {
      type: 'object',
      properties: {
        filter: {
          type: 'string',
          description: 'Device filter using NinjaOne df syntax. Examples: \'status = APPROVED\', \'os = WINDOWS\', \'organization = 123 AND offline = true\', \'nodeClass = WINDOWS_SERVER AND lastContact < 2024-10-01\''
        },
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 100, max: 1000)',
          default: 100,
          minimum: 1,
          maximum: 1000
        },
        after: {
          type: 'string',
          description: 'Pagination cursor from previous response to fetch next page'
        }
      },
      required: []
    }
  },
  {
    name: 'ninjaone_query_os_patches',
    description: 'Query OS patch status across all devices. Returns pending patches categorized by severity (critical, important, moderate, low). Essential for compliance reporting and security posture assessment.',
    inputSchema: {
      type: 'object',
      properties: {
        filter: {
          type: 'string',
          description: 'Device filter using NinjaOne df syntax. Examples: \'os = WINDOWS_SERVER\', \'organization = 123\', \'nodeClass = LAPTOP AND os = MAC\''
        },
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 100, max: 1000)',
          default: 100,
          minimum: 1,
          maximum: 1000
        },
        after: {
          type: 'string',
          description: 'Pagination cursor from previous response to fetch next page'
        }
      },
      required: []
    }
  },
  {
    name: 'ninjaone_query_antivirus_status',
    description: 'Query antivirus status and threat detection across devices. Returns AV product status, definition updates, real-time protection state, and any detected threats with their quarantine status.',
    inputSchema: {
      type: 'object',
      properties: {
        filter: {
          type: 'string',
          description: 'Device filter using NinjaOne df syntax. Examples: \'os = WINDOWS\', \'organization = 123 AND nodeClass = WORKSTATION\''
        },
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 100, max: 1000)',
          default: 100,
          minimum: 1,
          maximum: 1000
        },
        after: {
          type: 'string',
          description: 'Pagination cursor from previous response to fetch next page'
        }
      },
      required: []
    }
  },
  {
    name: 'ninjaone_get_device_roles',
    description: 'List all device role definitions in NinjaOne. Device roles define the type of device (workstation, server, etc.) and associated custom fields, policies, and automation rules.',
    inputSchema: {
      type: 'object',
      properties: {
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 100, max: 1000)',
          default: 100,
          minimum: 1,
          maximum: 1000
        },
        after: {
          type: 'string',
          description: 'Pagination cursor from previous response to fetch next page'
        }
      },
      required: []
    }
  },
  {
    name: 'ninjaone_get_policies',
    description: 'List all policies configured in NinjaOne. Policies define patch management, antivirus, backup, and other automated management rules applied to device roles.',
    inputSchema: {
      type: 'object',
      properties: {
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 100, max: 1000)',
          default: 100,
          minimum: 1,
          maximum: 1000
        },
        after: {
          type: 'string',
          description: 'Pagination cursor from previous response to fetch next page'
        }
      },
      required: []
    }
  },
  {
    name: 'ninjaone_get_groups',
    description: 'List saved search groups (static and dynamic device groups). Groups are used for targeting policies, scripts, and mass actions. Dynamic groups auto-update based on filter criteria.',
    inputSchema: {
      type: 'object',
      properties: {
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 100, max: 1000)',
          default: 100,
          minimum: 1,
          maximum: 1000
        },
        after: {
          type: 'string',
          description: 'Pagination cursor from previous response to fetch next page'
        }
      },
      required: []
    }
  },
  {
    name: 'ninjaone_get_active_jobs',
    description: 'Get currently running or pending jobs across all devices. Includes scripts, patches, software deployments, and reboots with progress tracking.',
    inputSchema: {
      type: 'object',
      properties: {
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 100, max: 1000)',
          default: 100,
          minimum: 1,
          maximum: 1000
        },
        after: {
          type: 'string',
          description: 'Pagination cursor from previous response to fetch next page'
        }
      },
      required: []
    }
  },
  {
    name: 'ninjaone_get_scheduled_tasks',
    description: 'List all scheduled automation tasks. Includes recurring scripts, patch schedules, backup jobs, and maintenance windows with their cron schedules and target groups.',
    inputSchema: {
      type: 'object',
      properties: {
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 100, max: 1000)',
          default: 100,
          minimum: 1,
          maximum: 1000
        },
        after: {
          type: 'string',
          description: 'Pagination cursor from previous response to fetch next page'
        }
      },
      required: []
    }
  },
  {
    name: 'ninjaone_get_custom_fields',
    description: 'Get custom field definitions for devices, organizations, locations, or users. Shows field types, validation rules, and default values configured in your NinjaOne instance.',
    inputSchema: {
      type: 'object',
      properties: {
        scope: {
          type: 'string',
          enum: ['DEVICE', 'ORGANIZATION', 'LOCATION', 'USER'],
          description: 'Filter by field scope (optional). If not specified, returns all custom fields.'
        },
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 100, max: 1000)',
          default: 100,
          minimum: 1,
          maximum: 1000
        },
        after: {
          type: 'string',
          description: 'Pagination cursor from previous response to fetch next page'
        }
      },
      required: []
    }
  },

  // ============ PHASE 2 TOOLS ============
  {
    name: 'ninjaone_query_devices_advanced',
    description: `Query devices with advanced filtering using NinjaOne's df (device filter) syntax. Supports complex boolean logic, field-specific queries, and comprehensive device filtering across your entire environment.

df Syntax Examples:
- Organization: "org=123", "org in (1,2,3)", "org!=5"
- Location: "loc=456", "loc in (10,20)"
- Device Role: "role=789", "role in (5,6,7)"
- Device Class: "class=WINDOWS_SERVER", "class in (WINDOWS_WORKSTATION,MAC)"
- Status: "status=APPROVED", "status=PENDING"
- Online/Offline: "online", "offline"
- Creation Date: "created after 2024-01-01", "created before 2024-12-31"
- Group: "group 123"
- Combined: "class=WINDOWS_SERVER AND offline", "org=5 AND status=APPROVED AND online"

Available Device Classes:
- WINDOWS_SERVER, WINDOWS_WORKSTATION
- LINUX_SERVER, LINUX_WORKSTATION
- MAC, MAC_SERVER
- VMWARE_VM_HOST, VMWARE_VM_GUEST
- NMS_* (network devices: SWITCH, ROUTER, FIREWALL, WAP, etc.)

Use Cases:
- "Find all offline Windows servers"
- "List devices created in the last month"
- "Show all pending approval devices"
- "Get devices in organization 5 that are online"`,
    inputSchema: {
      type: 'object',
      properties: {
        df: {
          type: 'string',
          description: 'Device filter using NinjaOne df syntax. Supports: org, loc, role, id, class, status, online/offline, created dates, group. Use AND to combine filters. Examples: "class=WINDOWS_SERVER AND offline", "org=123 AND online", "created after 2024-01-01"'
        },
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 100, max: 1000)',
          default: 100,
          minimum: 1,
          maximum: 1000
        },
        after: {
          type: 'string',
          description: 'Pagination cursor from previous response to fetch next page'
        }
      },
      required: []
    }
  },
  {
    name: 'ninjaone_query_software_inventory',
    description: `Query software inventory across your entire device environment. Search for specific software by name, filter by device class or organization, and get detailed installation information.

Use Cases:
- "Find all devices with Chrome installed"
- "Which machines have Adobe Reader?"
- "Show me all servers with SQL Server installed"
- "Find devices with Java installed in organization 5"
- "List all software on Windows workstations"

Returns detailed installation data including:
- Device and organization information
- Software name, version, and publisher
- Installation dates
- Summary statistics (unique devices, software counts, distribution by class/org/version)`,
    inputSchema: {
      type: 'object',
      properties: {
        softwareName: {
          type: 'string',
          description: 'Software name to search for (e.g., "Chrome", "Office", "Adobe"). Partial matches supported.'
        },
        deviceClass: {
          type: 'string',
          description: 'Filter by device class: WINDOWS_SERVER, WINDOWS_WORKSTATION, LINUX_SERVER, LINUX_WORKSTATION, MAC, etc.'
        },
        organizationId: {
          type: 'number',
          description: 'Filter by organization ID'
        },
        status: {
          type: 'string',
          enum: ['INSTALLED', 'UNINSTALLED'],
          description: 'Filter by software status (default: INSTALLED)'
        },
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 100, max: 1000)',
          default: 100,
          minimum: 1,
          maximum: 1000
        },
        after: {
          type: 'string',
          description: 'Pagination cursor from previous response'
        }
      },
      required: []
    }
  },
  {
    name: 'ninjaone_query_activities_advanced',
    description: `Query activity logs with advanced filtering including date ranges and enhanced context.

Enhances the Phase 1 activities tool with:
- Date range filtering (startDate, endDate) for historical queries
- Organization-wide activity monitoring
- Rich summary statistics with type and status breakdowns
- Activity timeline with earliest/latest timestamps

Use Cases:
- "Show me all activities from last week"
- "What happened on device X between January 1 and January 31?"
- "List all patch activities from the past 24 hours"
- "Show organization-wide activities for the last month"
- "Find all failed activities in the last 7 days"

Returns comprehensive activity data including:
- Activity timeline with timestamps
- Summary statistics by type, status, device, and organization
- Date range information (earliest and latest activity)
- Pagination support for large result sets`,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: {
          type: 'number',
          description: 'Filter by specific device ID (optional)'
        },
        organizationId: {
          type: 'number',
          description: 'Filter by organization ID (optional)'
        },
        type: {
          type: 'string',
          description: 'Filter by activity type (e.g., "PATCH", "SCRIPT", "REBOOT", "SOFTWARE_INSTALL") (optional)'
        },
        startDate: {
          type: 'string',
          description: 'Start date for range filter in ISO format (e.g., "2024-01-01T00:00:00Z") (optional)'
        },
        endDate: {
          type: 'string',
          description: 'End date for range filter in ISO format (e.g., "2024-12-31T23:59:59Z") (optional)'
        },
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 100, max: 1000)',
          default: 100,
          minimum: 1,
          maximum: 1000
        },
        after: {
          type: 'string',
          description: 'Pagination cursor from previous response to fetch next page'
        }
      },
      required: []
    }
  },
  {
    name: 'ninjaone_query_backup_status',
    description: `Query backup status across your entire device environment with advanced filtering and compliance metrics.

This tool provides comprehensive backup monitoring including:
- Backup job status tracking (SUCCESS, FAILED, RUNNING, WARNING, NEVER_RUN)
- Protection rate calculations (% of devices with backup enabled)
- Success rate metrics for compliance reporting
- Device-level backup details with last backup time, next scheduled backup
- Failure reason tracking and consecutive failure counts
- Backup type filtering (FULL, INCREMENTAL, DIFFERENTIAL)
- Organization and device class breakdowns

Use Cases:
- "Show me all devices with failed backups"
- "What's our backup protection rate across all organizations?"
- "Which devices haven't been backed up in the last 24 hours?"
- "Find all servers with backup failures"
- "Get backup status for organization 5"
- "Show devices requiring backup attention"

Returns detailed backup data including:
- Device backup status with timestamps
- Compliance metrics (protection rate, success rate, devices needing attention)
- Summary statistics by status, backup type, organization, and device class
- Date range information (oldest and newest backup times)
- Pagination support for large environments

IMPORTANT: This tool queries the NinjaOne backup monitoring endpoint.
Verify that backup monitoring is enabled in your NinjaOne environment.`,
    inputSchema: {
      type: 'object',
      properties: {
        deviceId: {
          type: 'number',
          description: 'Filter by specific device ID (optional)'
        },
        organizationId: {
          type: 'number',
          description: 'Filter by organization ID (optional)'
        },
        status: {
          type: 'string',
          enum: ['SUCCESS', 'FAILED', 'RUNNING', 'WARNING', 'NEVER_RUN'],
          description: 'Filter by backup status (optional)'
        },
        backupType: {
          type: 'string',
          enum: ['FULL', 'INCREMENTAL', 'DIFFERENTIAL'],
          description: 'Filter by backup type (optional)'
        },
        df: {
          type: 'string',
          description: 'Device filter using NinjaOne df syntax for advanced filtering (e.g., "class=WINDOWS_SERVER AND org=123") (optional)'
        },
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 100, max: 1000)',
          default: 100,
          minimum: 1,
          maximum: 1000
        },
        after: {
          type: 'string',
          description: 'Pagination cursor from previous response to fetch next page'
        }
      },
      required: []
    }
  },

  // ============ LOCATION TOOLS ============
  {
    name: 'ninjaone_get_locations',
    description: `Get all locations for an organization. Locations are required for downloading agent installers.

Each organization can have one or more locations. Use this to find the locationId needed for installer downloads.`,
    inputSchema: {
      type: 'object',
      properties: {
        orgId: {
          type: 'number',
          description: 'Organization ID to get locations for'
        }
      },
      required: ['orgId']
    }
  },

  // ============ INSTALLER TOOLS ============
  {
    name: 'ninjaone_get_installer',
    description: `Get a pre-signed download URL for a NinjaOne agent installer for a specific organization and location.

Use this to download organization/location-specific agent installers that will auto-register devices to the correct org and location.

Available Installer Types:
- WINDOWS_MSI: Windows MSI installer (for GPO/SCCM deployment)
- WINDOWS_EXE: Windows executable installer (for manual installation)
- MAC_DMG: macOS DMG installer
- MAC_PKG: macOS PKG installer (for MDM deployment)
- LINUX_DEB: Debian/Ubuntu .deb package
- LINUX_RPM: RHEL/CentOS/Fedora .rpm package

The returned URL is pre-signed and time-limited. Download promptly after receiving.

To find the locationId, use ninjaone_get_locations first.`,
    inputSchema: {
      type: 'object',
      properties: {
        orgId: {
          type: 'number',
          description: 'Organization ID'
        },
        locationId: {
          type: 'number',
          description: 'Location ID within the organization'
        },
        installerType: {
          type: 'string',
          enum: ['WINDOWS_MSI', 'WINDOWS_EXE', 'MAC_DMG', 'MAC_PKG', 'LINUX_DEB', 'LINUX_RPM'],
          description: 'Type of installer to download'
        }
      },
      required: ['orgId', 'locationId', 'installerType']
    }
  },
  {
    name: 'ninjaone_get_all_installers',
    description: `Get pre-signed download URLs for all available NinjaOne agent installer types for a specific organization and location.

Returns download links for all 6 installer types:
- WINDOWS_MSI, WINDOWS_EXE
- MAC_DMG, MAC_PKG
- LINUX_DEB, LINUX_RPM

Useful for setting up deployment packages or providing download links to technicians.

To find the locationId, use ninjaone_get_locations first.`,
    inputSchema: {
      type: 'object',
      properties: {
        orgId: {
          type: 'number',
          description: 'Organization ID'
        },
        locationId: {
          type: 'number',
          description: 'Location ID within the organization'
        }
      },
      required: ['orgId', 'locationId']
    }
  }
];
