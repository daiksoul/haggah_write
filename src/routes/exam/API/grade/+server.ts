import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  let _json = await request.json();

  return json({ res: _json }, { status: 201 });
}
