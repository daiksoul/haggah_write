import { setSession } from "$lib/auth_state.svelte";
import { supabase } from "$lib/supabaseclient";
import { redirect } from "@sveltejs/kit";

export async function load() {
  await supabase.auth.signOut();
  setSession();
  redirect(308,"/");
}