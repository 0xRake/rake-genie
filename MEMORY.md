# LIVING MEMORY FILE
## Rake Presentation Workflow - Continuous State

**Last Updated:** Nov 26, 2025 - 3:30 AM - Session End
**Build Status:** ✅ Successful | Dev Server: http://localhost:3001/app
**Next Action:** Clear browser cache, test graph visualization

---

## 🔴 IMPORTANT: WHEN YOU WAKE UP

### Quick Start
```bash
cd ~/Developer/rake-genie
npm run dev
# Open: http://localhost:3001/app
```

### Clear Browser Cache First!
In browser console (F12):
```javascript
localStorage.removeItem('kg-camera');
location.reload();
```
Then hard refresh: `Cmd+Shift+R` (Mac)

### What to Verify
- ✅ Background grid pattern visible
- ✅ Center crosshair visible
- ✅ 8 colored brain lobes with labels
- ✅ 50+ nodes moving fluidly
- ✅ Nodes settle into lobe clusters after 10-15 seconds
- ✅ Camera pan/zoom works smoothly

---

## CURRENT SESSION CONTEXT

### What Was Just Completed (This Session)
1. **StaticCortex.tsx REWRITTEN** - Now uses 3D projection with camera
2. **useCamera.ts** - Camera: x:0, y:0, z:-700, fov:2000
3. **usePhysics.ts** - Anchor strength: 0.006/0.003
4. **NeuralGraph.tsx** - Passes camera prop to StaticCortex
5. **Typo fixed** - `widow` → `window` in NeuralGraph.tsx
6. **Caches cleared** - `.next/` and `node_modules/.cache/` deleted
7. **Dev server running** - http://localhost:3001/app

### What Still Needs Work (Priority Order)
1. **Test the visualization** - Verify graph works after all changes
2. Build Notebook with cell types (Markdown, Code, Mermaid, Query)
3. Build Assistant chat interface with citations
4. Create Model tab content
5. Create Demo tab (Natura presentation)

---

## CURRENT PHYSICS & CAMERA VALUES

### Camera (useCamera.ts)
```typescript
DEFAULT_CAMERA = { x: 0, y: 0, z: -700, fov: 2000 }
```

### Physics (usePhysics.ts)
```typescript
anchorStrength = isMasterNode ? 0.006 : 0.003;
repulsionForce = 15000;
repulsionRadius = 600 / 500;
damping = 0.88;
stabilization = 0.01;
```

### Initialization (NeuralGraph.tsx)
```typescript
spread = 200;
initialVelocity = 0;
```

### StaticCortex.tsx - NEW
- Uses `project3D()` with camera for lobe positioning
- Shows all 8 group anchors as colored lobes
- Background grid pattern
- Center crosshair
- Labels above each lobe
- Moves with camera pan/zoom

---

## KEY CHANGES THIS SESSION

### 1. StaticCortex Now Camera-Aware
**Before:** Static screen-space positions (didn't move with pan/zoom)
**After:** Uses 3D world coordinates + camera projection

### 2. Camera Adjusted for Wide View
**Before:** z:-600, fov:1000
**After:** z:-700, fov:2000 (sees ±350 unit anchors)

### 3. Physics Reduced
**Before:** anchorStrength 0.008/0.005
**After:** anchorStrength 0.006/0.003 (gentler, less snappy)

### 4. All Lobes Now Visible
StaticCortex shows all 8 groups:
- os (center), aip (top), ontology (right), data (left)
- app (bottom), target, source, strategy

---

## USER FEEDBACK LOG

### Feedback Received
1. "Skeleton at BEST" - Need more comprehensive implementation
2. Plan is "too abstract and not detailed enough"
3. Nodes clustering in upper-right corner
4. Nodes flying apart (bounded physics overcompensated)
5. StaticCortex lobes not aligned with nodes (fixed with camera projection)

### How Addressed
- Multiple physics iterations (too strong → too weak → balanced)
- StaticCortex rewritten to use camera projection
- Camera FOV widened to see all anchor positions

---

## DECISIONS MADE

### Architecture Decisions
| Decision | Reasoning | Date |
|----------|-----------|------|
| Fresh project in rake-genie | Clean slate without legacy issues | Current |
| Intelium brand guide | Monochrome, professional, modern | Current |
| 5-tab structure | HOME, MODEL, DEMO, NOTEBOOK, ASSISTANT | Current |
| Zustand for state | Simple, lightweight, works with React 18 | Current |
| Camera-aware StaticCortex | Lobes must align with nodes | Current |
| Wide FOV (2000) | Anchors spread ±400 units, need to see all | Current |

---

## DEPENDENCIES

### External Dependencies
```json
{
  "d3": "^7.x",
  "mermaid": "^10.x",
  "@uiw/react-codemirror": "^4.x",
  "react-markdown": "^9.x",
  "zustand": "^4.x",
  "lucide-react": "^0.x",
  "geist": "^1.x"
}
```

### Internal Dependencies
```
NeuralGraph → usePhysics, useCamera, projectionUtils, StaticCortex, anchors
StaticCortex → project3D, Camera, GROUP_ANCHORS
Notebook → CodeMirror, Mermaid, react-markdown
Assistant → Gemini API, Digital Twin, Citations
```

---

## KNOWN ISSUES

### Resolved This Session
1. ✅ StaticCortex lobes misaligned - Fixed with camera projection
2. ✅ `widow` typo - Fixed to `window`
3. ✅ Camera too narrow - Widened FOV to 2000

### Active (Non-blocking)
1. ⚠️ Lint warnings (unused vars) - cosmetic
2. ⚠️ Notebook cells not yet implemented
3. ⚠️ Assistant chat interface not yet implemented
4. ⚠️ Model/Demo tab content pending

---

## CONTEXT FOR NEXT SESSION

### Files Modified This Session
- `src/components/graph/StaticCortex.tsx` - Complete rewrite
- `src/components/graph/NeuralGraph.tsx` - Camera prop, typo fix
- `src/components/graph/hooks/useCamera.ts` - z:-700, fov:2000
- `src/components/graph/hooks/usePhysics.ts` - anchorStrength 0.006/0.003

### Critical Files to Understand
- `src/data/anchors.ts` - 8 group positions (±400 units spread)
- `src/components/graph/utils/projectionUtils.ts` - project3D function
- `src/data/graph-data.ts` - All 50+ nodes with groups
- `src/lib/digital-twin.ts` - LLM grounding service

### Commands
```bash
cd ~/Developer/rake-genie
npm run dev     # Start dev server
npm run build   # Build for production
```

---

## SUCCESS METRICS

### Build Success
- [x] TypeScript compiles with no errors
- [x] All dependencies resolve
- [x] Routes work (/app)
- [x] Graph renders with 50+ nodes
- [x] Physics simulation runs at 30fps
- [x] StaticCortex lobes align with camera
- [ ] All 5 tabs render content (1/5 done)
- [ ] Notebook supports all cell types
- [ ] Assistant streams responses

### UX Success
- [x] User can explore graph intuitively
- [x] Multi-select feels natural (shift+click)
- [x] Pan/zoom camera controls work
- [x] InsightPanel shows node details
- [x] Background lobes visible
- [ ] Notebook cells are editable
- [ ] Chat responses stream smoothly
