import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const monsters = useQuery(api.monsters.getAll);
  return (
    <div>
      Index
      <p>
      {monsters === undefined
        ? "loading..."
        : monsters.map((m, i) => {
        return(
          <Link key={m._id} to={`/monsters/${m._id}`}>{m.name}</Link>
        )})}
      </p>
    </div>
  );
}
