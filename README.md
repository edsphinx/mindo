# Mindo

> 🧠 AI-powered development memory assistant. Never re-explain your project to your AI again.

**AI-powered development memory assistant. Never re-explain your project architecture to your AI again.**

Mindo acts as a persistent long-term memory layer for your AI coding assistants (Cursor, Windsurf, Claude Desktop). It bridges the gap between your project's history and your AI's context window.

[![npm version](https://badge.fury.io/js/%40edsphinx%2Fmindo.svg)](https://www.npmjs.com/package/@edsphinx/mindo)

## What is Mindo?

Mindo gives your AI assistant **persistent memory** about your project:

### 🚀 Key Features

* **📝 Decision Records:** Explicitly store architectural decisions, constraints, and business logic.
* **🔌 MCP Native:** Built on the **Model Context Protocol**, allowing seamless integration with modern AI tools.
* **🔄 Smart Context:** Auto-detects Git context (branch, diffs, commits) to keep the AI aware of the "now".
* **📂 Local-First:** All data lives in your `.mindo` folder. No external cloud dependencies required.
* **🖥️ Background Daemon:** Runs silently to serve context whenever your AI needs it.

---

## Quick Start

### 1. Install Globally

```bash
npm i -g @edsphinx/mindo
```

### 2. Initialize in Your Project

Navigate to your project root and initialize the Mindo workspace:

```bash
cd your-project
mindo init
```

### 3. Start the Server

You can run the server directly or as a daemon:

```bash
# Run directly (for testing)
mindo serve

# OR run as a background daemon (recommended for daily use)
mindo daemon install
mindo daemon start

# Record a decision
mindo remember "Using React because team has experience"

# Search decisions
mindo search "react"

# Check status
mindo status

# Start MCP server
mindo serve
```

---

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

---

## ⚙️ Configuration (MCP Setup)

To use Mindo with **Claude Desktop** or **Cursor**, you need to add it to your MCP configuration.

Add the following to your `claude_desktop_config.json` (or equivalent MCP settings):

```json
{
  "mcpServers": {
    "mindo": {
      "command": "mindo",
      "args": ["serve"]
    }
  }
}
```

Once configured, your AI assistant will have access to the following resources:
* `mindo://context`: High-level project description and goals.
* `mindo://decisions`: A searchable history of architectural decisions.
* `mindo://auto-context`: Real-time Git status and environment context.

---

## 🛠 Usage

### Recording Decisions
Don't let your AI guess why you chose a specific stack. Tell it once, and it remembers forever.

```bash
mindo remember "Using Turso for DB because we need SQLite compatibility with edge sync"
# ✅ Remembered: "Using Turso for DB..."
```

### Searching Knowledge
Retrieve past decisions or context manually (your AI does this automatically via MCP).

```bash
mindo search "database"
# 🔍 Found 1 result(s) for "database":
# 📄 2026-01-01_using-turso-for-database.md
```

### Project Status
Check the health of your memory bank.

```bash
mindo status
# 📊 Mindo Status
#    Initialized: ✅ Yes
#    Project: my-app
#    Decisions: 12
```

---

## 📂 How It Works

Mindo creates a transparent `.mindo` directory in your project root. This effectively becomes the "brain" of your project.

```text
your-project/
├── .mindo/
│   ├── config.json      ← Project specific settings
│   ├── context.md       ← High-level project description (editable)
│   └── decisions/       ← Markdown files containing your decisions
└── ...your code...
```

When you use an AI assistant, it queries the **Mindo MCP Server**. The server aggregates your manual `decisions`, the static `context.md`, and the dynamic Git status into a prompt-ready format.

---

## 🗺 Roadmap

* [x] CLI with init/remember/search
* [x] Basic MCP Server Implementation
* [x] Linux Daemon (Systemd)
* [ ] Auto-detect project tech stack (Next.js, Go, Python detection)
* [ ] **Turso Sync**: Sync team decisions across devices
* [ ] **Vector Search**: Upgrade to LanceDB for semantic search capabilities

---

## 📄 License

MIT © [edsphinx](https://github.com/edsphinx)
