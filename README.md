# Mindo

> 🧠 AI-powered development memory assistant. Never re-explain your project to your AI again.

[![npm version](https://badge.fury.io/js/%40edsphinx%2Fmindo.svg)](https://www.npmjs.com/package/@edsphinx/mindo)

## What is Mindo?

Mindo gives your AI assistant **persistent memory** about your project:

- 📝 Records architectural decisions
- 🔍 Searches across your project knowledge
- 🔄 Auto-detects git context (branch, commits)
- 🖥️ Runs as background daemon with auto-start

## Quick Start

```bash
# Install globally
npm i -g @edsphinx/mindo

# Initialize in your project
cd your-project
mindo init

# Record a decision
mindo remember "Using React because team has experience"

# Search decisions
mindo search "react"

# Check status
mindo status

# Start MCP server
mindo serve
```

## Commands

| Command | Description |
|---------|-------------|
| `mindo init` | Initialize Mindo in current project |
| `mindo remember "..."` | Record a decision/fact |
| `mindo search "..."` | Search decisions by keyword |
| `mindo serve` | Start MCP server |
| `mindo status` | Show project status |
| `mindo context` | Display project context |
| `mindo daemon install` | Install auto-start daemon |
| `mindo daemon start` | Start background daemon |
| `mindo daemon stop` | Stop daemon |

## How It Works

```
your-project/
├── .mindo/
│   ├── config.json      ← Project config (auto-generated)
│   ├── context.md       ← Project description
│   └── decisions/       ← Your recorded decisions
└── ...your code...
```

When you run `mindo serve`, it starts an MCP server that exposes:

| Resource | Description |
|----------|-------------|
| `mindo://context` | Your project description |
| `mindo://auto-context` | Git status, branch, changes |
| `mindo://decisions` | All recorded decisions |
| `mindo://config` | Project configuration |

## With Cursor/Claude

Tell your AI:
> "Use Mindo for context. Check mindo://decisions before making architectural choices."

## Example Session

```bash
$ mindo init
🧠 Initializing Mindo...
✅ Created .mindo/ directory
🎉 Mindo initialized successfully!

$ mindo remember "Using Turso for database - SQLite compatible with cloud sync"
✅ Remembered: "Using Turso for database - SQLite compatible..."
📊 Total decisions: 1

$ mindo search "database"
🔍 Found 1 result(s) for "database":
📄 2026-01-01_using-turso-for-database.md

$ mindo status
📊 Mindo Status
   Initialized: ✅ Yes
   Project: my-app
   Decisions: 1
```

## Auto-Start (Linux)

```bash
# Install systemd service
mindo daemon install

# Start daemon
mindo daemon start

# Daemon will auto-start on login
```

## Roadmap

- [x] CLI with init/serve/remember/search
- [x] Auto-detect project tech stack  
- [x] MCP server with resources
- [x] Daemon with systemd auto-start
- [ ] Turso sync (coming soon)
- [ ] LanceDB for semantic search
- [ ] Team collaboration

## License

MIT © [edsphinx](https://github.com/edsphinx)
