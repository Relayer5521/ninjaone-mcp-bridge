// Test script for Phase 1 tools
// Run with: node test-phase1.js

const { spawn } = require('child_process');
const readline = require('readline');

const serverPath = 'C:\\MSP-Tools\\ninjaone-mcp-bridge\\dist\\index.js';
const child = spawn('node', [serverPath], {
  env: {
    ...process.env,
    NINJAONE_CLIENT_ID: 'dvqjwmkb6DJPsKVUb6AWPvzPRtk',
    NINJAONE_CLIENT_SECRET: 'uKzwna9m9RzgwadJUAu6IvjPPhQpdvyrtZ5Eu87HP8sBHl1Sj6ldrA',
    NINJAONE_REGION: 'US',
    NODE_ENV: 'production',
    LOG_LEVEL: 'info'
  }
});

const rl = readline.createInterface({
  input: child.stdout,
  output: process.stdout,
  terminal: false
});

console.log('Starting NinjaOne MCP Bridge test...\n');

// Send list_tools request
const listToolsRequest = JSON.stringify({
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list'
}) + '\n';

child.stdin.write(listToolsRequest);

let toolCount = 0;
let phase1Tools = [];

rl.on('line', (line) => {
  try {
    const response = JSON.parse(line);
    if (response.result && response.result.tools) {
      const tools = response.result.tools;
      toolCount = tools.length;
      
      // Check for Phase 1 tools
      const phase1Names = [
        'ninjaone_query_device_health',
        'ninjaone_query_os_patches',
        'ninjaone_query_antivirus_status',
        'ninjaone_get_device_roles',
        'ninjaone_get_policies',
        'ninjaone_get_groups',
        'ninjaone_get_active_jobs',
        'ninjaone_get_scheduled_tasks',
        'ninjaone_get_custom_fields'
      ];
      
      phase1Tools = tools.filter(t => phase1Names.includes(t.name)).map(t => t.name);
      
      console.log('✅ Total tools available:', toolCount);
      console.log('✅ Phase 1 tools found:', phase1Tools.length);
      console.log('\nPhase 1 tools implemented:');
      phase1Tools.forEach(tool => console.log('  - ' + tool));
      
      console.log('\nMissing Phase 1 tools:');
      phase1Names.filter(name => !phase1Tools.includes(name))
        .forEach(tool => console.log('  ❌ ' + tool));
      
      // Exit after displaying results
      setTimeout(() => {
        child.kill();
        process.exit(0);
      }, 1000);
    }
  } catch (e) {
    // Ignore parsing errors for log messages
  }
});

child.stderr.on('data', (data) => {
  console.error('Error:', data.toString());
});

setTimeout(() => {
  console.log('\nTimeout - no response received');
  child.kill();
  process.exit(1);
}, 5000);
