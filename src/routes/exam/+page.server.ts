import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import type { SubmitNDraft } from '$lib/model/submit_n_draft.js';

export const load: PageServerLoad = async ({ locals: { supabase, examData } }) => {
  let { data: timerData, error: timerError } = await supabase
    .from("examData")
    .select("time_left")
    .eq("id", examData?.id)
    .single();

  if (!timerError && examData != null) {
    console.log(timerData?.time_left);
    examData.timeLeft = timerData!.time_left;
  }

  let multiVersePromise = supabase
    .from("multiVerses")
    .select("id, book, chapter, verses")
    .eq("collection_id", examData?.collectionId).then(({ data, error }) => {
      return {
        data: data?.map((e) => {
          //console.log(e.verses);
          return {
            id: e.id,
            book: e.book,
            chapter: e.chapter,
            verses: e.verses,
          }
        }) ?? null,
        error: error
      }
    });

  let submitNdraftPromise = supabase
    .from("submitNdraft")
    .select<'submitNdraft', SubmitNDraft>()
    .eq('exam_id', examData?.id).order("created_at", { ascending: true }).then(({ data, error }) => {
      return {
        data: data?.map((e) => {
          return {
            id: e.id,
            created_at: e.created_at,
            updated_at: e.updated_at,
            owner_uid: e.owner_uid,
            exam_id: e.exam_id,
            multiverse_id: e.multiverse_id,
            address: e.address,
            content: e.content,
            submit_count: e.submit_count,
            eval: e.eval,
            res: e.res,
          }
        }),
        error: error
      }
    });

  let dummyTimeout = new Promise<void>(resolve => setTimeout(() => resolve(), 1));

  return {
    data: multiVersePromise,
    examData: examData,
    submitNdraft: submitNdraftPromise,
    end: await dummyTimeout
  }
}

export const actions = {
  updateTimer: async ({ request, locals: { supabase, examData } }) => {
    let data = await request.formData();

    let timeLeft = parseInt(data.get("timeLeft") as string);

    if (examData != null) {
      examData.timeLeft = timeLeft;
    }

    let { error: updateError } = await supabase
      .from("examData")
      .update({ time_left: timeLeft })
      .eq("id", examData?.id);

    if (updateError) {
      console.log(updateError.message);
      return fail(442, { error: updateError.message });
    }

    return {}
  }
}
