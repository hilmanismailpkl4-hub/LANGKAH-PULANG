export type DamarOutfitId = 'office' | 'casual_jacket' | 'rain_sweater' | 'home_tee';

export interface DamarOutfitDef {
  id: DamarOutfitId;
  name: string;
  subtitle: string;
  description: string;
  shirtColor: string;
  pantsColor: string;
  accentProp?: 'backpack' | 'apron' | 'tie' | 'cardigan' | 'vest' | 'scarf';
  nadiaComment: string;
}

export const DAMAR_OUTFITS: DamarOutfitDef[] = [
  {
    id: 'office',
    name: 'Kemeja Kantor Senja',
    subtitle: 'Setelan Kerja Harian · Tas Selempang',
    description: 'Kemeja kerja biru-abu rapi dengan lengan digulung dan tas selempang kulit kesayangan.',
    shirtColor: '#5d6e7e',
    pantsColor: '#2e323b',
    accentProp: 'backpack',
    nadiaComment: 'Rapi banget, Mas... tapi ingat ya, hari ini jangan terlalu keras sama dirimu sendiri.',
  },
  {
    id: 'casual_jacket',
    name: 'Jaket Santai Sore',
    subtitle: 'Gaya Jalan Sore · Celana Chino Krem',
    description: 'Jaket rompi zaitun hangat yang dulu sering dipakai Damar saat nongkrong di kedai kopi bersama Bima.',
    shirtColor: '#4e6954',
    pantsColor: '#8c7a62',
    accentProp: 'vest',
    nadiaComment: 'Nah, jaket hijau ini bikin kamu kelihatan jauh lebih santai dan muda lagi, Mas!',
  },
  {
    id: 'rain_sweater',
    name: 'Sweater Rajut Hujan',
    subtitle: 'Hangat & Nyaman · Syal Lembut',
    description: 'Sweater rajut warna marun hangat dengan syal—pas sekali untuk sore berhujan atau duduk di angkringan.',
    shirtColor: '#8c4942',
    pantsColor: '#253142',
    accentProp: 'scarf',
    nadiaComment: 'Cocok banget buat angin hujan sore ini. Jangan lupa bawa payung kalau keluar ya.',
  },
  {
    id: 'home_tee',
    name: 'Kaus Rumahan Santai',
    subtitle: 'Akhir Pekan di Jl. Melati',
    description: 'Kaus katun warna krem lembut tanpa tas kerja—tanda hari ini sepenuhnya milik keluarga di rumah.',
    shirtColor: '#d9cbb6',
    pantsColor: '#434954',
    accentProp: undefined,
    nadiaComment: 'Paling suka lihat kamu pakai kaus santai begini—rasanya Ayah benar-benar lagi libur di rumah.',
  },
];

export const DAMAR_OUTFIT_BY_ID: Record<DamarOutfitId, DamarOutfitDef> = DAMAR_OUTFITS.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<DamarOutfitId, DamarOutfitDef>,
);

export type NadiaOutfitId = 'terracotta' | 'sage_evening' | 'sky_casual';
export type KiraOutfitId = 'sunshine' | 'strawberry' | 'starry_blue';

export interface FamilyOutfitDef<T extends string> {
  id: T;
  name: string;
  subtitle: string;
  description: string;
  shirtColor: string;
  pantsColor: string;
  accentProp?: 'backpack' | 'apron' | 'tie' | 'cardigan' | 'vest' | 'scarf';
  reactionLine: string;
}

export const NADIA_OUTFITS: FamilyOutfitDef<NadiaOutfitId>[] = [
  {
    id: 'terracotta',
    name: 'Kardigan Terakota Hangat',
    subtitle: 'Gaya Harian Favorit Nadia',
    description: 'Blus krem lembut dengan kardigan bata hangat yang selalu terasa akrab di ruang tamu.',
    shirtColor: '#d9c5b2',
    pantsColor: '#3a3842',
    accentProp: 'cardigan',
    reactionLine: 'Kardigan ini memang paling nyaman buat jalan santai sore, Mas.',
  },
  {
    id: 'sage_evening',
    name: 'Blus Hijau Sage & Syal',
    subtitle: 'Anggun & Teduh di Taman Kota',
    description: 'Paduan hijau sage lembut dengan celana krem hangat dan syal tipis penahan angin danau.',
    shirtColor: '#73917b',
    pantsColor: '#8f7d69',
    accentProp: 'scarf',
    reactionLine: 'Wah, warna hijau ini cocok banget buat foto bareng di Taman Danau ya, Mas!',
  },
  {
    id: 'sky_casual',
    name: 'Kemeja Biru Langit Santai',
    subtitle: 'Rapi & Segar untuk Jalan Kota',
    description: 'Kemeja katun biru muda santai dengan celana gelap dan tas kecil untuk menyimpan camilan Kira.',
    shirtColor: '#7ea3bf',
    pantsColor: '#2d3340',
    accentProp: 'backpack',
    reactionLine: 'Siap jalan sore! Baju ini ringan banget, enak buat jalan jauh menyusuri kota.',
  },
];

export const KIRA_OUTFITS: FamilyOutfitDef<KiraOutfitId>[] = [
  {
    id: 'sunshine',
    name: 'Kaus Kuning Matahari',
    subtitle: 'Baju Ceria Favorit Kira',
    description: 'Kaus kuning hangat secerah gambar matahari krayon buatan Kira di kulkas rumah.',
    shirtColor: '#e8b954',
    pantsColor: '#485d78',
    accentProp: undefined,
    reactionLine: 'Yeay! Baju kuning matahari Kira bikin jalannya tambah semangat!',
  },
  {
    id: 'strawberry',
    name: 'Baju Stroberi Merah Muda',
    subtitle: 'Semanis Es Krim Kios Harmoni',
    description: 'Baju merah muda pastel dengan celana krem lembut dan kardigan mungil yang menggemaskan.',
    shirtColor: '#e68aa1',
    pantsColor: '#d4c8b8',
    accentProp: 'cardigan',
    reactionLine: 'Hihi, baju warna es krim stroberi! Ayah, Kira kelihatan cantik nggak?',
  },
  {
    id: 'starry_blue',
    name: 'Sweater Biru Bintang',
    subtitle: 'Hangat untuk Sore & Hujan',
    description: 'Sweater rajut biru cerah dengan syal kecil—cocok saat main ayunan atau naik ke Rooftop malam.',
    shirtColor: '#5c94c4',
    pantsColor: '#343c4a',
    accentProp: 'scarf',
    reactionLine: 'Hangat banget, Ayah! Cocok buat jalan-jalan sambil bawa payung bening!',
  },
];

export const NADIA_OUTFIT_BY_ID: Record<NadiaOutfitId, FamilyOutfitDef<NadiaOutfitId>> = NADIA_OUTFITS.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<NadiaOutfitId, FamilyOutfitDef<NadiaOutfitId>>,
);

export const KIRA_OUTFIT_BY_ID: Record<KiraOutfitId, FamilyOutfitDef<KiraOutfitId>> = KIRA_OUTFITS.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<KiraOutfitId, FamilyOutfitDef<KiraOutfitId>>,
);
