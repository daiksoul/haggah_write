import { verseCompare } from '$lib/util.js';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ url, locals: { supabase, user } }) => {
  const book = parseInt((url.searchParams.get('book') as string | null) ?? '0');
  const chapter = parseInt((url.searchParams.get('chapter') as string | null) ?? '1');

  const versePromise = supabase.from('bible')
    .select<'bible', Verse>()
    .eq('book', book + 1)
    .eq('chapter', chapter)
    .order('id').then(({ data, error }) => {
      return {
        data: data?.map((v) => {
          return {
            id: v.id,
            book: v.book,
            chapter: v.chapter,
            verse: v.verse,
            content: v.content
          }
        }),
        error: error
      }
    });

  var uid = user?.id;

  const collectionPromise = supabase.from('collection')
    .select<'collection', Collection>().then(({ data, error }) => {
      return {
        data: data?.map((v) => {
          return {
            id: v.id,
            created_at: v.created_at,
            description: v.description,
            name: v.name,
            owner_id: v.owner_id
          }
        }),
        error: error
      }
    });

  let dummyPromise = new Promise<void>(resolve => setTimeout(() => resolve(), 0))

  return {
    verses: versePromise,
    collection: collectionPromise,
    uid: uid,
    end: await dummyPromise
  };
}

export const actions = {
  save: async ({ request, locals: { supabase, user } }) => {

    const data = await request.formData();

    const collection_id = parseInt(data.get('collection_id') as string);

    const book = parseInt(data.get('book') as string);
    const chapter = parseInt(data.get('chapter') as string);
    const vString = data.get('verses') as string;

    var verses: number[] = vString.split(',').map((e) => parseInt(e)).sort(verseCompare);

    const { data: saveData, error: saveError } = await supabase
      .from('multiVerses')
      .insert({
        book,
        chapter,
        verses,
        collection_id,
        owner_uid: user?.id
      });

    if (saveError) {
      console.log(collection_id);
      console.log(saveError.message);
      return fail(442, {
        message: saveError.message,
        status: 'error',
      });
    }

    //console.log('success!');

    return {
      status: 'success'
    };
  }
}
