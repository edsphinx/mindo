/**
 * mindo daemon
 * Manage the Mindo background daemon
 */

import { existsSync, writeFileSync, readFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { getMindoHome, initGlobalMindo } from '../../core/config';

const SYSTEMD_PATH = join(
    process.env.HOME || '',
    '.config/systemd/user/mindo.service'
);

export async function daemon(args: string[]) {
    const subcommand = args[0] || 'status';

    switch (subcommand) {
        case 'install':
            await installDaemon();
            break;
        case 'uninstall':
            await uninstallDaemon();
            break;
        case 'start':
            await startDaemon();
            break;
        case 'stop':
            await stopDaemon();
            break;
        case 'status':
            await daemonStatus();
            break;
        default:
            showDaemonHelp();
    }
}

async function installDaemon() {
    initGlobalMindo();

    // Find mindo binary path
    let mindoBin: string;
    try {
        mindoBin = execSync('which mindo', { encoding: 'utf-8' }).trim();
    } catch {
        // Fallback to local bun run
        mindoBin = `${process.env.HOME}/.bun/bin/bun run ${join(process.env.HOME || '', 'Projects/mindo/src/cli/index.ts')}`;
    }

    const serviceContent = `[Unit]
Description=Mindo Development Memory Assistant
After=network.target

[Service]
Type=simple
ExecStart=${mindoBin} serve
Restart=on-failure
RestartSec=5
Environment=MINDO_PORT=3100

[Install]
WantedBy=default.target
`;

    // Ensure systemd user directory exists
    const systemdDir = join(process.env.HOME || '', '.config/systemd/user');
    if (!existsSync(systemdDir)) {
        execSync(`mkdir -p ${systemdDir}`);
    }

    writeFileSync(SYSTEMD_PATH, serviceContent);

    // Reload and enable
    try {
        execSync('systemctl --user daemon-reload');
        execSync('systemctl --user enable mindo.service');
        console.log('✅ Mindo daemon installed');
        console.log('');
        console.log('Commands:');
        console.log('  mindo daemon start   - Start the daemon');
        console.log('  mindo daemon stop    - Stop the daemon');
        console.log('  mindo daemon status  - Check status');
        console.log('');
        console.log('The daemon will auto-start on login.');
    } catch (error) {
        console.error('❌ Failed to enable service:', error);
    }
}

async function uninstallDaemon() {
    try {
        execSync('systemctl --user stop mindo.service 2>/dev/null || true');
        execSync('systemctl --user disable mindo.service 2>/dev/null || true');

        if (existsSync(SYSTEMD_PATH)) {
            unlinkSync(SYSTEMD_PATH);
        }

        execSync('systemctl --user daemon-reload');
        console.log('✅ Mindo daemon uninstalled');
    } catch (error) {
        console.error('❌ Failed to uninstall:', error);
    }
}

async function startDaemon() {
    try {
        execSync('systemctl --user start mindo.service');
        console.log('✅ Mindo daemon started');
        console.log('   Server running at http://localhost:3100');
    } catch (error) {
        console.error('❌ Failed to start daemon. Did you run: mindo daemon install?');
    }
}

async function stopDaemon() {
    try {
        execSync('systemctl --user stop mindo.service');
        console.log('✅ Mindo daemon stopped');
    } catch (error) {
        console.error('❌ Failed to stop daemon');
    }
}

async function daemonStatus() {
    try {
        const status = execSync('systemctl --user is-active mindo.service', {
            encoding: 'utf-8'
        }).trim();

        if (status === 'active') {
            console.log('🟢 Mindo daemon is running');
            console.log('   Server: http://localhost:3100');

            // Try to get health
            try {
                const response = execSync('curl -s http://localhost:3100/health', {
                    encoding: 'utf-8',
                    timeout: 2000,
                });
                const health = JSON.parse(response);
                console.log(`   Project: ${health.project || 'Unknown'}`);
            } catch { }
        } else {
            console.log('🔴 Mindo daemon is not running');
            console.log('   Run: mindo daemon start');
        }
    } catch {
        if (!existsSync(SYSTEMD_PATH)) {
            console.log('⚪ Mindo daemon not installed');
            console.log('   Run: mindo daemon install');
        } else {
            console.log('🔴 Mindo daemon is not running');
            console.log('   Run: mindo daemon start');
        }
    }
}

function showDaemonHelp() {
    console.log(`
🔧 Mindo Daemon

Usage: mindo daemon <command>

Commands:
  install     Install systemd service (auto-start on login)
  uninstall   Remove systemd service
  start       Start the daemon
  stop        Stop the daemon
  status      Check daemon status
`);
}
