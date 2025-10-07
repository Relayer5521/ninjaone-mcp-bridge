import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const tools: Tool[] = [
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
    description: 'Get OS patches for a device',
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
  }
];
