import { fail } from '@sveltejs/kit';

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

    const { error: createError, data: createData } = await supabase
      .from('collection')
      .insert({
        name: name,
        description: description,
        owner_uid: ownerId,
      });

    if (createError) {
      console.log(createError.message);
      return fail(442, {
        status: 'error',
        message: createError.message,
      });
    } else {
      console.log(createData);
      return {
        status: 'success'
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
  }
}
