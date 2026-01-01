#!/usr/bin/env node

/**
 * Mindo CLI
 * AI-powered development memory assistant
 */

import('../dist/cli/index.js').catch(() => {
    // If dist doesn't exist, run from source
    import('../src/cli/index.ts');
});
