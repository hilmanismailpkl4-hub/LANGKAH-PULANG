import { ChapterNumber, CharacterId, DialogueEffect, RadioStationId } from '../types/game';

export interface ChatBubble {
  id: string;
  from: 'them' | 'damar';
  text: string;
  time: string;
  chapterMin: ChapterNumber;
}

export interface ChatReplyOption {
  id: string;
  text: string;
  replyFromThem: string;
  replyTime: string;
  effects?: DialogueEffect;
}

export interface ChatPrompt {
  id: string;
  chapterMin: ChapterNumber;
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
  transcript: string;
}

export interface MemoryPhotoItem {
  id: string;
  title: string;
  dateLabel: string;
  locationLabel: string;
  caption: string;
  chapterMin: ChapterNumber;
  theme: 'stage' | 'bridge' | 'baby' | 'cafe' | 'crayon' | 'home_night';
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
        options: [
          {
            id: 'rep_nd1_warm',
            text: 'Aku ingat banget kok, Nad. Nanti sore aku usahain pulang sebelum gelap ya ❤️',
            replyFromThem: 'Makasih ya Mas... dengernya aja udah bikin lega. Semangat kerjanya hari ini.',
            replyTime: '10:07',
            effects: { kehadiranKeluarga: 2, kejujuranDiri: 1 },
          },
          {
            id: 'rep_nd1_busy',
            text: 'Hari ini rapat Proyek Kartika lagi padat banget Nad, nanti aku kabari lagi ya.',
            replyFromThem: 'Oh... iya Mas, nggak apa-apa. Aku nanti yang pelan-pelan jelasin ke Kira.',
            replyTime: '10:09',
            effects: { ambisiPelarian: 1 },
          },
        ],
      },
      {
        id: 'prompt_nadia_ch2',
        chapterMin: 2,
        options: [
          {
            id: 'rep_nd2_honest',
            text: 'Maafin aku ya Nad, aku lagi belajar buat nggak melarikan diri ke kerjaan terus. Habis ini aku pulang.',
            replyFromThem: 'Hati-hati hujan, Mas. Aku nggak ke mana-mana, kita ngobrol pelan-pelan di meja makan nanti.',
            replyTime: '17:24',
            effects: { kejujuranDiri: 2, kehadiranKeluarga: 2 },
          },
          {
            id: 'rep_nd2_short',
            text: 'Oke Nad, nanti aku kabari kalau udah jalan pulang.',
            replyFromThem: 'Iya Mas. Jangan sampai kehujanan terlalu lama ya.',
            replyTime: '17:25',
            effects: { ambisiPelarian: 1 },
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
        text: 'ayah hujan di luar gede bgt... perahu kertas kira nanti basah gak yah??',
        time: '17:55',
        chapterMin: 2,
      },
    ],
    prompts: [
      {
        id: 'prompt_kira_ch1',
        chapterMin: 1,
        options: [
          {
            id: 'rep_kr1_love',
            text: 'Ayah udah lihat gambar Kira, bagus banget! Nanti kita bikin perahu kertas bareng ya Sayang ⛵',
            replyFromThem: 'YEAAAYYY!! kira simpen kertas warna biru buat ayah!! dadah ayaaah 💕',
            replyTime: '08:04',
            effects: { kehadiranKeluarga: 2 },
          },
          {
            id: 'rep_kr1_short',
            text: 'Pintar banget anak Ayah. Belajar yang rajin di sekolah ya Nak.',
            replyFromThem: 'siap ayaaah! nanti sore pulang cepet yaaa!',
            replyTime: '08:05',
            effects: { kehadiranKeluarga: 1 },
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
        options: [
          {
            id: 'rep_bm1_yes',
            text: 'Siap Bim, gue memang butuh kopi sama ngobrol bentar. Gue mampir!',
            replyFromThem: 'Nah gitu dong! Gue panasin mesin sekarang.',
            replyTime: '07:52',
            effects: { kejujuranDiri: 1 },
          },
          {
            id: 'rep_bm1_tire',
            text: 'Jujur Bim, akhir-akhir ini gue kayak lupa cara nikmatin pagi.',
            replyFromThem: 'Makanya duduk sini bentar, Mar. Nggak usah jadi superhero seharian penuh.',
            replyTime: '07:53',
            effects: { kejujuranDiri: 2 },
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
        text: 'Damar, pagi ini saya tunggu di lobi Menara Nusantara. Ada kabar penting soal Proyek Kartika.',
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
        id: 'prompt_hendra_ch2',
        chapterMin: 2,
        options: [
          {
            id: 'rep_ph2_firm',
            text: 'Baik Pak, saya segera ke lobi. Saya juga ingin mendiskusikan batas jam kerja yang sehat untuk proyek ini.',
            replyFromThem: 'Boleh, saya hargai keterbukaan kamu. Kita bahas langsung di lobi.',
            replyTime: '16:44',
            effects: { kejujuranDiri: 2 },
          },
          {
            id: 'rep_ph2_obey',
            text: 'Siap Pak Hendra, saya langsung meluncur dan siap lembur jika diperlukan.',
            replyFromThem: 'Bagus. Itu dedikasi yang saya harapkan dari calon Senior Manager.',
            replyTime: '16:43',
            effects: { ambisiPelarian: 2 },
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
    id: 'vn_nadia_hujan',
    speakerId: 'nadia',
    senderName: 'Nadia',
    title: 'Saat Hujan Mulai Turun',
    duration: '0:16',
    chapterMin: 2,
    transcript:
      'Mas... hujan di rumah deras banget. Aku cuma pengin bilang, aku nggak pernah menyesal memilih kamu. Aku cuma kangen kita saling jujur kayak dulu lagi.',
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
    id: 'mem_kira_2020',
    title: 'Genggaman Pertama Kira',
    dateLabel: '09 Agustus 2020',
    locationLabel: 'Rumah Sakit Harapan',
    caption: 'Malam paling menegangkan sekaligus paling indah. Sejak detik ini, semua langkahku punya alasan baru.',
    chapterMin: 1,
    theme: 'baby',
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
