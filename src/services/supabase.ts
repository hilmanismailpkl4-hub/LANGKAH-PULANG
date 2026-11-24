import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { SaveSlotData } from '../types/game';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const SAVE_TABLE = 'langkah_pulang_saves';

let client: SupabaseClient | null = null;

export function isCloudEnabled(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('http'));
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!isCloudEnabled()) return null;
  if (!client) {
    client = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return client;
}

export async function getCurrentCloudUser(): Promise<User | null> {
  const sb = getSupabaseClient();
  if (!sb) return null;
  try {
    const { data } = await sb.auth.getUser();
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function signInCloud(email: string, password: string): Promise<{ user: User | null; error?: string }> {
  const sb = getSupabaseClient();
  if (!sb) return { user: null, error: 'Penyimpanan awan belum diaktifkan pada perangkat ini.' };
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    return { user: null, error: 'Email atau kata sandi tidak sesuai. Silakan periksa kembali.' };
  }
  return { user: data.user };
}

export async function signUpCloud(email: string, password: string): Promise<{ user: User | null; error?: string; info?: string }> {
  const sb = getSupabaseClient();
  if (!sb) return { user: null, error: 'Penyimpanan awan belum diaktifkan pada perangkat ini.' };
  const { data, error } = await sb.auth.signUp({ email, password });
  if (error) {
    return { user: null, error: 'Pendaftaran akun tidak dapat diproses saat ini. Coba gunakan email lain atau kata sandi minimal 6 karakter.' };
  }
  if (!data.session) {
    return {
      user: data.user,
      info: 'Akun dibuat! Silakan cek kotak masuk email kamu untuk konfirmasi sebelum masuk.',
    };
  }
  return { user: data.user };
}

export async function signOutCloud(): Promise<void> {
  const sb = getSupabaseClient();
  if (!sb) return;
  await sb.auth.signOut().catch(() => {});
}

export async function pushCloudSave(slot: SaveSlotData): Promise<boolean> {
  const sb = getSupabaseClient();
  if (!sb) return false;
  try {
    const { data: userData } = await sb.auth.getUser();
    if (!userData.user) return false;

    const { error } = await sb.from(SAVE_TABLE).upsert(
      {
        user_id: userData.user.id,
        slot_id: slot.slotId,
        journal_name: slot.journalName,
        chapter: slot.chapter,
        save_payload: slot,
        unlocked_endings: slot.unlockedEndings,
        updated_at: slot.updatedAt,
      },
      { onConflict: 'user_id,slot_id' },
    );
    return !error;
  } catch {
    return false;
  }
}

export async function fetchCloudSaves(): Promise<SaveSlotData[]> {
  const sb = getSupabaseClient();
  if (!sb) return [];
  try {
    const { data: userData } = await sb.auth.getUser();
    if (!userData.user) return [];

    const { data, error } = await sb
      .from(SAVE_TABLE)
      .select('save_payload')
      .eq('user_id', userData.user.id)
      .order('updated_at', { ascending: false });

    if (error || !data) return [];
    return data
      .map((row) => row.save_payload as SaveSlotData)
      .filter((s) => Boolean(s && s.slotId));
  } catch {
    return [];
  }
}

export async function deleteCloudSave(slotId: string): Promise<void> {
  const sb = getSupabaseClient();
  if (!sb) return;
  try {
    const { data: userData } = await sb.auth.getUser();
    if (!userData.user) return;
    await sb.from(SAVE_TABLE).delete().eq('user_id', userData.user.id).eq('slot_id', slotId);
  } catch {
    // Abaikan kegagalan jaringan saat hapus cloud
  }
}
