import type { ExamData } from "$lib/model/exam_data";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient;
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
      session: Session | null,
      user: User | null,
      getExamData: () => Promise<{ examData: ExamData | null }>;
      examData: ExamData | null,
    };

    interface PageData {
      session: Session | null
    }
  }
}
