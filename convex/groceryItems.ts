import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const aisle = v.union(
  v.literal("produce"),
  v.literal("dairy"),
  v.literal("pantry"),
  v.literal("bakery"),
  v.literal("frozen"),
  v.literal("other"),
);

const item = v.object({
  _id: v.id("groceryItems"),
  _creationTime: v.number(),
  name: v.string(),
  aisle,
  isCompleted: v.boolean(),
  addedAt: v.number(),
});

export const list = query({
  args: {},
  returns: v.array(item),
  handler: async (ctx) => {
    return await ctx.db.query("groceryItems").order("desc").take(200);
  },
});

export const add = mutation({
  args: { name: v.string(), aisle },
  returns: v.id("groceryItems"),
  handler: async (ctx, args) => {
    const name = args.name.trim().replace(/\s+/g, " ");
    if (!name) throw new Error("Add an item first.");
    if (name.length > 80) throw new Error("Keep item names under 80 characters.");

    return await ctx.db.insert("groceryItems", {
      name,
      aisle: args.aisle,
      isCompleted: false,
      addedAt: Date.now(),
    });
  },
});

export const setCompleted = mutation({
  args: { id: v.id("groceryItems"), isCompleted: v.boolean() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const groceryItem = await ctx.db.get(args.id);
    if (!groceryItem) return null;
    await ctx.db.patch(args.id, { isCompleted: args.isCompleted });
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("groceryItems") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const groceryItem = await ctx.db.get(args.id);
    if (!groceryItem) return null;
    await ctx.db.delete(args.id);
    return null;
  },
});
