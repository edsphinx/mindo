/**
 * mindo serve
 * Start the MCP server
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

interface ProjectConfig {
    name: string;
    context: {
        description: string;
        techStack: string[];
    };
}

export async function serve() {
    const cwd = process.cwd();
    const mindoDir = join(cwd, '.mindo');
    const configPath = join(mindoDir, 'config.json');

    // Check if initialized
    if (!existsSync(configPath)) {
        console.log('❌ Mindo not initialized. Run: mindo init');
        process.exit(1);
    }

    const config: ProjectConfig = JSON.parse(readFileSync(configPath, 'utf-8'));
    const port = process.env.MINDO_PORT || 3100;

    console.log(`🧠 Mindo Server v0.1.0`);
    console.log(`📁 Project: ${config.name}`);
    console.log(`🌐 Starting on http://localhost:${port}\n`);

    // Import and start server
    const { startServer } = await import('../../server/index');
    await startServer({ port: Number(port), projectDir: cwd, config });
}
