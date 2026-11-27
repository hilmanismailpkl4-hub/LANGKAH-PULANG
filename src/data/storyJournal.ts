import { ChapterNumber, EmotionMetrics, EndingId, SideQuestProgress, TimeOfDay } from '../types/game';

export type JournalSketchKind =
  | 'coffee'
  | 'guitar'
  | 'rain'
  | 'home'
  | 'star'
  | 'lake'
  | 'office'
  | 'photo';

export interface TimelineBranchNode {
  id: string;
  chapter: ChapterNumber;
  timeStamp: string;
  title: string;
  status: 'done' | 'current' | 'upcoming';
  chosenBranchLabel?: string;
  chosenOutcomeNote?: string;
  tone?: 'gold' | 'rose' | 'sky' | 'slate';
}

export interface TimelineEchoBadge {
  id: string;
  title: string;
  detail: string;
  tone: 'gold' | 'rose' | 'sky';
}

export interface FlashbackReelInfo {
  id: string;
  dialogueId: string;
  flag: string;
  yearLabel: string;
  title: string;
  locationLabel: string;
  epigraph: string;
  mood: 'warm_sepia' | 'rain_melancholy' | 'quiet_night';
  worldHint: string;
}

export const JOURNAL_FLASHBACK_REELS: FlashbackReelInfo[] = [
  {
    id: 'reel_2018',
    dialogueId: 'flashback_panggung_2018',
    flag: 'flashback_2018_done',
    yearLabel: '14 OKTOBER 2018',
    title: 'Senar yang Putus, Tawa yang Tinggal',
    locationLabel: 'Panggung Akustik Taman Kota · Pukul 20.10',
    epigraph: 'Malam pertama Nadia duduk di barisan depan—ketika lima senar gitar dan semangkuk mi rebus sudah terasa seperti seluruh dunia.',
    mood: 'warm_sepia',
    worldHint: 'Juga dapat dihidupkan dari Poster 2018 di Kedai Kopi Bima & Galeri HP.',
  },
  {
    id: 'reel_bridge_2019',
    dialogueId: 'flashback_jembatan_2019',
    flag: 'flashback_bridge_2019_done',
    yearLabel: '22 MEI 2019',
    title: 'Dua Gelas Teh Hangat & Gembok Kuningan',
    locationLabel: 'Jembatan Tepi Sungai · Pukul 17.35',
    epigraph: 'Sore ketika Damar melamar Nadia dengan cincin perak tipis hasil mengajar les gitar dan melempar kunci gembok "D & N — 2019" ke sungai.',
    mood: 'warm_sepia',
    worldHint: 'Juga dapat dihidupkan dari Gembok Kuningan di Jembatan Sungai, Galeri HP & Album Rumah.',
  },
  {
    id: 'reel_melati_2019',
    dialogueId: 'flashback_malam_pertama_melati',
    flag: 'flashback_melati_2019_done',
    yearLabel: '12 NOVEMBER 2019',
    title: 'Lantai Dingin & Dua Kardus Buku',
    locationLabel: 'Ruang Tamu Kosong Jl. Melati No. 14 · Pukul 21.30',
    epigraph: 'Malam pertama pindah rumah di bawah bohlam 5 watt, jendela berkoran, dan dua bungkus nasi goreng tek-tek yang dimakan pakai satu sendok plastik.',
    mood: 'warm_sepia',
    worldHint: 'Juga dapat dihidupkan dari Lantai Ruang Tamu Rumah Jl. Melati No. 14 & Galeri HP.',
  },
  {
    id: 'reel_2020',
    dialogueId: 'flashback_jual_gitar_2020',
    flag: 'flashback_2020_done',
    yearLabel: '08 AGUSTUS 2020',
    title: 'Mahoni di Bawah Hujan Agustus',
    locationLabel: 'Toko Musik "Nada Lama" · Pukul 21.40',
    epigraph: 'Malam sunyi sebelum kelahiran Kira saat Damar diam-diam menjual gitar kesayangannya—dan Mas Bagas menempelkan stiker "TITIPAN DAMAR".',
    mood: 'rain_melancholy',
    worldHint: 'Juga dapat dihidupkan dari Etalase Gitar di Nada Lama & Galeri HP.',
  },
  {
    id: 'reel_dinner',
    dialogueId: 'flashback_meja_makan_sunyi',
    flag: 'flashback_dinner_done',
    yearLabel: 'ENAM BULAN LALU',
    title: 'Sup yang Dingin Pukul Sepuluh Malam',
    locationLabel: 'Ruang Makan Jl. Melati No. 14 · Pukul 22.15',
    epigraph: 'Pertengkaran sunyi pertama tanpa bentakan—hanya mangkuk sup dingin di seberang layar laptop yang masih menyala.',
    mood: 'quiet_night',
    worldHint: 'Juga dapat dihidupkan dari Meja Makan Rumah Jl. Melati No. 14 & Album Keluarga.',
  },
];

/**
 * Memilih jenis sketsa tinta tangan kecil yang paling cocok untuk tiap catatan harian Damar.
 */
export function classifyJournalSketch(entryId: string, title: string): JournalSketchKind {
  const hay = `${entryId} ${title}`.toLowerCase();
  if (hay.includes('gitar') || hay.includes('lagu') || hay.includes('pick') || hay.includes('2018') || hay.includes('2020') || hay.includes('musik') || hay.includes('kaset') || hay.includes('pita') || hay.includes('1997') || hay.includes('akor')) {
    return 'guitar';
  }
  if (hay.includes('hujan') || hay.includes('jembatan') || hay.includes('payung') || hay.includes('pelangi')) {
    return 'rain';
  }
  if (hay.includes('kopi') || hay.includes('kedai') || hay.includes('bima') || hay.includes('serabi') || hay.includes('kuliner') || hay.includes('teh')) {
    return 'coffee';
  }
  if (hay.includes('kira') || hay.includes('bintang') || hay.includes('balon') || hay.includes('gambar') || hay.includes('krayon')) {
    return 'star';
  }
  if (hay.includes('danau') || hay.includes('kupu') || hay.includes('perahu') || hay.includes('taman') || hay.includes('burung')) {
    return 'lake';
  }
  if (hay.includes('kantor') || hay.includes('hendra') || hay.includes('kartika') || hay.includes('rooftop') || hay.includes('menara')) {
    return 'office';
  }
  if (hay.includes('1996') || hay.includes('foto') || hay.includes('arsip') || hay.includes('kilas') || hay.includes('album')) {
    return 'photo';
  }
  return 'home';
}

const STEP_ORDER: string[] = [
  'ch1_1_sarapan',
  'ch1_2_kedai_bima',
  'ch1_3_kantor_hendra',
  'ch1_4_benda_lama',
  'ch2_1_persimpangan',
  'ch2_2_hujan_jembatan',
  'ch2_3_kedai_hujan',
  'ch3_1_rooftop_malam',
  'ch3_2_kembali_ke_rumah',
];

function stepIndex(stepId: string): number {
  const idx = STEP_ORDER.indexOf(stepId);
  return idx >= 0 ? idx : 0;
}

/**
 * Menyusun Peta Cabang Cerita Bab 1–3 secara real-time berdasarkan progres & pilihan nyata pemain.
 */
export function buildStoryTimeline(params: {
  chapter: ChapterNumber;
  mainStepId: string;
  flags: string[];
  repliedPhonePrompts: Record<string, string>;
  activeEnding: EndingId | null;
}): {
  nodes: TimelineBranchNode[];
  echoBadges: TimelineEchoBadge[];
} {
  const { mainStepId, flags, repliedPhonePrompts, activeEnding } = params;
  const curIdx = activeEnding ? 99 : stepIndex(mainStepId);

  const getStatus = (targetStepId: string, doneOverride?: boolean): 'done' | 'current' | 'upcoming' => {
    if (doneOverride) return 'done';
    const tIdx = stepIndex(targetStepId);
    if (curIdx > tIdx) return 'done';
    if (curIdx === tIdx) return 'current';
    return 'upcoming';
  };

  // Bab 1.1 Sarapan
  const s1Status = getStatus('ch1_1_sarapan');
  const s1Branch =
    s1Status !== 'done'
      ? undefined
      : flags.includes('ch1_listened_kira')
        ? {
            label: 'Berhenti & Mendengarkan Gambar Kira',
            note: 'Kamu duduk sebentar memuji perahu di danau dan berjanji dengan jari kelingking.',
            tone: 'rose' as const,
          }
        : flags.includes('ch1_rushed_morning')
          ? {
              label: 'Bergegas Mengejar Jadwal Kantor',
              note: 'Kira terdiam pelan mendengar kalimat "nanti sore" yang sudah sering ia dengar.',
              tone: 'slate' as const,
            }
          : {
              label: 'Sarapan Pagi di Jl. Melati No. 14',
              note: 'Langkah hari ini dimulai dari meja makan bersama Nadia dan Kira.',
              tone: 'gold' as const,
            };

  // Bab 1.2 Kedai Bima
  const s2Status = getStatus('ch1_2_kedai_bima');
  const s2Branch =
    s2Status !== 'done'
      ? undefined
      : flags.includes('ch1_admitted_music_miss')
        ? {
            label: 'Mengakui Rindu pada Gitar & Diri Sendiri',
            note: 'Di depan Bima, kamu berani mengakui dadamu masih sesak melihat gitar di dinding.',
            tone: 'gold' as const,
          }
        : {
            label: 'Secangkir Americano Bersama Bima',
            note: 'Bima membaca kelelahan di balik senyum sopanmu sebelum berangkat ke kantor.',
            tone: 'sky' as const,
          };

  // Bab 1.3 Kantor Pak Hendra
  const s3Status = getStatus('ch1_3_kantor_hendra');
  const s3Branch =
    s3Status !== 'done'
      ? undefined
      : flags.includes('ch1_accepted_hendra_fast')
        ? {
            label: 'Langsung Menyanggupi Proyek Kartika',
            note: 'Kamu memilih kepastian finansial meski harus berhadapan dengan dua bulan lembur panjang.',
            tone: 'slate' as const,
          }
        : {
            label: 'Meminta Waktu Berdiskusi dengan Nadia',
            note: 'Kamu menghormati pasangan sebelum mengambil keputusan besar yang menyangkut rumah.',
            tone: 'rose' as const,
          };

  // Bab 1.4 Nada Lama
  const s4Status = getStatus('ch1_4_benda_lama', flags.includes('kept_guitar_pick'));
  const s4Branch =
    s4Status !== 'done'
      ? undefined
      : {
          label: 'Menemukan Pick Gitar "DP" di Nada Lama',
          note: 'Benda sekecil kepingan plastik itu membuka kembali retakan sunyi enam tahun terakhir.',
          tone: 'gold' as const,
        };

  // Bab 2.1 Persimpangan Pak Hendra
  const s5Status = getStatus('ch2_1_persimpangan');
  const s5Branch =
    s5Status !== 'done'
      ? undefined
      : flags.includes('ch2_stood_up_for_family')
        ? {
            label: 'Menetapkan Batas Demi Janji pada Kira',
            note: 'Kamu menolak lembur malam itu demi menepati janji kecil seorang ayah.',
            tone: 'rose' as const,
          }
        : flags.includes('ch2_honest_with_hendra')
          ? {
              label: 'Berbicara Jujur Sebagai Sesama Ayah',
              note: 'Kejujuranmu meluluhkan Pak Hendra hingga ia teringat anaknya sendiri yang sudah jauh.',
              tone: 'gold' as const,
            }
          : flags.includes('ch2_chose_overtime')
            ? {
                label: 'Memilih Lembur Proyek Kartika',
                note: 'Kamu kembali menunda waktu pulang demi mengejar tanda tangan kontrak klien.',
                tone: 'slate' as const,
              }
            : {
                label: 'Melewati Persimpangan Menara Nusantara',
                note: 'Hujan pertama turun tepat saat kamu melangkah keluar dari lobi kaca.',
                tone: 'sky' as const,
              };

  // Bab 2.2 Jembatan Hujan
  const s6Status = getStatus('ch2_2_hujan_jembatan');
  const s6Branch =
    s6Status !== 'done'
      ? undefined
      : flags.includes('reconciled_dinner_memory_chat')
        ? {
            label: 'Telepon Hujan — Diiringi Pesan Maafmu',
            note: 'Nadia masih mengingat pesan tulusmu soal meja makan, membuat obrolan di tengah hujan lebih jujur.',
            tone: 'rose' as const,
          }
        : {
            label: 'Suara Bergetar Nadia di Tengah Hujan',
            note: 'Di atas Jembatan Sungai, Nadia akhirnya mengaku lelah merasa sendirian di rumah sendiri.',
            tone: 'sky' as const,
          };

  // Bab 2.3 Kedai Hujan Bima
  const s7Status = getStatus('ch2_3_kedai_hujan');
  const s7Branch =
    s7Status !== 'done'
      ? undefined
      : {
          label: 'Pertanyaan Paling Jujur dari Bima',
          note: 'Di balik uap cokelat panas, Bima bertanya apakah kesibukan hanyalah tempatmu bersembunyi.',
          tone: 'gold' as const,
        };

  // Bab 3.1 Rooftop Malam
  const s8Status = getStatus('ch3_1_rooftop_malam', flags.includes('ch3_rooftop_done'));
  const s8Branch =
    s8Status !== 'done'
      ? undefined
      : {
          label: 'Menatap Lampu Kuning di Selatan Kota',
          note: 'Dari ketinggian Menara Nusantara, satu jendela hangat di Jl. Melati memanggilmu pulang.',
          tone: 'gold' as const,
        };

  // Bab 3.2 Meja Makan Klimaks
  const finaleDone =
    Boolean(activeEnding) ||
    flags.includes('ch3_chose_honest_home') ||
    flags.includes('ch3_chose_balance') ||
    flags.includes('ch3_chose_escape_work');
  const s9Status = getStatus('ch3_2_kembali_ke_rumah', finaleDone);
  const s9Branch =
    s9Status !== 'done'
      ? undefined
      : flags.includes('ch3_unfolded_draft_at_table')
        ? {
            label: 'Membuka Kertas Laci Pukul 02.14 di Depan Nadia',
            note: 'Tak ada lagi laci yang dikunci—Nadia memeluk kejujuranmu dan berjanji menghadapi malam berat berdua.',
            tone: 'sky' as const,
          }
        : flags.includes('ch3_shared_father_tape_finale')
        ? {
            label: 'Meletakkan Tas & Kaset Bapak 1997 di Meja Makan',
            note: 'Pesan almarhum Bapak dari tahun 1997 meruntuhkan topeng kuatmu—Nadia menyambutmu pulang dengan air mata lega.',
            tone: 'gold' as const,
          }
        : flags.includes('ch3_confessed_guitar_2020')
        ? {
            label: 'Pengakuan Rahasia Gitar Agustus 2020',
            note: 'Kamu meruntuhkan tembok enam tahun—dan Nadia mengaku ia selalu duduk di barisan depan.',
            tone: 'gold' as const,
          }
        : flags.includes('ch3_chose_honest_home')
          ? {
              label: 'Membuka Hati Seutuhnya di Meja Makan',
              note: 'Air mata dan kejujuran penuh akhirnya menyembuhkan jarak di antara kalian.',
              tone: 'rose' as const,
            }
          : flags.includes('ch3_chose_balance')
            ? {
                label: 'Memilih Keseimbangan Baru Perlahan',
                note: 'Kamu berjanji menata ulang batas kerja dan tidak membiarkan meja makan dingin lagi.',
                tone: 'sky' as const,
              }
            : {
                label: 'Memilih Lari ke Dalam Proyek Kartika',
                note: 'Meja makan kembali hening—sementara notifikasi email kantor terus menyala.',
                tone: 'slate' as const,
              };

  const nodes: TimelineBranchNode[] = [
    {
      id: 'tl_1_1',
      chapter: 1,
      timeStamp: 'Bab 1 · 07:10',
      title: 'Pagi di Meja Makan Jl. Melati',
      status: s1Status,
      chosenBranchLabel: s1Branch?.label,
      chosenOutcomeNote: s1Branch?.note,
      tone: s1Branch?.tone,
    },
    {
      id: 'tl_1_2',
      chapter: 1,
      timeStamp: 'Bab 1 · 07:55',
      title: 'Singgah di Kedai Kopi Sudut',
      status: s2Status,
      chosenBranchLabel: s2Branch?.label,
      chosenOutcomeNote: s2Branch?.note,
      tone: s2Branch?.tone,
    },
    {
      id: 'tl_1_3',
      chapter: 1,
      timeStamp: 'Bab 1 · 08:30',
      title: 'Tawaran Proyek Kartika',
      status: s3Status,
      chosenBranchLabel: s3Branch?.label,
      chosenOutcomeNote: s3Branch?.note,
      tone: s3Branch?.tone,
    },
    {
      id: 'tl_1_4',
      chapter: 1,
      timeStamp: 'Bab 1 · 11:45',
      title: 'Etalase Toko Musik "Nada Lama"',
      status: s4Status,
      chosenBranchLabel: s4Branch?.label,
      chosenOutcomeNote: s4Branch?.note,
      tone: s4Branch?.tone,
    },
    {
      id: 'tl_2_1',
      chapter: 2,
      timeStamp: 'Bab 2 · 17:15',
      title: 'Persimpangan Menjelang Senja',
      status: s5Status,
      chosenBranchLabel: s5Branch?.label,
      chosenOutcomeNote: s5Branch?.note,
      tone: s5Branch?.tone,
    },
    {
      id: 'tl_2_2',
      chapter: 2,
      timeStamp: 'Bab 2 · 17:50',
      title: 'Telepon Hujan di Jembatan Sungai',
      status: s6Status,
      chosenBranchLabel: s6Branch?.label,
      chosenOutcomeNote: s6Branch?.note,
      tone: s6Branch?.tone,
    },
    {
      id: 'tl_2_3',
      chapter: 2,
      timeStamp: 'Bab 2 · 18:35',
      title: 'Berteduh di Kedai Bima',
      status: s7Status,
      chosenBranchLabel: s7Branch?.label,
      chosenOutcomeNote: s7Branch?.note,
      tone: s7Branch?.tone,
    },
    {
      id: 'tl_3_1',
      chapter: 3,
      timeStamp: 'Bab 3 · 20:15',
      title: 'Lampu Kota dari Rooftop',
      status: s8Status,
      chosenBranchLabel: s8Branch?.label,
      chosenOutcomeNote: s8Branch?.note,
      tone: s8Branch?.tone,
    },
    {
      id: 'tl_3_2',
      chapter: 3,
      timeStamp: 'Bab 3 · 21:00',
      title: 'Langkah Pulang di Meja Makan',
      status: s9Status,
      chosenBranchLabel: s9Branch?.label,
      chosenOutcomeNote: s9Branch?.note,
      tone: s9Branch?.tone,
    },
  ];

  // Cabang Gema Sampingan yang Aktif Memengaruhi Dialog Karakter!
  const echoBadges: TimelineEchoBadge[] = [];
  if (flags.includes('prologue_dream_voice')) {
    echoBadges.push({
      id: 'eb_pr_voice',
      title: 'Mimpi 05.45 · Merindukan Suara Sendiri',
      detail: 'Sejak sebelum subuh, hatimu memilih menyelamatkan lagu yang sempat terputus di tengah rutinitas.',
      tone: 'gold',
    });
  } else if (flags.includes('prologue_dream_home')) {
    echoBadges.push({
      id: 'eb_pr_home',
      title: 'Mimpi 05.45 · Perahu Kertas di Ambang Pintu',
      detail: 'Sejak mimpi subuh, ketakutan terbesarmu adalah menjadi orang asing bagi Nadia dan Kira.',
      tone: 'rose',
    });
  } else if (flags.includes('prologue_dream_duty')) {
    echoBadges.push({
      id: 'eb_pr_duty',
      title: 'Mimpi 05.45 · Beban Penjaga Atap',
      detail: 'Mimpi subuh mencatat betapa lama kamu memikul ketakutan seorang diri demi menjaga rumah tetap berdiri.',
      tone: 'sky',
    });
  }
  if (flags.includes('reconciled_dinner_memory_chat')) {
    echoBadges.push({
      id: 'eb_chat_apology',
      title: 'Pesan Maaf Meja Makan Terkirim',
      detail: 'Nadia menyimpan pesan maafmu dan menyinggungnya di telepon hujan & meja makan malam ini.',
      tone: 'rose',
    });
  }
  if (flags.includes('flashback_bridge_2019_done')) {
    echoBadges.push({
      id: 'eb_fb_bridge_2019',
      title: 'Janji Gembok Kuningan 22 Mei 2019',
      detail: 'Membuka opsi menyentuh gembok "D & N — 2019" saat Telepon Hujan Bab 2 di Jembatan Sungai serta obrolan Nadia.',
      tone: 'gold',
    });
  }
  if (flags.includes('flashback_melati_2019_done')) {
    echoBadges.push({
      id: 'eb_fb2019',
      title: 'Janji Lantai Kosong 12 November 2019',
      detail: 'Mengingatkan Nadia pada malam nasi goreng satu sendok plastik & janji meja makan kayu empat kursi.',
      tone: 'rose',
    });
  }
  if (flags.includes('flashback_2020_done')) {
    echoBadges.push({
      id: 'eb_fb2020',
      title: 'Rahasia Gitar Agustus 2020 Hidup Kembali',
      detail: 'Membuka opsi pengakuan rahasia terdalam di klimaks Bab 3 & dialog baru Mas Bagas/Bima.',
      tone: 'gold',
    });
  }
  if (flags.includes('heard_bang_ari_2018_story')) {
    echoBadges.push({
      id: 'eb_bang_ari_2018',
      title: 'Karcis Laminasi 14 Okt 2018 · Peron Bang Ari',
      detail: 'Musik lima senarmu enam tahun silam ternyata menyelamatkan hidup Bang Ari yang kini menemani para pekerja pulang.',
      tone: 'gold',
    });
  }
  if (flags.includes('heard_mas_raka_skates_story')) {
    echoBadges.push({
      id: 'eb_mas_raka_skates',
      title: 'Janji Minggu Pagi · Mas Raka & Sepatu Roda Dinda',
      detail: flags.includes('raka_sunday_park_pact')
        ? 'Berjabat tangan dengan Mas Raka untuk membawa Kira dan Dinda bermain di Taman Kota tanpa lembur akhir pekan.'
        : 'Kisah sepatu roda di ransel kerja Mas Raka mencerminkan perjuangan dua ayah menjaga waktu keluarga.',
      tone: 'sky',
    });
  }
  if (flags.includes('heard_bu_wati_rahmat_story')) {
    echoBadges.push({
      id: 'eb_bu_wati_rahmat',
      title: 'Kursi Rotan & Lampu Teras Bu Wati',
      detail: 'Kisah malam terakhir almarhum Pak Rahmat mengingatkanmu untuk tidak menyia-nyiakan lampu teras Jl. Melati No. 14.',
      tone: 'gold',
    });
  }
  if (flags.includes('heard_nenek_sari_rantang')) {
    echoBadges.push({
      id: 'eb_nenek_sari_rantang',
      title: 'Rantang Empat Susun Nenek Sari (Danau Senja)',
      detail: flags.includes('helped_sari_voice_note')
        ? 'Pesan suara yang kamu bantu rekam meluluhkan hati putra Nenek Sari hingga berbuah kabar kepulangan di Epilog.'
        : 'Menemani Nenek Sari di bangku danau agar semur hari Kamisnya tidak dingin sia-sia.',
      tone: 'gold',
    });
  }
  if (flags.includes('opened_mother_sewing_tin_2016')) {
    echoBadges.push({
      id: 'eb_mother_sewing_tin_2016',
      title: 'Kaleng Jahit Biru & Surat Ibu (03 Sep 2016)',
      detail: flags.includes('shared_mother_letter_with_nadia')
        ? 'Surat dan kancing kebaya almarhumah Ibu telah dibacakan bersama Nadia dan bergema di Meja Makan Bab 3.'
        : 'Surat 2016 Ibu tersimpan di Tas [I]—dekati Nadia untuk membacakannya berdua.',
      tone: 'sky',
    });
  }
  if (flags.includes('found_kira_secret_drawings')) {
    echoBadges.push({
      id: 'eb_kira_secret_drawings',
      title: 'Tiga Gambar Rahasia di Bawah Bantal Kira',
      detail: 'Membuka bait spesial di Dongeng Malam Bab 3, dialog pelukan Kira sebelum tidur, dan kejutan kulkas di Epilog.',
      tone: 'rose',
    });
  }
  if (flags.includes('heard_bagas_rama_story')) {
    echoBadges.push({
      id: 'eb_bagas_rama_2014',
      title: 'Busur Cello Rama 2014 · Sumpah Mas Bagas',
      detail: flags.includes('dedicated_song_to_rama')
        ? 'Dedikasi lagumu untuk almarhum adik Mas Bagas bergema di pengakuan gitar Bab 3 dan Epilog Nada Lama.'
        : 'Menyingkap alasan Mas Bagas menjaga koper gitar mahoni "TITIPAN DAMAR" selama enam tahun.',
      tone: 'gold',
    });
  }
  if (flags.includes('found_midnight_draft')) {
    echoBadges.push({
      id: 'eb_midnight_draft',
      title: 'Draf Pukul 02.14 di Laci Meja Kerja',
      detail: flags.includes('rewrote_midnight_draft')
        ? 'Surat pelarian sebelas bulan lalu ditulis ulang dengan pena biru menjadi janji batas kerja sehat & membuka opsi di Bab 3 + Epilog.'
        : 'Membuka opsi pengakuan tanpa rahasia di Meja Makan Bab 3 serta obrolan jujur bersama Nadia.',
      tone: 'sky',
    });
  }
  if (flags.includes('read_nadia_diary_2020')) {
    echoBadges.push({
      id: 'eb_nadia_diary_2020',
      title: 'Buku Harian Kehamilan Nadia (2020)',
      detail: flags.includes('wrote_reply_in_nadia_diary')
        ? 'Balasan tulisan tanganmu di bawah doa subuh RS Harapan 2020 dikenang Nadia di Meja Makan Bab 3 & Epilog Pagi.'
        : 'Membuka sudut pandang batin Nadia selama sembilan bulan mengandung Kira hingga malam hujan Agustus 2020.',
      tone: 'rose',
    });
  }
  if (flags.includes('played_father_cassette_1997')) {
    echoBadges.push({
      id: 'eb_father_tape_1997',
      title: 'Pita Kaset Almarhum Bapak (16 Nov 1997)',
      detail: 'Suara Bapak di Radio Dapur membuka cabang pengakuan lintas generasi di Meja Makan Bab 3, rooftop malam, dan Pesan Suara HP.',
      tone: 'gold',
    });
  } else if (flags.includes('has_father_cassette_1997')) {
    echoBadges.push({
      id: 'eb_father_tape_held',
      title: 'Kaset C-60 Bapak Tersimpan di Tas',
      detail: 'Putar kaset titipan Pak Darman di Radio Kayu Dapur Rumah Jl. Melati No. 14 untuk mendengar ujung pitanya.',
      tone: 'gold',
    });
  }
  if (flags.includes('remembered_father_1996')) {
    echoBadges.push({
      id: 'eb_1996',
      title: 'Foto Sepia Kota 1996 (Almarhum Bapak)',
      detail: 'Gema kenangan Bapak muncul di persimpangan kantor, rooftop malam, dan pesan Nadia.',
      tone: 'gold',
    });
  }
  if (flags.includes('ch3_bima_night_talk_done')) {
    echoBadges.push({
      id: 'eb_bima_night_25',
      title: 'Kursi Terbalik Kopi Sudut · Umur Dua Puluh Lima',
      detail: flags.includes('bima_sang_bridge_together')
        ? 'Menyanyikan kembali harmoni suara dua bersama Bima setelah tahu ia menolak kontrak solo 2021 demi menjaga tempatmu.'
        : 'Bima membuka rahasia enam tahun tentang gitar yang ia gantung di sudut kedai untuk menunggumu kembali bernapas.',
      tone: 'gold',
    });
  }
  if (flags.includes('ch3_hendra_night_talk_done')) {
    echoBadges.push({
      id: 'eb_hendra_night_talk',
      title: 'Empat Mata Malam · Ayah yang Terlambat Pulang',
      detail: flags.includes('hendra_encouraged_call_naya')
        ? 'Kamu mendorong Pak Hendra menelepon Naya di Melbourne dan menerima restunya merombak lembur Proyek Kartika.'
        : 'Pengakuan Pak Hendra tentang kesepian ruangan lantai 18 menemani langkahmu menuju meja makan Bab 3.',
      tone: 'sky',
    });
  }
  if (flags.includes('ch3_told_kira_bedtime_story')) {
    echoBadges.push({
      id: 'eb_kira_bedtime',
      title: 'Dongeng Nakhoda Perahu Kertas (Bab 3)',
      detail: 'Nadia mendengarkan dongeng pengantar tidurmu untuk Kira dari ambang pintu sebelum kalian bicara di meja makan.',
      tone: 'rose',
    });
  }
  if (flags.includes('drew_with_kira_corner') || flags.includes('gave_gift_kira')) {
    echoBadges.push({
      id: 'eb_kira',
      title: 'Perhatian Kecil untuk Kira',
      detail: 'Kira akan menceritakan momen bintang kuning / cat air birumu tepat sebelum memelukmu di Bab 3.',
      tone: 'rose',
    });
  }
  if (
    repliedPhonePrompts.prompt_hendra_ch2 === 'rep_ph2_firm' ||
    repliedPhonePrompts.prompt_hendra_ch1 === 'rep_ph1_honest'
  ) {
    echoBadges.push({
      id: 'eb_hendra_chat',
      title: 'Keterbukaan Chat dengan Pak Hendra',
      detail: 'Pak Hendra menghormati pesan terbukamu dan tidak lagi memaksakan lembur sepihak.',
      tone: 'sky',
    });
  }

  return { nodes, echoBadges };
}

/**
 * Menghasilkan catatan refleksi batin dinamis Damar yang berubah seiring waktu & keseimbangan emosi.
 */
export function getJournalMoodNote(params: {
  chapter: ChapterNumber;
  timeOfDay: TimeOfDay;
  emotions: EmotionMetrics;
  sideQuests: Record<string, SideQuestProgress>;
  flags: string[];
}): { phaseLabel: string; headline: string; body: string } {
  const { chapter, timeOfDay, emotions, sideQuests, flags } = params;
  const completedSide = Object.values(sideQuests).filter((q) => q.status === 'completed').length;
  const warmth = emotions.kejujuranDiri + emotions.kehadiranKeluarga;

  const phaseLabel =
    timeOfDay === 'morning'
      ? `Bab ${chapter} · Pagi Hari`
      : timeOfDay === 'sunset'
        ? `Bab ${chapter} · Menjelang Senja`
        : timeOfDay === 'rain_dusk'
          ? `Bab ${chapter} · Sore Berhujan`
          : `Bab ${chapter} · Malam Tenang`;

  if (emotions.ambisiPelarian >= 5 && emotions.ambisiPelarian > warmth - 2) {
    return {
      phaseLabel,
      headline: 'Bahu yang Masih Tegang oleh Target',
      body: 'Kepalaku penuh oleh angka, jadwal revisi, dan ketakutan tertinggal. Setiap kali aku memilih sibuk, ada satu suara kecil di rumah yang makin pelan memanggilku.',
    };
  }

  if (flags.includes('played_father_cassette_1997')) {
    return {
      phaseLabel,
      headline: 'Suara dari Tahun 1997 yang Menuntun Pulang',
      body: 'Sejak mendengar bisikan almarhum Bapak di ujung pita C-60 bahwa rumah adalah tempat meletakkan tas, langkahku tidak lagi diburu rasa takut harus selalu terlihat kuat sendirian.',
    };
  }

  if (flags.includes('flashback_2020_done') && flags.includes('flashback_2018_done')) {
    return {
      phaseLabel,
      headline: 'Nada Lama yang Mulai Menemukan Pulangnya',
      body: 'Menghidupkan kembali panggung 2018 dan hujan Agustus 2020 membuatku sadar: bagian diriku yang bisa bernyanyi tidak pernah mati—ia hanya menunggu aku berani jujur pada Nadia dan Kira.',
    };
  }

  if (warmth >= 10 || completedSide >= 3) {
    return {
      phaseLabel,
      headline: 'Langkah yang Makin Ringan dan Jujur',
      body: 'Hari ini aku mulai berhenti berlari. Mendengar cerita Nadia, Kira, sahabat lama, dan warga kota pelan-pelan mengembalikanku pada satu keyakinan: rumah selalu layak didatangi dengan hati yang utuh.',
    };
  }

  return {
    phaseLabel,
    headline: 'Di Antara Rutinitas dan Rasa Rindu',
    body: 'Kota ini terus bergerak cepat, tapi di sela-sela trotoar, aroma kopi, dan pesan singkat dari rumah, selalu ada alasan kecil untuk berhenti sejenak dan menanyakan kabar hatiku sendiri.',
  };
}
