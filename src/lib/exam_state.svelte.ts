import type { ExamData } from "./model/exam_data";

let examData = $state(null as ExamData | null);

export function getExamData() {
  return examData;
}

export function setExamData(
  eData: ExamData) {
  examData = {
    ...eData,
  }
}

export function setExamDataDb({ id, collection_id, use_timer, show_address, show_answer, max_submission_count, time_limit, answer_check, chimrye, completed_at, time_left }
  : {
    id: number,
    collection_id: number,
    use_timer: boolean,
    show_address: boolean,
    show_answer: boolean,
    max_submission_count: number,
    time_limit: number | null,
    answer_check: number | null,
    chimrye: boolean,
    completed_at: Date | null,
    time_left: number | null,
  }) {
  examData = {
    id: id,
    collectionId: collection_id,
    useTimer: use_timer,
    showAddress: show_address,
    showAnswer: show_answer,
    maxSubmissionCount: max_submission_count,
    timeLimit: time_limit,
    answerCheck: answer_check,
    chimrye: chimrye,
    completedAt: completed_at,
    timeLeft: time_left,
  }
}

export function completeExam() {
  if (examData == null) return;
  examData.completedAt = new Date(Date.now());
}

export function clearExamData() {
  examData = null;
}
