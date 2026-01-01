/**
 * mindo status
 * Check Mindo status
 */

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

export async function status() {
    const cwd = process.cwd();
    const mindoDir = join(cwd, '.mindo');

    console.log('📊 Mindo Status\n');

    // Check if initialized
    if (!existsSync(mindoDir)) {
        console.log('   Initialized: ❌ No');
        console.log('   Run: mindo init');
        return;
    }

    console.log('   Initialized: ✅ Yes');

    // Check config
    const configPath = join(mindoDir, 'config.json');
    if (existsSync(configPath)) {
        try {
            const config = JSON.parse(readFileSync(configPath, 'utf-8'));
            console.log(`   Project: ${config.name || 'Unknown'}`);

            if (config.context?.techStack?.length > 0) {
                console.log(`   Tech Stack: ${config.context.techStack.join(', ')}`);
            }
        } catch { }
    }

    // Count decisions
    const decisionsDir = join(mindoDir, 'decisions');
    if (existsSync(decisionsDir)) {
        const decisions = readdirSync(decisionsDir).filter((f: string) => f.endsWith('.md'));
        console.log(`   Decisions: ${decisions.length}`);
    } else {
        console.log('   Decisions: 0');
    }

    // Check if context.md exists
    const contextPath = join(mindoDir, 'context.md');
    if (existsSync(contextPath)) {
        const contextSize = readFileSync(contextPath, 'utf-8').length;
        console.log(`   Context: ${contextSize} chars`);
    }

    console.log('');
    console.log('Quick commands:');
    console.log('   mindo serve              Start MCP server');
    console.log('   mindo remember "..."     Add decision');
    console.log('   mindo search "..."       Search decisions');
}
