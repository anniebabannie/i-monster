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
  if (!monster) return "loading...";
  return (
    <div>
      <h1>{monster.name}</h1>
      <img src={monster.image} alt="" />
      <p>{monster.description}</p>
    </div>
  );
}
