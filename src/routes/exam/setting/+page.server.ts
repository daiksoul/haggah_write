import { setExamDataDb } from '$lib/exam_state.svelte.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ url }) {
  if (url.searchParams.has('cid')) {
    let cid = parseInt(url.searchParams.get('cid')!);

    return {
      collectionId: cid
    };
  }
}

export const actions = {
  start: async ({ request, locals: { supabase, user } }) => {
    const data = await request.formData();

    const collectionId = parseInt(data.get('collection_id') as string);
    const useTimer = (data.get('use_timer') as string) == 'true';
    const showAddress = (data.get('show_address') as string) == 'true';
    const showAnswer = (data.get('show_answer') as string) == 'true';
    const maxSubmissionCount = parseInt(data.get('max_submission_count') as string);
    const timeLimit = data.has('time_limit') ? parseInt(data.get('time_limit') as string) : null;
    const answerCheck = data.has('answer_check') ? parseInt(data.get('answer_check') as string) : null;
    const chimrye = (data.get('chimrye') as string) == 'true';

    if (useTimer && timeLimit != null && timeLimit <= 0) {
      return fail(442, {
        status: 'error',
        message: '제한시간이 너무 짧습니다'
      });
    }
    if (maxSubmissionCount <= 0) {
      return fail(442, {
        status: 'error',
        message: '답변 최대 제출 횟수는 1회 이상이어야 합니다'
      })
    }

    let eData = {
      collection_id: collectionId,
      use_timer: useTimer,
      show_address: showAddress,
      show_answer: showAnswer,
      max_submission_count: maxSubmissionCount,
      time_limit: timeLimit,
      answer_check: answerCheck,
      owner_uid: user?.id,
      chimrye: chimrye
    }

    let { data: examData, error: examError } = await supabase.from("examData").insert(eData).select();

    if (!examError) {
      setExamDataDb(
        examData![0]
      );
      redirect(308, '/exam');
    } else {
      return fail(442, {
        status: 'error',
        message: examError.message
      });
    }

  }
}
