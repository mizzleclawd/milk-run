import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  groceryItems: defineTable({
    name: v.string(),
    aisle: v.union(
      v.literal("produce"),
      v.literal("dairy"),
      v.literal("pantry"),
      v.literal("bakery"),
      v.literal("frozen"),
      v.literal("other"),
    ),
    isCompleted: v.boolean(),
    addedAt: v.number(),
  })
    .index("by_isCompleted", ["isCompleted"])
    .index("by_aisle", ["aisle"]),
});
