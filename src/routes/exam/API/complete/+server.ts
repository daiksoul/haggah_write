import { json, error } from '@sveltejs/kit';

export async function POST({ request, locals: { supabase, examData, user } }) {
  if (examData != null) {
    examData.completedAt = new Date(Date.now());
  }

  let { error: completeError } = await supabase
    .from("examData")
    .update({
      completed_at: examData?.completedAt
    })
    .eq("id", examData?.id);

  if (completeError) {
    return error(442, { message: `${completeError.cause} : ${completeError.message}` });
  }

  let { error: userError } = await supabase
    .from("users")
    .update({
      active_exam_id: null
    })
    .eq('uid', user?.id);

  if (userError) {
    return error(442, { message: `${userError.cause} : ${userError.message}`, });
  }

  return json({}, { status: 201 });
}
