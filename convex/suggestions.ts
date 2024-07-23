import { mutation, query } from "./_generated/server";
import { SuggestionSchema } from "./schema";
import { getCurrentUser } from "./users";

export const getAll = query({
  args: {},
  handler: async (ctx, { monsterId }: { monsterId:string}) => {
    return await ctx.db
    .query("suggestions")
    .filter((q) => q.eq(q.field("monsterId"), monsterId))
    .collect();
  },
});

export const count = query({
  args: {},
  handler: async (ctx, { monsterId }: { monsterId:string}) => {
    const sugs = await ctx.db
    .query("suggestions")
    .filter((q) => q.eq(q.field("monsterId"), monsterId))
    .collect();
    return sugs.length;
  },
});

export const send = mutation({
  args: { ...SuggestionSchema },
  handler: async (ctx, { suggestion, monsterId, accepted, userId }) => {
    const user = await getCurrentUser(ctx);
    // Send a new message.
    return await ctx.db.insert("suggestions", { 
      suggestion,
      monsterId,
      accepted,
      userId: user?.externalId as string
    });
  },
});