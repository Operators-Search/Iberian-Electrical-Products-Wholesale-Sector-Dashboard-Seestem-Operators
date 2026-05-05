import type { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return Response.json(
      {
        ok: false,
        error: "CRON_SECRET is not configured",
      },
      {
        status: 500,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", {
      status: 401,
      headers: NO_STORE_HEADERS,
    });
  }

  const startedAt = Date.now();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("companies").select("bvd_code").limit(1);

  if (error) {
    return Response.json(
      {
        ok: false,
        error: error.message,
      },
      {
        status: 500,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  return Response.json(
    {
      ok: true,
      checkedAt: new Date().toISOString(),
      touchedRows: data?.length ?? 0,
      durationMs: Date.now() - startedAt,
    },
    {
      headers: NO_STORE_HEADERS,
    },
  );
}
