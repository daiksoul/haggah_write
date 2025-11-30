import { supabase } from '$lib/supabaseclient.js';
import { redirect } from '@sveltejs/kit';

export async function load({}) {
  const {data, error} = await supabase.auth.getUser();

  if (error) {
    

    console.log(error.message);
    // return {}
    redirect(308, '/login');
  } else {
    const {data: userData, error: userError} = await supabase
      .from('users')
      .select<"users",User>();

    if (userError) {
      console.log(userError.message);
      return {}
    }

    console.log(`${userData[0].name} logged in`);

    return {
      user: userData[0]
    }
  }
}

export const actions = {
  logout: async ({request}) => {
    await supabase.auth.signOut();

    redirect(308,'/');
  }
}