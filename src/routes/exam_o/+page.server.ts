import { getExamData } from '$lib/exam_state.svelte.js';
import * as db from '$lib/server/database.ts';
import * as gd from '$lib/server/grading.js';
import { supabase } from '$lib/supabaseclient.js';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { getCurrentUser } from '$lib/auth_state.svelte.js';

export const load: PageServerLoad = async ({ }) => {
  let examData = getExamData();

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

  let draftPromise = supabase
    .from("draft")
    .select("id, multiverse_id, address, content, updated_at")
    .eq("exam_id", examData?.id).then(({ data, error }) => {
      return {
        data: data?.map((e) => {
          return {
            id: e.id,
            multiverseId: e.multiverse_id,
            address: e.address,
            content: e.content,
            updatedAt: e.updated_at,
          }
        }) ?? null,
        error: error
      }
    });

  let submissionPromise = supabase
    .from("submission")
    .select("id, multiverse_id, submission, eval")
    .eq("exam_id", examData?.id).then(({ data, error }) => {
      return {
        data: data?.map((e) => {
          return {
            id: e.id,
            multiverseId: e.multiverse_id,
            submission: e.submission,
            eval: e.eval,
          }
        }) ?? null,
        error: error
      }
    });

  let dummyTimeout = new Promise<void>(resolve => setTimeout(() => resolve(), 1));

  return {
    data: multiVersePromise,
    draft: draftPromise,
    submission: submissionPromise,
    examData: examData,
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
      }, submitted);

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
  draft: async ({ request }) => {
    const data = await request.formData();

    const draftType = data.get("type") as string;
    const examId = data.get("exam_id") as string;

    let value = {
      updated_at: Date.now(),
      owner_id: getCurrentUser()?.id,
      multiverse_id: -1,
      address: "",
      content: data.get("content") as string,
      exam_id: examId
    };
    if (data.has("multiverse_id")) {
      value.multiverse_id = parseInt(data.get("multiverse_id") as string);
    } else {
      value.address = data.get("address") as string;
    }

    if (draftType == "update") {
      supabase.from("draft")
        .update(value)
        .eq("exam_id", examId)
        .eq("multiverse_id", -1);
    } else if (draftType == "create") {
      supabase.from("draft")
        .insert(value);
    }
  }
}
