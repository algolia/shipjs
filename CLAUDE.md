# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ship.js is an automated release management CLI for JavaScript/Node.js packages. Unlike fully automated tools like semantic-release, Ship.js creates a pull request before publishing, allowing teams to review versions, changelogs, and test release candidates before the actual release.

## Common Commands

```bash
# Install dependencies
yarn install

# Build shipjs-lib (required before testing)
yarn build

# Run all tests
yarn test

# Run all linting
yarn lint

# Watch mode for tests (pick one based on which package you're working on)
yarn workspace shipjs test:watch       # CLI package
yarn workspace shipjs-lib test:watch   # Library package

# Run a single test file
yarn workspace shipjs vitest path/to/test.js
yarn workspace shipjs-lib vitest path/to/test.js

# Test CLI commands against a real repository
yarn workspace shipjs test:run:prepare --dir ~/path/to/test-repo

# Documentation dev server
yarn web
```

## Architecture

This is a Yarn workspaces monorepo with Lerna for cross-package commands.

### Package Structure

- **packages/shipjs**: CLI entry point. Contains the three main flows (setup, prepare, release) and orchestrates the release process through modular steps.
- **packages/shipjs-lib**: Core library with reusable functions for git operations, version management, shell execution, and configuration loading. Built with Rollup.
- **website**: VuePress documentation site.

### Key Architectural Patterns

**Step-based Flow Architecture**: The CLI implements three flows (`src/flow/`) that execute sequences of steps (`src/step/`):
- `prepare.js` → `step/prepare/*.js` (20+ steps for creating release PRs)
- `release.js` → `step/release/*.js` (test, build, publish, tag, notify)
- `setup.js` → `step/setup/*.js` (interactive configuration wizard)

**Git Abstraction Layer**: `shipjs-lib/src/lib/git/` contains 15+ modules abstracting all git operations (commits, branches, tags, remote detection).

**Configuration System**: User config (`ship.config.js`) is merged with defaults from `shipjs-lib/src/lib/config/defaultConfig.js`. Supports hooks like `versionUpdated`, `beforeCommitChanges`, `beforePublish`.

### Three-Part Release Flow

1. **shipjs prepare**: Determines next version, updates changelog, creates staging branch (`releases/vX.X.X`), opens PR
2. **Review**: Team reviews PR, can add commits or test manually
3. **shipjs trigger**: Runs tests, publishes to npm, creates git tag and GitHub release

## Development Notes

- Node.js 20+ required
- ES modules throughout (uses `import/export`)
- ESLint with `eslint-config-algolia` (includes Prettier)
- Tests use Vitest
