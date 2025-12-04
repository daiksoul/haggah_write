import { redirect } from "@sveltejs/kit";

export async function load({ locals: { session, user } }) {
  console.log(user);

  if (session == null || user == null) {
    throw redirect(303, '/login');
  }
}
