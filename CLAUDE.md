# Rake Presentation Workflow

Novel exploratory documentation using neural-pathway knowledge graphs.

## 🔴 IMPORTANT: Read These First

- `MEMORY.md` - Living state, what was done, context for this session
- `STATE.md` - Objectives, what's complete vs pending  
- `FAILURES.md` - Error log, patterns to avoid
- `BUILD_PROGRESS.md` - Phase tracker

## 🔴 WHEN RESUMING (User Was Sleeping)

### Step 1: Start Dev Server
```bash
cd ~/Developer/rake-genie
npm run dev
# Opens on http://localhost:3001/app
```

### Step 2: Clear Browser Cache
```javascript
// In browser console (F12):
localStorage.removeItem('kg-camera');
location.reload();
```

### Step 3: Hard Refresh
`Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

### Step 4: Verify
- Background grid visible
- 8 colored brain lobes with labels
- 50+ nodes moving
- Nodes settle into clusters

---

## Current Values (Nov 26, 2025)

```typescript
// useCamera.ts
DEFAULT_CAMERA = { x: 0, y: 0, z: -700, fov: 2000 }

// usePhysics.ts
anchorStrength = isMasterNode ? 0.006 : 0.003

// NeuralGraph.tsx
spread = 200, initialVelocity = 0

// StaticCortex.tsx - REWRITTEN
// Uses project3D() with camera for lobe positioning
```

---

## Bash Commands

```bash
npm run dev          # Start development server
npm run build        # Build (ALWAYS run after changes)
npm run lint         # Run linter
```

## Code Style

- Use ES modules (`import/export`), not CommonJS
- Destructure imports: `import { Button } from '@/components/ui'`
- TypeScript strict mode - no `any` types unless unavoidable
- All components use Intelium design system (monochrome, Geist fonts)

## Key Files

| Purpose | File |
|---------|------|
| Graph data | `src/data/graph-data.ts` |
| Anchors | `src/data/anchors.ts` |
| Digital Twin | `src/lib/digital-twin.ts` |
| AI client | `src/lib/ai.ts` |
| Global state | `src/store/app-store.ts` |
| 3D projection | `src/components/graph/utils/projectionUtils.ts` |

## Current Phase

**Foundation: COMPLETE**
**Graph Visualization: COMPLETE** (NeuralGraph + StaticCortex)
**Next:** Notebook or Assistant

## Implementation Order

1. ✅ `src/components/graph/NeuralGraph.tsx`
2. ✅ `src/components/graph/InsightPanel.tsx`
3. ✅ `src/components/graph/StaticCortex.tsx` - REWRITTEN
4. ❌ `src/components/assistant/ChatInterface.tsx` ← NEXT
5. ❌ `src/components/notebook/Notebook.tsx`
6. ❌ Model + Demo tab content

## Common Pitfalls

```typescript
// React 18 useRef - MUST initialize
const ref = useRef<number | undefined>(undefined); // ✓
const ref = useRef<number>();                       // ✗

// Reserved HTML props
interface Props extends Omit<HTMLAttributes, 'prefix'> { prefix: ReactNode } // ✓
interface Props extends HTMLAttributes { prefix: ReactNode }                  // ✗

// Physics - make SMALL changes
anchorStrength: 0.005 → 0.006 // ✓ small
anchorStrength: 0.005 → 0.015 // ✗ too big, will break

// Background elements for 3D scenes
// Must use same projection as foreground
const lobe2D = project3D(lobe3D.x, lobe3D.y, lobe3D.z, camera, width, height) // ✓
const lobe2D = { x: screenWidth/2, y: screenHeight/2 } // ✗ won't align
```

## Workflow

1. Run `npm run build` after making changes
2. Check FAILURES.md for known error patterns
3. Update STATE.md when completing tasks
4. Log new errors to FAILURES.md

## Architecture

```
┌─────────────────────────────────────────────────┐
│         5 TAB NAVIGATION                        │
│  HOME | MODEL | DEMO | NOTEBOOK | ASSISTANT     │
├─────────────────────────────────────────────────┤
│     NeuralGraph + StaticCortex (HOME)           │
│     Camera-aware 3D projection                  │
├─────────────────────────────────────────────────┤
│           DIGITAL TWIN SERVICE                  │
│      (Ontology-grounded AI context)             │
├─────────────────────────────────────────────────┤
│  graph-data + official-docs + citations         │
└─────────────────────────────────────────────────┘
```

## Success Criteria

- [x] Graph renders 50+ nodes with physics
- [x] Multi-select works (shift+click)
- [x] StaticCortex lobes align with nodes
- [x] Pan/zoom works
- [ ] AI responses stream with citations
- [ ] Notebook cells editable
- [ ] All 5 tabs functional
- [ ] Build passes
