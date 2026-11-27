import {
  CharacterId,
  DialogueScript,
  EmotionMetrics,
  EndingId,
  SideQuestProgress,
} from '../types/game';

/**
 * Dialog dinamis NPC utama yang bereaksi langsung terhadap pilihan cerita,
 * balasan pesan HP, kilas balik memori, dan perhatian kecil Damar di kota.
 */
export const CHARACTER_ECHO_DIALOGUES: Record<string, DialogueScript> = {
  // === NADIA ===
  echo_nadia_diary_2020: {
    id: 'echo_nadia_diary_2020',
    startNodeId: 'en_d20_1',
    nodes: {
      en_d20_1: {
        id: 'en_d20_1',
        speaker: 'nadia',
        emotion: 'haru',
        echoTag: 'Ingatan Nadia · Buku Harian Kehamilan 2020',
        text: 'Mas... aku seneng akhirnya kamu baca buku kain bunga tahun 2020 itu. Dari dulu waktu kamu belum punya jabatan apa-apa pun, hatiku sudah penuh cuma dengan duduk di sebelahmu.',
      },
    },
  },
  echo_nadia_dinner_apology: {
    id: 'echo_nadia_dinner_apology',
    startNodeId: 'en_da_1',
    nodes: {
      en_da_1: {
        id: 'en_da_1',
        speaker: 'nadia',
        emotion: 'haru',
        echoTag: 'Ingatan Nadia · Pesan Maaf Meja Makan',
        text: 'Mas... aku baca pesan maafmu soal malam enam bulan lalu itu berkali-kali di dapur. Makasih ya sudah nggak pura-pura lupa lagi. Hari ini rumah rasanya jauh lebih hangat.',
        nextNodeId: 'en_da_2',
      },
      en_da_2: {
        id: 'en_da_2',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Aku yang seharusnya minta maaf dari dulu, Nad. Mulai hari ini, kalau aku capek atau takut, aku janji bakal cerita—bukan malah nutup diri di belakang layar laptop.',
      },
    },
  },
  echo_nadia_father_tape_1997: {
    id: 'echo_nadia_father_tape_1997',
    startNodeId: 'en_ft97_1',
    nodes: {
      en_ft97_1: {
        id: 'en_ft97_1',
        speaker: 'nadia',
        emotion: 'haru',
        echoTag: 'Ingatan Nadia · Pita Kaset Bapak 1997',
        text: 'Mas... kalimat almarhum Bapak di kaset radio dapur tadi nggak hilang-hilang dari kepalaku. Kapan pun pundakmu pegal, ingat ya: di rumah ini kamu nggak pernah dituntut kelihatan tak terkalahkan.',
        nextNodeId: 'en_ft97_2',
      },
      en_ft97_2: {
        id: 'en_ft97_2',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Makasih ya, Nad. Mendengar suara Bapak hari ini—dan melihat kamu menerimaku apa adanya—rasanya seperti menyembuhkan dua masa sekaligus.',
      },
    },
  },
  echo_nadia_father_1996: {
    id: 'echo_nadia_father_1996',
    startNodeId: 'en_f96_1',
    nodes: {
      en_f96_1: {
        id: 'en_f96_1',
        speaker: 'nadia',
        emotion: 'hangat',
        echoTag: 'Ingatan Nadia · Foto Arsip Kota 1996',
        text: 'Mas, kalau nanti malam sudah santai, cerita tentang almarhum Bapak waktu kamu kecil ya. Kamu nggak harus selalu kelihatan kuat di depanku—aku kan tempat kamu pulang.',
      },
    },
  },
  echo_nadia_butterflies: {
    id: 'echo_nadia_butterflies',
    startNodeId: 'en_bf_1',
    nodes: {
      en_bf_1: {
        id: 'en_bf_1',
        speaker: 'nadia',
        emotion: 'ceria',
        echoTag: 'Ingatan Nadia · Janji Taman Kupu-Kupu',
        text: 'Kira udah milih baju kuning buat besok pagi gara-gara dengar janji kamu mau ajak lihat taman kupu-kupu di Danau Senja lho, Mas. Seneng banget lihat kamu bikin janji sambil senyum lagi.',
      },
    },
  },
  echo_nadia_stood_up: {
    id: 'echo_nadia_stood_up',
    startNodeId: 'en_su_1',
    nodes: {
      en_su_1: {
        id: 'en_su_1',
        speaker: 'nadia',
        emotion: 'haru',
        echoTag: 'Ingatan Nadia · Keputusan di Menara Nusantara',
        text: 'Entah kenapa bahu kamu kelihatan lebih ringan hari ini, Mas. Aku tahu nggak gampang bicara jujur ke Pak Hendra... makasih sudah memilih pulang buat kami.',
      },
    },
  },
  echo_nadia_overtime_worry: {
    id: 'echo_nadia_overtime_worry',
    startNodeId: 'en_ow_1',
    nodes: {
      en_ow_1: {
        id: 'en_ow_1',
        speaker: 'nadia',
        emotion: 'sedih',
        echoTag: 'Ingatan Nadia · Jadwal Lembur Proyek Kartika',
        text: 'Kamu kelihatan capek sekali, Mas... Kalau memang Proyek Kartika bikin kamu lembur lagi, jangan lupa makan ya. Aku cuma berharap suatu hari kamu berani bilang "cukup" sebelum tubuhmu yang memaksa.',
      },
    },
  },
  echo_nadia_jasmine_gift: {
    id: 'echo_nadia_jasmine_gift',
    startNodeId: 'en_jg_1',
    nodes: {
      en_jg_1: {
        id: 'en_jg_1',
        speaker: 'nadia',
        emotion: 'hangat',
        echoTag: 'Ingatan Nadia · Melati Putih dari Damar',
        text: 'Bunga melati yang kamu bawa tadi udah kutaruh di vas meja makan, Mas. Wanginya bikin satu ruang tamu serasa baru disiram hujan pagi.',
      },
    },
  },

  // === KIRA ===
  echo_kira_secret_drawings: {
    id: 'echo_kira_secret_drawings',
    startNodeId: 'ek_sk_1',
    nodes: {
      ek_sk_1: {
        id: 'ek_sk_1',
        speaker: 'kira',
        emotion: 'ceria',
        echoTag: 'Ingatan Kira · Tiga Gambar di Bawah Bantal',
        text: 'Hehe, Ayah udah tahu rahasia bawah bantal Kira! Nanti kalau Ayah main gitar, Kira mau duduk paling dekat biar kelihatan pelangi enam senarnya!',
      },
    },
  },
  echo_kira_star_drawing: {
    id: 'echo_kira_star_drawing',
    startNodeId: 'ek_sd_1',
    nodes: {
      ek_sd_1: {
        id: 'ek_sd_1',
        speaker: 'kira',
        emotion: 'ceria',
        echoTag: 'Ingatan Kira · Bintang Kuning di Meja Gambar',
        text: 'Ayaaah!! Kira lihat bintang kuning yang Ayah gambar di buku Kira!! Bentuknya agak miring kayak bintang laut, tapi Kira sukaaa banget! Nanti Kira warnain langitnya bareng Ayah ya!',
      },
    },
  },
  echo_kira_balloon: {
    id: 'echo_kira_balloon',
    startNodeId: 'ek_bl_1',
    nodes: {
      ek_bl_1: {
        id: 'ek_bl_1',
        speaker: 'kira',
        emotion: 'ceria',
        echoTag: 'Ingatan Kira · Balon Gas dari Taman',
        text: 'Hehe, balon gas dari Ayah masih melayang tinggi banget! Kata Kira itu namanya balon matahari biar Ayah nggak pernah kehilangan jalan pulang!',
      },
    },
  },
  echo_kira_watercolor: {
    id: 'echo_kira_watercolor',
    startNodeId: 'ek_wc_1',
    nodes: {
      ek_wc_1: {
        id: 'ek_wc_1',
        speaker: 'kira',
        emotion: 'ceria',
        echoTag: 'Ingatan Kira · Cat Air Biru',
        text: 'Ayah, cat air birunya bagus banget waktu dipakai bikin Danau Senja! Kali ini Kira gambar tangan Ayah lagi pegang tangan Kira, bukan pegang HP lagi!',
      },
    },
  },
  echo_kira_paper_boat: {
    id: 'echo_kira_paper_boat',
    startNodeId: 'ek_pb_1',
    nodes: {
      ek_pb_1: {
        id: 'ek_pb_1',
        speaker: 'kira',
        emotion: 'hangat',
        echoTag: 'Ingatan Kira · Perahu Kertas Danau Senja',
        text: 'Ayah, menurut Ayah perahu kertas kita di danau tadi sudah berlayar sampai mana ya? Kira titip doa supaya Ayah sama Bunda selalu ketawa bareng!',
      },
    },
  },

  // === BIMA ===
  echo_bima_after_night_talk: {
    id: 'echo_bima_after_night_talk',
    startNodeId: 'eb_nt_1',
    nodes: {
      eb_nt_1: {
        id: 'eb_nt_1',
        speaker: 'bima',
        emotion: 'hangat',
        echoTag: 'Ingatan Bima · Lagu Umur Dua Puluh Lima',
        text: 'Udah malem, Mar—sana pulang ke Nadia sama Kira dulu! Kursi panggung pojok di Kopi Sudut ini udah gue jagain enam tahun, nggak bakal lari sampai Sabtu sore.',
      },
    },
  },
  echo_bima_flashback_2018: {
    id: 'echo_bima_flashback_2018',
    startNodeId: 'eb_18_1',
    nodes: {
      eb_18_1: {
        id: 'eb_18_1',
        speaker: 'bima',
        emotion: 'ceria',
        echoTag: 'Ingatan Bima · Panggung Taman Kota 2018',
        text: 'Hahaha, masih kebayang muka lo tahun 2018 pas senar satu putus, Mar! Eh tapi serius—waktu Nadia tepuk tangan di baris depan itu, gue langsung tahu lo bakal pulang ke dia seumur hidup.',
      },
    },
  },
  echo_bima_stood_up: {
    id: 'echo_bima_stood_up',
    startNodeId: 'eb_su_1',
    nodes: {
      eb_su_1: {
        id: 'eb_su_1',
        speaker: 'bima',
        emotion: 'hangat',
        echoTag: 'Ingatan Bima · Batas Sehat di Kantor',
        text: 'Gue denger lo berani bicara jujur sama Pak Hendra sore ini, Mar. Salut! Kopi berikutnya traktiran gue—orang yang berani pulang tepat waktu layak dirayakan.',
      },
    },
  },
  echo_bima_overtime: {
    id: 'echo_bima_overtime',
    startNodeId: 'eb_ov_1',
    nodes: {
      eb_ov_1: {
        id: 'eb_ov_1',
        speaker: 'bima',
        emotion: 'sedih',
        echoTag: 'Ingatan Bima · Lembur Proyek Kartika',
        text: 'Lo ambil lembur lagi buat Pak Hendra, Mar? Gue nggak bakal ceramahin lo... cuma ingat, gitar di pojok kedai gue masih lebih sering lo tinggalin daripada kopi dingin lo.',
      },
    },
  },

  // === PAK HENDRA ===
  echo_hendra_after_night_talk: {
    id: 'echo_hendra_after_night_talk',
    startNodeId: 'eh_nt_1',
    nodes: {
      eh_nt_1: {
        id: 'eh_nt_1',
        speaker: 'pak_hendra',
        emotion: 'hangat',
        echoTag: 'Ingatan Pak Hendra · Empat Mata di Jendela Malam',
        text: 'Pulanglah sekarang, Damar. Terima kasih sudah menemani orang tua ini mengobrol jujur di dekat jendela tadi—jangan biarkan lampu ruang makan di rumahmu menunggu lebih lama lagi.',
      },
    },
  },
  echo_hendra_honest: {
    id: 'echo_hendra_honest',
    startNodeId: 'eh_ho_1',
    nodes: {
      eh_ho_1: {
        id: 'eh_ho_1',
        speaker: 'pak_hendra',
        emotion: 'tenang',
        echoTag: 'Ingatan Pak Hendra · Kejujuran Sebagai Ayah',
        text: 'Damar... setelah kamu jujur tadi sore, saya sempat menelepon anak saya yang kuliah di luar negeri. Aneh ya, ternyata kita butuh diingatkan oleh orang yang lebih muda untuk tahu apa yang paling berharga.',
      },
    },
  },
  echo_hendra_family_bound: {
    id: 'echo_hendra_family_bound',
    startNodeId: 'eh_fb_1',
    nodes: {
      eh_fb_1: {
        id: 'eh_fb_1',
        speaker: 'pak_hendra',
        emotion: 'hangat',
        echoTag: 'Ingatan Pak Hendra · Janji pada Kira',
        text: 'Menepati janji kecil pada anak enam tahun kadang jauh lebih sulit daripada menandatangani kontrak miliaran, Damar. Saya menghormati sikapmu hari ini.',
      },
    },
  },
  echo_hendra_overtime: {
    id: 'echo_hendra_overtime',
    startNodeId: 'eh_ov_1',
    nodes: {
      eh_ov_1: {
        id: 'eh_ov_1',
        speaker: 'pak_hendra',
        emotion: 'ragu',
        echoTag: 'Ingatan Pak Hendra · Lembur Proyek Kartika',
        text: 'Kinerjamu memang tak diragukan, Damar. Tapi lingkaran hitam di matamu mulai kelihatan jelas. Pastikan istrimu di rumah baik-baik saja dengan ritme kerja seperti ini, ya.',
      },
    },
  },

  // === MAS BAGAS ===
  echo_bagas_rama_2014: {
    id: 'echo_bagas_rama_2014',
    startNodeId: 'ebg_r14_1',
    nodes: {
      ebg_r14_1: {
        id: 'ebg_r14_1',
        speaker: 'mas_bagas',
        emotion: 'haru',
        echoTag: 'Ingatan Mas Bagas · Busur Cello Rama (2014)',
        text: 'Terima kasih sudah mau mendengarkan cerita almarhum Rama tadi, Mar. Koper gitar mahonimu di sebelah busur cello itu siap kapan pun kamu dan Nadia datang menjemputnya pulang.',
      },
    },
  },
  echo_bagas_2020_guitar: {
    id: 'echo_bagas_2020_guitar',
    startNodeId: 'ebg_20_1',
    nodes: {
      ebg_20_1: {
        id: 'ebg_20_1',
        speaker: 'mas_bagas',
        emotion: 'haru',
        echoTag: 'Ingatan Mas Bagas · Malam Hujan 08 Agustus 2020',
        text: 'Gitar mahoni kamu sudah kustem ulang pagi ini, Mar. Stiker "TITIPAN DAMAR" dari malam hujan Agustus 2020 itu nggak pernah kucopot. Kapan pun kamu siap memainkannya lagi untuk Kira dan Nadia, bawalah pulang.',
      },
    },
  },

  // === NADIA (MALAM PERTAMA 2019) ===
  echo_nadia_melati_2019: {
    id: 'echo_nadia_melati_2019',
    startNodeId: 'end_19_1',
    nodes: {
      end_19_1: {
        id: 'end_19_1',
        speaker: 'nadia',
        emotion: 'hangat',
        echoTag: 'Ingatan Nadia · Malam Pertama Jl. Melati 2019',
        text: 'Lucu ya, Mas... dulu di lantai ruang tamu ini kita cuma punya satu bohlam kuning sama satu sendok plastik buat makan berdua, tapi rasanya hangat banget. Jangan pernah nanggung takut sendirian lagi ya.',
      },
    },
  },
};

/**
 * Memilih dialog obrolan dinamis terbaik berdasarkan ingatan & jejak pilihan pemain.
 */
export function resolveDynamicNpcAmbient(
  npcId: CharacterId,
  flags: string[],
  repliedPhonePrompts: Record<string, string>,
): { dialogueId: string; sublabel: string } | null {
  if (npcId === 'nadia') {
    if (flags.includes('read_nadia_diary_2020')) {
      return { dialogueId: 'echo_nadia_diary_2020', sublabel: 'Ingatan Nadia · Buku 2020' };
    }
    if (flags.includes('played_father_cassette_1997')) {
      return { dialogueId: 'echo_nadia_father_tape_1997', sublabel: 'Ingatan Nadia · Kaset 1997' };
    }
    if (flags.includes('reconciled_dinner_memory_chat') || flags.includes('flashback_dinner_done')) {
      return { dialogueId: 'echo_nadia_dinner_apology', sublabel: 'Ingatan Nadia · Hangat' };
    }
    if (flags.includes('remembered_melati_2019_chat') || flags.includes('flashback_melati_2019_done')) {
      return { dialogueId: 'echo_nadia_melati_2019', sublabel: 'Ingatan Nadia · 2019' };
    }
    if (flags.includes('ch2_stood_up_for_family') || flags.includes('ch2_honest_with_hendra')) {
      return { dialogueId: 'echo_nadia_stood_up', sublabel: 'Ingatan Nadia · Lega' };
    }
    if (flags.includes('ch2_chose_overtime')) {
      return { dialogueId: 'echo_nadia_overtime_worry', sublabel: 'Ingatan Nadia · Cemas' };
    }
    if (flags.includes('remembered_father_1996')) {
      return { dialogueId: 'echo_nadia_father_1996', sublabel: 'Ingatan Nadia · 1996' };
    }
    if (flags.includes('promised_kira_butterflies')) {
      return { dialogueId: 'echo_nadia_butterflies', sublabel: 'Ingatan Nadia · Janji' };
    }
    if (flags.includes('gave_gift_nadia')) {
      return { dialogueId: 'echo_nadia_jasmine_gift', sublabel: 'Ingatan Nadia · Melati' };
    }
  }

  if (npcId === 'kira') {
    if (flags.includes('found_kira_secret_drawings')) {
      return { dialogueId: 'echo_kira_secret_drawings', sublabel: 'Ingatan Kira · Pelangi Gitar' };
    }
    if (flags.includes('drew_with_kira_corner')) {
      return { dialogueId: 'echo_kira_star_drawing', sublabel: 'Ingatan Kira · Bintang' };
    }
    if (flags.includes('gave_gift_kira')) {
      return { dialogueId: 'echo_kira_watercolor', sublabel: 'Ingatan Kira · Cat Air' };
    }
    if (flags.includes('bought_balloon_kira')) {
      return { dialogueId: 'echo_kira_balloon', sublabel: 'Ingatan Kira · Balon' };
    }
    if (flags.includes('launched_paper_boat')) {
      return { dialogueId: 'echo_kira_paper_boat', sublabel: 'Ingatan Kira · Perahu' };
    }
  }

  if (npcId === 'bima') {
    if (flags.includes('ch3_bima_night_talk_done')) {
      return { dialogueId: 'echo_bima_after_night_talk', sublabel: 'Ingatan Bima · Umur 25' };
    }
    if (flags.includes('flashback_2018_done')) {
      return { dialogueId: 'echo_bima_flashback_2018', sublabel: 'Ingatan Bima · 2018' };
    }
    if (flags.includes('ch2_honest_with_hendra') || flags.includes('ch2_stood_up_for_family')) {
      return { dialogueId: 'echo_bima_stood_up', sublabel: 'Ingatan Bima · Salut' };
    }
    if (flags.includes('ch2_chose_overtime')) {
      return { dialogueId: 'echo_bima_overtime', sublabel: 'Ingatan Bima · Lembur' };
    }
  }

  if (npcId === 'pak_hendra') {
    if (flags.includes('ch3_hendra_night_talk_done')) {
      return { dialogueId: 'echo_hendra_after_night_talk', sublabel: 'Ingatan Pak Hendra · Naya' };
    }
    if (flags.includes('ch2_honest_with_hendra') || repliedPhonePrompts.prompt_hendra_ch2 === 'rep_ph2_firm') {
      return { dialogueId: 'echo_hendra_honest', sublabel: 'Ingatan Pak Hendra' };
    }
    if (flags.includes('ch2_stood_up_for_family')) {
      return { dialogueId: 'echo_hendra_family_bound', sublabel: 'Ingatan Pak Hendra' };
    }
    if (flags.includes('ch2_chose_overtime')) {
      return { dialogueId: 'echo_hendra_overtime', sublabel: 'Ingatan Pak Hendra' };
    }
  }

  if (npcId === 'mas_bagas') {
    if (flags.includes('heard_bagas_rama_story')) {
      return { dialogueId: 'echo_bagas_rama_2014', sublabel: 'Ingatan Mas Bagas · Rama 2014' };
    }
    if (flags.includes('flashback_2020_done') || flags.includes('thanked_bagas_guitar_chat')) {
      return { dialogueId: 'echo_bagas_2020_guitar', sublabel: 'Ingatan Mas Bagas · 2020' };
    }
  }

  return null;
}

export interface JourneyEchoCard {
  id: string;
  label: string;
  summary: string;
  tone: 'gold' | 'rose' | 'sky' | 'slate';
}

export interface EndingJourneyRecap {
  archetypeTitle: string;
  archetypeNote: string;
  echoCards: JourneyEchoCard[];
  flashbacksSeen: number;
  phoneRepliesSent: number;
}

/**
 * Menyusun ringkasan personal "Jejak Hati Damar" untuk ditampilkan di layar Ending
 * berdasarkan pilihan nyata, kilas balik, chat HP, dan perhatian kecil pemain.
 */
export function buildEndingJourneyRecap(params: {
  endingId: EndingId;
  emotions: EmotionMetrics;
  flags: string[];
  sideQuests: Record<string, SideQuestProgress>;
  discoveredEasterEggs: string[];
  repliedPhonePrompts: Record<string, string>;
}): EndingJourneyRecap {
  const { endingId, flags, sideQuests, discoveredEasterEggs, repliedPhonePrompts } = params;
  const completedSide = Object.values(sideQuests).filter((s) => s.status === 'completed').length;
  const flashbacksSeen = [
    'flashback_2018_done',
    'flashback_bridge_2019_done',
    'flashback_melati_2019_done',
    'flashback_2020_done',
    'flashback_dinner_done',
  ].filter((f) => flags.includes(f)).length;
  const phoneRepliesSent = Object.keys(repliedPhonePrompts).length;

  const archetypeByEnding: Record<EndingId, { title: string; note: string }> = {
    secret: {
      title: 'Ayah yang Kembali Bernyanyi',
      note: 'Kamu merangkai kepingan masa lalu, kejujuran, dan pengorbanan menjadi sebuah lagu utuh untuk rumahmu.',
    },
    true: {
      title: 'Penjaga Cahaya Meja Makan',
      note: 'Kamu memilih membuka hati sepenuhnya, mendengar warga kota, dan menghadirkan diri seutuhnya bagi Nadia & Kira.',
    },
    good: {
      title: 'Langkah yang Belajar Berhenti',
      note: 'Kamu mulai meletakkan beban ketakutan dan memberi ruang bagi rumah serta dirimu sendiri untuk bernapas.',
    },
    bad: {
      title: 'Bayangan di Balik Kaca Kantor',
      note: 'Kamu terus berlari mengejar rasa aman lewat pekerjaan, hingga lupa bahwa rumah sedang menunggumu berhenti.',
    },
  };

  const echoCards: JourneyEchoCard[] = [];

  if (flags.includes('heard_bu_wati_rahmat_story')) {
    echoCards.push({
      id: 'ec_bu_wati_rahmat',
      label: 'Lampu Teras Tiga Puluh Tahun (Bu Wati)',
      summary:
        'Dari kursi rotan dan topi sopir bus almarhum Pak Rahmat di teras Bu Wati, kamu belajar betapa berharganya lampu teras yang setiap senja dinyalakan Nadia untukmu.',
      tone: 'gold',
    });
  }
  if (flags.includes('heard_nenek_sari_rantang')) {
    echoCards.push({
      id: 'ec_nenek_sari_rantang',
      label: 'Rantang Empat Susun Nenek Sari',
      summary: flags.includes('helped_sari_voice_note')
        ? 'Kamu membantu Nenek Sari mengirim pesan suara rindu tanpa menghakimi kepada putranya, Ardi, hingga akhirnya Ardi membeli tiket kereta pulang.'
        : 'Di tepi Danau Senja, kamu menemani Nenek Sari menyantap semur hangat dan belajar bahwa uang tak pernah menggantikan kehadiran.',
      tone: 'gold',
    });
  }
  if (flags.includes('opened_mother_sewing_tin_2016')) {
    echoCards.push({
      id: 'ec_mother_sewing_tin_2016',
      label: 'Kaleng Jahit Biru & Surat Ibu (2016)',
      summary: flags.includes('shared_mother_letter_with_nadia')
        ? 'Kamu menemukan surat tahun 2016 beserta kancing mutiara kebaya almarhumah Ibu dan membacakannya bersama Nadia dengan penuh haru.'
        : 'Di dasar kaleng biskuit biru almarhumah Ibu, kamu menemukan pesan agar tidak berjalan pincang sendirian dan menjahit rumah dengan dua tangan.',
      tone: 'sky',
    });
  }
  if (flags.includes('found_kira_secret_drawings')) {
    echoCards.push({
      id: 'ec_kira_secret_drawings',
      label: 'Tiga Gambar di Bawah Bantal Kira',
      summary: flags.includes('signed_kira_rainbow_drawing')
        ? 'Kamu menemukan tiga gambar yang disembunyikan Kira karena takut membuatmu sedih—dan menandatangani janji matahari jingga di sudut pelangi enam senarnya.'
        : 'Lewat tiga gambar krayon di bawah bantal bintangnya, kamu melihat betapa pekanya Kira merindukan tawa Ayah dan Bundanya.',
      tone: 'rose',
    });
  }
  if (flags.includes('heard_bagas_rama_story')) {
    echoCards.push({
      id: 'ec_bagas_rama_2014',
      label: 'Penjaga Lagu Orang Lain (Mas Bagas · 2014)',
      summary: flags.includes('dedicated_song_to_rama')
        ? 'Kamu mendengar kisah cello almarhum adik Mas Bagas tahun 2014 dan mendedikasikan lagu "Pulang" untuk menghormati sumpah yang menyelamatkan gitarmu.'
        : 'Di sudut belakang Nada Lama, kamu mengetahui alasan mengharukan mengapa Mas Bagas menolak menjual gitar mahonimu selama enam tahun.',
      tone: 'gold',
    });
  }
  if (flags.includes('found_midnight_draft')) {
    echoCards.push({
      id: 'ec_midnight_draft',
      label: 'Draf Pukul 02.14 di Laci Meja Kerja',
      summary: flags.includes('ch3_unfolded_draft_at_table')
        ? 'Kamu mengeluarkan draf surat pukul dua pagi dari sebelas bulan lalu dan membukanya jujur di hadapan Nadia di meja makan.'
        : flags.includes('rewrote_midnight_draft')
          ? 'Kamu menulis ulang surat kelelahan pukul 02.14 menjadi komitmen batas hidup sehat demi keluarga.'
          : 'Kamu membuka kembali laci meja kerjamu dan berdamai dengan ketakutan yang pernah kau ketik tengah malam.',
      tone: 'sky',
    });
  }
  if (flags.includes('read_nadia_diary_2020')) {
    echoCards.push({
      id: 'ec_nadia_diary_2020',
      label: 'Buku Harian Kehamilan Nadia (2020)',
      summary: flags.includes('wrote_reply_in_nadia_diary')
        ? 'Kamu membaca catatan sembilan bulan Nadia menunggu kelahiran Kira dan menuliskan janji pulang di bawah doa subuhnya di RS Harapan.'
        : 'Lewat buku bersampul kain bunga tahun 2020, kamu melihat pernikahanmu dari mata Nadia yang mencintaimu dalam doa paling sunyi.',
      tone: 'rose',
    });
  }
  if (flags.includes('played_father_cassette_1997')) {
    echoCards.push({
      id: 'ec_father_tape_1997',
      label: 'Pita Kaset Bapak (16 Nov 1997)',
      summary: flags.includes('ch3_shared_father_tape_finale')
        ? 'Kamu menemukan rekaman suara almarhum Bapak dari kaleng tua Pak Darman, memutarnya di Radio Dapur, dan meletakkan bebanmu di meja makan bersama Nadia.'
        : 'Di balik desis pita C-60 tahun 1997, kamu mendengar bisikan almarhum Bapak bahwa rumah adalah tempat meletakkan tas, bukan tempat pamer kuat.',
      tone: 'gold',
    });
  }
  if (flags.includes('ch3_told_kira_bedtime_story')) {
    echoCards.push({
      id: 'ec_kira_bedtime',
      label: 'Dongeng Nakhoda Perahu Kertas',
      summary:
        'Sebelum duduk di meja makan Bab 3, kamu menidurkan Kira dengan dongeng perahu kertas—dan mendengar bisikannya agar Ayah membawa pulang tawanya lagi.',
      tone: 'rose',
    });
  }
  if (flags.includes('flashback_2020_done')) {
    echoCards.push({
      id: 'ec_fb2020',
      label: 'Kilas Balik 08 Agustus 2020',
      summary: 'Kamu menghidupkan kembali malam hujan saat melepas gitar mahoni demi kelahiran Kira dan mengingat janji Mas Bagas.',
      tone: 'gold',
    });
  }
  if (flags.includes('reconciled_dinner_memory_chat') || flags.includes('flashback_dinner_done')) {
    echoCards.push({
      id: 'ec_dinner',
      label: 'Menyembuhkan Meja Makan 22.15',
      summary: flags.includes('reconciled_dinner_memory_chat')
        ? 'Kamu tidak hanya mengingat malam sup dingin 6 bulan lalu, tapi juga berani mengirim pesan maaf yang tulus kepada Nadia.'
        : 'Kamu berani menatap kembali pertengkaran sunyi di meja makan dan memilih tidak lagi menjadi tamu di rumah sendiri.',
      tone: 'rose',
    });
  }
  if (flags.includes('flashback_bridge_2019_done')) {
    echoCards.push({
      id: 'ec_fb_bridge_2019',
      label: 'Lamaran Senja Jembatan Sungai (2019)',
      summary:
        'Kamu mengenang sore 22 Mei 2019 saat mengunci gembok "D & N" bersama Nadia dan mengingat pesannya untuk kembali ke jembatan bila lelah menjadi dewasa.',
      tone: 'gold',
    });
  }
  if (flags.includes('flashback_2018_done')) {
    echoCards.push({
      id: 'ec_fb2018',
      label: 'Senar Putus & Tawa 2018',
      summary: 'Kamu mengingat malam pertama Nadia duduk di barisan depan Taman Kota—awal dari lagu "Track 4 — Pulang".',
      tone: 'gold',
    });
  }
  if (flags.includes('remembered_melati_2019_chat') || flags.includes('flashback_melati_2019_done')) {
    echoCards.push({
      id: 'ec_fb2019',
      label: 'Malam Pertama Jl. Melati (2019)',
      summary: flags.includes('remembered_melati_2019_chat')
        ? 'Kamu dan Nadia mengenang kembali malam nasi goreng satu sendok plastik di bawah bohlam 5 watt—dan berjanji mengisi meja makan dengan kehadiran nyata.'
        : 'Kamu mengenang malam pertama pindah ke rumah kosong Jl. Melati No. 14 saat meja makan empat kursi masih berupa impian.',
      tone: 'rose',
    });
  }
  if (flags.includes('ch3_bima_night_talk_done')) {
    echoCards.push({
      id: 'ec_bima_night_25',
      label: 'Lagu Umur Dua Puluh Lima (Bima)',
      summary: flags.includes('bima_sang_bridge_together')
        ? 'Di antara kursi terbalik Kedai Kopi Sudut malam hari, kamu mendengar rahasia pengorbanan Bima dan menyanyikan kembali harmoni yang terputus enam tahun lalu.'
        : 'Di Kedai Kopi Sudut yang telah tutup, kamu mengetahui bahwa Bima menjaga gitar di sudut dinding selama enam tahun demi menunggumu pulang.',
      tone: 'gold',
    });
  }
  if (flags.includes('ch3_hendra_night_talk_done')) {
    echoCards.push({
      id: 'ec_hendra_night_mirror',
      label: 'Ayah yang Terlambat Pulang (Pak Hendra)',
      summary: flags.includes('hendra_encouraged_call_naya')
        ? 'Di lobi malam Menara Nusantara, kamu mendengar penyesalan terdalam Pak Hendra soal putrinya, Naya—dan menyemangatinya menelepon putrinya kembali.'
        : 'Di dekat jendela malam Menara Nusantara, pengakuan jujur Pak Hendra tentang kesepian lantai 18 menjadi cermin tajam sebelum kamu pulang.',
      tone: 'sky',
    });
  } else if (flags.includes('ch2_honest_with_hendra') || flags.includes('ch2_stood_up_for_family')) {
    echoCards.push({
      id: 'ec_hendra_bound',
      label: 'Keberanian di Menara Nusantara',
      summary: 'Kamu bicara jujur pada Pak Hendra tentang batas jam kerja dan janji kecil untuk keluarga di rumah.',
      tone: 'sky',
    });
  } else if (flags.includes('ch2_chose_overtime')) {
    echoCards.push({
      id: 'ec_hendra_ot',
      label: 'Lembur Proyek Kartika',
      summary: 'Di persimpangan senja Bab 2, kamu tetap memilih lembur demi kepastian proyek meski hati mulai terasa berat.',
      tone: 'slate',
    });
  }
  if (flags.includes('remembered_father_1996')) {
    echoCards.push({
      id: 'ec_1996',
      label: 'Foto Sepia Kota 1996',
      summary: 'Di depan arsip kota lama, kamu berdamai dengan bayangan kerja keras almarhum Bapak.',
      tone: 'gold',
    });
  }
  if (
    flags.includes('drew_with_kira_corner') ||
    flags.includes('gave_gift_kira') ||
    flags.includes('bought_balloon_kira') ||
    flags.includes('launched_paper_boat')
  ) {
    echoCards.push({
      id: 'ec_kira_love',
      label: 'Jejak Kecil untuk Kira',
      summary: 'Kira akan selalu mengingat perhatian kecil Ayahnya—dari gambar bintang, perahu kertas, hingga tawa di tepi taman.',
      tone: 'rose',
    });
  }
  if (completedSide >= 3) {
    echoCards.push({
      id: 'ec_citizens',
      label: `Empati di Sudut Kota (${completedSide} Warga)`,
      summary: 'Kamu berhenti sejenak untuk mendengar kisah warga sekitar—menyadari bahwa setiap orang sedang berjuang pulang.',
      tone: 'sky',
    });
  }
  if (echoCards.length < 3 && phoneRepliesSent > 0) {
    echoCards.push({
      id: 'ec_phone',
      label: `Percakapan di Ponsel (${phoneRepliesSent} Balasan)`,
      summary: 'Setiap balasan singkat yang kamu kirimkan kepada Nadia, Kira, Bima, dan Mas Bagas ikut membentuk nada hari ini.',
      tone: 'sky',
    });
  }
  if (echoCards.length < 3 && discoveredEasterEggs.length > 0) {
    echoCards.push({
      id: 'ec_mem',
      label: `${discoveredEasterEggs.length} Fragmen Memori Ditemukan`,
      summary: 'Benda-benda kecil yang tersembunyi di sudut kota mengingatkan Damar pada bagian dirinya yang hampir terlupa.',
      tone: 'gold',
    });
  }

  return {
    archetypeTitle: archetypeByEnding[endingId].title,
    archetypeNote: archetypeByEnding[endingId].note,
    echoCards: echoCards.slice(0, 5),
    flashbacksSeen,
    phoneRepliesSent,
  };
}
