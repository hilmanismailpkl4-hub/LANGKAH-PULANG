import { playerRuntime } from '../store/playerRuntime';
import { ColliderBox, LocationId, LocationInfo, SurfaceType } from '../types/game';

export const WORLD_BOUNDS = {
  minX: -108,
  maxX: 98,
  minZ: -64,
  maxZ: 88,
};

export const WORLD_LOCATIONS: LocationInfo[] = [
  {
    id: 'rumah_damar',
    name: 'Rumah Keluarga Damar',
    subtitle: 'Jl. Melati No. 14',
    center: [-20, 0, 66],
    radius: 15,
    mapX: 43,
    mapY: 85,
    musicMood: 'home',
  },
  {
    id: 'perumahan',
    name: 'Kawasan Perumahan Melati',
    subtitle: 'Gang Teduh & Teras Tetangga',
    center: [18, 0, 64],
    radius: 22,
    mapX: 61,
    mapY: 84,
    musicMood: 'home',
  },
  {
    id: 'kedai_bima',
    name: 'Kedai Kopi Sudut',
    subtitle: 'Kafe Kayu Milik Bima',
    center: [-20, 0, 20],
    radius: 14,
    mapX: 43,
    mapY: 56,
    musicMood: 'cafe',
  },
  {
    id: 'minimarket',
    name: 'Kios 24 Jam Harmoni',
    subtitle: 'Minimarket Sudut Kota',
    center: [24, 0, 20],
    radius: 14,
    mapX: 64,
    mapY: 56,
    musicMood: 'city',
  },
  {
    id: 'toko_musik',
    name: 'Toko Musik "Nada Lama"',
    subtitle: 'Gitar, Kaset & Barang Antik',
    center: [-22, 0, -24],
    radius: 14,
    mapX: 42,
    mapY: 28,
    musicMood: 'cafe',
  },
  {
    id: 'perkantoran',
    name: 'Menara Nusantara',
    subtitle: 'Gedung Perkantoran & Lobi Kerja',
    center: [28, 0, -30],
    radius: 18,
    mapX: 66,
    mapY: 24,
    musicMood: 'office',
  },
  {
    id: 'rooftop',
    name: 'Rooftop Menara Nusantara',
    subtitle: 'Balkon Pemandangan Kota',
    center: [28, 22, -32],
    radius: 16,
    mapX: 66,
    mapY: 16,
    musicMood: 'rooftop',
  },
  {
    id: 'stasiun_tua',
    name: 'Stasiun Kereta Tua Senja',
    subtitle: 'Peron Lama & Lapak Buku',
    center: [80, 0, -4],
    radius: 18,
    mapX: 90,
    mapY: 41,
    musicMood: 'city',
  },
  {
    id: 'jembatan_sungai',
    name: 'Jembatan Tepi Sungai',
    subtitle: 'Penyeberangan Jl. Kenangan',
    center: [-48, 0.25, 0],
    radius: 15,
    mapX: 29,
    mapY: 43,
    musicMood: 'park',
  },
  {
    id: 'taman_danau',
    name: 'Taman Kota & Danau Senja',
    subtitle: 'Dermaga Kayu & Pepohonan',
    center: [-82, 0, -24],
    radius: 30,
    mapX: 13,
    mapY: 28,
    musicMood: 'park',
  },
];

export const LOCATION_BY_ID: Record<LocationId, LocationInfo> = WORLD_LOCATIONS.reduce(
  (acc, loc) => {
    acc[loc.id] = loc;
    return acc;
  },
  {} as Record<LocationId, LocationInfo>,
);

/**
 * Konversi koordinat 3D (x, z) ke persen peta 2D (0..100).
 */
export function worldToMapPercent(x: number, z: number): { left: number; top: number } {
  const minX = -110;
  const maxX = 100;
  const minZ = -68;
  const maxZ = 90;
  const left = Math.max(4, Math.min(96, ((x - minX) / (maxX - minX)) * 100));
  const top = Math.max(5, Math.min(95, ((z - minZ) / (maxZ - minZ)) * 100));
  return { left, top };
}

/**
 * Menentukan lokasi aktif berdasarkan koordinat pemain.
 */
export function getLocationAtPosition(pos: [number, number, number]): LocationInfo {
  const [x, y, z] = pos;
  if (y > 14) {
    return LOCATION_BY_ID.rooftop;
  }

  let best: LocationInfo = LOCATION_BY_ID.perumahan;
  let bestScore = Infinity;

  for (const loc of WORLD_LOCATIONS) {
    if (loc.id === 'rooftop') continue;
    const dx = x - loc.center[0];
    const dz = z - loc.center[2];
    const dist = Math.hypot(dx, dz);
    if (dist <= loc.radius && dist < bestScore) {
      best = loc;
      bestScore = dist;
    }
  }

  if (bestScore === Infinity) {
    // Fallback ke lokasi terdekat
    for (const loc of WORLD_LOCATIONS) {
      if (loc.id === 'rooftop') continue;
      const dist = Math.hypot(x - loc.center[0], z - loc.center[2]);
      if (dist < bestScore) {
        best = loc;
        bestScore = dist;
      }
    }
  }

  return best;
}

/**
 * Deteksi jenis permukaan di bawah kaki Damar untuk efek suara langkah realistis.
 */
export function getSurfaceAtPosition(x: number, y: number, z: number): SurfaceType {
  if (y > 14) return 'asphalt';
  // Interior Rumah Damar
  if (x >= -27 && x <= -13 && z >= 62 && z <= 74) return 'wood';
  // Interior & teras Kedai Kopi Bima
  if (x >= -28 && x <= -12 && z >= 13 && z <= 27) return 'wood';
  // Dermaga kayu Danau Senja
  if (x >= -77 && x <= -68 && z >= -31 && z <= -25) return 'wood';
  // Area rumput Taman Kota (kecuali jalan setapak & jembatan)
  if (x < -58 && !(z > -7 && z < 7)) return 'grass';
  // Halaman rumput perumahan
  if (z > 53 && x > -34 && x < 48 && !(x >= -27 && x <= -13 && z >= 62 && z <= 74)) {
    if (Math.abs(x - -20) > 2.2) return 'grass';
  }
  return 'asphalt';
}

/**
 * Kotak kolisi AABB (ground level) agar Damar berjalan mulus di dalam rumah, kafe, dan jalan kota tanpa menembus tembok/sungai/danau.
 */
export const GROUND_COLLIDERS: ColliderBox[] = [
  // === Rumah Keluarga Damar (terbuka di pintu depan x:-21.6..-18.4, z:62) ===
  { id: 'rumah_back', minX: -27.4, maxX: -12.6, minZ: 73.6, maxZ: 74.6 },
  { id: 'rumah_left', minX: -27.4, maxX: -26.5, minZ: 61.6, maxZ: 74.6 },
  { id: 'rumah_right', minX: -13.5, maxX: -12.6, minZ: 61.6, maxZ: 74.6 },
  { id: 'rumah_front_l', minX: -27.4, maxX: -21.8, minZ: 61.6, maxZ: 62.4 },
  { id: 'rumah_front_r', minX: -18.2, maxX: -12.6, minZ: 61.6, maxZ: 62.4 },
  { id: 'rumah_table', minX: -19.0, maxX: -16.0, minZ: 65.0, maxZ: 66.8 },
  { id: 'rumah_fence_l', minX: -27.4, maxX: -22.2, minZ: 53.6, maxZ: 54.3 },
  { id: 'rumah_fence_r', minX: -17.8, maxX: -12.6, minZ: 53.6, maxZ: 54.3 },

  // === Perumahan Melati (rumah-rumah tetangga solid) ===
  { id: 'house_n1', minX: 10, maxX: 21, minZ: 65, maxZ: 77 },
  { id: 'house_n2', minX: 25, maxX: 37, minZ: 65, maxZ: 77 },
  { id: 'house_n3', minX: -6, maxX: 5, minZ: 66, maxZ: 77 },

  // === Kedai Kopi Bima (terbuka di sisi utara z:14, x:-22..-16) ===
  { id: 'cafe_back', minX: -28.4, maxX: -12.0, minZ: 26.6, maxZ: 27.6 },
  { id: 'cafe_left', minX: -28.4, maxX: -27.4, minZ: 14.0, maxZ: 27.6 },
  { id: 'cafe_right', minX: -12.8, maxX: -12.0, minZ: 14.0, maxZ: 27.6 },
  { id: 'cafe_counter', minX: -24.5, maxX: -17.5, minZ: 21.8, maxZ: 23.4 },

  // === Kios 24 Jam Harmoni ===
  { id: 'kios_body', minX: 17.5, maxX: 31.5, minZ: 17.5, maxZ: 28.5 },

  // === Toko Musik "Nada Lama" ===
  { id: 'music_body', minX: -29.5, maxX: -14.5, minZ: -31.5, maxZ: -19.5 },

  // === Menara Nusantara (lobi terbuka di selatan z:-20..-25, inti gedung di utara z:-43..-25.5) ===
  { id: 'office_core', minX: 16.5, maxX: 41.5, minZ: -43.5, maxZ: -25.8 },
  { id: 'office_pillar_l', minX: 16.5, maxX: 18.0, minZ: -25.8, maxZ: -19.2 },
  { id: 'office_pillar_r', minX: 40.0, maxX: 41.5, minZ: -25.8, maxZ: -19.2 },

  // === Gedung Kota Sekitar (dekoratif namun solid) ===
  { id: 'city_block_ne', minX: 46, maxX: 56, minZ: -44, maxZ: -22 },
  { id: 'city_block_se', minX: 38, maxX: 54, minZ: 16, maxZ: 34 },
  { id: 'city_block_nw', minX: -29, maxX: -14, minZ: -54, maxZ: -40 },

  // === Stasiun Kereta Tua (area rel kereta tidak bisa dimasuki) ===
  { id: 'station_tracks', minX: 89.5, maxX: 102, minZ: -70, maxZ: 90 },
  { id: 'station_office', minX: 73, maxX: 79, minZ: -24, maxZ: -12 },

  // === Sungai Kota (terbuka pada 2 jembatan: z:-6.5..6.5 dan z:45..51) ===
  { id: 'river_north', minX: -55.5, maxX: -40.5, minZ: -70, maxZ: -6.8 },
  { id: 'river_mid', minX: -55.5, maxX: -40.5, minZ: 6.8, maxZ: 44.5 },
  { id: 'river_south', minX: -55.5, maxX: -40.5, minZ: 51.5, maxZ: 92 },

  // === Danau Senja (berlubang di dermaga x:-77..-68, z:-30..-26) ===
  { id: 'lake_north', minX: -98, maxX: -72, minZ: -44, maxZ: -30.5 },
  { id: 'lake_south', minX: -98, maxX: -72, minZ: -25.5, maxZ: -13 },
  { id: 'lake_west', minX: -98, maxX: -77.5, minZ: -30.5, maxZ: -25.5 },
];

export const ROOFTOP_BOUNDS = {
  minX: 18.0,
  maxX: 39.5,
  minZ: -42.0,
  maxZ: -22.2,
  elevation: 22,
};

export const ELEVATOR_PORTALS = {
  lobbyPos: [19.5, 0.08, -22.4] as [number, number, number],
  rooftopPos: [19.8, 22, -23.5] as [number, number, number],
};

export function resolvePlayerMovement(
  currentX: number,
  currentY: number,
  currentZ: number,
  nextX: number,
  nextZ: number,
): [number, number, number] {
  const radius = 0.48;

  if (currentY > 14) {
    const cx = Math.max(ROOFTOP_BOUNDS.minX, Math.min(ROOFTOP_BOUNDS.maxX, nextX));
    const cz = Math.max(ROOFTOP_BOUNDS.minZ, Math.min(ROOFTOP_BOUNDS.maxZ, nextZ));
    return [cx, ROOFTOP_BOUNDS.elevation, cz];
  }

  let rx = Math.max(WORLD_BOUNDS.minX, Math.min(WORLD_BOUNDS.maxX, nextX));
  let rz = Math.max(WORLD_BOUNDS.minZ, Math.min(WORLD_BOUNDS.maxZ, nextZ));

  // Uji sumbu X dan Z terpisah terhadap bangunan, mobil berjalan/berhenti, dan tubuh NPC
  const hitsObstacle = (px: number, pz: number) => {
    for (const box of GROUND_COLLIDERS) {
      if (
        px + radius > box.minX &&
        px - radius < box.maxX &&
        pz + radius > box.minZ &&
        pz - radius < box.maxZ
      ) {
        return true;
      }
    }
    // Kolisi solid dengan seluruh mobil kota (mobil berhenti & tidak bisa ditembus!)
    for (const car of playerRuntime.dynamicCarBoxes) {
      if (
        px + radius > car.minX &&
        px - radius < car.maxX &&
        pz + radius > car.minZ &&
        pz - radius < car.maxZ
      ) {
        return true;
      }
    }
    // Kolisi lembut dengan tubuh NPC agar Damar tidak menembus karakter lain
    for (const npc of playerRuntime.npcColliders) {
      const dist = Math.hypot(px - npc.x, pz - npc.z);
      if (dist < radius + npc.radius) {
        return true;
      }
    }
    return false;
  };

  if (hitsObstacle(rx, currentZ)) {
    rx = currentX;
  }
  if (hitsObstacle(rx, rz)) {
    rz = currentZ;
  }

  // Dorong keluar lembut jika kebetulan terlalu dekat dengan mobil atau NPC
  for (const car of playerRuntime.dynamicCarBoxes) {
    if (
      rx + radius > car.minX &&
      rx - radius < car.maxX &&
      rz + radius > car.minZ &&
      rz - radius < car.maxZ
    ) {
      const cx = (car.minX + car.maxX) * 0.5;
      const cz = (car.minZ + car.maxZ) * 0.5;
      const dx = rx - cx;
      const dz = rz - cz;
      const halfW = (car.maxX - car.minX) * 0.5 + radius + 0.08;
      const halfD = (car.maxZ - car.minZ) * 0.5 + radius + 0.08;
      const penX = halfW - Math.abs(dx);
      const penZ = halfD - Math.abs(dz);
      if (penX < penZ) {
        rx = cx + (dx >= 0 ? halfW : -halfW);
      } else {
        rz = cz + (dz >= 0 ? halfD : -halfD);
      }
    }
  }

  // Hitung elevasi halus (jembatan sedikit lebih tinggi, interior lantai kayu sedikit naik)
  let ry = 0;
  if (rx >= -57 && rx <= -39 && ((rz >= -7 && rz <= 7) || (rz >= 44.5 && rz <= 51.5))) {
    ry = 0.24;
  } else if (rx >= -27 && rx <= -13 && rz >= 62 && rz <= 74) {
    ry = 0.08;
  } else if (rx >= -28 && rx <= -12 && rz >= 14 && rz <= 27) {
    ry = 0.08;
  } else if (rx >= 17 && rx <= 41 && rz >= -25.8 && rz <= -19) {
    ry = 0.08;
  } else if (rx >= 72 && rx <= 89 && rz >= -24 && rz <= 16) {
    ry = 0.1;
  } else if (rx >= -77 && rx <= -69 && rz >= -30.5 && rz <= -25.5) {
    ry = 0.12;
  }

  return [rx, ry, rz];
}
