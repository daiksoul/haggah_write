import { redirect } from "@sveltejs/kit";

export async function load({ locals: { supabase } }) {
  await supabase.auth.signOut();
  redirect(308, "/");
}
