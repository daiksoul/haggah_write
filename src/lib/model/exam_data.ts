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
