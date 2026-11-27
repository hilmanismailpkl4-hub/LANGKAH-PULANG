import { DialogueScript } from '../types/game';

/**
 * Alur Cerita Solo Penutup Lingkaran Warga Kota Senja:
 * 1. Pak Slamet (Angkringan Jl. Melati): "Buku Kas Kecil yang Dicoret Lunas" (`[-11.85, 0, 41.35]`)
 * 2. Pak Budi (Penjaga Taman & Dermaga Danau Senja): "Dua Puluh Musim Menjaga Danau" (`[-66.45, 0, -37.85]`)
 */
export const SLAMET_BUDI_DEEP_DIALOGUES: Record<string, DialogueScript> = {
  // === 1. PAK SLAMET: BUKU HUTANG YANG DICORET "LUNAS — DIBAYAR DOA" ===
  story_pak_slamet_buku_lunas: {
    id: 'story_pak_slamet_buku_lunas',
    startNodeId: 'spsb_1',
    nodes: {
      spsb_1: {
        id: 'spsb_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Di kolong rak gelas Gerobak Angkringan Pak Slamet dekat panci jahe yang mengepul, terselip sebuah buku tulis tipis bersampul motif batik sogan yang ujung-ujung kertasnya keriting terkena uap panas.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'spsb_2',
      },
      spsb_2: {
        id: 'spsb_2',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Angin sore menyingkap halaman depannya. Kukira itu buku catatan utang pelanggan, namun setiap baris nama anak kos dan pekerja malam di dalamnya telah dicoret spidol merah oleh Pak Slamet: "LUNAS — DIBAYAR DOA". Dan di baris paling atas halaman pertama tertulis: "2017 · Mas Damar & Mas Bima — 4 Sego Kucing (Habis Latihan Musik)".',
        nextNodeId: 'spsb_3',
      },
      spsb_3: {
        id: 'spsb_3',
        speaker: 'pak_slamet',
        emotion: 'ceria',
        text: 'Pak Slamet tertawa renyah sambil membalik tempe bacem di atas anglo arang. "Walah, ketahuan buku rahasia Bapak, Mas Damar! Waktu tahun 2017 itu kalian berdua ngamen pulang kehujanan, kantong celana tinggal koin seribuan, tapi malu mau bilang kurang!"',
        onEnter: { playSfx: 'coffee' },
        nextNodeId: 'spsb_4',
      },
      spsb_4: {
        id: 'spsb_4',
        speaker: 'damar',
        emotion: 'haru',
        text: 'Pak Slamet... kenapa semua nama perantau yang ngutang makan di buku ini Bapak coret lunas sendiri tanpa pernah ditagih?',
        nextNodeId: 'spsb_5',
      },
      spsb_5: {
        id: 'spsb_5',
        speaker: 'pak_slamet',
        emotion: 'hangat',
        text: 'Soalnya gerobak ini berdiri juga dari utang budi yang nggak bisa saya bayar ke orangnya langsung, Mas. Tahun sembilan puluh delapan waktu saya baru turun kereta dari kampung tanpa kenal siapa-siapa dan lapar dua hari... ada bapak-bapak berseragam bengkel dinas yang membelikan saya dua bungkus nasi hangat di dekat stasiun.',
        conditionalNext: [
          {
            requiredAnyFlags: ['played_father_cassette_1997', 'remembered_father_1996'],
            nextNodeId: 'spsb_5_echo_father',
          },
        ],
        nextNodeId: 'spsb_6',
      },
      spsb_5_echo_father: {
        id: 'spsb_5_echo_father',
        speaker: 'damar_batin',
        emotion: 'haru',
        echoTag: 'Gema Lintas Generasi · Seragam Bengkel Almarhum Bapak (1998)',
        text: 'Jantungku berdegup kencang. Tahun 1998, seragam bengkel dinas di dekat Stasiun Senja... jangan-jangan orang itu...',
        nextNodeId: 'spsb_6',
      },
      spsb_6: {
        id: 'spsb_6',
        speaker: 'pak_slamet',
        emotion: 'haru',
        text: 'Baru bertahun-tahun kemudian waktu saya mulai mangkal di mulut Jl. Melati ini dan melihat foto duka di rumah lama keluarga Mas Damar, saya sadar: bapak berjaket bengkel tahun 1998 itu ternyata almarhum Pak Wiryo, Bapaknya Mas Damar sendiri. Pesan beliau waktu itu cuma satu: "Kalau besok sampeyan sudah cukup makan, kenyangkan perut anak orang lain yang lagi berjuang pulang."',
        onEnter: { playSfx: 'chime' },
        nextNodeId: 'spsb_7',
      },
      spsb_7: {
        id: 'spsb_7',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Dadaku hangat luar biasa hingga mataku basah. Dua bungkus nasi yang diberikan almarhum Bapak dua puluh delapan tahun silam tumbuh menjadi gerobak angkringan yang menghangatkan ratusan perantau—bahkan diam-diam mengenyangkan perutku sendiri saat aku muda.',
        choices: [
          {
            id: 'spsb_c_pay_forward',
            text: 'Selipkan selembar uang di bawah kaleng kerupuk Pak Slamet: "Pak, ini buat sepuluh bungkus sego kucing perantau berikutnya yang kemalaman lewat sini—kita teruskan pesan Bapak sama-sama."',
            subtext: 'Melanjutkan rantai kebaikan almarhum Bapak di mulut Jl. Melati',
            nextNodeId: 'spsb_end_forward',
            effects: {
              kehadiranKeluarga: 3,
              kejujuranDiri: 3,
              setFlags: ['heard_pak_slamet_ledger_story', 'slamet_paid_forward_meals'],
              journalEntry: {
                id: 'je_pak_slamet_ledger',
                title: 'Buku Kas yang Dicoret "Dibayar Doa" (Pak Slamet)',
                body: 'Di bawah gerobak Pak Slamet, kutemukan buku catatan makan yang dicoret lunas—termasuk namaku dan Bima tahun 2017. Ternyata Pak Slamet melakukannya untuk meneruskan pesan almarhum Bapakku yang pernah memberinya makan saat pertama merantau tahun 1998. Malam ini kutitipkan sepuluh porsi hangat untuk perantau berikutnya.',
                chapter: 1,
              },
              toast: 'Rantai kebaikan almarhum Bapak & Pak Slamet tercatat di Jurnal & Epilog!',
            },
          },
          {
            id: 'spsb_c_ginger_toast',
            text: 'Genggam tangan hangat Pak Slamet dan ucapkan terima kasih karena telah menjaga ujung jalan rumah kami selama bertahun-tahun',
            subtext: 'Menghormati penjaga kehangatan malam di mulut Perumahan Melati',
            nextNodeId: 'spsb_end_warm',
            effects: {
              kehadiranKeluarga: 3,
              kejujuranDiri: 2,
              setFlags: ['heard_pak_slamet_ledger_story'],
              journalEntry: {
                id: 'je_pak_slamet_ledger',
                title: 'Dua Bungkus Nasi dari Tahun 1998 (Pak Slamet)',
                body: 'Kebaikan almarhum Bapak di stasiun dua puluh delapan tahun lalu ternyata tak pernah padam—ia menyala setiap malam di bara arang angkringan Pak Slamet di mulut Jl. Melati.',
                chapter: 1,
              },
              toast: 'Kisah buku kas Pak Slamet tersimpan di Jurnal Cerita!',
            },
          },
        ],
      },
      spsb_end_forward: {
        id: 'spsb_end_forward',
        speaker: 'pak_slamet',
        emotion: 'haru',
        text: 'Pak Slamet menangkup kedua tangannya di depan dada dengan mata berkaca-kaca. "Matur nuwun sanget, Mas Damar... Almarhum Pak Wiryo pasti senyum lebar melihat putranya hari ini. Pulanglah dengan hati hangat ke rumah ya, Mas!"',
        onEnter: { playSfx: 'chime' },
      },
      spsb_end_warm: {
        id: 'spsb_end_warm',
        speaker: 'pak_slamet',
        emotion: 'hangat',
        text: '"Selama bara arang Bapak masih nyala di mulut gang ini, Mas Damar nggak pernah jalan pulang sendirian," ujar Pak Slamet tulus.',
        onEnter: { playSfx: 'chime' },
      },
    },
  },

  // === 2. PAK BUDI: BUKU CATATAN DUA PULUH MUSIM MENJELANG PENSIUN ===
  story_pak_budi_dua_puluh_musim: {
    id: 'story_pak_budi_dua_puluh_musim',
    startNodeId: 'spbd_1',
    nodes: {
      spbd_1: {
        id: 'spbd_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Di dekat bangku kayu tempat Pak Budi beristirahat di tepi selatan Danau Senja, tergeletak topi rimba hijau penjaga taman dan sebuah buku catatan lapangan bersampul kulit sintetis yang penuh tanggal pergantian musim.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'spbd_2',
      },
      spbd_2: {
        id: 'spbd_2',
        speaker: 'pak_budi',
        emotion: 'tenang',
        text: 'Angin sore di dermaga selalu jujur ya, Mas Damar. Bulan depan genap dua puluh tahun saya berdinas menyapu daun dan menyalakan lampu di Taman Danau Senja ini—sekaligus bulan terakhir sebelum saya pensiun pulang ke desa.',
        nextNodeId: 'spbd_3',
      },
      spbd_3: {
        id: 'spbd_3',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Dua puluh tahun waktu yang panjang sekali, Pak Budi. Pasti Bapak hafal hampir semua wajah yang datang ke danau ini ya?',
        nextNodeId: 'spbd_4',
      },
      spbd_4: {
        id: 'spbd_4',
        speaker: 'pak_budi',
        emotion: 'haru',
        text: 'Hafal sekali, Mas. Dan selama dua puluh tahun duduk di tepi air ini, ada satu pola sedih yang selalu berulang: saya melihat anak-anak kecil diajak ayahnya makan es krim di dermaga ini... lalu sepuluh, lima belas tahun kemudian mereka lewat lagi memakai kemeja rapi sambil menatap layar ponsel, terburu-buru sampai lupa menoleh ke air danau.',
        nextNodeId: 'spbd_5',
      },
      spbd_5: {
        id: 'spbd_5',
        speaker: 'pak_budi',
        emotion: 'sedih',
        text: 'Banyak dari mereka baru kembali duduk tenang di bangku taman ini waktu rambutnya sudah memutih dan lututnya mulai kaku, Mas Damar... sambil bercerita ke saya betapa cepatnya rumah mereka mendadak sepi karena anak-anaknya sudah pergi merantau.',
        nextNodeId: 'spbd_6',
      },
      spbd_6: {
        id: 'spbd_6',
        speaker: 'pak_budi',
        emotion: 'hangat',
        text: 'Lima tahun lalu saya masih ingat melihat Mas Damar dan istri mengajari balita kecil berjalan tertatih-tatih di rumput dekat pohon trembesi itu. Sebelum saya menanggalkan seragam taman ini bulan depan... saya senang melihat Mas Damar berhenti berjalan cepat hari ini. Selagi tangan putri kecil Mas masih muat menggenggam satu jari telunjuk Mas, bawalah dia ke tepi danau lagi ya.',
        onEnter: { playSfx: 'chime' },
        choices: [
          {
            id: 'spbd_c_family_walk_vow',
            text: '"Terima kasih atas dua puluh tahunnya menjaga taman kota kami, Pak Budi. Sebelum Bapak pensiun bulan depan, saya janji membawa Nadia dan Kira duduk di dermaga ini tanpa satu pun ponsel menyala."',
            subtext: 'Menghormati pengabdian dua dekade Pak Budi dengan janji keluarga yang nyata',
            nextNodeId: 'spbd_end_vow',
            effects: {
              kehadiranKeluarga: 3,
              kejujuranDiri: 3,
              setFlags: ['heard_pak_budi_seasons_story', 'budi_promised_family_dock'],
              journalEntry: {
                id: 'je_pak_budi_seasons',
                title: 'Dua Puluh Musim di Tepi Danau Senja (Pak Budi)',
                body: 'Menjelang masa pensiunnya bulan depan, Pak Budi membagikan kebijaksanaan dua puluh tahun menjaga Danau Senja: jangan menunggu rambut memutih untuk kembali duduk tenang bersama orang yang kita cintai, selagi tangan kecil Kira masih menggenggam jari telunjukku.',
                chapter: 1,
              },
              toast: 'Pesan perpisahan teduh Pak Budi tercatat di Jurnal & Epilog!',
            },
          },
          {
            id: 'spbd_c_thank_keeper',
            text: 'Jabat tangan Pak Budi dengan penuh hormat atas keteduhan taman dan lampu dermaga yang telah menjadi saksi tumbuhnya keluarga kecilku',
            subtext: 'Berterima kasih pada penjaga senyap ruang teduh Kota Senja',
            nextNodeId: 'spbd_end_thanks',
            effects: {
              kejujuranDiri: 2,
              kehadiranKeluarga: 3,
              setFlags: ['heard_pak_budi_seasons_story'],
              journalEntry: {
                id: 'je_pak_budi_seasons',
                title: 'Penjaga Daun dan Lampu Dermaga (Pak Budi)',
                body: 'Pak Budi masih mengingat hari ketika aku dan Nadia mengajari Kira melangkah pertama kali di rumput taman lima tahun silam. Taman ini selalu sabar menunggu kami kembali melambat.',
                chapter: 1,
              },
              toast: 'Kenangan bersama Pak Budi tersimpan di Jurnal Cerita!',
            },
          },
        ],
      },
      spbd_end_vow: {
        id: 'spbd_end_vow',
        speaker: 'pak_budi',
        emotion: 'ceria',
        text: 'Wajah teduh Pak Budi merekah dalam senyum paling damai. "Kalau saya sempat melihat kalian bertiga duduk di ujung dermaga itu sebelum saya pulang kampung, lengkap sudah dua puluh tahun pengabdian saya di taman ini, Mas Damar."',
        onEnter: { playSfx: 'chime' },
      },
      spbd_end_thanks: {
        id: 'spbd_end_thanks',
        speaker: 'pak_budi',
        emotion: 'hangat',
        text: '"Danau ini tidak pernah lari ke mana-mana, Mas Damar. Kapan pun kepala terasa bising, duduklah mendengarkan riak airnya."',
        onEnter: { playSfx: 'chime' },
      },
    },
  },
};
