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
