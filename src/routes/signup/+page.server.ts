import { fail, redirect } from '@sveltejs/kit';

import * as auth from '$lib/server/auth.ts';
import { supabaseService } from '$lib/server/supabaseService.js';

export const actions = {
  signup: async ({ request, locals: { supabase } }) => {
    const data = await request.formData();
    let email = data.get('email') as string;
    let password1 = data.get('password') as string;
    let password2 = data.get('passwordConfirm') as string;
    let name = data.get('name') as string;

    if (password1 !== password2) {
      return fail(442, {
        description: '비밀번호가 일치하지 않습니다.'
      })
    } else if (password1.length < 6) {
      return fail(442, {
        description: '비밀번호는 최소 6자리여야 합니다.'
      });
    }

    const { data: res, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password1,
      options: {
        emailRedirectTo: "https://haggahwrite.dksl.dedyn.io/signup/success"
      }
    });

    if (signUpError) {
      return {
        status: 442
      }
    }

    const { error: logError } = await supabaseService
      .from('users')
      .insert({ email, password1, uid: res.user?.id, name });

    if (!logError) {
      redirect(303, '/signup/confirm');
    }
  }
}
