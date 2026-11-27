import { ChapterNumber, CharacterId, DialogueEffect, RadioStationId } from '../types/game';

export type ReplyToneLabel = 'Jujur' | 'Hangat' | 'Tenang' | 'Defensif' | 'Fokus Kerja';

export interface ChatBubble {
  id: string;
  from: 'them' | 'damar';
  text: string;
  time: string;
  chapterMin: ChapterNumber;
  requiredFlag?: string;
}

export interface ChatReplyOption {
  id: string;
  toneLabel: ReplyToneLabel;
  text: string;
  replyFromThem: string;
  replyTime: string;
  effects?: DialogueEffect;
}

export interface ChatPrompt {
  id: string;
  chapterMin: ChapterNumber;
  requiredFlag?: string;
  contextHint?: string;
  options: ChatReplyOption[];
}

export interface PhoneContactThread {
  id: string;
  name: string;
  relation: string;
  speakerId: CharacterId;
  avatarColor: string;
  initials: string;
  messages: ChatBubble[];
  prompts: ChatPrompt[];
  quickCallLines: Record<ChapterNumber, string>;
}

export interface VoiceNoteItem {
  id: string;
  speakerId: CharacterId;
  senderName: string;
  title: string;
  duration: string;
  chapterMin: ChapterNumber;
  requiredFlag?: string;
  transcript: string;
}

export interface MemoryPhotoItem {
  id: string;
  title: string;
  dateLabel: string;
  locationLabel: string;
  caption: string;
  chapterMin: ChapterNumber;
  theme: 'stage' | 'bridge' | 'baby' | 'cafe' | 'crayon' | 'home_night' | 'dinner_quiet' | 'moving_boxes';
  flashbackDialogueId?: string;
  flashbackFlag?: string;
  flashbackBadge?: string;
}

export interface RadioStationInfo {
  id: RadioStationId;
  name: string;
  subtitle: string;
  mood: 'home' | 'cafe' | 'park' | 'rooftop' | 'title';
}

export const RADIO_STATIONS: RadioStationInfo[] = [
  {
    id: 'auto',
    name: 'Otomatis (Sesuai Lokasi)',
    subtitle: 'Musik mengikuti suasana jalanan & tempat Damar',
    mood: 'home',
  },
  {
    id: 'senja_fm',
    name: 'Radio Senja 98.4 FM',
    subtitle: 'Akustik senja santai untuk teman berjalan pulang',
    mood: 'park',
  },
  {
    id: 'langkah_kecil',
    name: 'Kaset Demo "Langkah Kecil" (2018)',
    subtitle: 'Rekaman petikan gitar lama Damar & Bima',
    mood: 'cafe',
  },
  {
    id: 'piano_hujan',
    name: 'Piano Hujan & Kopi',
    subtitle: 'Dentingan felt piano hangat & tenang',
    mood: 'home',
  },
  {
    id: 'malam_rooftop',
    name: 'Lampu Malam Rooftop',
    subtitle: 'Cello lembut & harmoni malam kota',
    mood: 'rooftop',
  },
];

export const PHONE_THREADS: PhoneContactThread[] = [
  {
    id: 'nadia',
    name: 'Nadia ❤️',
    relation: 'Istri',
    speakerId: 'nadia',
    avatarColor: '#c98474',
    initials: 'ND',
    messages: [
      {
        id: 'nd_1',
        from: 'them',
        text: 'Mas, bekal buah potongnya jangan lupa dimakan pas istirahat siang ya. Kemarin balik lagi masih utuh di tas 😌',
        time: '07:45',
        chapterMin: 1,
      },
      {
        id: 'nd_2',
        from: 'them',
        text: 'Kira barusan di depan gerbang sekolah nanya lagi: "Bunda, Ayah beneran ingat cat air biru sama danau, kan?"',
        time: '10:05',
        chapterMin: 1,
      },
      {
        id: 'nd_fb_dinner',
        from: 'them',
        text: 'Mas, kok tiba-tiba aku keinget malam pas aku agak sensitif di meja makan enam bulan lalu ya... kamu nggak apa-apa kan hari ini? Aku pengin kita ngobrol pelan-pelan lagi.',
        time: 'Baru saja',
        chapterMin: 1,
        requiredFlag: 'flashback_dinner_done',
      },
      {
        id: 'nd_fb_melati_2019',
        from: 'them',
        text: 'Mas, barusan aku beresin laci bawah nemu kunci serep lama pas kita pertama kali akad rumah tahun 2019... jadi keinget malam kita makan nasi goreng tek-tek pakai satu sendok plastik di lantai kosong 🥺',
        time: 'Baru saja',
        chapterMin: 1,
        requiredFlag: 'flashback_melati_2019_done',
      },
      {
        id: 'nd_1996_archive',
        from: 'them',
        text: 'Eh Mas, kamu tadi mampir lihat foto lama kota tahun 1996 dekat kantor ya? Aku tahu kamu jarang cerita soal almarhum Bapak... kalau lagi rindu, cerita aja ke aku ya.',
        time: 'Baru saja',
        chapterMin: 1,
        requiredFlag: 'remembered_father_1996',
      },
      {
        id: 'nd_father_tape_1997',
        from: 'them',
        text: 'Mas... barusan aku merinding banget dengar desis kaset tua dari radio kayu di dapur. Itu beneran suara asli almarhum Bapak tahun 1997 waktu ngajarin kamu gitar? Sini duduk sama aku kalau dadamu lagi penuh ❤️',
        time: 'Baru saja',
        chapterMin: 1,
        requiredFlag: 'played_father_cassette_1997',
      },
      {
        id: 'nd_3',
        from: 'them',
        text: 'Langit udah mulai mendung banget di rumah, Mas. Kalau hujan nanti jangan ngebut ya... aku tunggu kabar kamu.',
        time: '17:20',
        chapterMin: 2,
      },
      {
        id: 'nd_4',
        from: 'them',
        text: 'Sup ayamnya udah kuhangatkan lagi di meja makan. Lampu teras juga kunyalakan. Pulang pelan-pelan ya, Mas.',
        time: '20:40',
        chapterMin: 3,
      },
    ],
    prompts: [
      {
        id: 'prompt_nadia_ch1',
        chapterMin: 1,
        contextHint: 'Nadia menanyakan janji kecil untuk Kira sore ini',
        options: [
          {
            id: 'rep_nd1_warm',
            toneLabel: 'Hangat',
            text: 'Aku ingat banget kok, Nad. Nanti sore aku usahain pulang sebelum gelap ya ❤️',
            replyFromThem: 'Makasih ya Mas... dengernya aja udah bikin lega. Semangat kerjanya hari ini, jangan lupa makan buahnya!',
            replyTime: '10:07',
            effects: { kehadiranKeluarga: 2, kejujuranDiri: 1 },
          },
          {
            id: 'rep_nd1_honest',
            toneLabel: 'Jujur',
            text: 'Jujur kepalaku lagi agak penuh soal kantor, Nad. Tapi aku nggak mau ingkar janji lagi ke Kira hari ini.',
            replyFromThem: 'Aku seneng kamu bilang jujur daripada mendem sendiri, Mas. Pelan-pelan aja ya—aku dukung kamu dari rumah.',
            replyTime: '10:08',
            effects: { kejujuranDiri: 2, kehadiranKeluarga: 1 },
          },
          {
            id: 'rep_nd1_busy',
            toneLabel: 'Fokus Kerja',
            text: 'Hari ini rapat Proyek Kartika lagi padat banget Nad, nanti aku kabari lagi ya.',
            replyFromThem: 'Oh... iya Mas, nggak apa-apa. Aku nanti yang pelan-pelan jelasin ke Kira.',
            replyTime: '10:09',
            effects: { ambisiPelarian: 1 },
          },
        ],
      },
      {
        id: 'prompt_nadia_after_dinner_fb',
        chapterMin: 1,
        requiredFlag: 'flashback_dinner_done',
        contextHint: 'Menanggapi kenangan malam sunyi di meja makan 6 bulan lalu',
        options: [
          {
            id: 'rep_nd_fb_apology',
            toneLabel: 'Jujur',
            text: 'Maafin aku soal malam itu, Nad. Kamu nggak sensitif—aku yang waktu itu terlalu takut sampai lupa melihat matamu.',
            replyFromThem: 'Mas... aku baca ini sampai berkaca-kaca di dapur. Makasih sudah mau bilang itu. Malam ini kita mulai lagi dari meja makan yang hangat ya ❤️',
            replyTime: 'Baru saja',
            effects: {
              kejujuranDiri: 2,
              kehadiranKeluarga: 3,
              setFlags: ['reconciled_dinner_memory_chat'],
              journalEntry: {
                id: 'je_chat_nadia_dinner_apology',
                title: 'Pesan Maaf yang Akhirnya Terkirim',
                body: 'Aku mengirim pesan jujur kepada Nadia tentang malam enam bulan lalu saat sup ayam dingin di depan laptopku. Untuk pertama kalinya setelah sekian lama, beban di dadaku terasa jauh lebih ringan.',
                chapter: 1,
              },
            },
          },
          {
            id: 'rep_nd_fb_promise',
            toneLabel: 'Hangat',
            text: 'Nanti malam laptopku nggak bakal kubuka di meja makan, Nad. Aku janji cuma mau dengerin cerita kamu sama Kira.',
            replyFromThem: 'Beneran ya Mas? Aku catat nih janjinya! Aku buatin teh melati hangat kesukaan kamu nanti.',
            replyTime: 'Baru saja',
            effects: { kehadiranKeluarga: 2, kejujuranDiri: 1 },
          },
          {
            id: 'rep_nd_fb_defensive',
            toneLabel: 'Defensif',
            text: 'Udah berlalu kok Nad, nggak usah dipikirin lagi. Yang penting sekarang semuanya aman.',
            replyFromThem: 'Iya Mas... semoga memang beneran aman, bukan cuma kita pura-pura lupa.',
            replyTime: 'Baru saja',
            effects: { ambisiPelarian: 1 },
          },
        ],
      },
      {
        id: 'prompt_nadia_after_melati_fb',
        chapterMin: 1,
        requiredFlag: 'flashback_melati_2019_done',
        contextHint: 'Menanggapi kenangan malam pertama pindahan rumah 12 November 2019',
        options: [
          {
            id: 'rep_nd_melati_honest',
            toneLabel: 'Jujur',
            text: 'Aku juga baru aja ngelamunin malam itu, Nad. Meja makannya sekarang udah kebeli—maafin aku kalau belakangan orang yang duduk sama kamu malah sering sibuk sendiri.',
            replyFromThem: 'Ya ampun Mas... kamu masih inget kalimatku malam itu? Aku terharu banget bacanya. Pulang nanti duduk lama-lama sama aku ya ❤️',
            replyTime: 'Baru saja',
            effects: {
              kejujuranDiri: 2,
              kehadiranKeluarga: 3,
              setFlags: ['remembered_melati_2019_chat'],
              journalEntry: {
                id: 'je_chat_nadia_melati_2019',
                title: 'Janji Meja Kayu Tahun 2019',
                body: 'Lewat pesan singkat, aku dan Nadia mengenang kembali malam pertama kami di Jl. Melati No. 14. Ternyata kebahagiaan paling utuh selalu sesederhana duduk berhadapan tanpa tergesa.',
                chapter: 1,
              },
            },
          },
          {
            id: 'rep_nd_melati_lesehan',
            toneLabel: 'Hangat',
            text: 'Kapan-kapan kita gelar kain batik di ruang tamu terus makan nasi goreng tek-tek bareng Kira yuk, biar dia tahu cerita rumah ini!',
            replyFromThem: 'Hahaha ide bagus banget!! Kira pasti heboh kalau diajak piknik lesehan di ruang tamu sambil matiin lampu besar!',
            replyTime: 'Baru saja',
            effects: { kehadiranKeluarga: 3, kejujuranDiri: 1 },
          },
          {
            id: 'rep_nd_melati_calm',
            toneLabel: 'Tenang',
            text: 'Nggak kerasa udah bertahun-tahun kita lewati dari lantai kosong itu ya, Nad. Makasih udah selalu nemenin aku dari nol.',
            replyFromThem: 'Sama-sama, Mas. Dari nol sampai kapan pun, asal kita tetap saling cerita ya.',
            replyTime: 'Baru saja',
            effects: { kehadiranKeluarga: 2, kejujuranDiri: 1 },
          },
        ],
      },
      {
        id: 'prompt_nadia_1996',
        chapterMin: 1,
        requiredFlag: 'remembered_father_1996',
        contextHint: 'Nadia membuka ruang cerita tentang almarhum Bapak',
        options: [
          {
            id: 'rep_nd_96_share',
            toneLabel: 'Jujur',
            text: 'Iya Nad... tadi aku baru sadar, ternyata selama ini aku kelelahan ngejar bayangan Bapak, padahal yang kurindukan cuma ketenangannya.',
            replyFromThem: 'Bapak pasti bangga banget lihat kamu yang sekarang, Mas—bukan cuma kerja kerasnya, tapi hatimu yang nggak pernah berhenti berusaha buat keluarga.',
            replyTime: 'Baru saja',
            effects: { kejujuranDiri: 2, kehadiranKeluarga: 2 },
          },
          {
            id: 'rep_nd_96_warm',
            toneLabel: 'Hangat',
            text: 'Nanti malam habis makan, temani aku cerita soal masa kecil sama Bapak ya, Nad. Pengin Kira juga tahu cerita Kakeknya.',
            replyFromThem: 'Mau banget, Mas. Kira pasti seneng dengar cerita waktu Ayah masih seumuran dia dulu.',
            replyTime: 'Baru saja',
            effects: { kehadiranKeluarga: 2, kejujuranDiri: 1 },
          },
        ],
      },
      {
        id: 'prompt_nadia_father_tape',
        chapterMin: 1,
        requiredFlag: 'played_father_cassette_1997',
        contextHint: 'Menanggapi rekaman pita kaset suara almarhum Bapak (1997)',
        options: [
          {
            id: 'rep_nd_ft_honest',
            toneLabel: 'Jujur',
            text: 'Aku nangis di dapur barusan, Nad. Di ujung pitanya Bapak bilang rumah itu bukan tempat pamer kuat, tapi tempat aku boleh meletakkan tasku.',
            replyFromThem: 'Ya Tuhan, Mas... aku ikut berkaca-kaca bacanya. Almarhum Bapak bener banget. Letakkan semua capekmu di sini ya, pelukanku selalu siap buat kamu ❤️',
            replyTime: 'Baru saja',
            effects: {
              kejujuranDiri: 3,
              kehadiranKeluarga: 2,
              setFlags: ['replied_nadia_father_tape_chat'],
            },
          },
          {
            id: 'rep_nd_ft_listen_together',
            toneLabel: 'Hangat',
            text: 'Nanti malam kita putar lagi kasetnya berdua ya, Nad. Aku pengin kamu kenal suara tawa Bapak waktu aku masih tujuh tahun.',
            replyFromThem: 'Mau banget, Mas... terima kasih sudah mengizinkan aku ikut menjaga kenangan sepenting itu. Aku seduhin teh hangat nanti malam ya.',
            replyTime: 'Baru saja',
            effects: {
              kehadiranKeluarga: 3,
              kejujuranDiri: 1,
              setFlags: ['replied_nadia_father_tape_chat'],
            },
          },
          {
            id: 'rep_nd_ft_kira',
            toneLabel: 'Tenang',
            text: 'Ternyata dulu Bapak ngajarin aku akor G sambil niup jariku yang perih, Nad. Besok aku mau ngajarin Kira main gitar sesabar itu.',
            replyFromThem: 'Pantesan cara kamu meluk Kira kalau dia jatuh selalu lembut banget—ternyata itu warisan langsung dari almarhum Bapak ya 🥺',
            replyTime: 'Baru saja',
            effects: {
              kehadiranKeluarga: 2,
              kejujuranDiri: 2,
              setFlags: ['replied_nadia_father_tape_chat'],
            },
          },
        ],
      },
      {
        id: 'prompt_nadia_ch2',
        chapterMin: 2,
        contextHint: 'Hujan sore mulai turun — Nadia menunggu kabarmu',
        options: [
          {
            id: 'rep_nd2_honest',
            toneLabel: 'Jujur',
            text: 'Maafin aku ya Nad, aku lagi belajar buat nggak melarikan diri ke kerjaan terus. Habis ini aku pulang.',
            replyFromThem: 'Hati-hati hujan, Mas. Aku nggak ke mana-mana, kita ngobrol pelan-pelan di meja makan nanti.',
            replyTime: '17:24',
            effects: { kejujuranDiri: 2, kehadiranKeluarga: 2 },
          },
          {
            id: 'rep_nd2_warm',
            toneLabel: 'Hangat',
            text: 'Aku bawa payung kok, Sayang. Kamu sama Kira jangan kedinginan ya—ada yang mau dibeliin di jalan pulang?',
            replyFromThem: 'Cukup kamu pulang dalam keadaan hangat dan nggak ngebut, Mas. Itu udah lebih dari cukup.',
            replyTime: '17:23',
            effects: { kehadiranKeluarga: 2 },
          },
          {
            id: 'rep_nd2_short',
            toneLabel: 'Defensif',
            text: 'Oke Nad, nanti aku kabari kalau udah jalan pulang.',
            replyFromThem: 'Iya Mas. Jangan sampai kehujanan terlalu lama ya.',
            replyTime: '17:25',
            effects: { ambisiPelarian: 1 },
          },
        ],
      },
      {
        id: 'prompt_nadia_ch3',
        chapterMin: 3,
        contextHint: 'Malam tiba — lampu teras Jl. Melati No. 14 menyala menunggumu',
        options: [
          {
            id: 'rep_nd3_home',
            toneLabel: 'Jujur',
            text: 'Aku sedang melangkah pulang, Nad. Malam ini aku nggak pulang sebagai tamu—aku pulang utuh untuk kamu dan Kira.',
            replyFromThem: 'Pintunya nggak kukunci, Mas. Terima kasih sudah selalu menemukan jalan pulang ❤️',
            replyTime: '20:42',
            effects: { kehadiranKeluarga: 3, kejujuranDiri: 2 },
          },
          {
            id: 'rep_nd3_gentle',
            toneLabel: 'Hangat',
            text: 'Tunggu aku ya, Nad. Sebentar lagi sampai, jangan tidur dulu sebelum kita makan sup hangat bareng.',
            replyFromThem: 'Aku tunggu di meja makan, Mas. Pelan-pelan di jalan ya.',
            replyTime: '20:42',
            effects: { kehadiranKeluarga: 2 },
          },
          {
            id: 'rep_nd3_tired',
            toneLabel: 'Tenang',
            text: 'Hari ini panjang banget, Nad. Aku mungkin agak diam pas sampai nanti, tapi aku lega akhirnya bisa pulang.',
            replyFromThem: 'Nggak apa-apa diam dulu, Mas. Duduk aja dulu di sebelahku, nggak perlu langsung menjelaskan semuanya.',
            replyTime: '20:43',
            effects: { kejujuranDiri: 2, kehadiranKeluarga: 1 },
          },
        ],
      },
    ],
    quickCallLines: {
      1: 'Halo Mas? Kangen ya baru juga berangkat? Hihi... jangan lupa makan siang ya, Mas. Aku lagi beresin ruang tamu.',
      2: 'Mas, di luar hujan makin kerasa... kalau kepala kamu lagi penuh, berteduh dulu sebentar ya. Aku sama Kira nunggu di rumah.',
      3: 'Kamu masih di jalan, Mas? Nggak usah buru-buru. Lampu ruang makan masih nyala buat kamu.',
    },
  },
  {
    id: 'kira',
    name: 'Kira (HP Bunda) 🖍️',
    relation: 'Putri Kecil — 6 Tahun',
    speakerId: 'kira',
    avatarColor: '#e9b949',
    initials: 'KR',
    messages: [
      {
        id: 'kr_1',
        from: 'them',
        text: 'ayaaaah ini kiraaa!! kira pinjem hp bunda bentar!! jangan lupa liat gambar kira di kulkas yaaa ☀️⛵',
        time: '08:02',
        chapterMin: 1,
      },
      {
        id: 'kr_2',
        from: 'them',
        text: 'ayah hujan di luar gede bgt... perahu kertas kira nanti basah gak yah?? ayah bawa payung gak??',
        time: '17:55',
        chapterMin: 2,
      },
      {
        id: 'kr_3',
        from: 'them',
        text: 'ayah... mata kira udah ngantuk tapi kira mau nunggu ayah pulang dulu buat peluk sebentar boleh gak? 🥺',
        time: '20:28',
        chapterMin: 3,
      },
    ],
    prompts: [
      {
        id: 'prompt_kira_ch1',
        chapterMin: 1,
        contextHint: 'Kira menunggumu memuji gambar krayonnya',
        options: [
          {
            id: 'rep_kr1_love',
            toneLabel: 'Hangat',
            text: 'Ayah udah lihat gambar Kira, bagus banget! Nanti kita bikin perahu kertas bareng ya Sayang ⛵',
            replyFromThem: 'YEAAAYYY!! kira simpen kertas warna biru buat ayah!! dadah ayaaah 💕',
            replyTime: '08:04',
            effects: { kehadiranKeluarga: 2 },
          },
          {
            id: 'rep_kr1_honest',
            toneLabel: 'Jujur',
            text: 'Mataharinya cerah banget Nak! Maaf ya kalau di gambar itu Ayah masih pegang HP, mulai hari ini Ayah mau lebih sering main sama Kira.',
            replyFromThem: 'beneran yah?? asikkk!! nanti kita lomba lari sampai danau ya ayah!! ☀️',
            replyTime: '08:05',
            effects: { kehadiranKeluarga: 2, kejujuranDiri: 1 },
          },
          {
            id: 'rep_kr1_short',
            toneLabel: 'Tenang',
            text: 'Pintar banget anak Ayah. Belajar yang rajin di sekolah ya Nak.',
            replyFromThem: 'siap ayaaah! nanti sore pulang cepet yaaa!',
            replyTime: '08:05',
            effects: { kehadiranKeluarga: 1 },
          },
        ],
      },
      {
        id: 'prompt_kira_ch2',
        chapterMin: 2,
        contextHint: 'Kira khawatir perahu kertas & Ayahnya kehujanan',
        options: [
          {
            id: 'rep_kr2_story',
            toneLabel: 'Hangat',
            text: 'Perahu kertasnya kuat kok Nak, kayak Kira! Nanti kalau hujan reda kita luncurin lagi bareng-bareng di danau ya ⛵',
            replyFromThem: 'horeee!! kata bunda kalau habis hujan suka ada pelangi! kira tunggu ayah pulang yaa!!',
            replyTime: '17:57',
            effects: { kehadiranKeluarga: 2 },
          },
          {
            id: 'rep_kr2_safe',
            toneLabel: 'Tenang',
            text: 'Ayah pakai payung bening kok Sayang, aman nggak kehujanan. Kira pakai jaket hangat ya di rumah.',
            replyFromThem: 'udah pake jaket kuning gambar bebek nih yah! ayah hati-hati jalannya licin!',
            replyTime: '17:58',
            effects: { kehadiranKeluarga: 1 },
          },
        ],
      },
      {
        id: 'prompt_kira_ch3',
        chapterMin: 3,
        contextHint: 'Kira menahan kantuk menunggumu pulang malam ini',
        options: [
          {
            id: 'rep_kr3_hug',
            toneLabel: 'Hangat',
            text: 'Boleh banget, Sayang! Sebentar lagi Ayah sampai, nanti Ayah peluk erat sambil nyanyiin satu lagu sebelum Kira bobo 🎸❤️',
            replyFromThem: 'yeayyy!! kira dengerin sambil selimutan sama bunda yaa... love you ayah!!',
            replyTime: '20:30',
            effects: { kehadiranKeluarga: 3, kejujuranDiri: 1 },
          },
          {
            id: 'rep_kr3_sleep',
            toneLabel: 'Tenang',
            text: 'Kalau sudah ngantuk bobo duluan nggak apa-apa Nak, nanti pas Ayah sampai pasti Ayah cium keningnya.',
            replyFromThem: 'oke ayah... tapi besok pagi sarapan bareng kira lagi yaaa 💛',
            replyTime: '20:31',
            effects: { kehadiranKeluarga: 2 },
          },
        ],
      },
    ],
    quickCallLines: {
      1: 'Halo Ayah!! Ini Kira! Ayah lagi di mana? Jangan lupa beli es krim stroberi kalau pulang yaa!',
      2: 'Ayaaah, di luar hujan! Ayah bawa payung nggak? Nanti masuk angin lho kata Bunda!',
      3: 'Ayaah... Kira belum bobo nih, masih nungguin Ayah pulang buat peluk sebentar...',
    },
  },
  {
    id: 'bima',
    name: 'Bima (Kopi Sudut)',
    relation: 'Sahabat Lama',
    speakerId: 'bima',
    avatarColor: '#a67c52',
    initials: 'BM',
    messages: [
      {
        id: 'bm_1',
        from: 'them',
        text: 'Mar, biji kopi Flores baru datang pagi ini. Kalau lu butuh napas sebelum masuk kandang Menara Nusantara, mampir aja.',
        time: '07:50',
        chapterMin: 1,
      },
      {
        id: 'bm_fb_2018',
        from: 'them',
        text: 'Eh Mar, barusan gue beresin rak belakang nemu tiket parkir Taman Kota 2018! Inget nggak muka lo panik pas senar putus tapi Nadia malah ketawa paling kenceng?',
        time: 'Baru saja',
        chapterMin: 1,
        requiredFlag: 'flashback_2018_done',
      },
      {
        id: 'bm_2',
        from: 'them',
        text: 'Hujan turun nih. Gue udah nyalain playlist akustik lama kita di kedai. Kursi pojok deket jendela kosong buat lu.',
        time: '17:45',
        chapterMin: 2,
      },
      {
        id: 'bm_3',
        from: 'them',
        text: 'Apapun keputusan lu malam ini ke Nadia, jujur aja Mar. Lu udah terlalu lama mikul semuanya sendirian.',
        time: '20:15',
        chapterMin: 3,
      },
    ],
    prompts: [
      {
        id: 'prompt_bima_ch1',
        chapterMin: 1,
        contextHint: 'Bima mengajakmu berhenti sejenak di Kedai Kopi Sudut',
        options: [
          {
            id: 'rep_bm1_tire',
            toneLabel: 'Jujur',
            text: 'Jujur Bim, akhir-akhir ini gue kayak lupa cara nikmatin pagi.',
            replyFromThem: 'Makanya duduk sini bentar, Mar. Nggak usah jadi superhero seharian penuh. Kopi tubruk pertama gratis buat lo.',
            replyTime: '07:53',
            effects: { kejujuranDiri: 2 },
          },
          {
            id: 'rep_bm1_yes',
            toneLabel: 'Hangat',
            text: 'Siap Bim, gue memang butuh kopi sama ngobrol bentar. Gue mampir!',
            replyFromThem: 'Nah gitu dong! Gue panasin mesin sekarang, jangan lupa sapa si Moka di kursi pojok.',
            replyTime: '07:52',
            effects: { kejujuranDiri: 1 },
          },
          {
            id: 'rep_bm1_rush',
            toneLabel: 'Fokus Kerja',
            text: 'Nanti deh kalau sempat ya Bim, Pak Hendra udah nyariin soal Proyek Kartika.',
            replyFromThem: 'Gitu terus dari tahun lalu, Mar... awas kopi dingin lagi kayak kemarin.',
            replyTime: '07:54',
            effects: { ambisiPelarian: 1 },
          },
        ],
      },
      {
        id: 'prompt_bima_after_2018_fb',
        chapterMin: 1,
        requiredFlag: 'flashback_2018_done',
        contextHint: 'Menanggapi kenangan panggung akustik 2018 bersama Bima',
        options: [
          {
            id: 'rep_bm_2018_song',
            toneLabel: 'Jujur',
            text: 'Gue baru sadar Bim... ternyata bait terakhir "Track 4 — Pulang" itu udah lama ada di depan mata gue, cuma gue terlalu sibuk lari.',
            replyFromThem: 'Anjir merinding gue baca chat lo, Mar. Gitar gue di pojok kedai selalu siap—kapan pun lo mau nyelesain lagunya, kita rekaman lagi!',
            replyTime: 'Baru saja',
            effects: { kejujuranDiri: 2, kehadiranKeluarga: 1 },
          },
          {
            id: 'rep_bm_2018_laugh',
            toneLabel: 'Hangat',
            text: 'Hahaha masa paling nekad kita ya! Kapan-kapan gue ajak Nadia sama Kira duduk di kedai lo sambil main gitar lagi.',
            replyFromThem: 'Wajib! Kira gue bikinin cokelat panas marshmallow paling spesial se-kota!',
            replyTime: 'Baru saja',
            effects: { kehadiranKeluarga: 2 },
          },
        ],
      },
      {
        id: 'prompt_bima_ch2',
        chapterMin: 2,
        contextHint: 'Hujan sore di Kedai Kopi Sudut',
        options: [
          {
            id: 'rep_bm2_open',
            toneLabel: 'Jujur',
            text: 'Bim, gue takut kalau gue nolak lembur & promosi penuh, nanti hidup Nadia sama Kira kurang. Tapi kalau gue ambil, gue kehilangan mereka.',
            replyFromThem: 'Damar... Nadia nikah sama lo waktu lo cuma punya lima senar gitar dan mi rebus. Dia nggak butuh gelar Senior Manager lo, dia butuh suaminya.',
            replyTime: '17:48',
            effects: { kejujuranDiri: 2, kehadiranKeluarga: 1 },
          },
          {
            id: 'rep_bm2_calm',
            toneLabel: 'Tenang',
            text: 'Makasih ya Bim udah selalu nyediain ruang tanpa ngehakimi. Habis urusan beres gue pasti mampir lagi.',
            replyFromThem: 'Pintu Kopi Sudut selalu terbuka buat lo, bro. Hati-hati di jalan.',
            replyTime: '17:49',
            effects: { kejujuranDiri: 1 },
          },
        ],
      },
    ],
    quickCallLines: {
      1: 'Yo Mar! Kedai udah buka nih, aroma kopinya udah wangi sampai trotoar. Mampir aja kalau sempat.',
      2: 'Hujan-hujan gini paling bener berteduh sambil minum cokelat panas, Mar. Gue masih buka di Kedai Kopi Sudut.',
      3: 'Udah mau pulang ke rumah, Mar? Mantap. Salam buat Nadia sama Kira ya—jangan lupa senyum!',
    },
  },
  {
    id: 'bagas',
    name: 'Mas Bagas (Nada Lama) 🎸',
    relation: 'Penjaga Toko Musik Antik',
    speakerId: 'mas_bagas',
    avatarColor: '#b57b4c',
    initials: 'BG',
    messages: [
      {
        id: 'bg_1',
        from: 'them',
        text: 'Halo Mar! Apa kabar? Kemarin pas beresin rak kaset bawah, gue nemu kaset demo lama band kalian "Langkah Kecil". Masih ada tulisan spidol kamu di sampulnya lho.',
        time: '09:18',
        chapterMin: 1,
      },
      {
        id: 'bg_fb_2020',
        from: 'them',
        text: 'Mar... stiker kertas "TITIPAN DAMAR" di dalam tas gitar mahoni kamu masih nempel utuh lho. Kapan mau main ke toko? Nggak usah mikir harga, kita ngobrol aja.',
        time: 'Baru saja',
        chapterMin: 1,
        requiredFlag: 'flashback_2020_done',
      },
      {
        id: 'bg_2',
        from: 'them',
        text: 'Sore-sore mendung gini enaknya dengerin petikan senar nilon sambil ngeteh. Kalau lewat depan Nada Lama, mampir aja Mar—senar gitarmu baru kuganti yang hangat.',
        time: '16:50',
        chapterMin: 2,
      },
    ],
    prompts: [
      {
        id: 'prompt_bagas_ch1',
        chapterMin: 1,
        contextHint: 'Mas Bagas menyimpan kaset demo & gitar lamamu di Nada Lama',
        options: [
          {
            id: 'rep_bg1_nostalgia',
            toneLabel: 'Jujur',
            text: 'Kaget masih disimpan, Gas... jujur aku kangen banget rasanya megang gitar tanpa mikirin tenggat kantor.',
            replyFromThem: 'Tangan yang pernah jatuh cinta sama musik nggak pernah bener-bener lupa, Mar. Mampir aja kapan-kapan, coba petik satu akor dulu.',
            replyTime: '09:21',
            effects: { kejujuranDiri: 2 },
          },
          {
            id: 'rep_bg1_kira',
            toneLabel: 'Hangat',
            text: 'Kapan-kapan aku ajak Kira ke sana ya Gas! Anakku sekarang udah 6 tahun, suka banget nyanyi sebelum tidur.',
            replyFromThem: 'Wah udah 6 tahun aja si kecil! Ajak banget dong Mar, nanti gue kasih lihat ukulele warna kuning buat Kira!',
            replyTime: '09:22',
            effects: { kehadiranKeluarga: 2 },
          },
          {
            id: 'rep_bg1_busy',
            toneLabel: 'Fokus Kerja',
            text: 'Haha masa lalu banget itu Gas. Sekarang jari-jariku lebih sering ngetik laporan daripada metik senar.',
            replyFromThem: 'Hahaha nggak apa-apa Mar. Tapi kalau suatu hari jarimu pegel ngetik laporan, rak kaset di sini masih sabar nunggu.',
            replyTime: '09:23',
            effects: { ambisiPelarian: 1 },
          },
        ],
      },
      {
        id: 'prompt_bagas_after_2020_fb',
        chapterMin: 1,
        requiredFlag: 'flashback_2020_done',
        contextHint: 'Menanggapi rahasia stiker "TITIPAN DAMAR" dari malam hujan 2020',
        options: [
          {
            id: 'rep_bg_2020_thanks',
            toneLabel: 'Jujur',
            text: 'Terima kasih banyak, Gas... nggak tahu harus balas gimana. Enam tahun kamu jaga sepotong diriku yang sempat kutinggal malam itu.',
            replyFromThem: 'Nggak perlu dibalas apa-apa, Mar. Cukup selesaikan lagu buat Kira, terus mainin di depan Nadia. Itu udah bayaran paling mahal buat gue.',
            replyTime: 'Baru saja',
            effects: {
              kejujuranDiri: 2,
              kehadiranKeluarga: 2,
              setFlags: ['thanked_bagas_guitar_chat'],
            },
          },
          {
            id: 'rep_bg_2020_visit',
            toneLabel: 'Hangat',
            text: 'Aku pasti mampir buat jemput pulang gitar itu, Gas. Kali ini aku nggak bakal sembunyiin ceritanya lagi dari Nadia.',
            replyFromThem: 'Nah! Itu baru Damar yang gue kenal. Pintu Nada Lama selalu terbuka buat lo dan keluarga.',
            replyTime: 'Baru saja',
            effects: { kehadiranKeluarga: 2, kejujuranDiri: 1 },
          },
        ],
      },
    ],
    quickCallLines: {
      1: 'Halo Mar! Toko Nada Lama baru buka nih, lagi muter piringan hitam akustik lama. Mampir kalau lewat ya!',
      2: 'Hujan gini aroma kayu gitar di toko makin enak, Mar. Kalau butuh tempat tenang sebentar, duduk aja di sini.',
      3: 'Udah malam Mar—pulang dulu ketemu anak istri. Gitar mahoni kamu aman di sini, nggak bakal ke mana-mana.',
    },
  },
  {
    id: 'hendra',
    name: 'Pak Hendra (Kantor)',
    relation: 'Kepala Divisi — Menara Nusantara',
    speakerId: 'pak_hendra',
    avatarColor: '#5a738e',
    initials: 'PH',
    messages: [
      {
        id: 'ph_1',
        from: 'them',
        text: 'Damar, pagi ini saya tunggu di lobi Menara Nusantara. Ada kabar penting soal Proyek Kartika dan rekomendasi posisi Senior Manager.',
        time: '08:12',
        chapterMin: 1,
      },
      {
        id: 'ph_2',
        from: 'them',
        text: 'Klien minta kepastian tim sebelum jam 6 sore. Mohon temui saya dulu sebelum kamu pulang.',
        time: '16:40',
        chapterMin: 2,
      },
      {
        id: 'ph_3',
        from: 'them',
        text: 'Terima kasih untuk hari ini, Damar. Istirahat yang cukup malam ini, besok pagi kita lanjutkan dengan kepala dingin.',
        time: '20:10',
        chapterMin: 3,
      },
    ],
    prompts: [
      {
        id: 'prompt_hendra_ch1',
        chapterMin: 1,
        contextHint: 'Pak Hendra memanggilmu membahas Proyek Kartika di lobi',
        options: [
          {
            id: 'rep_ph1_balanced',
            toneLabel: 'Tenang',
            text: 'Baik Pak Hendra, saya segera ke Menara Nusantara. Terima kasih atas kepercayaannya selama ini.',
            replyFromThem: 'Sama-sama, Damar. Tidak perlu terburu-buru di jalan, kita bicara santai di lobi.',
            replyTime: '08:14',
            effects: { kejujuranDiri: 1 },
          },
          {
            id: 'rep_ph1_eager',
            toneLabel: 'Fokus Kerja',
            text: 'Siap Pak! Saya sudah siapkan draf revisi Proyek Kartika dari semalam dan siap ambil tanggung jawab penuh.',
            replyFromThem: 'Kerja bagus, Damar. Tapi pastikan kamu juga sempat sarapan dulu pagi ini ya.',
            replyTime: '08:13',
            effects: { ambisiPelarian: 1 },
          },
          {
            id: 'rep_ph1_honest',
            toneLabel: 'Jujur',
            text: 'Siap Pak, saya ke sana sebentar lagi. Jujur ada beberapa hal soal ritme kerja tim yang ingin saya sampaikan juga.',
            replyFromThem: 'Saya justru senang kalau kamu terbuka, Damar. Mari kita bicarakan bersama.',
            replyTime: '08:15',
            effects: { kejujuranDiri: 2 },
          },
        ],
      },
      {
        id: 'prompt_hendra_ch2',
        chapterMin: 2,
        contextHint: 'Tenggat klien Proyek Kartika berbenturan dengan jam pulang sore',
        options: [
          {
            id: 'rep_ph2_firm',
            toneLabel: 'Jujur',
            text: 'Baik Pak, saya segera ke lobi. Saya juga ingin mendiskusikan batas jam kerja yang sehat untuk proyek ini.',
            replyFromThem: 'Boleh, saya hargai keterbukaan kamu. Kita bahas langsung di lobi.',
            replyTime: '16:44',
            effects: { kejujuranDiri: 2, kehadiranKeluarga: 1 },
          },
          {
            id: 'rep_ph2_calm',
            toneLabel: 'Tenang',
            text: 'Saya meluncur ke kantor Pak. Saya akan pastikan target klien tetap aman tanpa harus mengorbankan semua malam tim.',
            replyFromThem: 'Pendekatan yang matang, Damar. Pemimpin yang baik memang perlu tahu kapan harus menahan laju.',
            replyTime: '16:45',
            effects: { kejujuranDiri: 1, kehadiranKeluarga: 1 },
          },
          {
            id: 'rep_ph2_obey',
            toneLabel: 'Fokus Kerja',
            text: 'Siap Pak Hendra, saya langsung meluncur dan siap lembur sampai malam jika diperlukan.',
            replyFromThem: 'Bagus. Itu dedikasi yang saya harapkan dari calon Senior Manager.',
            replyTime: '16:43',
            effects: { ambisiPelarian: 2 },
          },
        ],
      },
      {
        id: 'prompt_hendra_ch3',
        chapterMin: 3,
        contextHint: 'Pesan penutup malam dari Pak Hendra',
        options: [
          {
            id: 'rep_ph3_boundary',
            toneLabel: 'Jujur',
            text: 'Terima kasih Pak Hendra. Malam ini saya benar-benar mematikan laptop untuk keluarga—sampai jumpa besok pagi dengan energi penuh.',
            replyFromThem: 'Keputusan yang tepat, Damar. Salam hangat untuk istri dan putrimu di rumah.',
            replyTime: '20:13',
            effects: { kehadiranKeluarga: 2, kejujuranDiri: 1 },
          },
          {
            id: 'rep_ph3_work',
            toneLabel: 'Fokus Kerja',
            text: 'Terima kasih Pak. Kalau ada catatan tambahan dari klien malam ini, kirim saja ke email saya, nanti saya pantau.',
            replyFromThem: 'Jangan, Damar. Email saya tutup sampai besok jam 9. Belajarlah membiarkan malam menjadi milikmu sendiri.',
            replyTime: '20:14',
            effects: { ambisiPelarian: 1 },
          },
        ],
      },
    ],
    quickCallLines: {
      1: 'Damar, saya di lobi lantai dasar Menara Nusantara. Kalau sudah dekat langsung kemari ya.',
      2: 'Klien cukup ketat sore ini, Damar. Tapi pastikan kamu juga pertimbangkan kondisi keluarga sebelum memutuskan.',
      3: 'Sudah malam, Damar. Pulanglah ke keluargamu dulu. Pekerjaan kantor tidak akan lari sampai besok pagi.',
    },
  },
];

export const VOICE_NOTES: VoiceNoteItem[] = [
  {
    id: 'vn_bapak_1997',
    speakerId: 'pak_darman',
    senderName: 'Almarhum Bapak (Pita C-60 · 1997)',
    title: 'Ujung Pita Radio Dapur: "Rumah Tempat Meletakkan Tas"',
    duration: '0:24',
    chapterMin: 1,
    requiredFlag: 'played_father_cassette_1997',
    transcript:
      'Jangan takut kelihatan lelah di depan istrimu atau anakmu nanti ya, Mar. Rumah itu bukan tempat orang pamer kuat—rumah itu tempat kamu boleh meletakkan tasmu. Bapak bangga sama kamu, bukan karena pangkatmu nanti tinggi, tapi karena kamu anak Bapak.',
  },
  {
    id: 'vn_kira_pagi',
    speakerId: 'kira',
    senderName: 'Kira',
    title: 'Pesan Suara Sebelum Sekolah',
    duration: '0:12',
    chapterMin: 1,
    transcript:
      'Ayah, ini Kira! Tadi di mobil Bunda nyanyi lagu yang Ayah ajarin dulu. Nanti malam Ayah main gitar lagi dong buat Kira tidur!',
  },
  {
    id: 'vn_bima_demo',
    speakerId: 'bima',
    senderName: 'Bima',
    title: 'Rekaman Kaset Lama 2018',
    duration: '0:15',
    chapterMin: 1,
    transcript:
      'Mar, gue barusan nemu rekaman suara kita latihan tahun 2018. Inget nggak waktu lo bilang lagu "Pulang" itu nanti mau lo selesain kalau udah punya rumah sendiri?',
  },
  {
    id: 'vn_bagas_gitar',
    speakerId: 'mas_bagas',
    senderName: 'Mas Bagas',
    title: 'Gitar Mahoni di Nada Lama',
    duration: '0:14',
    chapterMin: 1,
    transcript:
      'Mar, cuma mau bilang... gitar mahoni kamu masih aku lap debunya seminggu sekali. Senarnya baru aku ganti kemarin sore biar nggak kaku. Kapan-kapan mampir petik sebentar, ya.',
  },
  {
    id: 'vn_nadia_hujan',
    speakerId: 'nadia',
    senderName: 'Nadia',
    title: 'Saat Hujan Mulai Turun',
    duration: '0:16',
    chapterMin: 2,
    transcript:
      'Mas... hujan di rumah deras banget. Aku cuma pengin bilang, aku nggak pernah menyesal memilih kamu. Aku cuma kangen kita saling jujur kayak dulu lagi.',
  },
  {
    id: 'vn_nadia_malam',
    speakerId: 'nadia',
    senderName: 'Nadia',
    title: 'Lampu Meja Makan Malam Ini',
    duration: '0:15',
    chapterMin: 3,
    transcript:
      'Mas, Kira baru aja mulai ngantuk sambil megang buku gambarnya. Aku duduk di meja makan sekarang... nggak usah bawa apa-apa, cukup bawa diri kamu pulang utuh malam ini.',
  },
];

export const MEMORY_PHOTOS: MemoryPhotoItem[] = [
  {
    id: 'mem_stage_2018',
    title: 'Panggung Akustik Taman Kota',
    dateLabel: '14 Oktober 2018',
    locationLabel: 'Taman Kota & Danau Senja',
    caption: 'Malam senar gitar putus di lagu kedua, tapi Nadia tertawa paling lepas di barisan depan.',
    chapterMin: 1,
    theme: 'stage',
    flashbackDialogueId: 'flashback_panggung_2018',
    flashbackFlag: 'flashback_2018_done',
    flashbackBadge: 'Kilas Balik 1',
  },
  {
    id: 'mem_melati_2019',
    title: 'Malam Pertama di Jl. Melati',
    dateLabel: '12 November 2019',
    locationLabel: 'Ruang Tamu Kosong No. 14',
    caption: 'Bohlam kuning 5 watt, jendela berkoran, dua kardus buku, dan nasi goreng tek-tek yang dimakan gantian pakai satu sendok plastik.',
    chapterMin: 1,
    theme: 'moving_boxes',
    flashbackDialogueId: 'flashback_malam_pertama_melati',
    flashbackFlag: 'flashback_melati_2019_done',
    flashbackBadge: 'Kilas Balik 2',
  },
  {
    id: 'mem_kira_2020',
    title: 'Genggaman Pertama Kira',
    dateLabel: '08–09 Agustus 2020',
    locationLabel: 'Toko Musik Nada Lama → RS Harapan',
    caption: 'Malam paling menegangkan sekaligus paling indah. Di balik senyum tenang itu, ada gitar mahoni yang kulepas di bawah hujan Agustus.',
    chapterMin: 1,
    theme: 'baby',
    flashbackDialogueId: 'flashback_jual_gitar_2020',
    flashbackFlag: 'flashback_2020_done',
    flashbackBadge: 'Kilas Balik 3',
  },
  {
    id: 'mem_dinner_quiet',
    title: 'Meja Makan Pukul 22.15',
    dateLabel: 'Enam Bulan Lalu',
    locationLabel: 'Ruang Makan Jl. Melati No. 14',
    caption: 'Semangkuk sup yang mulai dingin di depan layar laptop yang menyala. Malam pertama aku menyadari betapa kerasnya suara diam.',
    chapterMin: 1,
    theme: 'dinner_quiet',
    flashbackDialogueId: 'flashback_meja_makan_sunyi',
    flashbackFlag: 'flashback_dinner_done',
    flashbackBadge: 'Kilas Balik 4',
  },
  {
    id: 'mem_bridge_2019',
    title: 'Senja di Jembatan Sungai',
    dateLabel: '22 Mei 2019',
    locationLabel: 'Jembatan Tepi Sungai',
    caption: 'Hari kita memasang gembok kecil "D & N — 2019". Harta belum seberapa, tapi hati penuh.',
    chapterMin: 1,
    theme: 'bridge',
  },
  {
    id: 'mem_cafe_2022',
    title: 'Hari Pembukaan Kopi Sudut',
    dateLabel: '18 Januari 2022',
    locationLabel: 'Kedai Kopi Sudut',
    caption: 'Bima akhirnya membuka kedai impiannya. Kami bersulang pakai es kopi susu di bangku kayu depan.',
    chapterMin: 1,
    theme: 'cafe',
  },
  {
    id: 'mem_crayon_2025',
    title: 'Gambar Perahu di Danau',
    dateLabel: 'Kemarin Malam',
    locationLabel: 'Rumah Jl. Melati No. 14',
    caption: 'Kira menggambar matahari paling besar biar Ayah nggak kedinginan saat pulang malam.',
    chapterMin: 1,
    theme: 'crayon',
  },
  {
    id: 'mem_home_night',
    title: 'Lampu Meja Makan yang Menyala',
    dateLabel: 'Malam Ini',
    locationLabel: 'Jl. Melati No. 14',
    caption: 'Dari ketinggian kota, ternyata cahaya paling hangat selalu berasal dari jendela rumah sendiri.',
    chapterMin: 3,
    theme: 'home_night',
  },
];
