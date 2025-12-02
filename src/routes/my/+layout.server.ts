import { supabase } from "$lib/supabaseclient";
import { redirect } from "@sveltejs/kit";

export async function load({ locals: { session } }) {
  if (session === null) {
    redirect(301, '/login');
  }
}
