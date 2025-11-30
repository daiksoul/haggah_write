import { page } from '$app/state';
import { confirmUserEmail } from '$lib/server/auth.js';
import { supabase } from '$lib/supabaseclient.js';

export async function load({fetch, url }) {
  const res = await fetch(`/signup/success#${url}`, {
    method: 'GET'
  });

  const t = await res.json();
  
  console.log(t);

  await supabase.auth.setSession({
    access_token: t.access_token,
    refresh_token: t.refresh_token,
  });

  const {data, error} = await supabase.auth.getUser();

  if(error) {
    console.log(error.message);
  } else {
    confirmUserEmail(data.user.id);
  }
}