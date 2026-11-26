import { DialogueScript } from '../types/game';

/**
 * 3 Adegan Kilas Balik Memori Sinematik (Playable Flashbacks) untuk LANGKAH PULANG.
 * Dapat dihidupkan langsung dari Galeri Kenangan HP Damar, Buku Album Keluarga di Rumah,
 * maupun titik memori asli di dunia 3D (Poster 2018 Kedai Bima, Gitar Nada Lama, & Meja Makan Jl. Melati).
 */
export const FLASHBACK_DIALOGUES: Record<string, DialogueScript> = {
  // =========================================================================
  // KILAS BALIK 1 — 14 OKTOBER 2018 · PANGGUNG AKUSTIK TAMAN KOTA
  // =========================================================================
  flashback_panggung_2018: {
    id: 'flashback_panggung_2018',
    startNodeId: 'fb1_1',
    flashback: {
      yearLabel: '14 OKTOBER 2018',
      title: 'Senar yang Putus, Tawa yang Tinggal',
      locationLabel: 'Panggung Akustik Taman Kota · Pukul 20.10',
      mood: 'warm_sepia',
      epigraph: 'Di bawah dua lampu sorot kuning sewaan, saat kita belum punya apa-apa selain berani bernyanyi.',
    },
    nodes: {
      fb1_1: {
        id: 'fb1_1',
        speaker: 'narator',
        emotion: 'hangat',
        text: 'Udara Oktober di tepi Danau Senja beraroma rumput basah dan gorengan hangat. Panggung kayu setinggi setengah meter itu hanya diterangi dua lampu sorot kuning yang mengundang laron berputar pelan.',
        onEnter: { playSfx: 'guitar' },
        nextNodeId: 'fb1_2',
      },
      fb1_2: {
        id: 'fb1_2',
        speaker: 'bima',
        emotion: 'ceria',
        text: 'Mar, penontonnya lumayan rame tuh, ada dua puluh orang lebih! Jangan tegang kayak mau sidang skripsi dong. Ingat, habis lagu kedua kita selipin intro "Track 4" ya.',
        nextNodeId: 'fb1_3',
      },
      fb1_3: {
        id: 'fb1_3',
        speaker: 'damar',
        emotion: 'ragu',
        text: 'Track 4 belum kelar reff-nya, Bim... lirik akhirnya masih bolong-bolong. Gimana kalau mereka bingung?',
        nextNodeId: 'fb1_4',
      },
      fb1_4: {
        id: 'fb1_4',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Belum sempat Bima menimpali, giliran "Langkah Kecil" dipanggil. Di tengah lagu kedua, tepat ketika Damar memetik nada tinggi di fret ketujuh—CTAK! Senar satu gitar mahoninya putus melenting ke udara.',
        nextNodeId: 'fb1_5',
      },
      fb1_5: {
        id: 'fb1_5',
        speaker: 'damar_batin',
        emotion: 'lelah',
        text: 'Jariku membeku di leher gitar. Mukaku langsung panas. Di kepalaku cuma ada satu suara: "Selesai sudah, Mar. Kamu memang nggak pernah siap naik panggung."',
        nextNodeId: 'fb1_6',
      },
      fb1_6: {
        id: 'fb1_6',
        speaker: 'narator',
        emotion: 'hangat',
        text: 'Namun dari bangku kayu barisan paling depan, terdengar tawa jernih yang tidak sedikit pun terdengar mengejek. Seorang perempuan berkardigan bata mulai bertepuk tangan pelan mengikuti ketukan cajón Bima—dan satu per satu penonton ikut menepuk tangan.',
        nextNodeId: 'fb1_7',
      },
      fb1_7: {
        id: 'fb1_7',
        speaker: 'bima',
        emotion: 'ceria',
        text: 'Lima senar masih cukup, Mar! Hajar aja terus! Lihat tuh, barisan depan malah jadi dirigen kita!',
        nextNodeId: 'fb1_8',
      },
      fb1_8: {
        id: 'fb1_8',
        speaker: 'narator',
        emotion: 'hangat',
        text: 'Satu jam kemudian, gerimis turun halus. Di bawah tenda terpal biru penjual mi rebus pinggir taman, perempuan berkardigan bata itu duduk di bangku panjang sebelah Damar sambil meniup kuah panasnya.',
        nextNodeId: 'fb1_9',
      },
      fb1_9: {
        id: 'fb1_9',
        speaker: 'nadia',
        emotion: 'ceria',
        text: 'Halo, aku Nadia. Tadi keren banget lho waktu kamu nekat lanjut pakai lima senar... oh ya, potongan lagu terakhir yang kamu gumamin tadi judulnya apa? Kok kayaknya belum selesai?',
        nextNodeId: 'fb1_10',
      },
      fb1_10: {
        id: 'fb1_10',
        speaker: 'damar',
        emotion: 'ragu',
        text: 'Eh... itu cuma sketsa, judul sementaranya "Pulang". Memang belum selesai kutulis bait akhirnya...',
        choices: [
          {
            id: 'fb1_choice_honest',
            text: '"Jujur aja, Nad... aku belum tahu rasanya punya tempat yang benar-benar bikin ingin pulang."',
            subtext: 'Mengakui ruang kosong di hati tanpa berpura-pura kuat',
            nextNodeId: 'fb1_res_honest',
            effects: {
              kejujuranDiri: 2,
              kehadiranKeluarga: 1,
            },
          },
          {
            id: 'fb1_choice_warm',
            text: '"Mungkin lagunya cuma nunggu orang yang tepat buat duduk di barisan depan sambil ketawa lepas kayak tadi."',
            subtext: 'Menyambut kehangatan malam pertama itu dengan tulus',
            nextNodeId: 'fb1_res_warm',
            effects: {
              kehadiranKeluarga: 2,
              kejujuranDiri: 1,
            },
          },
          {
            id: 'fb1_choice_ambition',
            text: '"Lagu bagus butuh waktu lama. Sekarang aku lagi fokus kerja keras dulu biar nanti hidupku mapan."',
            subtext: 'Sejak muda pun Damar sudah membawa kecemasan tentang masa depan',
            nextNodeId: 'fb1_res_ambition',
            effects: {
              ambisiPelarian: 1,
              kejujuranDiri: 1,
            },
          },
        ],
      },
      fb1_res_honest: {
        id: 'fb1_res_honest',
        speaker: 'nadia',
        emotion: 'hangat',
        text: 'Senyum Nadia melunak. "Kalau suatu hari kamu ketemu tempat itu... janji ya, aku orang pertama yang dengar versi lengkapnya. Bahkan kalau senarnya putus lagi, aku tetap duduk di baris depan."',
        nextNodeId: 'fb1_end',
      },
      fb1_res_warm: {
        id: 'fb1_res_warm',
        speaker: 'nadia',
        emotion: 'ceria',
        text: 'Nadia tertawa kecil, menyembunyikan pipinya di balik uap mangkuk mi rebus. "Wah, gombalnya halus ya anak akustik. Tapi boleh deh—minggu depan kalau manggung lagi, kabari aku ya, Damar."',
        nextNodeId: 'fb1_end',
      },
      fb1_res_ambition: {
        id: 'fb1_res_ambition',
        speaker: 'nadia',
        emotion: 'tenang',
        text: 'Nadia mengangguk pelan sambil menatap rintik gerimis. "Mengejar hidup yang aman itu wajar, Damar... tapi jangan sampai karena terlalu keras berlari, kamu lupa cara berhenti buat dengerin nadamu sendiri ya."',
        nextNodeId: 'fb1_end',
      },
      fb1_end: {
        id: 'fb1_end',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Cahaya kuning panggung 2018 itu perlahan memudar kembali ke hari ini. Dulu, hanya dengan lima senar tersisa dan semangkuk mi rebus pinggir jalan, aku tidak pernah takut kehabisan kata di depan Nadia. Kenapa sekarang, saat rumah kita jauh lebih hangat, aku justru sering membisu?',
        onEnd: {
          playSfx: 'chime',
          setFlags: ['flashback_2018_done'],
          journalEntry: {
            id: 'je_flashback_2018',
            title: 'Kilas Balik · 14 Oktober 2018 (Panggung Taman Kota)',
            body: 'Aku menghidupkan kembali malam pertama Nadia menonton kami bermain musik. Senar satu gitarku putus di lagu kedua, tapi tawa dan tepuk tangannya dari baris depan menyelamatkan seluruh malam itu. Aku berutang versi utuh lagu "Pulang" padanya.',
            chapter: 1,
          },
          phoneMessage: {
            id: 'msg_bima_fb2018',
            sender: 'Bima (Kopi Sudut)',
            preview: 'Eh Mar, barusan gue beresin rak belakang nemu tiket parkir Taman Kota 2018! Inget nggak muka lo panik pas senar putus tapi Nadia malah ketawa paling kenceng?',
            timeLabel: 'Baru saja',
            threadId: 'bima',
          },
          toast: 'Kilas Balik 2018 tersimpan di Jurnal — pesan baru masuk dari Bima di HP!',
        },
      },
    },
  },

  // =========================================================================
  // KILAS BALIK 2 — 08 AGUSTUS 2020 · MALAM MENJUAL GITAR DEMI KELAHIRAN KIRA
  // =========================================================================
  flashback_jual_gitar_2020: {
    id: 'flashback_jual_gitar_2020',
    startNodeId: 'fb2_1',
    flashback: {
      yearLabel: '08 AGUSTUS 2020',
      title: 'Mahoni di Bawah Hujan Agustus',
      locationLabel: 'Toko Musik "Nada Lama" · Pukul 21.40',
      mood: 'rain_melancholy',
      epigraph: 'Ada pengorbanan yang sengaja tidak pernah diceritakan, karena cinta tidak selalu butuh tanda terima.',
    },
    nodes: {
      fb2_1: {
        id: 'fb2_1',
        speaker: 'narator',
        emotion: 'sedih',
        text: 'Hujan Agustus turun deras tanpa jeda, mengetuk kaca etalase Toko Musik "Nada Lama" yang hampir tutup. Lampu neon putih di langit-langit berkedip pelan. Damar berdiri di depan pintu dengan jaket basah kuyup, memeluk erat sebuah tas gitar kulit tua di dadanya.',
        onEnter: { playSfx: 'door' },
        nextNodeId: 'fb2_2',
      },
      fb2_2: {
        id: 'fb2_2',
        speaker: 'mas_bagas',
        emotion: 'ragu',
        text: 'Lho, Mar? Jam segini ujan-ujanan? Masuk sini dulu, handuk ada di belakang meja—tunggu... itu gitar mahoni kamu, kan? Senarnya putus lagi?',
        nextNodeId: 'fb2_3',
      },
      fb2_3: {
        id: 'fb2_3',
        speaker: 'damar',
        emotion: 'lelah',
        text: 'Nggak, Gas. Senarnya masih bagus semua. Baru aku bersihin tadi sore... aku mau tanya, kalau malam ini aku lepas gitar ini di sini, bisa langsung cair tunai nggak?',
        nextNodeId: 'fb2_4',
      },
      fb2_4: {
        id: 'fb2_4',
        speaker: 'narator',
        emotion: 'sedih',
        text: 'Mas Bagas terdiam cukup lama. Tangannya membuka ritsleting tas gitar itu pelan-pelan, menyentuh goresan tipis dekat lubang suara yang dulu dibuat Damar sendiri dengan koin logam saat latihan.',
        nextNodeId: 'fb2_5',
      },
      fb2_5: {
        id: 'fb2_5',
        speaker: 'mas_bagas',
        emotion: 'sedih',
        text: 'Mar... lu serius? Gue inget banget dulu lo rela makan nasi telur dua bulan biar kebeli kayu mahoni ini. Ada apa, Mar? Cerita sama gue.',
        nextNodeId: 'fb2_6',
      },
      fb2_6: {
        id: 'fb2_6',
        speaker: 'damar',
        emotion: 'haru',
        text: 'Tadi sore dokter bilang posisi bayi Nadia melintang, harus operasi darurat besok subuh di RS Harapan. Tabunganku sudah masuk semua buat uang muka... masih kurang dua juta delapan ratus buat ruang rawat sama obat Nadia.',
        nextNodeId: 'fb2_7',
      },
      fb2_7: {
        id: 'fb2_7',
        speaker: 'damar_batin',
        emotion: 'sedih',
        text: 'Tenggorokanku tercekat, tapi aku tidak boleh menangis di sini. Nadia sedang menahan takut sendirian di kamar rumah sakit. Satu-satunya tugasku malam ini adalah kembali membawa kuitansi lunas dan senyum yang tenang.',
        nextNodeId: 'fb2_8',
      },
      fb2_8: {
        id: 'fb2_8',
        speaker: 'mas_bagas',
        emotion: 'haru',
        text: 'Mas Bagas menarik napas dalam, membuka laci kasir kayu, lalu menghitung lembaran uang ke dalam amplop cokelat polos. Suaranya nyaris pecah. "Ini tiga juta dua ratus, Mar. Jangan ditawar. Tapi sebelum lo pergi... bilang satu hal ke gue."',
        choices: [
          {
            id: 'fb2_choice_father',
            text: '"Ambil saja, Gas. Besok subuh anakku mau lahir—aku nggak butuh gitar buat jadi ayah yang baik."',
            subtext: 'Menaruh seluruh hati pada keselamatan Nadia dan Kira',
            nextNodeId: 'fb2_res_father',
            effects: {
              kehadiranKeluarga: 2,
              kejujuranDiri: 1,
            },
          },
          {
            id: 'fb2_choice_secret',
            text: '"Tolong jangan bilang ke Nadia atau Bima ya, Gas. Aku nggak mau Nadia merasa bersalah di ruang bersalin."',
            subtext: 'Menyimpan beban seorang diri agar orang tercinta tenang',
            nextNodeId: 'fb2_res_secret',
            effects: {
              kehadiranKeluarga: 2,
              ambisiPelarian: 1,
            },
          },
          {
            id: 'fb2_choice_promise',
            text: '"Jaga baik-baik ya, Gas... kalau suatu hari nanti aku punya lagu yang utuh buat anakku, aku janji balik menebusnya."',
            subtext: 'Menitipkan sepotong mimpi tanpa benar-benar membunuhnya',
            nextNodeId: 'fb2_res_promise',
            effects: {
              kejujuranDiri: 3,
              kehadiranKeluarga: 1,
            },
          },
        ],
      },
      fb2_res_father: {
        id: 'fb2_res_father',
        speaker: 'mas_bagas',
        emotion: 'haru',
        text: 'Mas Bagas menepuk bahu basah Damar dengan kuat. "Lo udah jadi ayah yang hebat bahkan sebelum bayi lo nangis pertama kali, Mar. Tapi dengar ya—gitar ini nggak bakal gue taruh di etalase jual."',
        nextNodeId: 'fb2_9',
      },
      fb2_res_secret: {
        id: 'fb2_res_secret',
        speaker: 'mas_bagas',
        emotion: 'tenang',
        text: '"Mulut gue terkunci rapat, Mar," jawab Mas Bagas pelan. "Tapi jangan kebiasaan mikul semua ketakutan sendirian ya. Suatu hari nanti, ceritain ke mereka... nggak ada cinta yang malu jadi jujur."',
        nextNodeId: 'fb2_9',
      },
      fb2_res_promise: {
        id: 'fb2_res_promise',
        speaker: 'mas_bagas',
        emotion: 'hangat',
        text: 'Mas Bagas tersenyum tipis dengan mata berkaca-kaca. Ia mengambil spidol hitam, menulis di selotip kertas, lalu menempelkannya di dalam tas gitar: "TIDAK DIJUAL — TITIPAN DAMAR". "Gue pegang janji lo, Mar."',
        nextNodeId: 'fb2_9',
      },
      fb2_9: {
        id: 'fb2_9',
        speaker: 'narator',
        emotion: 'haru',
        text: 'Esok subuh, pukul 05.12, tangisan pertama Kira menggema di lantai tiga RS Harapan. Jari mungilnya menggenggam ibu jari Damar begitu erat—seolah seluruh musik di dunia baru saja berpindah ke dalam satu ruangan kecil itu.',
        onEnter: { playSfx: 'guitar' },
        nextNodeId: 'fb2_end',
      },
      fb2_end: {
        id: 'fb2_end',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Suara hujan Agustus itu mereda, mengembalikanku pada hari ini. Aku tidak pernah sedikit pun menyesal melepaskan gitar itu demi kelahiran Kira. Yang baru kusadari sekarang: sejak malam itu, aku terlalu keras menghukum diriku agar terus bekerja—sampai lupa bahwa Kira tidak butuh ayah yang selalu takut kekurangan; ia hanya ingin ayah yang ada.',
        onEnd: {
          playSfx: 'chime',
          setFlags: ['flashback_2020_done'],
          journalEntry: {
            id: 'je_flashback_2020',
            title: 'Kilas Balik · 08 Agustus 2020 (Malam Sebelum Kira Lahir)',
            body: 'Di tengah hujan deras malam sebelum kelahiran Kira, aku menjual gitar mahoni kesayanganku kepada Mas Bagas demi biaya persalinan Nadia. Selama enam tahun, ternyata Mas Bagas tidak pernah menaruhnya di rak jual—ia menungguku kembali dengan hati yang lebih damai.',
            chapter: 1,
          },
          phoneMessage: {
            id: 'msg_bagas_fb2020',
            sender: 'Mas Bagas (Nada Lama)',
            preview: 'Mar... stiker kertas "TITIPAN DAMAR" di dalam tas gitar mahoni kamu masih nempel utuh lho. Kapan mau main ke toko? Nggak usah mikir harga, kita ngobrol aja.',
            timeLabel: 'Baru saja',
            threadId: 'bagas',
          },
          toast: 'Kilas Balik 2020 tersimpan di Jurnal — pesan baru masuk dari Mas Bagas di HP!',
        },
      },
    },
  },

  // =========================================================================
  // KILAS BALIK 3 — ENAM BULAN LALU · PERTENGKARAN SUNYI DI MEJA MAKAN
  // =========================================================================
  flashback_meja_makan_sunyi: {
    id: 'flashback_meja_makan_sunyi',
    startNodeId: 'fb3_1',
    flashback: {
      yearLabel: 'ENAM BULAN LALU',
      title: 'Sup yang Dingin Pukul Sepuluh Malam',
      locationLabel: 'Ruang Makan Jl. Melati No. 14 · Pukul 22.15',
      mood: 'quiet_night',
      epigraph: 'Jarak terjauh antara dua orang bukan ribuan kilometer, melainkan dua sisi meja makan yang sama-sama memilih diam.',
    },
    nodes: {
      fb3_1: {
        id: 'fb3_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Jarum panjang jam dinding ruang makan merayap ke angka tiga. Pukul 22.15. Lampu gantung kuning menyinari satu mangkuk sup ayam yang uapnya telah lama menghilang, berhadapan dengan cahaya biru-putih layar laptop yang masih terbuka.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'fb3_2',
      },
      fb3_2: {
        id: 'fb3_2',
        speaker: 'narator',
        emotion: 'sedih',
        text: 'Kira sudah terlelap di kamar sejak jam sembilan sambil memeluk buku gambarnya. Di seberang meja, Nadia duduk tenang dengan jemari melingkari cangkir teh tawar yang ikut dingin. Tidak ada bentakan. Tidak ada pintu dibanting.',
        nextNodeId: 'fb3_3',
      },
      fb3_3: {
        id: 'fb3_3',
        speaker: 'nadia',
        emotion: 'lelah',
        text: 'Mas... tadi Kira nungguin kamu di sofa depan sampai ketiduran. Dia dapat tiga bintang emas dari Bu Guru karena gambar pohon mangga, katanya mau nunjukin ke Ayah dulu baru mau tidur.',
        nextNodeId: 'fb3_4',
      },
      fb3_4: {
        id: 'fb3_4',
        speaker: 'damar',
        emotion: 'lelah',
        text: 'Iya, Nad... besok pagi sebelum berangkat aku lihat ya. Ini klien Proyek Kartika baru kirim revisi jam delapan tadi, kalau nggak kuberesin malam ini besok presentasi bisa berantakan.',
        nextNodeId: 'fb3_5',
      },
      fb3_5: {
        id: 'fb3_5',
        speaker: 'narator',
        emotion: 'sedih',
        text: 'Hanya suara ketikan tombol keyboard yang mengisi ruang makan selama lima detik yang terasa seperti satu jam. Lalu Nadia menatap layar laptop itu, kemudian menatap wajah suaminya yang bahkan belum menoleh.',
        nextNodeId: 'fb3_6',
      },
      fb3_6: {
        id: 'fb3_6',
        speaker: 'nadia',
        emotion: 'sedih',
        text: 'Kamu ingat nggak, Mas... kapan terakhir kali kamu makan malam sambil beneran lihat mataku, bukan sambil cek notifikasi di sebelah piring?',
        nextNodeId: 'fb3_7',
      },
      fb3_7: {
        id: 'fb3_7',
        speaker: 'damar',
        emotion: 'tegas',
        text: 'Nad, aku kerja keras begini juga buat siapa lagi? Buat cicilan rumah ini, buat sekolah Kira nanti, biar kita nggak pernah lagi ngerasain panik kayak dulu waktu Kira lahir—',
        nextNodeId: 'fb3_8',
      },
      fb3_8: {
        id: 'fb3_8',
        speaker: 'nadia',
        emotion: 'haru',
        text: 'Nadia tidak memotong dengan amarah. Ia justru berdiri pelan, mengangkat mangkuk sup yang tak tersentuh ke arah dapur, lalu berhenti sejenak di ambang pintu dengan suara bergetar halus.',
        nextNodeId: 'fb3_9',
      },
      fb3_9: {
        id: 'fb3_9',
        speaker: 'nadia',
        emotion: 'sedih',
        text: '"Aku nggak pernah minta kita jadi serba mewah, Mas... aku tahu kamu capek, dan aku bersyukur banget kamu selalu berjuang. Aku cuma takut... suatu hari nanti kamu pulang ke rumah ini, tapi rasanya kamu sudah seperti tamu."',
        nextNodeId: 'fb3_10',
      },
      fb3_10: {
        id: 'fb3_10',
        speaker: 'damar_batin',
        emotion: 'sedih',
        text: 'Malam itu aku tetap duduk di kursi kayu ini sendirian sampai tengah malam. Laptopnya memang kubereskan, tapi hatiku tak pernah benar-benar selesai dengan kalimat terakhir Nadia. Jika aku melihat kembali malam itu sekarang...',
        choices: [
          {
            id: 'fb3_choice_ego',
            text: '"Aku dulu terlalu sibuk membela diri, sampai tidak sadar suara Nadia sudah gemetar menahan sepi."',
            subtext: 'Berani mengakui bahwa ego dan kelelahan telah membutakan mata',
            nextNodeId: 'fb3_res_ego',
            effects: {
              kejujuranDiri: 3,
              kehadiranKeluarga: 1,
            },
          },
          {
            id: 'fb3_choice_hand',
            text: '"Malam itu seharusnya aku menutup laptopku dan menggenggam tangannya—bukan malah menyusun alasan."',
            subtext: 'Memilih kehadiran nyata di atas segala pembelaan diri',
            nextNodeId: 'fb3_res_hand',
            effects: {
              kehadiranKeluarga: 3,
              kejujuranDiri: 1,
            },
          },
          {
            id: 'fb3_choice_fear',
            text: '"Aku cuma terlalu takut gagal melindungi mereka... sampai ketakutanku sendiri melukai rumah yang kubangun."',
            subtext: 'Memahami akar ketakutan agar bisa melepaskannya dengan jujur',
            nextNodeId: 'fb3_res_fear',
            effects: {
              kejujuranDiri: 2,
              kehadiranKeluarga: 2,
            },
          },
        ],
      },
      fb3_res_ego: {
        id: 'fb3_res_ego',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Ternyata pertengkaran paling menyakitkan bukanlah saat dua orang saling berteriak—melainkan saat salah satunya berhenti berharap didengar. Aku tidak mau Nadia merasakan sunyi seperti itu lagi.',
        nextNodeId: 'fb3_end',
      },
      fb3_res_hand: {
        id: 'fb3_res_hand',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Satu ketukan tutup laptop hanya butuh setengah detik. Satu genggaman tangan hanya butuh keberanian untuk berhenti berlari. Malam ini, aku tahu betul apa yang ingin kulakukan di meja makan itu.',
        nextNodeId: 'fb3_end',
      },
      fb3_res_fear: {
        id: 'fb3_res_fear',
        speaker: 'damar_batin',
        emotion: 'tenang',
        text: 'Mungkin sudah waktunya aku berhenti memikul rasa takut ini seperti rahasia. Nadia adalah teman hidupku, bukan seseorang yang harus kulindungi dari kejujuranku sendiri.',
        nextNodeId: 'fb3_end',
      },
      fb3_end: {
        id: 'fb3_end',
        speaker: 'narator',
        emotion: 'hangat',
        text: 'Bayangan malam pukul 22.15 itu perlahan sirna, meninggalkan kehangatan samar di dada Damar. Masa lalu memang tak bisa diubah—tetapi cara Damar pulang hari ini sepenuhnya masih di tangannya.',
        onEnd: {
          playSfx: 'chime',
          setFlags: ['flashback_dinner_done'],
          journalEntry: {
            id: 'je_flashback_dinner',
            title: 'Kilas Balik · Meja Makan Pukul 22.15',
            body: 'Aku mengingat kembali malam enam bulan lalu ketika sup ayam di meja makan dingin di depan layar laptop yang menyala. Nadia tidak marah—ia hanya takut aku pulang ke rumah sendiri sebagai tamu. Hari ini, aku ingin membuktikan bahwa aku benar-benar pulang.',
            chapter: 1,
          },
          phoneMessage: {
            id: 'msg_nadia_fb_dinner',
            sender: 'Nadia ❤️',
            preview: 'Mas, kok tiba-tiba aku keinget malam pas aku agak sensitif di meja makan beberapa bulan lalu ya... kamu nggak apa-apa kan hari ini? Aku pengin kita ngobrol pelan-pelan lagi.',
            timeLabel: 'Baru saja',
            threadId: 'nadia',
          },
          toast: 'Kilas Balik Meja Makan tersimpan di Jurnal — pesan menyentuh masuk dari Nadia di HP!',
        },
      },
    },
  },
};
