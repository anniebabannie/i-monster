import { useUser } from "@clerk/clerk-react";
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "iMonsterist | A community for monster naturalists" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [suggestingFor, setSuggestingFor] = useState<string | null>(null);
  const monsters = useQuery(api.monsters.getAllWithSuggestions);
  const makeSuggestion = useMutation(api.suggestions.send);
  const user = useUser();

  const handleSuggestion = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const suggestion = formData.get('suggestion') as string;
    const monsterId = formData.get('monsterId') as Id<"monsters">;
    const userId = formData.get('userId') as string;

    await makeSuggestion({ suggestion, monsterId, accepted: false, userId });
    setSuggestingFor(null);
  }
  return (
    <div>
      <h1>Explore all monster observations</h1>
      <ul className="grid grid-cols-3 gap-3 mt-8">
      {monsters === undefined
        ? "loading..."
        : monsters.map((m, i) => {
        return(
          <li key={m._id} className="flex flex-col min-h-96 justify-between">
            <Link to={`/monsters/${m._id}`}>
              <h2>{m.name}</h2>
            </Link>
            {m.suggestions.length} suggestions
            <img src={m.image} alt="" />
            {suggestingFor !== m._id &&
              <button className="btn" onClick={() => setSuggestingFor(m._id)}>Suggest an ID</button>
            }
            {suggestingFor === m._id && 
              <form onSubmit={handleSuggestion} className="flex flex-col gap-3">
                <input className="block w-full" placeholder="Your suggestion..." type="text" name="suggestion"/>
                <input type="hidden" defaultValue={m._id} name="monsterId" />
                <input name="userId" type="hidden" value={user.user!.id as string} />
                <div className="flex gap-3">
                  <button type="submit" className="btn">Submit</button>
                  <button type="submit" className="btn-secondary" onClick={() => setSuggestingFor(null)}>Cancel</button>
                </div>
              </form>
            }
          </li>
        )})}
      </ul>
    </div>
  );
}
