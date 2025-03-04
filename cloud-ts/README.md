# TypeScript Cloud Code for Parse Server

This directory contains TypeScript versions of cloud code for Parse Server. The TypeScript files are compiled to JavaScript and automatically copied to the `cloud` directory, which is where Parse Server looks for cloud code.

## How it works

1. Write your cloud code in TypeScript in this directory
2. When you save a TypeScript file, it's automatically compiled to JavaScript
3. The compiled JavaScript file is automatically placed in the `cloud` directory
4. Parse Server reads the JavaScript files from the `cloud` directory

## Development

To start development with TypeScript:

1. Run `npm run dev` - This will start both:
   - The TypeScript watcher that compiles files when you save them
   - The Parse Server with nodemon for auto-reloading

2. Edit your TypeScript files in the `cloud-ts` directory
3. Every time you save a file (Ctrl+S), it will:
   - Automatically compile to JavaScript
   - Place the compiled JavaScript in the `cloud` directory
   - Parse Server will reload with the new code

## Building

To manually build all TypeScript files:

```bash
npm run build
```

This will compile all TypeScript files in the `cloud-ts` directory to JavaScript and place them in the `cloud` directory.

## Type Checking

To check your TypeScript files for errors without compiling:

```bash
npm run ts-check
```

## Best Practices

- Keep the same file structure in `cloud-ts` as you would in `cloud`
- Don't edit files in the `cloud` directory directly, as they will be overwritten
- When adding new files, be sure to import them in `main.ts`
- Use TypeScript interfaces for Parse objects when possible 