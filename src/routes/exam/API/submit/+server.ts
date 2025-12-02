import { fullNames, shortNames } from "$lib/data.js";
import { getExamData, setExamData } from "$lib/exam_state.svelte.js";
import type { ExamData } from "$lib/model/exam_data.js";
import { evaluation } from "$lib/model/submission.js";
import { rawGrade } from "$lib/server/grading.js";
import { error, json } from "@sveltejs/kit";
import type { ChangeObject } from "diff";
// error code 
// 460 : simple error
// 461 : force complete test
// 462 : crash test
export async function POST({ request, locals: { supabase, user } }) {
  let examData: ExamData | null = getExamData();
  if (examData == null) return error(462, { message: '시험정보가 존재하지 않습니다' });
  if (examData.completedAt != null) return error(462, { message: '시험이 종료되었습니다' });

  let _json = await request.json();

  let returnStatus = 201;
  let returnMessage = "";
  let skipSubmission = false;

  let { id, owner_uid, eval: evaluato, submit_count, multiverse_id, res, ...tmp } = _json.submission;

  let parsedMVerse = parseAddress(tmp.address);

  if (!examData.showAddress && parsedMVerse == null) {
    return error(460, { message: "잘못된 주소 형식입니다." });
  }

  let { data: mVData, error: mVError } = examData.showAddress ? await supabase.rpc('get_multiverse_content_by_mid', {
    cid_input: examData.collectionId,
    mid_input: multiverse_id
  }) : await supabase.rpc('get_multiverse_content_by_exam', {
    cid_input: examData.collectionId,
    book_input: parsedMVerse?.book,
    chapter_input: parsedMVerse?.chapter,
    verses_input: parsedMVerse?.verses
  });

  if (mVError) {
    return error(460, { message: mVError.message });
  }

  let lst: {
    id: number,
    book: number,
    chapter: number,
    verses: number[],
    content: string
  }[] = mVData.map((e: any) => {
    return {
      id: e.id,
      book: e.book,
      chapter: e.chapter,
      verses: e.verses,
      content: e.content
    }
  });


  let evalu = evaluation.UNEVALUATED;
  let mid: number | null = null;

  let diffs: ChangeObject<string>[] | null = null;

  /// no matching mVerses
  if (lst.length < 1) {
    evalu = evaluation.INCORRECT;
  } else {
    let { res, status } = rawGrade(lst[0].content, tmp.content, examData.chimrye);
    evalu = status;
    mid = lst[0].id;
    diffs = res;
  }

  let { data: existsData, error: existsError } = await supabase.rpc("get_submission_count_by_mid", { eid_input: examData.id, mid_input: mid });

  if (existsError) {
    return error(460, { message: existsError.message });
  }

  if (evalu == evaluation.INCORRECT && existsData + 1 >= examData.maxSubmissionCount) {

    let now = new Date(Date.now());

    examData.completedAt = now;
    setExamData(examData);

    supabase.from("examData")
      .update({
        completed_at: now
      })
      .eq("id", examData.id);

    returnStatus = 461;
    returnMessage = "제출 기회를 모두 소진하였습니다";
  } else if (evalu == evaluation.CORRECT && existsData + 1 > examData.maxSubmissionCount) {
    skipSubmission = true;
    returnStatus = 460;
    returnMessage = "제출 가능한 최대 횟수를 넘겼습니다";
  }


  let { data: submitData, error: submitError } = id == -1
    ? await supabase.from("submitNdraft").insert({
      multiverse_id: mid,
      eval: evalu,
      submit_count: submit_count + skipSubmission ? 0 : 1,
      owner_uid: user?.id,
      res: diffs,
      ...tmp,
    })
      .select()
    : await supabase.from("submitNdraft")
      .update({
        multiverse_id: mid,
        eval: evalu,
        submit_count: submit_count + skipSubmission ? 0 : 1,
        res: diffs,
        ...tmp
      })
      .eq("id", id)
      .select();

  let { data: unsubmitData, error: unsubmitError } = await supabase.rpc("get_unsubmitted_multiverses", { eid_input: examData.id });

  if (unsubmitError) return error(460, { message: unsubmitError.message });
  if (unsubmitData.length == 0) {
    let now = new Date(Date.now());
    examData.completedAt = now;
    setExamData(examData);
    supabase.from("examData")
      .update({
        completed_at: now
      })
      .eq("id", examData.id);
  }

  if (submitError) {
    return error(460, { message: submitError.message });
  } else {
    return json({ data: submitData?.at(0), complete: examData.completedAt != null, diffs: diffs, message: returnMessage }, { status: returnStatus });
  }
}


/// parses {address_text}
/// returns corrisponding multiverse object or null
/// null when parsing error
function parseAddress(address_text: string): MultiVerse | null {
  let regExp =
    /^\s*(\D+)\s*(\d+)\s*[:장]((?:\s*\d+(?:\s*[-~]\s*\d+)?절?)(?:\s*,\s*\d+(?:\s*[-~]\s*\d+)?절?)*)\s*$/g;
  // let matches = address_text.matchAll(regExp);
  let matches = regExp.exec(address_text);

  if (matches?.length != 4) {
    return null;
  }

  let arr = [...(matches?.splice(1) ?? [])];

  let book = -1;
  let bookString = arr[0].trim();
  if (fullNames.indexOf(bookString) != -1) {
    book = fullNames.indexOf(bookString);
  } else if (shortNames.indexOf(bookString) != -1) {
    book = shortNames.indexOf(bookString);
  } else {
    return null;
  }

  let chapter = parseInt(arr[1]);
  if (isNaN(chapter)) {
    return null;
  }
  let split = arr[2].split(",");
  let verses: number[] = [];
  for (const v of split) {
    if (v.includes("~") || v.includes("-")) {
      let tmp: string[];

      if (v.includes("~")) {
        tmp = v.split("~");
      } else {
        tmp = v.split("-");
      }

      let t1 = parseInt(tmp[0].trim().replaceAll("절", ""));
      let t2 = parseInt(tmp[1].trim().replaceAll("절", ""));

      if (isNaN(t1) || isNaN(t2)) {
        return null;
      }

      for (let i = t1; i <= t2; i++) {
        verses.push(i);
      }
    } else {
      let t = parseInt(v.trim().replaceAll("절", ""));
      if (isNaN(t)) {
        return null;
      }
      verses.push(t);
    }
  }

  return {
    id: -1,
    book: book,
    chapter: chapter,
    verses: verses
  }
}
