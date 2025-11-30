import type { PageServerLoad } from './$types.js';
import { fail } from "@sveltejs/kit";
import { supabase } from "$lib/supabaseclient.ts";
import { getCurrentUser } from '$lib/auth_state.svelte.js';

export const load: PageServerLoad = async ({ }) => {
  let versePromise = supabase
    .from('bible')
    .select('book, verse, chapter, content')
    .eq('id', Math.floor(Math.random() * 31087) + 1).then(({ data, error }) => {
      return {
        data: data?.map((e) => {
          return {
            book: e.book,
            chapter: e.chapter,
            verse: e.verse,
            content: e.content
          }
        }),
        error: error,
      }
    });


  let dummyTimeout = new Promise<void>(resolve => setTimeout(() => resolve(), 1))

  let user = getCurrentUser() ?? null;

  return {
    verse: versePromise,
    isAuth: user != null,
    end: await dummyTimeout,
  };
}

export const actions = {
}
