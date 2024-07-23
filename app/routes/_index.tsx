import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";

export const meta: MetaFunction = () => {
  return [
    { title: "iMonsterist | A community for monster naturalists" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const monsters = useQuery(api.monsters.getAll);
  return (
    <div>
      <h1>Welcome to iMonsterist</h1>
      <p>Record your observations (get a picture of a monster)</p>
      <p>Share with your fellow monsterists</p>
      <p>Discuss your findings</p>
      <hr />
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
