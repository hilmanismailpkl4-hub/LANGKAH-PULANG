import { DialogueScript } from '../types/game';

/**
 * Adegan Cerita Karakter Mendalam Bab 3:
 * "Ayah yang Terlambat Pulang" — Percakapan Malam Empat Mata dengan Pak Hendra
 * Lokasi: Jendela Lobi Malam Menara Nusantara
 *
 * Memperlihatkan sisi rapuh seorang direktur yang menukar masa kecil putrinya (Naya)
 * demi ruangan sudut lantai delapan belas, menjadi cermin hidup paling tajam bagi Damar
 * tepat sebelum Damar melangkah pulang ke Rumah Jl. Melati No. 14.
 */
export const HENDRA_NIGHT_DIALOGUES: Record<string, DialogueScript> = {
  ch3_hendra_ayah_terlambat: {
    id: 'ch3_hendra_ayah_terlambat',
    startNodeId: 'hnd_1',
    nodes: {
      hnd_1: {
        id: 'hnd_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Lobi Menara Nusantara pukul sembilan malam terasa seperti gedung yang berbeda. Separuh lampu plafon telah dipadamkan, menyisakan pantulan lampu jalanan basah sehabis hujan di sepanjang dinding kaca tinggi.',
        onEnter: { playSfx: 'coffee' },
        nextNodeId: 'hnd_2',
      },
      hnd_2: {
        id: 'hnd_2',
        speaker: 'damar_batin',
        emotion: 'ragu',
        text: 'Di dekat jendela kaca lobi, Pak Hendra berdiri seorang diri. Untuk pertama kalinya selama aku bekerja di bawahnya, dasinya tampak dilonggarkan dan map tebal Proyek Kartika tergeletak tertutup di sebelah gelas kopi kertas yang sudah dingin.',
        nextNodeId: 'hnd_3',
      },
      hnd_3: {
        id: 'hnd_3',
        speaker: 'pak_hendra',
        emotion: 'lelah',
        text: 'Oh... Damar. Saya kira kamu sudah sampai di rumah dari tadi. Sini sebentar dekat jendela—tenang saja, jam segini saya sudah tidak mau bicara soal revisi klien.',
        conditionalNext: [
          {
            requiredAnyFlags: ['ch2_stood_up_for_family', 'ch2_honest_with_hendra'],
            nextNodeId: 'hnd_3_echo_brave',
          },
          {
            requiredFlag: 'ch2_chose_overtime',
            nextNodeId: 'hnd_3_echo_overtime',
          },
        ],
        nextNodeId: 'hnd_4',
      },
      hnd_3_echo_brave: {
        id: 'hnd_3_echo_brave',
        speaker: 'pak_hendra',
        emotion: 'tenang',
        echoTag: 'Ingatan Pak Hendra · Keberanianmu Sore Tadi',
        text: 'Jujur saja, Mar... sejak kamu berani menarik batas demi janji ke anakmu sore tadi, pikiran saya di ruang rapat lantai delapan belas malah ke mana-mana. Kalimat kamu terus mengetuk kepala saya.',
        nextNodeId: 'hnd_4',
      },
      hnd_3_echo_overtime: {
        id: 'hnd_3_echo_overtime',
        speaker: 'pak_hendra',
        emotion: 'sedih',
        echoTag: 'Ingatan Pak Hendra · Lembur Proyek Kartika',
        text: 'Soal lembur yang kamu sanggupi sore tadi, Mar... dari tadi saya menatap draf kontrak atas namamu di meja, dan dada saya justru terasa sesak. Saya seperti sedang melihat ulang kesalahan saya sendiri lima belas tahun lalu.',
        nextNodeId: 'hnd_4',
      },
      hnd_4: {
        id: 'hnd_4',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Pak Hendra memutar sedikit layar ponsel di genggamannya. Tampak foto seorang gadis muda berusia dua puluh satu tahun mengenakan toga dan memegang tabung gambar arsitektur di tengah halaman kampus yang berselimut kabut musim gugur.',
        onEnter: { playSfx: 'phone' },
        nextNodeId: 'hnd_5',
      },
      hnd_5: {
        id: 'hnd_5',
        speaker: 'pak_hendra',
        emotion: 'hangat',
        text: 'Ini Naya, putri tunggal saya di Melbourne. Sore tadi dia baru mengirim foto kelulusan studio akhirnya ke grup keluarga. Senyumnya mirip sekali sama ibunya waktu muda.',
        nextNodeId: 'hnd_6',
      },
      hnd_6: {
        id: 'hnd_6',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Selamat ya, Pak Hendra. Putri Bapak kelihatan mandiri dan bersinar sekali di foto itu. Bapak pasti bangga sekali malam ini.',
        nextNodeId: 'hnd_7',
      },
      hnd_7: {
        id: 'hnd_7',
        speaker: 'pak_hendra',
        emotion: 'sedih',
        text: 'Pak Hendra tersenyum tipis—senyum yang terasa retak di ujungnya. "Kamu tahu apa balasan dia waktu saya kirim uang hadiah dan mengetik panjang lebar betapa bangganya saya, Mar? Cuma tiga kata: \'Terima kasih, Ayah.\' Titik. Sopan, rapi, berjarak... persis cara staf magang membalas email direksi."',
        nextNodeId: 'hnd_8',
      },
      hnd_8: {
        id: 'hnd_8',
        speaker: 'pak_hendra',
        emotion: 'haru',
        text: 'Waktu Naya umur enam tahun—persis seumuran Kira anakmu sekarang—dia pernah menempelkan gambar krayon perahu kecil di tas kerja kulit saya supaya saya pulang sebelum jam delapan malam. Saya kelupas gambar itu di lift karena gengsi dilihat direktur utama. Dalam hati saya selalu bilang: nanti saja kalau jabatan saya sudah aman, saya tebus semuanya.',
        conditionalNext: [
          {
            requiredFlag: 'sent_naya_crayon_boat',
            nextNodeId: 'hnd_8_echo_crayon',
          },
        ],
        nextNodeId: 'hnd_9',
      },
      hnd_8_echo_crayon: {
        id: 'hnd_8_echo_crayon',
        speaker: 'pak_hendra',
        emotion: 'haru',
        echoTag: 'Ingatan Pak Hendra · Perahu Krayon & Prangko Pinisi',
        text: 'Tapi gambar itu... ternyata satpam lobi menyimpannya lima belas tahun, dan kamu yang mengirimnya pulang ke Melbourne siang tadi. Naya baru membalas, Mar. Bukan tiga kata. Dia kirim pesan suara sambil menangis: "Ayah masih ingat perahuku?"',
        nextNodeId: 'hnd_9',
      },
      hnd_9: {
        id: 'hnd_9',
        speaker: 'pak_hendra',
        emotion: 'sedih',
        text: 'Tahunya sepuluh tahun lewat seperti kedipan mata, Damar. Ruangan sudut di lantai delapan belas itu akhirnya jadi milik saya. Tapi waktu saya akhirnya punya waktu luang untuk pulang cepat... gadis kecil yang dulu duduk menunggu di dekat pintu itu sudah tumbuh dewasa dan belajar hidup tanpa membutuhkan ayahnya lagi.',
        conditionalNext: [
          {
            requiredFlag: 'played_father_cassette_1997',
            nextNodeId: 'hnd_9_echo_cassette',
          },
        ],
        nextNodeId: 'hnd_10',
      },
      hnd_9_echo_cassette: {
        id: 'hnd_9_echo_cassette',
        speaker: 'damar_batin',
        emotion: 'haru',
        echoTag: 'Gema Lintas Cerita · Pita Kaset Bapak 1997',
        text: 'Jantungku mencelos pelan. Dua suara ayah beradu di kepalaku malam ini—bisikan almarhum Bapak di pita tahun 1997 bahwa rumah adalah tempat meletakkan tas, dan pengakuan Pak Hendra yang menukar tempat pulangnya demi kursi di puncak menara kaca ini.',
        nextNodeId: 'hnd_10',
      },
      hnd_10: {
        id: 'hnd_10',
        speaker: 'pak_hendra',
        emotion: 'tenang',
        text: 'Saya jadi orang paling disegani di gedung ini, Mar, tapi tiap buka kunci rumah rasanya seperti masuk ke hotel kosong. Lampu ruang makan di rumahmu masih menyala malam ini, kan? Sebelum kamu keluar dari pintu lobi itu... jangan ulangi kebodohan saya.',
        choices: [
          {
            id: 'hnd_c_encourage_call',
            text: '"Pak Hendra... selama Bapak masih memegang ponsel itu, belum benar-benar terlambat untuk Naya. Teleponlah dia malam ini—bukan sebagai direktur yang mengirim uang, tapi ayah yang masih ingat gambar perahu krayonnya."',
            subtext: 'Menyentuh hati Pak Hendra sebagai sesama ayah & menetapkan arah pulangmu',
            nextNodeId: 'hnd_r_call_1',
            effects: {
              kehadiranKeluarga: 3,
              kejujuranDiri: 3,
              setFlags: ['ch3_hendra_night_talk_done', 'hendra_encouraged_call_naya', 'hendra_blessed_homecoming'],
              phoneMessage: {
                id: 'msg_hendra_naya_call',
                sender: 'Pak Hendra (Kantor)',
                preview: 'Damar... tangan saya sempat gemetar waktu menekan tombol panggil, tapi Naya mengangkatnya. Terima kasih sudah mengingatkan orang tua ini. Pulanglah ke keluargamu malam ini.',
                timeLabel: 'Baru saja',
                threadId: 'hendra',
              },
              journalEntry: {
                id: 'je_hendra_ayah_terlambat',
                title: 'Ayah yang Terlambat Pulang di Lobi Malam',
                body: 'Di dekat jendela lobi Menara Nusantara yang lengang, Pak Hendra memperlihatkan foto wisuda putrinya, Naya, sambil mengakui kesepian ruangan lantai delapan belasnya. Aku menyemangatinya untuk menelepon putrinya dengan hati jujur—dan melihat cermin paling jernih agar aku tidak kehilangan Kira dan Nadia.',
                chapter: 3,
              },
              toast: 'Percakapan mendalam dengan Pak Hendra tercatat di Jurnal & HP [H]!',
            },
          },
          {
            id: 'hnd_c_choose_home',
            text: '"Terima kasih sudah membuka cerita sepenting itu untuk saya, Pak. Saya dengar peringatan Bapak—besok saya tetap bekerja profesional, tapi malam ini saya memilih pulang seutuhnya untuk Nadia dan Kira."',
            subtext: 'Meneguhkan batas sehat & menerima restu tulus dari Pak Hendra',
            nextNodeId: 'hnd_r_home_1',
            effects: {
              kejujuranDiri: 3,
              kehadiranKeluarga: 2,
              setFlags: ['ch3_hendra_night_talk_done', 'hendra_blessed_homecoming'],
              phoneMessage: {
                id: 'msg_hendra_blessing',
                sender: 'Pak Hendra (Kantor)',
                preview: 'Urusan Proyek Kartika biar saya bagi dua tim besok pagi, Damar. Malam ini matikan email kantormu dan peluk anak istrimu.',
                timeLabel: 'Baru saja',
                threadId: 'hendra',
              },
              journalEntry: {
                id: 'je_hendra_ayah_terlambat',
                title: 'Cermin di Balik Kaca Lantai Delapan Belas',
                body: 'Melihat Pak Hendra berdiri sendirian menatap foto putrinya di lobi malam meruntuhkan seluruh ilusiku tentang ambisi tanpa batas. Jabatan setinggi apa pun tak ada artinya bila rumah berubah menjadi hotel yang dingin.',
                chapter: 3,
              },
              toast: 'Pak Hendra merestui langkah pulangmu — tercatat di Jurnal & HP [H]!',
            },
          },
          {
            id: 'hnd_c_admit_fear',
            text: '"Jujur saya masih takut melambat, Pak... rasanya kalau saya tidak terus mengejar promosi ini, saya takut suatu hari keluarga saya kekurangan."',
            subtext: 'Mengakui ketakutan finansial yang masih membebani pikiranmu',
            nextNodeId: 'hnd_r_fear_1',
            effects: {
              kejujuranDiri: 2,
              ambisiPelarian: 1,
              setFlags: ['ch3_hendra_night_talk_done', 'hendra_warned_torn_damar'],
              journalEntry: {
                id: 'je_hendra_ayah_terlambat',
                title: 'Peringatan dari Kursi Jendela Malam',
                body: 'Kepada Pak Hendra aku mengaku masih takut berhenti berlari. Beliau menatapku sedih dan berkata gedung ini akan dengan senang hati memakan sepuluh tahunku dan menggantinya dengan selembar plakat kaca.',
                chapter: 3,
              },
              toast: 'Peringatan batin Pak Hendra tersimpan di Jurnal.',
            },
          },
        ],
      },
      hnd_r_call_1: {
        id: 'hnd_r_call_1',
        speaker: 'pak_hendra',
        emotion: 'haru',
        text: 'Pak Hendra terdiam lama, lalu melepas kacamatanya dan menyeka sudut matanya pelan. "...Lucu ya, Mar. Saya berani negosiasi kontrak puluhan miliar di depan komisaris, tapi mau menelepon anak sendiri saja saya takut ditolak."',
        onEnter: { playSfx: 'chime' },
        nextNodeId: 'hnd_r_call_2',
      },
      hnd_r_call_2: {
        id: 'hnd_r_call_2',
        speaker: 'pak_hendra',
        emotion: 'hangat',
        text: 'Saya telepon Naya sekarang setelah kamu jalan keluar. Dan soal Proyek Kartika—besok pagi jadwal lemburnya saya rombak jadi dua tim bergilir. Pulanglah sekarang, Damar... jangan biarkan sup di meja makan rumahmu dingin.',
      },
      hnd_r_home_1: {
        id: 'hnd_r_home_1',
        speaker: 'pak_hendra',
        emotion: 'hangat',
        text: 'Pak Hendra menepuk bahu Damar mantap—bukan tepukan atasan kepada bawahan, melainkan seorang ayah yang lega melihat adiknya tidak jatuh ke jurang yang sama. "Bagus, Damar. Proyek Kartika besok pagi saya pecah jadi dua tim supaya tidak ada lagi lembur malam. Cepat pulang—Kira dan Nadia pasti sudah menunggu."',
        onEnter: { playSfx: 'chime' },
      },
      hnd_r_fear_1: {
        id: 'hnd_r_fear_1',
        speaker: 'pak_hendra',
        emotion: 'sedih',
        text: 'Ketakutan itulah bahan bakar gedung ini, Mar. Menara ini akan dengan senang hati menelan sepuluh tahun hidupmu, lalu memberimu plakat akrilik waktu kamu pensiun. Pulanglah malam ini... tatap wajah istrimu baik-baik sebelum kamu memutuskan mau menukar berapa tahun lagi.',
      },
    },
  },
};
