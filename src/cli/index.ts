/**
 * Mindo CLI
 * Command-line interface for Mindo
 */

const args = process.argv.slice(2);
const command = args[0] || 'help';

const commands: Record<string, () => void | Promise<void>> = {
    init: () => import('./commands/init').then(m => m.init()),
    serve: () => import('./commands/serve').then(m => m.serve()),
    remember: () => import('./commands/remember').then(m => m.remember(args.slice(1))),
    search: () => import('./commands/search').then(m => m.search(args.slice(1))),
    daemon: () => import('./commands/daemon').then(m => m.daemon(args.slice(1))),
    status: () => import('./commands/status').then(m => m.status()),
    context: () => import('./commands/context').then(m => m.context()),
    help: () => showHelp(),
    '--help': () => showHelp(),
    '-h': () => showHelp(),
    '--version': () => console.log('0.0.2'),
    '-v': () => console.log('0.0.2'),
};

function showHelp() {
    console.log(`
🧠 Mindo v0.0.2 - AI Development Memory Assistant

Usage: mindo <command> [options]

Commands:
  init          Initialize Mindo in current project
  serve         Start MCP server
  remember      Add a decision or fact to memory
  search        Search decisions and context
  daemon        Manage background daemon (install/start/stop)
  context       Show current project context
  status        Check Mindo status
  help          Show this help

Examples:
  mindo init
  mindo remember "Using React for better DX"
  mindo search "auth"
  mindo daemon install

Learn more: https://github.com/edsphinx/mindo
`);
}

async function main() {
    const handler = commands[command];
    if (handler) {
        await handler();
    } else {
        console.error(`Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }
}

main().catch(console.error);

