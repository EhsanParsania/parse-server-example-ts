# TypeScript Cloud Code

This directory contains TypeScript code that compiles to the `cloud` directory where Parse Server reads cloud code.

## Quick Start

```bash
# Development with auto-compilation and file sync (including deletions)
npm run dev

# One-time build (for commits)
npm run build:cloud-sync
```

## How It Works

- Write TypeScript in `cloud-ts/`
- Files auto-compile to JavaScript in `cloud/`
- When TS files are deleted, JS files are also deleted

## Tips

- Don't edit files in `cloud/` - they'll be overwritten
- New files should be imported in `main.ts`
- Use TypeScript interfaces for Parse objects 