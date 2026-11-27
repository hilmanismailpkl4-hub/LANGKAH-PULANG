import { ChapterNumber, DialogueScript, EmotionMetrics, SideQuestProgress } from '../types/game';

/**
 * PROLOG SINEMATIK INTERAKTIF — "MIMPI PUKUL 05.45: DETAK DI ANTARA DUA PINTU"
 * Membuka permainan baru sebelum Bab I dimulai (dan dapat diputar ulang kapan saja lewat Jurnal Cerita).
 */
export const PROLOGUE_DIALOGUES: Record<string, DialogueScript> = {
  prologue_mimpi_0545: {
    id: 'prologue_mimpi_0545',
    startNodeId: 'pr_1',
    flashback: {
      yearLabel: 'PUKUL 05.45 · SEBELUM SUBUH',
      title: 'Detak di Antara Dua Pintu',
      locationLabel: 'Ambang Mimpi · Kamar Jl. Melati No. 14',
      mood: 'pre_dawn_dream',
      epigraph:
        'Sebelum matahari membangunkan jadwal kota, selalu ada lima belas menit sunyi ketika hati manusia belum sempat mengenakan topengnya.',
    },
    nodes: {
      pr_1: {
        id: 'pr_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Pukul 05.45. Langit di balik tirai jendela masih berwarna nila tua—jam ganjil ketika malam telah selesai berjaga, tetapi pagi belum berani mengetuk kaca.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'pr_2',
      },
      pr_2: {
        id: 'pr_2',
        speaker: 'narator',
        emotion: 'haru',
        text: 'Di dalam tidur Damar yang tipis, dua bunyi saling berebut ruang seperti dua stasiun radio yang bertumpukan: bunyi ketikan papan ketik kantor yang cepat bagai hujan batu di atas kaca... lalu petikan satu senar gitar mahoni yang hangat, sebelum terputus di tengah nada.',
        onEnter: { playSfx: 'guitar' },
        nextNodeId: 'pr_3',
      },
      pr_3: {
        id: 'pr_3',
        speaker: 'damar_batin',
        emotion: 'ragu',
        text: 'Aku berdiri tanpa alas kaki di sebuah lorong panjang yang ganjil. Separuh lantainya adalah marmer dingin lobi Menara Nusantara; separuhnya lagi keramik ruang tamu rumahku sendiri yang berbau tanah basah.',
        nextNodeId: 'pr_4',
      },
      pr_4: {
        id: 'pr_4',
        speaker: 'damar_batin',
        emotion: 'sedih',
        text: 'Di ujung kanan lorong, pintu lift kantor menyala putih terang memanggil namaku berulang-ulang. Di ujung kiri, sebuah perahu kertas biru buatan Kira mengapung pelan di atas garis cahaya kuning dari celah pintu ruang makan.',
        nextNodeId: 'pr_5',
      },
      pr_5: {
        id: 'pr_5',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Dari balik kabut tipis di tengah lorong, terdengar sebuah suara teduh—entah suara almarhum Bapak, entah suara Damar sendiri dari masa ketika ia masih hafal cara bernyanyi: "Kalau hari ini diulang seratus kali lagi dengan cara yang sama, bagian mana dari dirimu yang paling dulu hilang, Mar?"',
        choices: [
          {
            id: 'pr_choice_voice',
            text: '"Suaraku sendiri... aku hampir lupa rasanya bernapas dan memetik gitar tanpa merasa bersalah pada jam kerja."',
            subtext: 'Merindukan jati diri yang tertimbun rutinitas kota',
            nextNodeId: 'pr_res_voice',
            effects: {
              kejujuranDiri: 2,
              setFlags: ['prologue_dream_voice'],
            },
          },
          {
            id: 'pr_choice_home',
            text: '"Tatapan Kira dan Nadia... aku takut suatu pagi aku terbangun dan mereka sudah terbiasa hidup tanpa menungguku."',
            subtext: 'Takut perlahan berubah menjadi tamu di rumah sendiri',
            nextNodeId: 'pr_res_home',
            effects: {
              kehadiranKeluarga: 2,
              setFlags: ['prologue_dream_home'],
            },
          },
          {
            id: 'pr_choice_duty',
            text: '"Aku bahkan tidak berani berhenti untuk menghitung apa yang hilang... kalau aku lengah sehari saja, siapa yang menjaga atap rumah ini?"',
            subtext: 'Memikul beban pelindung seorang diri dalam sunyi',
            nextNodeId: 'pr_res_duty',
            effects: {
              ambisiPelarian: 1,
              kejujuranDiri: 1,
              setFlags: ['prologue_dream_duty'],
            },
          },
        ],
      },
      pr_res_voice: {
        id: 'pr_res_voice',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Senar gitar yang tadinya terputus di udara mendadak bergetar pelan sekali lagi. Ternyata lagu yang belum selesai tidak pernah benar-benar mati—ia hanya menunggu pemiliknya berani mendengarkan.',
        onEnter: { playSfx: 'guitar' },
        nextNodeId: 'pr_6',
      },
      pr_res_home: {
        id: 'pr_res_home',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Perahu kertas biru di lantai itu berlayar mendekat dan berhenti tepat di ujung jari kakiku. Di lipatan kertasnya tampak coretan krayon matahari kuning milik Kira yang terasa hangat seperti genggaman tangan kecilnya.',
        onEnter: { playSfx: 'chime' },
        nextNodeId: 'pr_6',
      },
      pr_res_duty: {
        id: 'pr_res_duty',
        speaker: 'damar_batin',
        emotion: 'sedih',
        text: 'Kabut di lorong itu mereda, menyisakan pantulan wajahku yang tampak begitu lelah di permukaan marmer. Menjaga atap rumah memang mulia—tetapi apa gunanya atap yang kokoh bila orang yang menjaganya tak pernah ikut berteduh di dalamnya?',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'pr_6',
      },
      pr_6: {
        id: 'pr_6',
        speaker: 'narator',
        emotion: 'hangat',
        text: 'Ting... pelan. Layar ponsel di meja samping tempat tidur menyala menunjukkan pukul 06.00. Lorong marmer itu larut menjadi langit-langit kamar Jl. Melati No. 14, disusul bunyi spatula Nadia dari arah dapur dan langkah kaki kecil Kira yang berlari mencari buku gambarnya.',
        onEnter: { playSfx: 'phone' },
        nextNodeId: 'pr_end',
      },
      pr_end: {
        id: 'pr_end',
        speaker: 'damar_batin',
        emotion: 'tenang',
        text: 'Aku duduk di tepi kasur dan menarik napas panjang pertama pagi ini. Sisa mimpi pukul 05.45 itu masih tertinggal hangat di dadaku—seolah hari ini bukan sekadar hari kerja biasa, melainkan kesempatan untuk memilih jalan pulang.',
        onEnd: {
          playSfx: 'chime',
          journalEntry: {
            id: 'je_prologue_0545',
            title: 'Prolog · Mimpi Pukul 05.45',
            body: 'Sebelum alarm pukul enam berbunyi, aku bermimpi berdiri di lorong antara pintu lift kantor dan perahu kertas biru Kira di bawah cahaya lampu ruang makan. Pertanyaan dari mimpi itu masih menggema: bagian mana dari diriku yang paling ingin kuselamatkan hari ini?',
            chapter: 1,
          },
          triggerInitialChapterOne: true,
        },
      },
    },
  },
};

export interface ChapterLiteraryCardData {
  chapter: ChapterNumber;
  numberLabel: string;
  timeWeatherLabel: string;
  title: string;
  subtitle: string;
  epigraph: string;
  epigraphSource: string;
  monologueParagraphs: [string, string];
  echoChips: string[];
  accentTheme: 'dawn_gold' | 'rain_slate' | 'night_hearth';
}

/**
 * Menyusun Kartu Judul Sastra & Monolog Pembuka Dinamis untuk setiap pergantian Bab 1, Bab 2, dan Bab 3
 * berdasarkan pilihan nyata, mimpi prolog, kilas balik, dan arah hati pemain sejauh itu.
 */
export function buildChapterLiteraryCard(params: {
  chapter: ChapterNumber;
  flags: string[];
  emotions: EmotionMetrics;
  sideQuests: Record<string, SideQuestProgress>;
  repliedPhonePrompts: Record<string, string>;
}): ChapterLiteraryCardData {
  const { chapter, flags, emotions, sideQuests, repliedPhonePrompts } = params;
  const completedSide = Object.values(sideQuests).filter((s) => s.status === 'completed').length;
  const flashbacksDone = [
    'flashback_2018_done',
    'flashback_melati_2019_done',
    'flashback_2020_done',
    'flashback_dinner_done',
  ].filter((f) => flags.includes(f)).length;

  // =========================================================================
  // BAB I — PAGI YANG SAMA
  // =========================================================================
  if (chapter === 1) {
    const echoChips: string[] = [];
    let p1 =
      'Ada pagi-pagi ketika seseorang bangun bukan karena tubuhnya sudah cukup beristirahat, melainkan karena daftar kewajiban di kepalanya sudah lebih dulu berdiri di tepi kasur.';

    if (flags.includes('prologue_dream_voice')) {
      echoChips.push('Gema Mimpi 05.45 · Senar yang Terputus');
      p1 =
        'Sisa petikan senar dari mimpi pukul 05.45 tadi masih tertinggal samar di ujung jariku. Aneh rasanya menyadari betapa lama aku mengajari tanganku mengetik target orang lain, sampai hampir lupa bunyi suaraku sendiri.';
    } else if (flags.includes('prologue_dream_home')) {
      echoChips.push('Gema Mimpi 05.45 · Perahu Kertas Kira');
      p1 =
        'Bayangan perahu kertas biru di bawah celah pintu ruang makan dari mimpiku barusan belum mau hilang. Di luar kamar, suara tawa kecil Kira dan langkah Nadia terdengar begitu dekat—namun entah sejak kapan aku selalu melewatinya dengan tergesa.';
    } else if (flags.includes('prologue_dream_duty')) {
      echoChips.push('Gema Mimpi 05.45 · Penjaga Atap Rumah');
      p1 =
        'Bahuku sudah terasa kaku bahkan sebelum kemeja kerja kukancingkan. Bertahun-tahun aku meyakinkan diri bahwa terus berlari adalah satu-satunya cara menjaga rumah ini tetap aman—meski diam-diam napasku makin pendek.';
    }

    echoChips.push('Jl. Melati No. 14 · Pukul 07.05');

    const p2 =
      'Dari ruang makan tercium wangi nasi goreng hangat dan kopi hitam yang baru diseduh Nadia, berdampingan dengan getar pesan kantor di saku celanaku. Sebelum pintu pagar kubuka menuju bising kota, meja makan itu menungguku.';

    return {
      chapter: 1,
      numberLabel: 'BAB I',
      timeWeatherLabel: 'PUKUL 07.05 WIB · PAGI CERAH BERAWAN · RUMAH JL. MELATI NO. 14',
      title: 'Pagi yang Sama',
      subtitle: 'Di Antara Aroma Kopi dan Langkah yang Tergesa',
      epigraph:
        'Kadang kita tidak pernah sadar kapan tepatnya hidup berubah dari sesuatu yang kita nyanyikan, menjadi sekadar daftar hal yang harus dibereskan sebelum malam tiba.',
      epigraphSource: 'Catatan Batin Damar · Lembar Pertama',
      monologueParagraphs: [p1, p2],
      echoChips,
      accentTheme: 'dawn_gold',
    };
  }

  // =========================================================================
  // BAB II — HUJAN DI TENGAH KOTA
  // =========================================================================
  if (chapter === 2) {
    const echoChips: string[] = [];

    const morningKiraLine = flags.includes('ch1_listened_kira')
      ? 'Janji jari kelingking dengan Kira tadi pagi masih terasa hangat di tanganku'
      : flags.includes('ch1_rushed_morning')
        ? 'Wajah kecil Kira yang terdiam saat kupotong ceritanya tadi pagi masih mengganjal di dadaku'
        : 'Suara meja makan tadi pagi masih terngiang pelan di kepalaku';

    if (flags.includes('ch1_listened_kira')) {
      echoChips.push('Janji Jari Kelingking Kira');
    } else if (flags.includes('ch1_rushed_morning')) {
      echoChips.push('Pagi yang Terburu-buru');
    }

    const hendraLine = flags.includes('ch1_accepted_hendra_fast')
      ? 'sementara di Menara Nusantara aku sudah telanjur mengangguk menyanggupi Proyek Kartika demi rasa aman.'
      : 'sementara tawaran Proyek Kartika dari Pak Hendra menuntut jawaban pasti sebelum matahari benar-benar tenggelam.';

    echoChips.push('Pick Gitar Inisial "DP"');
    if (flashbacksDone > 0) {
      echoChips.push(`${flashbacksDone} Kilas Balik Terbuka`);
    }
    if (completedSide > 0) {
      echoChips.push(`${completedSide} Kisah Warga Didengar`);
    }

    const p1 = `${morningKiraLine}, ${hendraLine} Lalu sekeping pick gitar tua berinisial "DP" di etalase Mas Bagas merobek rapi semua pertahanan yang kubangun selama enam tahun terakhir.`;

    const p2 =
      flashbacksDone > 0 || completedSide >= 2
        ? 'Menyusuri sudut kota dan menengok kembali potongan masa lalu membuatku sadar: bukan cuma aku yang sedang berjuang mencari jalan pulang. Kini langit berubah lembayung kelabu, bau hujan pertama mulai turun di aspal, dan persimpangan sore tidak mengizinkanku bersembunyi lagi.'
        : 'Langit Kota Senja perlahan berubah jingga kelabu, membawa aroma aspal kering yang sebentar lagi basah oleh hujan. Di antara lobi kaca kantor dan rumah yang menunggu kabar, aku harus memilih siapa yang sebenarnya sedang kuperjuangkan.';

    return {
      chapter: 2,
      numberLabel: 'BAB II',
      timeWeatherLabel: 'PUKUL 17.15 WIB · SENJA MENDUNG & HUJAN TURUN · PERSIMPANGAN KOTA',
      title: 'Hujan di Tengah Kota',
      subtitle: 'Ketika Semua yang Dikubur Ikut Basah',
      epigraph:
        'Tidak ada yang lebih melelahkan daripada terus berlari ke arah yang dipuji oleh semua orang, sambil diam-diam menjauh dari orang-orang yang paling kita cintai.',
      epigraphSource: 'Catatan Batin Damar · Lembar Kedua',
      monologueParagraphs: [p1, p2],
      echoChips,
      accentTheme: 'rain_slate',
    };
  }

  // =========================================================================
  // BAB III — LANGKAH PULANG
  // =========================================================================
  const echoChips: string[] = [];

  let p1 =
    'Hujan sore akhirnya reda, meninggalkan jalanan Kota Senja yang berkilau memantulkan lampu-lampu kuning seperti cermin panjang.';

  if (flags.includes('ch2_stood_up_for_family') || flags.includes('ch2_honest_with_hendra')) {
    echoChips.push('Keberanian Menjaga Batas di Kantor');
    p1 =
      'Untuk pertama kalinya setelah bertahun-tahun, aku keluar dari Menara Nusantara bukan sebagai orang yang takut menolak, melainkan sebagai suami dan ayah yang berani menetapkan batas. Namun getar suara Nadia di atas jembatan hujan tadi mengingatkanku bahwa luka yang lama diam butuh kejujuran utuh untuk sembuh.';
  } else if (flags.includes('ch2_chose_overtime')) {
    echoChips.push('Beban Lembur Proyek Kartika');
    p1 =
      'Keputusanku menyanggupi lembur sore tadi masih terasa berat di pundak, terlebih setelah mendengar suara Nadia yang bergetar menahan sepi di ujung telepon jembatan sungai. Pertanyaan Bima di depan cangkir cokelat panas tadi menelanjangi semuanya: sampai kapan aku bersembunyi di balik kata "demi keluarga"?';
  }

  if (Object.keys(repliedPhonePrompts).length > 0) {
    echoChips.push(`${Object.keys(repliedPhonePrompts).length} Pesan Hati Terkirim`);
  }
  if (flashbacksDone >= 2) {
    echoChips.push(`${flashbacksDone}/4 Memori Masa Lalu Hidup`);
  }

  const warmth = emotions.kejujuranDiri + emotions.kehadiranKeluarga;
  const p2 =
    warmth >= emotions.ambisiPelarian + 4
      ? 'Malam telah turun sepenuhnya. Sebelum aku membuka pagar rumah Jl. Melati No. 14 dan duduk di hadapan Nadia, aku ingin naik sejenak ke puncak paling hening kota ini—mengambil kembali kepingan terakhir diriku agar kali ini aku benar-benar pulang seutuhnya.'
      : 'Malam telah turun sepenuhnya di atas atap-atap basah Kota Senja. Di puncak gedung sana angin malam berembus tenang, dan sesudahnya hanya tersisa satu meja makan di Jl. Melati No. 14 yang akan menentukan apakah aku pulang sebagai rumah—atau sekadar tamu.';

  return {
    chapter: 3,
    numberLabel: 'BAB III',
    timeWeatherLabel: 'PUKUL 20.15 WIB · MALAM BERSIH SEHABIS HUJAN · LANGIT KOTA SENJA',
    title: 'Langkah Pulang',
    subtitle: 'Satu Lampu yang Menyala di Ujung Malam',
    epigraph:
      'Pada akhirnya, seribu lampu gedung paling gemerlap di langit kota tidak akan pernah sanggup menggantikan satu lampu meja makan yang dinyalakan khusus menunggumu pulang.',
    epigraphSource: 'Catatan Batin Damar · Lembar Terakhir',
    monologueParagraphs: [p1, p2],
    echoChips,
    accentTheme: 'night_hearth',
  };
}
