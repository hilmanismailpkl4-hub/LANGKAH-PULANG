# Panduan Audio Suara (Voice Acting) — LANGKAH PULANG

Folder ini digunakan oleh **Voice Dialogue Manager** untuk memutar rekaman suara asli (dari pengisi suara manusia, ElevenLabs, atau Fish Audio).

## Cara Menambahkan Rekaman Suara Asli
1. Simpan file audio berformat `.mp3` di folder ini dengan nama persis sesuai `dialogId` (ID node dialog), contohnya:
   - `ch1_pagi_1.mp3`
   - `ch1_pagi_2.mp3`
   - `ch2_hujan_bima_1.mp3`
   - `ee_surat_laci_1.mp3`
2. Daftarkan daftar file yang tersedia ke `manifest.json` di folder ini (opsional, mempercepat pemutaran tanpa request 404):
   ```json
   {
     "files": ["ch1_pagi_1", "ch1_pagi_2"]
   }
   ```
3. Jika file `.mp3` belum tersedia untuk sebuah baris dialog, game otomatis menggunakan suara ucapan Bahasa Indonesia alami (Web Speech API) dengan karakter nada dan tempo yang berbeda untuk Damar, Nadia, Kira, Bima, Pak Hendra, dan seluruh warga kota.
