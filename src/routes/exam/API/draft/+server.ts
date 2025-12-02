import { error, json } from '@sveltejs/kit';

export async function POST({ request, locals: { supabase, user } }) {
  let _json = await request.json();

  if (_json.draft.id == -1) {
    let { id, owner_uid, ...tmp } = _json.draft;

    let { data, error: insertError } = await supabase.from("submitNdraft")
      .insert({ ...tmp, owner_uid: user?.id })
      .select();

    if (insertError) {
      return error(442, { message: insertError.message });
    } else {
      return json({ id: data![0].id, idx: _json.idx }, { status: 201 });
    }
  } else {
    let { id, owner_uid, ...tmp } = _json.draft;
    let { error: updateError } = await supabase.from("submitNdraft")
      .update(tmp)
      .eq("id", id);

    if (updateError) {
      return error(442, { message: updateError.message });
    }
  }

  return json({}, { status: 201 });
}
