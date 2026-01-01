/**
 * mindo context
 * Show current project context
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export async function context() {
    const cwd = process.cwd();
    const mindoDir = join(cwd, '.mindo');
    const contextPath = join(mindoDir, 'context.md');

    if (!existsSync(mindoDir)) {
        console.log('❌ Mindo not initialized. Run: mindo init');
        return;
    }

    if (!existsSync(contextPath)) {
        console.log('❌ No context.md found in .mindo/');
        return;
    }

    const content = readFileSync(contextPath, 'utf-8');
    console.log(content);
}
