import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { MonsterSchema } from "./schema";
import { getCurrentUser } from "./users";

type Monster = {
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

export const get = query({
  args: { monsterId: v.id("monsters") },
  handler: async (ctx, args) => {
    const monster = await ctx.db.get(args.monsterId);
    return monster;
  },
});

export const send = mutation({
  args: { ...MonsterSchema },
  handler: async (ctx, { name, description, avgHeight, diet, environment, userId, image}:Monster) => {
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
      userId
    });
    return monster;
  },
});