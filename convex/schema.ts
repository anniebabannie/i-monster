import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const MonsterSchema = {
  userId: v.string(),
  name: v.string(),
  description: v.string(),
  avgHeight: v.string(),
  diet: v.string(),
  environment: v.string(),
  image: v.string(),
}

export const SuggestionSchema = {
  userId: v.string(),
  suggestion: v.string(),
  monsterId: v.string(),
  accepted: v.boolean(),
}

export default defineSchema({
  monsters: defineTable(MonsterSchema),
  users: defineTable({
    name: v.string(),
    // this the Clerk ID, stored in the subject JWT field
    externalId: v.string(),
  }).index("byExternalId", ["externalId"]),
});