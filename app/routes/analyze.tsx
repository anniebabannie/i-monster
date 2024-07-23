import { ActionFunctionArgs, json } from "@remix-run/node";
import { analyzeMonster } from "~/utils";

export async function action({ request }: ActionFunctionArgs) {
  const blob = await request.blob();
  if (!blob) {
    return new Response(
      JSON.stringify({ error: 'Missing URL parameter' }),
      { status: 400 }
    );
  }

  const monster = await analyzeMonster(blob);
  // const image = `https://fly.storage.tigris.dev/${process.env.BUCKET_NAME}/${filename}`;
  return json({ monster });
}