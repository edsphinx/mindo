/**
 * mindo remember
 * Store a decision or fact to memory
 */

import { existsSync, mkdirSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

interface RememberOptions {
    category?: string;
    tags?: string[];
}

export async function remember(args: string[], options: RememberOptions = {}) {
    const message = args.join(' ');

    if (!message) {
        console.log('Usage: mindo remember "Your decision or fact"');
        console.log('');
        console.log('Examples:');
        console.log('  mindo remember "Using React instead of Vue for team familiarity"');
        console.log('  mindo remember "Auth uses session keys for gas-less transactions"');
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

    // Ensure decisions directory exists
    if (!existsSync(decisionsDir)) {
        mkdirSync(decisionsDir, { recursive: true });
    }

    // Generate filename
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const slug = message
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .substring(0, 30)
        .replace(/-$/, '');

    const filename = `${dateStr}_${timeStr}_${slug}.md`;
    const filepath = join(decisionsDir, filename);

    // Create decision content
    const content = `# Decision

**Date:** ${now.toISOString()}
**Category:** ${options.category || 'general'}

## Context

${message}

## Tags

${options.tags ? options.tags.map(t => `- ${t}`).join('\n') : '- decision'}
`;

    writeFileSync(filepath, content);

    // Count total decisions
    const totalDecisions = readdirSync(decisionsDir).filter(f => f.endsWith('.md')).length;

    console.log(`✅ Remembered: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
    console.log(`📁 Saved to: .mindo/decisions/${filename}`);
    console.log(`📊 Total decisions: ${totalDecisions}`);
}
