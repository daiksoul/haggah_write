import { shortNames, validateAddress } from '$lib/data.js';
import { stringToNumberArray } from '$lib/util.js';
import { fail } from '@sveltejs/kit';
import readXlsxFile from 'read-excel-file/node';

export async function load({ locals: { supabase } }) {
  const collections = supabase.from('collection')
    .select<'collection', Collection>()
    .order('created_at')
    .then(({ data, error }) => {
      return {
        data: data as Collection[],
        error: error
      }
    });

  return {
    collections: collections
  };
}

export const actions = {
  create: async ({ request, locals: { supabase, user } }) => {
    const data = await request.formData();

    let name = data.get('name') as string;
    let description = data.get('description') as string;
    let ownerId = user?.id;

    let file = data.get('file')?.valueOf() as File | string;

    let mVs = [];

    if (file instanceof File) {
      let rows = await readXlsxFile(Buffer.from(await file.arrayBuffer()));

      for (let row of rows) {
        let book = shortNames.indexOf(row.at(0)?.toString() ?? '');
        let chapter = parseInt(row.at(1)?.toString() ?? '');
        let verses = stringToNumberArray(row.at(2)?.toString() ?? '');

        if (validateAddress({ book, chapter, verses })) {
          mVs.push({
            book,
            chapter,
            verses,
          })
        }
      }
    }

    const { error: createError, data: createData } = await supabase
      .from('collection')
      .insert({
        name: name,
        description: description,
        owner_uid: ownerId,
      })
      .select()
      .single();

    if (createError) {
      console.log(createError.message);
      return fail(442, {
        status: 'error',
        message: createError.message,
      });
    } else {
      await supabase
        .from('multiVerses')
        .insert(mVs.map(({ book, chapter, verses }, idx) => {
          return {
            book,
            chapter,
            verses,
            collection_id: createData.id,
            order_number: idx,
            owner_uid: user?.id
          }
        }));

      return {
        status: 'success',
        message: '보관함이 생성되었습니다.'
      }
    }
  },

  delete: async ({ request, locals: { supabase } }) => {
    let data = await request.formData();

    let delId = parseInt(data.get('id') as string);

    const { error: deleteError } = await supabase
      .from('collection')
      .delete()
      .eq('id', delId);

    if (deleteError) {
      return fail(442, { message: deleteError.message });
    }

    return {
      status: 'success',
      message: '삭제되었습니다'
    }
  }
}
