import { useUser } from "@clerk/clerk-react";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useNavigation } from "@remix-run/react";
import { api } from "convex/_generated/api";
import { ConvexClient } from "convex/browser";
import { useState } from "react";
import { z } from "zod";
import { analyzeMonster } from "~/utils";

export async function action({
  request,
}: ActionFunctionArgs) {
  const client = new ConvexClient(process.env.PUBLIC_CONVEX_URL!);
  let formPayload = Object.fromEntries(await request.formData())
  console.log(formPayload);

  const monsterSchema = z.object({
    name: z.string(),
    description: z.string(),
    avgHeight: z.string(),
    diet: z.string(),
    environment: z.string(),
    image: z.string(),
    userId: z.string(),
  })
  
  try {
    const newMonster = monsterSchema.parse(formPayload);
    const monsterId = await client.mutation(api.monsters.send, newMonster);

    console.log(monsterId);
    return redirect(`/monsters/${monsterId}`);

  } catch (error) {
    return json({ error });
  }
}

export default function MonstersNew() {
  const [file, setFile] = useState<File>();
  const [img, setImg] = useState<string>();
  const [analysis, setAnalysis] = useState();
  const user = useUser();
  // const createMonster = useMutation(api.monsters.send);
  // const { errors } = useActionData<typeof action>();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('image', file as Blob);
    const resp = await fetch(`http://localhost:5173/upload`, {
      method: "POST",
      body: file,
    })
    
    const response = await resp.json();
    setImg(response.image);
    const analysisResp = await fetch(`http://localhost:5173/analyze`, {
      method: "POST",
      body: file,
    })
    const res = await analysisResp.json();
    const analysis = JSON.parse(res.monster)
    console.log(analysis);
    setAnalysis(analysis);
  }

  return (
    <>
      <h1>
        New Monster
      </h1>
      <div className="flex gap-4">
        <Form method="post" className="grid grid-flow-row max-w-xl gap-4">
        {img &&
            <input type="hidden" name="image" value={img}/>
          }
          <label htmlFor="image">Image
            <div className="flex">
              <input type="file" onChange={handleFileChange} />
              <button className="btn-secondary" onClick={handleImageUpload}>Upload</button>
            </div>
            {img && <img src={img} alt="" />}
          </label>
        {/* {errors?.title ? <span>{errors.title}</span> : null} */}
          <label htmlFor="name">
            Name
            <input type="text" name="name" />
          </label>
          <label htmlFor="description">
            Description
            <input type="text" name="description" />
          </label>
          <label htmlFor="avgHeight">
            Average Height
            <input type="text" name="avgHeight" />
          </label>
          <label htmlFor="diet">
            Diet
            <input type="text" name="diet" />
          </label>
          <label htmlFor="environment">
            Environment
            <input type="text" name="environment" />
          </label>
          
          <input type="hidden" name="userId" value={user.user!.id} />
          <button type="submit" className="btn">Add Monster</button>
        </Form>
        <div className="max-w-lg">
          <h2>Possible ID:</h2>
          {analysis &&
            <div className="flex flex-col gap-2 text-gray-500 italic">
              <p><strong>Name:</strong> {analysis.name}</p>
              <p><strong>Description:</strong> {analysis.description}</p>
              <p><strong>Average Height:</strong> {analysis.avgHeight}</p>
              <p><strong>Diet:</strong> {analysis.diet}</p>
              <p><strong>Environment:</strong> {analysis.environment}</p>
              {/* <button className="btn" onClick={acceptID}>Accept ID</button> */}
            </div>
          }
        </div>
      </div>
    </>
  );
}