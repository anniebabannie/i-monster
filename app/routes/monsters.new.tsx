import { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useActionData, useNavigation } from "@remix-run/react";
import { api } from "convex/_generated/api";
import { ConvexClient } from "convex/browser";
import { useMutation } from "convex/react";
import { z } from "zod";

export async function action({
  request,
}: ActionFunctionArgs) {
  const client = new ConvexClient(process.env.PUBLIC_CONVEX_URL!);
  const formPayload = Object.fromEntries(await request.formData())
  const monsterSchema = z.object({
    name: z.string(),
    description: z.string(),
    avgHeight: z.string(),
    diet: z.string(),
    environment: z.string(),
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
  // const createMonster = useMutation(api.monsters.send);
  // const { errors } = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting =
    navigation.formAction === "/recipes/new";
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
        <button type="submit">Add Monster</button>
      </Form>
    </>
  );
}