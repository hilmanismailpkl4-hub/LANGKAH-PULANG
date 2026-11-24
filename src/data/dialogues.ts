import { DialogueScript, MainObjectiveStep } from '../types/game';
import { GIFT_DIALOGUES } from './bagItems';
import { EASTER_EGG_DIALOGUES } from './easterEggs';
import { SIDE_QUEST_DIALOGUES } from './sideQuests';
import { CHAPTER_1_DIALOGUES, CHAPTER_1_STEPS } from './storyChapter1';
import { CHAPTER_2_DIALOGUES, CHAPTER_2_STEPS } from './storyChapter2';
import { CHAPTER_3_DIALOGUES, CHAPTER_3_STEPS } from './storyChapter3';

export const ALL_MAIN_STEPS: MainObjectiveStep[] = [
  ...CHAPTER_1_STEPS,
  ...CHAPTER_2_STEPS,
  ...CHAPTER_3_STEPS,
];

export const MAIN_STEP_BY_ID: Record<string, MainObjectiveStep> = ALL_MAIN_STEPS.reduce(
  (acc, step) => {
    acc[step.id] = step;
    return acc;
  },
  {} as Record<string, MainObjectiveStep>,
);

// Dialog obrolan santai ketika NPC tidak sedang memiliki misi aktif
const AMBIENT_DIALOGUES: Record<string, DialogueScript> = {
  ambient_nadia: {
    id: 'ambient_nadia',
    startNodeId: 'amb_nadia_1',
    nodes: {
      amb_nadia_1: {
        id: 'amb_nadia_1',
        speaker: 'nadia',
        emotion: 'hangat',
        text: 'Jangan lupa makan siang ya, Mas. Kalau sempat pulang sore, pintu rumah selalu kebuka.',
      },
    },
  },
  ambient_kira: {
    id: 'ambient_kira',
    startNodeId: 'amb_kira_1',
    nodes: {
      amb_kira_1: {
        id: 'amb_kira_1',
        speaker: 'kira',
        emotion: 'ceria',
        text: 'Ayah jangan lupa pulang ya! Kira lagi belajar gambar bintang buat ditempel di kamar!',
      },
    },
  },
  ambient_bima: {
    id: 'ambient_bima',
    startNodeId: 'amb_bima_1',
    nodes: {
      amb_bima_1: {
        id: 'amb_bima_1',
        speaker: 'bima',
        emotion: 'hangat',
        text: 'Santai aja, Mar. Mau duduk dengerin lagu atau keliling kota dulu, kedai gue nggak ke mana-mana.',
      },
    },
  },
  ambient_hendra: {
    id: 'ambient_hendra',
    startNodeId: 'amb_hendra_1',
    nodes: {
      amb_hendra_1: {
        id: 'amb_hendra_1',
        speaker: 'pak_hendra',
        emotion: 'tenang',
        text: 'Atur ritmemu baik-baik, Damar. Kalau perlu udara segar, lift ke rooftop gedung ada di sisi kiri lobi.',
      },
    },
  },
  ambient_darman: {
    id: 'ambient_darman',
    startNodeId: 'amb_darman_1',
    nodes: {
      amb_darman_1: {
        id: 'amb_darman_1',
        speaker: 'pak_darman',
        emotion: 'hangat',
        text: 'Buku lama selalu sabar menunggu dibaca, Nak. Tapi manusia punya waktunya sendiri. Jaga keluargamu baik-baik ya.',
      },
    },
  },
  ambient_sari: {
    id: 'ambient_sari',
    startNodeId: 'amb_sari_1',
    nodes: {
      amb_sari_1: {
        id: 'amb_sari_1',
        speaker: 'nenek_sari',
        emotion: 'tenang',
        text: 'Tehnya hangat sekali, Nak Damar. Semoga langkahmu hari ini juga terasa ringan ya.',
      },
    },
  },
  ambient_raka: {
    id: 'ambient_raka',
    startNodeId: 'amb_raka_1',
    nodes: {
      amb_raka_1: {
        id: 'amb_raka_1',
        speaker: 'mas_raka',
        emotion: 'hangat',
        text: 'Makasih lagi soal kopinya, Mas Damar. Semangat ya—pulang ke rumah itu selalu layak diperjuangkan.',
      },
    },
  },
  ambient_bagas: {
    id: 'ambient_bagas',
    startNodeId: 'amb_bagas_1',
    nodes: {
      amb_bagas_1: {
        id: 'amb_bagas_1',
        speaker: 'mas_bagas',
        emotion: 'hangat',
        text: 'Gitar di etalase selalu kutata rapi, Mar. Kapan pun kamu mau memetiknya lagi, mampir saja.',
      },
    },
  },
  ambient_lilis: {
    id: 'ambient_lilis',
    startNodeId: 'amb_lilis_1',
    nodes: {
      amb_lilis_1: {
        id: 'amb_lilis_1',
        speaker: 'mbak_lilis',
        emotion: 'hangat',
        text: 'Halo Mas Damar! Makasih ya sudah bantu kemarin. Adikku pasti senang banget lihat buku sketsanya.',
      },
    },
  },
  ambient_wati: {
    id: 'ambient_wati',
    startNodeId: 'amb_wati_1',
    nodes: {
      amb_wati_1: {
        id: 'amb_wati_1',
        speaker: 'bu_wati',
        emotion: 'hangat',
        text: 'Lampu teras sudah terang lagi. Titip peluk buat Kira dan Nadia di rumah ya, Nak Damar.',
      },
    },
  },
  ambient_slamet: {
    id: 'ambient_slamet',
    startNodeId: 'amb_slamet_1',
    nodes: {
      amb_slamet_1: {
        id: 'amb_slamet_1',
        speaker: 'pak_slamet',
        emotion: 'hangat',
        text: 'Wedang jahenya selalu siap, Mas Damar. Kapan pun capek di jalan, mampir duduk sebentar di gerobak Bapak.',
      },
    },
  },
  ambient_ari: {
    id: 'ambient_ari',
    startNodeId: 'amb_ari_1',
    nodes: {
      amb_ari_1: {
        id: 'amb_ari_1',
        speaker: 'bang_ari',
        emotion: 'hangat',
        text: 'Capo-nya enak banget dipakai, Mar! Semangat terus ya—jangan lupa mainin lagu "Pulang" buat Kira.',
      },
    },
  },
  ambient_budi: {
    id: 'ambient_budi',
    startNodeId: 'amb_budi_1',
    nodes: {
      amb_budi_1: {
        id: 'amb_budi_1',
        speaker: 'pak_budi',
        emotion: 'tenang',
        text: 'Lampu dermaga sudah terang lagi. Danau Senja selalu tenang menunggu keluargamu jalan-jalan sore di sini.',
      },
    },
  },

  // === INTERAKSI INTERIOR BARU: MEJA GAMBAR KIRA, KIOS HARMONI & TOKO MUSIK NADA LAMA ===
  interior_kira_drawing_table: {
    id: 'interior_kira_drawing_table',
    startNodeId: 'ikd_1',
    nodes: {
      ikd_1: {
        id: 'ikd_1',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Sudut kecil paling ramai warna di rumah ini... Di atas meja kayu mungil Kira ada buku gambar terbuka, krayon yang ujungnya sudah tumpul, dan boneka beruang cokelat kesayangannya.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'ikd_2',
      },
      ikd_2: {
        id: 'ikd_2',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Di halaman tengahnya, Kira menggambar rumah kami, kucing oranye "Sore", dan deretan bintang kuning kecil dengan tulisan miring: "Ayah pulang sebelum gelap."',
        choices: [
          {
            id: 'ikd_draw_star',
            text: 'Ambil krayon kuning dan tambahkan satu bintang besar di pojok kertas Kira',
            nextNodeId: 'ikd_3a',
            effects: {
              kehadiranKeluarga: 1,
              setFlags: ['drew_with_kira_corner'],
              journalEntry: {
                id: 'je_kira_corner',
                title: 'Bintang Kuning di Meja Gambar Kira',
                body: 'Di sudut meja gambar Kira, aku menambahkan satu bintang kuning kecil di samping gambarnya. Semoga saat ia melihatnya nanti, ia tahu Ayah benar-benar melihat setiap karyanya.',
                chapter: 1,
              },
              toast: 'Damar menambahkan gambar bintang hangat di buku sketsa Kira.',
            },
          },
          {
            id: 'ikd_tidy',
            text: 'Rapikan kotak krayon dan elus boneka beruang kecil di rak bukunya',
            nextNodeId: 'ikd_3b',
            effects: {
              kejujuranDiri: 1,
              toast: 'Sudut bermain Kira terasa makin rapi dan hangat.',
            },
          },
        ],
      },
      ikd_3a: {
        id: 'ikd_3a',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Bentuk bintang buatanku agak miring... tapi Kira pasti langsung tertawa lebar begitu tahu Ayah ikut menggambar di bukunya.',
        onEnter: { playSfx: 'chime' },
      },
      ikd_3b: {
        id: 'ikd_3b',
        speaker: 'damar_batin',
        emotion: 'tenang',
        text: 'Masa kecil Kira berlari begitu cepat. Aku tidak mau lagi melewatkan hal-hal kecil di sudut ruang ini.',
        onEnter: { playSfx: 'interact' },
      },
    },
  },

  interior_kios_fridge: {
    id: 'interior_kios_fridge',
    startNodeId: 'ikf_1',
    nodes: {
      ikf_1: {
        id: 'ikf_1',
        speaker: 'damar_batin',
        emotion: 'tenang',
        text: 'Hawa dingin langsung menyapa wajah begitu pintu kaca lemari es Kios Harmoni terbuka. Deretan botol minuman tertata rapi di bawah lampu putih terang.',
        onEnter: { playSfx: 'door' },
        choices: [
          {
            id: 'ikf_straw',
            text: 'Ambil Susu Stroberi Dingin (kesukaan Kira)',
            nextNodeId: 'ikf_2a',
            effects: { kehadiranKeluarga: 1, toast: 'Susu Stroberi dingin segar—selalu jadi favorit Kira!' },
          },
          {
            id: 'ikf_tea',
            text: 'Ambil Teh Melati Dingin untuk melepas haus',
            nextNodeId: 'ikf_2b',
            effects: { kejujuranDiri: 1, toast: 'Tegukan teh melati dingin membuat napas terasa lebih lega.' },
          },
          {
            id: 'ikf_coffee',
            text: 'Ambil Kopi Susu Botol dingin',
            nextNodeId: 'ikf_2c',
            effects: { toast: 'Rasa kopi manis-pahit yang akrab di perjalanan pulang kerja.' },
          },
        ],
      },
      ikf_2a: {
        id: 'ikf_2a',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Botol merah muda kecil ini dingin di telapak tangan. Lucu juga bagaimana sekarang hampir setiap rak minimarket langsung mengingatkanku pada Kira.',
        onEnter: { playSfx: 'interact' },
      },
      ikf_2b: {
        id: 'ikf_2b',
        speaker: 'damar_batin',
        emotion: 'tenang',
        text: 'Segar sekali. Kadang jeda dua menit di dalam minimarket 24 jam saja sudah cukup meredakan penat seharian.',
        onEnter: { playSfx: 'coffee' },
      },
      ikf_2c: {
        id: 'ikf_2c',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Lumayan buat penambah tenaga, walau tetap belum bisa mengalahkan racikan kopi manual Bima di seberang jalan.',
        onEnter: { playSfx: 'coffee' },
      },
    },
  },

  interior_kios_tea: {
    id: 'interior_kios_tea',
    startNodeId: 'ikt_1',
    nodes: {
      ikt_1: {
        id: 'ikt_1',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Uap hangat naik dari gelas kertas teh melati di samping meja kasir. Dari balik kaca besar Kios Harmoni, lampu-lampu kota dan mobil yang melintas terlihat begitu damai.',
        onEnter: { playSfx: 'coffee' },
      },
    },
  },

  interior_music_cassette: {
    id: 'interior_music_cassette',
    startNodeId: 'imc_1',
    nodes: {
      imc_1: {
        id: 'imc_1',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Aroma kayu tua dan sampul kaset lawas di dalam "Nada Lama" masih persis seperti enam tahun lalu. Tape deck di meja kasir Mas Bagas masih menyala hangat, siap memutar pita kaset mana pun yang kupilih.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'imc_2',
      },
      imc_2: {
        id: 'imc_2',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Kaset demo lama kami berputar pelan dengan bunyi "klik" yang akrab... Rasanya hangat sekali berdiri di dalam toko ini lagi, bukan sekadar mengintip dari luar kaca.',
        onEnter: { playSfx: 'chime', kejujuranDiri: 1 },
        onEnd: {
          setFlags: ['visited_nada_lama_cassette'],
          journalEntry: {
            id: 'je_nada_lama_inside',
            title: 'Kaset Berputar di Dalam "Nada Lama"',
            body: 'Aku melangkah masuk ke dalam Toko Musik "Nada Lama" dan memutar kaset lama di rak kayu Mas Bagas. Musik ternyata tidak pernah pergi—ia hanya menunggu aku pulang dan mau mendengarkannya lagi.',
            chapter: 1,
          },
          toast: 'Kaset Demo "Langkah Kecil" 2018 diputar di Tape Deck Nada Lama!',
        },
      },
    },
  },
};

export const ALL_DIALOGUES: Record<string, DialogueScript> = {
  ...CHAPTER_1_DIALOGUES,
  ...CHAPTER_2_DIALOGUES,
  ...CHAPTER_3_DIALOGUES,
  ...SIDE_QUEST_DIALOGUES,
  ...EASTER_EGG_DIALOGUES,
  ...GIFT_DIALOGUES,
  ...AMBIENT_DIALOGUES,
};
