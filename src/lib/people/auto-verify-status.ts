import { createClient } from "@/lib/supabase/server";

export type AutoVerifyStatus = {
  readyCount: number;
  waitingCount: number;
};

export async function loadAutoVerifyStatus(): Promise<AutoVerifyStatus | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("auto_verify_status");
  if (error) return null;
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const record = data as Record<string, unknown>;
  const readyCount = record.ready_count;
  const waitingCount = record.waiting_count;
  if (typeof readyCount !== "number" || typeof waitingCount !== "number") {
    return null;
  }
  return { readyCount, waitingCount };
}
