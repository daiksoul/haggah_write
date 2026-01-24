import readXlsxFile from 'read-excel-file/node';

export const actions = {
	submit: async ({request, locals: { supabase, user } }) => {
		const data = await request.formData();

		let file = data.get('file')?.valueOf() as File | string;

		if (file instanceof File) {
			let rows = await readXlsxFile(Buffer.from( await file.arrayBuffer()));

			for (let row of rows) {

			
																
			}
		}
	}
}
