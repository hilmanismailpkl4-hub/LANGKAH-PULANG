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

export function worldToMapPercent(x: number, z: number): { left: number; top: number } {
  const minX = -110;
  const maxX = 100;
  const minZ = -68;
  const maxZ = 90;
  const left = Math.max(3, Math.min(97, ((x - minX) / (maxX - minX)) * 100));
  const top = Math.max(4, Math.min(96, ((z - minZ) / (maxZ - minZ)) * 100));
  return { left, top };
}

export function getLocationAtPosition(pos: [number, number, number]): LocationInfo {
  const [x, y, z] = pos;
  if (y > 14) {
    return LOCATION_BY_ID.rooftop;
  }

  let best: LocationInfo = LOCATION_BY_ID.perumahan;
  let bestScore = Infinity;

  for (const loc of WORLD_LOCATIONS) {
    if (loc.id === 'rooftop') continue;
    const dist = Math.hypot(x - loc.center[0], z - loc.center[2]);
    if (dist <= loc.radius && dist < bestScore) {
      best = loc;
      bestScore = dist;
    }
  }

  if (bestScore === Infinity) {
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

export function isPositionIndoors(x: number, y: number, z: number): boolean {
  if (y > 14) return false;
  // Rumah Keluarga Damar
  if (x >= -27 && x <= -13 && z >= 62 && z <= 74) return true;
  // Kedai Kopi Sudut (Bima)
  if (x >= -28 && x <= -12 && z >= 14 && z <= 27) return true;
  // Kios 24 Jam Harmoni
  if (x >= 17.6 && x <= 31.4 && z >= 17.6 && z <= 28.4) return true;
  // Toko Musik "Nada Lama"
  if (x >= -29.4 && x <= -14.6 && z >= -31.4 && z <= -19.6) return true;
  return false;
}

/**
 * Area teduh dari hujan (seluruh ruangan + atap Halte Bus Kota Jl. Kenangan & kanopi Stasiun Senja)
 * agar payung bening Damar, Nadia & Kira otomatis terlipat saat berteduh!
 */
export function isPositionSheltered(x: number, y: number, z: number): boolean {
  if (isPositionIndoors(x, y, z)) return true;
  if (y > 14) return false;
  // Atap Halte Bus Kota Jl. Kenangan
  if (x >= 18.5 && x <= 24.5 && z >= 9.6 && z <= 12.1) return true;
  // Kanopi Peron Stasiun Kereta Tua Senja
  if (x >= 75.5 && x <= 87.2 && z >= -21.0 && z <= 13.0) return true;
  // Gazebo Panggung Akustik Taman Kota
  if (x >= -70.6 && x <= -65.4 && z >= 16.9 && z <= 22.1) return true;
  return false;
}

export function getSurfaceAtPosition(x: number, y: number, z: number): SurfaceType {
  if (y > 14) return 'asphalt';
  if (x >= -27 && x <= -13 && z >= 62 && z <= 74) return 'wood';
  if (x >= -28 && x <= -12 && z >= 13 && z <= 27) return 'wood';
  if (x >= -29.4 && x <= -14.6 && z >= -31.4 && z <= -19.6) return 'wood';
  if (x >= -77 && x <= -68 && z >= -31 && z <= -25) return 'wood';
  if (x < -58 && !(z > -7 && z < 7)) return 'grass';
  if (z > 53 && x > -34 && x < 48 && !(x >= -27 && x <= -13 && z >= 62 && z <= 74)) {
    if (Math.abs(x - -20) > 2.2) return 'grass';
  }
  return 'asphalt';
}

/**
 * Seluruh objek kotak solid di ground level — bangunan, furnitur, kendaraan parkir, pagar,
 * bangku taman, lapak buku, dan perairan (hukum fisika 100% solid, tidak ada yang bisa ditembus).
 */
export const GROUND_COLLIDERS: ColliderBox[] = [
  // === 1. Rumah Keluarga Damar (dinding, meja makan, meja kerja, kulkas, sofa, pagar & motor) ===
  { id: 'rumah_back', minX: -27.4, maxX: -12.6, minZ: 73.6, maxZ: 74.6 },
  { id: 'rumah_left', minX: -27.4, maxX: -26.5, minZ: 61.6, maxZ: 74.6 },
  { id: 'rumah_right', minX: -13.5, maxX: -12.6, minZ: 61.6, maxZ: 74.6 },
  { id: 'rumah_front_l', minX: -27.4, maxX: -21.8, minZ: 61.6, maxZ: 62.4 },
  { id: 'rumah_front_r', minX: -18.2, maxX: -12.6, minZ: 61.6, maxZ: 62.4 },
  { id: 'rumah_table', minX: -18.9, maxX: -16.1, minZ: 65.1, maxZ: 66.7 },
  { id: 'rumah_desk', minX: -26.25, maxX: -23.75, minZ: 71.5, maxZ: 72.75 },
  { id: 'rumah_fridge', minX: -15.15, maxX: -13.85, minZ: 71.8, maxZ: 73.0 },
  { id: 'rumah_sofa', minX: -24.95, maxX: -23.5, minZ: 64.1, maxZ: 67.1 },
  { id: 'rumah_kira_corner', minX: -20.85, maxX: -18.75, minZ: 71.85, maxZ: 73.65 },
  { id: 'rumah_wardrobe', minX: -26.85, maxX: -25.85, minZ: 68.35, maxZ: 70.15 },
  { id: 'rumah_tv_console', minX: -14.15, maxX: -13.2, minZ: 67.85, maxZ: 69.95 },
  { id: 'rumah_fence_l', minX: -27.4, maxX: -22.0, minZ: 53.6, maxZ: 54.4 },
  { id: 'rumah_fence_r', minX: -18.0, maxX: -12.6, minZ: 53.6, maxZ: 54.4 },

  // === 2. Perumahan Melati ===
  { id: 'house_n1', minX: 10.1, maxX: 20.9, minZ: 65.4, maxZ: 76.6 },
  { id: 'house_n2', minX: 25.3, maxX: 36.7, minZ: 65.4, maxZ: 76.6 },
  { id: 'house_n3', minX: -5.9, maxX: 4.9, minZ: 66.1, maxZ: 76.9 },

  // === 3. Kedai Kopi Bima ===
  { id: 'cafe_back', minX: -28.4, maxX: -12.0, minZ: 26.6, maxZ: 27.6 },
  { id: 'cafe_left', minX: -28.4, maxX: -27.4, minZ: 13.8, maxZ: 27.6 },
  { id: 'cafe_right', minX: -12.8, maxX: -12.0, minZ: 13.8, maxZ: 27.6 },
  { id: 'cafe_counter', minX: -24.6, maxX: -17.4, minZ: 21.8, maxZ: 23.4 },
  { id: 'cafe_coffee_table', minX: -25.7, maxX: -24.3, minZ: 16.8, maxZ: 18.2 },

  // === 4. Kios 24 Jam Harmoni (Interior Terbuka + Dinding, Kulkas, Rak & Kasir Solid) ===
  { id: 'kios_back', minX: 17.4, maxX: 31.6, minZ: 27.95, maxZ: 28.6 },
  { id: 'kios_left', minX: 17.4, maxX: 18.0, minZ: 17.4, maxZ: 28.6 },
  { id: 'kios_right', minX: 31.0, maxX: 31.6, minZ: 17.4, maxZ: 28.6 },
  { id: 'kios_front_l', minX: 17.4, maxX: 22.72, minZ: 17.4, maxZ: 17.95 },
  { id: 'kios_front_r', minX: 26.28, maxX: 31.6, minZ: 17.4, maxZ: 17.95 },
  { id: 'kios_fridges', minX: 19.6, maxX: 29.4, minZ: 26.75, maxZ: 28.1 },
  { id: 'kios_shelf_1', minX: 20.65, maxX: 21.95, minZ: 21.3, maxZ: 24.9 },
  { id: 'kios_shelf_2', minX: 24.35, maxX: 25.65, minZ: 21.3, maxZ: 24.9 },
  { id: 'kios_cashier', minX: 28.5, maxX: 30.15, minZ: 20.6, maxZ: 24.6 },
  { id: 'kios_table', minX: 19.75, maxX: 21.25, minZ: 13.45, maxZ: 14.95 },

  // === 5. Toko Musik "Nada Lama" (Interior Terbuka + Dinding, Kasir, Rak Kaset & Sofa Solid) ===
  { id: 'music_back', minX: -29.6, maxX: -14.4, minZ: -31.6, maxZ: -31.0 },
  { id: 'music_left', minX: -29.6, maxX: -28.95, minZ: -31.6, maxZ: -19.4 },
  { id: 'music_right', minX: -15.05, maxX: -14.4, minZ: -31.6, maxZ: -19.4 },
  { id: 'music_front_l', minX: -29.6, maxX: -23.78, minZ: -19.9, maxZ: -19.35 },
  { id: 'music_front_r', minX: -20.22, maxX: -14.4, minZ: -19.9, maxZ: -19.35 },
  { id: 'music_counter', minX: -20.3, maxX: -15.7, minZ: -29.35, maxZ: -27.85 },
  { id: 'music_cassette_rack', minX: -27.15, maxX: -25.65, minZ: -27.65, maxZ: -23.15 },
  { id: 'music_amp_sofa', minX: -17.6, maxX: -16.0, minZ: -25.4, maxZ: -22.1 },

  // === 6. Menara Nusantara + Meja Lobi ===
  { id: 'office_core', minX: 16.5, maxX: 41.5, minZ: -43.5, maxZ: -25.7 },
  { id: 'office_pillar_l', minX: 16.4, maxX: 18.0, minZ: -25.8, maxZ: -19.2 },
  { id: 'office_pillar_r', minX: 40.0, maxX: 41.6, minZ: -25.8, maxZ: -19.2 },
  { id: 'office_lobby_desk', minX: 33.0, maxX: 35.4, minZ: -24.05, maxZ: -22.75 },

  // === 7. Seluruh Gedung Skyline Sekitar ===
  { id: 'city_block_ne', minX: 45.6, maxX: 56.4, minZ: -43.7, maxZ: -22.3 },
  { id: 'city_block_se', minX: 38.3, maxX: 53.7, minZ: 16.3, maxZ: 33.7 },
  { id: 'city_block_nw', minX: -28.4, maxX: -13.6, minZ: -53.9, maxZ: -40.1 },
  { id: 'city_block_north1', minX: -11.9, maxX: 1.9, minZ: -60.5, maxZ: -47.5 },
  { id: 'city_block_north2', minX: 55.8, maxX: 72.2, minZ: -61.2, maxZ: -46.8 },
  { id: 'city_block_se2', minX: 52.8, maxX: 67.2, minZ: 44.8, maxZ: 63.2 },
  { id: 'city_block_nw2', minX: -57.2, maxX: -38.8, minZ: -67.2, maxZ: -52.8 },

  // === 8. Stasiun Kereta Tua + Lapak Buku Pak Darman ===
  { id: 'station_tracks', minX: 89.2, maxX: 102, minZ: -70, maxZ: 90 },
  { id: 'station_office', minX: 72.9, maxX: 79.1, minZ: -24.0, maxZ: -12.1 },
  { id: 'station_bookstall', minX: 74.35, maxX: 77.25, minZ: -3.3, maxZ: -1.7 },

  // === 9. Jembatan & Pagar Pembatas (tidak bisa loncat/tembus pagar jembatan!) ===
  { id: 'bridge_rail_n', minX: -58.0, maxX: -38.0, minZ: -7.1, maxZ: -6.2 },
  { id: 'bridge_rail_s', minX: -58.0, maxX: -38.0, minZ: 6.2, maxZ: 7.1 },
  { id: 'bridge_south_n', minX: -57.8, maxX: -38.2, minZ: 44.1, maxZ: 44.7 },
  { id: 'bridge_south_s', minX: -57.8, maxX: -38.2, minZ: 51.3, maxZ: 51.9 },

  // === 10. Sungai Kota & Danau Senja ===
  { id: 'river_north', minX: -55.8, maxX: -40.2, minZ: -70, maxZ: -6.8 },
  { id: 'river_mid', minX: -55.8, maxX: -40.2, minZ: 6.8, maxZ: 44.3 },
  { id: 'river_south', minX: -55.8, maxX: -40.2, minZ: 51.7, maxZ: 92 },

  { id: 'lake_north', minX: -98.2, maxX: -70.2, minZ: -43.5, maxZ: -30.2 },
  { id: 'lake_south', minX: -98.2, maxX: -70.2, minZ: -25.8, maxZ: -12.8 },
  { id: 'lake_west', minX: -98.2, maxX: -77.7, minZ: -30.2, maxZ: -25.8 },

  // === 11. Bangku Taman Kota & Gerobak Angkringan Pak Slamet ===
  { id: 'bench_taman_1', minX: -69.2, maxX: -66.8, minZ: -18.55, maxZ: -17.45 },
  { id: 'bench_taman_2', minX: -79.2, maxX: -76.8, minZ: -9.0, maxZ: -8.0 },
  { id: 'bench_taman_3', minX: -70.7, maxX: -68.3, minZ: -14.7, maxZ: -13.7 },
  { id: 'angkringan_cart', minX: -16.5, maxX: -13.9, minZ: 39.0, maxZ: 40.6 },
  { id: 'angkringan_bench', minX: -16.3, maxX: -14.1, minZ: 37.9, maxZ: 38.75 },

  // === 12. Taman Bermain Anak (Selatan Taman Kota) ===
  { id: 'playground_swing_l', minX: -84.05, maxX: -83.35, minZ: 19.6, maxZ: 21.4 },
  { id: 'playground_swing_r', minX: -80.25, maxX: -79.55, minZ: 19.6, maxZ: 21.4 },
  { id: 'playground_slide', minX: -78.4, maxX: -76.0, minZ: 21.9, maxZ: 24.7 },
  { id: 'playground_bench', minX: -84.9, maxX: -82.5, minZ: 24.55, maxZ: 25.55 },

  // === 13. Halte Bus Kota Modern (Tepi Jl. Kenangan) ===
  { id: 'bus_stop_back', minX: 18.6, maxX: 24.4, minZ: 11.65, maxZ: 12.15 },
  { id: 'bus_stop_bench', minX: 19.3, maxX: 23.0, minZ: 10.85, maxZ: 11.55 },
  { id: 'bus_stop_side_r', minX: 24.1, maxX: 24.55, minZ: 9.8, maxZ: 12.05 },

  // === 14. Kotak Buku Jalanan ("Taman Baca Mini") di Taman Kota ===
  { id: 'park_book_box', minX: -73.0, maxX: -72.0, minZ: -8.65, maxZ: -7.75 },
];

/**
 * Kolisi silinder/lingkaran solid untuk seluruh batang pohon, pohon palem, tiang lampu jalan,
 * tiang lampu lalu lintas, tiang stasiun, semak bunga, dan kucing "Sore".
 */
export const STATIC_CIRCLE_COLLIDERS: { x: number; z: number; r: number }[] = [
  // 34 Batang Pohon Kota
  ...([
    [-65, -4], [-74, -4], [-86, -6], [-98, -14], [-102, -28], [-99, -44],
    [-84, -49], [-68, -45], [-63, -34], [-64, -16], [-74, 12], [-90, 10],
    [-66, 28], [-78, 38], [-31, 56], [-10, 56], [5, 56], [21, 56],
    [39, 58], [-28, 79], [-8, 81], [16, 81], [-36, -14], [-36, 16],
    [-36, 32], [-10, -11], [11, -11], [11, 11], [-11, 36], [11, 36],
    [54, -10], [54, 14], [70, 22], [72, -32],
  ] as [number, number][]).map(([x, z]) => ({ x, z, r: 0.45 })),

  // 14 Pohon Palem Tropis
  ...([
    [-34, -9.5], [-15, -9.5], [14, -9.5], [36, -9.5],
    [-34, 9.5], [-14, 9.5], [14, 9.5], [36, 9.5],
    [-60, -10], [-60, 10], [-60, 26], [-60, -28],
    [58, -18], [58, 16],
  ] as [number, number][]).map(([x, z]) => ({ x, z, r: 0.36 })),

  // 26 Tiang Lampu Jalan
  ...([
    [-56, -7], [-48, -7], [-40, -7], [-56, 7], [-48, 7], [-40, 7],
    [-26, -8], [-10, -8], [10, -8], [28, -8], [48, -8],
    [-26, 8], [-10, 8], [10, 8], [28, 8], [48, 8],
    [-8, 26], [8, 26], [-8, 44], [8, 44], [-22, 52], [22, 52],
    [60, -24], [60, 10], [-68, -19], [-78, -9],
  ] as [number, number][]).map(([x, z]) => ({ x, z, r: 0.22 })),

  // 4 Tiang Lampu Lalu Lintas Persimpangan
  { x: 6.8, z: 6.8, r: 0.26 },
  { x: -6.8, z: -6.8, r: 0.26 },
  { x: -6.8, z: 6.8, r: 0.26 },
  { x: 6.8, z: -6.8, r: 0.26 },

  // 4 Tiang Kanopi Stasiun
  { x: 81.5, z: -16, r: 0.32 },
  { x: 81.5, z: -6, r: 0.32 },
  { x: 81.5, z: 4, r: 0.32 },
  { x: 81.5, z: 14, r: 0.32 },

  // 12 Semak Bunga Tepi Jalan
  ...([
    [-26, 53.3], [-14, 53.3], [-22.5, 61.2], [-17.5, 61.2],
    [12, 63.5], [26.5, 63.5], [-27.5, 13.5], [-12.5, 13.5],
    [16.5, -18.5], [41.5, -18.5], [-67, -24], [-67, -31],
  ] as [number, number][]).map(([x, z]) => ({ x, z, r: 0.56 })),

  // Kucing Oranye "Sore"
  { x: 9.5, z: 56.5, r: 0.36 },

  // 4 Tiang Sudut Gazebo Panggung Akustik Taman Kota + Stand Gitar
  { x: -70.3, z: 17.2, r: 0.24 },
  { x: -65.7, z: 17.2, r: 0.24 },
  { x: -70.3, z: 21.8, r: 0.24 },
  { x: -65.7, z: 21.8, r: 0.24 },
];

export const ROOFTOP_BOUNDS = {
  minX: 18.0,
  maxX: 39.5,
  minZ: -42.0,
  maxZ: -21.8,
  elevation: 22,
};

// Objek solid di atas Rooftop (Kabin Lift & Bangku Santai Rooftop)
export const ROOFTOP_COLLIDERS: ColliderBox[] = [
  { id: 'rooftop_elevator_cabin', minX: 18.0, maxX: 21.6, minZ: -27.1, maxZ: -23.75 },
  { id: 'rooftop_bench', minX: 26.7, maxX: 30.3, minZ: -23.5, maxZ: -22.5 },
];

export const ELEVATOR_PORTALS = {
  lobbyPos: [19.5, 0.08, -22.4] as [number, number, number],
  rooftopPos: [19.8, 22, -23.2] as [number, number, number],
};

export function resolvePlayerMovement(
  currentX: number,
  currentY: number,
  currentZ: number,
  nextX: number,
  nextZ: number,
  isScooter = false,
): [number, number, number] {
  const radius = isScooter ? 0.68 : 0.45;

  // === FISIKA SOLID ROOFTOP (Y = 22) ===
  if (currentY > 14) {
    let rx = Math.max(ROOFTOP_BOUNDS.minX, Math.min(ROOFTOP_BOUNDS.maxX, nextX));
    let rz = Math.max(ROOFTOP_BOUNDS.minZ, Math.min(ROOFTOP_BOUNDS.maxZ, nextZ));

    const hitsRoof = (px: number, pz: number) => {
      for (const box of ROOFTOP_COLLIDERS) {
        if (
          px + radius > box.minX &&
          px - radius < box.maxX &&
          pz + radius > box.minZ &&
          pz - radius < box.maxZ
        ) {
          return true;
        }
      }
      return false;
    };

    if (hitsRoof(rx, currentZ)) rx = currentX;
    if (hitsRoof(rx, rz)) rz = currentZ;
    return [rx, ROOFTOP_BOUNDS.elevation, rz];
  }

  // === FISIKA SOLID GROUND LEVEL ===
  let rx = Math.max(WORLD_BOUNDS.minX, Math.min(WORLD_BOUNDS.maxX, nextX));
  let rz = Math.max(WORLD_BOUNDS.minZ, Math.min(WORLD_BOUNDS.maxZ, nextZ));

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
    for (const c of STATIC_CIRCLE_COLLIDERS) {
      if (Math.hypot(px - c.x, pz - c.z) < radius + c.r) {
        return true;
      }
    }
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
    for (const npc of playerRuntime.npcColliders) {
      if (Math.hypot(px - npc.x, pz - npc.z) < radius + npc.radius) {
        return true;
      }
    }
    for (const walker of playerRuntime.walkerColliders) {
      if (Math.hypot(px - walker.x, pz - walker.z) < radius + walker.radius) {
        return true;
      }
    }
    // Saat tidak mengendarai skuter/sepeda, kendaraan terparkir tetap solid 100%!
    if (!isScooter) {
      const [sx, , sz] = playerRuntime.scooter.pos;
      if (Math.hypot(px - sx, pz - sz) < radius + 0.62) {
        return true;
      }
      if (!playerRuntime.bicycle.isRiding) {
        const [bx, , bz] = playerRuntime.bicycle.pos;
        if (Math.hypot(px - bx, pz - bz) < radius + 0.54) {
          return true;
        }
      }
    } else {
      // Kendaraan tidak boleh masuk ke dalam interior rumah Damar / Kedai Bima / Kios / Toko Musik / dermaga kayu
      if (!playerRuntime.scooter.isRiding) {
        const [sx, , sz] = playerRuntime.scooter.pos;
        if (Math.hypot(px - sx, pz - sz) < radius + 0.62) return true;
      }
      if (!playerRuntime.bicycle.isRiding) {
        const [bx, , bz] = playerRuntime.bicycle.pos;
        if (Math.hypot(px - bx, pz - bz) < radius + 0.54) return true;
      }
      if (px > -27.5 && px < -12.5 && pz > 61.2 && pz < 74.8) return true;
      if (px > -28.5 && px < -11.8 && pz > 13.5 && pz < 27.8) return true;
      if (px > 17.2 && px < 31.8 && pz > 17.2 && pz < 28.8) return true;
      if (px > -29.8 && px < -14.2 && pz > -31.8 && pz < -19.2) return true;
      if (px > -78.0 && px < -68.0 && pz > -31.0 && pz < -25.0) return true;
    }
    return false;
  };

  if (hitsObstacle(rx, currentZ)) {
    rx = currentX;
  }
  if (hitsObstacle(rx, rz)) {
    rz = currentZ;
  }

  // Dorong keluar lembut bila objek bergerak (mobil / pejalan kaki) mendekati batas fisik Damar
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

  for (const walker of playerRuntime.walkerColliders) {
    const dx = rx - walker.x;
    const dz = rz - walker.z;
    const d = Math.hypot(dx, dz);
    const minDist = radius + walker.radius + 0.02;
    if (d > 0.001 && d < minDist) {
      rx = walker.x + (dx / d) * minDist;
      rz = walker.z + (dz / d) * minDist;
    }
  }

  // Elevasi halus
  let ry = 0;
  if (rx >= -57 && rx <= -39 && ((rz >= -7 && rz <= 7) || (rz >= 44.5 && rz <= 51.5))) {
    ry = 0.24;
  } else if (rx >= -27 && rx <= -13 && rz >= 62 && rz <= 74) {
    ry = 0.08;
  } else if (rx >= -28 && rx <= -12 && rz >= 14 && rz <= 27) {
    ry = 0.08;
  } else if (rx >= 17.6 && rx <= 31.4 && rz >= 17.6 && rz <= 28.4) {
    ry = 0.08;
  } else if (rx >= -29.4 && rx <= -14.6 && rz >= -31.4 && rz <= -19.6) {
    ry = 0.08;
  } else if (rx >= 17 && rx <= 41 && rz >= -25.8 && rz <= -19) {
    ry = 0.08;
  } else if (rx >= 72 && rx <= 89 && rz >= -24 && rz <= 16) {
    ry = 0.1;
  } else if (rx >= -77 && rx <= -69 && rz >= -30.5 && rz <= -25.5) {
    ry = 0.12;
  } else if (rx >= -70.5 && rx <= -65.5 && rz >= 17.0 && rz <= 22.0) {
    ry = 0.22;
  }

  return [rx, ry, rz];
}

/**
 * Fisika solid 100% khusus pendamping keluarga (Nadia & Kira) saat berjalan bersama Damar:
 * tidak pernah menembus tembok, furnitur, pohon, sungai, danau, atau mobil,
 * serta otomatis menyesuaikan elevasi jembatan, lantai rumah/kafe, dan rooftop.
 */
export function resolveCompanionMovement(
  currentX: number,
  currentY: number,
  currentZ: number,
  nextX: number,
  nextZ: number,
  radius = 0.34,
): [number, number, number] {
  if (currentY > 14) {
    let rx = Math.max(ROOFTOP_BOUNDS.minX + 0.4, Math.min(ROOFTOP_BOUNDS.maxX - 0.4, nextX));
    let rz = Math.max(ROOFTOP_BOUNDS.minZ + 0.4, Math.min(ROOFTOP_BOUNDS.maxZ - 0.4, nextZ));
    const hitsRoof = (px: number, pz: number) =>
      ROOFTOP_COLLIDERS.some(
        (box) =>
          px + radius > box.minX &&
          px - radius < box.maxX &&
          pz + radius > box.minZ &&
          pz - radius < box.maxZ,
      );
    if (hitsRoof(rx, currentZ)) rx = currentX;
    if (hitsRoof(rx, rz)) rz = currentZ;
    return [rx, ROOFTOP_BOUNDS.elevation, rz];
  }

  let rx = Math.max(WORLD_BOUNDS.minX, Math.min(WORLD_BOUNDS.maxX, nextX));
  let rz = Math.max(WORLD_BOUNDS.minZ, Math.min(WORLD_BOUNDS.maxZ, nextZ));

  const hits = (px: number, pz: number) => {
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
    for (const c of STATIC_CIRCLE_COLLIDERS) {
      if (Math.hypot(px - c.x, pz - c.z) < radius + c.r) {
        return true;
      }
    }
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
    return false;
  };

  if (hits(rx, currentZ)) rx = currentX;
  if (hits(rx, rz)) rz = currentZ;

  let ry = 0;
  if (rx >= -57 && rx <= -39 && ((rz >= -7 && rz <= 7) || (rz >= 44.5 && rz <= 51.5))) {
    ry = 0.24;
  } else if (rx >= -27 && rx <= -13 && rz >= 62 && rz <= 74) {
    ry = 0.08;
  } else if (rx >= -28 && rx <= -12 && rz >= 14 && rz <= 27) {
    ry = 0.08;
  } else if (rx >= 17.6 && rx <= 31.4 && rz >= 17.6 && rz <= 28.4) {
    ry = 0.08;
  } else if (rx >= -29.4 && rx <= -14.6 && rz >= -31.4 && rz <= -19.6) {
    ry = 0.08;
  } else if (rx >= 17 && rx <= 41 && rz >= -25.8 && rz <= -19) {
    ry = 0.08;
  } else if (rx >= 72 && rx <= 89 && rz >= -24 && rz <= 16) {
    ry = 0.1;
  } else if (rx >= -77 && rx <= -69 && rz >= -30.5 && rz <= -25.5) {
    ry = 0.12;
  } else if (rx >= -70.5 && rx <= -65.5 && rz >= 17.0 && rz <= 22.0) {
    ry = 0.22;
  }

  return [rx, ry, rz];
}
