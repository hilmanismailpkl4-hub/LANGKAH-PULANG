import { DialogueScript } from '../types/game';

/**
 * Cerita Sastra Warga Kota — "Map Portofolio Kanvas Mas Dimas: Sketsa Ayah & Perahu Kertas di Jembatan (2024)"
 * Sebuah cermin tak terduga di Promenade Tepi Sungai: sketsa arang sembilan bulan lalu yang diam-diam
 * merekam langkah Damar yang terburu-buru di depan Kira.
 */
export const DIMAS_PORTFOLIO_DIALOGUES: Record<string, DialogueScript> = {
  story_dimas_unclaimed_sketch: {
    id: 'story_dimas_unclaimed_sketch',
    startNodeId: 'dps_1',
    nodes: {
      dps_1: {
        id: 'dps_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Di samping kuda-kuda lukis Mas Dimas di tepi Promenade Sungai, bersandar sebuah map portofolio kanvas cokelat bertali hitam dengan label kecil: “Sketsa Pejalan Sore — Koleksi Pribadi, Tidak Dijual.”',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'dps_2',
      },
      dps_2: {
        id: 'dps_2',
        speaker: 'narator',
        emotion: 'hangat',
        echoTag: 'Mas Dimas · Pelukis Promenade Sungai',
        text: 'Mas Dimas melirik sambil mengelap ujung kuasnya dengan kain perca. “Boleh dibuka kok, Mas. Itu kumpulan sketsa cepat orang-orang yang lewat Jembatan Sungai setahun terakhir... ada satu lembar paling depan yang nggak pernah tega saya lepas.”',
        nextNodeId: 'dps_3',
      },
      dps_3: {
        id: 'dps_3',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Kubuka lembar kertas cat air kasar paling atas—bertanggal sembilan bulan lalu. Seketika jantungku seperti berhenti berdetak.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'dps_4',
      },
      dps_4: {
        id: 'dps_4',
        speaker: 'narator',
        emotion: 'sedih',
        text: 'Di atas kertas itu tergambar punggung seorang pria berkemeja kerja dan tas selempang yang melangkah cepat menatap layar ponsel di tengah jembatan. Dua langkah di belakangnya, seorang gadis kecil berkardigan kuning mengangkat perahu kertas tinggi-tinggi—berusaha mengejar bayangan ayahnya.',
        nextNodeId: 'dps_5',
      },
      dps_5: {
        id: 'dps_5',
        speaker: 'damar',
        emotion: 'haru',
        text: 'Mas Dimas... sketsa ini... kemeja kerja abu-abu ini, dan anak perempuan yang pegang perahu kertas di belakangnya itu...',
        nextNodeId: 'dps_6',
      },
      dps_6: {
        id: 'dps_6',
        speaker: 'narator',
        emotion: 'haru',
        echoTag: 'Mas Dimas · Pelukis Promenade Sungai',
        text: 'Mas Dimas tertegun menatap wajah Damar dan tas selempang di bahunya, lalu suaranya merendah pelan. “Ya Allah... jadi Bapak yang sore itu jalan di jembatan sama adik kecil berkardigan kuning itu... Mas sendiri?”',
        nextNodeId: 'dps_7',
      },
      dps_7: {
        id: 'dps_7',
        speaker: 'narator',
        emotion: 'sedih',
        echoTag: 'Mas Dimas · Pelukis Promenade Sungai',
        text: '“Maafkan saya kalau lancang menggambar dari seberang sungai, Mas. Dulu saya juru gambar arsitektur di Jakarta. Enam tahun lalu almarhum Bapak saya kena serangan jantung di kampung waktu saya menolak pulang demi tender lembur. Sejak pindah ke Kota Senja, saya menggambar punggung orang-orang yang terburu-buru... supaya saya sendiri nggak pernah lupa rasanya kehilangan.”',
        nextNodeId: 'dps_8',
      },
      dps_8: {
        id: 'dps_8',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Sembilan bulan lalu aku bahkan tidak sadar Kira sedang mengangkat perahu kertas di belakang punggungku sore itu. Dari seberang sungai, seorang pelukis asing justru melihat apa yang kulewatkan dengan mataku sendiri.',
        choices: [
          {
            id: 'dps_c_accept',
            text: 'Terima lembar sketsa itu dengan rendah hati & minta Mas Dimas menambahkan satu garis tangan yang kini menggandeng Kira',
            subtext: 'Mengubah potret jarak menjadi pengingat untuk selalu menoleh ke belakang (+Kejujuran Diri, +Kehadiran Keluarga)',
            nextNodeId: 'dps_end_accept',
            effects: {
              kejujuranDiri: 3,
              kehadiranKeluarga: 2,
              setFlags: ['found_dimas_bridge_sketch', 'dimas_completed_bridge_portrait'],
              journalEntry: {
                id: 'je_dimas_bridge_sketch',
                title: 'Sketsa Sembilan Bulan Lalu di Map Mas Dimas',
                body: 'Di tepi sungai, Mas Dimas tanpa sengaja memperlihatkan sketsa sembilan bulan lalu yang merekam punggungku berjalan sibuk dengan ponsel sementara Kira mengangkat perahu kertas dua langkah di belakangku. Hari ini Mas Dimas menambahkan goresan pensil baru: tanganku yang berbalik menggenggam tangan kecil itu.',
                chapter: 1,
              },
              phoneMessage: {
                id: 'notif_dimas_sketch',
                sender: 'Nadia ❤️',
                preview: 'Mas, kamu lagi berhenti agak lama di dekat pelukis tepi sungai ya? Lagi lihat lukisan apa?',
                timeLabel: 'Baru saja',
                threadId: 'nadia',
              },
              toast: 'Mas Dimas menghadiahkan sketsa yang telah diperbarui — pengingat seumur hidup untuk tidak berjalan mendahului Kira.',
            },
          },
          {
            id: 'dps_c_thank',
            text: 'Genggam bahu Mas Dimas penuh terima kasih & doakan almarhum ayahnya tenang melihat karya-karyanya hari ini',
            subtext: 'Berbagi empati sesama anak laki-laki yang belajar dari penyesalan (+Kejujuran Diri)',
            nextNodeId: 'dps_end_thank',
            effects: {
              kejujuranDiri: 2,
              kehadiranKeluarga: 1,
              setFlags: ['found_dimas_bridge_sketch'],
              journalEntry: {
                id: 'je_dimas_bridge_sketch',
                title: 'Sketsa Sembilan Bulan Lalu di Map Mas Dimas',
                body: 'Sketsa arang Mas Dimas dari sembilan bulan lalu menjadi cermin paling jujur hari ini: betapa seringnya aku berjalan dua langkah terlalu cepat di depan anakku sendiri.',
                chapter: 1,
              },
              phoneMessage: {
                id: 'notif_dimas_sketch',
                sender: 'Nadia ❤️',
                preview: 'Mas, kamu lagi berhenti agak lama di dekat pelukis tepi sungai ya? Lagi lihat lukisan apa?',
                timeLabel: 'Baru saja',
                threadId: 'nadia',
              },
              toast: 'Cerita Mas Dimas tersimpan di Catatan Perjalanan [J]!',
            },
          },
        ],
      },
      dps_end_accept: {
        id: 'dps_end_accept',
        speaker: 'narator',
        emotion: 'hangat',
        echoTag: 'Mas Dimas · Pelukis Promenade Sungai',
        text: 'Dengan pensil arang lunak, Mas Dimas menarik beberapa garis hangat di tepi kanan kertas—mengubah lengan Damar yang semula memegang ponsel menjadi menoleh dan merengkuh bahu kecil gadis itu. “Bawa pulang ya, Mas. Sekarang gambarnya sudah selesai.”',
        onEnter: { playSfx: 'chime' },
      },
      dps_end_thank: {
        id: 'dps_end_thank',
        speaker: 'narator',
        emotion: 'hangat',
        echoTag: 'Mas Dimas · Pelukis Promenade Sungai',
        text: 'Mata Mas Dimas berkaca-kaca lalu tersenyum lega. “Terima kasih doanya, Mas Damar. Pulang nanti gandeng erat tangan si kecil ya—jangan biarkan dia jalan di belakang lagi.”',
        onEnter: { playSfx: 'chime' },
      },
    },
  },
};
