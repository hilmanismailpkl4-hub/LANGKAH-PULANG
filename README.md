# LANGKAH PULANG (*Steps Home*)

Game naratif 3D solo bergenre *Realistic Slice-of-Life Emotional Narrative Adventure + Open-Neighborhood Free-Roam* khusus untuk Laptop / Desktop (Keyboard + Mouse).

## Menjalankan Secara Lokal
```bash
npm install
npm run dev
```

## Build Produksi
```bash
npm run build
```

## Deploy ke Vercel
1. Hubungkan repositori ke proyek Vercel baru (Framework Preset: **Vite**).
2. `vercel.json` sudah dikonfigurasi untuk SPA routing dan header keamanan standar.
3. (Opsional) Tambahkan Environment Variables berikut bila ingin mengaktifkan Cloud Save:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

Jika variabel tersebut belum diisi, game tetap berjalan **100% penuh secara offline** menggunakan penyimpanan lokal browser.

## Aktivasi Cloud Save Supabase (Opsional)
1. Buka proyek Supabase → **SQL Editor**.
2. Jalankan seluruh isi file [`supabase/schema.sql`](./supabase/schema.sql).
3. Salin **Project URL** dan **Anon Public Key** ke `.env` (lokal) atau Environment Variables di Vercel.

## Menambahkan Rekaman Suara Asli (Voice Acting)
Letakkan file `.mp3` sesuai ID dialog di folder `public/voices/` lalu daftarkan nama file (tanpa `.mp3`) di `public/voices/manifest.json`. Lihat `public/voices/README.md` untuk detail lengkap. Tanpa file MP3, game otomatis menggunakan suara ucapan Bahasa Indonesia alami per karakter.
