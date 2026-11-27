import { DialogueScript } from '../types/game';

/**
 * Alur Cerita Perspektif Anak:
 * "Tiga Gambar yang Disembunyikan di Bawah Bantal" — Kejujuran Krayon Kira (6 Tahun)
 * Lokasi: Bantal Bintang Kuning di Sudut Bermain Kira, Rumah Jl. Melati No. 14 (`[-20.95, 0.08, 70.95]`)
 *
 * Memperlihatkan betapa tajamnya mata seorang anak berusia enam tahun menangkap kesepian rumah
 * yang dikira orang dewasa berhasil mereka sembunyikan.
 */
export const KIRA_SKETCHBOOK_DIALOGUES: Record<string, DialogueScript> = {
  story_kira_secret_drawings: {
    id: 'story_kira_secret_drawings',
    startNodeId: 'sksd_1',
    nodes: {
      sksd_1: {
        id: 'sksd_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Di tepi karpet sudut bermain Kira, sebuah bantal berbentuk bintang kuning tampak sedikit menggembung. Dari bawah sarung bantalnya menyembul sudut tiga lembar kertas gambar HVS yang dilipat hati-hati.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'sksd_2',
      },
      sksd_2: {
        id: 'sksd_2',
        speaker: 'damar_batin',
        emotion: 'ragu',
        text: 'Di bagian luar lipatannya tertulis huruf cetak krayon merah yang huruf S dan R-nya masih sesekali terbalik: "RAHASIA KIRA — JANGAN TEMPEL DI KULKAS NANTI AYAH SEDIH."',
        nextNodeId: 'sksd_3',
      },
      sksd_3: {
        id: 'sksd_3',
        speaker: 'narator',
        emotion: 'sedih',
        text: 'Lembar Pertama digambar memakai krayon abu-abu dan kuning pucat. Tampak sosok anak kecil berpiyama berdiri berjinjit di dekat kaca buram pintu depan rumah, memandangi sorot lampu motor yang lewat di jalan tanpa belok ke pagar. Di bawahnya tertulis: "Nunggu suara standar motor Ayah jam sembilan."',
        onEnter: { playSfx: 'chime' },
        nextNodeId: 'sksd_4',
      },
      sksd_4: {
        id: 'sksd_4',
        speaker: 'narator',
        emotion: 'haru',
        text: 'Lembar Kedua penuh warna biru tua. Tampak Bunda berdiri membelakangi meja makan menghadap keran wastafel dapur, satu tangannya menyentuh pipi. Di pojok kertas tertulis kalimat polos yang membuat dada serasa ditikam: "Kata Bunda matanya perih kena bawang, padahal Bunda cuma lagi nyuci sendok."',
        onEnter: { playSfx: 'page' },
        conditionalNext: [
          {
            requiredFlag: 'read_nadia_diary_2020',
            nextNodeId: 'sksd_4_echo_nadia',
          },
        ],
        nextNodeId: 'sksd_5',
      },
      sksd_4_echo_nadia: {
        id: 'sksd_4_echo_nadia',
        speaker: 'damar_batin',
        emotion: 'haru',
        echoTag: 'Gema Lintas Cerita · Buku Harian 2020 & Mata Kira',
        text: 'Ya Tuhan, Nadia... dari ruang bersalin tahun 2020 sampai wastafel dapur minggu lalu, berapa kali kamu menyeka air matamu sendirian sambil berbohong pada putri kita supaya nama ayahnya tetap harum di mata Kira?',
        nextNodeId: 'sksd_5',
      },
      sksd_5: {
        id: 'sksd_5',
        speaker: 'damar_batin',
        emotion: 'sedih',
        text: 'Lututku lemas hingga aku terduduk di tepi karpet. Kami selalu mengira anak enam tahun belum mengerti apa-apa selama kami tidak bertengkar keras—ternyata Kira merekam setiap detik sunyi rumah ini dengan krayonnya.',
        nextNodeId: 'sksd_6',
      },
      sksd_6: {
        id: 'sksd_6',
        speaker: 'narator',
        emotion: 'hangat',
        text: 'Namun saat Lembar Ketiga dibuka, seluruh halaman dipenuhi krayon kuning emas, hijau rumput, dan merah muda cerah. Tampak Ayah, Bunda, dan Kira duduk berdempetan di tepi Danau Senja.',
        onEnter: { playSfx: 'guitar' },
        nextNodeId: 'sksd_7',
      },
      sksd_7: {
        id: 'sksd_7',
        speaker: 'narator',
        emotion: 'haru',
        text: 'Di tangan Ayah tidak ada lagi kotak hitam telepon genggam. Sebagai gantinya, Kira menggambar gitar cokelat yang dari lubangnya keluar enam garis warna-warni melengkung ke langit seperti pelangi memayungi mereka bertiga. Judulnya: "Rumah Kita Kalau Kerja Ayah Sudah Habis."',
        conditionalNext: [
          {
            requiredFlag: 'played_father_cassette_1997',
            nextNodeId: 'sksd_7_echo_1997',
          },
        ],
        nextNodeId: 'sksd_8',
      },
      sksd_7_echo_1997: {
        id: 'sksd_7_echo_1997',
        speaker: 'damar_batin',
        emotion: 'haru',
        echoTag: 'Gema Lintas Generasi · Kaset Bapak 1997 & Krayon Kira',
        text: 'Dulu tahun 1997 aku menangis karena senar gitar perih di jari kecilku dan ditenangkan Bapak. Hari ini putriku sendiri menggambar enam senar itu sebagai pelangi yang menyatukan rumah kami kembali.',
        nextNodeId: 'sksd_8',
      },
      sksd_8: {
        id: 'sksd_8',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Ia bahkan menyembunyikan tiga gambar ini di bawah bantalnya semata-mata karena takut membuatku sedih. Anak sekecil itu sedang berusaha menjaga perasaan ayahnya. Apa yang harus kulakukan pada gambar rahasia Kira ini?',
        choices: [
          {
            id: 'sksd_c_sign_promise',
            text: 'Ambil krayon jingga di kotak pensil Kira, gambar satu matahari kecil di pojok Lembar Ketiga beserta tulisan: "JANJI AYAH — MULAI BESOK KITA TEMPEL DI KULKAS!"',
            subtext: 'Mengubah gambar rahasia Kira menjadi janji nyata yang tidak perlu disembunyikan lagi',
            nextNodeId: 'sksd_end_sign',
            effects: {
              kehadiranKeluarga: 4,
              kejujuranDiri: 2,
              setFlags: ['found_kira_secret_drawings', 'signed_kira_rainbow_drawing'],
              phoneMessage: {
                id: 'msg_nadia_kira_pillow',
                sender: 'Kira (HP Bunda)',
                preview: 'AYAAAAH!! kira barusan liat ada matahari oranye baru di gambar pelangi bawah bantal kira!! itu ayah yg gambar yaaa?! 😭☀️🌈',
                timeLabel: 'Baru saja',
                threadId: 'kira',
              },
              journalEntry: {
                id: 'je_kira_secret_drawings',
                title: 'Tiga Gambar di Bawah Bantal Bintang Kira',
                body: 'Di bawah bantal kuning Kira, kutemukan tiga gambar krayon yang ia sembunyikan karena takut membuatku sedih: dirinya menunggu lampu motorku pukul sembilan, Nadia menyeka air mata di wastafel, dan gambar pelangi enam senar gitar saat pekerjaanku usai. Kububuhkan matahari jingga dan tanda tangan janjiku di sudut kertasnya.',
                chapter: 1,
              },
              toast: 'Janji krayon untuk Kira tercatat di Pesan Suara HP [H], Dongeng Bab 3 & Jurnal!',
            },
          },
          {
            id: 'sksd_c_thank_nadia',
            text: 'Kembalikan lipatannya dengan lembut ke bawah bantal bintang, lalu kirim pesan terima kasih dan maaf terdalam pada Nadia atas malam-malam di depan wastafel itu',
            subtext: 'Merangkul pengorbanan sunyi Nadia yang menjaga hati Kira selama ini',
            nextNodeId: 'sksd_end_nadia',
            effects: {
              kehadiranKeluarga: 3,
              kejujuranDiri: 3,
              setFlags: ['found_kira_secret_drawings', 'honored_nadia_sink_tears'],
              phoneMessage: {
                id: 'msg_nadia_sink_drawing',
                sender: 'Nadia',
                preview: 'Mas... ya ampun Kira beneran gambar waktu aku di wastafel itu? Anak kita peka banget ya... makasih sudah mau pulang buat kami berdua ❤️',
                timeLabel: 'Baru saja',
                threadId: 'nadia',
              },
              journalEntry: {
                id: 'je_kira_secret_drawings',
                title: 'Air Mata yang Disebut Bawang oleh Nadia',
                body: 'Lewat gambar kedua yang disembunyikan Kira di bawah bantalnya, aku melihat bagaimana Nadia menangis tanpa suara di depan wastafel sambil mencuci sendok agar Kira tidak tahu ia kesepian. Aku takkan membiarkan pemandangan itu terulang lagi.',
                chapter: 1,
              },
              toast: 'Kenangan Tiga Gambar Kira tersimpan di Pesan Suara HP [H] & Jurnal!',
            },
          },
          {
            id: 'sksd_c_memorize_rainbow',
            text: 'Tatap lama-lama enam garis pelangi dari lubang gitar di gambar ketiga hingga terpatri di ingatan—itulah wajah ayah yang paling dirindukan Kira',
            subtext: 'Menjadikan gambar Kira kompas utama saat melangkah pulang malam nanti',
            nextNodeId: 'sksd_end_memorize',
            effects: {
              kejujuranDiri: 3,
              kehadiranKeluarga: 2,
              setFlags: ['found_kira_secret_drawings'],
              journalEntry: {
                id: 'je_kira_secret_drawings',
                title: 'Pelangi Enam Senar Buatan Kira',
                body: 'Bagi Kira, kebahagiaan keluarganya begitu sederhana: bukan rumah yang lebih mewah, melainkan tangan ayahnya yang kembali memetik enam senar pelangi alih-alih menggenggam layar telepon.',
                chapter: 1,
              },
              toast: 'Gambar Pelangi Enam Senar Kira tersimpan di Jurnal & Pesan Suara HP [H]!',
            },
          },
        ],
      },
      sksd_end_sign: {
        id: 'sksd_end_sign',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Ujung krayon jingga itu tumpul di jariku, meninggalkan wangi lilin warna masa kecil. Besok pagi, pintu kulkas dapur kami akan punya gambar paling indah sedunia.',
        onEnter: { playSfx: 'chime' },
      },
      sksd_end_nadia: {
        id: 'sksd_end_nadia',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Kutepuk pelan bantal bintang kuning itu sebelum berdiri. Dua perempuan paling berharga di hidupku sudah terlalu lama saling menguatkan—kini saatnya aku hadir di tengah mereka.',
        onEnter: { playSfx: 'chime' },
      },
      sksd_end_memorize: {
        id: 'sksd_end_memorize',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Enam garis krayon warna-warni dari badan gitar cokelat... tidak ada lukisan di galeri mana pun yang lebih jujur daripada doa seorang anak enam tahun.',
        onEnter: { playSfx: 'guitar' },
      },
    },
  },
};
