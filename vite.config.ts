/// <reference lib="es2020" />
import * as fs from 'node:fs';
import * as path from 'node:path';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

declare const process: { cwd(): string };

function formatBytesLabel(bytes: number): string {
  if (bytes >= 1048576) {
    return `${(bytes / 1048576).toFixed(2)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function getDirBytes(dir: string, skipNames: Set<string>): number {
  let sum = 0;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (skipNames.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        sum += getDirBytes(full, skipNames);
      } else if (entry.isFile() && !entry.name.endsWith('.map')) {
        sum += fs.statSync(full).size;
      }
    }
  } catch {
    // Abaikan jika folder belum ada
  }
  return sum;
}

/**
 * Plugin Vite otomatis (enforce: 'post'): setelah seluruh berkas dist/ selesai ditulis,
 * menghitung ukuran nyata seluruh bundle (JS + CSS + HTML + aset publik)—baik bertambah
 * maupun berkurang—lalu menyuntikkannya langsung ke dist/index.html agar layar loading
 * selalu menampilkan ukuran file terbaru yang 100% akurat di setiap update!
 */
function langkahPulangBuildMetaPlugin(): Plugin {
  const buildId = Date.now().toString(36);

  return {
    name: 'langkah-pulang-build-meta',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      if (ctx.server) {
        const devEst = 2960 * 1024;
        return html
          .replace(/__LP_TOTAL_BYTES__/g, String(devEst))
          .replace(/__LP_TOTAL_SIZE_LABEL__/g, formatBytesLabel(devEst))
          .replace(/__LP_BUILD_ID__/g, `dev-${buildId}`);
      }
      return html;
    },
    writeBundle(outputOptions) {
      const outDir = outputOptions.dir
        ? path.resolve(outputOptions.dir)
        : path.resolve(process.cwd(), 'dist');
      const indexHtmlPath = path.join(outDir, 'index.html');
      if (!fs.existsSync(indexHtmlPath)) return;

      const totalBytes = getDirBytes(outDir, new Set(['voices', 'sw.js']));
      const label = formatBytesLabel(totalBytes);

      const rawHtml = fs.readFileSync(indexHtmlPath, 'utf8');
      const patchedHtml = rawHtml
        .replace(/__LP_TOTAL_BYTES__/g, String(totalBytes))
        .replace(/__LP_TOTAL_SIZE_LABEL__/g, label)
        .replace(/__LP_BUILD_ID__/g, buildId);

      fs.writeFileSync(indexHtmlPath, patchedHtml, 'utf8');
      this.info(
        `[langkah-pulang] Ukuran file build otomatis disuntikkan ke dist/index.html: ${label} (${totalBytes} bytes) · build ${buildId}`,
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), langkahPulangBuildMetaPlugin()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 2800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const norm = id.replace(/\\/g, '/');
          if (norm.includes('/node_modules/three/')) return 'three';
          if (norm.includes('/node_modules/@react-three/')) return 'r3f';
          if (norm.includes('/node_modules/@supabase/')) return 'supabase';
          if (norm.includes('/src/data/')) return 'story-data';
          return undefined;
        },
      },
    },
  },
});
