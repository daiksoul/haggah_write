import { fail, redirect } from '@sveltejs/kit';

export async function load({ locals: { supabase } }) {
  const { error } = await supabase.auth.getUser();

  if (!error) {
    redirect(301, '/my');
  }
}

export const actions = {
  signin: async ({ request, locals: { supabase } }) => {
    const data = await request.formData();
    let email = data.get('email') as string;
    let password = data.get('password') as string;

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    // const { data: signInData, error: signInError } = await auth.signIn(email, password);
    // const { data: signInData, error: signInError } = await supabaseService.auth.signInWithPassword({email, password});

    if (signInError) {
      console.log(signInError.message);
      return fail(442, {
        message: signInError.message
      });
    }

    redirect(301, '/my');
  }
}
