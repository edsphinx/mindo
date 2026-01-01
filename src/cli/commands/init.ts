/**
 * mindo init
 * Initialize Mindo in current project
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

export async function init() {
    const cwd = process.cwd();
    const mindoDir = join(cwd, '.mindo');

    console.log('🧠 Initializing Mindo...\n');

    // Check if already initialized
    if (existsSync(mindoDir)) {
        console.log('⚠️  Mindo already initialized in this project.');
        return;
    }

    // Create .mindo directory
    mkdirSync(mindoDir, { recursive: true });
    mkdirSync(join(mindoDir, 'decisions'), { recursive: true });

    // Auto-detect project info
    const projectInfo = detectProject(cwd);

    // Create config
    const config = {
        version: '1.0',
        name: projectInfo.name,
        context: {
            description: '',
            techStack: projectInfo.techStack,
        },
        sync: {
            enabled: false,
        },
    };

    writeFileSync(
        join(mindoDir, 'config.json'),
        JSON.stringify(config, null, 2)
    );

    // Create initial context.md
    writeFileSync(
        join(mindoDir, 'context.md'),
        `# ${projectInfo.name}

## Project Overview

<!-- Describe your project here -->

## Tech Stack

${projectInfo.techStack.map(t => `- ${t}`).join('\n')}

## Key Decisions

<!-- Mindo will help you track decisions here -->
`
    );

    // Create .gitignore for local files
    writeFileSync(
        join(mindoDir, '.gitignore'),
        `# Local-only files
local/
*.db
*.db-journal
`
    );

    console.log('✅ Created .mindo/ directory');
    console.log('✅ Created config.json');
    console.log('✅ Created context.md');
    console.log('✅ Created decisions/ directory\n');

    console.log('📝 Next steps:');
    console.log('   1. Edit .mindo/context.md to describe your project');
    console.log('   2. Run: mindo serve');
    console.log('   3. Tell your AI: "Use Mindo for context"\n');

    console.log('🎉 Mindo initialized successfully!');
}

function detectProject(cwd: string) {
    let name = cwd.split('/').pop() || 'project';
    const techStack: string[] = [];

    // Check package.json
    const pkgPath = join(cwd, 'package.json');
    if (existsSync(pkgPath)) {
        try {
            const pkg = JSON.parse(require('fs').readFileSync(pkgPath, 'utf-8'));
            name = pkg.name || name;

            const deps = { ...pkg.dependencies, ...pkg.devDependencies };
            if (deps.react) techStack.push('React');
            if (deps.vue) techStack.push('Vue');
            if (deps.next) techStack.push('Next.js');
            if (deps.typescript) techStack.push('TypeScript');
            if (deps.viem) techStack.push('Viem');
            if (deps.wagmi) techStack.push('Wagmi');
        } catch { }
    }

    // Check for Foundry
    if (existsSync(join(cwd, 'foundry.toml'))) {
        techStack.push('Foundry');
    }

    // Check for Cargo
    if (existsSync(join(cwd, 'Cargo.toml'))) {
        techStack.push('Rust');
    }

    // Check for Go
    if (existsSync(join(cwd, 'go.mod'))) {
        techStack.push('Go');
    }

    // Get git info
    try {
        execSync('git rev-parse --git-dir', { cwd, stdio: 'ignore' });
        techStack.push('Git');
    } catch { }

    return { name, techStack };
}
