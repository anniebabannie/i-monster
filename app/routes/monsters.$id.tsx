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
  console.log(monster);
  if (!monster) return "loading...";
  console.log(monster);
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <img src={monster.image} alt={monster.description} className="w-full" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <h1>{monster.name}</h1>
            {monster.scientific &&
              <small className="text-gray-600 text-base italic">({monster.scientific})</small>
            }
          </div>
          <p>{monster.description}</p>
          <p><strong>Average Height: {monster.avgHeight}</strong></p>
          <p><strong>Diet:</strong> {monster.diet}</p>
          <p><strong>Environment:</strong> {monster.environment}</p>
          {monster.suggestions.length > 0 &&
          <>
            <h3>Suggested IDs:</h3>
            <ul>
              {monster.suggestions.map((s) => (
                <li key={s._id}>
                  {s.suggestion} by {s.userId}
                </li>
              ))}
            </ul>
          </>
          }
        </div>
      </div>
    </div>
  );
}
