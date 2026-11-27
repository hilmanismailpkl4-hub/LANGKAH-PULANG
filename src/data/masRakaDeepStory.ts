import { DialogueScript } from '../types/game';

/**
 * Alur Cerita Solo Persaudaraan Sesama Ayah — Mas Raka (Jembatan Tepi Sungai):
 * "Sepasang Sepatu Roda Kecil di Dalam Ransel Kerja"
 * Lokasi: Samping Tiang Lampu Utara Jembatan Tepi Sungai (`[-47.35, 0.24, -6.35]`)
 *
 * Mempertemukan dua ayah dari dua profesi berbeda—manajer gedung kaca dan teknisi shift jembatan—
 * dalam satu luka dan satu janji hari Minggu yang sama untuk putri kecil mereka.
 */
export const MAS_RAKA_DEEP_DIALOGUES: Record<string, DialogueScript> = {
  story_mas_raka_roller_skates: {
    id: 'story_mas_raka_roller_skates',
    startNodeId: 'smrr_1',
    nodes: {
      smrr_1: {
        id: 'smrr_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Bersandar di pangkal tiang besi Jembatan Tepi Sungai, tampak ransel kanvas kerja Mas Raka yang penuh bercak cat marka. Resleting atasnya terbuka separuh—memperlihatkan roda putih kecil dan tali sepatu berwarna merah muda cerah.',
        onEnter: { playSfx: 'interact' },
        nextNodeId: 'smrr_2',
      },
      smrr_2: {
        id: 'smrr_2',
        speaker: 'mas_raka',
        emotion: 'ceria',
        text: 'Mas Raka terkekeh agak salah tingkah sambil membetulkan rompi proyeknya. "Ketahuan deh, Mas Damar. Kelihatan aneh ya tukang listrik jembatan bawa-bawa sepatu roda pink di tas kunci inggris?"',
        nextNodeId: 'smrr_3',
      },
      smrr_3: {
        id: 'smrr_3',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Punya anak perempuan Mas Raka di rumah ya? Kelihatannya baru disemir bersih banget rodanya.',
        nextNodeId: 'smrr_4',
      },
      smrr_4: {
        id: 'smrr_4',
        speaker: 'mas_raka',
        emotion: 'hangat',
        text: 'Buat Dinda, putri saya—umurnya baru jalan tujuh tahun. Sebulan lalu saya nemu sepatu roda bekas ini di pasar loak dekat stasiun. Malam-malam sepulang shift saya cuci talinya pakai sabun wangi terus saya ganti laher besinya biar licin.',
        nextNodeId: 'smrr_5',
      },
      smrr_5: {
        id: 'smrr_5',
        speaker: 'mas_raka',
        emotion: 'sedih',
        text: 'Tapi tawa kecil Mas Raka perlahan hilang diterpa angin sungai. "...Masalahnya, Mas Damar, sudah empat hari Minggu berturut-turut saya janji mau ngajarin dia meluncur di Taman Kota. Dan empat kali itu juga mandor nawarin upah lembur dobel pengecatan rangka jembatan. Saya ambil terus karena mikir lumayan buat nambah tabungan seragamnya."',
        nextNodeId: 'smrr_6',
      },
      smrr_6: {
        id: 'smrr_6',
        speaker: 'mas_raka',
        emotion: 'haru',
        text: 'Sampai Minggu kemarin waktu saya pulang subuh dan minta maaf lagi... Dinda nggak nangis, nggak ngambek. Dia cuma mengangguk pelan terus masukin sepatu roda ini balik ke kardus bawah kasur sambil bilang: "Nggak apa-apa kok, Yah. Dinda udah nggak pengin main sepatu roda lagi."',
        onEnter: { playSfx: 'chime' },
        conditionalNext: [
          {
            requiredFlag: 'found_kira_secret_drawings',
            nextNodeId: 'smrr_6_echo_kira',
          },
          {
            requiredFlag: 'ch1_rushed_morning',
            nextNodeId: 'smrr_6_echo_rushed',
          },
        ],
        nextNodeId: 'smrr_7',
      },
      smrr_6_echo_kira: {
        id: 'smrr_6_echo_kira',
        speaker: 'damar',
        emotion: 'haru',
        echoTag: 'Gema Sesama Ayah · Gambar Bawah Bantal Kira & Sepatu Dinda',
        text: 'Mas Raka... putri saya Kira enam tahun. Tadi di rumah saya baru menemukan tiga gambar krayon yang dia sembunyikan di bawah bantalnya karena takut bikin saya sedih kalau nagih janji ke danau. Ternyata anak-anak kita berhenti menagih bukan karena lupa, Mas... tapi karena mereka terlalu sayang sama kita.',
        nextNodeId: 'smrr_7',
      },
      smrr_6_echo_rushed: {
        id: 'smrr_6_echo_rushed',
        speaker: 'damar_batin',
        emotion: 'sedih',
        echoTag: 'Gema Pagi Tadi · Tatapan Kira di Meja Makan',
        text: 'Kalimat Dinda menghantam ulu hatiku—persis tatapan pelan Kira pagi tadi saat lagi-lagi kujawab dengan kata "nanti sore".',
        nextNodeId: 'smrr_7',
      },
      smrr_7: {
        id: 'smrr_7',
        speaker: 'mas_raka',
        emotion: 'haru',
        text: 'Sumpah, Mas... dengar anak tujuh tahun bilang "nggak apa-apa" dengan muka dewasa begitu rasanya lebih remuk daripada kejatuhan besi perancah. Makanya sejak tadi pagi sepatu roda ini sengaja saya jejelkan di ransel kerja—biar kalau malam ini mandor nyodorin kertas lembur Minggu lagi, mata saya langsung lihat tali pink ini dan berani bilang cukup.',
        choices: [
          {
            id: 'smrr_c_fathers_pact',
            text: 'Ulurkan tangan menjabat tangan kasar Mas Raka: "Mas, hari Minggu pagi besok saya ngajarin Kira naik sepeda di Taman Kota. Kita ketemu di sana jam tujuh pagi ya—haram ambil lembur!"',
            subtext: 'Mengikat Janji Sesama Ayah untuk menepati hari Minggu bagi Kira dan Dinda',
            nextNodeId: 'smrr_end_pact',
            effects: {
              kehadiranKeluarga: 4,
              kejujuranDiri: 3,
              setFlags: ['heard_mas_raka_skates_story', 'raka_sunday_park_pact'],
              journalEntry: {
                id: 'je_mas_raka_skates',
                title: 'Sepatu Roda Pink & Janji Minggu Pagi (Mas Raka)',
                body: 'Di atas Jembatan Sungai, Mas Raka memperlihatkan sepatu roda bekas putrinya, Dinda, yang ia bawa di ransel kerja agar berani menolak lembur kelima kalinya. Kami berjabat tangan sebagai sesama ayah: hari Minggu pagi di Taman Kota adalah milik putri-putri kami.',
                chapter: 1,
              },
              toast: 'Janji Sesama Ayah dengan Mas Raka terikat — tercatat di Jurnal & Epilog!',
            },
          },
          {
            id: 'smrr_c_encourage_raka',
            text: '"Keputusan Mas Raka bawa sepatu roda itu sudah paling benar, Mas. Uang lembur bisa dicari bulan depan, tapi umur tujuh tahun Dinda nggak akan datang dua kali."',
            subtext: 'Menguatkan hati Mas Raka sekaligus menasihati diri sendiri',
            nextNodeId: 'smrr_end_warm',
            effects: {
              kejujuranDiri: 3,
              kehadiranKeluarga: 3,
              setFlags: ['heard_mas_raka_skates_story'],
              journalEntry: {
                id: 'je_mas_raka_skates',
                title: 'Ketika Anak Kecil Berhenti Menagih Janji',
                body: 'Cerita Mas Raka tentang putrinya yang berkata "nggak apa-apa, Dinda udah nggak pengin main lagi" mengingatkanku betapa berbahayanya saat keluarga mulai berhenti berharap pada waktu kita.',
                chapter: 1,
              },
              toast: 'Kisah sepatu roda Mas Raka tersimpan di Jurnal Cerita!',
            },
          },
        ],
      },
      smrr_end_pact: {
        id: 'smrr_end_pact',
        speaker: 'mas_raka',
        emotion: 'ceria',
        text: 'Mas Raka menyambut jabatan tangan Damar dengan genggaman mantap penuh tawa lega! "Deal, Mas Damar! Jam tujuh pagi di jalur taman ya—kalau Kira sama Dinda jatuh bareng, biar bapak-bapaknya yang pasang plester!"',
        onEnter: { playSfx: 'chime' },
      },
      smrr_end_warm: {
        id: 'smrr_end_warm',
        speaker: 'mas_raka',
        emotion: 'hangat',
        text: 'Mas Raka menepuk sisi ranselnya dengan mata berkaca-kaca namun senyumnya tegak. "Makasih banyak, Mas Damar. Rasanya nggak sendirian lagi punya teman seperjuangan sesama bapak-bapak malam ini. Hati-hati jalan pulangnya ya!"',
        onEnter: { playSfx: 'chime' },
      },
    },
  },
};
