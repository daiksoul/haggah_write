import { redirect } from '@sveltejs/kit';

export async function load({ locals: { supabase, user } }) {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select<"users", User>()
    .single();

  if (userError) {
    console.log(userError.message);
    return { error: userError.message }
  }

  //console.log(`${userData.name} logged in`);

  return {
    user: userData
  }
}

export const actions = {
  logout: async ({ locals: { supabase } }) => {
    await supabase.auth.signOut();

    redirect(308, '/');
  }
}
