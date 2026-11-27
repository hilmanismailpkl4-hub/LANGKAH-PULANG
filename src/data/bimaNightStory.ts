import { DialogueScript } from '../types/game';

/**
 * Adegan Persahabatan Malam Bab 3:
 * "Lagu yang Kita Tinggal di Umur Dua Puluh Lima" — Empat Mata Bersama Bima Setelah Kedai Tutup
 * Lokasi: Kedai Kopi Sudut (Malam setelah hujan reda, Bab 3)
 *
 * Menyingkap rahasia enam tahun Bima: mengapa ia menolak tawaran rekaman solo tahun 2021
 * dan sengaja menggantung satu gitar akustik di sudut kedainya menunggu Damar kembali bernapas.
 */
export const BIMA_NIGHT_DIALOGUES: Record<string, DialogueScript> = {
  ch3_bima_kursi_terbalik: {
    id: 'ch3_bima_kursi_terbalik',
    startNodeId: 'bmn_1',
    nodes: {
      bmn_1: {
        id: 'bmn_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Kedai Kopi Sudut pukul setengah sepuluh malam sudah bersiap tutup. Papan kayu kecil di pintu kaca telah dibalik ke sisi "TUTUP", dan kursi-kursi pelanggan dinaikkan terbalik di atas meja—menyisakan dua bangku rendah di depan meja bar.',
        onEnter: { playSfx: 'door' },
        nextNodeId: 'bmn_2',
      },
      bmn_2: {
        id: 'bmn_2',
        speaker: 'narator',
        emotion: 'hangat',
        text: 'Mesin espresso sudah dimatikan. Di bawah satu lampu gantung kuning yang hangat, Bima duduk bersandar di dekat rak cangkir sambil memangku gitar akustik tuanya—memetik pelan akor Fmaj7 ke C yang terhenti di tengah kalimat.',
        onEnter: { playSfx: 'guitar' },
        nextNodeId: 'bmn_3',
      },
      bmn_3: {
        id: 'bmn_3',
        speaker: 'damar',
        emotion: 'haru',
        text: '...Tunggu, Bim. Itu progresi bridge "Umur Dua Puluh Lima" dari kaset latihan kita di kosan dulu, kan? Lo masih hafal petikannya?',
        nextNodeId: 'bmn_4',
      },
      bmn_4: {
        id: 'bmn_4',
        speaker: 'bima',
        emotion: 'ceria',
        text: 'Eh, bocah kantor nongol lagi! Kirain lo udah nyampe kasur di Jl. Melati, Mar. Masuk sini, nggak usah sungkan sama kursi terbalik—masih ada sisa seduhan V60 biji Gayo terakhir di teko kaca.',
        onEnter: { playSfx: 'coffee' },
        conditionalNext: [
          {
            requiredFlag: 'flashback_2018_done',
            nextNodeId: 'bmn_4_echo2018',
          },
          {
            requiredFlag: 'flashback_2020_done',
            nextNodeId: 'bmn_4_echo2020',
          },
        ],
        nextNodeId: 'bmn_5',
      },
      bmn_4_echo2018: {
        id: 'bmn_4_echo2018',
        speaker: 'bima',
        emotion: 'hangat',
        echoTag: 'Ingatan Bima · Panggung Taman Kota 2018',
        text: 'Sejak lo ngeliatin poster panggung 2018 di dinding kedai tadi, jari gue gatel pengin nyari lagi akor bridge yang dulu selalu bikin kita debat sampai jam dua pagi.',
        nextNodeId: 'bmn_5',
      },
      bmn_4_echo2020: {
        id: 'bmn_4_echo2020',
        speaker: 'bima',
        emotion: 'haru',
        echoTag: 'Ingatan Bima · Gitar Mahoni di Nada Lama',
        text: 'Gara-gara ngobrol soal malam hujan Agustus 2020 tadi sore, gue jadi kangen masa-masa waktu beban paling berat di kepala kita cuma mikirin rima bait kedua.',
        nextNodeId: 'bmn_5',
      },
      bmn_5: {
        id: 'bmn_5',
        speaker: 'damar',
        emotion: 'tenang',
        text: 'Enak banget hidup lo ya, Bim. Kadang gue iri lihat lo di kedai ini—tenang, merdeka, tetap dekat sama musik tanpa harus kehilangan senyum kayak gue.',
        nextNodeId: 'bmn_6',
      },
      bmn_6: {
        id: 'bmn_6',
        speaker: 'bima',
        emotion: 'ragu',
        text: 'Bima berhenti memetik senar. Jari jempolnya menahan dawai gitar hingga ruangan mendadak hening, hanya menyisakan tetesan sisa air di bak cuci bar. "...Lo beneran ngira enam tahun ini gue nggak pernah kehilangan apa-apa, Mar?"',
        nextNodeId: 'bmn_7',
      },
      bmn_7: {
        id: 'bmn_7',
        speaker: 'bima',
        emotion: 'sedih',
        text: 'Tahun 2021—setahun setelah Kira lahir dan lo mulai lembur tiap malam di Menara Nusantara—Mas Rendi dari label independen Selatan pernah datang ke sini. Dia dengar rekaman lama kita, terus nawarin gue kontrak mini-album solo.',
        nextNodeId: 'bmn_8',
      },
      bmn_8: {
        id: 'bmn_8',
        speaker: 'damar',
        emotion: 'tegas',
        text: 'Hah?! Mas Rendi?! Kenapa lo nggak ambil, Bim?! Kenapa selama lima tahun lo nggak pernah cerita sepatah kata pun ke gue?!',
        nextNodeId: 'bmn_9',
      },
      bmn_9: {
        id: 'bmn_9',
        speaker: 'bima',
        emotion: 'haru',
        text: 'Karena waktu gue coba masuk studio rekaman sendirian... lagunya mati, Mar. Suara gue hampa kalau nggak ada harmoni suara dua sama petikan melodi lo di sebelah kiri gue. Dan gue tahu waktu itu lo lagi mati-matian jaga dapur rumah lo tetap ngebul—mana tega gue pamer kontrak rekaman di depan sahabat yang baru ngelepas gitarnya demi anaknya?',
        nextNodeId: 'bmn_10',
      },
      bmn_10: {
        id: 'bmn_10',
        speaker: 'bima',
        emotion: 'hangat',
        text: 'Makanya gue tolak baik-baik, terus gue buka Kopi Sudut ini. Lihat gitar yang nyangkut di dinding pojok itu? Gue taruh di situ bukan buat properti Instagram kafe, bego. Gue gantung di situ biar kapan pun Damar Pratama selesai perang sama ketakutannya... kursinya masih ada.',
        conditionalNext: [
          {
            requiredFlag: 'played_father_cassette_1997',
            nextNodeId: 'bmn_10_echo_father',
          },
          {
            requiredFlag: 'ch3_hendra_night_talk_done',
            nextNodeId: 'bmn_10_echo_hendra',
          },
        ],
        nextNodeId: 'bmn_11',
      },
      bmn_10_echo_father: {
        id: 'bmn_10_echo_father',
        speaker: 'damar_batin',
        emotion: 'haru',
        echoTag: 'Gema Lintas Cerita · Pesan Bapak & Kesetiaan Sahabat',
        text: 'Tenggorokanku tercekat perih. Hari ini dari ujung pita kaset Bapak hingga sudut kedai sahabatku sendiri, semesta berulang kali menamparku dengan lembut: selama ini aku dikelilingi orang-orang yang mencintaiku dalam diam, sementara aku sibuk merasa sendirian.',
        nextNodeId: 'bmn_11',
      },
      bmn_10_echo_hendra: {
        id: 'bmn_10_echo_hendra',
        speaker: 'damar_batin',
        emotion: 'haru',
        echoTag: 'Gema Lintas Cerita · Menara Kaca vs Kedai Kecil',
        text: 'Baru sebentar tadi kulihat betapa sepinya puncak Menara Nusantara milik Pak Hendra—dan di kedai kecil berkursi terbalik ini, seorang sahabat rela menyimpan panggungnya selama enam tahun hanya demi menungguku pulang.',
        nextNodeId: 'bmn_11',
      },
      bmn_11: {
        id: 'bmn_11',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Enam tahun aku terkurung dalam rasa kasihan pada diriku sendiri—tanpa pernah menoleh bahwa laki-laki yang tiap pagi menyeduhkan kopiku ini juga ikut menyimpan separuh mimpinya demi menjaga perasaanku.',
        choices: [
          {
            id: 'bmn_c_sing_bridge',
            text: 'Tarik bangku di sebelah Bima, ketukkan ritme di kayu meja bar, dan nyanyikan harmoni suara dua "Umur Dua Puluh Lima" yang terputus enam tahun lalu',
            subtext: 'Menyelesaikan bait yang tertunda & berjanji menghidupkan malam akustik Sabtu sore',
            nextNodeId: 'bmn_r_sing_1',
            effects: {
              kejujuranDiri: 3,
              kehadiranKeluarga: 2,
              setFlags: ['ch3_bima_night_talk_done', 'bima_sang_bridge_together', 'bima_saturday_acoustic_pact'],
              phoneMessage: {
                id: 'msg_bima_bridge_night',
                sender: 'Bima (Kopi Sudut)',
                preview: 'Sumpah Mar, kuping gue masih merinding denger suara dua lo barusan di kedai kosong! Sekarang buruan pulang peluk Nadia & Kira—Sabtu sore panggung pojok resmi milik kita lagi 🎸',
                timeLabel: 'Baru saja',
                threadId: 'bima',
              },
              journalEntry: {
                id: 'je_bima_umur_25',
                title: 'Lagu yang Kita Tinggal di Umur Dua Puluh Lima',
                body: 'Di antara kursi-kursi terbalik Kedai Kopi Sudut, Bima akhirnya membuka rahasia bahwa ia pernah menolak kontrak solo tahun 2021 karena tak sanggup bernyanyi tanpaku. Malam ini kami menyanyikan kembali empat baris harmoni yang tertunda enam tahun—sebelum aku melangkah pulang ke rumah.',
                chapter: 3,
              },
              toast: 'Harmoni lama bersama Bima hidup kembali — tercatat di Jurnal & HP [H]!',
            },
          },
          {
            id: 'bmn_c_apologize_deep',
            text: '"Maafin gue ya, Bim... enam tahun gue terlalu egois mikirin luka gue sendiri sampai nggak sadar lo juga nungguin gue. Jangan pernah kubur suara lo lagi gara-gara gue."',
            subtext: 'Meminta maaf tulus sebagai sahabat & membebaskan Bima untuk kembali berkarya bersama',
            nextNodeId: 'bmn_r_apology_1',
            effects: {
              kejujuranDiri: 3,
              kehadiranKeluarga: 2,
              setFlags: ['ch3_bima_night_talk_done', 'bima_saturday_acoustic_pact'],
              phoneMessage: {
                id: 'msg_bima_pact_night',
                sender: 'Bima (Kopi Sudut)',
                preview: 'Lega banget akhirnya cerita itu keluar juga setelah lima tahun, Mar. Makasih udah mampir sebelum pulang—salam paling hangat buat Nadia & Kira!',
                timeLabel: 'Baru saja',
                threadId: 'bima',
              },
              journalEntry: {
                id: 'je_bima_umur_25',
                title: 'Kursi yang Dijaga Bima Selama Enam Tahun',
                body: 'Ternyata gitar di sudut Kedai Kopi Bima bukan pajangan kafe, melainkan tempat yang ia jaga agar aku selalu punya ruang kembali. Aku meminta maaf karena baru menyadarinya malam ini, dan kami berjanji akan kembali bermusik tanpa mengorbankan rumah.',
                chapter: 3,
              },
              toast: 'Janji persahabatan dengan Bima tercatat di Jurnal & HP [H]!',
            },
          },
          {
            id: 'bmn_c_toast_25',
            text: 'Angkat cangkir sisa kopi Gayo dan bersulang pelan bersama Bima untuk dua pemuda umur dua puluh lima yang dulu berani bermimpi di kosan sempit',
            subtext: 'Merayakan persahabatan yang bertahan melewati perubahan hidup',
            nextNodeId: 'bmn_r_toast_1',
            effects: {
              kejujuranDiri: 2,
              kehadiranKeluarga: 1,
              setFlags: ['ch3_bima_night_talk_done'],
              journalEntry: {
                id: 'je_bima_umur_25',
                title: 'Bersulang untuk Umur Dua Puluh Lima',
                body: 'Malam ini di kedai yang telah tutup, aku dan Bima bersulang dengan sisa kopi hangat untuk masa muda kami. Hidup mungkin tak berjalan persis seperti rencana kosan tahun 2018, namun persahabatan kami tidak pernah lekang.',
                chapter: 3,
              },
              toast: 'Momen hangat bersama Bima tersimpan di Jurnal.',
            },
          },
        ],
      },
      bmn_r_sing_1: {
        id: 'bmn_r_sing_1',
        speaker: 'narator',
        emotion: 'haru',
        text: 'Bima terbelalak sepersekian detik, lalu tawa lebarnya pecah bersamaan dengan petikan akor G yang hangat. Di dalam kedai yang kursinya sudah terbalik itu, dua suara sahabat berpadu lagi mengisi sunyi malam—"Jika jalan kota terlalu bising untuk kaki kita, nyalakan satu lampu, tunggu aku di beranda..."',
        onEnter: { playSfx: 'guitar' },
        nextNodeId: 'bmn_r_sing_2',
      },
      bmn_r_sing_2: {
        id: 'bmn_r_sing_2',
        speaker: 'bima',
        emotion: 'haru',
        text: 'Bima mengusap ujung hidungnya sambil tertawa serak. "Gila... suara dua lo masih belum karatan ternyata, Bapak Manajer! Udah, sana pulang ke Nadia sama Kira sekarang. Sabtu sore ajak mereka ke sini—kita nggak perlu label besar, cukup penonton barisan depan kita aja."',
      },
      bmn_r_apology_1: {
        id: 'bmn_r_apology_1',
        speaker: 'bima',
        emotion: 'hangat',
        text: 'Bima meninju pelan bahu Damar sambil tersenyum lega. "Nggak ada yang perlu dimaafin, bro. Namanya juga tumbuh dewasa—masing-masing punya badainya sendiri. Yang penting sekarang badai lo udah mulai terang. Sana pulang, meja makan lo udah nunggu!"',
        onEnter: { playSfx: 'chime' },
      },
      bmn_r_toast_1: {
        id: 'bmn_r_toast_1',
        speaker: 'bima',
        emotion: 'tenang',
        text: 'Ting! Dua cangkir keramik beradu pelan di atas meja kayu. "Buat umur dua puluh lima kita, Mar—dan buat rumah hangat yang lagi nunggu lo pulang malam ini. Hati-hati di jalan ya."',
        onEnter: { playSfx: 'coffee' },
      },
    },
  },
};
