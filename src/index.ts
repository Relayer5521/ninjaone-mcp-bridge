import { NinjaOneMCPServer } from './mcp/server';
import { logger } from './utils/logger';

async function main() {
  try {
    logger.info('Starting NinjaOne MCP Server...');
    
    const server = new NinjaOneMCPServer();
    await server.start();
    
    // Handle shutdown gracefully
    process.on('SIGINT', () => {
      logger.info('Received SIGINT, shutting down gracefully...');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      logger.info('Received SIGTERM, shutting down gracefully...');
      process.exit(0);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});
