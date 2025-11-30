import { supabase } from "$lib/supabaseclient";
import { redirect } from "@sveltejs/kit";

export async function load({ }) {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.log(error.message);
    // return {}
    redirect(301, '/login');
  }
}
