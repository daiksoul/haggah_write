import { shortNames, validateAddress } from '$lib/data.js';
import { stringToNumberArray } from '$lib/util.js';
import { error, json } from "@sveltejs/kit";

export async function POST({request, locals: { supabase, user }}) {
				const data = await request.json();

				console.log('HUH?');

				let book = shortNames.indexOf(data.get('book') ?? 'null');
				let chapter = parseInt(data.get('chapter') ?? '-1');
				let verses = stringToNumberArray(data.get('verses') ?? '[]');

				console.log('YOOOOOOO');

				let { data, error } = await = supabase.rpc('get_multiverse_content_by_address', {
								book_input: book,
								chapter_input: chapter,
								verses_input: verses,
				});

				console.log(data);

				return json();
}
