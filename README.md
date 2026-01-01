# Mindo

> 🧠 AI-powered development memory assistant. Never re-explain your project to your AI again.

## What is Mindo?

Mindo gives your AI assistant **persistent memory** about your project:

- 📝 Tracks architectural decisions
- 🔄 Auto-detects git context (branch, recent commits)
- 🔍 Enables semantic search across your project knowledge
- 🤝 Syncs with your team (optional)

## Quick Start

```bash
# Install globally
npm i -g @edsphinx/mindo

# Initialize in your project
cd your-project
mindo init

# Start the MCP server
mindo serve
```

## Commands

| Command | Description |
|---------|-------------|
| `mindo init` | Initialize Mindo in current project |
| `mindo serve` | Start MCP server |
| `mindo remember "..."` | Add a decision to memory |
| `mindo search "..."` | Search decisions |
| `mindo context` | Show project context |
| `mindo status` | Check Mindo status |

## How It Works

```
your-project/
├── .mindo/
│   ├── config.json      ← Project config
│   ├── context.md       ← Project description
│   └── decisions/       ← Architectural decisions
└── ...your code...
```

When you run `mindo serve`, it starts an MCP server that exposes:

- `mindo://context` - Your project description
- `mindo://auto-context` - Git status, branch, recent changes
- `mindo://decisions` - All recorded decisions

Your AI assistant can then query this context to give better, more informed responses.

## With Cursor/Claude

Tell your AI:
> "Use Mindo for context. Query mindo://context before answering questions about this project."

## Roadmap

- [x] CLI with init/serve commands
- [x] Auto-detect project tech stack
- [x] MCP server with resources
- [ ] Decision tracking (v0.2)
- [ ] LanceDB for vector search (v0.3)
- [ ] RAG for semantic search (v0.4)
- [ ] Team sync via Turso (v0.5)

## License

MIT
