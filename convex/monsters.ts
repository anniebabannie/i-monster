import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { MonsterSchema } from "./schema";
import { getCurrentUser } from "./users";

type Monster = {
  scientific:string,
  name:string,
  description:string,
  avgHeight:string,
  diet:string,
  environment:string,
  image:string,
  userId:string,
}

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("monsters").collect();
  },
});

export const getAllWithSuggestions = query({
  args: {},
  handler: async (ctx) => {
    const monsters = await ctx.db.query("monsters").collect();
    const monstersWithSuggestions = await Promise.all(
      monsters.map(async (monster) => {
        const suggestions = await ctx.db
          .query("suggestions")
          .filter((q) => q.eq(q.field("monsterId"), monster._id))
          .collect();
        return { ...monster, suggestions };
      })
    );
    return monstersWithSuggestions;
  },
});

export const getMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    const monsters = await ctx.db
      .query("monsters")
      .filter((q) => q.eq(q.field("userId"), user?.externalId))
      .collect();
    console.log("monsters", monsters);
    return monsters;
  },
});

export const get = query({
  args: { monsterId: v.id("monsters") },
  handler: async (ctx, args) => {
    const monster = await ctx.db.get(args.monsterId);
    const suggestions = await ctx.db
      .query("suggestions")
      .filter((q) => q.eq(q.field("monsterId"), args.monsterId))
      .collect();
    return { ...monster, suggestions: [...suggestions] };
  },
});

export const send = mutation({
  args: { ...MonsterSchema },
  handler: async (ctx, { name, description, avgHeight, diet, environment, userId, image, scientific}:Monster) => {
    const user = await getCurrentUser(ctx);
    console.log(user);
    // Send a new message.
    const monster = await ctx.db.insert("monsters", { 
      name,
      description,
      avgHeight,
      diet,
      environment,
      image,
      userId,
      scientific
    });
    return monster;
  },
});