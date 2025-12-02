import { completeExam, getExamData } from '$lib/exam_state.svelte';
import { json, error } from '@sveltejs/kit';

export async function POST({ request, locals: { supabase } }) {
  completeExam();

  let { error: completeError } = await supabase
    .from("examData")
    .update({
      completed_at: getExamData()?.completedAt
    })
    .eq("id", getExamData()?.id);

  if (completeError) {
    return error(442, { message: completeError.message });
  }

  return json({}, { status: 201 });
}
