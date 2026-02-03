# 3D Fridge — Interactive 3D Pantry Experiment

## What This Is

A standalone experimental project to build a **3D interactive fridge and pantry cabinet** that we can eventually integrate into the main Pantry app. The idea: a realistic 3D fridge you can open, and food items (3D models) sit on the shelves. You can add, remove, and update items — and see them appear as actual 3D objects inside the fridge.

This folder is a playground to figure out the tech, test performance, and prototype the experience before touching the main app.

## The Vision

- A 3D fridge model with a door that swings open (click or drag)
- Shelves inside where 3D food models sit (milk carton, tomatoes, eggs, etc.)
- A pantry cabinet next to it (or below) for dry goods (pasta box, spice jars, canned goods)
- **Add an item** → pick a category → a 3D model appears on the correct shelf
- **Remove an item** → click it → it animates out (falls, fades, or slides off)
- **Update an item** → click to edit quantity, expiry → visual indicator changes (e.g. item glows red when expired)
- Camera controls: rotate around the fridge, zoom in/out
- Works on both **web** (desktop with mouse orbit) and **mobile** (touch to rotate, tap to interact)

## Examples of What We Want

- Open the fridge door → see shelves with items
- Tap "Add Item" → select "Milk" → a milk carton model slides onto the dairy shelf
- Tap a tomato on the vegetable shelf → edit popover appears → change quantity or delete it
- Items expiring soon glow orange, expired items glow red
- Drag to rotate the fridge and see it from different angles
- On mobile: swipe to rotate, tap to open door, tap items to interact

## Tech Stack (Planned)

| Tool | Purpose |
|------|---------|
| **React Three Fiber** (`@react-three/fiber`) | React renderer for Three.js — our 3D engine |
| **Drei** (`@react-three/drei`) | Helpers: orbit controls, environment lighting, GLTF loader, HTML overlays |
| **Three.js** | Underlying 3D library (WebGL) |
| **GLTF/GLB models** | 3D food item models (lightweight, web-optimized) |
| **Next.js** | Same framework as main app, so integration is seamless |

## Where to Get 3D Food Models

| Source | Type | Notes |
|--------|------|-------|
| [Poly Pizza](https://poly.pizza) | Free low-poly | Great for stylized/cartoon look, lots of food items |
| [Sketchfab](https://sketchfab.com) | Free + Paid | Realistic and stylized, downloadable as GLB |
| [Meshy.ai](https://meshy.ai) | AI-generated | Text-to-3D: type "milk carton" → get a 3D model |
| [Tripo3D](https://tripo3d.ai) | AI-generated | Similar to Meshy, good for quick prototyping |
| [Spline](https://spline.design) | Design tool | Design your own 3D models in browser, export as GLB |
| Fiverr / freelance | Custom | Commission a 3D artist to make a food pack (~$50-150 for 20-30 items) |

## Models We Need (Starter Set)

**Fridge:**
- Milk carton / bottle
- Egg carton
- Yogurt cup
- Cheese block / wedge
- Butter
- Apple, banana, orange, berries
- Tomato, carrot, lettuce, onion
- Juice bottle
- Chicken breast (wrapped)
- Fish fillet (wrapped)
- Generic container / tupperware

**Freezer:**
- Frozen bag (peas, berries)
- Ice cream tub
- Frozen pizza box

**Pantry Cabinet:**
- Rice bag / box
- Pasta box
- Cereal box
- Canned goods (generic can)
- Spice jar
- Oil bottle
- Sauce bottle
- Bread loaf
- Snack bag (nuts, chips)
- Chocolate bar

**Total: ~30 models** to cover the basics. Can use a "generic box" or "generic bag" fallback for items without a specific model.

## Key Questions to Figure Out

1. **Art style** — Realistic or low-poly/stylized? Low-poly is lighter, loads faster, and looks more cohesive. Realistic is impressive but heavy.
2. **Performance** — How many 3D models can we render before it gets slow? Need to test on mobile. May need LOD (level of detail) or instancing.
3. **Item placement** — Grid snapping? Physics-based? Pre-defined slots per shelf? Grid snapping is simplest and most predictable.
4. **Camera** — Free orbit or constrained? Probably constrained (can't go behind the wall, limited zoom range).
5. **Mobile** — Touch controls for orbit, tap for interaction. Need to make sure it doesn't conflict with page scroll.
6. **Integration** — Eventually this becomes a component in the main app: `<Fridge3DScene items={pantryItems} onAdd={...} onRemove={...} onUpdate={...} />`. Shares the same data/state as the card-based view.

## Folder Structure (Planned)

```
3d-fridge/
├── README.md              ← this file
├── models/                ← GLB/GLTF 3D model files
│   ├── fridge.glb
│   ├── cabinet.glb
│   ├── foods/
│   │   ├── milk.glb
│   │   ├── tomato.glb
│   │   ├── eggs.glb
│   │   └── ...
├── src/
│   ├── scene.tsx          ← main 3D scene (fridge + cabinet + items)
│   ├── fridge.tsx         ← fridge model + door animation
│   ├── cabinet.tsx        ← cabinet model + door animation
│   ├── food-item.tsx      ← individual food item component (loads GLB, handles click)
│   ├── shelf.tsx          ← shelf with item placement logic
│   ├── controls.tsx       ← camera orbit + zoom constraints
│   ├── ui-overlay.tsx     ← HTML overlay for add/edit UI (floating over 3D scene)
│   └── types.ts           ← shared types
├── page.tsx               ← test page to render the scene standalone
└── notes.md               ← ongoing notes, findings, performance benchmarks
```

## The Plan

1. **Phase 1 — Setup & Fridge Model**
   - Install React Three Fiber + Drei
   - Get or create a fridge 3D model (GLB)
   - Render it in a scene with basic lighting and orbit controls
   - Animate the door open/close on click

2. **Phase 2 — Food Models**
   - Source 5-10 food models (start with common items)
   - Place them on shelves inside the fridge
   - Click to select an item → show info overlay

3. **Phase 3 — CRUD**
   - Add item: select from list → model appears on shelf with animation
   - Remove item: click → confirm → model animates out
   - Update item: click → edit overlay → changes reflected (quantity label, expiry glow)

4. **Phase 4 — Cabinet**
   - Add pantry cabinet model
   - Same interaction pattern as fridge
   - Place dry goods models on shelves

5. **Phase 5 — Polish & Performance**
   - Test on mobile (touch controls, performance)
   - Add environment map / better lighting
   - Loading states (suspense boundaries)
   - Optimize model sizes (draco compression)

6. **Phase 6 — Integration**
   - Wrap as a reusable component
   - Connect to main app's pantry data/state
   - Add toggle: card view ↔ 3D view
   - Ship it

## Integration with Main App

The main Pantry app (`/pantry` page) will keep the **card-based shelf view** as the default — it's practical, fast, and accessible. The 3D view will be an optional mode:

```
/pantry           → card-based view (default, what we have now)
/pantry?view=3d   → 3D fridge view (once ready)
```

Or a toggle button on the page: `[List View] [3D View]`

Both views share the same data. When you add a tomato in the 3D view, it shows up in the card view too.

## Notes

- Keep models under **500KB each** (ideally under 200KB). Use Draco compression.
- Target **30fps minimum on mobile**, 60fps on desktop.
- Start ugly, get it working, then make it pretty.
- This is a learning/exploration project — expect lots of iteration.
