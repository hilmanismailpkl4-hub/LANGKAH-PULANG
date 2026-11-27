import { DialogueScript } from '../types/game';

/**
 * Cerita Sastra Dapur & Halaman Belakang Rumah Jl. Melati No. 14:
 * "Buku Resep Tulis Tangan Bernoda Kunyit — Dua Perempuan yang Menjaga Dapur Damar (2015–2024)"
 * Menghubungkan meja dapur, bedeng bumbu halaman belakang Nadia, tas selempang, HP, jurnal, & klimaks Bab 3.
 */
export const TURMERIC_RECIPE_DIALOGUES: Record<string, DialogueScript> = {
  story_kitchen_turmeric_notebook: {
    id: 'story_kitchen_turmeric_notebook',
    startNodeId: 'trn_1',
    nodes: {
      trn_1: {
        id: 'trn_1',
        speaker: 'damar_batin',
        emotion: 'tenang',
        text: 'Di sudut meja dapur dekat rak piring, terselip sebuah buku tulis spiral bersampul plastik bening. Sudut kanannya menguning samar oleh noda kunyit lama dan uap masakan bertahun-tahun.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'trn_2',
      },
      trn_2: {
        id: 'trn_2',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Begitu kubuka halaman pertamanya, napasku langsung tercekat. Separuh awal buku ini ditulis dengan pulpen biru tegak bersambung milik almarhumah Ibu tahun 2015: "Takaran Dapur Kesukaan Damar kalau Masuk Angin atau Begadang".',
        nextNodeId: 'trn_3',
      },
      trn_3: {
        id: 'trn_3',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Di halaman tengah, tulisan Ibu berhenti—digantikan tulisan tangan rapi milik Nadia mulai bulan November 2019, seminggu setelah kami pindah ke Jl. Melati No. 14.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'trn_4',
      },
      trn_4: {
        id: 'trn_4',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Di pinggir resep Wedang Serai Pandan & Nasi Goreng Kampung Kemangi, Nadia menulis catatan kecil pakai pensil: "Percobaan ke-2: Mas Damar senyum waktu cium wangi kemanginya, katanya mirip masakan Ibu. Besok aku buat bedeng kayu di halaman belakang dapur—tanam pandan, serai, sama kemangi sendiri biar nggak pernah kehabisan kalau Mas Damar pulang kecapekan."',
        nextNodeId: 'trn_5',
      },
      trn_5: {
        id: 'trn_5',
        speaker: 'damar_batin',
        emotion: 'sedih',
        text: 'Mataku turun ke baris paling bawah yang bertanggal tiga minggu lalu: "23.40 WIB — Mas Damar pulang langsung ketiduran di sofa pakai kemeja kerja. Wedang serai pandannya kutaruh di termos kecil dekat meja makan biar subuh masih hangat."',
        nextNodeId: 'trn_6',
      },
      trn_6: {
        id: 'trn_6',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Dadaku menghangat sekaligus perih. Selama lima tahun aku mengira bedeng tanaman di belakang rumah hanyalah hobi berkebun Nadia—ternyata setiap helai serai, pandan, dan kemangi di sana ditanam agar aku tidak pernah merasa kehilangan rasa rumah Ibu.',
        choices: [
          {
            id: 'trn_ch_write_note',
            text: 'Tulis janji terima kasih di bawah catatan Nadia & simpan kartu takaran Ibu di tas',
            nextNodeId: 'trn_end_note',
            effects: {
              kejujuranDiri: 2,
              kehadiranKeluarga: 2,
              setFlags: ['read_turmeric_recipe_book', 'kept_turmeric_recipe_card'],
              journalEntry: {
                id: 'je_turmeric_recipe_book',
                title: 'Buku Resep Bernoda Kunyit: Dua Dapur yang Menjagaku',
                body: 'Di meja dapur rumah, aku menemukan buku resep spiral tempat tulisan tangan almarhumah Ibu tahun 2015 bersambung dengan catatan pensil Nadia sejak 2019. Ternyata seluruh rumpun pandan, serai, dan kemangi di halaman belakang ditanam Nadia supaya aku selalu punya rasa hangat untuk dipulangi.',
                chapter: 1,
              },
              phoneMessage: {
                id: 'pm_nadia_turmeric_recipe',
                sender: 'Nadia ❤️',
                preview: 'Mas... kamu abis buka buku resep plastik di sudut meja dapur ya? 🥺🌿',
                timeLabel: 'Baru saja',
                threadId: 'nadia',
              },
            },
          },
          {
            id: 'trn_ch_cook_tonight',
            text: 'Simpan kartu resepnya & bertekad gantian menyeduh wedang serai pandan untuk Nadia',
            nextNodeId: 'trn_end_cook',
            effects: {
              kehadiranKeluarga: 3,
              kejujuranDiri: 1,
              setFlags: ['read_turmeric_recipe_book', 'kept_turmeric_recipe_card'],
              journalEntry: {
                id: 'je_turmeric_recipe_book',
                title: 'Buku Resep Bernoda Kunyit: Dua Dapur yang Menjagaku',
                body: 'Lima tahun Nadia mempelajari takaran dapur almarhumah Ibu diam-diam dan menanam bumbunya sendiri di belakang rumah. Hari ini giliranku menyalakan kompor untuk menghangatkan hatinya.',
                chapter: 1,
              },
              phoneMessage: {
                id: 'pm_nadia_turmeric_recipe',
                sender: 'Nadia ❤️',
                preview: 'Mas... kamu abis buka buku resep plastik di sudut meja dapur ya? 🥺🌿',
                timeLabel: 'Baru saja',
                threadId: 'nadia',
              },
            },
          },
        ],
      },
      trn_end_note: {
        id: 'trn_end_note',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Dengan bolpoin di dekat radio dapur, kutulis satu baris pelan di bawah catatan Nadia: "Mulai malam ini tidak perlu ditaruh di termos sendirian lagi, Nad. Kita minum selagi hangat berdua." Kartu pembatas resep Ibu kuselipkan rapi ke tas selempangku.',
        onEnter: { playSfx: 'chime' },
      },
      trn_end_cook: {
        id: 'trn_end_cook',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Kuselipkan kartu pembatas takaran Ibu ke tas selempangku sambil menatap kompor dapur. Sekarang dua resep warisan Ibu & kebun belakang Nadia sudah bisa langsung kumasak kapan saja di dapur rumah!',
        onEnter: { playSfx: 'chime' },
      },
    },
  },

  story_share_recipe_book_nadia: {
    id: 'story_share_recipe_book_nadia',
    startNodeId: 'srn_1',
    nodes: {
      srn_1: {
        id: 'srn_1',
        speaker: 'damar',
        emotion: 'haru',
        text: 'Nad... aku baru baca buku resep spiral bersampul plastik di sudut dapur tadi. Jadi selama lima tahun ini kamu menanam pandan, serai, sama kemangi di halaman belakang cuma demi nyamain masakan almarhumah Ibu buatku?',
        nextNodeId: 'srn_2',
      },
      srn_2: {
        id: 'srn_2',
        speaker: 'nadia',
        emotion: 'haru',
        text: 'Eh... ya ampun Mas, pipiku langsung panas banget ketahuan! Dulu waktu awal kita nikah, setiap kamu kecapekan kerja, kamu suka nggak sadar bergumam kangen bau wedang serai sama nasi goreng kemangi Ibumu.',
        nextNodeId: 'srn_3',
      },
      srn_3: {
        id: 'srn_3',
        speaker: 'nadia',
        emotion: 'hangat',
        text: 'Aku sampai telepon Bude kamu di kampung buat nanya rahasia geprek serainya, terus kubikin bedeng kayu kecil di belakang dapur. Aku cuma pengin... biarpun Ibu udah nggak ada, kamu tetap punya tempat pulang yang rasanya persis kayak dipeluk Ibu.',
        nextNodeId: 'srn_4',
      },
      srn_4: {
        id: 'srn_4',
        speaker: 'damar',
        emotion: 'haru',
        text: 'Terima kasih banyak ya, Nad... Maafin aku tiga minggu lalu ketiduran di sofa sampai wedang buatanmu dingin di termos. Mulai hari ini, gantian aku yang petik serai di belakang dan nyeduh buat kamu.',
        onEnter: {
          playSfx: 'chime',
          kehadiranKeluarga: 2,
          kejujuranDiri: 2,
          setFlags: ['shared_recipe_book_with_nadia'],
        },
        nextNodeId: 'srn_5',
      },
      srn_5: {
        id: 'srn_5',
        speaker: 'nadia',
        emotion: 'ceria',
        text: 'Hehe, janji ya Mas! Tuh kompor dapur sama kebun belakang selalu siap kalau Koki Damar mau beraksi buat aku sama Kira!',
      },
    },
  },
};
