import { ChapterNumber, EmotionMetrics, EndingId, SideQuestProgress, TimeOfDay } from '../types/game';

export interface ConcertBar {
  id: string;
  section: string;
  chordIdx: number;
  lyric: string;
  homeReaction?: { speaker: 'nadia' | 'kira'; text: string };
  awayReaction?: { speaker: 'bima' | 'mas_bagas'; text: string };
}

export const CONCERT_CHORDS = [
  { key: '1', name: 'Dmaj7', mood: 'Hangat', idx: 0 },
  { key: '2', name: 'Bm7', mood: 'Reflektif', idx: 1 },
  { key: '3', name: 'Gmaj7', mood: 'Lembut', idx: 2 },
  { key: '4', name: 'A6', mood: 'Harapan', idx: 3 },
  { key: '5', name: 'Em7', mood: 'Rindu', idx: 4 },
  { key: '6', name: 'Dadd9', mood: 'Pulang', idx: 5 },
] as const;

/**
 * Lirik utuh 12-bar lagu akustik "Track 4 — Pulang" yang dulu belum sempat selesai
 * ditulis Damar pada kaset demo 2018.
 */
export const TRACK4_CONCERT_BARS: ConcertBar[] = [
  // BAIT I — KOTA YANG TERLALU CEPAT
  {
    id: 't4_1',
    section: 'Bait I · Kota yang Terlalu Cepat',
    chordIdx: 0,
    lyric: 'Lampu jalan kota mulai menyala satu per satu...',
  },
  {
    id: 't4_2',
    section: 'Bait I · Kota yang Terlalu Cepat',
    chordIdx: 1,
    lyric: 'Sepatu lelah melangkah menyusuri senja yang sama...',
  },
  {
    id: 't4_3',
    section: 'Bait I · Kota yang Terlalu Cepat',
    chordIdx: 2,
    lyric: 'Dulu kukira dewasa berarti tak pernah boleh lelah...',
  },
  {
    id: 't4_4',
    section: 'Bait I · Kota yang Terlalu Cepat',
    chordIdx: 3,
    lyric: 'Sampai lupa ada dua pasang mata yang selalu menunggu...',
    homeReaction: {
      speaker: 'kira',
      text: 'Kira berbisik pelan: "Bunda, itu lagu yang dulu Ayah gumamin pas Kira mau bobo ya?"',
    },
    awayReaction: {
      speaker: 'bima',
      text: 'Bima berhenti mengelap cangkir: "Gila, Mar... intro ini persis kaset 2018 kita."',
    },
  },
  // BAIT II — HUJAN & GITAR YANG KUTITIPKAN
  {
    id: 't4_5',
    section: 'Bait II · Hujan & Lima Senar yang Tinggal',
    chordIdx: 4,
    lyric: 'Pernah senar putus di panggung kecil tepi danau itu...',
  },
  {
    id: 't4_6',
    section: 'Bait II · Hujan & Lima Senar yang Tinggal',
    chordIdx: 2,
    lyric: 'Tapi tawamu di baris depan menyelamatkan seluruh malamku...',
    homeReaction: {
      speaker: 'nadia',
      text: 'Nadia tersenyum dengan mata berkaca-kaca, menepuk lembut irama di lututnya.',
    },
    awayReaction: {
      speaker: 'mas_bagas',
      text: 'Mas Bagas mengangguk pelan: "Kayu mahoni itu memang cuma mau bunyi sejujur ini di tanganmu."',
    },
  },
  {
    id: 't4_7',
    section: 'Bait II · Hujan & Lima Senar yang Tinggal',
    chordIdx: 1,
    lyric: 'Di bawah hujan Agustus kulepaskan kayu mahoni kesayanganku...',
  },
  {
    id: 't4_8',
    section: 'Bait II · Hujan & Lima Senar yang Tinggal',
    chordIdx: 3,
    lyric: 'Karena tangis pertamamu jauh lebih indah dari semua nada di dunia...',
    homeReaction: {
      speaker: 'nadia',
      text: 'Nadia menyeka sudut matanya pelan, lalu menyandarkan bahu lebih dekat ke arah Damar.',
    },
  },
  // REFF PENUTUP — JALAN PULANG
  {
    id: 't4_9',
    section: 'Reff Penutup · Jalan Pulang',
    chordIdx: 0,
    lyric: 'Di balik jendela kuning Jl. Melati nomor empat belas...',
  },
  {
    id: 't4_10',
    section: 'Reff Penutup · Jalan Pulang',
    chordIdx: 4,
    lyric: 'Tak ada gedung setinggi apa pun yang mampu menggantikan...',
  },
  {
    id: 't4_11',
    section: 'Reff Penutup · Jalan Pulang',
    chordIdx: 2,
    lyric: 'Tawa kecil Kira, hangat sup di meja, dan genggamanmu yang sabar...',
    homeReaction: {
      speaker: 'kira',
      text: 'Kira ikut bertepuk tangan pelan mengikuti ketukan akor sambil tersenyum lebar!',
    },
  },
  {
    id: 't4_12',
    section: 'Reff Penutup · Jalan Pulang',
    chordIdx: 5,
    lyric: 'Kini bait terakhirnya selesai kutulis—karena aku akhirnya benar-benar pulang.',
    homeReaction: {
      speaker: 'nadia',
      text: 'Nadia berbisik lembut: "Selamat datang di rumah, Mas... terima kasih sudah menyelesaikan lagu kita."',
    },
    awayReaction: {
      speaker: 'bima',
      text: 'Bima bertepuk tangan hangat: "Selesai sudah, Mar! Bawalah lagu ini pulang ke meja makan lo."',
    },
  },
];

/**
 * Lagu Bonus "Umur Dua Puluh Lima" — lagu lama Damar & Bima dari kosan 2017
 * yang bridge-nya terputus enam tahun. Terbuka setelah kilas balik 2018 atau obrolan malam bersama Bima.
 */
export const BIMA25_BARS: ConcertBar[] = [
  {
    id: 'b25_1',
    section: 'Bait I · Kosan Sempit 2017',
    chordIdx: 4,
    lyric: 'Dua gelas kopi sachet, satu gitar pinjaman di kosan sempit...',
  },
  {
    id: 'b25_2',
    section: 'Bait I · Kosan Sempit 2017',
    chordIdx: 2,
    lyric: 'Kita bersumpah takkan pernah menjual lagu demi gedung tinggi...',
  },
  {
    id: 'b25_3',
    section: 'Bait I · Kosan Sempit 2017',
    chordIdx: 1,
    lyric: 'Lalu kota menelan pagi kita satu per satu tanpa permisi...',
    homeReaction: {
      speaker: 'nadia',
      text: 'Nadia tersenyum kecil: "Ini lagu yang dulu kalian latih tiap Sabtu di teras kosan, kan?"',
    },
    awayReaction: {
      speaker: 'bima',
      text: 'Bima memejamkan mata, jarinya mengetuk meja bar: "Bait ini dulu lo yang nulis, Mar."',
    },
  },
  {
    id: 'b25_4',
    section: 'Bait I · Kosan Sempit 2017',
    chordIdx: 3,
    lyric: 'Dan kau menitipkan suaramu di sudut kedai yang sepi...',
  },
  {
    id: 'b25_5',
    section: 'Bridge · Lampu di Beranda',
    chordIdx: 0,
    lyric: 'Jika jalan kota terlalu bising untuk kaki kita...',
  },
  {
    id: 'b25_6',
    section: 'Bridge · Lampu di Beranda',
    chordIdx: 4,
    lyric: 'Nyalakan satu lampu, tunggu aku di beranda...',
    homeReaction: {
      speaker: 'kira',
      text: 'Kira bertepuk tangan: "Ayah! Lampu berandanya kayak lampu teras rumah kita!"',
    },
    awayReaction: {
      speaker: 'bima',
      text: 'Bima ikut menyanyikan suara dua dengan serak: "...tunggu aku di berandaaa!"',
    },
  },
  {
    id: 'b25_7',
    section: 'Reff · Jalan Pulang Sahabat',
    chordIdx: 2,
    lyric: 'Umur dua puluh lima boleh pergi tanpa pamit...',
  },
  {
    id: 'b25_8',
    section: 'Reff · Jalan Pulang Sahabat',
    chordIdx: 5,
    lyric: 'Tapi persahabatan kita selalu tahu jalan pulang.',
    homeReaction: {
      speaker: 'nadia',
      text: 'Nadia berbisik: "Sabtu sore nanti, nyanyikan ini bareng Bima di kedai ya, Mas."',
    },
    awayReaction: {
      speaker: 'bima',
      text: 'Bima tertawa sambil menyeka mata: "Enam tahun, Mar. Akhirnya lagu kita utuh lagi."',
    },
  },
];

export interface NadiaLetterContent {
  dateLine: string;
  salutation: string;
  paragraphs: string[];
  postscript: string;
  signature: string;
  moodLabel: string;
  voiceSummary: string;
}

/**
 * Menyusun sepucuk surat tulisan tangan Nadia di Meja Makan Jl. Melati No. 14
 * yang isinya berubah secara personal mengikuti pilihan, kilas balik, chat HP, dan ending pemain.
 */
export function buildNadiaFinalLetter(params: {
  chapter: ChapterNumber;
  timeOfDay: TimeOfDay;
  activeEnding: EndingId | null;
  emotions: EmotionMetrics;
  flags: string[];
  sideQuests: Record<string, SideQuestProgress>;
  discoveredEasterEggs: string[];
}): NadiaLetterContent {
  const { chapter, timeOfDay, activeEnding, emotions, flags, sideQuests, discoveredEasterEggs } = params;
  const completedSide = Object.values(sideQuests).filter((s) => s.status === 'completed').length;

  const dateLine =
    activeEnding === 'bad'
      ? 'Jl. Melati No. 14 · Pukul 22.40 (Di bawah tudung saji)'
      : activeEnding
        ? 'Jl. Melati No. 14 · Malam Setelah Semua Terucap'
        : timeOfDay === 'morning'
          ? `Jl. Melati No. 14 · Pagi Bab ${chapter}`
          : timeOfDay === 'rain_dusk'
            ? `Jl. Melati No. 14 · Sore Berhujan Bab ${chapter}`
            : `Jl. Melati No. 14 · Malam Bab ${chapter}`;

  const paragraphs: string[] = [];

  // PARAGRAF 1 — Pembuka sesuai dinamika kantor / ending
  if (activeEnding === 'bad') {
    paragraphs.push(
      'Sup ayamnya sudah kuhangatkan lagi tadi sore, Mas. Aku tutup rapat dengan tudung saji supaya tidak cepat dingin kalau kamu baru sampai lewat jam sepuluh. Aku tahu Proyek Kartika sedang padat-padatnya, jadi aku tidak mau membangunkan rasa bersalahmu dengan ikut begadang menunggu di ruang tamu.',
    );
  } else if (flags.includes('ch2_honest_with_hendra') || flags.includes('ch2_stood_up_for_family')) {
    paragraphs.push(
      'Aku menulis ini pelan-pelan di meja makan sementara aroma teh melati masih hangat. Hari ini ada sesuatu yang berbeda di sorot matamu, Mas—pundakmu tidak lagi sekaku kemarin. Aku tahu tidak mudah berkata jujur kepada Pak Hendra dan menetapkan batas di dunia kerja yang selalu menuntut lebih. Terima kasih sudah berani memilih kami.',
    );
  } else if (flags.includes('ch2_chose_overtime')) {
    paragraphs.push(
      'Aku tahu kepalamu masih penuh dengan jadwal revisi Proyek Kartika hari ini, Mas. Aku menulis surat kecil ini bukan untuk memarahimu soal lembur—aku sungguh mengerti betapa kerasnya kamu berjuang demi rumah kita. Aku cuma ingin kamu punya satu tempat yang selalu mengingatkanmu bahwa kamu tidak harus berubah menjadi mesin untuk dicintai.',
    );
  } else {
    paragraphs.push(
      'Mas Damar, kalau kamu menemukan kertas lipat ini di samping gelas tehmu, duduklah sebentar saja sebelum membuka ponsel lagi. Aku tahu belakangan hari-harimu penuh oleh angka, target, dan ketakutan yang jarang kamu ucapkan keras-keras.',
    );
  }

  // PARAGRAF 2 — Gema Memori & Rahasia Terdalam
  if (flags.includes('shared_mother_letter_with_nadia')) {
    paragraphs.push(
      'Dua kancing mutiara kebaya dari kaleng jahit biru almarhumah Ibu masih kugenggam hangat tadi, Mas. Membaca surat tahun 2016 beliau bersamamu membuatku sadar betapa kedua orang tuamu telah mendoakan rumah kita jauh sebelum kita tinggal di sini. Mulai malam ini, mari kita pegang benangnya dengan dua tangan kita.',
    );
  } else if (flags.includes('ch3_confessed_guitar_2020') || flags.includes('flashback_2020_done')) {
    paragraphs.push(
      'Ada satu hal yang selama enam tahun sengaja kusimpan sampai kamu sendiri siap bercerita: aku menemukan kuitansi Toko Musik Nada Lama di saku jaket basahmu seminggu setelah Kira lahir. Malam itu aku menangis diam-diam—bukan karena sedih, melainkan karena aku sadar betapa besarnya pengorbanan yang kamu tanggung sendirian demi kami. Tolong jangan pernah lagi menyembunyikan lukamu dariku, ya Mas.',
    );
  } else if (flags.includes('played_father_cassette_1997')) {
    paragraphs.push(
      'Suara serak almarhum Bapak dari kaset radio dapur tahun 1997 tadi masih terngiang di telingaku, Mas. Kalimat beliau benar sekali: rumah ini bukan panggung untuk pamer kuat, melainkan tempat kamu selalu boleh meletakkan tasmu di sebelahku.',
    );
  } else if (flags.includes('reconciled_dinner_memory_chat') || flags.includes('flashback_dinner_done')) {
    paragraphs.push(
      'Terima kasih karena kamu tidak lagi pura-pura melupakan malam pukul 22.15 enam bulan lalu. Waktu aku bilang takut kamu pulang sebagai tamu, aku sebenarnya cuma takut kehilangan sahabat terbaik yang dulu tertawa bersamaku di bawah gerimis. Melihatmu mau berhenti dan menatap mataku lagi hari ini sudah menyembuhkan separuh lelahku.',
    );
  } else if (flags.includes('remembered_father_1996')) {
    paragraphs.push(
      'Aku tahu betapa beratnya membawa bayangan almarhum Bapak sambil berusaha menjadi kepala keluarga yang sempurna. Tapi percayalah, Mas—Bapak pasti tersenyum bangga melihat betapa tulusnya hatimu menjaga rumah ini. Kamu tidak harus menjadi kuat sendirian seperti dulu.',
    );
  } else {
    paragraphs.push(
      'Terkadang aku masih ingat malam Oktober 2018 waktu senar gitarmu putus di lagu kedua dan kamu panik di atas panggung kecil Taman Kota. Aku jatuh cinta padamu bukan karena kamu serba mapan atau tidak pernah salah, melainkan karena kamu selalu jujur dengan nadamu sendiri.',
    );
  }

  // PARAGRAF 3 — Gema Perhatian pada Kira & Lagu "Pulang"
  if (flags.includes('played_track4_concert') || flags.includes('played_guitar_home') || activeEnding === 'secret') {
    paragraphs.push(
      'Mendengar petikan "Track 4 — Pulang" akhirnya selesai kamu mainkan membuat ruang tamu sederhana ini terasa seperti panggung paling indah di seluruh kota. Kira sampai tidak berhenti bercerita ke boneka beruangnya bahwa Ayah adalah pemusik paling hebat sedunia.',
    );
  } else if (flags.includes('signed_kira_rainbow_drawing') || flags.includes('found_kira_secret_drawings')) {
    paragraphs.push(
      'Tadi Kira memeluk bantal bintangnya erat sekali sambil berbisik senang karena tiga gambar rahasianya sudah dilihat Ayah. Pelangi enam senar yang ia gambar itu adalah doa paling tulus agar kamu kembali tersenyum di rumah.',
    );
  } else if (
    flags.includes('drew_with_kira_corner') ||
    flags.includes('gave_gift_kira') ||
    flags.includes('bought_balloon_kira') ||
    flags.includes('launched_paper_boat')
  ) {
    paragraphs.push(
      'Kira tidur paling pulas malam ini sambil tersenyum. Anak enam tahun itu menyimpan setiap hal kecil yang kamu lakukan hari ini—bintang kuning miring di buku gambarnya, warna cat air biru, hingga tawamu yang kembali muncul—jauh lebih erat daripada mainan mahal mana pun.',
    );
  } else if (completedSide >= 3 || discoveredEasterEggs.length >= 8) {
    paragraphs.push(
      'Tetangga di gang dan orang-orang kota selalu tersenyum tiap menyebut namamu, Mas. Kamu punya hati yang lembut untuk mendengar kisah orang lain—sekarang izinkan dirimu juga memberi kelembutan yang sama untuk hatimu sendiri.',
    );
  } else {
    paragraphs.push(
      'Kira menaruh buku gambarnya rapi di dekat bantalnya. Sebelum memejamkan mata, ia berbisik agar besok pagi Ayah tidak terburu-buru lagi dan mau mengajarinya mengayuh sepeda di ujung gang.',
    );
  }

  // PARAGRAF 4 — Penutup sesuai kondisi hati / ending
  let postscript = 'P.S. Lampu teras akan selalu kunyalakan sampai langkah sepatumu terdengar di pagar.';
  let moodLabel = 'Surat Hangat di Meja Makan';

  if (activeEnding === 'secret') {
    paragraphs.push(
      'Lagu "Pulang" sudah utuh, dan begitu juga kita. Apa pun yang menanti besok pagi, kita akan menghadapinya bersama—tanpa rahasia yang membebani bahumu lagi.',
    );
    postscript = 'P.S. Aku masih dan akan selalu duduk di barisan paling depan untuk setiap lagumu.';
    moodLabel = 'Surat Epilog · Secret Ending';
  } else if (activeEnding === 'true') {
    paragraphs.push(
      'Rumah ini mungkin tetap kecil dan sederhana, tapi sejak malam ini ia kembali penuh oleh cahaya. Terima kasih sudah benar-benar pulang, Damar.',
    );
    postscript = 'P.S. Besok pagi aku buatkan nasi goreng kesukaanmu—makan pelan-pelan ya, nggak usah sambil lihat ponsel.';
    moodLabel = 'Surat Epilog · True Ending';
  } else if (activeEnding === 'bad') {
    paragraphs.push(
      'Aku tidak marah, Mas. Aku hanya takut suatu hari nanti kita terbiasa hidup di dua dunia yang berbeda di bawah atap yang sama. Kapan pun kamu lelah berlari di gedung tinggi itu, ingatlah kursi di seberang meja makan ini masih menunggumu.',
    );
    postscript = 'P.S. Jangan lupa makan sebelum tidur. Aku sayang kamu, meski kadang rasanya kamu jauh sekali.';
    moodLabel = 'Surat Sunyi · Bad Ending';
  } else if (emotions.ambisiPelarian > emotions.kejujuranDiri + emotions.kehadiranKeluarga) {
    paragraphs.push(
      'Pelan-pelan saja, Mas. Kalau hari ini terasa terlalu berat untuk diceritakan, duduk saja dulu di sebelahku. Tidak semua hal harus diselesaikan malam ini.',
    );
    moodLabel = 'Surat Penantian · Meja Makan';
  } else {
    paragraphs.push(
      'Terima kasih karena hari ini kamu mulai berhenti sebentar dan menoleh ke rumah. Pelan-pelan saja—kita jalani hari-hari berikutnya beriringan lagi.',
    );
    moodLabel = 'Surat Hangat · Jl. Melati No. 14';
  }

  const voiceSummary =
    activeEnding === 'bad'
      ? 'Mas... sup ayamnya sudah kuhangatkan di bawah tudung saji. Kapan pun kamu lelah berlari, kursi di seberang meja makan ini masih menunggumu.'
      : 'Mas Damar... terima kasih sudah mulai berhenti sebentar dan pulang ke kami. Aku tidak butuh kamu sempurna—aku cuma selalu duduk di barisan paling depan buat kamu.';

  return {
    dateLine,
    salutation: 'Untuk Mas Damar,',
    paragraphs,
    postscript,
    signature: '— Nadia, di sisi seberang meja makan',
    moodLabel,
    voiceSummary,
  };
}
