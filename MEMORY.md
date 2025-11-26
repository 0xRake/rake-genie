# LIVING MEMORY FILE
## Rake Presentation Workflow - Continuous State

**Last Updated:** Nov 26, 2025 - Afternoon
**Build Status:** ✅ Successful | Dev Server: http://localhost:3001/app
**Language:** Portuguese (pt-BR) - Complete translation

---

## 🔴 IMPORTANT: WHEN YOU WAKE UP

### Quick Start
```bash
cd ~/Developer/rake-genie
npm run dev
# Open: http://localhost:3001/app
```

### What to Test
1. **All UI in Portuguese** - Tab labels, buttons, content
2. **Natura Demo** (click "NATURA" tab)
   - Select persona from header (Maria, Carlos, Ana)
   - Click warehouse markers on map
   - View actionable insights panel
   - Resolve conflicts → decisions persist
   - Execute scenario → see audit log
   - Refresh page → decisions restored from localStorage

3. **Knowledge Graph** (INÍCIO tab)
   - 8 brain lobes with labels
   - 50+ nodes clustering
   - Pan/zoom works
   - Loading text in Portuguese

4. **CADERNO** tab - Full notebook functionality
5. **ASSISTENTE** tab - AI chat interface

---

## CURRENT SESSION CONTEXT

### What Was Just Completed (This Session)

#### Full Portuguese Translation
1. **Layout & Navigation**
   - `layout.tsx` - `lang="pt-BR"`, metadata in Portuguese
   - `page.tsx` - Tab labels: INÍCIO, MODELO, DEMONSTRAÇÃO, CADERNO, ASSISTENTE, INTERNO
   - Header simplified to just "Intelium" logo

2. **Knowledge Graph Bugs Fixed**
   - `usePhysics.ts` - Fixed circular callback reference using `useRef`
   - `graph-data.ts` - Replaced `React.ComponentType<any>` with typed `IconProps`
   - `NeuralGraph.tsx` - Replaced `useState` for links with `useMemo` (avoids cascading renders)
   - `NeuralGraph.tsx` - Replaced `aria-selected` with `aria-pressed` (accessibility fix)

3. **Components Translated**
   - `ModelTab.tsx` - All capabilities, architecture sections in PT
   - `DemoTab.tsx` - Challenges, opportunities, roadmap in PT
   - `NeuralGraph.tsx` - DemoMetrics, getGroupStory, tooltips, loading states
   - `Notebook.tsx` - All buttons, labels, empty state messages
   - `ChatInterface.tsx` - Assistant UI, placeholder, examples
   - `NaturaDemo.tsx` - Phase labels, UI elements

### Tab Labels (Portuguese)
| English | Portuguese |
|---------|-----------|
| HOME | INÍCIO |
| MODEL | MODELO |
| DEMO | DEMONSTRAÇÃO |
| NOTEBOOK | CADERNO |
| ASSISTANT | ASSISTENTE |
| INTERNAL | INTERNO |

---

## KEY VALUES & CONFIGURATION

### Language
```typescript
// layout.tsx
<html lang="pt-BR" className="dark">

// Metadata
title: "Intelium"
description: "Formato de documentação exploratória usando grafos de conhecimento de vias neurais"
```

### Natura Store (natura-store.ts)
```typescript
// Personas
PERSONAS = [
  { id: 'analyst', name: 'Maria Santos', role: 'Supply Chain Analyst' },
  { id: 'manager', name: 'Carlos Silva', role: 'Warehouse Manager' },
  { id: 'vp', name: 'Ana Oliveira', role: 'VP Operations' },
];

// LocalStorage key: 'natura-demo-session'
// Persisted: decisions, currentPersona, simulatedDay, metrics, phase
```

### Camera (useCamera.ts)
```typescript
DEFAULT_CAMERA = { x: 0, y: 0, z: -700, fov: 2000 }
```

### Physics (usePhysics.ts)
```typescript
anchorStrength = isMasterNode ? 0.006 : 0.003;
// Uses useRef for recursive callback to avoid circular reference
```

### Links Derivation (NeuralGraph.tsx)
```typescript
// Links are now derived from nodes using useMemo (not useState)
const links = useMemo((): Link[] => {
  if (nodes.length === 0) return [];
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  return GRAPH_DATA.links.filter(...).map(...);
}, [nodes]);
```

---

## FILES MODIFIED THIS SESSION

### Bug Fixes
- `src/components/graph/hooks/usePhysics.ts` - Circular callback fix
- `src/data/graph-data.ts` - IconProps type safety
- `src/components/graph/NeuralGraph.tsx` - useMemo for links, aria-pressed, PT translations

### Portuguese Translations
- `src/app/layout.tsx` - lang="pt-BR", metadata
- `src/app/app/page.tsx` - Tab labels, simplified header
- `src/components/tabs/ModelTab.tsx` - Full translation
- `src/components/tabs/DemoTab.tsx` - Full translation
- `src/components/notebook/Notebook.tsx` - Full translation
- `src/components/assistant/ChatInterface.tsx` - Full translation
- `src/components/natura-demo/NaturaDemo.tsx` - Phase labels translation

---

## DECISIONS MADE

### Architecture Decisions
| Decision | Reasoning | Date |
|----------|-----------|------|
| useMemo for links | Avoids setState in useEffect cascading renders | Nov 26 |
| useRef for physics callback | Fixes circular reference in recursive animation | Nov 26 |
| aria-pressed over aria-selected | Correct ARIA for button role | Nov 26 |
| IconProps interface | Type safety for Lucide icons | Nov 26 |
| Keep product names in English | Consistency with Palantir documentation | Nov 26 |
| pt-BR language attribute | Brazilian Portuguese localization | Nov 26 |

---

## KNOWN ISSUES

### Resolved This Session
1. ✅ Circular callback reference in usePhysics.ts
2. ✅ Unsafe `any` type in graph-data.ts
3. ✅ setState in useEffect causing cascading renders
4. ✅ Invalid aria-selected on button role
5. ✅ All UI in English (now Portuguese)

### Active (Non-blocking)
1. ⚠️ Some lint warnings remain in erp-integration components
2. ⚠️ Outcome timeline not in WasteOptimization execution
3. ⚠️ Rule badges not added to ConflictResolution

---

## GIT STATUS

### Latest Commits
```
1ecbbaa feat: Add Natura ERP Integration Demo with full visualization suite
3d31baf Initial commit from Create Next App
```

### Uncommitted Changes
- All translation and bug fix changes are uncommitted
- Files ready for commit:
  - `src/app/layout.tsx`
  - `src/app/app/page.tsx`
  - `src/components/graph/NeuralGraph.tsx`
  - `src/components/graph/hooks/usePhysics.ts`
  - `src/data/graph-data.ts`
  - `src/components/tabs/ModelTab.tsx`
  - `src/components/tabs/DemoTab.tsx`
  - `src/components/notebook/Notebook.tsx`
  - `src/components/assistant/ChatInterface.tsx`
  - `src/components/natura-demo/NaturaDemo.tsx`

---

## COMMANDS

```bash
cd ~/Developer/rake-genie
npm run dev      # Start dev server (http://localhost:3001/app)
npm run build    # Build for production (✅ passes)
npm run lint     # Check linting (some warnings remain)
git status       # Check uncommitted changes
```
