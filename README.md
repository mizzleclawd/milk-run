# Milk Run

A grocery list your whole house shares, that updates on every phone at the same
time. Paste a recipe link and its ingredients land on the list. No accounts to
argue about, no "did you already get milk" texts.

A milk run is the trip you make without thinking about it. This is the list that
makes it so nobody has to.

Built for the **Convex All Gas Hackathon** — see [`hackathon.md`](./hackathon.md)
for the build log and current status.

## Stack

- [Convex](https://convex.dev) — database, reactive queries, mutations, actions,
  scheduled functions
- [Firecrawl](https://firecrawl.dev) — recipe page scraping
- Next.js 15, React 19, Tailwind, shadcn/ui

## Running it

```bash
npm install
npx convex dev      # starts the backend and generates convex/_generated
npm run dev         # http://localhost:3000
```

`npx convex dev` writes `NEXT_PUBLIC_CONVEX_URL` into `.env.local` for you.
