import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { MonsterSchema } from "./schema";

type Monster = {
  name:string,
  description:string,
  avgHeight:string,
  diet:string,
  environment:string,
}

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("monsters").collect();
  },
});

export const get = query({
  args: { monsterId: v.id("monsters") },
  handler: async (ctx, args) => {
    const monster = await ctx.db.get(args.monsterId);
    return monster;
  },
});

export const send = mutation({
  args: { ...MonsterSchema },
  handler: async (ctx, { name, description, avgHeight, diet, environment}:Monster) => {
    // Send a new message.
    await ctx.db.insert("monsters", { name, description, avgHeight, diet, environment });
  },
});