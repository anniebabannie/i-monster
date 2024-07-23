import { Link } from "@remix-run/react";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";

export default function MonstersMy() {
  const monsters = useQuery(api.monsters.getMine);
  console.log(monsters);
  return(
    <>
    <h1>My Monsters</h1>
    {monsters === undefined
        ? "loading..."
        : monsters.map((m, i) => {
        return(
          <li key={m._id}>
            <Link to={`/monsters/${m._id}`}>
              <img src={m.image} alt="" />
              {m.name}
            </Link>
          </li>
        )})}
    </>
  )
}