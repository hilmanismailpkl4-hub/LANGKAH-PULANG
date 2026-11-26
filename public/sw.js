/**
 * Service Worker Otomatis Senyap (Network-First) untuk LANGKAH PULANG.
 * Tujuan: Saat pengguna memasang versi aplikasi di browser/HP (PWA), setiap update baru
 * di Vercel langsung termuat otomatis setiap kali aplikasi dibuka—tanpa pernah menyuruh
 * pengguna install ulang atau menampilkan popup paksaan update di browser!
 */
const RUNTIME_CACHE = 'langkah-pulang-live-v1';

self.addEventListener('install', () => {
  // Langsung aktifkan versi terbaru tanpa menunggu tab lama ditutup
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== RUNTIME_CACHE).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navigasi halaman (index.html): SELALU Network-First tanpa cache basi agar update langsung aktif!
  if (req.mode === 'navigate' || url.pathname === '/' || url.pathname === '/index.html') {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put('/index.html', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('/index.html')),
    );
    return;
  }

  // Aset ter-hash Vite (/assets/*): aman & super cepat karena nama berkas berubah tiap update
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        });
      }),
    );
  }
});
