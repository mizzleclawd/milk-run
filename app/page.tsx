"use client";

import { useMemo, useRef, useState } from "react";
import { CheckCircle2, Circle, Plus, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ── Demo data ────────────────────────────────────────────────────────────────
// Static stand-in for the future Convex `items` table. Shape mirrors what the
// live schema will return so swapping in useQuery later is a drop-in change.

type Aisle =
  | "Produce"
  | "Dairy & Eggs"
  | "Bakery"
  | "Meat & Seafood"
  | "Pantry"
  | "Frozen"
  | "Household";

type Item = {
  id: string;
  name: string;
  aisle: Aisle;
  quantity: number;
  addedBy: string;
  checked: boolean;
};

const AISLES: Aisle[] = [
  "Produce",
  "Dairy & Eggs",
  "Bakery",
  "Meat & Seafood",
  "Pantry",
  "Frozen",
  "Household",
];

const DEMO_ITEMS: Item[] = [
  { id: "i1", name: "Bananas", aisle: "Produce", quantity: 1, addedBy: "Mom", checked: false },
  { id: "i2", name: "Baby spinach", aisle: "Produce", quantity: 2, addedBy: "Dad", checked: true },
  { id: "i3", name: "Strawberries", aisle: "Produce", quantity: 1, addedBy: "Ava", checked: false },
  { id: "i4", name: "Whole milk", aisle: "Dairy & Eggs", quantity: 2, addedBy: "Mom", checked: false },
  { id: "i5", name: "Greek yogurt", aisle: "Dairy & Eggs", quantity: 1, addedBy: "Dad", checked: false },
  { id: "i6", name: "Eggs, dozen", aisle: "Dairy & Eggs", quantity: 2, addedBy: "Mom", checked: true },
  { id: "i7", name: "Sourdough loaf", aisle: "Bakery", quantity: 1, addedBy: "Ava", checked: false },
  { id: "i8", name: "Chicken thighs", aisle: "Meat & Seafood", quantity: 1, addedBy: "Dad", checked: false },
  { id: "i9", name: "Peanut butter", aisle: "Pantry", quantity: 1, addedBy: "Mom", checked: false },
  { id: "i10", name: "Pasta", aisle: "Pantry", quantity: 3, addedBy: "Dad", checked: true },
  { id: "i11", name: "Frozen peas", aisle: "Frozen", quantity: 1, addedBy: "Ava", checked: false },
  { id: "i12", name: "Dish soap", aisle: "Household", quantity: 1, addedBy: "Mom", checked: false },
];

const HOUSEHOLD = ["Mom", "Dad", "Ava"];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [items, setItems] = useState<Item[]>(DEMO_ITEMS);
  const [name, setName] = useState("");
  const [aisle, setAisle] = useState<Aisle>("Produce");
  const [addedBy, setAddedBy] = useState<string>(HOUSEHOLD[0]);
  const [live, setLive] = useState(true); // simulates Convex websocket status
  const idRef = useRef(100);

  const unchecked = items.filter((i) => !i.checked).length;
  const checked = items.length - unchecked;
  const progress = items.length === 0 ? 0 : Math.round((checked / items.length) * 100);

  const grouped = useMemo(() => {
    return AISLES.map((a) => ({
      aisle: a,
      items: items.filter((i) => i.aisle === a),
    })).filter((g) => g.items.length > 0);
  }, [items]);

  function addItem(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setItems((prev) => [
      ...prev,
      {
        id: `i${++idRef.current}`,
        name: trimmed,
        aisle,
        quantity: 1,
        addedBy,
        checked: false,
      },
    ]);
    setName("");
  }

  function toggleItem(id: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-24 pt-8 sm:pt-12">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              🛒 Family Grocery List
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Shared list for the household — everyone sees changes instantly.
            </p>
          </div>
          {/* Realtime indicator: simulates the Convex websocket status pill */}
          <button
            type="button"
            onClick={() => setLive((v) => !v)}
            title="Tap to simulate connection change"
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              live
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                : "border-muted bg-muted text-muted-foreground"
            )}
          >
            {live ? (
              <Wifi className="h-3.5 w-3.5" />
            ) : (
              <WifiOff className="h-3.5 w-3.5" />
            )}
            {live ? (
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Live
              </span>
            ) : (
              "Offline"
            )}
          </button>
        </div>

        {/* Progress */}
        <div className="mt-4 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">
            {checked}/{items.length} done
          </span>
        </div>
      </header>

      {/* Add-item form */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={addItem} className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Add an item… e.g. Apples"
                aria-label="New item name"
                className="flex-1"
              />
              <Button type="submit" disabled={!name.trim()}>
                <Plus className="mr-1 h-4 w-4" />
                Add
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground">Aisle:</span>
              <select
                value={aisle}
                onChange={(e) => setAisle(e.target.value as Aisle)}
                aria-label="Aisle"
                className="rounded-md border border-input bg-background px-2 py-1 text-xs"
              >
                {AISLES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <span className="ml-2 text-muted-foreground">Added by:</span>
              <div className="flex gap-1">
                {HOUSEHOLD.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setAddedBy(m)}
                    className={cn(
                      "rounded-full px-2.5 py-1 font-medium transition-colors",
                      addedBy === m
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Items grouped by aisle */}
      <div className="space-y-5">
        {grouped.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
              <span className="text-3xl">🎉</span>
              <p className="font-medium">List is empty</p>
              <p className="text-sm text-muted-foreground">
                Add an item above to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          grouped.map(({ aisle: a, items: aisleItems }) => (
            <section key={a} aria-label={a}>
              <h2 className="mb-2 flex items-baseline justify-between px-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {a}
                </span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {aisleItems.filter((i) => !i.checked).length} to get
                </span>
              </h2>
              <Card>
                <CardContent className="divide-y p-0">
                  {aisleItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50",
                        item.checked && "opacity-60"
                      )}
                      aria-pressed={item.checked}
                    >
                      {item.checked ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                      ) : (
                        <Circle className="h-5 w-5 shrink-0 text-muted-foreground/40" />
                      )}
                      <span
                        className={cn(
                          "flex-1 text-sm font-medium",
                          item.checked && "line-through text-muted-foreground"
                        )}
                      >
                        {item.name}
                        {item.quantity > 1 && (
                          <span className="ml-1.5 text-xs text-muted-foreground">
                            ×{item.quantity}
                          </span>
                        )}
                      </span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                        {item.addedBy}
                      </span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </section>
          ))
        )}
      </div>

      <footer className="mt-8 text-center text-xs text-muted-foreground">
        {unchecked === 0 && items.length > 0
          ? "All done — great shopping! 🎉"
          : `${unchecked} item${unchecked === 1 ? "" : "s"} left to pick up.`}
      </footer>
    </main>
  );
}
