/**
 * mindo search
 * Search decisions by keyword
 */

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

export async function search(args: string[]) {
    const query = args.join(' ').toLowerCase();

    if (!query) {
        console.log('Usage: mindo search "your query"');
        console.log('');
        console.log('Examples:');
        console.log('  mindo search auth');
        console.log('  mindo search "database schema"');
        return;
    }

    const cwd = process.cwd();
    const mindoDir = join(cwd, '.mindo');
    const decisionsDir = join(mindoDir, 'decisions');

    // Check if initialized
    if (!existsSync(mindoDir)) {
        console.log('❌ Mindo not initialized. Run: mindo init');
        return;
    }

    if (!existsSync(decisionsDir)) {
        console.log('📭 No decisions found. Use: mindo remember "your decision"');
        return;
    }

    // Search through decision files
    const files = readdirSync(decisionsDir).filter(f => f.endsWith('.md'));

    if (files.length === 0) {
        console.log('📭 No decisions found. Use: mindo remember "your decision"');
        return;
    }

    const results: { file: string; content: string; matches: string[] }[] = [];

    for (const file of files) {
        const content = readFileSync(join(decisionsDir, file), 'utf-8');
        const contentLower = content.toLowerCase();

        if (contentLower.includes(query)) {
            // Find matching lines
            const lines = content.split('\n');
            const matches = lines.filter(line =>
                line.toLowerCase().includes(query)
            );

            results.push({ file, content, matches });
        }
    }

    if (results.length === 0) {
        console.log(`🔍 No results for "${query}"`);
        console.log(`📊 Searched ${files.length} decisions`);
        return;
    }

    console.log(`🔍 Found ${results.length} result(s) for "${query}":\n`);

    for (const result of results) {
        console.log(`📄 ${result.file}`);

        // Show first 3 matching lines
        const preview = result.matches.slice(0, 3);
        for (const line of preview) {
            // Highlight the query in the line
            const highlighted = line.replace(
                new RegExp(query, 'gi'),
                (match) => `\x1b[33m${match}\x1b[0m`
            );
            console.log(`   ${highlighted.trim()}`);
        }

        if (result.matches.length > 3) {
            console.log(`   ... and ${result.matches.length - 3} more matches`);
        }
        console.log('');
    }

    console.log(`📊 Searched ${files.length} decisions`);
}
