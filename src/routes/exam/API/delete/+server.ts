import { getExamData } from '$lib/exam_state.svelte';
import type { ExamData } from '$lib/model/exam_data';
import { supabase } from '$lib/supabaseclient.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ request }) {
  let examData: ExamData | null = getExamData();
  if (examData == null) return json({});
  let _json = await request.json();

  let { data: draftQueryData, error: draftQueryError } = await supabase.from("submitNdraft")
    .select("id, eval")
    .eq("id", _json.id)
    .single();

  if (draftQueryError) {
    return error(442, {
      message: draftQueryError.message
    });
  }

  if (draftQueryData?.eval != 0) {
    return error(442, {
      message: '이미 제출된 항목은 삭제할 수 없습니다'
    });
  }

  let { error: deleteError } = await supabase
    .from("submitNdraft")
    .delete()
    .eq("id", _json.id);

  if (deleteError) {
    console.log(deleteError)
    return error(442, {
      message: deleteError.message
    });
  }

  return json({}, { status: 201 });
}
