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
  // Lobi Beratap Menara Nusantara
  if (x >= 17.5 && x <= 40.5 && z >= -26.0 && z <= -19.0) return true;
  // Tenda & Payung Lapak Es Kelapa Muda Pak Hasan di Tepi Danau
  if (x >= -86.2 && x <= -80.2 && z >= -11.4 && z <= -8.0) return true;
  // Kanopi Teras Warung Sudut Bu Rina (Perumahan Melati)
  if (x >= 12.2 && x <= 17.4 && z >= 49.4 && z <= 51.0) return true;
  // Atap Pos Kamling / Pos Ronda RT 04 Perumahan Melati
  if (x >= 25.3 && x <= 29.1 && z >= 55.2 && z <= 58.4) return true;
  // Payung Teduh Gerobak Es Dawet Ayu Pak Darmo (Plaza Menara Nusantara)
  if (x >= 40.2 && x <= 44.8 && z >= -15.4 && z <= -12.0) return true;
  // Tenda Kanopi Gerobak Siomay Bandung Mang Asep (Tepi Taman Kota)
  if (x >= -80.8 && x <= -77.2 && z >= 10.6 && z <= 14.2) return true;
  // Payung Lapak Sol Sepatu Pak Ujang & Tenda Gerobak Gorengan Mbak Yuni (Jl. Cempaka)
  if (x >= 9.6 && x <= 12.8 && z >= 20.2 && z <= 23.4) return true;
  if (x >= -12.8 && x <= -9.8 && z >= 29.8 && z <= 33.0) return true;
  // Tenda Warung Pecel Lele Lamongan (Jl. Kenangan) & Kanopi Pangkalan Ojek Stasiun Senja
  if (x >= 40.8 && x <= 45.6 && z >= 10.4 && z <= 13.6) return true;
  if (x >= 74.4 && x <= 78.6 && z >= 18.4 && z <= 21.4) return true;
  // Kanopi Pergola Kursi Ayunan Kayu Taman Kota
  if (x >= -65.2 && x <= -63.2 && z >= -29.0 && z <= -26.2) return true;
  // Payung Teduh Gerobak Es Doger Bang Toni (Trotoar Timur Jl. Cempaka Utara)
  if (x >= 10.0 && x <= 13.0 && z >= -27.2 && z <= -24.0) return true;
  // Payung Teduh Gerobak Ketoprak Jakarta Bang Jaja (Promenade Tepi Sungai Timur)
  if (x >= -38.2 && x <= -35.0 && z >= 34.6 && z <= 37.8) return true;
  // Payung Teduh Warkop & Kue Pasar Mang Dadang (Gerbang Barat Stasiun Senja)
  if (x >= 70.0 && x <= 73.2 && z >= -12.2 && z <= -9.2) return true;
  // Payung Teduh Gerobak Jasuke & Jagung Bakar Bang Roni (Tepi Taman Kota)
  if (x >= -75.8 && x <= -72.6 && z >= 14.8 && z <= 18.2) return true;
  // Payung Teduh Gerobak Es Krim Mas Eko (Jl. Melati) & Terpal Lapak Buah Mbak Sari (Perempatan Utama)
  if (x >= -7.2 && x <= -3.4 && z >= 52.0 && z <= 54.8) return true;
  if (x >= 11.2 && x <= 14.2 && z >= 13.3 && z <= 16.3) return true;
  // Kanopi Pangkas Rambut Rapi Jaya, Lapak Tanaman Bu Ningsih & Depot Galon Pak Ahmad
  if (x >= 12.4 && x <= 14.2 && z >= 36.2 && z <= 39.4) return true;
  if (x >= -68.9 && x <= -65.5 && z >= 33.4 && z <= 36.2) return true;
  if (x >= 23.4 && x <= 27.0 && z >= 39.8 && z <= 41.3) return true;
  // Payung Kios Bunga Ibu Lela (Tepi Taman Danau) & Gerobak Bubur Ayam Mang Ujang (Jl. Melati)
  if (x >= -91.4 && x <= -88.2 && z >= -10.3 && z <= -7.3) return true;
  if (x >= -23.8 && x <= -20.6 && z >= 36.8 && z <= 40.1) return true;
  // Serambi Mushola Al-Ikhlas, Payung Teh Poci Kang Ridwan & Kanopi Pos Trayek Angkot Jl. Kenangan
  if (x >= 41.6 && x <= 47.4 && z >= 60.8 && z <= 63.4) return true;
  if (x >= 31.2 && x <= 34.4 && z >= -15.5 && z <= -12.4) return true;
  if (x >= 29.9 && x <= 33.3 && z >= 10.6 && z <= 12.6) return true;
  // Payung Kue Putu Mang Oding, Atap Bengkel Mas Budi & Kanopi Laundry Harum Melati
  if (x >= -38.3 && x <= -35.0 && z >= -24.2 && z <= -21.0) return true;
  if (x >= 47.4 && x <= 51.0 && z >= -15.8 && z <= -12.6) return true;
  if (x >= 32.0 && x <= 35.6 && z >= 39.6 && z <= 41.3) return true;
  // Payung Cilok Mang Dedi, Kanopi Stasiun Sepeda Sewa Kota & Kanopi Reparasi Jam Pak Karto
  if (x >= -30.4 && x <= -27.2 && z >= -15.5 && z <= -12.4) return true;
  if (x >= 17.6 && x <= 22.0 && z >= -15.5 && z <= -13.4) return true;
  if (x >= 70.6 && x <= 73.2 && z >= 11.2 && z <= 14.0) return true;
  // Payung Gerobak Bandrek & Bajigur Abah Udin (Jl. Cempaka Utara)
  if (x >= -12.8 && x <= -9.5 && z >= -36.8 && z <= -33.6) return true;
  // Payung Sayur Ibu Tati, Kanopi Penjahit Sari Jahit & Atap Pos JPL 04 Stasiun Senja
  if (x >= 41.6 && x <= 44.8 && z >= 52.0 && z <= 55.0) return true;
  if (x >= 40.4 && x <= 44.0 && z >= 39.6 && z <= 41.3) return true;
  if (x >= 84.4 && x <= 87.5 && z >= 18.4 && z <= 21.2) return true;
  // Kanopi Apotek 24 Jam Sehat Melati & Payung Es Teler Bang Daud
  if (x >= -32.0 && x <= -28.4 && z >= 39.6 && z <= 41.3) return true;
  if (x >= -19.2 && x <= -16.0 && z >= -14.9 && z <= -11.8) return true;
  // Kanopi Konter Berkah Pulsa & Payung Sepeda Jamu Mbak Yem
  if (x >= 47.8 && x <= 51.4 && z >= 11.3 && z <= 13.0) return true;
  if (x >= -60.7 && x <= -57.7 && z >= 18.9 && z <= 21.9) return true;
  // Payung Pempek Cek Ani & Kanopi Toko Kue Dapur Manis
  if (x >= -38.3 && x <= -35.0 && z >= -32.4 && z <= -29.2) return true;
  if (x >= 47.4 && x <= 51.0 && z >= 39.6 && z <= 41.3) return true;
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
  { id: 'rumah_coffee_table', minX: -22.76, maxX: -21.94, minZ: 64.88, maxZ: 66.32 },
  { id: 'rumah_kira_corner', minX: -20.85, maxX: -18.75, minZ: 71.85, maxZ: 73.65 },
  { id: 'rumah_kitchen_counter', minX: -18.25, maxX: -15.55, minZ: 72.52, maxZ: 73.65 },
  { id: 'rumah_wardrobe', minX: -26.85, maxX: -25.85, minZ: 68.35, maxZ: 70.15 },
  { id: 'rumah_tv_console', minX: -14.15, maxX: -13.2, minZ: 67.85, maxZ: 69.95 },
  { id: 'rumah_fence_l', minX: -27.4, maxX: -22.0, minZ: 53.6, maxZ: 54.4 },
  { id: 'rumah_fence_r', minX: -18.0, maxX: -12.6, minZ: 53.6, maxZ: 54.4 },
  { id: 'rumah_garden_rack', minX: -26.55, maxX: -23.35, minZ: 59.85, maxZ: 61.35 },

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
  { id: 'kios_vending_chiller', minX: 28.25, maxX: 29.55, minZ: 16.45, maxZ: 17.45 },

  // === 5. Toko Musik "Nada Lama" (Interior Terbuka + Dinding, Kasir, Rak Kaset & Sofa Solid) ===
  { id: 'music_back', minX: -29.6, maxX: -14.4, minZ: -31.6, maxZ: -31.0 },
  { id: 'music_left', minX: -29.6, maxX: -28.95, minZ: -31.6, maxZ: -19.4 },
  { id: 'music_right', minX: -15.05, maxX: -14.4, minZ: -31.6, maxZ: -19.4 },
  { id: 'music_front_l', minX: -29.6, maxX: -23.78, minZ: -19.9, maxZ: -19.35 },
  { id: 'music_front_r', minX: -20.22, maxX: -14.4, minZ: -19.9, maxZ: -19.35 },
  { id: 'music_counter', minX: -20.3, maxX: -15.7, minZ: -29.35, maxZ: -27.85 },
  { id: 'music_hifi_l', minX: -21.02, maxX: -20.42, minZ: -28.9, maxZ: -28.3 },
  { id: 'music_hifi_r', minX: -15.62, maxX: -15.02, minZ: -28.9, maxZ: -28.3 },
  { id: 'music_cassette_rack', minX: -27.15, maxX: -25.65, minZ: -27.65, maxZ: -23.15 },
  { id: 'music_amp_sofa', minX: -17.6, maxX: -16.0, minZ: -25.4, maxZ: -22.1 },

  // === 6. Menara Nusantara + Meja Lobi, Pantry Kopi & Kursi Jendela ===
  { id: 'office_core', minX: 16.5, maxX: 41.5, minZ: -43.5, maxZ: -25.7 },
  { id: 'office_pillar_l', minX: 16.4, maxX: 18.0, minZ: -25.8, maxZ: -19.2 },
  { id: 'office_pillar_r', minX: 40.0, maxX: 41.6, minZ: -25.8, maxZ: -19.2 },
  { id: 'office_lobby_desk', minX: 33.0, maxX: 35.4, minZ: -24.05, maxZ: -22.75 },
  { id: 'office_pantry_counter', minX: 36.7, maxX: 38.9, minZ: -25.35, maxZ: -24.35 },
  { id: 'office_window_bench', minX: 29.95, maxX: 32.45, minZ: -20.58, maxZ: -19.82 },

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

  // === 15. Gerobak Martabak Manis & Kacang Rebus Bang Udin + Bangku Tepi Sungai ===
  { id: 'martabak_cart', minX: -37.28, maxX: -35.92, minZ: 22.5, maxZ: 25.1 },
  { id: 'martabak_bench', minX: -38.55, maxX: -37.88, minZ: 19.4, maxZ: 21.6 },
  { id: 'martabak_table', minX: -39.25, maxX: -38.6, minZ: 19.85, maxZ: 21.15 },

  // === 16. Gerobak Sepeda Roti Hangat Pak Joko (Gang Perumahan Melati) ===
  { id: 'bread_vendor_cart', minX: 1.9, maxX: 4.15, minZ: 52.6, maxZ: 53.8 },

  // === 17. Kios Koran & Majalah "Warta Senja" (Peron Stasiun Senja) ===
  { id: 'station_newsstand', minX: 74.5, maxX: 76.35, minZ: 7.55, maxZ: 10.05 },

  // === 18. Lapak Es Kelapa Muda Pak Hasan & Bangku Tepi Danau ===
  { id: 'park_coconut_stall', minX: -85.75, maxX: -83.25, minZ: -10.65, maxZ: -8.95 },
  { id: 'park_coconut_bench', minX: -82.45, maxX: -80.75, minZ: -8.82, maxZ: -8.28 },

  // === 19. Gerobak Bakso Keliling Mas Agung & Warung Sudut Bu Rina ===
  { id: 'bakso_cart', minX: -27.95, maxX: -25.65, minZ: 47.2, maxZ: 48.4 },
  { id: 'bakso_bench', minX: -25.35, maxX: -23.85, minZ: 47.55, maxZ: 48.1 },
  { id: 'corner_warung_building', minX: 12.45, maxX: 17.15, minZ: 46.55, maxZ: 50.0 },
  { id: 'badminton_bench', minX: 33.55, maxX: 35.05, minZ: 46.28, maxZ: 46.82 },

  // === 20. Gerobak Sate Ayam Madura Cak Mat & Meja Makan (Sudut Jl. Cempaka) ===
  { id: 'sate_cart', minX: 12.75, maxX: 14.05, minZ: 28.15, maxZ: 30.85 },
  { id: 'sate_table_bench', minX: 12.55, maxX: 14.25, minZ: 31.35, maxZ: 32.8 },

  // === 21. Pos Kamling / Pos Ronda RT 04 Perumahan Melati ===
  { id: 'pos_kamling_platform', minX: 25.55, maxX: 28.85, minZ: 55.45, maxZ: 58.15 },

  // === 22. Gerobak Es Cendol Dawet Ayu Pak Darmo (Plaza Menara Nusantara) ===
  { id: 'dawet_cart', minX: 41.7, maxX: 43.9, minZ: -14.25, maxZ: -12.95 },
  { id: 'dawet_bench', minX: 39.65, maxX: 41.15, minZ: -13.9, maxZ: -13.3 },

  // === 23. Papan Pengumuman RT 04 Perumahan Melati ===
  { id: 'melati_rt_board', minX: 7.85, maxX: 9.75, minZ: 52.05, maxZ: 52.75 },

  // === 24. Gerobak Siomay Bandung Mang Asep (Tepi Taman Kota) ===
  { id: 'siomay_cart', minX: -80.1, maxX: -77.9, minZ: 12.0, maxZ: 13.2 },
  { id: 'siomay_bench', minX: -79.82, maxX: -78.18, minZ: 10.68, maxZ: 11.22 },

  // === 25. Layar Proyektor Warga Malam RT 04 Melati ===
  { id: 'melati_projector_screen', minX: 14.15, maxX: 18.25, minZ: 61.95, maxZ: 62.65 },
  { id: 'melati_projector_stool', minX: 15.82, maxX: 16.58, minZ: 57.98, maxZ: 58.72 },
  { id: 'melati_projector_bench', minX: 14.8, maxX: 17.6, minZ: 56.38, maxZ: 57.02 },

  // === 26. Rak Parkir Sepeda Kota & Motor Kurir Kopi Depan Kedai Bima ===
  { id: 'cafe_bike_rack', minX: -25.05, maxX: -22.15, minZ: 10.52, maxZ: 12.28 },
  { id: 'cafe_delivery_scooter', minX: -17.05, maxX: -15.35, minZ: 10.25, maxZ: 12.15 },

  // === 27. Gerbang Tap Kartu Komuter Stasiun Senja (3 Pedestal — 2 Lajur Terbuka Lebar!) ===
  { id: 'station_gate_n', minX: 75.25, maxX: 76.35, minZ: -9.27, maxZ: -9.03 },
  { id: 'station_gate_c', minX: 75.25, maxX: 76.35, minZ: -7.72, maxZ: -7.48 },
  { id: 'station_gate_s', minX: 75.25, maxX: 76.35, minZ: -6.17, maxZ: -5.93 },

  // === 28. Lapak Sol Sepatu Pak Ujang, Gorengan Mbak Yuni & Meja Ping-Pong Melati ===
  { id: 'pak_ujang_stall', minX: 10.25, maxX: 12.15, minZ: 20.95, maxZ: 22.65 },
  { id: 'gorengan_cart', minX: -11.75, maxX: -10.65, minZ: 30.35, maxZ: 32.45 },
  { id: 'gorengan_bench', minX: -9.82, maxX: -9.28, minZ: 30.65, maxZ: 32.15 },
  { id: 'melati_pingpong_table', minX: 31.78, maxX: 34.62, minZ: 57.8, maxZ: 59.4 },

  // === 29. Warung Tenda Pecel Lele Lamongan, Bilik ATM Kios Harmoni & Pangkalan Ojek Stasiun ===
  { id: 'pecel_lele_cart', minX: 40.95, maxX: 42.35, minZ: 11.85, maxZ: 13.15 },
  { id: 'pecel_lele_table', minX: 42.75, maxX: 45.35, minZ: 11.75, maxZ: 12.65 },
  { id: 'pecel_lele_bench', minX: 42.8, maxX: 45.3, minZ: 10.92, maxZ: 11.42 },
  { id: 'kios_atm_booth', minX: 31.68, maxX: 33.42, minZ: 17.95, maxZ: 19.68 },
  { id: 'opang_shelter_bench', minX: 75.2, maxX: 77.8, minZ: 19.75, maxZ: 20.65 },
  { id: 'opang_bike_l', minX: 74.55, maxX: 75.75, minZ: 18.1, maxZ: 19.65 },
  { id: 'opang_bike_r', minX: 77.3, maxX: 78.5, minZ: 18.2, maxZ: 19.7 },

  // === 30. Boks Telepon Umum, Bis Surat PT Pos & Pergola Kursi Ayunan Kayu Taman ===
  { id: 'retro_payphone_pos', minX: -10.35, maxX: -9.25, minZ: -15.95, maxZ: -13.95 },
  { id: 'park_garden_swing_l', minX: -64.95, maxX: -63.45, minZ: -29.0, maxZ: -28.65 },
  { id: 'park_garden_swing_r', minX: -64.95, maxX: -63.45, minZ: -26.55, maxZ: -26.2 },
  { id: 'park_garden_swing_seat', minX: -64.62, maxX: -63.78, minZ: -28.55, maxZ: -26.65 },

  // === 31. Gerobak Es Doger Bang Toni & Meja Catur Warga Pos Ronda RT 04 Melati ===
  { id: 'doger_cart', minX: 11.0, maxX: 12.2, minZ: -26.65, maxZ: -24.55 },
  { id: 'doger_bench', minX: 9.48, maxX: 10.02, minZ: -26.35, maxZ: -24.85 },
  { id: 'melati_chess_table', minX: 22.68, maxX: 23.92, minZ: 56.18, maxZ: 57.42 },

  // === 32. Gerobak Ketoprak Bang Jaja & Tugu Papan Cuaca Digital Plaza Menara Nusantara ===
  { id: 'ketoprak_cart', minX: -37.1, maxX: -35.9, minZ: 35.15, maxZ: 37.25 },
  { id: 'ketoprak_bench', minX: -38.62, maxX: -38.08, minZ: 35.45, maxZ: 36.95 },
  { id: 'plaza_weather_totem', minX: 23.58, maxX: 25.22, minZ: -15.54, maxZ: -14.86 },

  // === 33. Warkop Kue Pasar Mang Dadang & Sudut Poster Konser Samping Toko Musik Nada Lama ===
  { id: 'warkop_stasiun_counter', minX: 70.55, maxX: 72.65, minZ: -11.35, maxZ: -10.25 },
  { id: 'warkop_stasiun_bench', minX: 70.85, maxX: 72.35, minZ: -9.22, maxZ: -8.68 },
  { id: 'nada_poster_board', minX: -13.75, maxX: -13.15, minZ: -25.65, maxZ: -23.55 },
  { id: 'nada_poster_bench', minX: -12.15, maxX: -11.45, minZ: -25.6, maxZ: -23.6 },

  // === 34. Gerobak Jasuke & Jagung Bakar Bang Roni + 2 Bangku Batu Alami Tepi Sungai ===
  { id: 'jasuke_taman_cart', minX: -75.28, maxX: -73.12, minZ: 15.86, maxZ: 16.94 },
  { id: 'jasuke_taman_bench', minX: -74.98, maxX: -73.42, minZ: 17.98, maxZ: 18.52 },
  { id: 'river_stone_bench_1', minX: -58.14, maxX: -57.46, minZ: -16.25, maxZ: -14.55 },
  { id: 'river_stone_bench_2', minX: -58.14, maxX: -57.46, minZ: -18.45, maxZ: -16.75 },

  // === 35. Gerobak Es Krim Mas Eko Jl. Melati & Lapak Buah Segar Mbak Sari ===
  { id: 'eskrim_melati_cart', minX: -6.32, maxX: -4.88, minZ: 52.68, maxZ: 53.92 },
  { id: 'eskrim_melati_bench', minX: -4.35, maxX: -3.35, minZ: 52.95, maxZ: 53.55 },
  { id: 'mbak_sari_fruit_stall', minX: 11.75, maxX: 13.08, minZ: 13.52, maxZ: 16.08 },

  // === 36. Pangkas Rambut Rapi Jaya, Lapak Tanaman Bu Ningsih & Depot Galon Pak Ahmad ===
  { id: 'barber_rapi_jaya_kiosk', minX: 13.72, maxX: 15.88, minZ: 36.26, maxZ: 39.34 },
  { id: 'bu_ningsih_nursery_rack', minX: -68.55, maxX: -65.85, minZ: 33.95, maxZ: 35.28 },
  { id: 'pak_ahmad_gallon_depot', minX: 23.76, maxX: 26.64, minZ: 38.34, maxZ: 40.55 },
  { id: 'pak_ahmad_gallon_bike', minX: 26.95, maxX: 27.95, minZ: 38.75, maxZ: 40.35 },

  // === 37. Kios Bunga Segar Ibu Lela & Gerobak Bubur Ayam Pagi Mang Ujang ===
  { id: 'ibu_lela_flower_stall', minX: -91.0, maxX: -88.6, minZ: -9.4, maxZ: -8.2 },
  { id: 'bubur_ujang_cart', minX: -23.28, maxX: -21.12, minZ: 37.86, maxZ: 38.94 },
  { id: 'bubur_ujang_bench', minX: -22.98, maxX: -21.42, minZ: 39.98, maxZ: 40.52 },

  // === 38. Mushola Al-Ikhlas, Gerobak Es Teh Poci Kang Ridwan & Pos Trayek Angkot ===
  { id: 'mushola_al_ikhlas_main', minX: 41.55, maxX: 47.2, minZ: 62.9, maxZ: 67.35 },
  { id: 'tehpoci_ridwan_cart', minX: 31.72, maxX: 33.88, minZ: -14.54, maxZ: -13.46 },
  { id: 'tehpoci_ridwan_bench', minX: 32.02, maxX: 33.58, minZ: -12.42, maxZ: -11.88 },
  { id: 'angkot_route_kiosk', minX: 30.15, maxX: 33.05, minZ: 11.45, maxZ: 12.22 },

  // === 39. Gerobak Kue Putu Mang Oding, Bengkel Tambal Ban Mas Budi & Laundry Harum Melati ===
  { id: 'putu_oding_cart', minX: -37.14, maxX: -36.06, minZ: -23.68, maxZ: -21.52 },
  { id: 'putu_oding_bench', minX: -38.72, maxX: -38.18, minZ: -23.38, maxZ: -21.82 },
  { id: 'bengkel_mas_budi_bay', minX: 47.65, maxX: 50.75, minZ: -15.55, maxZ: -13.65 },
  { id: 'laundry_harum_melati_kiosk', minX: 32.26, maxX: 35.34, minZ: 38.28, maxZ: 40.15 },

  // === 40. Gerobak Cilok Mang Dedi, Stasiun Sepeda Sewa Menara Nusantara & Reparasi Jam Pak Karto ===
  { id: 'cilok_dedi_cart', minX: -29.88, maxX: -27.72, minZ: -14.54, maxZ: -13.46 },
  { id: 'cilok_dedi_bench', minX: -29.58, maxX: -28.02, minZ: -12.42, maxZ: -11.88 },
  { id: 'city_bike_share_dock', minX: 17.7, maxX: 21.9, minZ: -15.32, maxZ: -13.88 },
  { id: 'pak_karto_watch_stall', minX: 71.22, maxX: 72.42, minZ: 11.48, maxZ: 13.72 },

  // === 41. Gerobak Bandrek Abah Udin & Bangku Alun-Alun Lampu Gantung Taman Kota ===
  { id: 'bandrek_udin_cart', minX: -11.74, maxX: -10.66, minZ: -36.28, maxZ: -34.12 },
  { id: 'bandrek_udin_bench', minX: -9.62, maxX: -9.08, minZ: -35.98, maxZ: -34.42 },
  { id: 'park_lights_plaza_bench', minX: -86.5, maxX: -84.3, minZ: 11.65, maxZ: 12.35 },

  // === 42. Gerobak Sayur Ibu Tati, Kios Penjahit Sari Jahit & Pos JPL 04 Stasiun Senja ===
  { id: 'veggie_tati_cart', minX: 42.12, maxX: 44.28, minZ: 52.86, maxZ: 53.94 },
  { id: 'sari_tailor_kiosk', minX: 40.66, maxX: 43.74, minZ: 38.28, maxZ: 40.15 },
  { id: 'rail_crossing_hut', minX: 85.22, maxX: 87.22, minZ: 18.68, maxZ: 20.92 },

  // === 43. Apotek 24 Jam Sehat Melati, Es Teler Bang Daud & Kotak Donasi Mainan Anak ===
  { id: 'apotek_sehat_melati_kiosk', minX: -31.74, maxX: -28.66, minZ: 38.28, maxZ: 40.15 },
  { id: 'esteler_daud_cart', minX: -18.68, maxX: -16.52, minZ: -13.94, maxZ: -12.86 },
  { id: 'esteler_daud_bench', minX: -18.38, maxX: -16.82, minZ: -11.82, maxZ: -11.28 },
  { id: 'toy_donation_box', minX: -80.22, maxX: -78.98, minZ: 25.44, maxZ: 26.16 },

  // === 44. Konter Berkah Pulsa, Sepeda Jamu Mbak Yem & Papan Flora Fauna Danau Senja ===
  { id: 'konter_berkah_kiosk', minX: 48.06, maxX: 51.14, minZ: 12.46, maxZ: 14.34 },
  { id: 'jamu_yem_bike', minX: -59.68, maxX: -58.72, minZ: 19.4, maxZ: 21.4 },
  { id: 'jamu_yem_bench', minX: -61.12, maxX: -60.58, minZ: 19.65, maxZ: 21.15 },
  { id: 'lake_flora_fauna_board', minX: -69.0, maxX: -68.2, minZ: -34.55, maxZ: -33.05 },

  // === 45. Gerobak Pempek Cek Ani & Toko Kue Tradisional Dapur Manis ===
  { id: 'pempek_ani_cart', minX: -37.14, maxX: -36.06, minZ: -31.88, maxZ: -29.72 },
  { id: 'pempek_ani_bench', minX: -38.72, maxX: -38.18, minZ: -31.58, maxZ: -30.02 },
  { id: 'dapur_manis_bakery_kiosk', minX: 47.66, maxX: 50.74, minZ: 38.28, maxZ: 40.15 },
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

  // Kucing Oranye "Sore" & Stand Gitar Ruang Tamu Rumah Damar
  { x: 9.5, z: 56.5, r: 0.36 },
  { x: -24.2, z: 63.1, r: 0.38 },

  // 4 Tiang Sudut Gazebo Panggung Akustik Taman Kota + Stand Gitar
  { x: -70.3, z: 17.2, r: 0.24 },
  { x: -65.7, z: 17.2, r: 0.24 },
  { x: -70.3, z: 21.8, r: 0.24 },
  { x: -65.7, z: 21.8, r: 0.24 },

  // Penjual Martabak Bang Udin & Tiang Lampion Tepi Sungai
  { x: -37.55, z: 23.8, r: 0.42 },
  // Penjual Roti Pak Joko, Tiang Jemuran Perumahan & Pot Gerbang Rumah Damar
  { x: 3.32, z: 53.85, r: 0.42 },
  { x: -29.2, z: 62.8, r: 0.14 },
  { x: -29.2, z: 67.6, r: 0.14 },
  { x: 7.5, z: 66.8, r: 0.14 },
  { x: 7.5, z: 71.6, r: 0.14 },
  { x: -21.85, z: 54.45, r: 0.24 },
  { x: -18.15, z: 54.45, r: 0.24 },

  // Air Mancur Batu Mini Taman Kota & Keranjang Piknik Rotan
  { x: -65.5, z: 10.5, r: 1.74 },
  { x: -71.0, z: 29.15, r: 0.36 },

  // Tiang Sinyal Rel Stasiun Senja & Pemusik Akustik Tepi Sungai (Mas Seno)
  { x: 88.65, z: -18.5, r: 0.22 },
  { x: 88.65, z: 12.5, r: 0.22 },
  { x: -58.0, z: 14.5, r: 0.52 },
  { x: -57.2, z: 14.5, r: 0.32 },

  // Meja Samping & Tanaman Indoor Lobi Menara Nusantara
  { x: 32.82, z: -20.18, r: 0.38 },
  { x: 39.45, z: -24.6, r: 0.34 },
  { x: 18.65, z: -20.1, r: 0.34 },

  // 8 Lampu Taman Tenaga Surya di Halaman Rumah Jl. Melati No. 14
  ...([
    [-21.88, 56.1], [-21.88, 58.0], [-21.88, 59.9],
    [-18.12, 56.1], [-18.12, 58.0], [-18.12, 59.9],
    [-26.25, 59.5], [-23.5, 59.5],
  ] as [number, number][]).map(([x, z]) => ({ x, z, r: 0.11 })),

  // Lapak Es Kelapa Muda (Pak Hasan & Meja Payung) + 2 Pemancing Bantaran Sungai (Pak Karno & Mas Yudi)
  { x: -84.5, z: -10.85, r: 0.42 },
  { x: -81.6, z: -9.6, r: 0.65 },
  { x: -38.8, z: -14.8, r: 0.68 },
  { x: -57.4, z: 25.2, r: 0.68 },

  // Kursi Kucing Moka & Papan Kapur Kedai Bima + Mas Agung Bakso + Tiang Teras Warung Bu Rina
  { x: -14.1, z: 17.6, r: 0.58 },
  { x: -16.45, z: 21.65, r: 0.34 },
  { x: -26.8, z: 46.8, r: 0.42 },
  { x: 12.7, z: 50.55, r: 0.14 },
  { x: 16.9, z: 50.55, r: 0.14 },

  // Tiang Net Bulu Tangkis Gang Melati, 3 Warga Senam Taman & 2 Tiang Penunjuk Arah Kayu
  { x: 38.5, z: 46.95, r: 0.16 },
  { x: 38.5, z: 52.65, r: 0.16 },
  { x: -83.5, z: 32.15, r: 0.42 },
  { x: -84.95, z: 34.25, r: 0.42 },
  { x: -82.05, z: 34.25, r: 0.42 },
  { x: -62.2, z: -6.2, r: 0.22 },
  { x: -10.4, z: 10.8, r: 0.22 },

  // Cak Mat Sate Madura & 6 Pasang Tempat Sampah Pilah Kota
  { x: 14.52, z: 29.5, r: 0.42 },
  ...([
    [25.3, 11.4], [-11.8, 12.6], [-14.0, -18.5],
    [15.8, -19.5], [-62.8, 8.2], [74.8, 3.2],
  ] as [number, number][]).map(([x, z]) => ({ x, z, r: 0.36 })),

  // Pak Darmo Dawet Ayu, Mang Asep Siomay Bandung, Pelukis Mas Dimas, Mbak Yuni Gorengan & Tiang Skor Ping-Pong
  { x: 42.8, z: -14.7, r: 0.42 },
  { x: -79.0, z: 13.75, r: 0.42 },
  { x: -37.8, z: 12.6, r: 0.78 },
  { x: -12.3, z: 31.4, r: 0.42 },
  { x: 33.2, z: 60.05, r: 0.2 },
  { x: 41.65, z: 13.48, r: 0.42 },
  { x: 76.5, z: 19.15, r: 0.42 },
  { x: -86.4, z: 17.6, r: 0.62 },
  // Bang Toni Es Doger, Warga Catur Pos Ronda (Pak Yanto & Pak Hendro), Tiang Lampu Catur & Tiang LED KRL Stasiun
  { x: 12.75, z: -25.6, r: 0.42 },
  { x: 23.3, z: 57.68, r: 0.48 },
  { x: 23.3, z: 55.92, r: 0.48 },
  { x: 22.22, z: 55.72, r: 0.14 },
  { x: 84.4, z: -2.2, r: 0.28 },
  // Bang Jaja Ketoprak Tepi Sungai
  { x: -35.4, z: 36.2, r: 0.42 },
  // Mang Dadang Warkop Stasiun, 2 Tiang Sangkar Burung Jl. Melati & Pohon/Lampu Sudut Nada Lama
  { x: 71.6, z: -11.85, r: 0.42 },
  { x: -2.4, z: 64.9, r: 0.24 },
  { x: 1.8, z: 64.9, r: 0.24 },
  { x: -12.6, z: -27.2, r: 0.66 },
  { x: -12.6, z: -22.2, r: 0.18 },
  // Bang Roni Jasuke Taman, Pos Air Minum Taman, Tiang Penunjuk Arah Kayu & 6 Lampu Taman Hias
  { x: -74.2, z: 15.38, r: 0.42 },
  { x: -58.4, z: -13.2, r: 0.44 },
  { x: -63.2, z: 14.4, r: 0.44 },
  ...([
    [-59.2, -11.5], [-59.2, -19.2], [-63.2, -12.6],
    [-63.2, 18.8], [-63.4, 23.6], [-71.6, 14.8],
  ] as [number, number][]).map(([x, z]) => ({ x, z, r: 0.16 })),
  // Mas Eko Es Krim, Mbak Sari Lapak Buah & 2 Pilar Portal Pintu Masuk Jl. Melati
  { x: -5.6, z: 54.32, r: 0.42 },
  { x: 13.65, z: 14.8, r: 0.42 },
  { x: -10.8, z: 44.3, r: 0.34 },
  { x: -10.8, z: 51.7, r: 0.34 },
  // Bang Darto Pangkas Rambut, Barber Pole, Bu Ningsih Tanaman & Pak Ahmad Depot Galon
  { x: 13.32, z: 38.65, r: 0.42 },
  { x: 13.52, z: 36.45, r: 0.22 },
  { x: -67.2, z: 35.85, r: 0.42 },
  { x: 23.35, z: 40.15, r: 0.42 },
  // Papan Bebek Danau Senja, Ibu Lela Bunga & Mang Ujang Bubur Ayam
  { x: -81.8, z: -12.35, r: 0.22 },
  { x: -89.8, z: -9.95, r: 0.42 },
  { x: -22.2, z: 37.38, r: 0.42 },
  // 2 Tiang & Bedug Serambi Mushola Al-Ikhlas, Kang Ridwan Teh Poci & Tiang Stop Angkot
  { x: 42.15, z: 61.55, r: 0.2 },
  { x: 46.85, z: 61.55, r: 0.2 },
  { x: 42.65, z: 62.35, r: 0.45 },
  { x: 32.8, z: -15.02, r: 0.42 },
  { x: 29.85, z: 11.5, r: 0.16 },
  // Mang Oding Kue Putu, Mas Budi Bengkel & Mbak Rini Laundry Harum Melati
  { x: -35.58, z: -22.6, r: 0.42 },
  { x: 47.2, z: -13.6, r: 0.42 },
  { x: 31.95, z: 40.2, r: 0.42 },
  // Mang Dedi Cilok & Telur Gulung + Pak Karto Reparasi Jam Tangan Stasiun
  { x: -28.8, z: -15.02, r: 0.42 },
  { x: 72.75, z: 12.6, r: 0.42 },
  // Dermaga Perahu Bebek Danau Senja, Abah Udin Bandrek & 4 Tiang + Sakelar Lampu Gantung Taman
  { x: -94.1, z: -12.15, r: 0.26 },
  { x: -91.6, z: -12.2, r: 0.18 },
  { x: -12.22, z: -35.2, r: 0.42 },
  { x: -88.2, z: 9.6, r: 0.16 },
  { x: -82.6, z: 9.6, r: 0.16 },
  { x: -88.2, z: 14.0, r: 0.16 },
  { x: -82.6, z: 14.0, r: 0.16 },
  { x: -85.4, z: 9.6, r: 0.22 },
  // Ibu Tati Sayur, Ibu Sari Penjahit, Tiang Palang Rel KA JPL 04 & Pak Maman Penjaga Rel
  { x: 43.2, z: 54.42, r: 0.42 },
  { x: 40.35, z: 40.2, r: 0.42 },
  { x: 87.6, z: 17.5, r: 0.34 },
  { x: 84.85, z: 20.3, r: 0.42 },
  // Mbak Nita Apotek 24 Jam & Bang Daud Es Teler
  { x: -28.35, z: 40.2, r: 0.42 },
  { x: -17.6, z: -14.42, r: 0.42 },
  // Mas Fajar Konter Berkah, Mbak Yem Sepeda Jamu & Teropong Pengamat Burung Danau
  { x: 51.45, z: 12.4, r: 0.42 },
  { x: -58.25, z: 20.4, r: 0.42 },
  { x: -68.8, z: -32.2, r: 0.34 },
  // Cek Ani Pempek, Ibu Dewi Dapur Manis & Pos Pantau TMA Sungai Kota
  { x: -35.58, z: -30.8, r: 0.42 },
  { x: 47.35, z: 40.2, r: 0.42 },
  { x: -38.85, z: -11.0, r: 0.36 },
  { x: 13.6, z: -14.8, r: 1.94 },
  ...([
    [-39.75, 9.5], [-39.75, 19.5], [-39.75, 29.5], [-39.75, 39.5],
    [-39.75, -9.5], [-39.75, -19.5], [-39.75, -29.5],
    [-56.25, 9.5], [-56.25, 19.5], [-56.25, 29.5], [-56.25, 39.5],
    [-56.25, -9.5], [-56.25, -19.5], [-56.25, -29.5],
  ] as [number, number][]).map(([x, z]) => ({ x, z, r: 0.14 })),
];

export const ROOFTOP_BOUNDS = {
  minX: 18.0,
  maxX: 39.5,
  minZ: -42.0,
  maxZ: -21.8,
  elevation: 22,
};

// Objek solid di atas Rooftop (Kabin Lift, Bangku Santai & Teropong Koin Rooftop)
export const ROOFTOP_COLLIDERS: ColliderBox[] = [
  { id: 'rooftop_elevator_cabin', minX: 18.0, maxX: 21.6, minZ: -27.1, maxZ: -23.75 },
  { id: 'rooftop_bench', minX: 26.7, maxX: 30.3, minZ: -23.5, maxZ: -22.5 },
  { id: 'rooftop_telescope', minX: 33.95, maxX: 34.85, minZ: -21.9, maxZ: -21.0 },
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
