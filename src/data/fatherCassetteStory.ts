import { DialogueScript } from '../types/game';

/**
 * Alur Cerita Emosional Keluarga:
 * "Pita Tua di Balik Radio Dapur" — Kaset Suara Almarhum Bapak (16 November 1997)
 *
 * Menghubungkan:
 * 1. Foto Sepia 1996 di Tugu Sejarah Plaza Nusantara (`remembered_father_1996`)
 * 2. Slot Kaset di Balik Radio Kayu Dapur Rumah Jl. Melati No. 14 (`story_radio_empty_hint`)
 * 3. Kotak Kaleng Kaset Tua & Pak Darman di Stasiun Kereta Tua Senja (`story_darman_father_cassette`)
 * 4. Adegan Sinematik Audio-Memory Memutar Kaset 1997 di Radio Dapur (`flashback_kaset_bapak_1997`)
 * 5. Ucapan Terima Kasih ke Pak Darman (`story_darman_after_cassette`)
 */
export const FATHER_CASSETTE_DIALOGUES: Record<string, DialogueScript> = {
  // === 1. PETUNJUK AWAL SAAT MEMERIKSA DEK KASET RADIO KAYU DAPUR SEBELUM PUNYA KASET ===
  story_radio_empty_hint: {
    id: 'story_radio_empty_hint',
    startNodeId: 'sreh_1',
    nodes: {
      sreh_1: {
        id: 'sreh_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Di samping tombol putar frekuensi Radio Kayu Dapur peninggalan almarhum Bapak, terdapat jendela plastik bening dek pemutar pita kaset analog yang sudah bertahun-tahun tidak dibuka.',
        onEnter: { playSfx: 'switch' },
        nextNodeId: 'sreh_2',
      },
      sreh_2: {
        id: 'sreh_2',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Klak. Tutup kasetnya masih membuka mulus. Roda pemutarnya bahkan masih bersih—dulu setiap Minggu pagi Bapak selalu mengelap bagian dalamnya pakai kapas dan minyak kayu putih.',
        nextNodeId: 'sreh_3',
      },
      sreh_3: {
        id: 'sreh_3',
        speaker: 'narator',
        emotion: 'hangat',
        text: 'Di dasar ruang kaset yang kosong, terselip secarik kertas nota kuning kecil bertuliskan pensil miring almarhum Bapak: "Titip sambung pita kusut kaset C-60 Minggu Sore — Wiryo, Jl. Melati. Ambil di lapak Mas Darman samping peron Stasiun Senja."',
        onEnter: { playSfx: 'page' },
        conditionalNext: [
          {
            requiredFlag: 'remembered_father_1996',
            nextNodeId: 'sreh_3_echo1996',
          },
        ],
        nextNodeId: 'sreh_4',
      },
      sreh_3_echo1996: {
        id: 'sreh_3_echo1996',
        speaker: 'damar_batin',
        emotion: 'haru',
        echoTag: 'Gema Memori · Foto Sepia 1996 Plaza Nusantara',
        text: 'Tulisan tangan di nota ini persis buku catatan kecil di saku kemeja Bapak dalam foto 1996 tadi! Jangan-jangan kaset tua yang dulu sering Bapak putar waktu aku SD masih tersimpan di lapak Pak Darman?',
        nextNodeId: 'sreh_4',
      },
      sreh_4: {
        id: 'sreh_4',
        speaker: 'damar_batin',
        emotion: 'ragu',
        text: 'Nota ini bertanggal dua bulan sebelum Bapak jatuh sakit empat belas tahun silam. Mungkinkah Pak Darman di Stasiun Kereta Tua Senja masih menyimpan kaset C-60 titipan Bapak?',
        choices: [
          {
            id: 'sreh_c_gps',
            text: 'Pasang penanda arah ke Lapak Pak Darman di Stasiun Kereta Tua Senja untuk menanyakannya',
            subtext: 'Menelusuri jejak kaset pita C-60 peninggalan almarhum Bapak',
            nextNodeId: 'sreh_end_gps',
            effects: {
              kejujuranDiri: 1,
              setFlags: ['inspected_father_radio_slot'],
              customWaypoint: {
                label: 'Lapak Pak Darman (Kaset Bapak 1997)',
                position: [75.2, 0.1, -3.2],
              },
              journalEntry: {
                id: 'je_hint_radio_bapak',
                title: 'Nota Kecil di Balik Radio Kayu Dapur',
                body: 'Saat membuka tutup dek kaset radio tua peninggalan Bapak di dapur, kutemukan secarik nota lama bertuliskan tangan beliau: ada satu pita kaset C-60 yang pernah dititipkan untuk disambung di lapak Pak Darman dekat peron Stasiun Senja.',
                chapter: 1,
              },
              toast: 'Penanda GPS dipasang ke Lapak Pak Darman di Stasiun Kereta Tua Senja!',
            },
          },
          {
            id: 'sreh_c_later',
            text: 'Lipat kembali nota itu dengan hati-hati—nanti saat lewat Stasiun Senja aku akan mampir menemui Pak Darman',
            subtext: 'Menyimpan petunjuknya di ingatan sambil melanjutkan langkah',
            nextNodeId: 'sreh_end_later',
            effects: {
              setFlags: ['inspected_father_radio_slot'],
              journalEntry: {
                id: 'je_hint_radio_bapak',
                title: 'Nota Kecil di Balik Radio Kayu Dapur',
                body: 'Di dalam slot kaset Radio Kayu Dapur, terselip nota lama almarhum Bapak tentang pita C-60 yang dititipkan pada Pak Darman di Stasiun Kereta Tua Senja. Aku ingin menanyakannya saat mampir ke sana.',
                chapter: 1,
              },
              toast: 'Petunjuk tercatat di Jurnal: Temui Pak Darman di Stasiun Kereta Tua Senja.',
            },
          },
        ],
      },
      sreh_end_gps: {
        id: 'sreh_end_gps',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Jantungku berdegup pelan. Entah suara apa yang Bapak rekam di pita C-60 itu—aku harus menjemputnya pulang ke rumah ini.',
        onEnter: { playSfx: 'chime' },
      },
      sreh_end_later: {
        id: 'sreh_end_later',
        speaker: 'damar_batin',
        emotion: 'tenang',
        text: 'Kututup kembali jendela kecil dek kaset itu pelan-pelan. Saat sempat ke Stasiun Senja nanti, aku pasti menanyakannya pada Pak Darman.',
      },
    },
  },

  // === 2. PAK DARMAN MENYERAHKAN KASET PITA C-60 BAPAK (STASIUN KERETA TUA SENJA) ===
  story_darman_father_cassette: {
    id: 'story_darman_father_cassette',
    startNodeId: 'sdfc_1',
    nodes: {
      sdfc_1: {
        id: 'sdfc_1',
        speaker: 'pak_darman',
        emotion: 'hangat',
        text: 'Eh, Nak Damar... sini sebentar. Dari tadi waktu kamu berdiri di dekat meja buku saya, cara kamu menyipitkan mata waktu baca judul punggung buku itu... persis sekali sama almarhum Pak Wiryo, Bapakmu.',
        onEnter: { playSfx: 'page' },
        conditionalNext: [
          {
            requiredFlag: 'inspected_father_radio_slot',
            nextNodeId: 'sdfc_2_nota',
          },
          {
            requiredFlag: 'remembered_father_1996',
            nextNodeId: 'sdfc_2_1996',
          },
        ],
        nextNodeId: 'sdfc_2_natural',
      },
      sdfc_2_nota: {
        id: 'sdfc_2_nota',
        speaker: 'damar',
        emotion: 'haru',
        echoTag: 'Gema Petunjuk · Nota Radio Kayu Dapur',
        text: 'Pak Darman kenal almarhum Bapak? Kebetulan sekali, Pak... tadi di rumah saya menemukan kertas nota lama Bapak di dalam radio dapur—tertulis Bapak pernah menitipkan kaset C-60 yang pitanya kusut ke lapak Bapak.',
        nextNodeId: 'sdfc_3',
      },
      sdfc_2_1996: {
        id: 'sdfc_2_1996',
        speaker: 'damar',
        emotion: 'haru',
        echoTag: 'Gema Memori · Foto Sepia 1996 Plaza Nusantara',
        text: 'Pak Darman masih ingat almarhum Bapak? Tadi saya baru saja melihat potret lama Kota Senja tahun 1996 di dekat kantor... rasanya hari ini bayangan Bapak seperti sedang menyapa saya dari mana-mana.',
        nextNodeId: 'sdfc_3',
      },
      sdfc_2_natural: {
        id: 'sdfc_2_natural',
        speaker: 'damar',
        emotion: 'haru',
        text: 'Pak Darman... kenal sama almarhum Bapak saya?',
        nextNodeId: 'sdfc_3',
      },
      sdfc_3: {
        id: 'sdfc_3',
        speaker: 'pak_darman',
        emotion: 'hangat',
        text: 'Kenal dekat, Nak. Tahun sembilan puluhan setiap turun kereta sore dari bengkel dinas, Pak Wiryo selalu mampir ke lapak saya lima menit. Bukan beli buku mahal—cuma duduk minum teh tawar sambil cerita betapa bangganya dia punya anak laki-laki yang suka memetik gitar.',
        nextNodeId: 'sdfc_4',
      },
      sdfc_4: {
        id: 'sdfc_4',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Pak Darman membungkuk pelan ke kolong meja kayunya, mengangkat sebuah kaleng biskuit tua yang catnya sudah memudar, lalu membuka tutupnya yang diikat karet gelang.',
        onEnter: { playSfx: 'interact' },
        nextNodeId: 'sdfc_5',
      },
      sdfc_5: {
        id: 'sdfc_5',
        speaker: 'pak_darman',
        emotion: 'haru',
        text: 'Ini, Nak Damar. Dua bulan sebelum beliau berpulang, Bapakmu nitip kaset pita C-60 ini karena ujung pitanya kusut terlilit rol. Waktu selesai saya sambung pakai selotip tipis dan saya lap bersih... Bapakmu tidak pernah sempat datang lagi mengambilnya.',
        nextNodeId: 'sdfc_6',
      },
      sdfc_6: {
        id: 'sdfc_6',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Tanganku gemetar halus saat menerima kotak kaset mika yang mulai menguning itu. Di label kertasnya tertulis spidol biru pudar dengan huruf cetak Bapak yang sangat kukenal: "SUARA DAMAR LATIHAN GITAR — MINGGU SORE, 16 NOV 1997".',
        onEnter: { playSfx: 'chime' },
        nextNodeId: 'sdfc_7',
      },
      sdfc_7: {
        id: 'sdfc_7',
        speaker: 'pak_darman',
        emotion: 'tenang',
        text: 'Empat belas tahun saya simpan di dalam kaleng bersama silika kering supaya tidak berjamur, nunggu hari di mana kamu lewat stasiun ini tanpa berlari mengejar jam kantor. Bawalah pulang... kalau radio kayu di dapur rumahmu masih ada, putarlah sampai habis ujung pitanya ya.',
        choices: [
          {
            id: 'sdfc_c_home_gps',
            text: '"Terima kasih banyak, Pak Darman... tidak terbayang betapa berharganya ini buat saya. Saya akan memutarnya di radio dapur rumah."',
            subtext: 'Simpan Kaset Bapak (1997) ke Tas [I] & pasang GPS pulang ke Radio Dapur',
            nextNodeId: 'sdfc_end',
            effects: {
              kejujuranDiri: 2,
              kehadiranKeluarga: 2,
              setFlags: ['has_father_cassette_1997'],
              customWaypoint: {
                label: 'Radio Kayu Dapur (Putar Kaset Bapak 1997)',
                position: [-17.42, 0.08, 71.95],
              },
              journalEntry: {
                id: 'je_darman_kaset_bapak',
                title: 'Kaset C-60 dari Kaleng Tua Pak Darman',
                body: 'Selama empat belas tahun, Pak Darman di Stasiun Senja merawat sebuah kaset pita C-60 titipan almarhum Bapak bertuliskan "Suara Damar Latihan Gitar — Minggu Sore, 16 Nov 1997". Ia berpesan agar aku memutarnya sampai habis di Radio Kayu Dapur rumah.',
                chapter: 1,
              },
              toast: 'Kaset Pita C-60 Bapak (1997) masuk ke Tas [I]! Bawa pulang ke Radio Kayu Dapur.',
            },
          },
          {
            id: 'sdfc_c_keep_warm',
            text: 'Genggam kaset itu erat di dada dan membungkuk hormat pada Pak Darman sebelum menyimpannya ke dalam tas selempang',
            subtext: 'Simpan Kaset Bapak (1997) ke Tas [I] untuk diputar saat tiba di rumah nanti',
            nextNodeId: 'sdfc_end',
            effects: {
              kejujuranDiri: 2,
              kehadiranKeluarga: 2,
              setFlags: ['has_father_cassette_1997'],
              journalEntry: {
                id: 'je_darman_kaset_bapak',
                title: 'Kaset C-60 dari Kaleng Tua Pak Darman',
                body: 'Pak Darman menyerahkan kaset pita C-60 titipan almarhum Bapak dari tahun 1997 yang telah ia jaga empat belas tahun lamanya. Aku tidak sabar mendengarkan suara di dalamnya lewat Radio Kayu Dapur di rumah.',
                chapter: 1,
              },
              toast: 'Kaset Pita C-60 Bapak (1997) tersimpan di Tas Selempang [I]!',
            },
          },
        ],
      },
      sdfc_end: {
        id: 'sdfc_end',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Benda sekecil telapak tangan di dalam tas selempangku ini terasa hangat sekali—seolah almarhum Bapak baru saja menepuk pundakku dan mengajakku pulang bersama.',
      },
    },
  },

  // === 3. ADEGAN SINEMATIK AUDIO-MEMORY: MEMUTAR KASET 1997 DI RADIO KAYU DAPUR ===
  flashback_kaset_bapak_1997: {
    id: 'flashback_kaset_bapak_1997',
    startNodeId: 'fkb_1',
    flashback: {
      yearLabel: '16 NOVEMBER 1997 · PITA KASET C-60',
      title: 'Pita Tua di Balik Radio Dapur',
      locationLabel: 'Dapur & Ruang Tengah Jl. Melati · Rekaman Suara Bapak',
      mood: 'warm_sepia',
      epigraph: 'Di balik desis pita magnetik tua, ada suara seorang ayah yang tak pandai merangkai kata—namun meninggalkan seluruh cintanya di ujung gulungan kaset.',
    },
    nodes: {
      fkb_1: {
        id: 'fkb_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Kaset C-60 cokelat transparan itu masuk ke mulut Radio Kayu Dapur. Saat tombol besi PLAY kutekan turun—klak!—dua roda bergigi mulai berputar pelan. Selama tiga detik pertama, hanya terdengar desis hangat pita magnetik, kicau burung gereja, dan denting sendok beradu dengan gelas teh dari sore tahun 1997.',
        onEnter: { playSfx: 'switch' },
        nextNodeId: 'fkb_2',
      },
      fkb_2: {
        id: 'fkb_2',
        speaker: 'narator',
        emotion: 'ceria',
        text: '[Suara Rekaman 1997] Jreng... tek! Terdengar petikan senar gitar akustik murah yang sumbang, disusul rengekan bocah laki-laki berusia tujuh tahun—suaraku sendiri—di dekat mikrofon radio: "Aduuuh, Pak... ujung jari Damar perih banget ketekan senar besinya! Akor G-nya susah, nggak mau bunyi!"',
        onEnter: { playSfx: 'guitar' },
        nextNodeId: 'fkb_3',
      },
      fkb_3: {
        id: 'fkb_3',
        speaker: 'narator',
        emotion: 'hangat',
        text: '[Suara Almarhum Bapak · 1997] Terdengar batuk kecil dan tawa rendah yang serak namun luar biasa teduh: "Hahaha, sini coba Bapak tiup ujung jarinya. Nah, merah dikit nggak apa-apa, Mar... itu tandanya jari kamu lagi kenalan sama lagunya. Jangan ditekan pakai marah—pelan aja kayak megang burung kecil."',
        nextNodeId: 'fkb_4',
      },
      fkb_4: {
        id: 'fkb_4',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Napasku langsung tercekat di kerongkongan. Kedua tanganku bertumpu di pinggir meja dapur. Ya Tuhan... itu benar-benar suara asli Bapak. Cara beliau berdeham pelan sebelum bicara, intonasinya yang sabar—suara yang selama empat belas tahun mulai kabur di kepalaku kini terdengar sejernih beliau sedang duduk di belakangku.',
        nextNodeId: 'fkb_5',
      },
      fkb_5: {
        id: 'fkb_5',
        speaker: 'narator',
        emotion: 'hangat',
        text: '[Suara Rekaman 1997] Di dalam pita, gitar kembali berbunyi—empat ketukan akor G menuju C yang bersih dan hangat dipetik jari kasar Bapak, diiringi tawa riang Damar kecil yang ikut menyanyikan nada tanpa lirik. Lalu terdengar bunyi klik jeda... sebelum rekaman menyala lagi dengan desis rintik hujan malam.',
        onEnter: { playSfx: 'guitar' },
        nextNodeId: 'fkb_6',
      },
      fkb_6: {
        id: 'fkb_6',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Bagian ujung pita inilah yang dulu sempat kusut dan baru selesai disambung oleh Pak Darman—bagian yang belum pernah didengar siapa pun selama dua puluh sembilan tahun.',
        nextNodeId: 'fkb_7',
      },
      fkb_7: {
        id: 'fkb_7',
        speaker: 'narator',
        emotion: 'haru',
        text: '[Bisikan Almarhum Bapak · Malam 16 Nov 1997] "Damar sudah ketiduran di tikar sambil peluk gitarnya... Maafin Bapak ya, Nak. Tangan Bapak kasar bau oli bengkel, pulangnya sering kemalaman, nggak pintar ngomong sayang kayak bapak-bapak orang. Bapak rekam kaset ini... biar kalau suatu hari Bapak sudah nggak ada, dan kamu capek jadi orang dewasa, kamu masih bisa dengar suara Bapak."',
        onEnter: { playSfx: 'chime' },
        nextNodeId: 'fkb_8',
      },
      fkb_8: {
        id: 'fkb_8',
        speaker: 'narator',
        emotion: 'haru',
        text: '[Bisikan Almarhum Bapak · Ujung Pita] "Kalau nanti kamu sudah punya istri dan anak sendiri, jangan takut kelihatan lelah di depan mereka ya, Mar. Rumah itu bukan tempat orang pamer kuat—rumah itu tempat kamu boleh meletakkan tasmu. Bapak bangga sama kamu, bukan karena pangkatmu nanti tinggi, tapi karena kamu anak Bapak. Selamat tidur, jagoan kecil Bapak..."',
        nextNodeId: 'fkb_9',
      },
      fkb_9: {
        id: 'fkb_9',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Klak. Tombol kaset terangkat otomatis saat pita habis, menyisakan hening hangat di dapur rumah Jl. Melati. Air mataku jatuh menetes di atas punggung tanganku sendiri. Selama bertahun-tahun aku berlari mati-matian agar menjadi pria yang cukup kuat seperti bayanganku tentang Bapak—padahal Bapak sendiri menitipkan pesan agar aku berani meletakkan tasku di rumah.',
        choices: [
          {
            id: 'fkb_c_lay_down_bag',
            text: '"Aku dengar pesanmu, Pak... Mulai malam ini aku letakkan tasku di depan pintu. Aku nggak mau lagi pamer kuat sendirian di depan Nadia dan Kira."',
            subtext: 'Melepaskan beban ketakutan & berjanji hadir jujur di rumah',
            nextNodeId: 'fkb_end_lay_down',
            effects: {
              kejujuranDiri: 3,
              kehadiranKeluarga: 3,
              customWaypoint: null,
              setFlags: ['played_father_cassette_1997', 'father_tape_laid_down_burden'],
              phoneMessage: {
                id: 'msg_nadia_father_tape',
                sender: 'Nadia',
                preview: 'Mas... aku dengar suara kaset tua dari arah dapur barusan. Itu suara almarhum Bapak ya? Sini peluk aku sebentar kalau dadamu lagi penuh ❤️',
                timeLabel: 'Baru saja',
                threadId: 'nadia',
              },
              journalEntry: {
                id: 'je_kaset_bapak_1997',
                title: 'Pita Tua di Balik Radio Dapur (16 Nov 1997)',
                body: 'Dari ujung pita C-60 yang disambung Pak Darman, kudengar bisikan almarhum Bapak saat aku ketiduran usia tujuh tahun: "Rumah itu bukan tempat orang pamer kuat—rumah itu tempat kamu boleh meletakkan tasmu." Empat belas tahun setelah kepergiannya, Bapak masih menuntunku pulang.',
                chapter: 1,
              },
              toast: 'Kenangan Kaset Bapak (1997) terbuka di Pesan Suara HP [H] & Jurnal!',
            },
          },
          {
            id: 'fkb_c_kira_chord',
            text: '"Terima kasih sudah mengajari akor G pertamaku dengan sabar, Pak. Aku janji akan mengajari Kira memetik gitar tanpa tergesa—persis seperti Bapak mengajariku."',
            subtext: 'Meneruskan kelembutan almarhum Bapak kepada Kira',
            nextNodeId: 'fkb_end_kira_chord',
            effects: {
              kehadiranKeluarga: 3,
              kejujuranDiri: 2,
              customWaypoint: null,
              setFlags: ['played_father_cassette_1997', 'father_tape_guitar_legacy'],
              phoneMessage: {
                id: 'msg_nadia_father_tape',
                sender: 'Nadia',
                preview: 'Mas... barusan suara petikan gitar tahun 1997 dari radio dapur itu suara Bapak sama kamu waktu kecil ya? Kira sampai senyum-senyum denger suara kecil Ayahnya 🥺',
                timeLabel: 'Baru saja',
                threadId: 'nadia',
              },
              journalEntry: {
                id: 'je_kaset_bapak_1997',
                title: 'Akor Pertama dari Tangan Bapak (1997)',
                body: 'Mendengar rekaman suaraku usia tujuh tahun mengeluh senar gitar perih—dan cara Bapak meniup jariku sambil tertawa sabar—membuatku menangis lega. Kini giliranku mewariskan kesabaran yang sama untuk Kira.',
                chapter: 1,
              },
              toast: 'Kenangan Kaset Bapak (1997) terbuka di Pesan Suara HP [H] & Jurnal!',
            },
          },
          {
            id: 'fkb_c_share_nadia',
            text: 'Usap air mata di pipi tanpa malu, lalu simpan kaset itu baik-baik agar nanti malam bisa kuputar lagi berdua bersama Nadia di meja makan',
            subtext: 'Membuka ruang rapuh bersama pasangan hidup',
            nextNodeId: 'fkb_end_share_nadia',
            effects: {
              kejujuranDiri: 3,
              kehadiranKeluarga: 2,
              customWaypoint: null,
              setFlags: ['played_father_cassette_1997', 'father_tape_shared_tears'],
              phoneMessage: {
                id: 'msg_nadia_father_tape',
                sender: 'Nadia',
                preview: 'Mas, mata kamu sembab ya habis nyalain radio kayu Bapak di dapur? Jangan disembunyiin dariku ya... nanti malam kita dengerin bareng sambil minum teh hangat ❤️',
                timeLabel: 'Baru saja',
                threadId: 'nadia',
              },
              journalEntry: {
                id: 'je_kaset_bapak_1997',
                title: 'Suara yang Menunggu Dua Puluh Sembilan Tahun',
                body: 'Di ujung kaset tahun 1997, Bapak berbisik bahwa ia bangga padaku bukan karena pangkatku kelak, melainkan semata karena aku anaknya. Nanti malam aku ingin memutar pita ini lagi untuk Nadia, tanpa topeng kuat lagi.',
                chapter: 1,
              },
              toast: 'Kenangan Kaset Bapak (1997) terbuka di Pesan Suara HP [H] & Jurnal!',
            },
          },
        ],
      },
      fkb_end_lay_down: {
        id: 'fkb_end_lay_down',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Kuusap kayu jati radio tua itu sekali lagi seperti menyentuh punggung tangan Bapak. Untuk pertama kalinya setelah belasan tahun, dadaku terasa lapang sekali. Aku sudah pulang, Pak.',
        onEnter: { playSfx: 'guitar' },
      },
      fkb_end_kira_chord: {
        id: 'fkb_end_kira_chord',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: '"Jangan ditekan pakai marah—pelan aja kayak megang burung kecil." Kalimat Bapak dari tahun 1997 itu akan kujaga seumur hidupku setiap kali menggenggam tangan Kira.',
        onEnter: { playSfx: 'guitar' },
      },
      fkb_end_share_nadia: {
        id: 'fkb_end_share_nadia',
        speaker: 'damar_batin',
        emotion: 'tenang',
        text: 'Ponsel di sakuku bergetar lembut membawa pesan dari Nadia. Ternyata benar kata Bapak—begitu kita berani berhenti pamer kuat, rumah langsung memeluk kita kembali.',
        onEnter: { playSfx: 'phone' },
      },
    },
  },

  // === 4. DIALOG HANGAT SAAT KEMBALI MENYAPA PAK DARMAN SETELAH MEMUTAR KASET BAPAK ===
  story_darman_after_cassette: {
    id: 'story_darman_after_cassette',
    startNodeId: 'sdac_1',
    nodes: {
      sdac_1: {
        id: 'sdac_1',
        speaker: 'damar',
        emotion: 'haru',
        text: 'Pak Darman... kaset C-60 tahun 1997 dari Bapak sudah saya putar sampai habis di radio kayu dapur. Sambungan selotip Bapak jernih sekali—saya bisa mendengar pesan terakhir almarhum di ujung pitanya.',
        onEnter: { playSfx: 'chime' },
        nextNodeId: 'sdac_2',
      },
      sdac_2: {
        id: 'sdac_2',
        speaker: 'pak_darman',
        emotion: 'haru',
        text: 'Alhamdulillah... lega betul hati saya mendengarnya, Nak Damar. Berarti tugas empat belas tahun kaleng biskuit tua saya sudah lunas hari ini.',
        nextNodeId: 'sdac_3',
      },
      sdac_3: {
        id: 'sdac_3',
        speaker: 'pak_darman',
        emotion: 'hangat',
        text: 'Wajahmu juga kelihatan jauh lebih teduh sekarang. Jaga baik-baik istri sama putri kecilmu di Jl. Melati ya—Pak Wiryo pasti tersenyum tenang melihatmu hari ini.',
        onEnd: {
          kehadiranKeluarga: 1,
          kejujuranDiri: 1,
          setFlags: ['thanked_darman_father_tape'],
          toast: 'Pak Darman tersenyum haru mendengar kaset Bapak akhirnya kembali ke rumah.',
        },
      },
    },
  },
};
