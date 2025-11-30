import * as db from '$lib/server/database.ts'
import { fail } from '@sveltejs/kit';

import { diffChars, type ChangeObject } from "diff";

export const actions = {
  // get: async({cookies, request}) => {
  //   const data = await request.formData();

  //   const book = parseInt(data.get('book') as string);
  //   const chapter = parseInt(data.get('chapter') as string);
  //   const verses = parseInt( data.get('verse') as string);

  //   try {
  //     const res = await db.getVerses(book + 1, chapter, [verses]);
  //     return {
  //       query: {
  //         book: book,
  //         chapter: chapter,
  //         verse: verses
  //       },
  //       result: res
  //     };
  //   } catch (error: any) {
  //     console.log(error.message);
  //     return fail(442, {
  //       error: error.message
  //     });
  //   }
  // },

  submit: async({cookies, request}) => {
    const data = await request.formData();

    const book = parseInt(data.get('book') as string);
    const chapter = parseInt(data.get('chapter') as string);
    const verses = parseInt( data.get('verse') as string);
    const content = data.get('content') as string;

    try {
      const res = await db.getVerses(book + 1, chapter, [verses]);

      const concat = res.map((x) => x.content).join(' ');

      let diffs = diffChars(content, concat);
      
      return {
        query: {
          book: book,
          chapter: chapter,
          verse: verses
        },
        result: diffs
      };
    } catch (error: any) {
      console.log(error.message);
      return fail(442, {
        error: error.message
      });
    }
  }
}