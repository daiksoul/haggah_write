import { getCurrentUser } from '$lib/auth_state.svelte.js';
import { showToast } from '$lib/component/toast_store.svelte.js';
import { supabase } from '$lib/supabaseclient.js';
import { fail, redirect } from '@sveltejs/kit';


export async function load({}) {
  const {error} = await supabase.auth.getUser();
  if (error) {
    showToast(error.message, "error", true);
    redirect(308,'/login')
  }

  const collections = supabase.from('collection')
    .select<'collection',Collection>()
    .order('created_at')
    .then(({data, error})=> {
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
  create: async ({ request }) => {
    const data = await request.formData();

    let name = data.get('name') as string;
    let description = data.get('description') as string;
    let ownerId = getCurrentUser()?.id;
    
    const { error: createError, data: createData } = await supabase
      .from('collection')
      .insert({ 
        name: name, 
        description: description, 
        owner_uid: ownerId,
      });
    
    if ( createError ) {
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

  delete: async ({request}) => {
    
    const { error: deleteError } = await supabase
      .from('collection')
      .delete()
      .eq('id','')
  }
}