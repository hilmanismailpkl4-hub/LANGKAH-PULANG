import { DialogueScript, EndingId, TimeOfDay } from '../types/game';

export interface EpilogueMorningMeta {
  endingId: EndingId;
  title: string;
  subtitle: string;
  objectiveText: string;
  timeOfDay: TimeOfDay;
  introDialogueId: string;
  familyDialogueId: string;
}

export const EPILOGUE_MORNING_META: Record<EndingId, EpilogueMorningMeta> = {
  secret: {
    endingId: 'secret',
    title: 'Epilog · Pagi Lima Senar di Ruang Tamu',
    subtitle: 'Pukul 07:35 · Jl. Melati No. 14',
    objectiveText: 'Temui Nadia & Kira di ruang tamu—gitar mahoni telah kembali ke rumah.',
    timeOfDay: 'morning',
    introDialogueId: 'epilogue_secret_intro',
    familyDialogueId: 'epilogue_secret_family',
  },
  true: {
    endingId: 'true',
    title: 'Epilog · Pagi Tanpa Laptop di Meja Makan',
    subtitle: 'Pukul 07:40 · Jl. Melati No. 14',
    objectiveText: 'Sapa Nadia & Kira di meja makan dan mulai pagi baru bersama mereka.',
    timeOfDay: 'morning',
    introDialogueId: 'epilogue_true_intro',
    familyDialogueId: 'epilogue_true_family',
  },
  good: {
    endingId: 'good',
    title: 'Epilog · Ritme Baru Pukul Tujuh Pagi',
    subtitle: 'Pukul 07:20 · Jl. Melati No. 14',
    objectiveText: 'Nikmati sarapan santai bersama Nadia & Kira sebelum melangkah keluar.',
    timeOfDay: 'morning',
    introDialogueId: 'epilogue_good_intro',
    familyDialogueId: 'epilogue_good_family',
  },
  bad: {
    endingId: 'bad',
    title: 'Epilog · Pagi Sunyi Sebelum Taksi Bandara',
    subtitle: 'Pukul 06:15 · Hujan Tipis di Jl. Melati No. 14',
    objectiveText: 'Temui Nadia sebentar di meja makan yang sunyi sebelum berangkat dinas.',
    timeOfDay: 'rain_dusk',
    introDialogueId: 'epilogue_bad_intro',
    familyDialogueId: 'epilogue_bad_family',
  },
};

/**
 * 4 Adegan Epilog Playable 3D "Pagi Setelah Pulang" sesuai akhir cerita yang diraih pemain.
 */
export const EPILOGUE_DIALOGUES: Record<string, DialogueScript> = {
  // === 1. SECRET ENDING EPILOGUE ===
  epilogue_secret_intro: {
    id: 'epilogue_secret_intro',
    startNodeId: 'ep_sec_i1',
    nodes: {
      ep_sec_i1: {
        id: 'ep_sec_i1',
        speaker: 'narator',
        emotion: 'hangat',
        text: 'Pagi Setelah Pulang · Pukul 07.35. Cahaya matahari madu menembus tirai tipis ruang tamu Jl. Melati No. 14. Di dekat sofa, gitar kayu mahoni yang selama enam tahun dijaga Mas Bagas akhirnya bersandar tenang di rumah sendiri.',
        onEnter: { playSfx: 'guitar' },
        nextNodeId: 'ep_sec_i2',
      },
      ep_sec_i2: {
        id: 'ep_sec_i2',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Untuk pertama kalinya setelah bertahun-tahun, tidak ada rasa sesak saat kubuka mata pagi ini. Aroma nasi goreng hangat dan tawa kecil Kira terdengar dari ruang makan. Waktunya menyapa mereka.',
        onEnd: {
          toast: 'Epilog Playable: Berjalanlah menemui Nadia & Kira di ruang tamu Jl. Melati No. 14!',
        },
      },
    },
  },
  epilogue_secret_family: {
    id: 'epilogue_secret_family',
    startNodeId: 'ep_sec_f1',
    nodes: {
      ep_sec_f1: {
        id: 'ep_sec_f1',
        speaker: 'kira',
        emotion: 'ceria',
        text: 'Ayaaah!! Akhirnya Ayah bangun! Bunda bilang hari ini Ayah nggak buru-buru ke kantor! Ayah beneran mau mainin gitar coklat besar itu lagi buat Kira sama Bunda kan?!',
        onEnter: { playSfx: 'chime' },
        conditionalNext: [
          {
            requiredFlag: 'signed_kira_rainbow_drawing',
            nextNodeId: 'ep_sec_f1_rainbow',
          },
        ],
        nextNodeId: 'ep_sec_f2',
      },
      ep_sec_f1_rainbow: {
        id: 'ep_sec_f1_rainbow',
        speaker: 'kira',
        emotion: 'ceria',
        echoTag: 'Janji Krayon Terpenuhi · Gambar di Pintu Kulkas',
        text: 'Kira menunjuk pintu kulkas dapur dengan bangga. "Lihat tuh Yah!! Gambar pelangi enam senar yang ada matahari oranye buatan Ayah udah Kira tempel paling tengah di kulkas!!"',
        nextNodeId: 'ep_sec_f2',
      },
      ep_sec_f2: {
        id: 'ep_sec_f2',
        speaker: 'nadia',
        emotion: 'hangat',
        text: 'Selamat pagi, musisi ruang tamuku... Nasi gorengnya baru kubuatkan hangat-hangat, kopimu juga tanpa terburu-buru hari ini. Kamu mau mulai pagi pertama kita yang baru dengan apa, Mas?',
        choices: [
          {
            id: 'ep_sec_c_guitar',
            text: 'Ambil gitar mahoni & mainkan Konser Mini "Track 4 — Pulang" untuk Nadia & Kira sekarang!',
            subtext: 'Merayakan lagu yang akhirnya selesai ditulis di depan barisan depanmu',
            nextNodeId: 'ep_sec_r_guitar',
            effects: {
              markEpilogueDone: true,
              journalEntry: {
                id: 'je_epilogue_morning',
                title: 'Pagi Setelah Pulang · Lima Senar di Ruang Tamu',
                body: 'Pagi itu matahari terasa lebih hangat dari biasanya. Di ruang tamu Jl. Melati No. 14, aku memetik lagu "Pulang" di hadapan Nadia dan Kira—tanpa rahasia, tanpa buru-buru.',
                chapter: 3,
              },
            },
          },
          {
            id: 'ep_sec_c_walk',
            text: 'Ajak Nadia & Kira jalan pagi santai menyusuri Perumahan Melati hingga Danau Senja!',
            subtext: 'Menikmati pagi cerah bertiga tanpa satu pun notifikasi kerja',
            nextNodeId: 'ep_sec_r_walk',
            effects: {
              markEpilogueDone: true,
              journalEntry: {
                id: 'je_epilogue_morning',
                title: 'Pagi Setelah Pulang · Langkah Pagi Bertiga',
                body: 'Kami bertiga melangkah keluar pagar Jl. Melati No. 14 di bawah matahari pagi. Kira berlari kecil di depan sambil menggandeng tanganku dan Nadia.',
                chapter: 3,
              },
            },
          },
          {
            id: 'ep_sec_c_breakfast',
            text: 'Duduk menikmati sarapan hangat pelan-pelan—menghirup setiap detik pagi yang utuh ini.',
            subtext: 'Menyimpan kedamaian kecil yang selama ini kucari',
            nextNodeId: 'ep_sec_r_breakfast',
            effects: {
              markEpilogueDone: true,
              journalEntry: {
                id: 'je_epilogue_morning',
                title: 'Pagi Setelah Pulang · Sarapan yang Akhirnya Hangat',
                body: 'Tidak ada laptop, tidak ada piring dingin. Hanya tawa Kira, senyum Nadia, dan gitar mahoni yang bersandar tenang di sudut ruang tamu.',
                chapter: 3,
              },
            },
          },
        ],
      },
      ep_sec_r_guitar: {
        id: 'ep_sec_r_guitar',
        speaker: 'nadia',
        emotion: 'haru',
        text: 'Hehe, ayo Mas! Aku dan Kira sudah duduk rapi di barisan paling depan nih.',
        onEnd: { openGuitarConcert: true },
      },
      ep_sec_r_walk: {
        id: 'ep_sec_r_walk',
        speaker: 'kira',
        emotion: 'ceria',
        text: 'YEAAAYYY!! Jalan pagi sama Ayah dan Bunda! Ayo kita lihat danau dan beli serabi hangat!!',
        onEnd: { startMorningFamilyWalk: true },
      },
      ep_sec_r_breakfast: {
        id: 'ep_sec_r_breakfast',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Lagu "Pulang" tidak hanya hidup di enam senar gitar—ia hidup di setiap pagi sederhana seperti ini. Terima kasih sudah berjalan pulang bersama Damar.',
        onEnd: { playSfx: 'chime', toast: 'Epilog Pagi Setelah Pulang selesai — kamu bebas melanjutkan jalan santai di Kota Senja!' },
      },
    },
  },

  // === 2. TRUE ENDING EPILOGUE ===
  epilogue_true_intro: {
    id: 'epilogue_true_intro',
    startNodeId: 'ep_tr_i1',
    nodes: {
      ep_tr_i1: {
        id: 'ep_tr_i1',
        speaker: 'narator',
        emotion: 'hangat',
        text: 'Pagi Setelah Pulang · Pukul 07.40. Sinar matahari pagi menyentuh meja makan kayu Jl. Melati No. 14 yang akhirnya bersih dari layar laptop dan tumpukan berkas kantor.',
        onEnter: { playSfx: 'chime' },
        nextNodeId: 'ep_tr_i2',
      },
      ep_tr_i2: {
        id: 'ep_tr_i2',
        speaker: 'damar_batin',
        emotion: 'tenang',
        text: 'Semalam semua air mata dan rasa takut sudah tumpah dengan jujur. Pagi ini rumah terasa jauh lebih terang. Nadia dan Kira sudah menungguku di ruang makan.',
        onEnd: {
          toast: 'Epilog Playable: Temui Nadia & Kira di meja makan Jl. Melati No. 14!',
        },
      },
    },
  },
  epilogue_true_family: {
    id: 'epilogue_true_family',
    startNodeId: 'ep_tr_f1',
    nodes: {
      ep_tr_f1: {
        id: 'ep_tr_f1',
        speaker: 'kira',
        emotion: 'ceria',
        text: 'Pagi Ayah!! Kira udah pakai sepatu kets nih! Ayah masih ingat janji semalam kan—hari ini Ayah ajarin Kira naik sepeda tanpa roda bantu di ujung gang!!',
        conditionalNext: [
          {
            requiredFlag: 'wrote_reply_in_nadia_diary',
            nextNodeId: 'ep_tr_f1_diary',
          },
        ],
        nextNodeId: 'ep_tr_f2',
      },
      ep_tr_f1_diary: {
        id: 'ep_tr_f1_diary',
        speaker: 'nadia',
        emotion: 'haru',
        echoTag: 'Ingatan Buku Harian 2020 · Doa yang Terkabul',
        text: 'Nadia mengusap punggung tangan Damar sambil tersenyum lembut. "Tadi pagi waktu merapikan kamar, kubaca sekali lagi kalimatmu di bawah buku kain bungaku tahun 2020 itu, Mas. Rasanya doa subuhku di RS Harapan enam tahun lalu benar-benar terkabul pagi ini."',
        nextNodeId: 'ep_tr_f2',
      },
      ep_tr_f2: {
        id: 'ep_tr_f2',
        speaker: 'nadia',
        emotion: 'hangat',
        text: 'Pagi, Mas... Lihat deh muka kamu sekarang, jauh lebih segar daripada sebulan terakhir. Pak Hendra juga sudah kubalas pesan terima kasihnya tadi. Kita mau langsung jalan pagi atau sarapan dulu?',
        choices: [
          {
            id: 'ep_tr_c_walk',
            text: 'Ajak Nadia & Kira langsung jalan pagi keliling Perumahan Melati & Kota Senja!',
            subtext: 'Menepati janji pagi dengan langkah kaki yang sejajar',
            nextNodeId: 'ep_tr_r_walk',
            effects: {
              markEpilogueDone: true,
              journalEntry: {
                id: 'je_epilogue_morning',
                title: 'Pagi Setelah Pulang · Cahaya di Meja Makan',
                body: 'Pagi ini tidak ada lagi topeng "aku baik-baik saja". Aku mengajak Nadia dan Kira melangkah ke luar rumah di bawah langit pagi yang cerah—kali ini hatiku benar-benar hadir sepenuhnya.',
                chapter: 3,
              },
            },
          },
          {
            id: 'ep_tr_c_letter',
            text: 'Baca Surat Nadia yang diletakkan di sebelah cangkir teh pagi ini.',
            subtext: 'Menghargai setiap kata jujur yang ditulis Nadia untukmu',
            nextNodeId: 'ep_tr_r_letter',
            effects: {
              markEpilogueDone: true,
            },
          },
          {
            id: 'ep_tr_c_hug',
            text: 'Peluk Nadia dan Kira erat-erat—bersyukur rumah ini selalu menungguku pulang.',
            subtext: 'Menutup perjalanan dengan kehangatan paling sederhana',
            nextNodeId: 'ep_tr_r_hug',
            effects: {
              markEpilogueDone: true,
              journalEntry: {
                id: 'je_epilogue_morning',
                title: 'Pagi Setelah Pulang · Pelukan Pagi di Jl. Melati',
                body: 'Rumah bukan tempat di mana hidup berhenti punya masalah, melainkan tempat di mana kita tidak lagi berpura-pura kuat sendirian.',
                chapter: 3,
              },
            },
          },
        ],
      },
      ep_tr_r_walk: {
        id: 'ep_tr_r_walk',
        speaker: 'nadia',
        emotion: 'ceria',
        text: 'Ayo Mas! Bunda juga kangen jalan pagi bertiga sambil nyapa Bu Wati dan lihat Danau Senja.',
        onEnd: { startMorningFamilyWalk: true },
      },
      ep_tr_r_letter: {
        id: 'ep_tr_r_letter',
        speaker: 'nadia',
        emotion: 'hangat',
        text: 'Baca pelan-pelan ya, Mas... aku nulis itu sambil senyum sendiri semalam.',
        onEnd: { openNadiaLetter: true },
      },
      ep_tr_r_hug: {
        id: 'ep_tr_r_hug',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Di pelukan mereka berdua, seluruh kebisingan kota akhirnya mereda. Aku sudah di rumah.',
        onEnd: { playSfx: 'chime', toast: 'Epilog selesai — kamu bebas menikmati pagi cerah Kota Senja bersama keluarga!' },
      },
    },
  },

  // === 3. GOOD ENDING EPILOGUE ===
  epilogue_good_intro: {
    id: 'epilogue_good_intro',
    startNodeId: 'ep_gd_i1',
    nodes: {
      ep_gd_i1: {
        id: 'ep_gd_i1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Pagi Setelah Pulang · Pukul 07.20. Udara pagi masuk pelan dari jendela ruang tamu. Masalah pekerjaan dan cicilan memang tidak hilang dalam semalam—tapi untuk pertama kalinya, Damar tidak lagi merasa dikejar-kejar oleh hidupnya sendiri.',
        onEnter: { playSfx: 'coffee' },
        nextNodeId: 'ep_gd_i2',
      },
      ep_gd_i2: {
        id: 'ep_gd_i2',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Ponselku masih kubiarkan diam di atas nakas. Sebelum memulai hari yang baru, aku ingin sarapan tenang bersama Nadia dan Kira.',
        onEnd: {
          toast: 'Epilog Playable: Sapa Nadia & Kira di meja makan pagi ini!',
        },
      },
    },
  },
  epilogue_good_family: {
    id: 'epilogue_good_family',
    startNodeId: 'ep_gd_f1',
    nodes: {
      ep_gd_f1: {
        id: 'ep_gd_f1',
        speaker: 'nadia',
        emotion: 'hangat',
        text: 'Pagi, Mas. Bekal buah potongnya sudah kusiapkan—dan kali ini aku yakin nggak bakal balik utuh lagi, ya? Oh ya, Rabu sore nanti jadi kan kamu mampir main gitar sebentar di Kedai Bima sebelum pulang?',
        nextNodeId: 'ep_gd_f2',
      },
      ep_gd_f2: {
        id: 'ep_gd_f2',
        speaker: 'kira',
        emotion: 'ceria',
        text: 'Ayah, nanti sore Kira tunggu di teras depan ya! Kira mau gambar matahari yang lebih gede lagi buat Ayah!',
        choices: [
          {
            id: 'ep_gd_c_walk',
            text: 'Ajak Nadia & Kira jalan pagi sebentar menyapa suasana Perumahan Melati!',
            subtext: 'Menghirup udara pagi bersama sebelum ritme hari dimulai',
            nextNodeId: 'ep_gd_r_walk',
            effects: {
              markEpilogueDone: true,
              journalEntry: {
                id: 'je_epilogue_morning',
                title: 'Pagi Setelah Pulang · Keseimbangan yang Tumbuh',
                body: 'Hidup tetap berjalan seperti biasa—hanya saja kali ini aku tidak lagi merasa seperti tamu di dalam hidupku sendiri.',
                chapter: 3,
              },
            },
          },
          {
            id: 'ep_gd_c_guitar',
            text: 'Petik sebentar melodi hangat "Track 4 — Pulang" untuk mengawali pagi.',
            subtext: 'Menjaga ruang kecil untuk dirimu sendiri agar tetap hidup',
            nextNodeId: 'ep_gd_r_guitar',
            effects: {
              markEpilogueDone: true,
            },
          },
          {
            id: 'ep_gd_c_promise',
            text: '"Pasti pulang sebelum gelap, Nak. Terima kasih sudah sabar menungguku belajar lagi, Nad."',
            subtext: 'Melangkah ke hari baru dengan hati yang lebih tenang',
            nextNodeId: 'ep_gd_r_promise',
            effects: {
              markEpilogueDone: true,
              journalEntry: {
                id: 'je_epilogue_morning',
                title: 'Pagi Setelah Pulang · Janji Sebelum Gelap',
                body: 'Berhenti sebentar bukan berarti kalah. Kadang justru dengan memperlambat langkah, kita akhirnya sampai di rumah.',
                chapter: 3,
              },
            },
          },
        ],
      },
      ep_gd_r_walk: {
        id: 'ep_gd_r_walk',
        speaker: 'nadia',
        emotion: 'hangat',
        text: 'Yuk Mas, masih ada waktu sebelum macet pagi! Kira pasti senang banget.',
        onEnd: { startMorningFamilyWalk: true },
      },
      ep_gd_r_guitar: {
        id: 'ep_gd_r_guitar',
        speaker: 'kira',
        emotion: 'ceria',
        text: 'Asikkk! Musik pagi dari Ayah!!',
        onEnd: { openGuitarConcert: true },
      },
      ep_gd_r_promise: {
        id: 'ep_gd_r_promise',
        speaker: 'nadia',
        emotion: 'hangat',
        text: 'Pelan-pelan aja, Mas. Yang penting kali ini kita jalan bareng lagi.',
        onEnd: { playSfx: 'chime', toast: 'Epilog selesai — selamat menikmati pagi di Kota Senja!' },
      },
    },
  },

  // === 4. BAD ENDING EPILOGUE ===
  epilogue_bad_intro: {
    id: 'epilogue_bad_intro',
    startNodeId: 'ep_bd_i1',
    nodes: {
      ep_bd_i1: {
        id: 'ep_bd_i1',
        speaker: 'narator',
        emotion: 'sedih',
        text: 'Pagi Setelah Proyek · Pukul 06.15. Hujan tipis mengetuk kaca jendela ruang tamu Jl. Melati No. 14. Kemeja rapi berdasi sudah terpasang, dan notifikasi taksi bandara untuk rapat klien baru saja masuk ke ponsel Damar.',
        onEnter: { playSfx: 'phone' },
        nextNodeId: 'ep_bd_i2',
      },
      ep_bd_i2: {
        id: 'ep_bd_i2',
        speaker: 'damar_batin',
        emotion: 'lelah',
        text: 'Rumah ini terasa terlalu sunyi. Kira masih tertidur di kamarnya. Di dekat meja makan, Nadia berdiri tenang menyeduh termos kopi.',
        onEnd: {
          toast: 'Epilog Playable: Temui Nadia sebentar di meja makan sebelum berangkat.',
        },
      },
    },
  },
  epilogue_bad_family: {
    id: 'epilogue_bad_family',
    startNodeId: 'ep_bd_f1',
    nodes: {
      ep_bd_f1: {
        id: 'ep_bd_f1',
        speaker: 'nadia',
        emotion: 'tenang',
        text: 'Kopi panasnya sudah kumasukkan termos, Mas. Jas hujannya juga sudah kutaruh di dekat pintu. Taksi bandaramu lima menit lagi sampai kan?',
        nextNodeId: 'ep_bd_f2',
      },
      ep_bd_f2: {
        id: 'ep_bd_f2',
        speaker: 'damar_batin',
        emotion: 'sedih',
        text: 'Ia tidak marah. Ia tidak bertanya kapan aku pulang, tidak lagi mengeluh soal malam-malam panjang. Dan entah kenapa, keheningan yang begitu sopan ini jauh lebih menyakitkan daripada pertengkaran mana pun.',
        choices: [
          {
            id: 'ep_bd_c_letter',
            text: 'Berhenti satu menit dan buka Surat Nadia yang terlipat di atas meja makan.',
            subtext: 'Membaca apa yang tidak lagi sempat terucap dengan suara',
            nextNodeId: 'ep_bd_r_letter',
            effects: {
              markEpilogueDone: true,
              journalEntry: {
                id: 'je_epilogue_morning',
                title: 'Pagi Sunyi di Jl. Melati · Sebelum Taksi Tiba',
                body: 'Keheningan tanpa pertanyaan ternyata jauh lebih dingin daripada hujan pagi. Mungkin suatu hari aku harus berani mengulang langkahku—sebelum rumah ini benar-benar lupa suaraku.',
                chapter: 3,
              },
            },
          },
          {
            id: 'ep_bd_c_leave',
            text: '"Terima kasih, Nad. Aku berangkat dulu..." (Melangkah keluar menuju hujan dengan hati kosong)',
            subtext: 'Menyadari harga dari waktu yang tak bisa dibeli kembali',
            nextNodeId: 'ep_bd_r_leave',
            effects: {
              markEpilogueDone: true,
              journalEntry: {
                id: 'je_epilogue_morning',
                title: 'Pagi Sunyi di Jl. Melati · Bayangan di Pintu',
                body: 'Semua target di atas kertas tercapai, tetapi saat menutup pintu pagar Jl. Melati No. 14 pagi ini, aku merasa sedang meninggalkan diriku sendiri di dalam sana.',
                chapter: 3,
              },
            },
          },
        ],
      },
      ep_bd_r_letter: {
        id: 'ep_bd_r_letter',
        speaker: 'nadia',
        emotion: 'sedih',
        text: 'Hati-hati di jalan, Mas. Kalau sempat, baca saja di pesawat nanti...',
        onEnd: { openNadiaLetter: true },
      },
    ep_bd_r_leave: {
        id: 'ep_bd_r_leave',
        speaker: 'damar_batin',
        emotion: 'sedih',
        text: 'Di kulkas sana, gambar krayon Kira masih tertempel—Ayah yang memegang telepon kecil di telinga. (Tips: Kamu bisa memulai arsip baru atau menjelajah memori untuk membuka akhir cerita yang lebih hangat.)',
        onEnd: { playSfx: 'door', toast: 'Epilog Bad Ending selesai — kamu dapat kembali ke Layar Ending kapan saja.' },
      },
    },
  },

  // =========================================================================
  // 5. DIALOG PASCA-EPILOG WARGA & SAHABAT UTAMA ("PAGI SETELAH PULANG")
  // =========================================================================

  // --- BIMA (KEDAI KOPI SUDUT) ---
  epilogue_bima_warm: {
    id: 'epilogue_bima_warm',
    startNodeId: 'ep_bm_w1',
    nodes: {
      ep_bm_w1: {
        id: 'ep_bm_w1',
        speaker: 'bima',
        emotion: 'ceria',
        text: 'Woi, Damar! Tumben banget jam segini lewat depan Kopi Sudut jalannya pelan, bahu nggak ngangkat, mata nggak nempel ke layar HP! Ada angin segar apa nih dari Jl. Melati?',
        onEnter: { playSfx: 'coffee' },
        conditionalNext: [
          {
            requiredFlag: 'bima_sang_bridge_together',
            nextNodeId: 'ep_bm_w1_duet',
          },
        ],
        nextNodeId: 'ep_bm_w2',
      },
      ep_bm_w1_duet: {
        id: 'ep_bm_w1_duet',
        speaker: 'bima',
        emotion: 'ceria',
        echoTag: 'Ingatan Semalam · Harmoni di Antara Kursi Terbalik',
        text: 'Bima melambaikan selembar tisu kasir bertuliskan akor spidol hitam dari balik meja seduh. "Gue udah pindahin akor bridge \'Umur Dua Puluh Lima\' yang kita nyanyiin semalam ke buku lagu bersih, Mar! Suara dua lo semalam beneran bikin kedai ini hidup lagi!"',
        nextNodeId: 'ep_bm_w2',
      },
      ep_bm_w2: {
        id: 'ep_bm_w2',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Semalam akhirnya gue bicara jujur sama Nadia di meja makan, Bim. Rasanya kayak baru nurunin ransel batu yang gue gendong bertahun-tahun.',
        nextNodeId: 'ep_bm_w3',
      },
      ep_bm_w3: {
        id: 'ep_bm_w3',
        speaker: 'bima',
        emotion: 'haru',
        text: 'Bima berhenti mengelap cangkir keramik, lalu menatap sahabatnya lama sebelum tersenyum lebar. "Nah... akhirnya orang yang dulu bikin lagu bareng gue tahun 2018 beneran pulang juga."',
        choices: [
          {
            id: 'ep_bm_wc1',
            text: '"Makasih ya Bim, kedai lo kemarin jadi tempat gue berani berhenti lari."',
            subtext: 'Berterima kasih pada sahabat yang tidak pernah menghakimi',
            nextNodeId: 'ep_bm_wr1',
          },
          {
            id: 'ep_bm_wc2',
            text: '"Sabtu sore siapin kursi pojok ya. Gue mau ajak Nadia sama Kira dengerin kita main akustik lagi."',
            subtext: 'Merencanakan akhir pekan hangat bersama keluarga di Kopi Sudut',
            nextNodeId: 'ep_bm_wr2',
          },
        ],
      },
      ep_bm_wr1: {
        id: 'ep_bm_wr1',
        speaker: 'bima',
        emotion: 'hangat',
        text: 'Santai kali, Mar. Kopi Flores pagi ini gue traktir penuh—nikmatin pelan-pelan udara pagi lo, nggak usah buru-buru ke mana-mana.',
        onEnd: { playSfx: 'chime' },
      },
      ep_bm_wr2: {
        id: 'ep_bm_wr2',
        speaker: 'bima',
        emotion: 'ceria',
        text: 'Siap komandan! Cokelat panas marshmallow paling spesial buat Kira udah gue masukin daftar VIP Sabtu sore!',
        onEnd: { playSfx: 'guitar' },
      },
    },
  },

  epilogue_bima_bad: {
    id: 'epilogue_bima_bad',
    startNodeId: 'ep_bm_b1',
    nodes: {
      ep_bm_b1: {
        id: 'ep_bm_b1',
        speaker: 'bima',
        emotion: 'sedih',
        text: 'Mar... pagi-pagi hujan gini udah rapi pakai dasi aja. Ngejar penerbangan pagi buat Proyek Kartika ya?',
        onEnter: { playSfx: 'coffee' },
        nextNodeId: 'ep_bm_b2',
      },
      ep_bm_b2: {
        id: 'ep_bm_b2',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Bima tidak melontarkan candaan seperti biasa. Ia masuk sebentar ke balik meja seduh, lalu menyodorkan segelas kopi panas dalam cup kertas ke tangan Damar.',
        nextNodeId: 'ep_bm_b3',
      },
      ep_bm_b3: {
        id: 'ep_bm_b3',
        speaker: 'bima',
        emotion: 'haru',
        text: '"Gue nggak bakal ceramahin lo pagi ini, Mar—uang kopinya simpen aja. Cuma satu titipan gue sebagai sahabat: kapan pun lo capek jadi patung di gedung kaca itu, putar balik sebelum rumah lo di Jl. Melati bener-bener lupa suara langkah kaki lo."',
      },
    },
  },

  // --- MAS BAGAS (TOKO MUSIK NADA LAMA) ---
  epilogue_bagas_secret: {
    id: 'epilogue_bagas_secret',
    startNodeId: 'ep_bg_s1',
    nodes: {
      ep_bg_s1: {
        id: 'ep_bg_s1',
        speaker: 'mas_bagas',
        emotion: 'haru',
        text: 'Lho, Mar! Lihat tuh penyangga kayu di sudut etalase... akhirnya kosong juga pagi ini setelah enam tahun! Gimana semalam reaksi Nadia sama si kecil Kira waktu gitar mahoninya sampai rumah?',
        onEnter: { playSfx: 'guitar' },
        conditionalNext: [
          {
            requiredFlag: 'dedicated_song_to_rama',
            nextNodeId: 'ep_bg_s1_rama',
          },
        ],
        nextNodeId: 'ep_bg_s2',
      },
      ep_bg_s1_rama: {
        id: 'ep_bg_s1_rama',
        speaker: 'mas_bagas',
        emotion: 'haru',
        echoTag: 'Buah Janjimu · Bait Lagu untuk Almarhum Rama',
        text: 'Mas Bagas melirik kotak beludru busur cello 2014 yang kini tampak disinari matahari pagi. "Pagi ini waktu buka toko, rasanya sudut tempat busur Rama itu hangat sekali, Mar. Sumpahku malam Agustus 2020 akhirnya benar-benar tuntas pagi ini."',
        nextNodeId: 'ep_bg_s2',
      },
      ep_bg_s2: {
        id: 'ep_bg_s2',
        speaker: 'damar',
        emotion: 'haru',
        text: 'Nadia langsung berkaca-kaca waktu lihat stiker "TITIPAN DAMAR" tulisan tanganmu di dalam tasnya, Gas. Dan Kira... pagi ini aja masih minta dinyanyiin bait keempat "Pulang" lagi.',
        nextNodeId: 'ep_bg_s3',
      },
      ep_bg_s3: {
        id: 'ep_bg_s3',
        speaker: 'mas_bagas',
        emotion: 'ceria',
        text: 'Mas Bagas tertawa lega sambil menyodorkan sebungkus senar phosphor bronze dan pick seluloid mungil berwarna kuning matahari. "Ini hadiah dari Om Bagas buat Kira kalau nanti jarinya mulai belajar akor C. Jaga baik-baik musik di rumahmu ya, Mar!"',
        onEnd: { playSfx: 'chime' },
      },
    },
  },

  epilogue_bagas_warm: {
    id: 'epilogue_bagas_warm',
    startNodeId: 'ep_bg_w1',
    nodes: {
      ep_bg_w1: {
        id: 'ep_bg_w1',
        speaker: 'mas_bagas',
        emotion: 'hangat',
        text: 'Pagi, Damar! Wah, mukamu kelihatan jauh lebih segar dibanding kemarin sore. Kebetulan banget—barusan aku selesai nyetem ulang gitar mahoni lamamu di dalam.',
        onEnter: { playSfx: 'guitar' },
        nextNodeId: 'ep_bg_w2',
      },
      ep_bg_w2: {
        id: 'ep_bg_w2',
        speaker: 'mas_bagas',
        emotion: 'ceria',
        text: 'Nanti sore atau akhir pekan ajak Nadia sama Kira mampir ke Nada Lama ya! Nggak usah mikirin harga tebusan—gitar itu dari dulu memang cuma nunggu pemilik aslinya siap bernyanyi di rumah lagi.',
        onEnd: { playSfx: 'chime' },
      },
    },
  },

  epilogue_bagas_bad: {
    id: 'epilogue_bagas_bad',
    startNodeId: 'ep_bg_b1',
    nodes: {
      ep_bg_b1: {
        id: 'ep_bg_b1',
        speaker: 'mas_bagas',
        emotion: 'tenang',
        text: 'Pagi, Mar. Mau berangkat dinas pagi-pagi ya? Gue dengar kabar promosi besar lo di Menara Nusantara—selamat ya.',
        nextNodeId: 'ep_bg_b2',
      },
      ep_bg_b2: {
        id: 'ep_bg_b2',
        speaker: 'mas_bagas',
        emotion: 'sedih',
        text: 'Mas Bagas menoleh sekilas ke arah koper gitar mahoni di sudut dalam toko yang diselimuti bayangan hujan. "Gitar lamamu tetap gue simpan di pojok situ, Mar. Gue bakal terus bersihin debunya tiap minggu... sampai hari di mana jari lo kangen pulang."',
      },
    },
  },

  // --- PAK HENDRA (MENARA NUSANTARA) ---
  epilogue_hendra_warm: {
    id: 'epilogue_hendra_warm',
    startNodeId: 'ep_ph_w1',
    nodes: {
      ep_ph_w1: {
        id: 'ep_ph_w1',
        speaker: 'pak_hendra',
        emotion: 'hangat',
        text: 'Selamat pagi, Damar. Senang melihatmu pagi ini dengan langkah yang tidak terburu-buru. Sebenarnya... semalam saya banyak merenung setelah pembicaraan jujur kita.',
        conditionalNext: [
          {
            requiredFlag: 'hendra_encouraged_call_naya',
            nextNodeId: 'ep_ph_w1_naya',
          },
        ],
        nextNodeId: 'ep_ph_w2',
      },
      ep_ph_w1_naya: {
        id: 'ep_ph_w1_naya',
        speaker: 'pak_hendra',
        emotion: 'haru',
        echoTag: 'Buah Kejujuranmu · Telepon Malam ke Melbourne',
        text: 'Damar! Semalam begitu kamu keluar dari lobi, saya benar-benar memberanikan diri menelepon Naya dan cerita soal gambar krayon perahu di tas kerja saya dulu. Kamu tahu? Untuk pertama kalinya dalam lima tahun, kami ngobrol dan tertawa dua puluh menit penuh—dan bulan depan waktu libur kuliah dia mau pulang ke rumah!',
        nextNodeId: 'ep_ph_w2',
      },
      ep_ph_w2: {
        id: 'ep_ph_w2',
        speaker: 'pak_hendra',
        emotion: 'haru',
        text: 'Waktu kamu memilih menjaga batas untuk keluargamu, saya teringat putri saya sendiri yang dulu tahu-tahu sudah kuliah tanpa sempat saya temani menggambar. Pagi ini saya sudah menandatangani jadwal baru Proyek Kartika: kita bagi dua tim bergilir, tidak ada lagi lembur lewat pukul enam sore.',
        choices: [
          {
            id: 'ep_ph_wc1',
            text: '"Terima kasih banyak atas pengertiannya, Pak Hendra. Tim pasti bekerja jauh lebih utuh dengan ritme sehat."',
            subtext: 'Menghormati kebijaksanaan pemimpin yang mau mendengar',
            nextNodeId: 'ep_ph_wr1',
          },
          {
            id: 'ep_ph_wc2',
            text: '"Belum terlambat juga buat Bapak menelepon putri Bapak pagi ini sebelum rapat dimulai."',
            subtext: 'Mengingatkan Pak Hendra dengan hangat sebagai sesama ayah',
            nextNodeId: 'ep_ph_wr2',
          },
          {
            id: 'ep_ph_wc_draft',
            requiredFlag: 'rewrote_midnight_draft',
            echoBadge: 'Dari Lembar Pukul 02.14 yang Ditulis Ulang',
            text: '"Pak, sebelas bulan lalu saya hampir menyerahkan surat pengunduran diri pukul dua pagi. Hari ini saya justru bangga bertahan di sini dengan batas kerja yang sehat."',
            subtext: 'Menutup lingkaran draf laci meja kerja di hadapan Pak Hendra',
            nextNodeId: 'ep_ph_wr_draft',
          },
        ],
      },
      ep_ph_wr_draft: {
        id: 'ep_ph_wr_draft',
        speaker: 'pak_hendra',
        emotion: 'haru',
        text: 'Pak Hendra tertegun mendengar kejujuran itu, lalu menjabat tangan Damar erat. "Syukurlah kamu tidak pergi waktu itu, Damar—dan syukurlah hari ini kita berdua belajar bekerja seperti manusia, bukan mesin. Sampaikan salam hormat saya untuk Nadia!"',
        onEnd: { playSfx: 'chime' },
      },
      ep_ph_wr1: {
        id: 'ep_ph_wr1',
        speaker: 'pak_hendra',
        emotion: 'hangat',
        text: 'Justru saya yang berterima kasih sudah diingatkan, Damar. Nikmati pagimu dulu—sampaikan salam hangat saya untuk Nadia dan Kira.',
        onEnd: { playSfx: 'chime' },
      },
      ep_ph_wr2: {
        id: 'ep_ph_wr2',
        speaker: 'pak_hendra',
        emotion: 'haru',
        text: 'Pak Hendra tersenyum kecil sambil mengeluarkan ponsel dari saku jasnya. "Benar kata kamu, Damar. Habis ini saya telepon dia ajak makan siang akhir pekan. Selamat menikmati pagimu!"',
        onEnd: { playSfx: 'chime' },
      },
    },
  },

  epilogue_hendra_bad: {
    id: 'epilogue_hendra_bad',
    startNodeId: 'ep_ph_b1',
    nodes: {
      ep_ph_b1: {
        id: 'ep_ph_b1',
        speaker: 'pak_hendra',
        emotion: 'tenang',
        text: 'Pagi, Damar. Berkas pengangkatan Senior Manager dan jadwal penuh Proyek Kartika sudah di meja direksi. Di atas kertas, kamu mencapai semuanya dengan sempurna.',
        nextNodeId: 'ep_ph_b2',
      },
      ep_ph_b2: {
        id: 'ep_ph_b2',
        speaker: 'pak_hendra',
        emotion: 'sedih',
        text: 'Pak Hendra menatap hujan tipis di balik dinding kaca lobi, suaranya merendah. "Hanya saja... sebagai orang yang pernah menukar masa kecil anaknya demi ruangan sudut di lantai delapan belas, saya sungguh berdoa kamu tidak terbangun sepuluh tahun lagi dengan rumah yang sama sunyinya seperti rumah saya."',
      },
    },
  },

  // --- BU WATI (TETANGGA PERUMAHAN MELATI) ---
  epilogue_sari_warm: {
    id: 'epilogue_sari_warm',
    startNodeId: 'ep_sr_w1',
    nodes: {
      ep_sr_w1: {
        id: 'ep_sr_w1',
        speaker: 'nenek_sari',
        emotion: 'ceria',
        text: 'Nak Damar!! Sini sebentar! Pagi ini Nenek bawa kabar paling membahagiakan se-Danau Senja!',
        onEnter: { playSfx: 'chime' },
        conditionalNext: [
          {
            requiredFlag: 'helped_sari_voice_note',
            nextNodeId: 'ep_sr_w1_ardi',
          },
        ],
        nextNodeId: 'ep_sr_w2',
      },
      ep_sr_w1_ardi: {
        id: 'ep_sr_w1_ardi',
        speaker: 'nenek_sari',
        emotion: 'haru',
        echoTag: 'Buah Kebaikanmu · Pesan Suara untuk Ardi',
        text: 'Semalam jam sepuluh setelah dengar rekaman suara yang kamu bantu kirimkan kemarin, Ardi langsung menelepon Nenek sambil menangis! Dia sudah beli tiket kereta buat pulang hari Kamis besok—katanya kangen makan semur dari rantang mawar Nenek!',
        nextNodeId: 'ep_sr_w2',
      },
      ep_sr_w2: {
        id: 'ep_sr_w2',
        speaker: 'nenek_sari',
        emotion: 'hangat',
        text: 'Senang sekali melihat kamu pagi ini jalan santai menikmati matahari pagi, Nak. Jaga terus hangatnya meja makan keluarga kecilmu ya!',
      },
    },
  },

  epilogue_sari_bad: {
    id: 'epilogue_sari_bad',
    startNodeId: 'ep_sr_b1',
    nodes: {
      ep_sr_b1: {
        id: 'ep_sr_b1',
        speaker: 'nenek_sari',
        emotion: 'sedih',
        text: 'Nak Damar... pagi-pagi gerimis begini langkahmu cepat sekali kayak putra Nenek waktu mau berangkat dinas luar kota. Jangan lupa telepon rumah kalau sudah sampai tujuan ya, Nak...',
      },
    },
  },

  epilogue_wati_warm: {
    id: 'epilogue_wati_warm',
    startNodeId: 'ep_wt_w1',
    nodes: {
      ep_wt_w1: {
        id: 'ep_wt_w1',
        speaker: 'bu_wati',
        emotion: 'ceria',
        text: 'Pagi, Nak Damar! Aduh, semalam waktu Ibu nutup pagar jam sembilan, terdengar suara ketawa hangat dari ruang makan rumah No. 14—rasanya adem banget kayak waktu kalian baru pindahan bawa dua kardus buku tahun 2019 dulu!',
        nextNodeId: 'ep_wt_w2',
      },
      ep_wt_w2: {
        id: 'ep_wt_w2',
        speaker: 'bu_wati',
        emotion: 'hangat',
        text: 'Senang lihat Nak Damar pagi ini nggak keburu-buru ngegas motor lagi. Sehat-sehat terus ya sekeluarga!',
        onEnd: { playSfx: 'chime' },
      },
    },
  },

  epilogue_wati_bad: {
    id: 'epilogue_wati_bad',
    startNodeId: 'ep_wt_b1',
    nodes: {
      ep_wt_b1: {
        id: 'ep_wt_b1',
        speaker: 'bu_wati',
        emotion: 'sedih',
        text: 'Pagi, Nak Damar... sudah mau berangkat kerja jauh lagi di tengah gerimis? Tadi subuh Ibu lihat Mbak Nadia berdiri lama sendirian menatap pot melati di teras. Kalau urusan kantornya sudah reda, cepat pulang ya, Nak...',
      },
    },
  },

  // --- SAPAAN LANJUTAN NADIA & KIRA SETELAH ADEGAN EPILOG SELESAI ---
  epilogue_nadia_after_warm: {
    id: 'epilogue_nadia_after_warm',
    startNodeId: 'ep_na_w1',
    nodes: {
      ep_na_w1: {
        id: 'ep_na_w1',
        speaker: 'nadia',
        emotion: 'hangat',
        text: 'Udara pagi di luar segar banget ya, Mas. Kapan pun kamu mau ngajak aku sama Kira jalan kaki keliling kota atau mampir ke kedai Bima, panggil aja ya ❤️',
      },
    },
  },

  epilogue_kira_after_warm: {
    id: 'epilogue_kira_after_warm',
    startNodeId: 'ep_kr_w1',
    nodes: {
      ep_kr_w1: {
        id: 'ep_kr_w1',
        speaker: 'kira',
        emotion: 'ceria',
        text: 'Ayaaah! Pagi ini kita beneran nggak buru-buru kan?! Ayo jalan-jalan lihat merpati taman sama mampir ke tempat Om Bima!',
      },
    },
  },

  epilogue_nadia_after_bad: {
    id: 'epilogue_nadia_after_bad',
    startNodeId: 'ep_na_b1',
    nodes: {
      ep_na_b1: {
        id: 'ep_na_b1',
        speaker: 'nadia',
        emotion: 'sedih',
        text: 'Hati-hati di perjalanan ya, Mas... termos kopinya jangan sampai ketinggalan di meja.',
      },
    },
  },

  epilogue_kira_after_bad: {
    id: 'epilogue_kira_after_bad',
    startNodeId: 'ep_kr_b1',
    nodes: {
      ep_kr_b1: {
        id: 'ep_kr_b1',
        speaker: 'kira',
        emotion: 'lelah',
        text: 'Eungh... Ayah udah mau pergi kerja lagi ya...? Kira padahal baru bangun...',
      },
    },
  },
};

/**
 * Menentukan dialog khusus pasca-Epilog untuk sahabat & tetangga utama saat Mode Epilog Pagi aktif.
 */
export function resolveEpilogueNpcDialogue(
  npcId: string,
  endingId: EndingId,
  epilogueCompleted: boolean,
): { dialogueId: string; sublabel: string } | null {
  if (npcId === 'bima') {
    return endingId === 'bad'
      ? { dialogueId: 'epilogue_bima_bad', sublabel: 'Epilog · Kopi Hujan Pagi' }
      : { dialogueId: 'epilogue_bima_warm', sublabel: 'Epilog · Pagi Baru di Kopi Sudut' };
  }
  if (npcId === 'mas_bagas') {
    if (endingId === 'secret') {
      return { dialogueId: 'epilogue_bagas_secret', sublabel: 'Epilog · Gitar yang Telah Pulang' };
    }
    return endingId === 'bad'
      ? { dialogueId: 'epilogue_bagas_bad', sublabel: 'Epilog · Gitar yang Menunggu' }
      : { dialogueId: 'epilogue_bagas_warm', sublabel: 'Epilog · Undangan Nada Lama' };
  }
  if (npcId === 'pak_hendra') {
    return endingId === 'bad'
      ? { dialogueId: 'epilogue_hendra_bad', sublabel: 'Epilog · Cermin Lantai 18' }
      : { dialogueId: 'epilogue_hendra_warm', sublabel: 'Epilog · Jadwal Baru Proyek Kartika' };
  }
  if (npcId === 'bu_wati') {
    return endingId === 'bad'
      ? { dialogueId: 'epilogue_wati_bad', sublabel: 'Epilog · Gerimis di Jl. Melati' }
      : { dialogueId: 'epilogue_wati_warm', sublabel: 'Epilog · Tetangga Jl. Melati' };
  }
  if (npcId === 'nenek_sari') {
    return endingId === 'bad'
      ? { dialogueId: 'epilogue_sari_bad', sublabel: 'Epilog · Bangku Danau Hujan' }
      : { dialogueId: 'epilogue_sari_warm', sublabel: 'Epilog · Kabar Bahagia Ardi' };
  }
  if (epilogueCompleted && npcId === 'nadia') {
    return endingId === 'bad'
      ? { dialogueId: 'epilogue_nadia_after_bad', sublabel: 'Epilog · Pagi Sunyi' }
      : { dialogueId: 'epilogue_nadia_after_warm', sublabel: 'Epilog · Pagi Hangat' };
  }
  if (epilogueCompleted && npcId === 'kira') {
    return endingId === 'bad'
      ? { dialogueId: 'epilogue_kira_after_bad', sublabel: 'Epilog · Pagi Sunyi' }
      : { dialogueId: 'epilogue_kira_after_warm', sublabel: 'Epilog · Pagi Ceria' };
  }
  return null;
}
