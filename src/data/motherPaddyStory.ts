import { DialogueScript } from '../types/game';

/**
 * Cerita Sastra Mendalam di Lembah Sawah Senja & Teras Rumah:
 * "Ilmu Padi untuk Anakku Damar — Besek Gabah Pandanwangi Ibu (Oktober 2015)"
 * Menghubungkan Saung Bambu Lembah Sawah Senja, Tas Selempang [I], Pot Teras Rumah Kira,
 * Chat Nadia di HP [H], Refleksi Rooftop Bab 3, Jurnal, dan Rekap Ending.
 */
export const MOTHER_PADDY_DIALOGUES: Record<string, DialogueScript> = {
  story_saung_mother_paddy_2015: {
    id: 'story_saung_mother_paddy_2015',
    startNodeId: 'smp_1',
    flashback: {
      yearLabel: 'OKTOBER 2015 · LEMBAH SAWAH SENJA',
      title: 'Ilmu Padi di Ujung Jembatan Selatan',
      locationLabel: 'Saung Bambu Pematang · Seberang Jl. Melati',
      mood: 'warm_sepia',
      epigraph: '"Yang kosong mendongak menantang angin; yang berisi merunduk pulang ke tanah."',
    },
    nodes: {
      smp_1: {
        id: 'smp_1',
        speaker: 'narator',
        emotion: 'tenang',
        text: 'Di sudut bale-bale Saung Bambu, tepat di sebelah termos teh kaleng milik petani penggarap lembah, tersimpan sebuah besek anyaman bambu tua yang diikat pita kain perca biru—motif kain yang persis sama dengan daster rumahan mendiang Ibu.',
        onEnter: { playSfx: 'page' },
        nextNodeId: 'smp_2',
      },
      smp_2: {
        id: 'smp_2',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Tanganku bergetar pelan saat membuka tutup beseknya. Di dalamnya ada kantong belacu kecil berisi gabah kering yang masih beraroma pandan samar, bersama secarik kertas buku tulis bergaris yang dilaminasi plastik tipis agar tak dimakan lembap sawah.',
        nextNodeId: 'smp_3',
      },
      smp_3: {
        id: 'smp_3',
        speaker: 'narator',
        emotion: 'hangat',
        text: 'Di bagian luar plastik tertulis tangan Mbah Karto, penggarap sawah tepian sungai: "Titipan almarhumah Bu Ratna (Ibunda Nak Damar), Oktober 2015. Beliau sering duduk di saung ini tiap Minggu pagi kalau rindu sawah kampung."',
        onEnter: { playSfx: 'chime' },
        nextNodeId: 'smp_4',
      },
      smp_4: {
        id: 'smp_4',
        speaker: 'narator',
        emotion: 'haru',
        text: '"Anakku Damar... Kalau suatu hari langkahmu sampai ke saung seberang jembatan ini, berarti kamu sedang butuh tempat bernapas dari ramainya kota. Ibu sengaja titip segenggam benih Pandanwangi dari panen kampung kita di sini."',
        nextNodeId: 'smp_5',
      },
      smp_5: {
        id: 'smp_5',
        speaker: 'narator',
        emotion: 'tenang',
        text: '"Lihatlah petak padi di depan matamu, Nak. Batang padi yang bulirnya hampa selalu berdiri paling kaku dan mendongak tinggi—itulah sebabnya sekali dihantam angin kencang, batangnya patah. Sebaliknya, padi yang bulirnya penuh dan matang justru berani menunduk pelan ke arah tanah."',
        nextNodeId: 'smp_6',
      },
      smp_6: {
        id: 'smp_6',
        speaker: 'narator',
        emotion: 'hangat',
        text: '"Jangan malu kalau suatu hari kamu merasa lelah mengejar tinggi, Mar. Menunduk untuk memeluk istrimu, mendengar cerita anakmu, dan mengakui batas tenagamu bukanlah kalah—itu tandanya hidupmu sudah mulai berisi. — Ibumu, Minggu Pagi 2015."',
        nextNodeId: 'smp_7',
      },
      smp_7: {
        id: 'smp_7',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Air mataku jatuh tepat di atas plastik laminasi surat Ibu. Sepuluh tahun Ibu menitipkan pesan ini di seberang jembatan dekat rumah kami, seolah tahu suatu hari anaknya yang keras kepala akan lupa caranya menunduk dan beristirahat.',
        choices: [
          {
            id: 'smp_take_seed',
            text: 'Bawa sejumput benih Pandanwangi Ibu di Tas [I] untuk disemai bersama Kira & Nadia di pot teras rumah',
            subtext: 'Menyambung warisan akar Ibu ke halaman rumah Jl. Melati No. 14',
            nextNodeId: 'smp_end_seed',
            effects: {
              kejujuranDiri: 2,
              kehadiranKeluarga: 2,
              setFlags: ['found_mother_paddy_2015', 'kept_mother_rice_seed_2015'],
              phoneMessage: {
                id: 'msg_nadia_ilmu_padi',
                sender: 'Nadia',
                preview: 'Mas, beneran kamu nemu besek benih padi titipan almarhumah Ibu di saung seberang jembatan selatan?! Bawa pulang sedikit ya, kita semai bareng Kira di pot teras!',
                timeLabel: 'Baru saja',
                threadId: 'nadia',
              },
              journalEntry: {
                id: 'je_mother_paddy_2015',
                title: 'Ilmu Padi Ibu di Saung Seberang Jembatan (2015)',
                body: 'Di Saung Bambu Lembah Sawah Senja, aku menemukan besek gabah Pandanwangi dan surat Oktober 2015 dari almarhumah Ibu. Pesannya meruntuhkan keras kepalaku: batang padi yang berisi tidak pernah takut menunduk pulang ke arah tanah yang menghidupinya.',
                chapter: 1,
              },
              toast: 'Benih Padi Pandanwangi Ibu disimpan ke Tas [I]! Tanam bersama Kira di Pot Teras Rumah.',
            },
          },
          {
            id: 'smp_pray_quietly',
            text: 'Genggam kantong gabah Ibu di dada sambil memandang hamparan padi senja dalam doa hening',
            subtext: 'Meresapi nasihat almarhumah Ibu dengan tenang',
            nextNodeId: 'smp_end_quiet',
            effects: {
              kejujuranDiri: 3,
              kehadiranKeluarga: 1,
              setFlags: ['found_mother_paddy_2015', 'kept_mother_rice_seed_2015'],
              journalEntry: {
                id: 'je_mother_paddy_2015',
                title: 'Ilmu Padi Ibu di Saung Seberang Jembatan (2015)',
                body: 'Surat almarhumah Ibu dari tahun 2015 di Saung Sawah Senja mengingatkanku bahwa keberanian sejati bukan soal terus mendongak mengejar puncak, melainkan tahu kapan harus merunduk memeluk keluarga.',
                chapter: 1,
              },
              toast: 'Kenangan Ilmu Padi Ibu tersimpan di Jurnal & Tas Selempang [I].',
            },
          },
        ],
      },
      smp_end_seed: {
        id: 'smp_end_seed',
        speaker: 'damar_batin',
        emotion: 'hangat',
        text: 'Aku menyelipkan sedikit gabah emas beraroma pandan itu ke dalam saku tas selempangku, lalu menutup kembali besek Ibu dengan rapi. Di halaman rumah Jl. Melati nanti, benih dari tangan Ibu akan tumbuh dilihat mata cucunya.',
        onEnter: { playSfx: 'guitar' },
      },
      smp_end_quiet: {
        id: 'smp_end_quiet',
        speaker: 'damar_batin',
        emotion: 'tenang',
        text: 'Angin lembah membunyikan angklung bambu di pojok saung—lima nada lembut yang terdengar persis seperti tepukan tangan Ibu di punggungku waktu kecil.',
        onEnter: { playSfx: 'chime' },
      },
    },
  },

  story_plant_mother_paddy_with_kira: {
    id: 'story_plant_mother_paddy_with_kira',
    startNodeId: 'spmp_1',
    nodes: {
      spmp_1: {
        id: 'spmp_1',
        speaker: 'damar',
        emotion: 'hangat',
        text: 'Kira, Nadia... sini sebentar ke dekat rak pot teras. Ayah bawa beberapa butir gabah wangi titipan Nenek Ratna dari saung sawah seberang jembatan.',
        onEnter: { playSfx: 'interact' },
        nextNodeId: 'spmp_2',
      },
      spmp_2: {
        id: 'spmp_2',
        speaker: 'kira',
        emotion: 'ceria',
        text: 'Waaah!! Biji emas kecil-kecil ini wangi daun pandan, Bunda!! Kalau kita tanam di pot tanah basah, nanti tumbuh rumput padi hijau kayak di sawah ya, Ayah?!',
        nextNodeId: 'spmp_3',
      },
      spmp_3: {
        id: 'spmp_3',
        speaker: 'nadia',
        emotion: 'haru',
        text: 'Iya, Sayang... Dulu waktu Ibu masih ada, beliau pernah cerita pengin cucunya tahu dari mana nasi hangat di meja makan kita berasal. Sini, tangan kecil Kira yang buat lubangnya, tangan Ayah yang menabur benihnya.',
        nextNodeId: 'spmp_4',
      },
      spmp_4: {
        id: 'spmp_4',
        speaker: 'damar_batin',
        emotion: 'haru',
        text: 'Jari telunjuk Kira yang belepotan tanah basah menyentuh punggung tanganku saat kami menutup butir gabah Ibu pelan-pelan. Tiga generasi rasanya baru saja bertemu di dalam satu pot terakota kecil di teras rumah kami.',
        onEnter: { playSfx: 'chime' },
        onEnd: {
          kehadiranKeluarga: 3,
          kejujuranDiri: 2,
          setFlags: ['planted_mother_paddy_home'],
          journalEntry: {
            id: 'je_planted_mother_paddy',
            title: 'Tunas Pandanwangi Nenek di Teras Jl. Melati',
            body: 'Bersama Nadia dan Kira, aku menyemai butir gabah Pandanwangi peninggalan almarhumah Ibu di pot terakota halaman depan. Melihat tangan kecil Kira menepuk tanahnya pelan membuatku yakin: akar keluarga ini tidak akan pernah kering selama kami merawatnya bersama.',
            chapter: 1,
          },
          toast: 'Benih Pandanwangi Ibu tumbuh hijau di Pot Teras Rumah! (+Kehadiran Keluarga)',
        },
      },
    },
  },
};
