import { supabase } from "$lib/supabaseclient";
import type { AuthError, AuthTokenResponsePassword, Session } from "@supabase/supabase-js";
import { supabaseService } from "./supabaseService";

export async function createUser(name: string, email: string, password: string) : Promise<{status: number}> {
  const { data: res, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: 'http://localhost:5173/signup/success'
      }
    });

  if (error) {
    return {
      status: 442
    };
  }

  const { error: error2 } = await supabaseService
    .from('users')
    .insert({email, password, uid: res.user!.id, name});
  
  if(error2) {
    console.log(error2.message, error2.cause);
    return {
      status: 442
    };
  }

  return {
    status: 202
  };
}

export async function signIn(email: string, password: string): Promise<AuthTokenResponsePassword> {
  return await supabase.auth.signInWithPassword({
    email,
    password
  }); 
}

export async function confirmUserEmail(uid: string) {
  const {data, error} = await supabaseService
  .from('users')
  .update({email_confirmed: true})
  .eq('uid',uid);

  // supabaseService.auth.

  if(error) {
    console.log(error.message);
  }

  console.log(data);
}