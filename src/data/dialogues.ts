import { DialogueScript, MainObjectiveStep } from '../types/game';
import { GIFT_DIALOGUES } from './bagItems';
import { CHARACTER_ECHO_DIALOGUES } from './characterEchoes';
import { EASTER_EGG_DIALOGUES } from './easterEggs';
import { EPILOGUE_DIALOGUES } from './epilogueMorning';
import { FLASHBACK_DIALOGUES } from './flashbacks';
import { KIRA_BEDTIME_DIALOGUES } from './kiraBedtimeStory';
import { PROLOGUE_DIALOGUES } from './prologueAndChapters';
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

  // === ADEGAN CERITA MENDALAM 1: TUGU SEJARAH "KOTA SENJA TEMPO DULU" (KENANGAN ALMARHUM BAPAK 1996) ===
  story_kota_tempo_dulu: {
    id: 'story_kota_tempo_dulu',
    startNodeId: 'skt_1',
    nodes: {
      skt_1: {
        id: 'skt_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Di balik kaca tebal tugu marmer Plaza Nusantara, terpajang tiga lembar foto sepia Kota Senja tahun 1996: Jembatan Sungai yang masih bertiang kayu, stasiun tua tanpa kanopi baja, dan Menara Nusantara yang baru berdiri setengah lantai.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'skt_2',
      },
      skt_2: {
        id: 'skt_2',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Tunggu... di pojok kiri foto jembatan 1996 itu... seorang pria berkemeja kerja kusut berdiri di tanggul sungai, menggandeng bocah laki-laki kecil yang sepatunya kebesaran satu nomor. Di saku bajunya terselip buku catatan kecil.',
        nextNodeId: 'skt_3',
      },
      skt_3: {
        id: 'skt_3',
        speaker: 'damar_batin',
        emotion: 'sedih',
        text: 'Itu almarhum Bapak... dan itu aku, dua puluh empat tahun lalu. Sore itu hujan baru reda, dan Bapak membelikanku dua gulung serabi hangat sebelum kami naik angkot pulang ke Jl. Melati.',
        onEnter: { playSfx: 'chime' },
        nextNodeId: 'skt_4',
      },
      skt_4: {
        id: 'skt_4',
        speaker: 'narator',
        emotion: 'hangat',
        text: 'Suara Bapak seolah masih tertinggal di antara desir angin plaza: "Gedung-gedung di kota ini nanti bakal tumbuh tinggi sekali, Mar. Tapi jangan pernah biarkan gedung tinggi bikin kamu lupa menunduk melihat orang yang kamu sayang."',
        nextNodeId: 'skt_5',
      },
      skt_5: {
        id: 'skt_5',
        speaker: 'damar_batin',
        emotion: 'ragu',
        text: 'Dadaku mendadak sesak. Dulu aku bersumpah tidak akan pernah membiarkan keluargaku merasakan sepinya menunggu ayah pulang larut malam... tapi tanpa sadar, aku malah berdiri di bayangan gedung yang sama sambil mengulang sunyi itu.',
        choices: [
          {
            id: 'skt_choice_break_cycle',
            text: '"Aku baru paham sekarang, Pak... ketakutanku gagal justru membuatku menjauh dari rumah. Aku mau memutus sunyi itu demi Kira dan Nadia."',
            subtext: 'Jujur pada luka masa kecil & memilih hadir utuh untuk keluarga',
            nextNodeId: 'skt_end_honest',
            effects: {
              kejujuranDiri: 2,
              kehadiranKeluarga: 2,
              setFlags: ['remembered_father_1996', 'vowed_break_silence'],
              phoneMessage: {
                id: 'msg_nadia_foto_1996',
                sender: 'Nadia',
                preview: 'Mas, tiba-tiba aku kangen foto kecil kamu sama almarhum Bapak di album ruang tamu. Hati-hati di jalan ya, nanti malam kita buka albumnya bareng Kira.',
                timeLabel: 'Baru saja',
              },
              journalEntry: {
                id: 'je_kota_tempo_dulu',
                title: 'Laki-Laki di Foto Sepia 1996',
                body: 'Di tugu sejarah Plaza Nusantara, aku menemukan foto lama Jembatan Sungai 1996—dan di sudutnya, almarhum Bapak sedang menggandeng tanganku yang masih kecil. Pesannya kini terasa menghujam paling dalam: gedung setinggi apa pun tak ada artinya bila kita lupa menunduk menyapa orang-orang yang kita cintai.',
                chapter: 1,
              },
              toast: 'Kenangan mendalam tersimpan di Jurnal & pesan baru masuk dari Nadia.',
            },
          },
          {
            id: 'skt_choice_gratitude',
            text: '"Terima kasih, Pak, sudah berjuang sekuat tenaga dulu. Kali ini aku mau Kira mengingat tawa ayahnya, bukan hanya punggungku yang lelah."',
            subtext: 'Memaafkan masa lalu dengan rasa syukur yang tenang',
            nextNodeId: 'skt_end_warm',
            effects: {
              kehadiranKeluarga: 2,
              kejujuranDiri: 1,
              setFlags: ['remembered_father_1996'],
              phoneMessage: {
                id: 'msg_nadia_serabi_bapak',
                sender: 'Nadia',
                preview: 'Mas, kalau lewat Jl. Cempaka, titip salam buat Mbah Karso ya. Tadi Kira cerita pengin makan serabi hangat kayak cerita masa kecil Ayah.',
                timeLabel: 'Baru saja',
              },
              journalEntry: {
                id: 'je_kota_tempo_dulu',
                title: 'Laki-Laki di Foto Sepia 1996',
                body: 'Melihat foto sepia almarhum Bapak di Tugu Sejarah Kota Senja membuatku mengerti: ia dulu bekerja keras karena cinta yang tak pandai diucapkan. Kini giliranku belajar mencintai keluargaku tanpa harus kehilangan kehadiran.',
                chapter: 1,
              },
              toast: 'Kenangan masa kecil tersimpan di Jurnal & pesan hangat masuk dari Nadia.',
            },
          },
          {
            id: 'skt_choice_harden',
            text: '"Bapak dulu hidup terlalu berat karena serba pas-pasan. Aku tidak boleh melambat—aku harus memastikan Kira tidak pernah merasakan susah seperti dulu."',
            subtext: 'Memilih terus bertahan dalam tekanan demi rasa aman materi',
            nextNodeId: 'skt_end_guarded',
            effects: {
              ambisiPelarian: 2,
              setFlags: ['remembered_father_1996', 'guarded_father_memory'],
              journalEntry: {
                id: 'je_kota_tempo_dulu',
                title: 'Bayangan Masa Lalu di Foto 1996',
                body: 'Foto sepia Kota Senja 1996 mengingatkanku pada betapa kerasnya hidup almarhum Bapak dulu. Aku masih takut—jika aku berhenti berlari sebentar saja, apakah semua yang kubangun untuk Nadia dan Kira akan runtuh?',
                chapter: 1,
              },
              toast: 'Catatan batin tersimpan di Jurnal.',
            },
          },
        ],
      },
      skt_end_honest: {
        id: 'skt_end_honest',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Aku menyentuh kaca dingin tugu itu pelan. Di belakangku, Menara Nusantara menjulang tinggi—tapi untuk pertama kalinya, bayangannya tidak lagi terasa menelan langkahku.',
        onEnter: { playSfx: 'guitar' },
      },
      skt_end_warm: {
        id: 'skt_end_warm',
        speaker: 'damar_batin',
        emotion: 'tenang',
        text: 'Aneh rasanya—sepotong foto pudar dari dua puluh empat tahun lalu justru membuat langkahku hari ini terasa jauh lebih utuh.',
        onEnter: { playSfx: 'chime' },
      },
      skt_end_guarded: {
        id: 'skt_end_guarded',
        speaker: 'damar_batin',
        emotion: 'lelah',
        text: 'Aku membenarkan tali ransel dan menarik napas pendek. Mungkin kelak, setelah semuanya benar-benar aman, baru aku berani berhenti berlari.',
        onEnter: { playSfx: 'interact' },
      },
    },
  },

  // === ADEGAN CERITA MENDALAM 2: SUDUT TAMAN KUPU-KUPU DANAU SENJA ===
  story_butterfly_garden: {
    id: 'story_butterfly_garden',
    startNodeId: 'sbg_1',
    nodes: {
      sbg_1: {
        id: 'sbg_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Di tepi utara Danau Senja, delapan ekor kupu-kupu kuning, biru, dan jingga mengepak tenang di antara bunga kenikir dan bugenvil yang mekar. Hampir tak ada suara kendaraan yang sanggup menembus rimbun pepohonan di sini.',
        onEnter: { playSfx: 'chime' },
        nextNodeId: 'sbg_2',
      },
      sbg_2: {
        id: 'sbg_2',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Aku teringat satu sore dua tahun lalu, saat Kira mengejar kupu-kupu di taman ini sampai jatuh tersandung lalu menangis. Nadia memeluknya sambil berbisik kalimat yang ternyata juga menampar diriku sendiri...',
        nextNodeId: 'sbg_3',
      },
      sbg_3: {
        id: 'sbg_3',
        speaker: 'nadia',
        emotion: 'hangat',
        text: '"Sayang, kupu-kupu itu nggak bisa ditangkap sambil berlari terburu-buru. Coba Kira duduk diam dan buka telapak tangan... nanti dia sendiri yang datang hinggap."',
        nextNodeId: 'sbg_4',
      },
      sbg_4: {
        id: 'sbg_4',
        speaker: 'damar_batin',
        emotion: 'tenang',
        text: 'Selama ini aku mengejar kebahagiaan dengan cara berlari paling kencang—mengejar target, lembur, dan pengakuan—padahal yang paling kucari mungkin hanya menunggu aku mau duduk diam sebentar.',
        choices: [
          {
            id: 'sbg_still',
            text: 'Berdiri diam sejenak, tarik napas dalam, dan biarkan seekor kupu-kupu jingga hinggap di dekat bahumu',
            subtext: 'Belajar tenang tanpa harus selalu mengejar sesuatu',
            nextNodeId: 'sbg_end_still',
            effects: {
              kejujuranDiri: 2,
              kehadiranKeluarga: 1,
              setFlags: ['visited_butterfly_garden_story'],
              journalEntry: {
                id: 'je_butterfly_garden',
                title: 'Sayap yang Hinggap Saat Kita Berhenti Berlari',
                body: 'Di sudut taman kupu-kupu tepi Danau Senja, aku mengingat kalimat Nadia kepada Kira: hal-hal paling indah dalam hidup sering kali lari saat kita kejar dengan panik, namun datang menghampiri begitu kita berani berhenti dan membuka hati.',
                chapter: 1,
              },
              toast: 'Momen hening di Taman Kupu-Kupu tersimpan di Jurnal.',
            },
          },
          {
            id: 'sbg_text_nadia',
            text: 'Kirim pesan singkat ke Nadia untuk berjanji mengajak Kira melihat kupu-kupu di sudut danau ini besok pagi',
            subtext: 'Membuat janji kecil yang benar-benar ingin ditepati',
            nextNodeId: 'sbg_end_promise',
            effects: {
              kehadiranKeluarga: 2,
              kejujuranDiri: 1,
              setFlags: ['visited_butterfly_garden_story', 'promised_kira_butterflies'],
              phoneMessage: {
                id: 'msg_nadia_kupu_danau',
                sender: 'Nadia',
                preview: 'Serius Mas?! Jangan janji doang lho ya, Kira pasti langsung bangun paling pagi kalau dengar mau lihat taman kupu-kupu di Danau Senja! Aku tunggu ya.',
                timeLabel: 'Baru saja',
              },
              journalEntry: {
                id: 'je_butterfly_garden',
                title: 'Janji Pagi di Taman Bunga Kupu-Kupu',
                body: 'Aku mengirim pesan kepada Nadia dari sudut bunga kupu-kupu Danau Senja—berjanji mengajak Kira datang besok pagi. Kali ini, bukan sekadar janji kosong di atas sticky note kantor.',
                chapter: 1,
              },
              toast: 'Pesan balasan manis masuk dari Nadia di HP!',
            },
          },
        ],
      },
      sbg_end_still: {
        id: 'sbg_end_still',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Seekor kupu-kupu keemasan benar-benar berputar pelan tepat di depan tanganku sebelum terbang ke arah permukaan danau. Ternyata diam sejenak tidak membuat dunia runtuh—justru membuatku kembali merasa hidup.',
        onEnter: { playSfx: 'chime' },
      },
      sbg_end_promise: {
        id: 'sbg_end_promise',
        speaker: 'damar_batin',
        emotion: 'ceria',
        text: 'Ponselku bergetar pelan dengan balasan Nadia. Senyumku langsung terbit tanpa sadar—besok pagi, kursi taman di tepi bunga ini akan penuh oleh tawa Kira.',
        onEnter: { playSfx: 'phone' },
      },
    },
  },
};

export const ALL_DIALOGUES: Record<string, DialogueScript> = {
  ...PROLOGUE_DIALOGUES,
  ...KIRA_BEDTIME_DIALOGUES,
  ...CHAPTER_1_DIALOGUES,
  ...CHAPTER_2_DIALOGUES,
  ...CHAPTER_3_DIALOGUES,
  ...SIDE_QUEST_DIALOGUES,
  ...EASTER_EGG_DIALOGUES,
  ...FLASHBACK_DIALOGUES,
  ...EPILOGUE_DIALOGUES,
  ...CHARACTER_ECHO_DIALOGUES,
  ...GIFT_DIALOGUES,
  ...AMBIENT_DIALOGUES,
};
