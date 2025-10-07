import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { NinjaOneClient } from '../api/client';
import { logger } from '../utils/logger';
import { tools } from './tools';

export class NinjaOneMCPServer {
  private server: Server;
  private ninjaClient: NinjaOneClient;

  constructor() {
    this.ninjaClient = new NinjaOneClient();
    
    this.server = new Server(
      {
        name: 'ninjaone-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    logger.info('NinjaOne MCP Server initialized');
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
              text: JSON.stringify(result, null, 2)
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

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info('NinjaOne MCP Server started');
  }
}

export default NinjaOneMCPServer;
