import { supabase } from '$lib/supabaseclient.js';
import { fail, redirect } from '@sveltejs/kit';

import * as auth from '$lib/server/auth.ts';

export const actions = {
  signup: async({request}) => {
    const data = await request.formData();
    let email = data.get('email') as string;
    let password1 = data.get('password') as string;
    let password2 = data.get('passwordConfirm') as string;
    let name = data.get('name') as string;

    if (password1 !== password2) {
      return fail(442,{
        description: '비밀번호가 일치하지 않습니다.'
      })
    } else if (password1.length < 6) {
      return fail(442, {
        description: '비밀번호는 최소 6자리여야 합니다.'
      });
    }

    const {status} = await auth.createUser(name, email, password1);
    if(status === 202) {
      redirect(308, '/');
    }
  }
}