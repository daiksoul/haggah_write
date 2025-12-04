import { db2ExamData } from "$lib/model/exam_data";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { supabase, examData } }) => {
  let { data: eData, error: eError } = await supabase.from("examData")
    .select("*")
    .eq("id", examData?.id);

  if (eError) {
    console.log(eError.message);
  }

  examData = db2ExamData({ ...eData?.at(0) });

  let submitNdraftPromise = supabase.rpc("get_exam_results", {
    eid_input: examData?.id
  })
    .then(({ data, error }) => {
      return {
        data: data?.map((e: any) => {
          return {
            mid: e.mid,
            book: e.book,
            chapter: e.chapter,
            verses: e.verses,
            address: e.address,
            content: e.content,
            res: e.res,
            submitCount: e.submit_count,
            eval: e.eval
          }
        }),
        error: error,
      }
    })
  let dummyTimeout = new Promise<void>(resolve => setTimeout(() => resolve(), 1));

  return {
    examData: examData,
    submitNdraft: submitNdraftPromise,
    end: await dummyTimeout,
  }
}
