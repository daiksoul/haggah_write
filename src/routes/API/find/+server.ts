import '$lib/server/type';
import * as db from '$lib/server/database.ts';
import { json } from '@sveltejs/kit';

export async function GET({ request, url }) {

  if(!url.searchParams.has('book') || !url.searchParams.has('chapter')) return json({message: 'parameters missing'}, {status: 441});

  const bookNumber: number = parseInt(url.searchParams.get('book') as string) + 1;
  const chapterNumber: number = parseInt(url.searchParams.get('chapter') as string);
  const versesIndex: number[] = JSON.parse(url.searchParams.get('verses') ?? '[]');

  var versesObjs: Verse[] = [];

  if(versesIndex?.length == 0) {
    versesObjs.push(...(await db.getAllVersesInChapter(bookNumber, chapterNumber)));
  } else {
    versesObjs.push(...(await db.getVerses(bookNumber,chapterNumber,versesIndex)))
  }

  return json({verses: versesObjs}, {status: 201});
}