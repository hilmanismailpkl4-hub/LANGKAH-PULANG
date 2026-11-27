import { DialogueScript } from '../types/game';

/**
 * Alur Cerita Solo Gema Musik Masa Lalu — Bang Ari (Stasiun Kereta Tua Senja):
 * "Tiket Kereta Pukul 21.40 & Lima Senar yang Menyelamatkan Penumpang"
 * Lokasi: Koper Gitar Terbuka Bang Ari di Peron Stasiun Senja (`[78.55, 0.1, 5.75]`)
 *
 * Menghubungkan malam 14 Oktober 2018 (Panggung Taman Kota) dengan hari ini: bagaimana
 * keberanian Damar meneruskan lagu dengan lima senar diam-diam menyelamatkan Bang Ari enam tahun lalu.
 */
export const BANG_ARI_DEEP_DIALOGUES: Record<string, DialogueScript> = {
  story_bang_ari_ticket_2018: {
    id: 'story_bang_ari_ticket_2018',
    startNodeId: 'sbat_1',
    nodes: {
      sbat_1: {
        id: 'sbat_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Di lantai peron Stasiun Kereta Tua Senja dekat kaki Bang Ari, terbuka sebuah koper gitar tua berlapis beludru merah kusam. Di sudut tutupnya—bukan untuk uang receh—terselip selembar karcis kereta laminasi dan sobekan selebaran kertas kuning tua.',
        onEnter: { playSfx: 'guitar' },
        nextNodeId: 'sbat_2',
      },
      sbat_2: {
        id: 'sbat_2',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Mataku terpaku membaca cetakan pudar di sobekan kertas kuning itu: "PANGGUNG AKUSTIK TAMAN KOTA · 14 OKTOBER 2018 — Penampil: Langkah Kecil." Itu... selebaran malam pertama Nadia menontonku!',
        nextNodeId: 'sbat_3',
      },
      sbat_3: {
        id: 'sbat_3',
        speaker: 'bang_ari',
        emotion: 'hangat',
        text: 'Bang Ari berhenti menyetem senar tiga gitarnya lalu tersenyum teduh. "Akhirnya Mas Damar ngeh juga sama kertas laminasi jimat saya itu. Dari dulu saya pengin cerita, tapi takut Mas Damar lagi buru-buru ke kantor."',
        nextNodeId: 'sbat_4',
      },
      sbat_4: {
        id: 'sbat_4',
        speaker: 'damar',
        emotion: 'ragu',
        text: 'Bang Ari... malem empat belas Oktober 2018 itu beneran ada di Taman Kota? Kok masih disimpan sampai dilaminasi segala?',
        nextNodeId: 'sbat_5',
      },
      sbat_5: {
        id: 'sbat_5',
        speaker: 'bang_ari',
        emotion: 'sedih',
        text: 'Sore tanggal empat belas Oktober itu adalah hari paling gelap di hidup saya, Mas. Pagi harinya kontrak pabrik saya diputus sepihak tanpa pesangon, padahal bapak saya di kampung baru masuk rumah sakit. Malamnya saya jalan kaki motong lewat Taman Kota mau naik kereta terakhir jam 21.40... kepala saya kosong, malu mau pulang tangan hampa.',
        nextNodeId: 'sbat_6',
      },
      sbat_6: {
        id: 'sbat_6',
        speaker: 'bang_ari',
        emotion: 'haru',
        text: 'Waktu saya lewat belakang rumput gelap, terdengar bunyi CTAK! kencang banget dari panggung kecil. Senar satu gitar vokalisnya putus di tengah lagu. Dalam hati saya mikir: "Tuh kan, hidup memang suka mutusin harapan orang di tengah jalan." Tapi vokalis itu nggak turun panggung, Mas... dia ketawa kecil ke arah barisan depan, terus nekat nyelesain lagunya pakai lima senar sampai habis!',
        onEnter: { playSfx: 'chime' },
        conditionalNext: [
          {
            requiredFlag: 'flashback_2018_done',
            nextNodeId: 'sbat_6_echo2018',
          },
          {
            requiredFlag: 'ch3_bima_night_talk_done',
            nextNodeId: 'sbat_6_echo_bima',
          },
        ],
        nextNodeId: 'sbat_7',
      },
      sbat_6_echo2018: {
        id: 'sbat_6_echo2018',
        speaker: 'damar_batin',
        emotion: 'haru',
        echoTag: 'Gema Memori · Barisan Depan & Rumput Gelap 2018',
        text: 'Bulu kudukku meremang. Malam itu aku hanya melihat tepuk tangan Nadia di barisan depan—aku sama sekali tidak tahu di batas rumput gelap paling belakang ada seorang pemuda yang sedang menahan hancurnya hidupnya sambil mendengarkan lima senarku.',
        nextNodeId: 'sbat_7',
      },
      sbat_6_echo_bima: {
        id: 'sbat_6_echo_bima',
        speaker: 'damar_batin',
        emotion: 'haru',
        echoTag: 'Gema Kopi Sudut · Lagu yang Tak Pernah Sia-Sia',
        text: 'Andai Bima mendengar ini sekarang... lagu-lagu sederhana kami dari kosan sempit tahun 2018 itu ternyata benar-benar menghidupkan seseorang.',
        nextNodeId: 'sbat_7',
      },
      sbat_7: {
        id: 'sbat_7',
        speaker: 'bang_ari',
        emotion: 'haru',
        text: 'Saya berdiri nangis diam-diam di bawah pohon taman malam itu, Mas Damar. Saya sadar: kalau lima senar aja masih bisa bikin lagu sehangat itu, berarti hidup saya yang lagi pincang ini juga masih layak dinyanyikan. Besoknya saya ambil gitar berdebu saya, dan sejak itu saya pilih nyanyi di peron kereta terakhir ini—biar orang-orang yang pulang dengan hati patah punya teman jalan pulang.',
        nextNodeId: 'sbat_8',
      },
      sbat_8: {
        id: 'sbat_8',
        speaker: 'bang_ari',
        emotion: 'hangat',
        text: 'Jadi Mas Damar... kalau hari ini hidup Mas lagi rasanya kayak putus satu senar gara-gara kerjaan atau lelah... jangan berhenti bernyanyi ya. Enam tahun lalu Mas menyelamatkan langkah pulang saya; malam ini biar saya yang mengingatkan langkah pulang Mas Damar.',
        choices: [
          {
            id: 'sbat_c_duet_platform',
            text: 'Duduk di tepi koper gitar Bang Ari dan ikut memetikkan akor pengiring "Langkah Kecil" di peron stasiun malam itu—lalu kabari Bima!',
            subtext: 'Menghidupkan kembali gema 2018 di peron kereta & membuka Pesan Suara Bang Ari di HP',
            nextNodeId: 'sbat_end_duet',
            effects: {
              kejujuranDiri: 4,
              kehadiranKeluarga: 2,
              setFlags: ['heard_bang_ari_2018_story', 'played_duet_with_bang_ari'],
              phoneMessage: {
                id: 'msg_bima_ari_2018',
                sender: 'Bima (Kopi Sudut)',
                preview: 'SERIUS LO MAR?! Bang Ari stasiun dulu ada di belakang rumput Taman Kota pas senar lo putus tahun 2018?! Merinding satu badan gue bacanya!!',
                timeLabel: 'Baru saja',
                threadId: 'bima',
              },
              journalEntry: {
                id: 'je_bang_ari_2018',
                title: 'Karcis Pukul 21.40 & Lima Senar yang Menyelamatkan',
                body: 'Di koper gitar Bang Ari tersimpan karcis kereta laminasi tanggal 14 Oktober 2018. Malam ketika senar satuku putus di Taman Kota ternyata menjadi malam yang menguatkannya untuk tetap pulang kepada keluarganya. Enam tahun kemudian, musik yang kukira remeh itu berbalik menyelamatkan hatiku sendiri.',
                chapter: 1,
              },
              toast: 'Duet peron bersama Bang Ari tercatat di Pesan Suara HP [H], Chat Bima & Jurnal!',
            },
          },
          {
            id: 'sbat_c_shake_hands',
            text: 'Jabat erat tangan Bang Ari dengan mata berkaca-kaca: "Terima kasih sudah menyimpan selebaran itu enam tahun, Bang. Malam ini abang yang menyelamatkan langkah pulang saya."',
            subtext: 'Menerima kembali kebaikan yang pernah ditanam enam tahun silam',
            nextNodeId: 'sbat_end_thanks',
            effects: {
              kejujuranDiri: 3,
              kehadiranKeluarga: 3,
              setFlags: ['heard_bang_ari_2018_story'],
              journalEntry: {
                id: 'je_bang_ari_2018',
                title: 'Gema dari Belakang Rumput Gelap (14 Okt 2018)',
                body: 'Bang Ari bercerita bagaimana lima senar gitarku yang tersisa di panggung Taman Kota tahun 2018 menguatkannya saat ia baru kehilangan pekerjaan. Tidak ada ketulusan yang pernah benar-benar hilang ditelan waktu.',
                chapter: 1,
              },
              toast: 'Kisah mengharukan Bang Ari tersimpan di Pesan Suara HP [H] & Jurnal!',
            },
          },
        ],
      },
      sbat_end_duet: {
        id: 'sbat_end_duet',
        speaker: 'narator',
        emotion: 'hangat',
        text: 'Dua gitar akustik bergema lembut di bawah atap baja tua Stasiun Senja, mengiringi langkah belasan penumpang kereta malam yang tersenyum hangat melewati peron.',
        onEnter: { playSfx: 'guitar' },
      },
      sbat_end_thanks: {
        id: 'sbat_end_thanks',
        speaker: 'bang_ari',
        emotion: 'ceria',
        text: 'Bang Ari memberi hormat kecil dengan dua jari di pelipisnya sambil memetik akor G mayor yang jernih. "Selamat pulang ke barisan depan Mas Damar di rumah ya!"',
        onEnter: { playSfx: 'guitar' },
      },
    },
  },
};
