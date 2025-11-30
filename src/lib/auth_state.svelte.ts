import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabaseclient";

let currentSession = $state(null as Session | null);

export function getCurrentUser() {
  return currentSession?.user;  
}

export async function setSession() {
  let { data, error } = await supabase.auth.getSession();
  if(error) {
    currentSession = null;
    return;
  }
  currentSession = data.session;
}