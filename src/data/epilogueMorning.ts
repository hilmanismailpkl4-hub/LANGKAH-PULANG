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
};
