import { DialogueScript } from '../types/game';

/**
 * ADEGAN INTIM BAB 3 — "DONGENG SEBELUM TIDUR UNTUK KIRA: NAKHODA PERAHU KERTAS"
 * Dimainkan saat Damar tiba di rumah malam hari pada Bab 3 sebelum klimaks meja makan bersama Nadia.
 * Alur dongeng otomatis mencerminkan perjalanan batin & tindakan Damar sepanjang hari!
 */
export const KIRA_BEDTIME_DIALOGUES: Record<string, DialogueScript> = {
  ch3_kira_dongeng_malam: {
    id: 'ch3_kira_dongeng_malam',
    startNodeId: 'kbd_1',
    nodes: {
      kbd_1: {
        id: 'kbd_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Di sudut karpet ruang tengah yang diterangi lampu bintang kuning temaram, Kira duduk memeluk boneka beruang cokelatnya. Kelopak matanya sudah berat menahan kantuk, namun di pangkuannya masih tergenggam sebuah perahu kertas biru.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'kbd_2',
      },
      kbd_2: {
        id: 'kbd_2',
        speaker: 'kira',
        emotion: 'hangat',
        text: 'Ayaaah... akhirnya pulang juga. Kata Bunda mata Kira udah lima watt, tapi Kira nungguin Ayah sebentar aja... Ayah mau cerita satu dongeng pendek dua menit sebelum Kira bobo nggak?',
        nextNodeId: 'kbd_3',
      },
      kbd_3: {
        id: 'kbd_3',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Damar melepas tas kerjanya pelan, lalu duduk bersila di lantai sejajar dengan putrinya dan mengusap puncak rambut Kira. "Mau dong, Tuan Putri. Malam ini mau dongeng tentang apa?"',
        nextNodeId: 'kbd_4',
      },
      kbd_4: {
        id: 'kbd_4',
        speaker: 'kira',
        emotion: 'ceria',
        text: 'Tentang ini nih—Nakhoda Perahu Kertas Biru!! Yang berlayar jauh banget terus kehujanan di tengah laut!',
        nextNodeId: 'kbd_5',
      },
      kbd_5: {
        id: 'kbd_5',
        speaker: 'damar',
        emotion: 'tenang',
        text: '"Baiklah... Pada suatu pagi, ada seorang Nakhoda yang punya perahu kertas warna biru langit. Dulunya dia suka sekali bernyanyi mengikuti arah angin. Tapi karena takut keluarganya di pantai kekurangan bekal, dia berlayar makin jauh mengejar Pulau Emas—sampai tak sadar langit sudah gelap."',
        conditionalNext: [
          {
            requiredFlag: 'found_kira_secret_drawings',
            nextNodeId: 'kbd_5_echo_secret_drawings',
          },
          {
            requiredAnyFlags: ['flashback_2020_done', 'kept_guitar_pick'],
            nextNodeId: 'kbd_5_echo_guitar',
          },
          {
            minSideQuests: 3,
            nextNodeId: 'kbd_5_echo_citizens',
          },
        ],
        nextNodeId: 'kbd_5_echo_rain',
      },
      kbd_5_echo_secret_drawings: {
        id: 'kbd_5_echo_secret_drawings',
        speaker: 'damar',
        emotion: 'haru',
        echoTag: 'Cerminan Perjalanan · Tiga Gambar di Bawah Bantal Kira',
        text: '"Tiba-tiba di atas awan mendung muncul enam garis pelangi yang keluar dari gitar kayu tua sang Nakhoda—persis seperti gambar rahasia yang disembunyikan Tuan Putri Kecil di bawah bantal bintangnya." Kira langsung menahan napas takjub dengan mata berbinar!',
        onEnter: { playSfx: 'guitar' },
        nextNodeId: 'kbd_6',
      },
      kbd_5_echo_guitar: {
        id: 'kbd_5_echo_guitar',
        speaker: 'damar',
        emotion: 'haru',
        echoTag: 'Cerminan Perjalanan · Pick Gitar & Lagu Lama',
        text: '"Di tengah kabut laut yang dingin, lambung perahunya menyentuh sekeping kayu mahoni kecil yang mengapung. Begitu diangkat ke telinga, kayu itu berbunyi seperti petikan senar gitar lama—mengingatkan sang Nakhoda pada lagu pengantar tidur yang belum sempat ia selesaikan untuk putri kecilnya."',
        onEnter: { playSfx: 'guitar' },
        nextNodeId: 'kbd_6',
      },
      kbd_5_echo_citizens: {
        id: 'kbd_5_echo_citizens',
        speaker: 'damar',
        emotion: 'hangat',
        echoTag: 'Cerminan Perjalanan · Empati Warga Kota',
        text: '"Untungnya, sepanjang siang tadi sang Nakhoda sempat berhenti menolong perahu-perahu kecil lain yang kehausan dan kehilangan dayung. Saat kabut malam turun, perahu-perahu sahabat itu menyalakan lentera kecil berbaris-baris menuju arah selatan."',
        onEnter: { playSfx: 'chime' },
        nextNodeId: 'kbd_6',
      },
      kbd_5_echo_rain: {
        id: 'kbd_5_echo_rain',
        speaker: 'damar',
        emotion: 'tenang',
        text: '"Sore harinya, badai hujan turun deras tepat di bawah jembatan raksasa. Layar kertasnya basah dan berat, memaksa sang Nakhoda menepi dan berhenti mengejar ombak untuk pertama kalinya."',
        nextNodeId: 'kbd_6',
      },
      kbd_6: {
        id: 'kbd_6',
        speaker: 'kira',
        emotion: 'ragu',
        text: 'Kira mengucek matanya pelan, suaranya makin lirih. "Terus Yah... waktu lautnya gelap sama dingin banget... kenapa Nakhodanya nggak tenggelam?"',
        choices: [
          {
            id: 'kbd_choice_sun',
            text: '"Soalnya di saku bajunya, dia simpan gambar matahari kuning raksasa buatan putri kecilnya—jadi badai sedingin apa pun nggak sanggup membekukan hatinya."',
            subtext: 'Menjadikan cinta sederhana Kira sebagai kompas pulang',
            nextNodeId: 'kbd_res_sun',
            effects: {
              kehadiranKeluarga: 3,
              kejujuranDiri: 1,
              setFlags: ['kira_story_sun'],
            },
          },
          {
            id: 'kbd_choice_brave',
            text: '"Sebenarnya Nakhodanya takut banget dan sempat menangis diam-diam... sampai dia sadar, nakhoda pemberani itu bukan yang nggak pernah takut, tapi yang berani putar balik pulang."',
            subtext: 'Mengajarkan kejujuran hati lewat dongeng',
            nextNodeId: 'kbd_res_brave',
            effects: {
              kejujuranDiri: 3,
              kehadiranKeluarga: 1,
              setFlags: ['kira_story_brave'],
            },
          },
          {
            id: 'kbd_choice_lantern',
            text: '"Karena jauh di tepi pantai rumah, Ratu Pelabuhan nggak pernah memadamkan satu lampu kuning di ruang makan—jadi dari ujung laut pun Nakhodanya tahu arah pulang."',
            subtext: 'Menghormati kesabaran Nadia yang selalu menjaga cahaya rumah',
            nextNodeId: 'kbd_res_lantern',
            effects: {
              kehadiranKeluarga: 2,
              kejujuranDiri: 2,
              setFlags: ['kira_story_lantern'],
            },
          },
        ],
      },
      kbd_res_sun: {
        id: 'kbd_res_sun',
        speaker: 'kira',
        emotion: 'ceria',
        text: 'Hehehe... itu kan kayak gambar matahari Kira yang di pintu kulkas ya, Ayah... Berarti gambar Kira beneran sakti dong...',
        nextNodeId: 'kbd_7',
      },
      kbd_res_brave: {
        id: 'kbd_res_brave',
        speaker: 'kira',
        emotion: 'hangat',
        text: 'Kasihan Nakhodanya nangis sendirian... Nanti kalau udah sampai pantai, putri kecilnya pasti langsung kasih peluk paling kenceng biar nggak takut lagi...',
        nextNodeId: 'kbd_7',
      },
      kbd_res_lantern: {
        id: 'kbd_res_lantern',
        speaker: 'kira',
        emotion: 'hangat',
        text: 'Ratu Pelabuhannya baik banget kayak Bunda ya, Yah... selalu nyalain lampu teras sama masak sup hangat...',
        nextNodeId: 'kbd_7',
      },
      kbd_7: {
        id: 'kbd_7',
        speaker: 'narator',
        emotion: 'haru',
        text: 'Kira menguap panjang. Damar menggendong tubuh mungil putrinya pelan ke tempat tidur dan menarik selimut bergambar bintang hingga ke bahunya. Dalam keadaan mata sudah terpejam, jari kecil Kira tiba-tiba meraih dan menggenggam ibu jari Damar—persis seperti pagi hari ia lahir enam tahun lalu.',
        onEnter: { playSfx: 'chime' },
        nextNodeId: 'kbd_8',
      },
      kbd_8: {
        id: 'kbd_8',
        speaker: 'kira',
        emotion: 'haru',
        text: '"Syukurlah Nakhodanya pulang, Yah... bilangin sama Nakhodanya ya... besok nggak usah cari Pulau Emas jauh-jauh lagi... bawa pulang ketawanya aja... selamat malam, Ayah..."',
        nextNodeId: 'kbd_end',
      },
      kbd_end: {
        id: 'kbd_end',
        speaker: 'narator',
        emotion: 'haru',
        text: 'Saat Damar berdiri dan berbalik ke ambang pintu, Nadia tampak bersandar hening di kusen ruang makan. Sejak tadi ia mendengarkan seluruh dongeng itu—jemarinya menyeka cepat sudut matanya yang basah sebelum mengangguk lembut mengajak Damar duduk di meja makan.',
        onEnd: {
          playSfx: 'guitar',
          setFlags: ['ch3_told_kira_bedtime_story'],
          journalEntry: {
            id: 'je_kira_bedtime_story',
            title: 'Dongeng Sebelum Tidur · Nakhoda Perahu Kertas',
            body: 'Sebelum berbicara dengan Nadia di meja makan, aku merangkai dongeng pengantar tidur untuk Kira tentang Nakhoda Perahu Kertas yang tersesat mengejar Pulau Emas. Dengan mata terpejam sambil menggenggam ibu jariku, Kira berbisik: "Besok nggak usah cari Pulau Emas lagi—bawa pulang ketawanya aja."',
            chapter: 3,
          },
          toast: 'Kira telah terlelap hangat — temui Nadia di meja makan untuk percakapan penentu.',
        },
      },
    },
  },
};
