import { supabase } from '$lib/supabaseclient.js';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types.js';

export const load: PageServerLoad = async ({params}) => {
  let collectionReturn = supabase.from('collection')
    .select<'collection',Collection>()
    .eq('id', parseInt(params.id))
    .single();

  interface MultiVerseWithContent {
    id: number,
    book: number,
    chapter: number,
    verses: number[],
    content: string
  }

  let verseReturn = supabase.rpc('get_multiverse_content', {collection_id_input: parseInt(params.id)})
  .then(({data: cData, error: cError })=> {
    return {
      data: (cData as MultiVerseWithContent[]),
      error: cError
    }
  });

  let dummyPromise = new Promise( resolve => setTimeout(() => resolve(), 0));
  
  return {
    collection: await collectionReturn,
    mulitverse: await verseReturn,
    end: await dummyPromise
  }
}

export const actions = {
  remove: async ({ request, params }) => {
    const data = await request.formData();

    let id = parseInt(data.get('id') as string);

    const { error: deleteError } = await supabase
      .from('multiVerses')
      .delete()
      .eq('id',id);

    if (deleteError) {
      return fail(442, {
        status: 'error',
        message: deleteError.message,
      });
    }

    return {
      status: 'success'
    }
  },

  editCollection: async ({ request, params }) => {
    const data = await request.formData();

    let newName = data.get('new_name') as string;

    let { error } = await supabase
      .from('collection')
      .update({ name : newName })
      .eq('id', parseInt(params.id));

    if (error) {
      return fail(442, {
        status: 'error',
        message: error.message,
      });
    }

    return {
      status: 'success'
    }
  }
}
