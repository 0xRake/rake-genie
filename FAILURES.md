# FAILURE LOG
## Errors, Mistakes, and Corrections

**Purpose:** Track failures so we don't repeat them. Every error is a learning opportunity.

---

## ERROR LOG

### Error #1: useRef Type Error
**Date:** Earlier session
**File:** `src/components/graph/hooks/useCamera.ts`
**Error Message:**
```
Type error: Expected 1 arguments, but got 0.
const cameraUpdateTimeoutRef = useRef<number>();
```
**Root Cause:** React 18 strict typing requires explicit initialization for useRef
**Fix Applied:** Changed to `useRef<number | undefined>(undefined)`
**Prevention:** Always initialize useRef with explicit value in React 18+

---

### Error #2: Tab Type Not Exported
**Date:** Earlier session
**File:** `src/app/app/page.tsx`
**Error Message:**
```
Type error: Module '"@/store/app-store"' declares 'Tab' locally, but it is not exported.
```
**Root Cause:** Tab type was defined but not exported from store
**Fix Applied:** Added `export` keyword: `export type Tab = ...`
**Prevention:** Export all types that are used in other files

---

### Error #3: Input Prefix Type Conflict
**Date:** Earlier session
**File:** `src/components/ui/Input.tsx`
**Error Message:**
```
Type error: Interface 'InputProps' incorrectly extends interface 'InputHTMLAttributes'
```
**Root Cause:** `prefix` is a reserved property in HTML input attributes
**Fix Applied:** Used `Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'>`
**Prevention:** Check for reserved property names when extending HTML attributes

---

### Error #4: `widow` Typo
**Date:** Nov 26, 2025 - This session
**File:** `src/components/graph/NeuralGraph.tsx`
**Error Message:**
```
Cannot find name 'widow'. Did you mean 'window'?
```
**Root Cause:** Typo in code
**Fix Applied:** Changed `widow` to `window`
**Prevention:** Run linter before committing

---

### Error #5: Nodes Clustering in Upper-Right
**Date:** Earlier session
**Issue:** All nodes bunched up in one corner
**Root Cause:** 
- Initial spread too small (200 units)
- Anchors not balanced
- Camera too close
**Fix Applied:**
- Balanced anchor positions in anchors.ts
- Adjusted physics constants
**Status:** Partially resolved - required multiple iterations

---

### Error #6: Nodes Flying Apart / Exploding
**Date:** Earlier session
**Issue:** Nodes escaped to infinity
**Root Cause:**
- Spread increased to 500 (too large)
- Initial velocity 2.0 (too strong)
- Repulsion force 20000 (too strong)
- No spatial bounds
**Fix Applied:**
- Reverted spread to 200
- Removed initial velocity
- Reduced repulsion to 15000
- Eventually settled on 0.006/0.003 anchor strength
**Lesson:** Small incremental changes, not large swings

---

### Error #7: StaticCortex Lobes Misaligned with Nodes
**Date:** Nov 26, 2025 - This session
**Issue:** Background brain lobes stayed fixed while nodes moved with camera
**Root Cause:** StaticCortex used static screen-space positions, not 3D world coordinates
**Fix Applied:**
- Rewrote StaticCortex to use `project3D()` with camera
- Now lobes are positioned at GROUP_ANCHORS and projected with same camera
**Prevention:** Background elements that need to align with 3D objects must use same projection

---

### Error #8: Camera FOV Too Narrow
**Date:** Nov 26, 2025 - This session
**Issue:** Graph elements cut off at edges
**Root Cause:** FOV 1000 not wide enough for anchors spread ±400 units
**Fix Applied:** Increased FOV to 2000, z to -700
**Prevention:** FOV must account for full extent of 3D scene

---

## PATTERNS TO AVOID

### 1. Large Physics Changes
**Bad:** Spread 200 → 500, velocity 0 → 2.0
**Good:** Spread 200 → 250 → 300, velocity 0 → 0.5 → 1.0
**Why:** Physics systems are chaotic - small changes can cause big problems

### 2. Static Background for 3D Scene
**Bad:** `lobes = [{ x: centerX, y: centerY - 200 }]` (screen space)
**Good:** `lobes = [{ ...GROUP_ANCHORS.aip }]` + project3D (world space)
**Why:** Must use same coordinate system as nodes

### 3. Camera Assumptions
**Bad:** FOV 1000 works for everything
**Good:** Calculate FOV based on scene extent: `FOV = 2 * distance * tan(desired_angle)`
**Why:** Different scenes need different camera settings

---

## RECOVERY PROCEDURES

### If Build Fails
1. Run `npm run build 2>&1 | grep -E "error|Error"` to find errors
2. Check this file for similar errors
3. Apply known fixes
4. If new error, add to this log

### If Graph Visualization Broken
1. Clear browser cache: `localStorage.removeItem('kg-camera')`
2. Hard refresh: Cmd+Shift+R
3. Check console for errors
4. Verify camera values: `JSON.parse(localStorage.getItem('kg-camera'))`

### If Nodes Misbehaving
1. Check physics constants in usePhysics.ts
2. Check anchor positions in anchors.ts
3. Check spread/velocity in NeuralGraph.tsx initialization
4. Make SMALL changes, test each one

---

## SUCCESS RECOVERIES

### Build Fixed After Errors - Foundation Layer
- **Session:** Earlier
- **Errors Fixed:** 3 (useRef, Tab export, Input prefix)
- **Build Status:** ✅ SUCCESSFUL

### Graph Visualization Stabilized
- **Session:** Nov 26, 2025
- **Issues Fixed:** Clustering, flying apart, misaligned lobes
- **Iterations:** ~10 rounds of adjustments
- **Final Values:** spread 200, anchor 0.006/0.003, FOV 2000, z -700

---

## LESSONS LEARNED

1. **Test incrementally** - Build after each major change
2. **Small physics changes** - Systems are chaotic
3. **Same coordinate system** - Background must match foreground
4. **Camera matters** - FOV and position critical for visibility
5. **Clear cache** - localStorage can persist old camera settings
