export interface ExamData {
  id: number,
  collectionId: number,
  useTimer: boolean,
  showAddress: boolean,
  showAnswer: boolean,
  maxSubmissionCount: number,
  timeLimit: number | null,
  answerCheck: answerCheckMethod | null,
  chimrye: boolean,
  completedAt: Date | null,
  timeLeft: number | null,
}

export enum answerCheckMethod {
  INSTANT = 0,
  SINGLE = 1,
  POSTTEST = 2,
}

export function answerCheckMethod2Kor(value: number): string {
  switch (value) {
    case answerCheckMethod.INSTANT:
      return "즉시";
    case answerCheckMethod.SINGLE:
      return "한 묶음";
    case answerCheckMethod.POSTTEST:
      return "시험 종료 후";
    default:
      return "";
  }
}


export function db2ExamData({ id, collection_id, use_timer, show_address, show_answer, max_submission_count, time_limit, answer_check, chimrye, completed_at, time_left }
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

  return {
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
  };

}
