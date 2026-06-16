# START_HERE — STAI ⇒ UPENN

## Purpose
This is the deterministic entry point for the STAI ⇒ UPENN repository.

Every human, model, tool, or local runtime starts here before touching product logic.

## Product Identity
**STAI** means **Student Transition Adaptive Intelligence**.

**STAI ⇒ UPENN** is the first transition destination build.

- Student: Gabby
- Destination: University of Pennsylvania
- Class: 2030
- Primary transition: high school graduate ⇒ university student
- Family transition: parent proximity ⇒ distance-supported coordination

## Required Read Order
Read files in this order:

1. `START_HERE.md`
2. `CURRENT_STATE.json`
3. `ACTIVE_MISSION.md`
4. `WORKFLOW_INDEX.md`
5. `docs/STAI_UPENN_SCOPE.md`
6. `runtime/dashboard_runtime.md`
7. `reports/WIRING_AUDIT.md`

## Runtime Rule
The app is not considered wired because screens exist.

The app is wired only when dashboard elements map to:

```txt
source/data file → runtime rule → component behavior → output/report → approval state
```

## Current Build Surface
The existing AI Studio React app remains the visual application surface.

The reconstruction objective is to preserve that app while adding the operating structure required for STAI-D and STAI-C to become reviewable, testable, and portable into a sovereign desktop environment.

## Repository Layers
```txt
START_HERE.md        Entry point
CURRENT_STATE.json   Current truth snapshot
ACTIVE_MISSION.md    Current build objective
WORKFLOW_INDEX.md    Work movement rules

docs/                Product meaning and scope
data/                Portable seed truth
commands/            Human-readable execution commands
runtime/             Runtime behavior rules
reports/             Wiring, build, readiness, and gap reports
approval/            Review and promotion records
src/                 React application
```

## Non-Negotiable Rule
Hardcoded prototype data may exist temporarily, but durable product truth must move toward `/data` and runtime behavior must be documented in `/runtime`.

## Current Mission
Reconstruct STAI-UPENN from AI Studio prototype into a structured transition runtime that can be pulled locally, tested, corrected, and reviewed by Adrian.
