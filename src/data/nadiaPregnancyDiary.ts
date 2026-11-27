import { DialogueScript } from '../types/game';

/**
 * Alur Cerita Intim Sudut Pandang Pasangan:
 * "Sembilan Bulan Menunggu Kira" — Buku Harian Kehamilan Nadia (Januari – Agustus 2020)
 * Lokasi: Meja Samping Kamar Rumah Jl. Melati No. 14 (`[-24.85, 0.08, 66.95]`)
 *
 * Memperlihatkan pernikahan Damar dan Nadia dari mata Nadia sendiri: bagaimana sejak awal
 * Nadia menyadari perubahan sunyi suaminya, mendoakannya diam-diam di tengah mual pagi,
 * hingga malam hujan 08 Agustus 2020 di ruang bersalin RS Harapan.
 */
export const NADIA_DIARY_DIALOGUES: Record<string, DialogueScript> = {
  story_nadia_pregnancy_diary_2020: {
    id: 'story_nadia_pregnancy_diary_2020',
    startNodeId: 'snpd_1',
    flashback: {
      yearLabel: 'JANUARI – AGUSTUS 2020 · BUKU HARIAN NADIA',
      title: 'Sembilan Bulan Menunggu Kira',
      locationLabel: 'Kamar Rumah Jl. Melati No. 14 · Tulisan Tangan Nadia',
      mood: 'warm_sepia',
      epigraph: 'Ada cinta yang tidak pernah menuntut penjelasan—ia hanya mencatat setiap kelelahanmu dalam doa yang paling sunyi.',
    },
    nodes: {
      snpd_1: {
        id: 'snpd_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Di sudut meja dekat lemari pakaian Rumah Jl. Melati No. 14, terselip sebuah buku catatan kecil bersampul kain katun motif bunga melati kecil. Pita pembatas merah mudanya sudah agak berbulu dimakan usia.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'snpd_2',
      },
      snpd_2: {
        id: 'snpd_2',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Di halaman depannya tertulis tinta hitam rapi milik Nadia: "Catatan Kecil Buat Anakku yang Masih di Dalam Perut — Tahun 2020." Tanganku berhenti sebentar... aku belum pernah membaca buku ini sebelumnya.',
        nextNodeId: 'snpd_3',
      },
      snpd_3: {
        id: 'snpd_3',
        speaker: 'nadia',
        emotion: 'ceria',
        text: '[14 Januari 2020 · Minggu ke-7] "Halo, kacang kecilnya Bunda. Tadi pagi waktu lihat dua garis merah, tangan Ayahmu gemetar sampai hampir menjatuhkan gelas air putih! Malamnya dia nempelkan telinga ke perut Bunda yang belum kelihatan apa-apa, terus bisik: \'Tumbuh sehat ya, Nak, nanti Ayah bikinin lagu paling bagus.\'"',
        onEnter: { playSfx: 'chime' },
        nextNodeId: 'snpd_4',
      },
      snpd_4: {
        id: 'snpd_4',
        speaker: 'nadia',
        emotion: 'hangat',
        text: '[19 April 2020 · Bulan ke-4] "Malam ini Bunda terbangun jam satu pagi karena keram kaki. Lampu ruang tamu masih nyala tipis. Bunda intip dari celah pintu—ternyata Ayahmu belum tidur. Dia duduk di depan kertas hitungan biaya rumah sakit sambil memijat keningnya sendiri, tapi begitu Bunda batuk kecil, dia buru-buru senyum seolah semuanya ringan."',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'snpd_5',
      },
      snpd_5: {
        id: 'snpd_5',
        speaker: 'damar_batin',
        emotion: 'sedih',
        text: 'Dadaku terasa seperti diremas pelan. Malam April itu aku yakin sekali Nadia sudah tidur pulas... ternyata sejak enam tahun lalu, tidak satu pun ketakutanku luput dari matanya.',
        nextNodeId: 'snpd_6',
      },
      snpd_6: {
        id: 'snpd_6',
        speaker: 'nadia',
        emotion: 'sedih',
        text: '[22 Juli 2020 · Bulan ke-8] "Sudah tiga minggu Ayahmu tidak menyentuh gitar mahoninya sama sekali. Kalau Bunda tanya kenapa nggak nyanyi lagi sore-sore, dia cuma jawab lagi fokus kejar penilaian karyawan tetap di Menara Nusantara. Nak... kalau nanti kamu lahir, tolong bantu Bunda ingatkan Ayah ya: Bunda jatuh cinta pada ketulusan hatinya, bukan pada tebal dompetnya."',
        onEnter: { playSfx: 'page' },
        conditionalNext: [
          {
            requiredFlag: 'flashback_2020_done',
            nextNodeId: 'snpd_6_echo2020',
          },
        ],
        nextNodeId: 'snpd_7',
      },
      snpd_6_echo2020: {
        id: 'snpd_6_echo2020',
        speaker: 'damar_batin',
        emotion: 'haru',
        echoTag: 'Gema Memori · Hujan Agustus di Nada Lama',
        text: 'Dua minggu setelah catatan Juli ini ditulis, hujan deras mengguyur Agustus—dan aku membawa gitar mahoni itu keluar rumah diam-diam menuju toko Mas Bagas.',
        nextNodeId: 'snpd_7',
      },
      snpd_7: {
        id: 'snpd_7',
        speaker: 'nadia',
        emotion: 'haru',
        text: '[09 Agustus 2020 · Pukul 04.15 Subuh, RS Harapan] "Selamat datang ke dunia, Kira sayang. Waktu kamu akhirnya tidur di boks bayi sebelah ranjang Bunda, Ayahmu ketiduran duduk di kursi besi dengan jaket yang masih lembap bau hujan semalam. Ujung jarinya dingin sekali waktu kugenggam."',
        onEnter: { playSfx: 'guitar' },
        nextNodeId: 'snpd_8',
      },
      snpd_8: {
        id: 'snpd_8',
        speaker: 'nadia',
        emotion: 'haru',
        text: '[Halaman Terakhir · Ditulis Tinta Biru] "Entah apa yang semalam Ayahmu lepaskan di luar sana demi membayar ruang operasi kita, Bunda tidak tega bertanya sebelum dia siap bercerita sendiri. Tuhan... jaga laki-laki baik yang sedang tertidur kelelahan di samping ranjangku ini. Jangan biarkan kerasnya kota membuat dia lupa betapa kami mencintainya."',
        nextNodeId: 'snpd_9',
      },
      snpd_9: {
        id: 'snpd_9',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Pandanganku kabur oleh air mata hangat yang jatuh tepat di pinggir pita pembatas buku itu. Enam tahun aku mengira aku sedang melindungi Nadia dengan menyembunyikan bebanku—padahal selama enam tahun itu pula, Nadia memeluk rahasiaku dalam doa tanpa pernah mendesakku.',
        choices: [
          {
            id: 'snpd_c_write_margin',
            text: 'Ambil pena di meja dan tulis satu kalimat kecil di bawah halaman terakhirnya: "Maaf membuatmu menunggu enam tahun, Nad. Malam ini aku pulang."',
            subtext: 'Menjawab doa enam tahun Nadia dengan janji tertulis yang jujur',
            nextNodeId: 'snpd_end_margin',
            effects: {
              kejujuranDiri: 3,
              kehadiranKeluarga: 3,
              setFlags: ['read_nadia_diary_2020', 'wrote_reply_in_nadia_diary'],
              phoneMessage: {
                id: 'msg_nadia_diary_2020',
                sender: 'Nadia',
                preview: 'Mas... barusan aku ambil lip balm di meja kamar terus lihat buku kain bungaku sedikit terbuka... kamu baca catatan tahun 2020 itu ya? 🥺❤️',
                timeLabel: 'Baru saja',
                threadId: 'nadia',
              },
              journalEntry: {
                id: 'je_nadia_diary_2020',
                title: 'Sembilan Bulan Menunggu Kira (Buku Harian Nadia)',
                body: 'Di buku harian bersampul kain bunga tahun 2020, kubaca doa Nadia pukul empat subuh saat aku tertidur dengan jaket basah di ruang bersalin Kira. Aku menuliskan sebaris balasan di bawah tulisannya—berjanji tidak akan lagi membiarkannya mencintaiku dalam kesunyian.',
                chapter: 1,
              },
              toast: 'Doa Nadia tahun 2020 terjawab — pesan baru masuk di HP [H] & Jurnal!',
            },
          },
          {
            id: 'snpd_c_hold_close',
            text: 'Rapatkan buku harian itu ke dadaku sebentar dengan mata terpejam, lalu letakkan kembali serapi semula sambil bertekad memeluk Nadia erat nanti malam',
            subtext: 'Menghormati ruang pribadi Nadia sambil menyimpan kehangatannya di hati',
            nextNodeId: 'snpd_end_hold',
            effects: {
              kehadiranKeluarga: 3,
              kejujuranDiri: 2,
              setFlags: ['read_nadia_diary_2020'],
              phoneMessage: {
                id: 'msg_nadia_diary_warm',
                sender: 'Nadia',
                preview: 'Mas, tiba-tiba aku keinget pagi pertama Kira lahir di RS Harapan... jangan capek-capek sendirian hari ini ya, aku selalu di pihak kamu ❤️',
                timeLabel: 'Baru saja',
                threadId: 'nadia',
              },
              journalEntry: {
                id: 'je_nadia_diary_2020',
                title: 'Doa Subuh di Ruang Bersalin (Agustus 2020)',
                body: 'Membaca buku harian kehamilan Nadia tahun 2020 membuka mataku: sejak awal ia tahu apa yang kukorbankan malam itu, dan ia memilih menungguku dengan sabar sampai aku berani pulang.',
                chapter: 1,
              },
              toast: 'Kenangan Buku Harian Kehamilan Nadia (2020) tersimpan di Jurnal & HP [H]!',
            },
          },
          {
            id: 'snpd_c_promise_song',
            text: '"Tumbuh sehat ya, Nak, nanti Ayah bikinin lagu paling bagus." — Bisikkan kembali kalimat Januari 2020 itu dan berjanji menuntaskan lagunya malam ini',
            subtext: 'Menghidupkan lagi janji pertama Damar kepada Kira sebelum ia lahir',
            nextNodeId: 'snpd_end_song',
            effects: {
              kejujuranDiri: 3,
              kehadiranKeluarga: 2,
              setFlags: ['read_nadia_diary_2020', 'vowed_finish_ lullaby_2020'.replace(' ', '')],
              journalEntry: {
                id: 'je_nadia_diary_2020',
                title: 'Janji kepada Kacang Kecil (Januari 2020)',
                body: 'Nadia mencatat kalimat pertamaku saat tahu ia mengandung Kira enam tahun silam: janji membuatkan lagu paling hangat untuk putri kami. Enam tahun tertunda, namun belum terlambat untuk menyanyikannya.',
                chapter: 1,
              },
              toast: 'Janji lagu tahun 2020 hidup kembali di Jurnal!',
            },
          },
        ],
      },
      snpd_end_margin: {
        id: 'snpd_end_margin',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Dua jenis tulisan tangan—tinta biru Nadia dari Agustus 2020 dan goresan penaku hari ini—akhirnya bertemu di halaman yang sama setelah enam tahun.',
        onEnter: { playSfx: 'chime' },
      },
      snpd_end_hold: {
        id: 'snpd_end_hold',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Aroma melati tipis dari kain sampul buku itu tinggal di telapak tanganku. Betapa beruntungnya aku dicintai perempuan seteduh Nadia.',
        onEnter: { playSfx: 'chime' },
      },
      snpd_end_song: {
        id: 'snpd_end_song',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Kututup sampul kain bunga itu pelan-pelan. Lagu yang kubisikkan ke perut Nadia enam tahun lalu itu tidak boleh tinggal sebagai janji lagi.',
        onEnter: { playSfx: 'guitar' },
      },
    },
  },
};
