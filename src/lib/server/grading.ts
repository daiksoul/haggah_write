import { diffChars, type ChangeObject } from "diff";
import { evaluation } from "$lib/model/submit_n_draft";
import type { ExamData } from "$lib/model/exam_data";
import { supabaseService } from "./supabaseService";

export async function grade(addr: MultiVerse, submission: string, examData: ExamData | null): Promise<{ res: ChangeObject<string>[], status: evaluation }> {
  const { data, error } = await supabaseService.from('bible')
    .select<'bible', Verse>()
    .eq('book', addr.book + 1)
    .eq('chapter', addr.chapter)
    .in('verse', addr.verses);

  if (error || !data) {
    return { res: [], status: evaluation.ERROR };
  }

  const answer = data.map((x) => x.content).join(' ');

  return rawGrade(answer, submission, examData?.chimrye ?? false);
}

export function rawGrade(answer: string, submission: string, chimrye: boolean): { res: ChangeObject<string>[], status: evaluation } {
  let _answer = answer;
  if (chimrye) {
    _answer = answer.replaceAll('세례', '침례');
  }

  let diffs = diffChars(submission, _answer);

  var status = evaluation.CORRECT;

  for (let diff of diffs) {
    if (diff.value.match(/^[\s,.]+$/)) {
      continue;
    }

    if (diff.added || diff.removed) {
      status = evaluation.INCORRECT;
    }
  }

  return {
    res: diffs.filter((e) => {
      let isDontCare = e.value.match(/^[\s,.]+$/);
      let dontCareRender = !e.removed && isDontCare;

      return dontCareRender || !isDontCare;
    }),
    status: status
  };
}
