import { DialogueScript } from '../types/game';

/**
 * Cerita Sastra Pak Hendra & Naya:
 * "Perahu Krayon di Kotak Barang Temuan (2010)" — gambar yang pernah dikelupas Pak Hendra di lift
 * ternyata dipungut dan disimpan rapi oleh satpam lobi selama lima belas tahun.
 * Terhubung ke 3D Lobi Menara Nusantara, Kantor Pos Selatan, Tas, HP, Jurnal, Bab 3, & Ending Recap.
 */
export const NAYA_CRAYON_DIALOGUES: Record<string, DialogueScript> = {
  story_lobby_lost_found_naya: {
    id: 'story_lobby_lost_found_naya',
    startNodeId: 'ncb_1',
    nodes: {
      ncb_1: {
        id: 'ncb_1',
        speaker: 'damar_batin',
        emotion: 'tenang',
        text: 'Di ujung meja resepsionis lobi, terselip sebuah kotak kayu tua berlabel spidol pudar: "BARANG TEMUAN — HUBUNGI POS SATPAM". Isinya payung lipat, kunci motor tanpa pemilik, dan satu map plastik bening yang sudutnya sudah menguning.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'ncb_2',
      },
      ncb_2: {
        id: 'ncb_2',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Di dalam map itu ada selembar kertas gambar anak-anak yang pernah diremas lalu diratakan lagi dengan sabar. Sebuah perahu kecil krayon biru berlayar di atas laut hijau, dan di bawahnya tulisan cakar ayam: "UNTUK AYAH — PULANG JAM 8 YA. NAYA 6 THN."',
        nextNodeId: 'ncb_3',
      },
      ncb_3: {
        id: 'ncb_3',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Di balik kertas, tertempel catatan buku jaga satpam bertulis tangan rapi: "Ditemukan di lantai lift tengah, 14 Maret 2010, pukul 19.52. Kemungkinan milik putri salah satu karyawan lt. 18. Disimpan baik-baik sampai pemiliknya datang."',
        nextNodeId: 'ncb_4',
      },
      ncb_4: {
        id: 'ncb_4',
        speaker: 'damar_batin',
        emotion: 'sedih',
        text: 'Lima belas tahun. Gambar yang Pak Hendra kelupas dari tas kerjanya karena gengsi di depan direksi ternyata tidak pernah dibuang. Seseorang yang bahkan tidak mengenal Naya memilih menjaganya—sementara ayahnya sendiri lupa bahwa gambar ini pernah ada.',
        choices: [
          {
            id: 'ncb_ch_keep',
            text: 'Simpan map perahu krayon itu di tas dan kabari Pak Hendra dengan hati-hati',
            subtext: 'Menjadi jembatan kecil antara seorang ayah dan putrinya',
            nextNodeId: 'ncb_end_keep',
            effects: {
              kejujuranDiri: 2,
              kehadiranKeluarga: 1,
              setFlags: ['found_naya_crayon_boat', 'kept_naya_crayon_boat'],
              journalEntry: {
                id: 'je_naya_crayon_boat',
                title: 'Perahu Krayon Naya di Kotak Barang Temuan',
                body: 'Di kotak barang temuan lobi Menara Nusantara, aku menemukan gambar perahu krayon "Untuk Ayah — pulang jam 8 ya" milik Naya kecil, dipungut satpam dari lantai lift tahun 2010. Pak Hendra harus melihat ini sebelum terlambat lebih lama lagi.',
                chapter: 1,
              },
              phoneMessage: {
                id: 'pm_hendra_crayon_found',
                sender: 'Pak Hendra (Kantor)',
                preview: 'Damar... foto yang kamu kirim barusan... itu gambar perahu Naya. Saya kira sudah hilang lima belas tahun.',
                timeLabel: 'Baru saja',
                threadId: 'hendra',
              },
              toast: 'Perahu krayon Naya disimpan di Tas [I] — bawa ke Kantor Pos Selatan.',
            },
          },
          {
            id: 'ncb_ch_return',
            text: 'Kembalikan map ke kotak dengan hormat—mungkin ini bukan urusanmu',
            nextNodeId: 'ncb_end_return',
          },
        ],
      },
      ncb_end_keep: {
        id: 'ncb_end_keep',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Kupotret gambar itu dan kukirim ke Pak Hendra dengan satu kalimat pendek: "Pak, sepertinya ini milik Naya." Ponselku langsung bergetar. Ada orang yang ternyata sudah menunggu kabar ini lima belas tahun tanpa menyadarinya.',
        onEnter: { playSfx: 'phone' },
      },
      ncb_end_return: {
        id: 'ncb_end_return',
        speaker: 'damar_batin',
        emotion: 'ragu',
        text: 'Kututup kembali kotak kayu itu pelan-pelan. Tapi bayangan perahu biru kecil itu terus berlayar di kepalaku—mungkin nanti aku akan kembali ke sini.',
      },
    },
  },

  story_post_naya_crayon: {
    id: 'story_post_naya_crayon',
    startNodeId: 'pnc_1',
    nodes: {
      pnc_1: {
        id: 'pnc_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Kantor Pos & Filateli Senja Selatan masih membuka satu loket. Di balik kaca, petugas menyodorkan amplop karton tebal dan selembar prangko seri "Perahu Pinisi Nusantara"—kebetulan yang terasa terlalu tepat.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'pnc_2',
      },
      pnc_2: {
        id: 'pnc_2',
        speaker: 'pak_hendra',
        emotion: 'haru',
        text: '(Telepon) Damar... saya sudah kirim alamat apartemen Naya di Melbourne. Tolong sertakan satu kalimat dari saya, ya. Tangan saya gemetar kalau harus menulis sendiri sekarang.',
        onEnter: { playSfx: 'phone' },
        nextNodeId: 'pnc_3',
      },
      pnc_3: {
        id: 'pnc_3',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Tentu, Pak. Kalimat apa yang mau Bapak titipkan untuk Naya?',
        nextNodeId: 'pnc_4',
      },
      pnc_4: {
        id: 'pnc_4',
        speaker: 'pak_hendra',
        emotion: 'haru',
        text: '"Nay, perahumu sudah sampai. Maaf Ayah terlambat lima belas tahun. Mulai bulan ini, Ayah pulang jam delapan—dan Ayah yang akan meneleponmu tiap Minggu."',
        choices: [
          {
            id: 'pnc_ch_send',
            text: 'Tulis kalimat Pak Hendra di kartu pos, tempelkan prangko Pinisi, lalu masukkan ke bis surat oranye',
            subtext: 'Mengirim perahu kecil Naya pulang ke tangan pemiliknya',
            nextNodeId: 'pnc_end',
            effects: {
              kejujuranDiri: 2,
              kehadiranKeluarga: 2,
              setFlags: ['sent_naya_crayon_boat'],
              journalEntry: {
                id: 'je_naya_crayon_sent',
                title: 'Prangko Pinisi untuk Perahu Krayon Naya',
                body: 'Di Kantor Pos Selatan, kutuliskan pesan Pak Hendra untuk putrinya: "Maaf Ayah terlambat lima belas tahun." Sambil mendengar amplop jatuh ke dasar bis surat oranye, aku berjanji tidak akan pernah membiarkan gambar Kira berakhir di lantai lift mana pun.',
                chapter: 1,
              },
              phoneMessage: {
                id: 'pm_hendra_crayon_sent',
                sender: 'Pak Hendra (Kantor)',
                preview: 'Terima kasih, Damar. Hari ini saya pulang jam delapan. Jangan ulangi kesalahan saya—gambar Kira tempel di tasmu dan biarkan semua orang melihatnya.',
                timeLabel: 'Baru saja',
                threadId: 'hendra',
              },
              toast: 'Perahu krayon Naya dikirim ke Melbourne — tercatat di Jurnal & HP [H]!',
            },
          },
        ],
      },
      pnc_end: {
        id: 'pnc_end',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Tuk. Amplop karton itu jatuh pelan ke dasar bis surat oranye. Entah kenapa aku langsung membuka galeri ponsel, mencari gambar matahari besar buatan Kira kemarin malam—dan menjadikannya layar kunci.',
        onEnter: { playSfx: 'chime' },
      },
    },
  },
};
