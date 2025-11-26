# PROJECT STATE
## Rake Presentation Workflow - Objective Tracker

**Last Build:** ✅ Successful - Nov 26, 2025 3:30 AM
**Dev Server:** http://localhost:3001/app
**Session Status:** PAUSED - User sleeping

---

## 🔴 WHEN RESUMING

### Step 1: Clear Browser Cache
```javascript
// In browser console (F12):
localStorage.removeItem('kg-camera');
location.reload();
```

### Step 2: Hard Refresh
`Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

### Step 3: Verify
- Background grid visible
- 8 colored brain lobes with labels
- 50+ nodes moving
- Nodes settle into clusters

---

## OBJECTIVE

Create a novel exploratory documentation format using neural-pathway knowledge graphs that transforms static documentation into guided discovery.

---

## CURRENT VALUES (AS OF SESSION END)

### Camera (useCamera.ts)
| Parameter | Value | Notes |
|-----------|-------|-------|
| x | 0 | Centered on anchors |
| y | 0 | Centered on anchors |
| z | -700 | Pull back to see graph |
| fov | 2000 | Wide-angle to fit ±400 unit anchors |

### Physics (usePhysics.ts)
| Parameter | Value |
|-----------|-------|
| Anchor Strength (master) | 0.006 |
| Anchor Strength (normal) | 0.003 |
| Repulsion Force | 15000 |
| Repulsion Radius (master) | 600 |
| Repulsion Radius (normal) | 500 |
| Damping | 0.88 |
| Stabilization Threshold | 0.01 |

### Node Distribution (NeuralGraph.tsx)
| Parameter | Value |
|-----------|-------|
| Initial Spread | 200 |
| Initial Velocity | 0 |

### StaticCortex (NEW)
- Uses `project3D()` with camera
- Shows all 8 brain lobes
- Has background grid
- Has center crosshair
- Lobe labels visible
- Moves with pan/zoom

---

## WHAT HAS BEEN SUCCESSFULLY CREATED

### ✅ Foundation Layer (100% Complete)

| Component | File | Status |
|-----------|------|--------|
| Project Setup | `/Users/rake/Developer/rake-genie/` | ✅ Done |
| Dependencies | package.json | ✅ Installed |
| Tailwind Config | tailwind.config.ts | ✅ Done |
| Global Styles | src/app/globals.css | ✅ Done |
| Layout | src/app/layout.tsx | ✅ Done |
| Routing | src/app/app/page.tsx | ✅ Done |

### ✅ Design System (100% Complete)

| Component | File | Status |
|-----------|------|--------|
| Button | src/components/ui/Button.tsx | ✅ Done |
| Card | src/components/ui/Card.tsx | ✅ Done |
| Input | src/components/ui/Input.tsx | ✅ Done |
| Badge | src/components/ui/Badge.tsx | ✅ Done |
| Tabs | src/components/ui/Tabs.tsx | ✅ Done |

### ✅ Data Layer (100% Complete)

| Component | File | Status |
|-----------|------|--------|
| Graph Data | src/data/graph-data.ts | ✅ Done (50+ nodes) |
| Official Docs | src/data/official-docs.ts | ✅ Done |
| Citations | src/data/citations.ts | ✅ Done |
| Anchors | src/data/anchors.ts | ✅ Done (8 positions) |

### ✅ Graph System (100% Complete)

| Component | File | Status |
|-----------|------|--------|
| NeuralGraph | src/components/graph/NeuralGraph.tsx | ✅ Done |
| StaticCortex | src/components/graph/StaticCortex.tsx | ✅ **REWRITTEN** - Camera-aware |
| InsightPanel | src/components/graph/InsightPanel.tsx | ✅ Done |
| usePhysics | src/components/graph/hooks/usePhysics.ts | ✅ Done |
| useCamera | src/components/graph/hooks/useCamera.ts | ✅ Done |
| projectionUtils | src/components/graph/utils/projectionUtils.ts | ✅ Done |

---

## WHAT IS LACKING / PENDING

### 🔴 SUBAGENT #2: Notebook (NOTEBOOK Tab) - 0% Complete

| Component | File | Status | Priority |
|-----------|------|--------|----------|
| Notebook | src/components/notebook/Notebook.tsx | ❌ Pending | P1 |
| MarkdownCell | src/components/notebook/cells/MarkdownCell.tsx | ❌ Pending | P1 |
| CodeCell | src/components/notebook/cells/CodeCell.tsx | ❌ Pending | P1 |
| MermaidCell | src/components/notebook/cells/MermaidCell.tsx | ❌ Pending | P1 |

### 🔴 SUBAGENT #3: Assistant (ASSISTANT Tab) - 0% Complete

| Component | File | Status | Priority |
|-----------|------|--------|----------|
| ChatInterface | src/components/assistant/ChatInterface.tsx | ❌ Pending | P1 |
| Message | src/components/assistant/Message.tsx | ❌ Pending | P1 |
| CitationPopover | src/components/assistant/CitationPopover.tsx | ❌ Pending | P2 |

### 🔴 SUBAGENT #4: Model Tab - 0% Complete

| Component | File | Status |
|-----------|------|--------|
| ModelTab content | src/components/tabs/ModelTab.tsx | ❌ Placeholder |

### 🔴 SUBAGENT #5: Demo Tab - 0% Complete

| Component | File | Status |
|-----------|------|--------|
| DemoTab content | src/components/tabs/DemoTab.tsx | ❌ Placeholder |

---

## IMPLEMENTATION ORDER

```
Phase 1 (DONE): Foundation
    ↓
Phase 2 (IN PROGRESS): Core Features
    ├── NeuralGraph.tsx ✅ DONE
    ├── InsightPanel.tsx ✅ DONE
    ├── StaticCortex.tsx ✅ REWRITTEN
    ├── ChatInterface.tsx ← NEXT
    └── Notebook.tsx
    ↓
Phase 3: Content
    ├── ModelTab content
    └── DemoTab content
    ↓
Phase 4: Polish
    ├── Error boundaries
    ├── Loading states
    └── Mobile responsiveness
```

---

## VALIDATION CHECKLIST

### Graph Visualization (Test When Resuming)
- [ ] Background grid pattern visible
- [ ] Center crosshair visible
- [ ] 8 colored brain lobes with labels
- [ ] 50+ nodes rendering
- [ ] Nodes moving fluidly
- [ ] Nodes settle into clusters (10-15 sec)
- [ ] Lobes aligned with node clusters
- [ ] Pan/zoom works smoothly

### Before Moving to Phase 3
- [x] NeuralGraph renders 50+ nodes
- [x] Physics simulation stable at 30fps
- [x] Multi-node selection works (shift+click)
- [x] InsightPanel shows node details
- [x] Pan/zoom camera controls work
- [ ] ChatInterface accepts input
- [ ] Notebook renders cells

---

## QUICK REFERENCE

### Anchors (src/data/anchors.ts)
```typescript
os: { x: 0, y: 0, z: 0 }           // Center
aip: { x: 0, y: -400, z: -50 }     // Top
ontology: { x: 400, y: 0, z: -50 } // Right
data: { x: -400, y: 0, z: -50 }    // Left
app: { x: 0, y: 400, z: -50 }      // Bottom
target: { x: 450, y: -250, z: 150 }
source: { x: -450, y: -250, z: 150 }
strategy: { x: 0, y: 250, z: 200 }
```

### Key Commands
```bash
cd ~/Developer/rake-genie
npm run dev      # http://localhost:3001/app
npm run build    # Production build
```
