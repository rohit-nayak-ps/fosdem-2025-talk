# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Vitess Migration Visualization Tool** - an interactive web presentation that demonstrates the step-by-step process of migrating from RDS to Vitess. Created for FOSDEM 2025 talk presentation.

**Tech Stack:**
- Pure HTML/CSS/JavaScript (no build process)
- GSAP 3.12.2 for animations
- Font Awesome 6.0.0 for icons

## Commands

Since this is a static website with no build process:

```bash
# Run locally - use any static file server
python3 -m http.server 8000
# or
npx http-server
# or simply open index.html in a browser
```

No linting, testing, or build commands are configured for this project.

## Architecture

### Key Components

1. **StepManager Class** (`js/animation.js`): Controls the entire presentation flow
   - Manages 6 migration steps (0-5)
   - Each step has `onStepX()` and `offStepX()` methods
   - Handles all animations and UI updates

2. **Visual Elements** (`index.html`):
   - Database clusters (RDS and Vitess)
   - Network connections with animated data flows
   - Routing rules table
   - Control plane components (etcd, vtorc, vtctld)

3. **Animation System**:
   - Uses GSAP for smooth transitions
   - `connectElements()`: Creates visual connections between components
   - `dataFlow()`: Animates data replication
   - Arrow positioning methods handle connection visualizations

### Development Patterns

- **Event-driven**: Step buttons trigger state transitions
- **Progressive disclosure**: Information revealed step-by-step
- **Visual hierarchy**: Orange (#F05E19) for Vitess components, white/gray for others
- **No external dependencies**: All libraries included locally

### Key Files

- `index.html`: All visual components and structure
- `js/animation.js`: Core logic and animations
- `css/styles.css`: Dark theme styling

When modifying animations, focus on the StepManager methods. Each step's logic is self-contained in its respective `onStep`/`offStep` methods.