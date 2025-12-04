import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import { db2ExamData, type ExamData } from "$lib/model/exam_data";
import { createServerClient } from "@supabase/ssr";
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return event.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          event.cookies.set(name, value, { ...options, path: '/' })
        )
      }
    }
  })

  event.locals.safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();

    if (!session) {
      return { session: null, user: null };
    }

    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser();
    if (error) {
      return { session: null, user: null };
    }

    return { session, user };
  }

  event.locals.getExamData = async () => {
    const { error } = await event.locals.supabase.auth.getUser();

    if (error) {
      return { examData: null };
    }

    const { data, error: queryError } = await event.locals.supabase
      .from("examData")
      .select("*")
      .eq("completed_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (queryError) {
      return { examData: null };
    }

    return {
      examData: db2ExamData({ ...data }),
    }
  }

  const { session, user } = await event.locals.safeGetSession();

  event.locals.session = session;
  event.locals.user = user;

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version'
    },
  });
}
