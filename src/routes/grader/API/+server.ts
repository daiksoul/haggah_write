import { shortNames, validateAddress } from '$lib/data.js';
import { stringToNumberArray } from '$lib/util.js';
import { error, json } from "@sveltejs/kit";
import { rawGrade } from "$lib/server/grading.js";

export async function POST({ request, locals: { supabase, user } }) {
  const data = await request.json();

  let book = shortNames.indexOf(data.book ?? 'null');
  let chapter = parseInt(data.chapter ?? '-1');
  let verses = stringToNumberArray(data.verses ?? '[]');

  if (!validateAddress({ book, chapter, verses })) {
    return json({ data: [], comment: 'invalid_address', stat: 2 }, { status: 202 });
  }

  let { data: contentData, error: contentError } = await supabase.rpc('get_multiverse_content_by_address', {
    book_input: book,
    chapter_input: chapter,
    verses_input: verses,
  });

  let { res, status } = rawGrade(contentData[0].content, data.content.replaceAll(' ', ''), true);

  return json({ data: res, comment: '', stat: status }, { status: 202 });
}
