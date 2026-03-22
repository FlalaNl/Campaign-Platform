# Campaign Platform

Campaign Platform is a **local-first, extensible campaign management platform** for tabletop RPGs and long-running narrative projects.

The long-term goal is to provide a structured system for managing:

- campaign time and calendars
- events and timelines
- characters and their histories
- homebrew content
- locations, factions, and threads
- import/export workflows
- future plugins and extensions

## Current focus

The first implemented vertical slice is:

**Event & Timeline Module v0.1**

This module focuses on one problem:

> reliably tracking what happened, when it happened, who was involved, and which events are still ongoing.

It is intentionally narrow in scope, but it is designed as the first module of a broader platform.

---

## Vision

This project is **not** intended to become just another note-taking app or calendar widget.

It is intended to become a **campaign platform** with:

- a durable domain model
- portable data
- strong time/event relationships
- a modular architecture
- room for future character imports, homebrew tracking, and plugins

The guiding principle is:

**design wide, build narrow**

---

## Core principles

### Local-first
The app must work fully offline and without requiring a hosted backend.

### Open data
Data must not be trapped inside a closed format. Import and export are first-class features.

### Platform, not one-off app
The architecture must support future modules beyond events.

### Modular
New modules such as Characters, Homebrew, Sessions, and Plugins must be addable without breaking the core.

### Server-capable
The first release is local-first, but the architecture must allow a future migration to a server/API/web setup.

### Obsidian-agnostic
Obsidian may become an export target or integration point, but it is not the foundation of the platform.

### Codex-friendly
Documentation, structure, and implementation boundaries should support effective development with Codex.

---

## v0.1 scope

The first release is limited to **Event & Timeline Management**.

### In scope

- campaign current day
- explicit day records
- day summaries and notes
- single-day events
- multi-day events
- ongoing events without an end date
- linking multiple characters to an event
- per-character event timelines
- day overview and active-event views
- JSON import/export
- native SQLite snapshot export

### Out of scope for v0.1

- full character management
- homebrew authoring
- statblocks
- maps
- sync/collaboration
- mobile support
- plugin SDK
- automation engine
- user accounts
- cloud-only workflows

---

## Key requirements for Event Module v0.1

The app must be able to answer these questions:

- What happened on day X?
- Which events were active on day X?
- Which events has character Y experienced?
- Which characters were involved in event Z?
- Which events are still ongoing?
- Which events started today?
- Which events ended today?

---

## Temporal model

Time is modeled internally using:

`day_index: integer`

This is the source of truth for all timeline behavior.

Examples:

- **single-day event**: start = 12, end = 12
- **multi-day event**: start = 20, end = 25
- **ongoing event**: start = 40, end = null, state = ongoing

An event is considered active on day `X` if:

- `start_day_index <= X`
- and (`end_day_index is null` or `end_day_index >= X`)
- and `temporal_state != cancelled`

This model is intentionally simple, portable, and extensible.

---

## Planned architecture

The project should be implemented as a **monorepo** with separated layers.

### High-level layers

- **Domain**: pure business types and rules
- **Application**: use cases and workflows
- **Persistence**: database schema, migrations, repositories
- **Interface**: desktop UI
- **Integration**: import/export and external adapters

### Planned stack

- **Desktop shell**: Tauri
- **Frontend**: React + TypeScript
- **Primary datastore**: SQLite
- **ORM / schema tooling**: Drizzle
- **Validation**: Zod

These are implementation choices, not product constraints. The architecture should remain adaptable.

---

## Planned repository structure

```text
campaign-platform/
  apps/
    desktop/

  packages/
    domain/
    application/
    db/
    schemas/
    import-export/
    shared/

  docs/
    platform-brief.md
    event-module-spec-v0.1.md
    implementation-brief-v0.1.md
Data philosophy

The app should treat data portability as a core requirement.

Native format

A local SQLite database is the primary datastore for v0.1.

Portable export

The platform must support a versioned JSON export format.

Future export targets

Later versions may support export to:

CSV
Markdown
Obsidian-friendly structures
external APIs or adapters

The user must always be able to move their data elsewhere.

Future platform direction

The event module is only the first slice.

Planned future directions include:

Character Module
Homebrew Module
Session Module
World/Location/Faction/Thread modules
Plugin system
Importers/exporters for external tools
optional server/API deployment

The architecture must support these expansions without requiring a rebuild from scratch.

Current status

This repository is currently in the design and architecture phase.

The implementation is expected to start from the Event Module v0.1 specification and corresponding implementation brief.

Before implementation begins, the following documents should exist and remain aligned:

docs/platform-brief.md
docs/event-module-spec-v0.1.md
docs/implementation-brief-v0.1.md

A future AGENTS.md file should define repository-specific working rules for Codex.

Development approach

Implementation should proceed in this order:

establish domain types and rules
define database schema and migrations
implement repositories
implement application use cases
build read models for day overview and character timeline
add JSON import/export
build the first desktop UI flows

The goal is to keep business logic independent from UI and storage details.

Initial success criteria

The first release is successful if it can reliably support:

creating a campaign
setting and advancing the current day
creating explicit day records
creating single-day, multi-day, and ongoing events
attaching multiple characters to events
viewing a day overview
viewing a character timeline
identifying active events
exporting and importing data without lock-in
License

TBD

Notes for future contributors and agents

This repository should be treated as:

domain-first
modular
local-first
import/export-first
server-capable
plugin-ready

When in doubt, prefer decisions that preserve:

data portability
separation of concerns
extensibility
clear domain boundaries
