import { getExamData, setExamData, setExamDataDb } from '$lib/exam_state.svelte.js';
import * as gd from '$lib/server/grading.js';
import { supabase } from '$lib/supabaseclient.js';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { getCurrentUser } from '$lib/auth_state.svelte.js';
import type { SubmitNDraft } from '$lib/model/submit_n_draft.js';

export const load: PageServerLoad = async ({ }) => {
  let examData = getExamData();

  let { data: timerData, error: timerError } = await supabase
    .from("examData")
    .select("time_left")
    .eq("id", examData?.id)
    .single();

  if (!timerError && examData != null) {
    console.log(timerData?.time_left);
    examData.timeLeft = timerData!.time_left;
    setExamData(examData!);
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
  submit: async ({ request }) => {
    const data = await request.formData();

    //consoleonsole.log(data);
    const multiVerseId = parseInt(data.get('multiverse_id') as string);
    const book = parseInt(data.get('book') as string);
    const chapter = parseInt(data.get('chapter') as string);
    const verses = (data.get('verses') as string).split(',').map((e) => parseInt(e));
    const submitted = data.get('content') as string;

    try {
      const { res, status } = await gd.grade({
        id: 0,
        book,
        chapter,
        verses,
      }, submitted, getExamData());

      const { error: submissionerror } = await supabase
        .from("submission")
        .insert({
          owner_uid: getCurrentUser()?.id,
          exam_id: getExamData()?.id,
          multiverse_id: multiVerseId,
          submission: submitted,
          eval: status,
        });

      if (!submissionerror) {
        return {
          result: res,
          status: status
        };
      } else {
        return fail(442, {
          result: res,
          error: submissionerror.message,
        });
      }

    } catch (error: any) {
      console.log(error.message);
      return fail(442, {
        error: error.message
      });
    }
  },

  updateTimer: async ({ request }) => {
    let data = await request.formData();

    let timeLeft = parseInt(data.get("timeLeft") as string);

    let examData = getExamData();
    if (examData != null) {
      examData.timeLeft = timeLeft;
      setExamData(examData);
    }

    let { error: updateError } = await supabase
      .from("examData")
      .update({ time_left: timeLeft })
      .eq("id", getExamData()?.id);

    if (updateError) {
      console.log(updateError.message);
      return fail(442, { error: updateError.message });
    }

    return {}
  }
}
