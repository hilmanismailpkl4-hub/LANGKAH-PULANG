import { DialogueScript } from '../types/game';

/**
 * Cerita Sastra Mendalam — "Halaman yang Tertunda di Paviliun Utara: Dua Kelopak Tabebuya (22 Mei 2022 & 2023)"
 * Menghubungkan Paviliun Bambu Teduh Utara, Koridor Tabebuya Jl. Stasiun Timur, Tas Selempang [I],
 * Smartphone [H], Klimaks Meja Makan Bab 3, Jurnal Perjalanan, dan Rekap Ending.
 */
export const BAMBOO_ANNIVERSARY_DIALOGUES: Record<string, DialogueScript> = {
  story_bamboo_guestbook_2022: {
    id: 'story_bamboo_guestbook_2022',
    startNodeId: 'bgb_1',
    nodes: {
      bgb_1: {
        id: 'bgb_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Di sudut meja teh kayu Paviliun Teduh Utara, tersimpan sebuah buku tamu bersampul kulit cokelat tua yang diikat tali rami. Dari sela halaman tengahnya, menyembul ujung dua kelopak bunga kering—satu merah muda pucat, satu kuning keemasan.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'bgb_2',
      },
      bgb_2: {
        id: 'bgb_2',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Jariku terhenti begitu membuka halaman empat puluh tujuh. Aku mengenali lekuk huruf tinta hitam di separuh atas kertas ini—tulisanku sendiri, tiga tahun lalu, pada sore ulang tahun pernikahan ketiga kami.',
        nextNodeId: 'bgb_3',
      },
      bgb_3: {
        id: 'bgb_3',
        speaker: 'narator',
        emotion: 'hangat',
        text: '“22 Mei 2022 — Kira tertidur pulas di gendongan kain sambil memeluk kerah kemejaku. Kami memungut satu kelopak Tabebuya merah muda dari jalan stasiun lalu berteduh minum teh melati di sini. Aku berjanji pada Nadia: sesibuk apa pun kota nanti, setiap tanggal dua puluh dua Mei kita akan selalu kembali menulis satu baris baru di buku ini.”',
        nextNodeId: 'bgb_4',
      },
      bgb_4: {
        id: 'bgb_4',
        speaker: 'damar_batin',
        emotion: 'sedih',
        text: 'Napas di tenggorokanku tercekat. Tepat di bawah tulisanku, ada paragraf bertinta cokelat tipis yang belum pernah kubaca seumur hidupku—ditulis tangan Nadia tepat setahun sesudahnya.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'bgb_5',
      },
      bgb_5: {
        id: 'bgb_5',
        speaker: 'nadia',
        emotion: 'haru',
        echoTag: 'Catatan Sunyi Nadia · 22 Mei 2023',
        text: '“22 Mei 2023 — Sore ini aku mampir sebentar berdua saja sama Kira, Mas. Tadi siang kamu menelepon minta maaf karena rapat evaluasi kuartal di lantai dua belas diundur sampai malam. Aku nggak marah kok, sungguh.”',
        nextNodeId: 'bgb_6',
      },
      bgb_6: {
        id: 'bgb_6',
        speaker: 'nadia',
        emotion: 'hangat',
        echoTag: 'Catatan Sunyi Nadia · 22 Mei 2023',
        text: '“Kira tadi memungut satu kelopak Tabebuya kuning buat temannya kelopak tahun lalu, biar katanya nggak kesepian di dalam buku. Aku selipkan di sini ya, Mas... supaya kalau suatu hari langkahmu kebetulan sampai ke paviliun bambu ini lagi, kamu tahu aku tidak pernah berhenti menunggumu melanjutkan halaman kita.”',
        nextNodeId: 'bgb_7',
      },
      bgb_7: {
        id: 'bgb_7',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Dua tahun penuh kalimat itu menunggu di antara desir batang bambu tanpa sekalipun Nadia mengungkitnya saat kami berdebat di rumah. Ia tidak pernah menagih janjiku dengan kemarahan—ia hanya menaruh sekuntum bunga kuning agar kelopakku tidak sendirian.',
        choices: [
          {
            id: 'bgb_c_write',
            text: 'Keluarkan pena, tulis baris penebusan di bawah tulisan Nadia, & bawa kedua kelopak Tabebuya pulang untuknya',
            subtext: 'Menjawab kesabaran Nadia setelah dua musim (+Kejujuran Diri, +Kehadiran Keluarga)',
            nextNodeId: 'bgb_end_write',
            effects: {
              kejujuranDiri: 3,
              kehadiranKeluarga: 2,
              setFlags: [
                'found_bamboo_guestbook_2022',
                'wrote_pavilion_anniversary_vow',
                'kept_pressed_tabebuya_2022',
              ],
              journalEntry: {
                id: 'je_bamboo_guestbook_2022',
                title: 'Dua Kelopak Tabebuya di Buku Tamu Paviliun Utara',
                body: 'Di halaman 47 buku tamu Paviliun Bambu Utara, kutemukan catatan 22 Mei 2023 yang ditulis Nadia sendirian saat aku lembur di kantor. Hari ini kutuliskan baris lanjutannya dengan tanganku sendiri, dan kubawa sepasang kelopak Tabebuya kering itu di Tas [I] untuk kuserahkan padanya.',
                chapter: 1,
              },
              phoneMessage: {
                id: 'notif_bamboo_2022',
                sender: 'Nadia ❤️',
                preview: 'Mas, kamu lagi jalan sampai ke tepi utara Danau Senja ya? Paviliun bambunya masih teduh kayak dulu nggak?',
                timeLabel: 'Baru saja',
                threadId: 'nadia',
              },
              toast: 'Sepasang Kelopak Tabebuya (2022 & 2023) disimpan ke Tas [I]! Dekati Nadia untuk menunjukkannya.',
            },
          },
          {
            id: 'bgb_c_keep',
            text: 'Usap pelan tulisan tangan Nadia dan simpan sepasang kelopak Tabebuya kering itu ke dalam Tas Selempang',
            subtext: 'Membawa pulang saksi kesetiaan Nadia ke Jl. Melati (+Kehadiran Keluarga)',
            nextNodeId: 'bgb_end_keep',
            effects: {
              kejujuranDiri: 1,
              kehadiranKeluarga: 2,
              setFlags: ['found_bamboo_guestbook_2022', 'kept_pressed_tabebuya_2022'],
              journalEntry: {
                id: 'je_bamboo_guestbook_2022',
                title: 'Dua Kelopak Tabebuya di Buku Tamu Paviliun Utara',
                body: 'Aku menemukan tulisan tangan Nadia bertanggal 22 Mei 2023 di bawah janjiku tahun 2022 di Paviliun Bambu Utara. Tanpa sepatah keluhan pun, ia pernah menunggu di sini hanya bersama Kira.',
                chapter: 1,
              },
              phoneMessage: {
                id: 'notif_bamboo_2022',
                sender: 'Nadia ❤️',
                preview: 'Mas, kamu lagi jalan sampai ke tepi utara Danau Senja ya? Paviliun bambunya masih teduh kayak dulu nggak?',
                timeLabel: 'Baru saja',
                threadId: 'nadia',
              },
              toast: 'Sepasang Kelopak Tabebuya (2022 & 2023) disimpan ke Tas [I]!',
            },
          },
        ],
      },
      bgb_end_write: {
        id: 'bgb_end_write',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Kutulis pelan di bawah baris Nadia: “Hari ini aku sampai, Nad. Mulai tahun ini dan seterusnya, tidak akan ada lagi tanggal dua puluh dua Mei yang kamu lewati tanpa aku di sebelahmu.” Kumasukkan kedua kelopak tipis itu dengan hati-hati ke saku buku catatanku.',
        onEnter: { playSfx: 'chime' },
      },
      bgb_end_keep: {
        id: 'bgb_end_keep',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Kuselipkan kedua kelopak Tabebuya kering itu ke dalam lipatan saputangan bersih di tasku. Malam ini, aku sendiri yang akan meminta maaf dan berterima kasih di hadapan Nadia.',
        onEnter: { playSfx: 'chime' },
      },
    },
  },

  story_share_tabebuya_nadia: {
    id: 'story_share_tabebuya_nadia',
    startNodeId: 'stn_1',
    nodes: {
      stn_1: {
        id: 'stn_1',
        speaker: 'damar',
        emotion: 'haru',
        text: 'Nad... coba buka telapak tanganmu sebentar. Tadi langkahku sampai ke Paviliun Bambu di seberang utara Danau Senja—dan aku membuka halaman empat puluh tujuh buku tamunya.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'stn_2',
      },
      stn_2: {
        id: 'stn_2',
        speaker: 'nadia',
        emotion: 'haru',
        text: 'Ya Tuhan, Mas... itu kan kelopak Tabebuya merah muda tahun 2022 kita... sama kelopak kuning yang waktu itu Kira pungut tahun 2023?! Kamu... kamu beneran baca tulisanku di bawahnya?',
        nextNodeId: 'stn_3',
      },
      stn_3: {
        id: 'stn_3',
        speaker: 'damar',
        emotion: 'haru',
        text: 'Aku baca setiap hurufnya, Nad. Maafin aku ya... waktu tanggal dua puluh dua Mei 2023 itu kamu pergi ke sana cuma berdua sama Kira, dan selama dua tahun kamu nggak pernah sekali pun menyindirku soal janji yang kulupa itu.',
        nextNodeId: 'stn_4',
      },
      stn_4: {
        id: 'stn_4',
        speaker: 'nadia',
        emotion: 'hangat',
        text: 'Aku nggak mau janji seindah itu berubah jadi senjata buat nyalahin kamu, Mas... Aku cuma percaya, cepat atau lambat suami yang dulu meminum teh melati bersamaku di paviliun itu pasti bakal menemukan jalan pulangnya sendiri.',
        nextNodeId: 'stn_5',
      },
      stn_5: {
        id: 'stn_5',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Jari-jari Nadia menggenggam erat kedua kelopak bunga kering itu di dadanya, lalu menyandarkan keningnya ke bahuku. Betapa beruntungnya aku dicintai oleh seseorang yang bahkan dalam sunyinya tetap menjaga ruang untukku pulang.',
        onEnd: {
          kehadiranKeluarga: 3,
          kejujuranDiri: 2,
          setFlags: ['shared_tabebuya_2022_with_nadia'],
          journalEntry: {
            id: 'je_shared_tabebuya_nadia',
            title: 'Mengembalikan Dua Kelopak Tabebuya ke Tangan Nadia',
            body: 'Saat kuserahkan kelopak merah muda 2022 dan kelopak kuning 2023 dari Paviliun Bambu Utara kepada Nadia, matanya berkaca-kaca. Ia berkata ia tidak pernah menjadikan janji lama sebagai senjata—ia hanya percaya aku akan pulang.',
            chapter: 1,
          },
          toast: 'Nadia menyimpan erat sepasang kelopak Tabebuya kenangan kalian! (+Kehadiran Keluarga, +Kejujuran Diri)',
        },
      },
    },
  },
};
