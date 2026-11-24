import { DialogueScript, SideQuestDefinition } from '../types/game';

export const SIDE_QUESTS: SideQuestDefinition[] = [
  {
    id: 'sq_pak_darman',
    title: 'Buku yang Tak Sempat Dibaca',
    npcId: 'pak_darman',
    npcName: 'Pak Darman',
    location: 'stasiun_tua',
    availableFromChapter: 1,
    summary: 'Pak Darman, penjual buku tua di Stasiun Senja, kehilangan pembatas buku berisi tulisan tangan mendiang istrinya di sekitar Taman Danau.',
    stages: [
      {
        stage: 1,
        objective: 'Cari pembatas buku Pak Darman di dekat bangku Taman Danau Senja.',
        targetPos: [-69.5, 0, -14.5],
        location: 'taman_danau',
      },
      {
        stage: 2,
        objective: 'Kembalikan pembatas buku itu kepada Pak Darman di Stasiun Kereta Tua.',
        targetPos: [76, 0.1, -4],
        location: 'stasiun_tua',
      },
    ],
    reflectionNote: 'Pak Darman mengingatkanku bahwa kalimat "nanti saja" adalah pencuri waktu paling halus dalam hidup manusia.',
  },
  {
    id: 'sq_nenek_sari',
    title: 'Bangku di Pinggir Danau',
    npcId: 'nenek_sari',
    npcName: 'Nenek Sari',
    location: 'taman_danau',
    availableFromChapter: 1,
    summary: 'Nenek Sari duduk sendiri di tepi Danau Senja menunggu kabar dari anaknya yang sibuk bekerja. Ia ingin dibantu mengambilkan teh hangat dari Kios Harmoni.',
    stages: [
      {
        stage: 1,
        objective: 'Ambilkan teh hangat untuk Nenek Sari di Kios 24 Jam Harmoni (bicara dengan Mbak Lilis).',
        targetPos: [24, 0, 15.8],
        location: 'minimarket',
      },
      {
        stage: 2,
        objective: 'Antarkan teh hangat itu dan duduk sebentar bersama Nenek Sari di Taman Danau.',
        targetPos: [-68, 0, -18],
        location: 'taman_danau',
      },
    ],
    reflectionNote: 'Nenek Sari tidak pernah meminta kiriman uang lebih banyak dari anaknya. Ia hanya rindu mendengar suara anaknya tanpa terburu-buru.',
  },
  {
    id: 'sq_mas_raka',
    title: 'Shift Tengah Malam',
    npcId: 'mas_raka',
    npcName: 'Mas Raka',
    location: 'jembatan_sungai',
    availableFromChapter: 1,
    summary: 'Mas Raka, pekerja shift malam di Jembatan Tepi Sungai, tampak kelelahan memikirkan apakah harus ambil lembur lagi atau pulang menemani anaknya.',
    stages: [
      {
        stage: 1,
        objective: 'Minta segelas kopi hangat dari Bima di Kedai Kopi Sudut untuk Mas Raka.',
        targetPos: [-20, 0.08, 20.5],
        location: 'kedai_bima',
      },
      {
        stage: 2,
        objective: 'Bawakan kopi hangat itu kepada Mas Raka di Jembatan Tepi Sungai.',
        targetPos: [-48, 0.24, -5.0],
        location: 'jembatan_sungai',
      },
    ],
    reflectionNote: 'Melihat Mas Raka seperti bercermin di sungai malam. Kadang kita terus berlari bukan karena serakah, melainkan karena takut mengecewakan keluarga.',
  },
  {
    id: 'sq_mas_bagas',
    title: 'Senar yang Putus',
    npcId: 'mas_bagas',
    npcName: 'Mas Bagas',
    location: 'toko_musik',
    availableFromChapter: 1,
    summary: 'Mas Bagas di Toko Musik "Nada Lama" menyimpan amplop lama milik mantan band Damar dan ingin Damar mendengarkan ceritanya setelah mengambilkan catatan dari Kedai Bima.',
    stages: [
      {
        stage: 1,
        objective: 'Tanyakan kunci kotak arsip lama kepada Bima di Kedai Kopi Sudut.',
        targetPos: [-20, 0.08, 20.5],
        location: 'kedai_bima',
      },
      {
        stage: 2,
        objective: 'Kembali ke Mas Bagas di Toko Musik "Nada Lama" untuk membuka kenangan lama.',
        targetPos: [-20, 0, -17.5],
        location: 'toko_musik',
      },
    ],
    reflectionNote: 'Mas Bagas tidak pernah menjual gitarku kepada siapa pun. Ia menyimpannya di belakang etalase, percaya suatu hari aku akan kembali sebagai diriku sendiri.',
  },
  {
    id: 'sq_mbak_lilis',
    title: 'Kopi Instan Jam Sembilan',
    npcId: 'mbak_lilis',
    npcName: 'Mbak Lilis',
    location: 'minimarket',
    availableFromChapter: 1,
    summary: 'Mbak Lilis di Kios 24 Jam Harmoni selalu bekerja shift panjang demi membiayai sekolah adiknya, namun ragu apakah kado buku gambar sederhana cukup berarti.',
    stages: [
      {
        stage: 1,
        objective: 'Minta rekomendasi buku gambar bekas berkualitas dari Pak Darman di Stasiun Kereta Tua.',
        targetPos: [76, 0.1, -4],
        location: 'stasiun_tua',
      },
      {
        stage: 2,
        objective: 'Sampaikan buku gambar itu kepada Mbak Lilis di Kios 24 Jam Harmoni.',
        targetPos: [24, 0, 15.8],
        location: 'minimarket',
      },
    ],
    reflectionNote: 'Bukan harga kado yang diingat anak-anak atau adik kita—melainkan mata kita yang benar-benar menatap mereka saat memberikannya.',
  },
  {
    id: 'sq_bu_wati',
    title: 'Lampu Teras yang Menyala',
    npcId: 'bu_wati',
    npcName: 'Bu Wati',
    location: 'perumahan',
    availableFromChapter: 1,
    summary: 'Bu Wati di Perumahan Melati kesulitan mengganti sakelar lampu terasnya yang mati. Ia selalu menyalakan lampu teras setiap sore sebagai tanda rumah selalu terbuka.',
    stages: [
      {
        stage: 1,
        objective: 'Periksa kotak sakelar teras di samping rumah Bu Wati untuk menyalakan kembali lampunya.',
        targetPos: [21.5, 0, 62.5],
        location: 'perumahan',
      },
      {
        stage: 2,
        objective: 'Berbincang sebentar dengan Bu Wati di teras rumahnya.',
        targetPos: [24, 0, 61.8],
        location: 'perumahan',
      },
    ],
    reflectionNote: 'Kata Bu Wati: "Lampu teras itu kecil, Mar. Tapi buat orang yang capek di jalan, cahaya sekecil itu bisa menyelamatkan hatinya."',
  },
];

export const SIDE_QUEST_DIALOGUES: Record<string, DialogueScript> = {
  // === 1. PAK DARMAN ===
  sq_pak_darman_start: {
    id: 'sq_pak_darman_start',
    startNodeId: 'sq_darman_1',
    nodes: {
      sq_darman_1: {
        id: 'sq_darman_1',
        speaker: 'pak_darman',
        emotion: 'lelah',
        text: 'Eh, Nak Damar... lama nggak lewat lapak Bapak. Biasanya sore-sore mampir lihat novel lama.',
        nextNodeId: 'sq_darman_2',
      },
      sq_darman_2: {
        id: 'sq_darman_2',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Halo, Pak Darman. Sehat, Pak? Kok kelihatannya Bapak lagi bingung cari sesuatu di tumpukan buku?',
        nextNodeId: 'sq_darman_3',
      },
      sq_darman_3: {
        id: 'sq_darman_3',
        speaker: 'pak_darman',
        emotion: 'sedih',
        text: 'Iya, Nak... Tadi pagi Bapak duduk baca buku di dekat bangku Taman Danau. Pembatas buku dari kertas bunga kering milik almarhumah Ibu kayaknya jatuh di sana. Kaki Bapak hari ini agak nyeri buat jalan jauh balik ke taman.',
        choices: [
          {
            id: 'sq_darman_accept',
            text: 'Biar saya bantu carikan ke Taman Danau ya, Pak. Bapak tunggu di sini saja.',
            subtext: 'Meluangkan waktu untuk orang lain',
            nextNodeId: 'sq_darman_4',
            effects: {
              kehadiranKeluarga: 1,
              startSideQuest: 'sq_pak_darman',
              toast: 'Misi Sampingan dimulai: Buku yang Tak Sempat Dibaca',
            },
          },
          {
            id: 'sq_darman_later',
            text: 'Nanti kalau saya lewat Taman Danau, saya lihatkan ya, Pak.',
            nextNodeId: 'sq_darman_4',
            effects: {
              startSideQuest: 'sq_pak_darman',
              toast: 'Misi Sampingan dimulai: Buku yang Tak Sempat Dibaca',
            },
          },
        ],
      },
      sq_darman_4: {
        id: 'sq_darman_4',
        speaker: 'pak_darman',
        emotion: 'haru',
        text: 'Terima kasih banyak, Nak Damar. Di kertas itu ada satu kalimat tulisan tangan Ibu yang selalu bikin Bapak kuat buka lapak tiap pagi.',
      },
    },
  },
  sq_pak_darman_item: {
    id: 'sq_pak_darman_item',
    startNodeId: 'sq_darman_item_1',
    nodes: {
      sq_darman_item_1: {
        id: 'sq_darman_item_1',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Ini dia... terselip di bawah kaki bangku taman. Pembatas buku dari kertas tipis dengan tulisan pena biru yang agak pudar: "Jangan baca terlalu cepat, Mas. Nanti kita bahas halaman selanjutnya sambil minum teh sore."',
        onEnter: {
          playSfx: 'page',
          advanceSideQuest: { questId: 'sq_pak_darman', stage: 2 },
          setFlags: ['has_darman_bookmark'],
          toast: 'Pembatas buku Pak Darman ditemukan',
        },
        nextNodeId: 'sq_darman_item_2',
      },
      sq_darman_item_2: {
        id: 'sq_darman_item_2',
        speaker: 'damar_batin',
        emotion: 'sedih',
        text: 'Aku harus segera mengembalikannya ke Pak Darman di Stasiun Tua.',
      },
    },
  },
  sq_pak_darman_complete: {
    id: 'sq_pak_darman_complete',
    startNodeId: 'sq_darman_end_1',
    nodes: {
      sq_darman_end_1: {
        id: 'sq_darman_end_1',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Pak Darman, ketemu! Masih utuh, nggak kena air sama sekali.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'sq_darman_end_2',
      },
      sq_darman_end_2: {
        id: 'sq_darman_end_2',
        speaker: 'pak_darman',
        emotion: 'haru',
        text: 'Alhamdulillah... Ya ampun, terima kasih banyak, Damar. Kamu tahu nggak kenapa Bapak sampai segitunya nyari kertas kecil ini?',
        nextNodeId: 'sq_darman_end_3',
      },
      sq_darman_end_3: {
        id: 'sq_darman_end_3',
        speaker: 'pak_darman',
        emotion: 'sedih',
        text: 'Dulu waktu seumuran kamu, tiap Ibu ngajak ngobrol soal buku yang lagi dia baca, Bapak selalu jawab: "Nanti ya, Bu, Bapak masih beresin kerjaan." Sampai akhirnya waktu yang "nanti" itu nggak pernah datang lagi.',
        nextNodeId: 'sq_darman_end_4',
      },
      sq_darman_end_4: {
        id: 'sq_darman_end_4',
        speaker: 'pak_darman',
        emotion: 'hangat',
        text: 'Kalau istrimu atau anakmu masih nunggu di rumah hari ini... jangan terlalu sering bilang "nanti", ya, Nak.',
        onEnd: {
          kejujuranDiri: 2,
          kehadiranKeluarga: 2,
          completeSideQuest: 'sq_pak_darman',
          playSfx: 'chime',
          journalEntry: {
            id: 'je_sq_darman',
            title: 'Pelajaran dari Pak Darman',
            body: 'Pak Darman menyimpan pembatas buku mendiang istrinya dengan penuh penyesalan karena dulu terlalu sering menjawab "nanti saja". Aku tidak mau suatu hari menatap meja makan kosong dengan penyesalan yang sama.',
            chapter: 1,
          },
          toast: 'Misi Sampingan Selesai: Buku yang Tak Sempat Dibaca',
        },
      },
    },
  },

  // === 2. NENEK SARI ===
  sq_nenek_sari_start: {
    id: 'sq_nenek_sari_start',
    startNodeId: 'sq_sari_1',
    nodes: {
      sq_sari_1: {
        id: 'sq_sari_1',
        speaker: 'nenek_sari',
        emotion: 'tenang',
        text: 'Angin danau hari ini enak ya, Nak... Bikin ngantuk, tapi damai.',
        nextNodeId: 'sq_sari_2',
      },
      sq_sari_2: {
        id: 'sq_sari_2',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Iya, Nek. Nenek sendirian di sini? Sudah minum atau makan siang?',
        nextNodeId: 'sq_sari_3',
      },
      sq_sari_3: {
        id: 'sq_sari_3',
        speaker: 'nenek_sari',
        emotion: 'hangat',
        text: 'Tadi anak Nenek janji mau telepon jam segini, tapi katanya rapat lagi mundur. Nenek cuma pengin teh melati hangat dari Kios Harmoni di seberang jembatan, tapi anginnya mulai kencang.',
        nextNodeId: 'sq_sari_4',
      },
      sq_sari_4: {
        id: 'sq_sari_4',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Biar saya belikan ke Kios Harmoni ya, Nek. Nenek duduk nyaman di sini dulu.',
        onEnd: {
          startSideQuest: 'sq_nenek_sari',
          toast: 'Misi Sampingan dimulai: Bangku di Pinggir Danau',
        },
      },
    },
  },
  sq_nenek_sari_complete: {
    id: 'sq_nenek_sari_complete',
    startNodeId: 'sq_sari_end_1',
    nodes: {
      sq_sari_end_1: {
        id: 'sq_sari_end_1',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Ini teh melatinya, Nek. Masih hangat, tadi Mbak Lilis baru seduh.',
        onEnter: { playSfx: 'coffee' },
        nextNodeId: 'sq_sari_end_2',
      },
      sq_sari_end_2: {
        id: 'sq_sari_end_2',
        speaker: 'nenek_sari',
        emotion: 'haru',
        text: 'Duh, baik banget kamu, Nak. Duduk sebentar, yuk... Muka kamu mirip anak Nenek kalau lagi pulang—matanya kelihatan mikirin sepuluh hal sekaligus.',
        nextNodeId: 'sq_sari_end_3',
      },
      sq_sari_end_3: {
        id: 'sq_sari_end_3',
        speaker: 'nenek_sari',
        emotion: 'hangat',
        text: 'Anak Nenek itu anak baik, tiap bulan nggak pernah telat kirim uang. Tapi kadang Nenek pengin bilang: "Nak, Ibu nggak butuh rumah lebih besar. Ibu cuma kangen dengar kamu cerita hal-hal receh tanpa lihat jam tangan."',
        nextNodeId: 'sq_sari_end_4',
      },
      sq_sari_end_4: {
        id: 'sq_sari_end_4',
        speaker: 'damar',
        emotion: 'haru',
        text: 'Terima kasih sudah mau cerita, Nek... Kata-kata Nenek bikin saya mikir banyak hal hari ini.',
        onEnd: {
          kehadiranKeluarga: 2,
          kejujuranDiri: 1,
          completeSideQuest: 'sq_nenek_sari',
          playSfx: 'chime',
          journalEntry: {
            id: 'je_sq_sari',
            title: 'Teh Hangat Bersama Nenek Sari',
            body: 'Nenek Sari mengingatkanku bahwa yang paling dirindukan keluarga bukanlah keberhasilan besar, melainkan kehadiran tanpa tergesa-gesa melihat jam tangan.',
            chapter: 1,
          },
          toast: 'Misi Sampingan Selesai: Bangku di Pinggir Danau',
        },
      },
    },
  },

  // === 3. MAS RAKA ===
  sq_mas_raka_start: {
    id: 'sq_mas_raka_start',
    startNodeId: 'sq_raka_1',
    nodes: {
      sq_raka_1: {
        id: 'sq_raka_1',
        speaker: 'mas_raka',
        emotion: 'lelah',
        text: 'Huh... lihat air sungai begini ternyata bikin kepala agak dingin sedikit, ya, Mas.',
        nextNodeId: 'sq_raka_2',
      },
      sq_raka_2: {
        id: 'sq_raka_2',
        speaker: 'damar',
        emotion: 'tenang',
        text: 'Baru kelar shift atau baru mau mulai, Mas? Kelihatan capek banget.',
        nextNodeId: 'sq_raka_3',
      },
      sq_raka_3: {
        id: 'sq_raka_3',
        speaker: 'mas_raka',
        emotion: 'ragu',
        text: 'Barusan ditawarin lembur tambahan sampai tengah malam. Lumayan buat bayar les anak... tapi istriku barusan kirim foto anakku masih bangun nungguin aku pulang. Bingung, Mas. Pengin kopi panas dulu biar melek, tapi dompet lagi mepet.',
        nextNodeId: 'sq_raka_4',
      },
      sq_raka_4: {
        id: 'sq_raka_4',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Tunggu sini sebentar, Mas. Aku kenal pemilik Kedai Kopi Sudut di seberang sana. Biar aku ambilin kopi hangat buat Mas Raka, gratis.',
        onEnd: {
          startSideQuest: 'sq_mas_raka',
          toast: 'Misi Sampingan dimulai: Shift Tengah Malam',
        },
      },
    },
  },
  sq_mas_raka_complete: {
    id: 'sq_mas_raka_complete',
    startNodeId: 'sq_raka_end_1',
    nodes: {
      sq_raka_end_1: {
        id: 'sq_raka_end_1',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Ini kopinya, Mas Raka. Bima bikin agak manis sedikit biar badannya hangat.',
        onEnter: { playSfx: 'coffee' },
        nextNodeId: 'sq_raka_end_2',
      },
      sq_raka_end_2: {
        id: 'sq_raka_end_2',
        speaker: 'mas_raka',
        emotion: 'haru',
        text: 'Wah, makasih banget, Mas Damar! Sumpah nggak nyangka masih ada orang asing mau repot begini. Barusan sambil nunggu, aku mikir ulang... kayaknya lembur malam ini kutolak aja deh.',
        nextNodeId: 'sq_raka_end_3',
      },
      sq_raka_end_3: {
        id: 'sq_raka_end_3',
        speaker: 'mas_raka',
        emotion: 'hangat',
        text: 'Uang bisa dicari besok, tapi malam di mana anakku masih mau nungguin aku pulang... nggak bakal bertahan selamanya. Mas juga jangan lupa pulang, ya!',
        onEnd: {
          kejujuranDiri: 2,
          kehadiranKeluarga: 2,
          completeSideQuest: 'sq_mas_raka',
          playSfx: 'chime',
          journalEntry: {
            id: 'je_sq_raka',
            title: 'Obrolan di Jembatan Sungai',
            body: 'Mas Raka akhirnya memilih pulang menemui anaknya ketimbang mengambil lembur tambahan. Mendengarnya berbicara seperti melihat sisi diriku sendiri yang selama ini berusaha kujawab.',
            chapter: 2,
          },
          toast: 'Misi Sampingan Selesai: Shift Tengah Malam',
        },
      },
    },
  },

  // === 4. MAS BAGAS ===
  sq_mas_bagas_start: {
    id: 'sq_mas_bagas_start',
    startNodeId: 'sq_bagas_1',
    nodes: {
      sq_bagas_1: {
        id: 'sq_bagas_1',
        speaker: 'mas_bagas',
        emotion: 'hangat',
        text: 'Lho... ini Damar yang dulu main gitar bareng Bima, kan? Wah, udah rapi banget sekarang pakai kemeja kantor!',
        nextNodeId: 'sq_bagas_2',
      },
      sq_bagas_2: {
        id: 'sq_bagas_2',
        speaker: 'damar',
        emotion: 'ragu',
        text: 'Halo, Mas Bagas. Masih ingat aja... Padahal udah bertahun-tahun aku nggak mampir ke sini.',
        nextNodeId: 'sq_bagas_3',
      },
      sq_bagas_3: {
        id: 'sq_bagas_3',
        speaker: 'mas_bagas',
        emotion: 'hangat',
        text: 'Gimana bisa lupa, Mar? Ada satu kotak arsip lama milik band kalian yang dulu Bima titipkan ke aku, tapi kuncinya masih dipegang Bima di kedainya. Coba minta ke dia, terus balik ke sini—ada yang pengin kutunjukkan.',
        onEnd: {
          startSideQuest: 'sq_mas_bagas',
          toast: 'Misi Sampingan dimulai: Senar yang Putus',
        },
      },
    },
  },
  sq_mas_bagas_complete: {
    id: 'sq_mas_bagas_complete',
    startNodeId: 'sq_bagas_end_1',
    nodes: {
      sq_bagas_end_1: {
        id: 'sq_bagas_end_1',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Mas Bagas, ini kuncinya dari Bima. Katanya Mas Bagas nyimpan sesuatu dari tahun 2019?',
        onEnter: { playSfx: 'interact' },
        nextNodeId: 'sq_bagas_end_2',
      },
      sq_bagas_end_2: {
        id: 'sq_bagas_end_2',
        speaker: 'mas_bagas',
        emotion: 'haru',
        text: 'Buka aja, Mar... Di dalamnya ada satu set senar akustik baru dan nota penjualan gitarmu dulu yang sengaja nggak pernah kuanggap "terjual". Setiap bulan Bima selalu nitip sedikit uang supaya gitarmu jangan dijual ke orang lain.',
        onEnter: { playSfx: 'guitar' },
        nextNodeId: 'sq_bagas_end_3',
      },
      sq_bagas_end_3: {
        id: 'sq_bagas_end_3',
        speaker: 'damar',
        emotion: 'haru',
        text: 'Bima... ngelakuin itu selama enam tahun tanpa pernah bilang sepatah kata pun ke aku?',
        nextNodeId: 'sq_bagas_end_4',
      },
      sq_bagas_end_4: {
        id: 'sq_bagas_end_4',
        speaker: 'mas_bagas',
        emotion: 'hangat',
        text: 'Katanya: "Suatu hari Damar pasti capek pura-pura lupa siapa dirinya. Pas hari itu datang, gitarnya harus masih ada." Kapan pun kamu siap, gitar itu milikmu, Mar.',
        onEnd: {
          kejujuranDiri: 3,
          setFlags: ['reclaimed_guitar_memory'],
          completeSideQuest: 'sq_mas_bagas',
          playSfx: 'chime',
          journalEntry: {
            id: 'je_sq_bagas',
            title: 'Gitar yang Tidak Pernah Dijual',
            body: 'Ternyata Bima dan Mas Bagas menjaga gitar lamaku selama enam tahun agar tidak jatuh ke tangan orang lain. Ada orang-orang di hidupku yang diam-diam terus percaya pada diriku, bahkan saat aku sendiri sudah menyerah.',
            chapter: 2,
          },
          toast: 'Misi Sampingan Selesai: Senar yang Putus',
        },
      },
    },
  },

  // === 5. MBAK LILIS ===
  sq_mbak_lilis_start: {
    id: 'sq_mbak_lilis_start',
    startNodeId: 'sq_lilis_1',
    nodes: {
      sq_lilis_1: {
        id: 'sq_lilis_1',
        speaker: 'mbak_lilis',
        emotion: 'hangat',
        text: 'Selamat datang di Kios Harmoni, Mas Damar! Mau kopi instan seperti biasa atau lagi cari camilan buat Dek Kira?',
        nextNodeId: 'sq_lilis_2',
      },
      sq_lilis_2: {
        id: 'sq_lilis_2',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Lagi jalan sebentar aja, Mbak Lilis. Mbak kelihatan lagi milih-milih buku tulis di rak?',
        nextNodeId: 'sq_lilis_3',
      },
      sq_lilis_3: {
        id: 'sq_lilis_3',
        speaker: 'mbak_lilis',
        emotion: 'ragu',
        text: 'Iya nih, Mas... Besok adikku ulang tahun. Aku jaga shift dobel jadi nggak sempat ke toko buku besar. Dengar-dengar Pak Darman di Stasiun Tua punya koleksi buku gambar ilustrasi lama yang bagus. Kalau Mas sempat lewat stasiun, boleh bantu tanyakan?',
        nextNodeId: 'sq_lilis_4',
      },
      sq_lilis_4: {
        id: 'sq_lilis_4',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Boleh banget, Mbak. Nanti aku mampir ke lapak Pak Darman.',
        onEnd: {
          startSideQuest: 'sq_mbak_lilis',
          toast: 'Misi Sampingan dimulai: Kopi Instan Jam Sembilan',
        },
      },
    },
  },
  sq_mbak_lilis_complete: {
    id: 'sq_mbak_lilis_complete',
    startNodeId: 'sq_lilis_end_1',
    nodes: {
      sq_lilis_end_1: {
        id: 'sq_lilis_end_1',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Mbak Lilis, ini buku sketsa ilustrasi dari Pak Darman. Katanya buat adiknya Mbak Lilis, gratis karena masih ada sisa stok lama yang bagus banget.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'sq_lilis_end_2',
      },
      sq_lilis_end_2: {
        id: 'sq_lilis_end_2',
        speaker: 'mbak_lilis',
        emotion: 'haru',
        text: 'Ya ampun, bagus banget kertasnya! Makasih banyak ya, Mas Damar. Kadang aku suka merasa bersalah karena nggak bisa kasih kado mahal ke adikku...',
        nextNodeId: 'sq_lilis_end_3',
      },
      sq_lilis_end_3: {
        id: 'sq_lilis_end_3',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Percaya deh, Mbak... Anak-anak nggak pernah lihat label harganya. Mereka cuma ingat bahwa kakaknya pulang membawa sesuatu sambil tersenyum.',
        onEnd: {
          kehadiranKeluarga: 2,
          kejujuranDiri: 1,
          completeSideQuest: 'sq_mbak_lilis',
          playSfx: 'chime',
          journalEntry: {
            id: 'je_sq_lilis',
            title: 'Buku Gambar untuk Adik Mbak Lilis',
            body: 'Saat menenangkan Mbak Lilis bahwa perhatian lebih berharga daripada kado mahal, aku sadar kalimat itu sebenarnya kutujukan untuk diriku sendiri.',
            chapter: 1,
          },
          toast: 'Misi Sampingan Selesai: Kopi Instan Jam Sembilan',
        },
      },
    },
  },

  // === 6. BU WATI ===
  sq_bu_wati_start: {
    id: 'sq_bu_wati_start',
    startNodeId: 'sq_wati_1',
    nodes: {
      sq_wati_1: {
        id: 'sq_wati_1',
        speaker: 'bu_wati',
        emotion: 'hangat',
        text: 'Nak Damar! Wah, baru sempat lihat kamu jalan kaki santai di gang. Biasanya langsung ngebut naik motor.',
        nextNodeId: 'sq_wati_2',
      },
      sq_wati_2: {
        id: 'sq_wati_2',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Iya, Bu Wati. Lagi pengin jalan kaki sambil menghirup udara. Ibu lagi benerin teras?',
        nextNodeId: 'sq_wati_3',
      },
      sq_wati_3: {
        id: 'sq_wati_3',
        speaker: 'bu_wati',
        emotion: 'ragu',
        text: 'Kotak sakelar lampu teras di dinding samping rumah Ibu agak macet, Nak. Ibu takut naik kursi. Boleh minta tolong dicek sebentar? Ibu nggak tenang kalau lampu teras mati pas malam.',
        nextNodeId: 'sq_wati_4',
      },
      sq_wati_4: {
        id: 'sq_wati_4',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Siap, Bu. Biar saya cek kotak sakelarnya sekarang.',
        onEnd: {
          startSideQuest: 'sq_bu_wati',
          toast: 'Misi Sampingan dimulai: Lampu Teras yang Menyala',
        },
      },
    },
  },
  sq_bu_wati_switch: {
    id: 'sq_bu_wati_switch',
    startNodeId: 'sq_wati_sw_1',
    nodes: {
      sq_wati_sw_1: {
        id: 'sq_wati_sw_1',
        speaker: 'damar_batin',
        emotion: 'tenang',
        text: 'Klik. MCB-nya cuma turun sedikit karena lembap. Lampu teras Bu Wati sudah menyala hangat lagi.',
        onEnter: {
          playSfx: 'switch',
          advanceSideQuest: { questId: 'sq_bu_wati', stage: 2 },
          setFlags: ['bu_wati_lamp_fixed'],
          toast: 'Lampu teras Bu Wati kembali menyala',
        },
      },
    },
  },
  sq_bu_wati_complete: {
    id: 'sq_bu_wati_complete',
    startNodeId: 'sq_wati_end_1',
    nodes: {
      sq_wati_end_1: {
        id: 'sq_wati_end_1',
        speaker: 'bu_wati',
        emotion: 'haru',
        text: 'Alhamdulillah, nyala lagi! Makasih banyak, Damar. Kamu tahu kenapa Ibu selalu nyalain lampu teras bahkan saat anak-anak Ibu tinggal di luar kota?',
        nextNodeId: 'sq_wati_end_2',
      },
      sq_wati_end_2: {
        id: 'sq_wati_end_2',
        speaker: 'bu_wati',
        emotion: 'hangat',
        text: 'Karena rumah yang lampunya nyala bikin siapa pun yang lewat merasa masih ada tempat yang menunggu mereka pulang. Oh iya, titip salam buat Nadia ya... Ibu sering lihat dia duduk di teras malam-malam sambil nungguin kamu.',
        nextNodeId: 'sq_wati_end_3',
      },
      sq_wati_end_3: {
        id: 'sq_wati_end_3',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Nadia... duduk di teras sendirian menungguku pulang, dan selama ini aku bahkan tidak pernah bertanya apakah dia kedinginan.',
        onEnd: {
          kehadiranKeluarga: 2,
          kejujuranDiri: 1,
          completeSideQuest: 'sq_bu_wati',
          playSfx: 'chime',
          journalEntry: {
            id: 'je_sq_wati',
            title: 'Lampu Teras Bu Wati',
            body: 'Bu Wati bercerita bahwa Nadia sering duduk sendirian di teras rumah menunggu kepulanganku. Rumah bukan hanya bangunan yang kubayar cicilannya—rumah adalah orang yang selalu menyalakan cahaya untukku.',
            chapter: 1,
          },
          toast: 'Misi Sampingan Selesai: Lampu Teras yang Menyala',
        },
      },
    },
  },

  // === DIALOG PENGHUBUNG SIDE QUEST ===
  sq_helper_lilis_tea: {
    id: 'sq_helper_lilis_tea',
    startNodeId: 'sq_hl_1',
    nodes: {
      sq_hl_1: {
        id: 'sq_hl_1',
        speaker: 'mbak_lilis',
        emotion: 'hangat',
        text: 'Oh, teh melati buat Nenek Sari di taman? Kebetulan baru banget aku seduh air panasnya, Mas Damar! Hati-hati panas ya gelasnya.',
        onEnter: {
          playSfx: 'coffee',
          advanceSideQuest: { questId: 'sq_nenek_sari', stage: 2 },
          setFlags: ['has_nenek_tea'],
          toast: 'Teh melati hangat untuk Nenek Sari didapatkan',
        },
      },
    },
  },
  sq_helper_bima_coffee: {
    id: 'sq_helper_bima_coffee',
    startNodeId: 'sq_hb_1',
    nodes: {
      sq_hb_1: {
        id: 'sq_hb_1',
        speaker: 'bima',
        emotion: 'hangat',
        text: 'Buat mas-mas pekerja malam di jembatan? Ambil aja, Mar, aku yang traktir. Tambahin sedikit gula aren biar badannya anget. Baik banget lo hari ini.',
        onEnter: {
          playSfx: 'coffee',
          advanceSideQuest: { questId: 'sq_mas_raka', stage: 2 },
          setFlags: ['has_raka_coffee'],
          toast: 'Kopi hangat untuk Mas Raka didapatkan',
        },
      },
    },
  },
  sq_helper_bima_key: {
    id: 'sq_helper_bima_key',
    startNodeId: 'sq_hbk_1',
    nodes: {
      sq_hbk_1: {
        id: 'sq_hbk_1',
        speaker: 'bima',
        emotion: 'haru',
        text: 'Mas Bagas nyuruh lo ambil kunci kotak arsip? Hehe... akhirnya ya, Mar. Nih kuncinya. Udah lama banget gue simpan di laci mesin kasir, nunggu hari di mana lo sendiri yang datang nyari.',
        onEnter: {
          playSfx: 'interact',
          advanceSideQuest: { questId: 'sq_mas_bagas', stage: 2 },
          setFlags: ['has_bagas_key'],
          toast: 'Kunci kotak arsip lama diterima dari Bima',
        },
      },
    },
  },
  sq_helper_darman_sketchbook: {
    id: 'sq_helper_darman_sketchbook',
    startNodeId: 'sq_hd_1',
    nodes: {
      sq_hd_1: {
        id: 'sq_hd_1',
        speaker: 'pak_darman',
        emotion: 'hangat',
        text: 'Oh, buat adiknya Mbak Lilis yang ramah itu? Kebetulan Bapak punya satu buku sketsa tebal yang kertasnya masih mulus. Kasihkan saja, bilang dari Bapak, nggak usah bayar.',
        onEnter: {
          playSfx: 'page',
          advanceSideQuest: { questId: 'sq_mbak_lilis', stage: 2 },
          setFlags: ['has_lilis_book'],
          toast: 'Buku gambar untuk adik Mbak Lilis didapatkan',
        },
      },
    },
  },
};
