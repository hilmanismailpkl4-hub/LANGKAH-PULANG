import { DialogueScript } from '../types/game';

/**
 * Alur Cerita Warisan Kasih Ibu:
 * "Benang yang Menjahit Dua Rumah" — Kaleng Biskuit Jahit Biru & Surat Almarhumah Ibu (03 September 2016)
 * Lokasi: Rak Samping Album Keluarga Ruang Tamu Jl. Melati No. 14 (`[-20.42, 0.08, 65.45]`)
 *
 * Melengkapi garis keluarga Damar bersama Kaset Bapak (1997): menemukan surat yang ditulis
 * almarhumah Ibu (Bu Rahmi) setahun sebelum wafat untuk Damar dan calon istrinya, Nadia.
 */
export const MOTHER_SEWING_TIN_DIALOGUES: Record<string, DialogueScript> = {
  story_mother_sewing_tin_2016: {
    id: 'story_mother_sewing_tin_2016',
    startNodeId: 'smst_1',
    flashback: {
      yearLabel: '03 SEPTEMBER 2016 · KALENG JAHIT BIRU IBU',
      title: 'Benang yang Menjahit Dua Rumah',
      locationLabel: 'Ruang Tamu Jl. Melati No. 14 · Peninggalan Almarhumah Ibu',
      mood: 'warm_sepia',
      epigraph: 'Di dasar kaleng biskuit biru yang penuh benang dan kancing cadangan, seorang ibu telah menyiapkan jahitan untuk hari ketika rumah anaknya hampir robek oleh diam.',
    },
    nodes: {
      smst_1: {
        id: 'smst_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Di rak kayu sebelah album foto keluarga, terletak sebuah kaleng biskuit mentega bundar berwarna biru tua—benda yang ada di hampir setiap rumah masa kecil, yang isinya bukan lagi kue, melainkan gulungan benang, meteran kuning, dan bantalan jarum merah milik almarhumah Ibu.',
        onEnter: { playSfx: 'interact' },
        nextNodeId: 'smst_2',
      },
      smst_2: {
        id: 'smst_2',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Klung. Begitu tutup kalengnya kubuka, wangi bedak tabur lawas dan kayu cendana tipis langsung menyapa hidungku—persis wangi selendang Ibu waktu aku masih kuliah dulu. Sejak kami pindah ke rumah ini tahun 2019, kaleng ini belum pernah kubongkar sampai ke dasarnya.',
        nextNodeId: 'smst_3',
      },
      smst_3: {
        id: 'smst_3',
        speaker: 'narator',
        emotion: 'hangat',
        text: 'Di bawah tumpukan kain perca batik dan kancing cadangan kemeja sekolah Damar, tersimpan sebuah plastik klip bening berisi dua kancing mutiara kebaya putih serta sepucuk amplop biru muda.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'smst_4',
      },
      smst_4: {
        id: 'smst_4',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Tanganku gemetar membaca tulisan pena tegak bersambung almarhumah Ibu di luar amplopnya: "Untuk Damar & Calon Istrinya, Nadia — Dibuka Kalau Kalian Sudah Punya Rumah Sendiri. (3 September 2016)."',
        nextNodeId: 'smst_5',
      },
      smst_5: {
        id: 'smst_5',
        speaker: 'narator',
        emotion: 'hangat',
        text: '[Surat Almarhumah Ibu · 2016] "Anakku Damar, dan Nak Nadia yang senyumnya teduh... Ibu tulis surat ini sore-sore sehabis memasang kancing batik Damar. Minggu lalu waktu Damar pertama kali mengajak Nadia minum teh di teras Ibu, hati Ibu langsung tenang. Ibu tahu, kelak kalau Ibu sudah menyusul Bapak, anak laki-laki Ibu tidak akan sendirian lagi."',
        onEnter: { playSfx: 'chime' },
        nextNodeId: 'smst_6',
      },
      smst_6: {
        id: 'smst_6',
        speaker: 'narator',
        emotion: 'haru',
        text: '[Paragraf Kedua Surat Ibu] "Nak Nadia, Ibu titip satu rahasia kecil tentang Damar ya. Sejak Bapaknya tiada, Damar punya kebiasaan yang persis sekali dengan almarhum Bapaknya: kalau kakinya luka atau hatinya takut gagal, dia lebih memilih berjalan pincang diam-diam daripada mengeluh. Kalau suatu tahun nanti dia pulang kerja dengan wajah kaku dan jarang bicara, jangan buru-buru mengira cintanya padamu berkurang. Itu tandanya anak Ibu sedang ketakutan setengah mati tidak sanggup membahagiakanmu."',
        nextNodeId: 'smst_7',
      },
      smst_7: {
        id: 'smst_7',
        speaker: 'narator',
        emotion: 'haru',
        text: '[Paragraf Penutup Surat Ibu] "Dan kamu, Damar... dengarkan Ibu baik-baik: menjahit kain rumah tangga yang mulai renggang itu tidak pernah bisa dilakukan pakai satu tangan. Jangan gengsi mengulurkan benangmu pada istrimu. Ibu selipkan dua kancing mutiara kebaya akad Ibu di kaleng ini—semoga rumah kalian selalu utuh dan hangat sampai rambut kalian memutih. Peluk cium dari Ibu."',
        onEnter: { playSfx: 'guitar' },
        conditionalNext: [
          {
            requiredFlag: 'played_father_cassette_1997',
            nextNodeId: 'smst_7_echo_parents',
          },
        ],
        nextNodeId: 'smst_8',
      },
      smst_7_echo_parents: {
        id: 'smst_7_echo_parents',
        speaker: 'damar_batin',
        emotion: 'haru',
        echoTag: 'Gema Lengkap Orang Tua · Kaset Bapak 1997 & Surat Ibu 2016',
        text: 'Dadaku bergemuruh hingga napasku patah-patah. Di dapur belakang ada suara almarhum Bapak di pita tahun 1997 yang memintaku meletakkan tas, dan di ruang tamu ini ada surat almarhumah Ibu tahun 2016 yang memintaku mengulurkan benang pada Nadia. Kedua orang tuaku telah menjaga rumah ini bahkan jauh sebelum kami membelinya.',
        nextNodeId: 'smst_8',
      },
      smst_8: {
        id: 'smst_8',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Tiga belas bulan setelah menulis amplop biru ini, Ibu berpulang sebelum sempat menggendong Kira. Dan selama tujuh tahun di dasar kaleng jahit ini, pesan Ibu sabar menunggu hari di mana rumah kami paling membutuhkannya.',
        choices: [
          {
            id: 'smst_c_bring_to_nadia',
            text: 'Simpan Surat Biru & Dua Kancing Kebaya Ibu (2016) ke Tas [I]—aku ingin membacakannya langsung untuk Nadia agar ia tahu betapa Ibu menyayanginya',
            subtext: 'Membuka interaksi khusus membacakan surat Ibu bersama Nadia & cabang Meja Makan Bab 3',
            nextNodeId: 'smst_end_nadia',
            effects: {
              kehadiranKeluarga: 4,
              kejujuranDiri: 3,
              setFlags: ['opened_mother_sewing_tin_2016', 'has_mother_letter_2016'],
              phoneMessage: {
                id: 'msg_nadia_sewing_tin',
                sender: 'Nadia',
                preview: 'Mas... tadi aku dengar bunyi tutup kaleng biskuit jahit Ibu di ruang tamu. Ada benang yang kamu cari, atau kamu lagi kangen almarhumah Ibu? ❤️',
                timeLabel: 'Baru saja',
                threadId: 'nadia',
              },
              journalEntry: {
                id: 'je_mother_sewing_tin_2016',
                title: 'Benang yang Menjahit Dua Rumah (Surat Ibu 2016)',
                body: 'Di dasar kaleng biskuit jahit biru peninggalan almarhumah Ibu, kutemukan surat bertanggal 3 September 2016 beserta dua kancing mutiara kebaya akad beliau untukku dan Nadia. Ibu menulis bahwa menjahit rumah tangga tidak bisa dengan satu tangan—aku harus membacakannya bersama Nadia.',
                chapter: 1,
              },
              toast: 'Surat Mendiang Ibu (2016) masuk ke Tas [I] — temui Nadia untuk membacakannya bersama!',
            },
          },
          {
            id: 'smst_c_stop_limping',
            text: '"Maafin Damar, Bu... bertahun-tahun Damar masih jalan pincang diam-diam persis kata Ibu. Mulai hari ini Damar ulurkan tangan ke Nadia."',
            subtext: 'Berjanji di hadapan kenangan Ibu & menyimpan surat 2016 ke Tas [I]',
            nextNodeId: 'smst_end_vow',
            effects: {
              kejujuranDiri: 4,
              kehadiranKeluarga: 3,
              setFlags: ['opened_mother_sewing_tin_2016', 'has_mother_letter_2016'],
              journalEntry: {
                id: 'je_mother_sewing_tin_2016',
                title: 'Berhenti Berjalan Pincang Diam-Diam (Surat Ibu 2016)',
                body: 'Almarhumah Ibu mengenaliku lebih dalam daripada aku mengenali diriku sendiri: kebiasaanku menelan rasa takut sendirian ternyata bukan ketangguhan, melainkan luka yang butuh diulurkan pada pasangan hidupku.',
                chapter: 1,
              },
              toast: 'Surat Mendiang Ibu (2016) tersimpan di Tas Selempang [I] & Jurnal!',
            },
          },
        ],
      },
      smst_end_nadia: {
        id: 'smst_end_nadia',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Kuselipkan amplop biru muda dan dua kancing mutiara Ibu itu dengan hati-hati ke dalam tas selempangku. Aku tidak sabar melihat wajah Nadia saat membaca kata-kata Ibu tentang senyum teduhnya.',
        onEnter: { playSfx: 'chime' },
      },
      smst_end_vow: {
        id: 'smst_end_vow',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Kututup kembali kaleng biskuit biru itu pelan, sementara surat Ibu kusimpan di dekat dadaku. Rasanya seisi ruang tamu ini baru saja dipeluk hangat oleh tangan Ibu.',
        onEnter: { playSfx: 'chime' },
      },
    },
  },

  // === ADEGAN SPESIAL MEMBACAKAN SURAT MENDIANG IBU (2016) BERSAMA NADIA ===
  story_share_mother_letter_nadia: {
    id: 'story_share_mother_letter_nadia',
    startNodeId: 'ssml_1',
    nodes: {
      ssml_1: {
        id: 'ssml_1',
        speaker: 'damar',
        emotion: 'haru',
        text: 'Nad... duduk sebentar yuk sama aku. Tadi waktu kubuka kaleng biskuit jahit biru peninggalan almarhumah Ibu sampai ke dasarnya... ternyata ada amplop tahun 2016 yang Ibu tulis buat kita berdua sebelum beliau sakit.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'ssml_2',
      },
      ssml_2: {
        id: 'ssml_2',
        speaker: 'nadia',
        emotion: 'haru',
        text: 'Nadia menutup mulutnya dengan satu tangan, matanya langsung berkaca-kaca saat menerima amplop biru muda dan dua kancing mutiara itu. "Ya Allah, Mas... ini beneran tulisan tangan almarhumah Ibu..."',
        nextNodeId: 'ssml_3',
      },
      ssml_3: {
        id: 'ssml_3',
        speaker: 'nadia',
        emotion: 'haru',
        text: 'Selama dua menit hening, Nadia membaca baris demi baris surat itu hingga air matanya menetes jatuh ke punggung tangannya. "...Ibu nulis \'jangan buru-buru mengira cintanya berkurang, Nak Nadia, itu tandanya anak Ibu sedang ketakutan\'... Mas, Ibu bahkan masih belain kita berdua dari surga."',
        onEnter: { playSfx: 'chime' },
        nextNodeId: 'ssml_4',
      },
      ssml_4: {
        id: 'ssml_4',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Maafin aku ya, Nad, selama ini aku jalan pincang diam-diam persis yang Ibu khawatirkan. Mulai hari ini, benangnya kita pegang berdua.',
        nextNodeId: 'ssml_5',
      },
      ssml_5: {
        id: 'ssml_5',
        speaker: 'nadia',
        emotion: 'hangat',
        text: 'Nadia menggenggam erat kancing mutiara kebaya Ibu di dadanya lalu memeluk lengan Damar. "Dua kancing mutiara Ibu ini bakal kujahit di kebaya ulang tahun pernikahan kita nanti, Mas. Terima kasih sudah menunjukkannya padaku hari ini ❤️"',
        onEnd: {
          kehadiranKeluarga: 3,
          kejujuranDiri: 2,
          setFlags: ['shared_mother_letter_with_nadia'],
          journalEntry: {
            id: 'je_shared_mother_letter',
            title: 'Dua Kancing Mutiara Ibu di Genggaman Nadia',
            body: 'Aku membacakan surat tahun 2016 peninggalan almarhumah Ibu bersama Nadia. Air mata Nadia jatuh hangat saat tahu betapa Ibu mempercayainya sejak hari pertama kami minum teh di teras dulu.',
            chapter: 1,
          },
          toast: 'Nadia memeluk erat surat & kancing mutiara almarhumah Ibu! (+Kehadiran Keluarga)',
        },
      },
    },
  },
};
