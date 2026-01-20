import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { NinjaOneClient } from './api/client.js';
import { logger } from './utils/logger.js';
import express from 'express';
import { config } from './config.js';
import { tools } from './mcp/tools.js';
import { NinjaOneMCPServer } from './mcp/server.js';
import { randomUUID } from 'crypto';

// Parse command line arguments
const args = process.argv.slice(2);
const transportIndex = args.indexOf('--transport');
const transport = transportIndex !== -1 ? args[transportIndex + 1] : 'stdio';

async function main() {
  try {
    // Handle shutdown gracefully
    process.on('SIGINT', () => {
      logger.info('Received SIGINT, shutting down gracefully...');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      logger.info('Received SIGTERM, shutting down gracefully...');
      process.exit(0);
    });

    if (transport === 'http') {
      // HTTP/SSE mode for Docker/remote access with proper MCP SSE protocol
      const port = config.server.port;
      const app = express();

      // Only apply JSON middleware to non-MCP routes
      // The /message endpoint needs raw body for SSE transport
      app.use((req, res, next) => {
        if (req.path === '/message') {
          return next();
        }
        return express.json()(req, res, next);
      });

      // Health check endpoint
      app.get('/health', (req, res) => {
        res.json({
          status: 'healthy',
          service: 'ninjaone-mcp-bridge',
          version: '1.3.0',
          timestamp: new Date().toISOString()
        });
      });

      // Store active SSE transports by their session ID (from SSE transport)
      const transports: Map<string, SSEServerTransport> = new Map();

      // Create MCP server factory function
      function createMCPServer(): Server {
        const server = new Server(
          {
            name: 'ninjaone-mcp-bridge',
            version: '1.3.0',
          },
          {
            capabilities: {
              tools: {},
            },
          }
        );

        // List available tools
        server.setRequestHandler(ListToolsRequestSchema, async () => {
          logger.debug('Received list_tools request via SSE');
          return { tools };
        });

        // Handle tool calls - delegate to NinjaOneMCPServer
        server.setRequestHandler(CallToolRequestSchema, async (request) => {
          logger.info(`Received tool call via SSE: ${request.params.name}`, {
            arguments: request.params.arguments
          });

          try {
            const mcpServer = new NinjaOneMCPServer();
            const result = await mcpServer.callTool(
              request.params.name,
              request.params.arguments || {}
            );
            logger.info(`Tool call successful: ${request.params.name}`);
            return result;
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

        return server;
      }

      // SSE endpoint for MCP communication (proper MCP SSE protocol)
      app.get('/sse', async (req, res) => {
        logger.info('New SSE connection from client');

        // Create SSE transport - it generates its own session ID
        const sseTransport = new SSEServerTransport('/message', res);

        // Extract session ID from the endpoint URL the transport will send
        // The transport sends: event: endpoint\ndata: /message?sessionId=xxx
        const sessionId = randomUUID();
        transports.set(sessionId, sseTransport);

        // Also store by a simple key for fallback
        transports.set('latest', sseTransport);

        // Create and connect MCP server for this session
        const server = createMCPServer();

        res.on('close', () => {
          logger.info('SSE connection closed');
          transports.delete(sessionId);
          if (transports.get('latest') === sseTransport) {
            transports.delete('latest');
          }
        });

        try {
          await server.connect(sseTransport);
          logger.info('MCP server connected via SSE transport');
        } catch (error) {
          logger.error('Failed to connect MCP server:', error);
        }
      });

      // Message endpoint for SSE transport (handles POST messages from client)
      app.post('/message', async (req, res) => {
        logger.info('Received POST /message', { sessionId: req.query.sessionId });

        // Get any available transport (the SSE transport manages its own session internally)
        const latestTransport = transports.get('latest');

        if (latestTransport) {
          try {
            await latestTransport.handlePostMessage(req, res);
          } catch (error) {
            logger.error('Error handling POST message:', error);
            res.status(500).json({ error: 'Internal server error' });
          }
        } else {
          logger.error('No active SSE session for POST /message');
          res.status(400).json({ error: 'No active SSE session' });
        }
      });

      app.listen(port, '0.0.0.0', () => {
        logger.info(`NinjaOne MCP Server running in HTTP/SSE mode on port ${port}`);
        logger.info(`SSE endpoint: http://localhost:${port}/sse`);
        logger.info(`Health check: http://localhost:${port}/health`);
      });

    } else {
      // stdio mode for Claude Desktop
      logger.info('Starting NinjaOne MCP Server in stdio mode...');
      const server = new NinjaOneMCPServer();
      await server.start();
    }

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});
