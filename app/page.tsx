"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, Circle, Plus, Trash2, Wifi } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Aisle = "produce" | "dairy" | "pantry" | "bakery" | "frozen" | "other";

const AISLES: Array<{ value: Aisle; label: string }> = [
  { value: "produce", label: "Produce" },
  { value: "dairy", label: "Dairy & eggs" },
  { value: "bakery", label: "Bakery" },
  { value: "pantry", label: "Pantry" },
  { value: "frozen", label: "Frozen" },
  { value: "other", label: "Household & other" },
];

const aisleLabel = (aisle: Aisle) =>
  AISLES.find((entry) => entry.value === aisle)?.label ?? "Other";

export default function Home() {
  const items = useQuery(api.groceryItems.list);
  const addItem = useMutation(api.groceryItems.add);
  const setCompleted = useMutation(api.groceryItems.setCompleted);
  const removeItem = useMutation(api.groceryItems.remove);

  const [name, setName] = useState("");
  const [aisle, setAisle] = useState<Aisle>("produce");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeItems = items?.filter((item) => !item.isCompleted) ?? [];
  const completedItems = items?.filter((item) => item.isCompleted) ?? [];
  const progress = items?.length
    ? Math.round((completedItems.length / items.length) * 100)
    : 0;

  const grouped = useMemo(
    () =>
      AISLES.map(({ value, label }) => ({
        aisle: value,
        label,
        items: activeItems.filter((item) => item.aisle === value),
      })).filter((group) => group.items.length > 0),
    [activeItems],
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const itemName = name.trim();
    if (!itemName || isSaving) return;

    setIsSaving(true);
    setError(null);
    try {
      await addItem({ name: itemName, aisle });
      setName("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not add that item.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-24 pt-8 sm:pt-12">
      <header className="mb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Milk Run
            </p>
            <h1 className="text-3xl font-bold tracking-tight">The list everybody shares.</h1>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Add something once. Watch it update everywhere. No more “did we already get milk?”
            </p>
          </div>
          <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
            <Wifi className="h-3.5 w-3.5" />
            {items === undefined ? "Connecting" : "Live"}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">
            {completedItems.length}/{items?.length ?? 0} done
          </span>
        </div>
      </header>

      <Card className="mb-6 border-emerald-100">
        <CardContent className="pt-6">
          <form className="space-y-3" onSubmit={submit}>
            <div className="flex gap-2">
              <Input
                aria-label="New grocery item"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Add an item… e.g. milk"
              />
              <Button disabled={!name.trim() || isSaving} type="submit">
                <Plus className="mr-1 h-4 w-4" />
                {isSaving ? "Adding" : "Add"}
              </Button>
            </div>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              Aisle
              <select
                aria-label="Aisle"
                className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground"
                value={aisle}
                onChange={(event) => setAisle(event.target.value as Aisle)}
              >
                {AISLES.map((entry) => (
                  <option key={entry.value} value={entry.value}>
                    {entry.label}
                  </option>
                ))}
              </select>
            </label>
            {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
          </form>
        </CardContent>
      </Card>

      {items === undefined ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Connecting to the shared list…
          </CardContent>
        </Card>
      ) : grouped.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <span className="text-4xl">🛒</span>
            <p className="font-semibold">The run starts here.</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Add the first item and it will appear for everyone sharing this list.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {grouped.map((group) => (
            <section key={group.aisle} aria-label={group.label}>
              <div className="mb-2 flex items-baseline justify-between px-1">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </h2>
                <span className="text-xs text-muted-foreground">{group.items.length} to get</span>
              </div>
              <Card>
                <CardContent className="divide-y p-0">
                  {group.items.map((item) => (
                    <div className="flex items-center gap-3 px-4 py-3" key={item._id}>
                      <button
                        aria-label={`Mark ${item.name} complete`}
                        className="rounded-full text-muted-foreground transition hover:text-emerald-600"
                        onClick={() => void setCompleted({ id: item._id, isCompleted: true })}
                        type="button"
                      >
                        <Circle className="h-5 w-5" />
                      </button>
                      <span className="flex-1 text-sm font-medium">{item.name}</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                        {aisleLabel(item.aisle)}
                      </span>
                      <button
                        aria-label={`Remove ${item.name}`}
                        className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => void removeItem({ id: item._id })}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          ))}
        </div>
      )}

      {completedItems.length > 0 ? (
        <section className="mt-8" aria-label="Picked up">
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Picked up ({completedItems.length})
          </h2>
          <Card>
            <CardContent className="divide-y p-0">
              {completedItems.map((item) => (
                <div className="flex items-center gap-3 px-4 py-3 opacity-65" key={item._id}>
                  <button
                    aria-label={`Put ${item.name} back on the list`}
                    className="rounded-full text-emerald-600"
                    onClick={() => void setCompleted({ id: item._id, isCompleted: false })}
                    type="button"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </button>
                  <span className="flex-1 text-sm font-medium line-through">{item.name}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      ) : null}
    </main>
  );
}
