/**
 * Mindo MCP Server
 * Project-agnostic AI development memory server
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

interface ServerConfig {
    port: number;
    projectDir: string;
    config: {
        name: string;
        context: {
            description: string;
            techStack: string[];
        };
    };
}

// Auto-context cache
let autoContext: {
    lastUpdate: string;
    branch: string;
    lastCommit: string;
    lastCommitMessage: string;
    uncommittedChanges: number;
} | null = null;

function generateAutoContext(projectDir: string) {
    try {
        const branch = execSync('git branch --show-current', { cwd: projectDir, encoding: 'utf-8' }).trim();
        const lastCommit = execSync('git rev-parse --short HEAD', { cwd: projectDir, encoding: 'utf-8' }).trim();
        const lastCommitMessage = execSync('git log -1 --pretty=%s', { cwd: projectDir, encoding: 'utf-8' }).trim();
        const uncommittedChanges = parseInt(
            execSync('git status --porcelain | wc -l', { cwd: projectDir, encoding: 'utf-8' }).trim() || '0'
        );

        autoContext = {
            lastUpdate: new Date().toISOString(),
            branch,
            lastCommit,
            lastCommitMessage,
            uncommittedChanges,
        };
    } catch {
        autoContext = null;
    }
    return autoContext;
}

export async function startServer(config: ServerConfig) {
    const { port, projectDir } = config;
    const mindoDir = join(projectDir, '.mindo');

    // Generate initial auto-context
    generateAutoContext(projectDir);

    // Resource handlers
    const resources: Record<string, () => string> = {
        'mindo://context': () => {
            const contextPath = join(mindoDir, 'context.md');
            return existsSync(contextPath)
                ? readFileSync(contextPath, 'utf-8')
                : 'No context file found';
        },

        'mindo://auto-context': () => {
            if (!autoContext) generateAutoContext(projectDir);
            return JSON.stringify(autoContext, null, 2);
        },

        'mindo://config': () => {
            return JSON.stringify(config.config, null, 2);
        },

        'mindo://decisions': () => {
            const decisionsDir = join(mindoDir, 'decisions');
            if (!existsSync(decisionsDir)) return 'No decisions yet';

            const files = readdirSync(decisionsDir).filter(f => f.endsWith('.md'));
            if (files.length === 0) return 'No decisions yet';

            return files.map(f => {
                const content = readFileSync(join(decisionsDir, f), 'utf-8');
                return `## ${f}\n\n${content}`;
            }).join('\n\n---\n\n');
        },
    };

    // @ts-ignore - Bun.serve
    const server = Bun.serve({
        port,
        fetch(request: Request) {
            const url = new URL(request.url);

            // CORS headers
            const headers = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type': 'application/json',
            };

            if (request.method === 'OPTIONS') {
                return new Response(null, { headers });
            }

            // Health check
            if (url.pathname === '/health') {
                return Response.json({ status: 'ok', project: config.config.name }, { headers });
            }

            // List resources
            if (url.pathname === '/resources') {
                return Response.json({ resources: Object.keys(resources) }, { headers });
            }

            // Get resource
            if (url.pathname === '/resource') {
                const uri = url.searchParams.get('uri');
                if (!uri) {
                    return Response.json({ error: 'Missing uri parameter' }, { status: 400, headers });
                }

                const handler = resources[uri];
                if (!handler) {
                    return Response.json({ error: 'Resource not found' }, { status: 404, headers });
                }

                try {
                    return Response.json({ content: handler() }, { headers });
                } catch (error) {
                    return Response.json({ error: String(error) }, { status: 500, headers });
                }
            }

            // Refresh auto-context
            if (url.pathname === '/refresh') {
                generateAutoContext(projectDir);
                return Response.json({ status: 'refreshed', context: autoContext }, { headers });
            }

            // Default response
            return Response.json({
                name: 'mindo-server',
                version: '0.1.0',
                project: config.config.name,
                endpoints: ['/health', '/resources', '/resource?uri=...', '/refresh'],
            }, { headers });
        },
    });

    console.log(`✅ Mindo server running at http://localhost:${server.port}`);
    console.log(`📚 Resources: ${Object.keys(resources).length}`);
    console.log('\nAvailable resources:');
    Object.keys(resources).forEach(r => console.log(`   ${r}`));
}
