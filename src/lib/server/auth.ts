import { supabaseService } from "./supabaseService";

export async function confirmUserEmail(uid: string) {
  const { data, error } = await supabaseService
    .from('users')
    .update({ email_confirmed: true })
    .eq('uid', uid);

  // supabaseService.auth.

  if (error) {
    console.log(error.message);
  }

  console.log(data);
}
