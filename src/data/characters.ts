import { CharacterId } from '../types/game';

export interface CharacterProfile {
  id: CharacterId;
  name: string;
  role: string;
  accentColor: string;
  voice: {
    pitch: number;
    rate: number;
    preferGender: 'male' | 'female' | 'child';
    volumeScale: number;
  };
  appearance: {
    height: number;
    shirtColor: string;
    pantsColor: string;
    skinColor: string;
    hairColor: string;
    accentProp?: 'apron' | 'tie' | 'scarf' | 'backpack' | 'vest' | 'cardigan';
  };
}

export const CHARACTERS: Record<CharacterId, CharacterProfile> = {
  damar: {
    id: 'damar',
    name: 'Damar Pratama',
    role: 'Suami & Ayah — 30 Tahun',
    accentColor: '#e7b87d',
    voice: { pitch: 0.9, rate: 0.94, preferGender: 'male', volumeScale: 1.0 },
    appearance: {
      height: 1.74,
      shirtColor: '#486078',
      pantsColor: '#282d37',
      skinColor: '#d9aa86',
      hairColor: '#1f1d1c',
      accentProp: 'backpack',
    },
  },
  damar_batin: {
    id: 'damar_batin',
    name: 'Damar (Batin)',
    role: 'Monolog Reflektif',
    accentColor: '#c9b39c',
    voice: { pitch: 0.86, rate: 0.88, preferGender: 'male', volumeScale: 0.85 },
    appearance: {
      height: 1.74,
      shirtColor: '#486078',
      pantsColor: '#282d37',
      skinColor: '#d9aa86',
      hairColor: '#1f1d1c',
    },
  },
  nadia: {
    id: 'nadia',
    name: 'Nadia',
    role: 'Istri — 29 Tahun',
    accentColor: '#e8a598',
    voice: { pitch: 1.12, rate: 0.94, preferGender: 'female', volumeScale: 1.0 },
    appearance: {
      height: 1.62,
      shirtColor: '#c98474',
      pantsColor: '#3a3943',
      skinColor: '#e2b696',
      hairColor: '#251d1a',
      accentProp: 'cardigan',
    },
  },
  kira: {
    id: 'kira',
    name: 'Kira',
    role: 'Putri Kecil Damar & Nadia — 6 Tahun',
    accentColor: '#f6d17a',
    voice: { pitch: 1.48, rate: 1.04, preferGender: 'child', volumeScale: 1.0 },
    appearance: {
      height: 1.12,
      shirtColor: '#e9b949',
      pantsColor: '#4e6f8c',
      skinColor: '#e4ba9b',
      hairColor: '#231b17',
    },
  },
  bima: {
    id: 'bima',
    name: 'Bima',
    role: 'Sahabat Lama & Pemilik Kedai Kopi — 31 Tahun',
    accentColor: '#b9936c',
    voice: { pitch: 0.97, rate: 0.97, preferGender: 'male', volumeScale: 1.0 },
    appearance: {
      height: 1.76,
      shirtColor: '#d8cfc4',
      pantsColor: '#3c3631',
      skinColor: '#cfa07b',
      hairColor: '#241e1a',
      accentProp: 'apron',
    },
  },
  pak_hendra: {
    id: 'pak_hendra',
    name: 'Pak Hendra',
    role: 'Kepala Divisi — Menara Nusantara',
    accentColor: '#8ba3be',
    voice: { pitch: 0.8, rate: 0.92, preferGender: 'male', volumeScale: 1.0 },
    appearance: {
      height: 1.75,
      shirtColor: '#dce3eb',
      pantsColor: '#1f2530',
      skinColor: '#cfa484',
      hairColor: '#48494d',
      accentProp: 'tie',
    },
  },
  pak_darman: {
    id: 'pak_darman',
    name: 'Pak Darman',
    role: 'Penjual Buku Tua — Stasiun Senja',
    accentColor: '#c2a67d',
    voice: { pitch: 0.78, rate: 0.85, preferGender: 'male', volumeScale: 0.96 },
    appearance: {
      height: 1.66,
      shirtColor: '#8b7355',
      pantsColor: '#36322d',
      skinColor: '#c69977',
      hairColor: '#9d9b98',
      accentProp: 'vest',
    },
  },
  nenek_sari: {
    id: 'nenek_sari',
    name: 'Nenek Sari',
    role: 'Warga Taman Danau Senja',
    accentColor: '#c9b1d4',
    voice: { pitch: 1.04, rate: 0.84, preferGender: 'female', volumeScale: 0.95 },
    appearance: {
      height: 1.56,
      shirtColor: '#8b7a96',
      pantsColor: '#3b3540',
      skinColor: '#cfa587',
      hairColor: '#b9b6b3',
      accentProp: 'scarf',
    },
  },
  mas_raka: {
    id: 'mas_raka',
    name: 'Mas Raka',
    role: 'Pekerja Shift Malam — Jembatan Sungai',
    accentColor: '#7eb2b8',
    voice: { pitch: 0.93, rate: 0.95, preferGender: 'male', volumeScale: 0.98 },
    appearance: {
      height: 1.72,
      shirtColor: '#2f5d62',
      pantsColor: '#23282e',
      skinColor: '#c79772',
      hairColor: '#1c1b1b',
      accentProp: 'vest',
    },
  },
  mas_bagas: {
    id: 'mas_bagas',
    name: 'Mas Bagas',
    role: 'Penjaga Toko Musik "Nada Lama"',
    accentColor: '#d49a6a',
    voice: { pitch: 0.95, rate: 0.95, preferGender: 'male', volumeScale: 0.98 },
    appearance: {
      height: 1.71,
      shirtColor: '#6d4c3d',
      pantsColor: '#2c2927',
      skinColor: '#d3a37e',
      hairColor: '#241c17',
    },
  },
  mbak_lilis: {
    id: 'mbak_lilis',
    name: 'Mbak Lilis',
    role: 'Kasir Shift Malam — Kios Harmoni',
    accentColor: '#8ec5a3',
    voice: { pitch: 1.18, rate: 1.0, preferGender: 'female', volumeScale: 0.98 },
    appearance: {
      height: 1.6,
      shirtColor: '#3d7a68',
      pantsColor: '#252a30',
      skinColor: '#ddb08e',
      hairColor: '#1f1a18',
      accentProp: 'apron',
    },
  },
  bu_wati: {
    id: 'bu_wati',
    name: 'Bu Wati',
    role: 'Tetangga Lama — Perumahan Melati',
    accentColor: '#d6a27e',
    voice: { pitch: 1.08, rate: 0.88, preferGender: 'female', volumeScale: 0.96 },
    appearance: {
      height: 1.58,
      shirtColor: '#a36b58',
      pantsColor: '#3a3330',
      skinColor: '#d1a483',
      hairColor: '#6d6763',
      accentProp: 'cardigan',
    },
  },
  pak_slamet: {
    id: 'pak_slamet',
    name: 'Pak Slamet',
    role: 'Penjual Angkringan — Sudut Jl. Melati',
    accentColor: '#e8b366',
    voice: { pitch: 0.84, rate: 0.9, preferGender: 'male', volumeScale: 0.98 },
    appearance: {
      height: 1.67,
      shirtColor: '#8c6244',
      pantsColor: '#2d2a27',
      skinColor: '#c99772',
      hairColor: '#524f4c',
      accentProp: 'apron',
    },
  },
  bang_ari: {
    id: 'bang_ari',
    name: 'Bang Ari',
    role: 'Pengamen Gitar Akustik — Stasiun Senja',
    accentColor: '#98c4a6',
    voice: { pitch: 0.96, rate: 0.96, preferGender: 'male', volumeScale: 0.98 },
    appearance: {
      height: 1.72,
      shirtColor: '#3f5a63',
      pantsColor: '#292d33',
      skinColor: '#cfa07a',
      hairColor: '#1f1a18',
      accentProp: 'vest',
    },
  },
  pak_budi: {
    id: 'pak_budi',
    name: 'Pak Budi',
    role: 'Penjaga Taman Kota & Danau Senja',
    accentColor: '#82b38c',
    voice: { pitch: 0.82, rate: 0.88, preferGender: 'male', volumeScale: 0.96 },
    appearance: {
      height: 1.69,
      shirtColor: '#486e51',
      pantsColor: '#2d332f',
      skinColor: '#c79874',
      hairColor: '#7a7875',
      accentProp: 'vest',
    },
  },
  narator: {
    id: 'narator',
    name: '',
    role: 'Narasi',
    accentColor: '#d9ccb9',
    voice: { pitch: 0.92, rate: 0.88, preferGender: 'male', volumeScale: 0.85 },
    appearance: {
      height: 1.7,
      shirtColor: '#555',
      pantsColor: '#333',
      skinColor: '#ddd',
      hairColor: '#222',
    },
  },
};
