import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { NinjaOneClient } from '../api/client.js';
import { logger } from '../utils/logger.js';
import { tools } from './tools.js';

export class NinjaOneMCPServer {
  private server: Server;
  private ninjaClient: NinjaOneClient;

  constructor() {
    this.ninjaClient = new NinjaOneClient();
    
    this.server = new Server(
      {
        name: 'ninjaone-mcp-bridge',
        version: '1.2.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    logger.info('NinjaOne MCP Server initialized (Phase 1 + Phase 2 tools)');
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      logger.debug('Received list_tools request');
      return { tools };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      logger.info(`Received tool call: ${request.params.name}`, {
        arguments: request.params.arguments
      });

      try {
        const result = await this.handleToolCall(
          request.params.name,
          request.params.arguments || {}
        );

        logger.info(`Tool call successful: ${request.params.name}`);
        
        return {
          content: [
            {
              type: 'text',
              text: typeof result === 'string' ? result : JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error) {
        logger.error(`Tool call failed: ${request.params.name}`, { error });
        
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    });
  }

  private async handleToolCall(name: string, args: any): Promise<any> {
    switch (name) {
      // ============ EXISTING TOOLS ============
      case 'ninjaone_get_organizations':
        return await this.ninjaClient.getOrganizations();

      case 'ninjaone_get_organization':
        return await this.ninjaClient.getOrganization(args.orgId);

      case 'ninjaone_get_devices':
        return await this.ninjaClient.getDevices(args.orgId);

      case 'ninjaone_get_device':
        return await this.ninjaClient.getDevice(args.deviceId);

      case 'ninjaone_get_alerts':
        return await this.ninjaClient.getAlerts({
          severity: args.severity,
          status: args.status
        });

      case 'ninjaone_get_activities':
        return await this.ninjaClient.getActivities({
          deviceId: args.deviceId,
          type: args.type
        });

      case 'ninjaone_get_device_software':
        return await this.ninjaClient.getDeviceSoftware(args.deviceId);

      case 'ninjaone_get_os_patches':
        return await this.ninjaClient.getOSPatches(args.deviceId);

      case 'ninjaone_health_check':
        return { healthy: await this.ninjaClient.healthCheck() };

      // ============ PHASE 1 QUERY TOOLS ============
      case 'ninjaone_query_device_health': {
        const response = await this.ninjaClient.queryDeviceHealth({
          filter: args.filter,
          pageSize: args.pageSize || 100,
          after: args.after
        });
        
        // Format response for better readability
        const summary = {
          totalDevices: response.data.length,
          healthy: response.data.filter(d => d.health === 'HEALTHY').length,
          warning: response.data.filter(d => d.health === 'WARNING').length,
          critical: response.data.filter(d => d.health === 'CRITICAL').length,
          offline: response.data.filter(d => d.health === 'OFFLINE').length
        };
        
        return {
          summary,
          devices: response.data,
          pagination: {
            hasMore: !!response.metadata.after,
            nextCursor: response.metadata.after
          }
        };
      }

      case 'ninjaone_query_os_patches': {
        const response = await this.ninjaClient.queryOSPatchStatus({
          filter: args.filter,
          pageSize: args.pageSize || 100,
          after: args.after
        });
        
        // Calculate totals
        const totals = response.data.reduce((acc, device) => ({
          critical: acc.critical + device.osPatches.critical,
          important: acc.important + device.osPatches.important,
          moderate: acc.moderate + device.osPatches.moderate,
          low: acc.low + device.osPatches.low,
          other: acc.other + device.osPatches.other,
          total: acc.total + device.osPatches.totalPending
        }), { critical: 0, important: 0, moderate: 0, low: 0, other: 0, total: 0 });
        
        return {
          summary: {
            devicesAnalyzed: response.data.length,
            totalPendingPatches: totals.total,
            patchesBySeverity: totals,
            devicesNeedingPatches: response.data.filter(d => d.osPatches.totalPending > 0).length
          },
          devices: response.data,
          pagination: {
            hasMore: !!response.metadata.after,
            nextCursor: response.metadata.after
          }
        };
      }

      case 'ninjaone_query_antivirus_status': {
        const response = await this.ninjaClient.queryAntivirusStatus({
          filter: args.filter,
          pageSize: args.pageSize || 100,
          after: args.after
        });
        
        // Analyze threats
        const allThreats = response.data.flatMap(d => d.antivirus.threats || []);
        const activeThreats = allThreats.filter(t => t.status === 'ACTIVE');
        
        return {
          summary: {
            devicesAnalyzed: response.data.length,
            protectedDevices: response.data.filter(d => 
              d.antivirus.status === 'ACTIVE' && 
              d.antivirus.definitionsUpToDate && 
              d.antivirus.realTimeProtection
            ).length,
            devicesWithIssues: response.data.filter(d =>
              d.antivirus.status !== 'ACTIVE' ||
              !d.antivirus.definitionsUpToDate ||
              !d.antivirus.realTimeProtection
            ).length,
            totalThreats: allThreats.length,
            activeThreats: activeThreats.length
          },
          devices: response.data,
          criticalDevices: response.data
            .filter(d => d.antivirus.threats.some(t => t.status === 'ACTIVE'))
            .map(d => ({
              deviceName: d.deviceName,
              activeThreats: d.antivirus.threats.filter(t => t.status === 'ACTIVE')
            })),
          pagination: {
            hasMore: !!response.metadata.after,
            nextCursor: response.metadata.after
          }
        };
      }

      case 'ninjaone_get_device_roles': {
        const roles = await this.ninjaClient.getDeviceRoles();
        
        // Group roles by node class
        const rolesByClass = roles.reduce((acc, role) => {
          if (!acc[role.nodeClass]) {
            acc[role.nodeClass] = [];
          }
          acc[role.nodeClass].push(role);
          return acc;
        }, {} as Record<string, typeof roles>);
        
        return {
          summary: {
            totalRoles: roles.length,
            rolesByClass: Object.keys(rolesByClass).map(cls => ({
              nodeClass: cls,
              count: rolesByClass[cls].length
            }))
          },
          roles
        };
      }

      case 'ninjaone_get_policies': {
        const policies = await this.ninjaClient.getPolicies(args);
        
        // Group policies by type
        const policiesByType = policies.reduce((acc, policy) => {
          if (!acc[policy.policyType]) {
            acc[policy.policyType] = [];
          }
          acc[policy.policyType].push(policy);
          return acc;
        }, {} as Record<string, typeof policies>);
        
        return {
          summary: {
            totalPolicies: policies.length,
            enabledPolicies: policies.filter(p => p.enabled).length,
            policiesByType: Object.keys(policiesByType).map(type => ({
              type,
              count: policiesByType[type].length,
              enabled: policiesByType[type].filter(p => p.enabled).length
            }))
          },
          policies
        };
      }

      case 'ninjaone_get_groups': {
        const groups = await this.ninjaClient.getGroups(args);
        
        return {
          summary: {
            totalGroups: groups.length,
            staticGroups: groups.filter(g => g.type === 'STATIC').length,
            dynamicGroups: groups.filter(g => g.type === 'DYNAMIC').length,
            totalDevicesInGroups: groups.reduce((sum, g) => sum + g.deviceCount, 0)
          },
          groups,
          largestGroups: groups
            .sort((a, b) => b.deviceCount - a.deviceCount)
            .slice(0, 5)
            .map(g => ({ name: g.name, devices: g.deviceCount }))
        };
      }

      case 'ninjaone_get_active_jobs': {
        const jobs = await this.ninjaClient.getActiveJobs(args);
        
        // Group jobs by type and status
        const jobsByType = jobs.reduce((acc, job) => {
          if (!acc[job.type]) {
            acc[job.type] = { running: 0, pending: 0, total: 0 };
          }
          acc[job.type].total++;
          if (job.status === 'RUNNING') acc[job.type].running++;
          if (job.status === 'PENDING') acc[job.type].pending++;
          return acc;
        }, {} as Record<string, { running: number; pending: number; total: number }>);
        
        return {
          summary: {
            totalActive: jobs.length,
            running: jobs.filter(j => j.status === 'RUNNING').length,
            pending: jobs.filter(j => j.status === 'PENDING').length,
            jobsByType
          },
          jobs,
          criticalJobs: jobs
            .filter(j => j.type === 'REBOOT' || j.type === 'SOFTWARE_UNINSTALL')
            .map(j => ({
              type: j.type,
              device: j.deviceName,
              status: j.status,
              startedAt: j.startedAt
            }))
        };
      }

      case 'ninjaone_get_scheduled_tasks': {
        const tasks = await this.ninjaClient.getScheduledTasks(args);
        
        // Find upcoming tasks (next 24 hours)
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const upcomingTasks = tasks.filter(task => {
          const nextRun = new Date(task.schedule.nextRun);
          return task.enabled && nextRun >= now && nextRun <= tomorrow;
        });
        
        return {
          summary: {
            totalTasks: tasks.length,
            enabledTasks: tasks.filter(t => t.enabled).length,
            upcomingIn24Hours: upcomingTasks.length
          },
          tasks,
          upcomingTasks: upcomingTasks.map(t => ({
            name: t.name,
            type: t.taskType,
            nextRun: t.schedule.nextRun
          }))
        };
      }

      case 'ninjaone_get_custom_fields': {
        const fields = await this.ninjaClient.getCustomFields(args);
        
        // Group fields by scope and type
        const fieldsByScope = fields.reduce((acc, field) => {
          if (!acc[field.scope]) {
            acc[field.scope] = [];
          }
          acc[field.scope].push(field);
          return acc;
        }, {} as Record<string, typeof fields>);
        
        const fieldsByType = fields.reduce((acc, field) => {
          acc[field.type] = (acc[field.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        return {
          summary: {
            totalFields: fields.length,
            requiredFields: fields.filter(f => f.required).length,
            fieldsByScope: Object.keys(fieldsByScope).map(s => ({
              scope: s,
              count: fieldsByScope[s].length,
              required: fieldsByScope[s].filter(f => f.required).length
            })),
            fieldsByType
          },
          fields
        };
      }

      // ============ PHASE 2 TOOLS ============
      case 'ninjaone_query_devices_advanced': {
        const response = await this.ninjaClient.queryDevicesAdvanced({
          df: args.df,
          pageSize: args.pageSize || 100,
          after: args.after
        });

        return {
          summary: {
            totalDevices: response.metadata.totalReturned,
            online: response.summary.onlineCount,
            offline: response.summary.offlineCount,
            byClass: response.summary.byClass,
            byApprovalStatus: response.summary.byApprovalStatus,
            organizationBreakdown: Object.values(response.summary.byOrganization)
              .sort((a, b) => b.count - a.count)
              .slice(0, 10)  // Top 10 organizations
          },
          devices: response.data,
          pagination: {
            hasMore: !!response.metadata.after,
            nextCursor: response.metadata.after,
            pageSize: response.metadata.pageSize
          },
          filterApplied: args.df || 'none'
        };
      }

      case 'ninjaone_query_software_inventory': {
        const response = await this.ninjaClient.querySoftwareInventory({
          softwareName: args.softwareName,
          deviceClass: args.deviceClass,
          organizationId: args.organizationId,
          status: args.status,
          pageSize: args.pageSize || 100,
          after: args.after
        });

        // Format response with rich summary
        return {
          summary: {
            totalInstallations: response.metadata.totalReturned,
            uniqueDevices: response.summary.uniqueDevices,
            uniqueSoftwareNames: response.summary.uniqueSoftwareNames,
            byDeviceClass: response.summary.byDeviceClass,
            topVersions: Object.entries(response.summary.byVersion)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([version, count]) => ({ version, count })),
            topPublishers: Object.entries(response.summary.byPublisher)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([publisher, count]) => ({ publisher, count })),
            organizationBreakdown: Object.values(response.summary.byOrganization)
              .sort((a, b) => b.count - a.count)
              .slice(0, 10)
          },
          installations: response.data,
          pagination: {
            hasMore: !!response.metadata.after,
            nextCursor: response.metadata.after,
            pageSize: response.metadata.pageSize
          },
          searchCriteria: {
            softwareName: args.softwareName || 'all',
            deviceClass: args.deviceClass || 'all',
            organizationId: args.organizationId || 'all'
          }
        };
      }

      case 'ninjaone_query_activities_advanced': {
        const response = await this.ninjaClient.queryActivitiesAdvanced({
          deviceId: args.deviceId,
          organizationId: args.organizationId,
          type: args.type,
          startDate: args.startDate,
          endDate: args.endDate,
          pageSize: args.pageSize || 100,
          after: args.after
        });

        // Format response with rich summary
        return {
          summary: {
            totalActivities: response.summary.totalActivities,
            byType: response.summary.byType,
            byStatus: response.summary.byStatus,
            topDevices: Object.entries(response.summary.byDevice)
              .sort((a, b) => b[1].count - a[1].count)
              .slice(0, 10)
              .map(([deviceId, info]) => ({
                deviceId: Number(deviceId),
                deviceName: info.name,
                activityCount: info.count
              })),
            topOrganizations: Object.entries(response.summary.byOrganization)
              .sort((a, b) => b[1].count - a[1].count)
              .slice(0, 10)
              .map(([orgId, info]) => ({
                organizationId: Number(orgId),
                organizationName: info.name,
                activityCount: info.count
              })),
            dateRange: response.summary.dateRange
          },
          activities: response.data,
          pagination: {
            hasMore: !!response.metadata.after,
            nextCursor: response.metadata.after,
            pageSize: response.metadata.pageSize
          },
          filterApplied: {
            deviceId: args.deviceId || 'all',
            organizationId: args.organizationId || 'all',
            type: args.type || 'all',
            dateRange: response.metadata.dateRange || 'not specified'
          }
        };
      }

      case 'ninjaone_query_backup_status': {
        const response = await this.ninjaClient.queryBackupStatus({
          deviceId: args.deviceId,
          organizationId: args.organizationId,
          status: args.status,
          backupType: args.backupType,
          df: args.df,
          pageSize: args.pageSize || 100,
          after: args.after
        });

        // Format response with rich compliance summary
        return {
          complianceSummary: {
            totalDevices: response.summary.totalDevices,
            protectedDevices: response.summary.protectedDevices,
            unprotectedDevices: response.summary.unprotectedDevices,
            protectionRate: `${response.summary.complianceMetrics.protectionRate}%`,
            successRate: `${response.summary.complianceMetrics.successRate}%`,
            devicesWithRecentBackup: response.summary.complianceMetrics.devicesWithRecentBackup,
            devicesRequiringAttention: response.summary.complianceMetrics.devicesRequiringAttention
          },
          statusBreakdown: {
            successful: response.summary.byStatus.success,
            failed: response.summary.byStatus.failed,
            running: response.summary.byStatus.running,
            warning: response.summary.byStatus.warning,
            neverRun: response.summary.byStatus.neverRun
          },
          backupTypeDistribution: response.summary.byBackupType,
          topOrganizations: Object.entries(response.summary.byOrganization)
            .sort((a, b) => (b[1].protected + b[1].unprotected) - (a[1].protected + a[1].unprotected))
            .slice(0, 10)
            .map(([orgId, info]) => ({
              organizationId: Number(orgId),
              organizationName: info.name,
              protectedDevices: info.protected,
              unprotectedDevices: info.unprotected,
              protectionRate: info.protected + info.unprotected > 0
                ? `${Math.round((info.protected / (info.protected + info.unprotected)) * 100)}%`
                : '0%'
            })),
          deviceClassBreakdown: Object.entries(response.summary.byDeviceClass)
            .map(([deviceClass, stats]) => ({
              deviceClass,
              totalDevices: stats.total,
              protectedDevices: stats.protected,
              protectionRate: stats.total > 0
                ? `${Math.round((stats.protected / stats.total) * 100)}%`
                : '0%'
            }))
            .sort((a, b) => b.totalDevices - a.totalDevices),
          dateRange: {
            oldestBackup: response.summary.dateRange.oldestBackup || 'N/A',
            newestBackup: response.summary.dateRange.newestBackup || 'N/A'
          },
          backupJobs: response.data,
          pagination: {
            hasMore: !!response.metadata.after,
            nextCursor: response.metadata.after,
            pageSize: response.metadata.pageSize
          },
          filterApplied: {
            deviceId: args.deviceId || 'all',
            organizationId: args.organizationId || 'all',
            status: args.status || 'all',
            backupType: args.backupType || 'all',
            df: args.df || 'not specified'
          }
        };
      }

      // ============ INSTALLER TOOLS ============
      case 'ninjaone_get_installer': {
        const result = await this.ninjaClient.getInstaller(args.orgId, args.installerType);

        return {
          success: true,
          organizationId: result.organizationId,
          installerType: result.installerType,
          downloadUrl: result.downloadUrl,
          expiresAt: result.expiresAt || 'Not specified',
          requestedAt: result.requestedAt,
          instructions: `Download the installer using the URL above. The installer is pre-configured for organization ${result.organizationId} and will auto-register devices to that org.`
        };
      }

      case 'ninjaone_get_all_installers': {
        const result = await this.ninjaClient.getAllInstallers(args.orgId);

        // Group by platform for better readability
        const windows = result.installers.filter(i => i.installerType.startsWith('WINDOWS'));
        const mac = result.installers.filter(i => i.installerType.startsWith('MAC'));
        const linux = result.installers.filter(i => i.installerType.startsWith('LINUX'));

        return {
          success: true,
          organizationId: result.organizationId,
          requestedAt: result.requestedAt,
          summary: {
            totalAvailable: result.installers.length,
            windowsInstallers: windows.length,
            macInstallers: mac.length,
            linuxInstallers: linux.length
          },
          installers: {
            windows: windows.map(i => ({
              type: i.installerType,
              url: i.downloadUrl,
              expiresAt: i.expiresAt || 'Not specified'
            })),
            mac: mac.map(i => ({
              type: i.installerType,
              url: i.downloadUrl,
              expiresAt: i.expiresAt || 'Not specified'
            })),
            linux: linux.map(i => ({
              type: i.installerType,
              url: i.downloadUrl,
              expiresAt: i.expiresAt || 'Not specified'
            }))
          },
          instructions: `All installers are pre-configured for organization ${result.organizationId}. Download URLs are time-limited.`
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info('NinjaOne MCP Server started (Phase 1 + Phase 2 tools)');
  }

  // Public method to list tools (for HTTP transport)
  async listTools(): Promise<typeof tools> {
    return tools;
  }

  // Public method to call a tool (for HTTP transport)
  async callTool(name: string, args: any): Promise<any> {
    try {
      const result = await this.handleToolCall(name, args);
      return {
        content: [
          {
            type: 'text',
            text: typeof result === 'string' ? result : JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
          }
        ],
        isError: true
      };
    }
  }
}

export default NinjaOneMCPServer;