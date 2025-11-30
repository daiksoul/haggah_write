import type { ChangeObject } from "diff";

export interface SubmitNDraft {
  id: number;
  created_at: Date;
  updated_at: Date;
  owner_uid: string;
  exam_id: number;
  multiverse_id: number | null;
  address: string | null;
  content: string | null;
  submit_count: number;
  eval: number;
  res: ChangeObject<string>[]
}

export function evalToAttr(value: SubmitNDraft | null): string {
  if (value == null) return "unevaluated";
  switch (value.eval) {
    case 0:
      return "unevaluated";
    case 1:
      return "correct";
    case 2:
      return "incorrect";
    default:
      return "unevaluated"
  }
}
