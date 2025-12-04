import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, getExamData }, cookies }) => {
  const { session, user } = await safeGetSession();

  const { examData } = await getExamData();

  return {
    session,
    user,
    cookies: cookies.getAll(),
    examData,
  }
}
