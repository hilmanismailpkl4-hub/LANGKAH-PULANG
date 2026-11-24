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
