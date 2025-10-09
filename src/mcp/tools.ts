import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const tools: Tool[] = [
  // ============ EXISTING TOOLS ============
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
          description: 'Filter by severity: CRITICAL, HIGH, MODERATE, LOW, INFO',
          enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW', 'INFO']
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
          description: `Device filter using NinjaOne df syntax. Supports: org, loc, role, id, class, status, online/offline, created dates, group. Use AND to combine filters. Examples: "class=WINDOWS_SERVER AND offline", "org=123 AND online", "created after 2024-01-01"`
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
  }
];
