import type { PageServerLoad } from './$types.js';
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
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

  return {
    verse: versePromise,
    end: await dummyTimeout,
  };
}
