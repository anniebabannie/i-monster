import { useUser } from "@clerk/clerk-react";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useNavigation } from "@remix-run/react";
import { api } from "convex/_generated/api";
import { ConvexClient } from "convex/browser";
import { useState } from "react";
import { z } from "zod";

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
  const user = useUser();
  // const createMonster = useMutation(api.monsters.send);
  // const { errors } = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting =
    navigation.formAction === "/recipes/new";

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
  }

  return (
    <>
      <h1>
        New Monster
      </h1>
      <Form method="post">
      {/* {errors?.title ? <span>{errors.title}</span> : null} */}
        <label htmlFor="name">
          Name
          <input name="name" />
        </label>
        <label htmlFor="description">
          Description
          <input name="description" />
        </label>
        <label htmlFor="avgHeight">
          Average Height
          <input name="avgHeight" />
        </label>
        <label htmlFor="diet">
          Diet
          <input name="diet" />
        </label>
        <label htmlFor="environment">
          Environment
          <input name="environment" />
        </label>
        {img &&
          <input type="hidden" name="image" value={img}/>
        }
        <input name="userId" value={user.user!.id} />

        <label htmlFor="image">Image
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleImageUpload}>Upload</button>
          {img && <img src={img} alt="" />}
        </label>
        <button type="submit">Add Monster</button>
      </Form>
    </>
  );
}