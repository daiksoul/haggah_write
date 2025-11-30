import { setSession } from '$lib/auth_state.svelte.js';
import * as auth from '$lib/server/auth.ts';
import { supabase } from '$lib/supabaseclient.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ }) {
  const { data, error } = await supabase.auth.getUser();

  if (!error) {
    redirect(301, '/my');
  }

}

export const actions = {
  signin: async ({ request }) => {
    const data = await request.formData();
    let email = data.get('email') as string;
    let password = data.get('password') as string;

    const { data: signInData, error: signInError } = await auth.signIn(email, password);
    // const { data: signInData, error: signInError } = await supabaseService.auth.signInWithPassword({email, password});

    setSession();

    if (signInError) {
      console.log(signInError.message);
      return fail(442, {
        message: signInError.message
      });
    }

    redirect(308, '/my');
  }
}
