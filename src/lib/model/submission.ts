export interface submission {
  ownerId: string,
  multiverseId: number,
  submission: string,
  createdAt: Date,
  eval: evaluation
}

export enum evaluation {
  UNEVALUATED = 0,
  CORRECT = 1,
  INCORRECT = 2,
  ERROR = 3,
}

export function evaluationToString(value: evaluation) {
  switch (value) {
    case 0:
      return "unevaluated";
    case 1:
      return "correct";
    case 2:
      return "incorrect";
    case 3:
      return "error";
  }
}
