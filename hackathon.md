# Milk Run — Convex All Gas Hackathon

A grocery list your whole house shares, that updates on every phone at the same
time. Paste a recipe link and its ingredients land on the list. No accounts to
argue about, no "did you already get milk" texts.

Built for the Convex All Gas Hackathon (due 2026-09-22). Entirely agent-built —
the human owner writes no application code.

## Why this shape

Everyday app, not B2B tooling. The demo is two phones side by side: check off
"eggs" on one, watch it disappear on the other. That is Convex's reactive query
model doing the thing it is actually best at, with no polling, no websocket
plumbing, and no cache invalidation written by hand.

## Status

**2026-09-02 — real shared-list loop verified locally.**

Shipped:

- Next.js 16 + Convex scaffold, Tailwind + shadcn UI.
- `convex/schema.ts` — `groceryItems` table.
- `convex/groceryItems.ts` — `list` (reactive query), `add`, `setCompleted`,
  `remove` mutations.
- The browser UI now uses those real Convex functions; static demo data was removed.
- Add, complete, restore, and remove all write through Convex.
- Local Convex deployment verified with a real `Milk` mutation followed by a
  `groceryItems.list` query returning the new document.
- `npm run build` passes clean: typecheck plus production Next build.

Not shipped yet — described here as planned, not done:

- Recipe URL -> Firecrawl scrape -> OpenAI ingredient extraction -> merged into the list.
- Near-duplicate merge, so "milk" and "2% milk" do not both sit on the list.
- Fridge photo -> AI restock suggestions.
- AgentMail intake or a weekly household reminder.
- Public deployment. The build currently runs against a local Convex backend;
  a cloud deployment is pending account linkage.

## Stack

- **Convex** — database, reactive queries, mutations, actions, scheduled functions.
- **Firecrawl** — recipe page scraping. `rawHtml` format, not `markdown`: markdown
  strips the markup that structured extraction depends on. That was measured on a
  purpose-built testbed of broken pages during an earlier spike, with a known-good
  control page to prove the detector does not just fire on everything.
- **Next.js 15 / React 19 / Tailwind / shadcn** — client.

## Build log

**2026-08-30** — Project started. Chosen over a B2B alternative on one criterion:
would a normal person open this during a normal week.

**2026-09-01** — Scaffold committed. Convex schema and the four grocery-list
functions written and running. Build verified. Repository published.

## Honesty note

This file is written from what is running, not from what is planned. Anything
above marked "not shipped yet" has no code behind it at the time of writing.
Sections get moved from planned to shipped only after the feature runs.
