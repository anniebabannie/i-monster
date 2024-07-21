import { useLoaderData } from "@remix-run/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";

export const loader = async ({ params }: { params: { id: string } }) => {
  
  return params.id
}

export default function MonsterPage() {
  const id = useLoaderData();
  const monster = useQuery(api.monsters.get, { monsterId: id as Id<"monsters"> });
  return (
    <h1>
      {monster?.name}
    </h1>
  );
}
