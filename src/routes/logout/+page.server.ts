import { redirect } from "@sveltejs/kit";

export async function load({ locals: { supabase, user } }) {
  await supabase.auth.signOut();
  user = null;
  redirect(308, "/");
}
